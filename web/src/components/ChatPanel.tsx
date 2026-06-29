import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { ArrowUp, BarChart3, CalendarRange, Layers, RefreshCw, Sparkles, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { sendChat } from "@/lib/api";
import type { ChatContext, ChatData } from "@/types";

interface Message { id: string; role: "user" | "assistant"; content: string; toolUsed?: boolean; error?: boolean; }
interface Props { context: ChatContext; onData: (data: ChatData) => void; }

const SUGGESTIONS = [
  { icon: Layers, label: "Resumir carteira", text: "Resuma a carteira selecionada com os principais números." },
  { icon: BarChart3, label: "Maior concentração", text: "Qual a maior concentração por classe?" },
  { icon: CalendarRange, label: "Vencimentos", text: "Tem algum vencimento próximo?" },
  { icon: RefreshCw, label: "Outra data", text: "Traga os dados de 2025-06-05 desta carteira." },
];
const uid = () => Math.random().toString(36).slice(2);

export function ChatPanel({ context, onData }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const conversationId = useRef<string | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  function autosize() {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  }

  async function submit(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    setMessages((m) => [...m, { id: uid(), role: "user", content }]);
    setInput("");
    requestAnimationFrame(autosize);
    setLoading(true);
    try {
      const res = await sendChat({ conversationId: conversationId.current, message: content, context });
      conversationId.current = res.meta.conversationId;
      setMessages((m) => [...m, { id: uid(), role: "assistant", content: res.answer, toolUsed: res.toolUsed }]);
      if (res.data) onData(res.data);
    } catch (e) {
      setMessages((m) => [...m, { id: uid(), role: "assistant", content: e instanceof Error ? e.message : "Não consegui responder agora.", error: true }]);
    } finally {
      setLoading(false);
    }
  }

  function reset() { setMessages([]); conversationId.current = undefined; }

  return (
    <div className="card flex h-full flex-col overflow-hidden rounded-[var(--radius)]">
      <div className="flex items-center justify-between border-b border-border bg-[hsl(220_40%_99%)] px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className="grid h-10 w-10 place-items-center rounded-full text-white shadow-sm ring-1 ring-black/5"
              style={{ background: "linear-gradient(135deg, hsl(230 78% 60%), hsl(255 70% 62%))" }}
            >
              <Sparkles className="h-5 w-5" strokeWidth={2.2} />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-panel bg-gain" />
          </div>
          <div>
            <p className="text-[0.92rem] font-bold tracking-tight">Copiloto Zarya</p>
            <p className="flex items-center gap-1.5 text-[0.68rem] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-gain" />
              Online · análise via Gemini
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <button onClick={reset} title="Nova conversa"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-[hsl(220_24%_95%)] hover:text-ink">
            <RefreshCw className="h-4 w-4" />
          </button>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3.5 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-2 text-center">
            <div className="pop-in grid h-14 w-14 place-items-center rounded-2xl bg-primary/10">
              <Sparkles className="h-7 w-7 text-primary" />
            </div>
            <div>
              <p className="font-bold">Converse com seus dados</p>
              <p className="mx-auto mt-1 max-w-[16rem] text-sm leading-relaxed text-muted-foreground">
                Pergunte sobre a carteira. O copiloto pode trocar a data, a carteira e atualizar os gráficos.
              </p>
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={cn("fade-up flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <div className={cn(
              "max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm",
              m.role === "user"
                ? "rounded-br-sm bg-primary font-medium text-primary-foreground"
                : m.error
                  ? "rounded-bl-sm border border-loss/25 bg-loss/8 text-loss"
                  : "rounded-bl-sm border border-border bg-[hsl(220_24%_97%)] text-ink",
            )}>
              {m.error && (
                <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold">
                  <TriangleAlert className="h-3.5 w-3.5" /> Algo deu errado
                </div>
              )}
              <div className="prose-chat">
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>
              {m.toolUsed && (
                <Badge variant="success" className="mt-2"><RefreshCw className="h-3 w-3" /> Painel atualizado</Badge>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-border bg-[hsl(220_24%_97%)] px-4 py-3">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-2 w-2 rounded-full bg-primary" style={{ animation: `blink 1s ${i * 0.15}s infinite ease-in-out` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {messages.length === 0 && (
        <div className="grid grid-cols-2 gap-2 px-4 pb-3">
          {SUGGESTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <button key={s.label} onClick={() => submit(s.text)}
                className="flex items-center gap-2 rounded-lg border border-border bg-panel px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-ink">
                <Icon className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span className="truncate">{s.label}</span>
              </button>
            );
          })}
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); submit(input); }} className="border-t border-border p-3">
        <div className="flex items-end gap-2 rounded-xl border border-border-strong bg-panel p-1.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/30">
          <textarea
            ref={taRef}
            value={input}
            onChange={(e) => { setInput(e.target.value); autosize(); }}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(input); } }}
            rows={1}
            placeholder="Pergunte sobre a carteira…"
            className="max-h-28 flex-1 resize-none bg-transparent px-2.5 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button type="submit" disabled={!input.trim() || loading}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-30">
            <ArrowUp className="h-4.5 w-4.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
