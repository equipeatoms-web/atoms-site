import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { ConsultoriaLayout } from '@/components/ConsultoriaLayout';
import { Loader2 } from 'lucide-react';

// ─── Ensure session exists for this user ─────────────────────────────────────

function useConsultoriaSession(userId: string) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [ready, setReady]         = useState(false);

  useEffect(() => {
    async function init() {
      // Find latest active session or create one
      const { data: existing } = await supabase
        .from('consultoria_sessions')
        .select('id')
        .eq('client_id', userId)
        .eq('status', 'active')
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existing) {
        setSessionId(existing.id);
        setReady(true);
        return;
      }

      const { data: created, error } = await supabase
        .from('consultoria_sessions')
        .insert({ client_id: userId, status: 'active' })
        .select('id')
        .single();

      if (error) {
        console.error('[SESSION]', error.message);
      } else {
        setSessionId(created.id);
      }
      setReady(true);
    }

    init();
  }, [userId]);

  return { sessionId, ready };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ConsultoriaSessao() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/consultoria" replace />;

  return <ConsultoriaSessaoInner userId={user.id} />;
}

function ConsultoriaSessaoInner({ userId }: { userId: string }) {
  const { sessionId, ready } = useConsultoriaSession(userId);

  if (!ready) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center gap-3">
        <Loader2 className="w-4 h-4 text-primary animate-spin" />
        <span className="text-xs text-muted-foreground">Iniciando sessão...</span>
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Erro ao iniciar sessão. Recarregue a página.</p>
      </div>
    );
  }

  return <ConsultoriaLayout clientId={userId} sessionId={sessionId} />;
}
