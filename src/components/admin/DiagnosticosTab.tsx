import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Loader2, ChevronRight, Check, X, Mail, Clock,
  TrendingUp, Sparkles, Lightbulb, Layers, Edit3, Send,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Session {
  id: string;
  session_token: string;
  flow_step: string | null;
  diagnosis_status: string | null;
  briefing_data: Record<string, string> | null;
  chat_turn_count: number | null;
  created_at: string;
  updated_at: string | null;
  leads?: {
    name: string;
    email: string;
    whatsapp: string;
    company_name: string | null;
    main_challenge: string | null;
  } | null;
}

interface Proposal {
  id: string;
  session_id: string;
  summary: string;
  scope_items: string[];
  investment_min: number;
  investment_max: number;
  investment_label: string;
  timeline_weeks: number;
  timeline_label: string;
  differentials: string[];
  next_steps: string[];
  status: 'pending_approval' | 'approved' | 'rejected' | 'sent' | 'accepted' | 'declined';
  rejection_reason: string | null;
  pdf_url: string | null;
  sent_at: string | null;
  created_at: string;
}

interface DossieSection {
  id: string;
  category: string;
  title: string;
  content: string;
}

const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (d: string | null) =>
  d ? new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';

const fmtBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);

const STATUS_PROPOSAL: Record<string, { label: string; cls: string }> = {
  pending_approval: { label: 'Aguardando aprovação', cls: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20' },
  approved:  { label: 'Aprovada',   cls: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
  rejected:  { label: 'Rejeitada',  cls: 'bg-red-500/15 text-red-400 border-red-500/20' },
  sent:      { label: 'Enviada',    cls: 'bg-purple-500/15 text-purple-400 border-purple-500/20' },
  accepted:  { label: 'Aceita ✓',  cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
  declined:  { label: 'Recusada',   cls: 'bg-red-500/15 text-red-400 border-red-500/20' },
};

const SECTION_CONFIG: Record<string, { label: string; cls: string }> = {
  market_analysis: { label: 'Mercado',        cls: 'border-primary/20 bg-primary/5 text-primary' },
  brand_audit:     { label: 'Marca',          cls: 'border-purple-500/20 bg-purple-500/5 text-purple-400' },
  opportunities:   { label: 'Oportunidades',  cls: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' },
  action_plan:     { label: 'Plano de Ação',  cls: 'border-blue-500/20 bg-blue-500/5 text-blue-400' },
};

// ─── Session row ──────────────────────────────────────────────────────────────

function SessionRow({ session, onOpen }: { session: Session; onOpen: () => void }) {
  const name = session.leads?.name ?? session.briefing_data?.name ?? 'Anônimo';
  const company = session.leads?.company_name ?? session.briefing_data?.company_name ?? null;

  const STEP_LABEL: Record<string, string> = {
    briefing: 'Briefing',
    guided_chat: 'Qualificação',
    diagnosis: 'Diagnóstico',
    proposal: 'Proposta gerada',
    delivered: 'Enviado',
  };

  const stepLabel = STEP_LABEL[session.flow_step ?? ''] ?? session.flow_step ?? 'Início';
  const hasDiagnosis = !!session.diagnosis_status && session.diagnosis_status !== 'pending';
  const isProposal = session.flow_step === 'proposal' || session.flow_step === 'delivered';

  return (
    <tr
      className="hover:bg-card/80 transition-colors cursor-pointer"
      onClick={onOpen}
    >
      <td className="px-5 py-3.5">
        <p className="text-sm font-medium text-foreground">{name}</p>
        {company && <p className="text-xs text-muted-foreground">{company}</p>}
      </td>
      <td className="px-5 py-3.5 text-xs text-muted-foreground hidden md:table-cell">
        {session.leads?.email ?? session.briefing_data?.email ?? '—'}
      </td>
      <td className="px-5 py-3.5">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium border ${
          isProposal
            ? 'bg-primary/10 text-primary border-primary/20'
            : hasDiagnosis
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            : 'bg-card/60 text-muted-foreground border-border/40'
        }`}>
          {stepLabel}
        </span>
      </td>
      <td className="px-5 py-3.5 text-xs text-muted-foreground hidden sm:table-cell">
        {fmt(session.created_at)}
      </td>
      <td className="px-5 py-3.5 text-right">
        <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
      </td>
    </tr>
  );
}

// ─── Drawer ───────────────────────────────────────────────────────────────────

function SessionDrawer({ session, onClose }: { session: Session; onClose: () => void }) {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [rejectionReason, setRejectionReason] = useState('');
  const [editMin, setEditMin] = useState<string>('');
  const [editMax, setEditMax] = useState<string>('');
  const [editTimeline, setEditTimeline] = useState<string>('');
  const [showEditInvestment, setShowEditInvestment] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  const briefing = session.briefing_data ?? {};
  const lead = session.leads;

  // Load dossie sections
  const { data: sections = [] } = useQuery<DossieSection[]>({
    queryKey: ['dossie', session.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('dossie_sections')
        .select('*')
        .eq('session_id', session.id)
        .order('created_at');
      return (data ?? []) as DossieSection[];
    },
  });

  // Load proposal
  const { data: proposal, refetch: refetchProposal } = useQuery<Proposal | null>({
    queryKey: ['proposal', session.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('proposals')
        .select('*')
        .eq('session_id', session.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      return data as Proposal | null;
    },
  });

  const approveProposal = useMutation({
    mutationFn: async () => {
      const updates: Record<string, unknown> = {
        status: 'approved',
        approved_at: new Date().toISOString(),
      };
      if (editMin) updates.investment_min = Number(editMin);
      if (editMax) updates.investment_max = Number(editMax);
      if (editTimeline) updates.timeline_weeks = Number(editTimeline);

      const { error } = await supabase
        .from('proposals')
        .update(updates)
        .eq('id', proposal!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      refetchProposal();
      qc.invalidateQueries({ queryKey: ['sessions'] });
      toast({ title: 'Proposta aprovada' });
    },
    onError: (e) => toast({ title: 'Erro ao aprovar', description: String(e), variant: 'destructive' }),
  });

  const rejectProposal = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('proposals')
        .update({ status: 'rejected', rejection_reason: rejectionReason })
        .eq('id', proposal!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      refetchProposal();
      toast({ title: 'Proposta rejeitada' });
    },
    onError: (e) => toast({ title: 'Erro', description: String(e), variant: 'destructive' }),
  });

  async function sendEmail() {
    if (!proposal) return;
    setSendingEmail(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/atom-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_ANON_KEY },
        body: JSON.stringify({ proposal_id: proposal.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Erro');
      toast({ title: 'E-mail enviado com sucesso!' });
      refetchProposal();
    } catch (e) {
      toast({ title: 'Erro ao enviar e-mail', description: String(e), variant: 'destructive' });
    } finally {
      setSendingEmail(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="flex-1 bg-black/40 backdrop-blur-sm" />
      <div
        className="w-full max-w-lg bg-background border-l border-border overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-serif text-foreground">
                {lead?.name ?? briefing.name ?? 'Anônimo'}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {lead?.company_name ?? briefing.company_name ?? '—'}
              </p>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl leading-none">×</button>
          </div>

          {/* Briefing */}
          <div className="space-y-3">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Briefing</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                ['E-mail',    lead?.email ?? briefing.email],
                ['WhatsApp',  lead?.whatsapp ?? briefing.whatsapp],
                ['Segmento',  briefing.segment],
                ['Desafio',   lead?.main_challenge ?? briefing.main_challenge],
                ['Já tentou', briefing.already_tried],
              ].map(([k, v]) => v ? (
                <div key={k} className="rounded-sm border border-border/40 bg-card/30 p-2.5">
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-0.5">{k}</p>
                  <p className="text-foreground/90">{v}</p>
                </div>
              ) : null)}
            </div>
          </div>

          {/* Dossie sections */}
          {sections.length > 0 && (
            <div className="space-y-3">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Diagnóstico — {sections.length}/4 seções</p>
              <div className="space-y-2">
                {sections.map(s => {
                  const cfg = SECTION_CONFIG[s.category] ?? SECTION_CONFIG.market_analysis;
                  return (
                    <div key={s.id} className={`rounded-sm border p-3 space-y-1 ${cfg.cls}`}>
                      <p className="text-[9px] font-semibold uppercase tracking-widest">{cfg.label}</p>
                      <p className="text-xs font-semibold text-foreground">{s.title}</p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{s.content}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Proposal */}
          {proposal && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Proposta</p>
                <span className={`px-2 py-0.5 rounded-sm text-[9px] font-medium border ${(STATUS_PROPOSAL[proposal.status] ?? STATUS_PROPOSAL.pending_approval).cls}`}>
                  {(STATUS_PROPOSAL[proposal.status] ?? STATUS_PROPOSAL.pending_approval).label}
                </span>
              </div>

              {/* Summary */}
              <p className="text-xs text-foreground/80 bg-card/50 rounded-sm p-3 border border-border/40 leading-relaxed">
                {proposal.summary}
              </p>

              {/* Scope */}
              {proposal.scope_items?.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Escopo</p>
                  <ul className="space-y-1">
                    {proposal.scope_items.map((item, i) => (
                      <li key={i} className="text-xs text-foreground/80 flex items-start gap-2">
                        <span className="text-primary mt-0.5">·</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Investment */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-sm border border-primary/20 bg-primary/5 p-3">
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">Investimento</p>
                  <p className="text-sm font-bold text-primary">
                    {fmtBRL(proposal.investment_min)} – {fmtBRL(proposal.investment_max)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{proposal.investment_label}</p>
                </div>
                <div className="rounded-sm border border-border/40 bg-card/30 p-3">
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">Prazo</p>
                  <p className="text-sm font-bold text-foreground">{proposal.timeline_weeks} semanas</p>
                  <p className="text-[10px] text-muted-foreground">{proposal.timeline_label}</p>
                </div>
              </div>

              {/* Edit investment */}
              {proposal.status === 'pending_approval' && (
                <div>
                  <button
                    onClick={() => setShowEditInvestment(p => !p)}
                    className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    Ajustar valores antes de aprovar
                  </button>
                  {showEditInvestment && (
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[9px] text-muted-foreground uppercase tracking-wider">Mín (R$)</label>
                        <input
                          type="number"
                          className="w-full h-8 bg-card/40 border border-border rounded-sm px-2 text-xs text-foreground focus:outline-none focus:border-primary"
                          placeholder={String(proposal.investment_min)}
                          value={editMin}
                          onChange={e => setEditMin(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-muted-foreground uppercase tracking-wider">Máx (R$)</label>
                        <input
                          type="number"
                          className="w-full h-8 bg-card/40 border border-border rounded-sm px-2 text-xs text-foreground focus:outline-none focus:border-primary"
                          placeholder={String(proposal.investment_max)}
                          value={editMax}
                          onChange={e => setEditMax(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-muted-foreground uppercase tracking-wider">Semanas</label>
                        <input
                          type="number"
                          className="w-full h-8 bg-card/40 border border-border rounded-sm px-2 text-xs text-foreground focus:outline-none focus:border-primary"
                          placeholder={String(proposal.timeline_weeks)}
                          value={editTimeline}
                          onChange={e => setEditTimeline(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Approve / Reject */}
              {proposal.status === 'pending_approval' && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => approveProposal.mutate()}
                      disabled={approveProposal.isPending}
                      className="flex-1 flex items-center justify-center gap-2 h-9 rounded-sm bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-medium transition-colors"
                    >
                      {approveProposal.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                      Aprovar proposta
                    </button>
                    <button
                      onClick={() => rejectProposal.mutate()}
                      disabled={rejectProposal.isPending || !rejectionReason}
                      className="flex-1 flex items-center justify-center gap-2 h-9 rounded-sm border border-red-500/30 hover:bg-red-500/10 disabled:opacity-40 text-red-400 text-xs font-medium transition-colors"
                    >
                      {rejectProposal.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}
                      Rejeitar
                    </button>
                  </div>
                  <input
                    className="w-full h-8 bg-card/40 border border-border rounded-sm px-3 text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-red-500/50"
                    placeholder="Motivo da rejeição (obrigatório para rejeitar)"
                    value={rejectionReason}
                    onChange={e => setRejectionReason(e.target.value)}
                  />
                </div>
              )}

              {/* Send email */}
              {proposal.status === 'approved' && (
                <button
                  onClick={sendEmail}
                  disabled={sendingEmail}
                  className="w-full flex items-center justify-center gap-2 h-10 rounded-sm bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground text-xs font-medium transition-colors"
                >
                  {sendingEmail
                    ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Enviando...</>
                    : <><Send className="w-3.5 h-3.5" /> Enviar proposta por e-mail</>
                  }
                </button>
              )}

              {proposal.status === 'sent' && (
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 rounded-sm p-3">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  Enviado em {fmt(proposal.sent_at)}
                </div>
              )}

              {proposal.status === 'rejected' && proposal.rejection_reason && (
                <p className="text-xs text-red-400/80 bg-red-500/5 border border-red-500/20 rounded-sm p-3">
                  Motivo: {proposal.rejection_reason}
                </p>
              )}
            </div>
          )}

          {!proposal && session.flow_step && ['diagnosis', 'proposal', 'delivered'].includes(session.flow_step) && (
            <div className="text-xs text-muted-foreground text-center py-4">
              <Loader2 className="w-4 h-4 animate-spin mx-auto mb-2" />
              Proposta sendo gerada...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function DiagnosticosTab() {
  const [selected, setSelected] = useState<Session | null>(null);
  const [filterStep, setFilterStep] = useState<string>('all');

  const { data: sessions = [], isLoading } = useQuery<Session[]>({
    queryKey: ['sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('consultoria_sessions')
        .select('*, leads(name, email, whatsapp, company_name, main_challenge)')
        .not('session_token', 'is', null)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as Session[];
    },
    refetchInterval: 30_000,
  });

  const steps = ['all', 'proposal', 'diagnosis', 'guided_chat', 'delivered'];
  const STEP_LABEL: Record<string, string> = {
    all: 'Todos',
    briefing: 'Briefing',
    guided_chat: 'Qualificação',
    diagnosis: 'Diagnóstico',
    proposal: 'Proposta',
    delivered: 'Enviado',
  };

  const filtered = filterStep === 'all'
    ? sessions
    : sessions.filter(s => s.flow_step === filterStep);

  // Counts
  const pendingApproval = sessions.filter(s => s.flow_step === 'proposal').length;

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      {/* Header KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-sm border border-border bg-card/50 p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Total diagnósticos</p>
          <p className="text-2xl font-bold text-foreground">{sessions.length}</p>
        </div>
        <div className="rounded-sm border border-yellow-500/20 bg-yellow-500/5 p-4">
          <p className="text-[10px] text-yellow-400 uppercase tracking-wider mb-1">Aguardando aprovação</p>
          <p className="text-2xl font-bold text-yellow-400">{pendingApproval}</p>
        </div>
        <div className="rounded-sm border border-emerald-500/20 bg-emerald-500/5 p-4">
          <p className="text-[10px] text-emerald-400 uppercase tracking-wider mb-1">Propostas enviadas</p>
          <p className="text-2xl font-bold text-emerald-400">{sessions.filter(s => s.flow_step === 'delivered').length}</p>
        </div>
        <div className="rounded-sm border border-border bg-card/50 p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Em diagnóstico</p>
          <p className="text-2xl font-bold text-foreground">{sessions.filter(s => s.flow_step === 'diagnosis').length}</p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-sm border border-border bg-card/50">
        <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between gap-3 flex-wrap">
          <p className="text-sm font-medium text-foreground">
            Diagnósticos <span className="text-muted-foreground font-normal">({filtered.length})</span>
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {steps.map(s => (
              <button
                key={s}
                onClick={() => setFilterStep(s)}
                className={`px-2.5 py-1 rounded-sm text-[10px] font-medium border transition-all ${
                  filterStep === s
                    ? s === 'proposal'
                      ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                      : 'bg-primary/10 text-primary border-primary/30'
                    : 'bg-transparent text-muted-foreground border-border/50 hover:border-border'
                }`}
              >
                {STEP_LABEL[s] ?? s}
                {s === 'proposal' && pendingApproval > 0 && (
                  <span className="ml-1 bg-yellow-500/20 text-yellow-400 rounded-full w-4 h-4 inline-flex items-center justify-center text-[9px]">
                    {pendingApproval}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="py-16 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Carregando...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            Nenhum diagnóstico encontrado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left px-5 py-3 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Cliente</th>
                  <th className="text-left px-5 py-3 text-[10px] font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">E-mail</th>
                  <th className="text-left px-5 py-3 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Etapa</th>
                  <th className="text-left px-5 py-3 text-[10px] font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Criado em</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filtered.map(s => (
                  <SessionRow key={s.id} session={s} onOpen={() => setSelected(s)} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && <SessionDrawer session={selected} onClose={() => setSelected(null)} />}
    </main>
  );
}
