import { useState, useEffect, useRef } from 'react';
import { TrendingUp, Sparkles, Lightbulb, Layers, Loader2, Mail, Check } from 'lucide-react';

const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '';
const EDGE_DIAGNOSE_URL = `${SUPABASE_URL}/functions/v1/atom-diagnose`;
const EDGE_PROPOSE_URL  = `${SUPABASE_URL}/functions/v1/atom-propose`;
const EDGE_EMAIL_URL    = `${SUPABASE_URL}/functions/v1/atom-email`;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DiagnosisSection {
  category: 'market_analysis' | 'brand_audit' | 'opportunities' | 'action_plan';
  title: string;
  content: string;
  data: Record<string, unknown>;
}

const SECTION_CONFIG = {
  market_analysis: { label: 'Mercado',     Icon: TrendingUp, cls: 'border-primary/20 bg-primary/5 text-primary' },
  brand_audit:     { label: 'Marca',       Icon: Sparkles,   cls: 'border-purple-500/20 bg-purple-500/5 text-purple-400' },
  opportunities:   { label: 'Oportunidades', Icon: Lightbulb, cls: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' },
  action_plan:     { label: 'Plano de Ação', Icon: Layers,    cls: 'border-blue-500/20 bg-blue-500/5 text-blue-400' },
};

// ─── Section Card ─────────────────────────────────────────────────────────────

function SectionCard({ section, isNew }: { section: DiagnosisSection; isNew: boolean }) {
  const [visible, setVisible] = useState(!isNew);
  const cfg = SECTION_CONFIG[section.category] ?? SECTION_CONFIG.market_analysis;
  const { Icon } = cfg;

  useEffect(() => {
    if (isNew) {
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
  }, [isNew]);

  return (
    <div className={`rounded-sm border p-4 space-y-2.5 transition-all duration-500 ease-out ${cfg.cls} ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
    }`}>
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 shrink-0" />
        <span className="text-[10px] font-semibold uppercase tracking-widest">{cfg.label}</span>
      </div>
      <p className="text-sm font-semibold text-foreground leading-snug">{section.title}</p>
      <p className="text-xs text-muted-foreground leading-relaxed">{section.content}</p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface DiagnosisPanelProps {
  sessionToken: string;
  sessionId: string;
  clientEmail?: string;
}

export function DiagnosisPanel({ sessionToken, sessionId, clientEmail }: DiagnosisPanelProps) {
  const [sections, setSections]     = useState<DiagnosisSection[]>([]);
  const [newIds, setNewIds]         = useState<Set<string>>(new Set());
  const [status, setStatus]         = useState<'generating' | 'done' | 'proposing' | 'proposed' | 'error'>('generating');
  const [proposalId, setProposalId] = useState<string | null>(null);
  const [emailSent, setEmailSent]   = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [errorMsg, setErrorMsg]     = useState('');
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    runDiagnosis();
  }, []);

  async function runDiagnosis() {
    try {
      const res = await fetch(EDGE_DIAGNOSE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ session_id: sessionId, session_token: sessionToken }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? `Erro ${res.status}`);
      }

      // Read SSE stream, detect completed [SECTION:...] blocks
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';
      const seen = new Set<string>();

      const sectionRx = /\[SECTION:(\w+)\]([\s\S]*?)\[\/SECTION\]/g;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });

        // Extract completed sections
        for (const m of accumulated.matchAll(sectionRx)) {
          const [, cat, rawJson] = m;
          if (seen.has(cat)) continue;
          seen.add(cat);
          try {
            const parsed = JSON.parse(rawJson.trim());
            const section: DiagnosisSection = {
              category: cat as DiagnosisSection['category'],
              title: parsed.title ?? cat,
              content: parsed.content ?? '',
              data: parsed.data ?? {},
            };
            const id = `${cat}-${Date.now()}`;
            setSections(prev => [...prev, section]);
            setNewIds(prev => new Set([...prev, id]));
            setTimeout(() => setNewIds(prev => { const n = new Set(prev); n.delete(id); return n; }), 700);
          } catch { /* skip malformed */ }
        }
      }

      setStatus('proposing');
      await generateProposal();

    } catch (e) {
      console.error('[DiagnosisPanel]', e);
      setErrorMsg(e instanceof Error ? e.message : 'Erro desconhecido');
      setStatus('error');
    }
  }

  async function generateProposal() {
    try {
      const res = await fetch(EDGE_PROPOSE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_ANON_KEY },
        body: JSON.stringify({ session_id: sessionId, session_token: sessionToken }),
      });
      const data = await res.json();
      if (!res.ok && res.status !== 409) throw new Error(data.error ?? 'Erro na proposta');
      setProposalId(data.proposal_id ?? null);
      setStatus('done');
    } catch (e) {
      console.error('[Proposal]', e);
      setStatus('done'); // Don't block UX if proposal fails
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="shrink-0 px-5 py-3.5 border-b border-border/60 flex items-center gap-3">
        <div className="w-6 h-6 rounded-sm bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-3 h-3 text-primary" />
        </div>
        <span className="text-sm font-semibold text-foreground">Diagnóstico em andamento</span>
        {status === 'generating' && (
          <Loader2 className="w-3.5 h-3.5 text-primary animate-spin ml-auto" />
        )}
        {sections.length > 0 && status !== 'generating' && (
          <span className="ml-auto text-[10px] text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-sm">
            {sections.length}/4
          </span>
        )}
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {sections.length === 0 && status === 'generating' && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <p className="text-xs text-muted-foreground max-w-[180px]">
              Claude está analisando seu caso e montando o diagnóstico...
            </p>
          </div>
        )}

        {sections.map((s, i) => (
          <SectionCard key={`${s.category}-${i}`} section={s} isNew={newIds.has(`${s.category}-${Date.now()}`)} />
        ))}

        {status === 'proposing' && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-sm border border-border/40 bg-card/30">
            <Loader2 className="w-3 h-3 text-primary animate-spin shrink-0" />
            <p className="text-xs text-muted-foreground">Gerando proposta comercial...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="px-4 py-3 rounded-sm border border-red-500/20 bg-red-500/5">
            <p className="text-xs text-red-400">{errorMsg || 'Erro ao gerar diagnóstico. Recarregue a página.'}</p>
          </div>
        )}
      </div>

      {/* Done state — awaiting team approval */}
      {(status === 'done') && sections.length > 0 && (
        <div className="shrink-0 px-4 py-4 border-t border-border/60 space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-sm border border-emerald-500/20 bg-emerald-500/5">
            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Diagnóstico concluído</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                A proposta foi gerada e está aguardando aprovação da equipe ATom's.
                Você receberá um e-mail em breve.
              </p>
            </div>
          </div>

          {clientEmail && (
            <p className="text-[11px] text-muted-foreground text-center">
              Enviaremos para <span className="text-foreground">{clientEmail}</span>
            </p>
          )}

          {emailSent && (
            <div className="flex items-center justify-center gap-2 text-xs text-emerald-400">
              <Check className="w-3 h-3" />
              E-mail confirmado!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
