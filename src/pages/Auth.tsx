import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, Navigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Eye, EyeOff, Zap } from 'lucide-react';

const QUICK_LOGIN = {
  email: 'daniel.ara.alves@gmail.com',
  password: '712471',
};

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, user } = useAuth();
  const { toast } = useToast();

  if (user) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (error: any) {
      toast({
        title: 'Credenciais inválidas',
        description: 'Verifique seu e-mail e senha.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = () => {
    setEmail(QUICK_LOGIN.email);
    setPassword(QUICK_LOGIN.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="w-full max-w-sm relative">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar ao site
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center shadow-glow">
              <span className="text-primary-foreground font-bold text-sm tracking-tight">A</span>
            </div>
            <div>
              <span className="text-base font-bold text-foreground tracking-tight">ATom's</span>
              <span className="ml-2 text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Admin</span>
            </div>
          </div>
          <h1 className="text-2xl font-serif text-foreground mb-1">Bem-vindo de volta</h1>
          <p className="text-sm text-muted-foreground">Acesse seu painel de controle.</p>
        </div>

        {/* Quick access hint */}
        <button
          type="button"
          onClick={handleQuickLogin}
          className="w-full mb-5 flex items-center gap-2.5 px-4 py-2.5 rounded-sm border border-border/60 bg-card/40 hover:bg-card/80 hover:border-primary/30 transition-all text-left group"
        >
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Zap className="w-3 h-3 text-primary" />
          </div>
          <div>
            <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">Acesso rápido</p>
            <p className="text-[10px] text-muted-foreground">{QUICK_LOGIN.email}</p>
          </div>
          <span className="ml-auto text-[10px] text-muted-foreground/60 group-hover:text-primary/60 transition-colors">
            Preencher →
          </span>
        </button>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs text-muted-foreground">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              autoComplete="email"
              className="h-11 rounded-sm bg-card/40 border-border focus:border-primary focus:ring-primary/20"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs text-muted-foreground">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="h-11 rounded-sm bg-card/40 border-border focus:border-primary focus:ring-primary/20 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 rounded-sm mt-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium tracking-wide shadow-glow btn-glow"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Entrando...
              </span>
            ) : 'Entrar no Painel'}
          </Button>
        </form>

        <p className="text-center text-[11px] text-muted-foreground/50 mt-8">
          Área restrita · ATom's &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default Auth;
