import { useState } from "react";
import { Eye, EyeOff, Loader2, Lock, Mail, TriangleAlert } from "lucide-react";
import { login } from "@/lib/api";
import { cn } from "@/lib/utils";

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
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, hsl(232 74% 52%), hsl(248 70% 56%))" }}
    >
      <div className="w-full max-w-[26rem]">
        {/* Marca */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Zarya</h1>
          <p className="mt-1 text-sm text-white/70">Inteligência de carteira</p>
        </div>

        {/* Cartão */}
        <div className="card fade-up rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold tracking-tight">Acessar painel</h2>
          <p className="mt-1 text-sm text-muted-foreground">Entre com suas credenciais para continuar.</p>

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-loss/30 bg-loss/8 px-3 py-2.5 text-sm text-loss">
              <TriangleAlert className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={submit} className="mt-5 space-y-4">
            <label className="block">
              <span className="text-[0.8rem] font-semibold text-ink">E-mail</span>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="zarya@atlantyx.com.br"
                  className="h-11 w-full rounded-lg border border-border-strong bg-panel pl-9 pr-3 text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30"
                  required
                />
              </div>
            </label>

            <label className="block">
              <span className="text-[0.8rem] font-semibold text-ink">Senha</span>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 w-full rounded-lg border border-border-strong bg-panel pl-9 pr-10 text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-[hsl(220_24%_95%)] hover:text-ink"
                  title={showPass ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-sm transition-all hover:opacity-95 disabled:opacity-60",
              )}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? "Entrando…" : "Entrar"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-white/60">© {new Date().getFullYear()} Zarya · Atlantyx</p>
      </div>
    </div>
  );
}
