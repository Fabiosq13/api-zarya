import { useState } from "react";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, TriangleAlert } from "lucide-react";
import { login } from "@/lib/api";

const BRAND = "#3942DF";

export function LoginPage({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível entrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-[hsl(228_40%_98%)] lg:grid lg:grid-cols-[1.05fr_1fr]">
      {/* Lado esquerdo: cor sólida + 2 círculos nas extremidades (sem texto, sem gradiente) */}
      <aside className="relative hidden overflow-hidden lg:block" style={{ background: BRAND }}>
        <div className="pointer-events-none absolute -left-16 -top-16 h-72 w-72 rounded-full bg-white/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-16 h-80 w-80 rounded-full bg-white/20 blur-2xl" />
      </aside>

      {/* Lado direito: marca no topo, formulário ao centro, copyright no rodapé */}
      <main className="flex min-h-screen flex-col px-6 py-10 sm:px-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="fade-up w-full max-w-[24rem]">
            <h1 className="text-center text-4xl font-extrabold tracking-tight" style={{ color: BRAND }}>
              Zarya
            </h1>

            {error && (
              <div className="mt-7 flex items-center gap-2 rounded-xl border border-loss/30 bg-loss/8 px-3.5 py-3 text-sm text-loss">
                <TriangleAlert className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={submit} className="mt-8 space-y-4">
              <label className="block">
                <span className="text-[0.8rem] font-semibold text-ink">E-mail</span>
                <div className="group relative mt-1.5">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-[color:var(--brand)]" />
                  <input
                    type="email"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="zarya@atlantyx.com.br"
                    className="h-12 w-full rounded-xl border border-border-strong bg-panel pl-10 pr-3 text-sm text-ink shadow-sm outline-none transition-all focus:border-[color:var(--brand)] focus:ring-4 focus:ring-[color:var(--brand)]/15"
                    style={{ ["--brand" as string]: BRAND }}
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-[0.8rem] font-semibold text-ink">Senha</span>
                <div className="group relative mt-1.5">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-[color:var(--brand)]" />
                  <input
                    type={showPass ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-12 w-full rounded-xl border border-border-strong bg-panel pl-10 pr-11 text-sm text-ink shadow-sm outline-none transition-all focus:border-[color:var(--brand)] focus:ring-4 focus:ring-[color:var(--brand)]/15"
                    style={{ ["--brand" as string]: BRAND }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-[hsl(220_24%_95%)] hover:text-ink"
                    title={showPass ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold text-white shadow-md transition-all hover:opacity-95 disabled:opacity-60"
                style={{ background: BRAND }}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Entrando…
                  </>
                ) : (
                  <>
                    Entrar
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Zarya · Atlantyx · Todos os direitos reservados
        </p>
      </main>
    </div>
  );
}
