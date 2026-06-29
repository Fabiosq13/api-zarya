import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  ArrowUp,
  BarChart3,
  CalendarRange,
  Layers,
  RefreshCw,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { sendChat } from "@/lib/api";
import type { ChatContext, ChatData } from "@/types";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolUsed?: boolean;
  error?: boolean;
}

interface Props {
  context: ChatContext;
  onData: (data: ChatData) => void;
}

const SUGGESTIONS = [
  { icon: Layers, label: "Resuma esta carteira", text: "Resuma a carteira selecionada com os principais números." },
  { icon: BarChart3, label: "Maior concentração", text: "Qual a maior concentração por classe?" },
  { icon: CalendarRange, label: "Próximos vencimentos", text: "Tem algum vencimento próximo?" },
  { icon: RefreshCw, label: "Comparar com 05/06/2025", text: "Traga os dados de 2025-06-05 desta carteira." },
];

function uid() {
  return Math.random().toString(36).slice(2);
}

export function ChatPanel({ context, onData }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const conversationId = useRef<string | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  function autosize() {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 132)}px`;
  }

  async function submit(text: string) {
    const content = text.trim();
    if (!content || loading) return;

    setMessages((m) => [...m, { id: uid(), role: "user", content }]);
    setInput("");
    requestAnimationFrame(autosize);
    setLoading(true);

    try {
      const res = await sendChat({
        conversationId: conversationId.current,
        message: content,
        context,
      });
      conversationId.current = res.meta.conversationId;
      setMessages((m) => [
        ...m,
        {
          id: uid(),
          role: "assistant",
          content: res.answer,
          toolUsed: res.toolUsed,
        },
      ]);
      if (res.data) onData(res.data);
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          id: uid(),
          role: "assistant",
          content:
            e instanceof Error
              ? e.message
              : "Não consegui responder agora. Tente novamente.",
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setMessages([]);
    conversationId.current = undefined;
  }

  return (
    <Card className="flex h-full max-h-[calc(100vh-2.5rem)] flex-col overflow-hidden">
      {/* Header */}
      <div className="relative flex items-center justify-between overflow-hidden border-b border-white/[0.06] px-5 py-4">
        <div className="pointer-events-none absolute -left-10 -top-16 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <div className="relative grid h-10 w-10 place-items-center rounded-2xl aurora-bg shadow-lg">
            <Sparkles className="h-5 w-5 text-white" strokeWidth={2.2} />
            <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-gain ring-2 ring-card animate-pulse-glow" />
          </div>
          <div>
            <p className="font-sans text-sm font-semibold tracking-tight">
              Copiloto Zarya
            </p>
            <p className="font-mono text-[0.66rem] text-muted-foreground">
              Gemini · análise de carteira
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={reset}
            className="ring-focus relative flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
            title="Nova conversa"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-4 px-2 text-center">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-primary/25 to-aurora-3/15"
            >
              <Sparkles className="h-8 w-8 text-primary" />
            </motion.div>
            <div>
              <p className="font-sans font-semibold">Converse com seus dados</p>
              <p className="mx-auto mt-1.5 max-w-[17rem] text-sm leading-relaxed text-muted-foreground">
                Pergunte sobre a carteira selecionada. O copiloto pode trocar a
                data, mudar a carteira e atualizar os gráficos do painel.
              </p>
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex",
                m.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={cn(
                  "max-w-[86%] rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                  m.role === "user"
                    ? "rounded-br-md aurora-bg font-medium text-white"
                    : m.error
                      ? "rounded-bl-md border border-loss/30 bg-loss/10 text-loss"
                      : "rounded-bl-md border border-white/[0.06] bg-white/[0.04] text-foreground",
                )}
              >
                {m.error && (
                  <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold">
                    <TriangleAlert className="h-3.5 w-3.5" /> Algo deu errado
                  </div>
                )}
                <div className="prose-chat">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
                {m.toolUsed && (
                  <Badge variant="success" className="mt-2">
                    <RefreshCw className="h-3 w-3" /> Painel atualizado
                  </Badge>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-white/[0.06] bg-white/[0.04] px-4 py-3">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-2 w-2 rounded-full bg-primary"
                  animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Suggestion cards */}
      {messages.length === 0 && (
        <div className="grid grid-cols-2 gap-2 px-5 pb-3">
          {SUGGESTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.label}
                onClick={() => submit(s.text)}
                className="ring-focus flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2.5 text-left text-xs text-muted-foreground transition-all hover:border-primary/40 hover:bg-white/[0.05] hover:text-foreground"
              >
                <Icon className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span className="truncate">{s.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(input);
        }}
        className="border-t border-white/[0.06] p-3"
      >
        <div className="flex items-end gap-2 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-1.5 transition-colors focus-within:border-primary/40">
          <textarea
            ref={taRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              autosize();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit(input);
              }
            }}
            rows={1}
            placeholder="Pergunte sobre a carteira…"
            className="max-h-32 flex-1 resize-none bg-transparent px-2.5 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl aurora-bg text-white transition-all hover:opacity-90 disabled:opacity-30 active:scale-95"
          >
            <ArrowUp className="h-4.5 w-4.5" />
          </button>
        </div>
      </form>
    </Card>
  );
}
