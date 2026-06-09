import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area,
} from 'recharts';
import {
  LogOut, Users, TrendingUp, MessageSquare, ChevronDown,
  Phone, Mail, Building2, Calendar, StickyNote, ExternalLink, Paperclip, LayoutDashboard, BrainCircuit, Microscope,
} from 'lucide-react';
import { PaperclipEmbed } from '@/components/PaperclipEmbed';
import { ConsultoriaLayout } from '@/components/ConsultoriaLayout';
import { DiagnosticosTab } from '@/components/admin/DiagnosticosTab';

type AdminTab = 'dashboard' | 'paperclip' | 'consultoria' | 'diagnosticos';

// ─── Types ───────────────────────────────────────────────────────────────────

type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed_won' | 'closed_lost';

interface Lead {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  business_type: string | null;
  message: string | null;
  notes: string | null;
  status: LeadStatus | null;
  source: string | null;
  created_at: string | null;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<LeadStatus, { label: string; color: string; order: number }> = {
  new:          { label: 'Novo',        color: 'bg-blue-500/15 text-blue-400 border-blue-500/20',    order: 0 },
  contacted:    { label: 'Contactado',  color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20', order: 1 },
  qualified:    { label: 'Qualificado', color: 'bg-purple-500/15 text-purple-400 border-purple-500/20', order: 2 },
  proposal:     { label: 'Proposta',    color: 'bg-orange-500/15 text-orange-400 border-orange-500/20', order: 3 },
  closed_won:   { label: 'Fechado ✓',  color: 'bg-green-500/15 text-green-400 border-green-500/20',  order: 4 },
  closed_lost:  { label: 'Perdido',     color: 'bg-red-500/15 text-red-400 border-red-500/20',       order: 5 },
};

const FUNNEL_ORDER: LeadStatus[] = ['new', 'contacted', 'qualified', 'proposal', 'closed_won'];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (d: string | null) => d
  ? new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  : '—';

const wppLink = (n: string) =>
  `https://wa.me/55${n.replace(/\D/g, '')}`;

// ─── Sub-components ───────────────────────────────────────────────────────────

const KPI = ({ label, value, sub, icon: Icon }: {
  label: string; value: string | number; sub?: string; icon: React.ElementType
}) => (
  <div className="rounded-sm border border-border bg-card/50 p-5 flex items-start gap-4">
    <div className="w-9 h-9 rounded-sm bg-primary/10 flex items-center justify-center shrink-0">
      <Icon className="w-4 h-4 text-primary" />
    </div>
    <div>
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: LeadStatus | null }) => {
  const s = status && STATUS_CONFIG[status] ? STATUS_CONFIG[status] : STATUS_CONFIG['new'];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium border ${s.color}`}>
      {s.label}
    </span>
  );
};

// ─── Main component ──────────────────────────────────────────────────────────

const Admin = () => {
  const { user, loading, signOut } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filterStatus, setFilterStatus] = useState<LeadStatus | 'all'>('all');
  const [notes, setNotes] = useState('');

  // ── Data ──
  const { data: leads = [] } = useQuery<Lead[]>({
    queryKey: ['leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as Lead[];
    },
    enabled: !!user,
    refetchInterval: 30_000,
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: LeadStatus }) => {
      const { error } = await supabase.from('leads').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leads'] });
      toast({ title: 'Status atualizado' });
    },
  });

  const saveNotes = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      const { error } = await supabase
        .from('leads')
        .update({ notes, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leads'] });
      toast({ title: 'Notas salvas' });
    },
  });

  // ── Guards ──
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <span className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
  if (!user) return <Navigate to="/auth" replace />;

  // ── Derived data ──
  const filtered = filterStatus === 'all' ? leads : leads.filter(l => l.status === filterStatus);

  const funnelData = FUNNEL_ORDER.map(s => ({
    name: STATUS_CONFIG[s].label,
    total: leads.filter(l => l.status === s).length,
  }));

  const last7: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    last7[d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })] = 0;
  }
  leads.forEach(l => {
    if (!l.created_at) return;
    const k = new Date(l.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    if (k in last7) last7[k]++;
  });
  const volumeData = Object.entries(last7).map(([date, leads]) => ({ date, leads }));

  const wonRate = leads.length
    ? Math.round((leads.filter(l => l.status === 'closed_won').length / leads.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between relative">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">A</span>
            </div>
            <span className="font-semibold text-sm text-foreground">ATom's</span>
            <span className="text-muted-foreground/40 text-sm">/</span>
            <span className="text-sm text-muted-foreground">Painel</span>
          </div>

          {/* Tab nav */}
          <nav className="absolute left-1/2 -translate-x-1/2 hidden sm:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('paperclip')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium transition-all ${
                activeTab === 'paperclip'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Paperclip className="w-3.5 h-3.5" />
              Paperclip
            </button>
            <button
              onClick={() => setActiveTab('consultoria')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium transition-all ${
                activeTab === 'consultoria'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              Consultoria
            </button>
            <button
              onClick={() => setActiveTab('diagnosticos')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium transition-all ${
                activeTab === 'diagnosticos'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Microscope className="w-3.5 h-3.5" />
              Diagnósticos
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:block">{user.email}</span>
            <Button variant="ghost" size="sm" onClick={signOut} className="h-8 gap-1.5 text-xs">
              <LogOut className="w-3.5 h-3.5" />
              Sair
            </Button>
          </div>
        </div>

        {/* Mobile tab nav */}
        <div className="flex sm:hidden border-t border-border/40">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
              activeTab === 'dashboard' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('paperclip')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
              activeTab === 'paperclip' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
            }`}
          >
            <Paperclip className="w-3.5 h-3.5" />
            Paperclip
          </button>
          <button
            onClick={() => setActiveTab('consultoria')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
              activeTab === 'consultoria' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            Consultoria
          </button>
          <button
            onClick={() => setActiveTab('diagnosticos')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
              activeTab === 'diagnosticos' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
            }`}
          >
            <Microscope className="w-3.5 h-3.5" />
            Diagnóst.
          </button>
        </div>
      </header>

      {/* Paperclip tab */}
      {activeTab === 'paperclip' && (
        <div className="h-[calc(100vh-56px)] w-full bg-black">
          <PaperclipEmbed />
        </div>
      )}

      {/* Consultoria tab */}
      {activeTab === 'consultoria' && <ConsultoriaLayout clientId="admin" sessionId="" isAdmin />}

      {/* Diagnósticos tab */}
      {activeTab === 'diagnosticos' && <DiagnosticosTab />}

      {activeTab === 'dashboard' && (
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPI label="Total de Leads" value={leads.length} icon={Users}
            sub={`${leads.filter(l => {
              const d = l.created_at ? new Date(l.created_at) : null;
              return d && (Date.now() - d.getTime()) < 7 * 86400000;
            }).length} esta semana`}
          />
          <KPI label="Novos" value={leads.filter(l => l.status === 'new').length} icon={MessageSquare}
            sub="aguardando contato"
          />
          <KPI label="Em andamento" value={leads.filter(l => ['contacted','qualified','proposal'].includes(l.status ?? '')).length} icon={TrendingUp}
            sub="no funil"
          />
          <KPI label="Taxa de Fechamento" value={`${wonRate}%`} icon={TrendingUp}
            sub={`${leads.filter(l => l.status === 'closed_won').length} clientes fechados`}
          />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Funnel */}
          <div className="rounded-sm border border-border bg-card/50 p-5">
            <p className="text-sm font-medium text-foreground mb-4">Funil de Vendas</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={funnelData} barSize={28}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={24} />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 4, fontSize: 12 }}
                  cursor={{ fill: 'hsl(var(--primary)/0.05)' }}
                />
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Volume */}
          <div className="rounded-sm border border-border bg-card/50 p-5">
            <p className="text-sm font-medium text-foreground mb-4">Leads — últimos 7 dias</p>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={volumeData}>
                <defs>
                  <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={24} />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 4, fontSize: 12 }}
                />
                <Area type="monotone" dataKey="leads" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#lg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leads table */}
        <div className="rounded-sm border border-border bg-card/50">
          {/* Table header */}
          <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between gap-3 flex-wrap">
            <p className="text-sm font-medium text-foreground">
              Leads <span className="text-muted-foreground font-normal">({filtered.length})</span>
            </p>
            {/* Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              {(['all', ...Object.keys(STATUS_CONFIG)] as (LeadStatus | 'all')[]).map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-2.5 py-1 rounded-sm text-[10px] font-medium border transition-all ${
                    filterStatus === s
                      ? 'bg-primary/10 text-primary border-primary/30'
                      : 'bg-transparent text-muted-foreground border-border/50 hover:border-border'
                  }`}
                >
                  {s === 'all' ? 'Todos' : STATUS_CONFIG[s as LeadStatus].label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {filtered.length === 0 ? (
              <div className="py-16 text-center text-sm text-muted-foreground">
                Nenhum lead encontrado.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40">
                    <th className="text-left px-5 py-3 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Nome</th>
                    <th className="text-left px-5 py-3 text-[10px] font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Contato</th>
                    <th className="text-left px-5 py-3 text-[10px] font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Empresa</th>
                    <th className="text-left px-5 py-3 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="text-left px-5 py-3 text-[10px] font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Data</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filtered.map(lead => (
                    <tr
                      key={lead.id}
                      className="hover:bg-card/80 transition-colors cursor-pointer"
                      onClick={() => { setSelectedLead(lead); setNotes(lead.notes ?? ''); }}
                    >
                      <td className="px-5 py-3.5 font-medium text-foreground">{lead.name}</td>
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <div className="flex flex-col gap-0.5">
                          <a
                            href={`mailto:${lead.email}`}
                            onClick={e => e.stopPropagation()}
                            className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                          >
                            <Mail className="w-3 h-3" />{lead.email}
                          </a>
                          <a
                            href={wppLink(lead.whatsapp)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="text-xs text-muted-foreground hover:text-green-400 transition-colors flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />{lead.whatsapp}
                          </a>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground hidden lg:table-cell">
                        {lead.business_type || '—'}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={lead.status as LeadStatus} />
                      </td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground hidden sm:table-cell">
                        {fmt(lead.created_at)}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <ChevronDown className="w-4 h-4 text-muted-foreground/40 -rotate-90" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
      )}

      {/* Lead detail drawer */}
      {selectedLead && (
        <div
          className="fixed inset-0 z-50 flex"
          onClick={() => setSelectedLead(null)}
        >
          <div className="flex-1 bg-black/40 backdrop-blur-sm" />
          <div
            className="w-full max-w-md bg-background border-l border-border overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-serif text-foreground">{selectedLead.name}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Recebido em {fmt(selectedLead.created_at)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-muted-foreground hover:text-foreground text-xl leading-none"
                >
                  ×
                </button>
              </div>

              {/* Contacts */}
              <div className="space-y-2">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Contato</p>
                <a href={`mailto:${selectedLead.email}`}
                  className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors">
                  <Mail className="w-4 h-4 text-muted-foreground" />{selectedLead.email}
                </a>
                <a href={wppLink(selectedLead.whatsapp)} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-foreground hover:text-green-400 transition-colors">
                  <Phone className="w-4 h-4 text-muted-foreground" />{selectedLead.whatsapp}
                  <ExternalLink className="w-3 h-3 opacity-40" />
                </a>
                {selectedLead.business_type && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="w-4 h-4" />{selectedLead.business_type}
                  </div>
                )}
              </div>

              {/* Message */}
              {selectedLead.message && (
                <div className="space-y-2">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Mensagem</p>
                  <p className="text-sm text-foreground/80 bg-card/60 rounded-sm p-3 border border-border/50 leading-relaxed">
                    {selectedLead.message}
                  </p>
                </div>
              )}

              {/* Status */}
              <div className="space-y-2">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Status do Lead</p>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(STATUS_CONFIG) as LeadStatus[]).map(s => (
                    <button
                      key={s}
                      onClick={() => updateStatus.mutate({ id: selectedLead.id, status: s })}
                      className={`px-3 py-2 rounded-sm text-xs font-medium border transition-all text-left ${
                        selectedLead.status === s
                          ? STATUS_CONFIG[s].color + ' border-current'
                          : 'bg-transparent text-muted-foreground border-border/50 hover:border-border'
                      }`}
                    >
                      {STATUS_CONFIG[s].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <StickyNote className="w-3 h-3" />
                  Notas internas
                </p>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Adicione observações sobre este lead..."
                  className="w-full min-h-[100px] text-sm bg-card/40 border border-border rounded-sm p-3 text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:border-primary"
                />
                <Button
                  size="sm"
                  className="w-full h-9 rounded-sm text-xs"
                  onClick={() => saveNotes.mutate({ id: selectedLead.id, notes })}
                  disabled={saveNotes.isPending}
                >
                  {saveNotes.isPending ? 'Salvando...' : 'Salvar Notas'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
