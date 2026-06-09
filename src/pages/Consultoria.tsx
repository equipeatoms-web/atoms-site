import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Loader2, Zap, Check } from 'lucide-react';

const DEFAULT_PASSWORD = '12345678';

// ─── Login screen ─────────────────────────────────────────────────────────────

function ConsultoriaLogin() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [mode, setMode]         = useState<'login' | 'signup' | 'done'>('login');
  const [signupEmail, setSignupEmail] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      if (err.message.includes('Invalid login credentials')) {
        setError('Email ou senha incorretos. Se você preencheu o formulário, sua senha padrão é 12345678.');
      } else {
        setError(err.message);
      }
    }
    setLoading(false);
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await supabase.auth.signUp({
      email: signupEmail,
      password: DEFAULT_PASSWORD,
      options: {
        data: { role: 'client' },
      },
    });
    if (err) {
      setError(err.message);
    } else {
      setMode('done');
    }
    setLoading(false);
  }

  const logoMark = (
    <div className="flex items-center gap-2.5 mb-10 justify-center">
      <div className="w-8 h-8 rounded-sm bg-primary/10 flex items-center justify-center">
        <Zap className="w-4 h-4 text-primary" />
      </div>
      <span className="font-semibold text-sm text-foreground">ATom's</span>
      <span className="text-muted-foreground/40 text-sm">/</span>
      <span className="text-sm text-muted-foreground">Consultoria</span>
    </div>
  );

  if (mode === 'done') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          {logoMark}
          <div className="rounded-sm border border-emerald-500/30 bg-emerald-500/5 p-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Conta criada.</h2>
            <p className="text-sm text-muted-foreground">
              Sua conta foi criada com a senha padrão <span className="text-foreground font-mono">12345678</span>.
              {' '}Confirme seu e-mail e depois faça login.
            </p>
            <Button
              className="w-full h-10 rounded-sm text-sm"
              onClick={() => { setMode('login'); setEmail(signupEmail); setPassword(DEFAULT_PASSWORD); }}
            >
              Ir para o login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'signup') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          {logoMark}
          <div className="rounded-sm border border-border bg-card/50 p-8 space-y-6">
            <div>
              <h1 className="text-lg font-semibold text-foreground">Criar acesso</h1>
              <p className="text-xs text-muted-foreground mt-1">
                Informe seu e-mail para criar sua conta. A senha inicial será <span className="text-foreground font-mono">12345678</span>.
              </p>
            </div>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">E-mail</label>
                <input
                  type="email"
                  value={signupEmail}
                  onChange={e => setSignupEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full h-10 bg-background border border-border rounded-sm px-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary transition-colors"
                  placeholder="seu@email.com"
                />
              </div>
              {error && (
                <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-sm px-3 py-2">{error}</p>
              )}
              <Button type="submit" disabled={loading} className="w-full h-10 rounded-sm text-sm font-medium">
                {loading ? <><Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />Criando...</> : 'Criar conta'}
              </Button>
              <button type="button" onClick={() => setMode('login')} className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors">
                Já tenho acesso — entrar
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {logoMark}

        <div className="rounded-sm border border-border bg-card/50 p-8 space-y-6">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Acesse seu diagnóstico</h1>
            <p className="text-xs text-muted-foreground mt-1">
              Use o e-mail que você cadastrou no formulário. Senha padrão: <span className="font-mono text-foreground">12345678</span>.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full h-10 bg-background border border-border rounded-sm px-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary transition-colors"
                placeholder="seu@email.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Senha</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full h-10 bg-background border border-border rounded-sm px-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-sm px-3 py-2">{error}</p>
            )}

            <Button type="submit" disabled={loading} className="w-full h-10 rounded-sm text-sm font-medium">
              {loading ? <><Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />Entrando...</> : 'Entrar'}
            </Button>

            <button type="button" onClick={() => setMode('signup')} className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors pt-1">
              Primeiro acesso — criar conta
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] text-muted-foreground/40 mt-6">
          ATom's · Consultoria Estratégica
        </p>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Consultoria() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in: show login form
  if (!user) return <ConsultoriaLogin />;

  // Logged in but admin goes to /admin — consultoria is for clients only
  // (admin can still access it directly if needed)
  return <Navigate to="/consultoria/sessao" replace />;
}
