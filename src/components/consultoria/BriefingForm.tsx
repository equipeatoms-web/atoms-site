import { useState } from 'react';
import { ChevronRight, Loader2 } from 'lucide-react';

const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL ?? '';
const EDGE_BRIEFING_URL = `${SUPABASE_URL}/functions/v1/atom-briefing`;

const SEGMENTS = [
  'Estética e Beleza', 'Saúde e Bem-estar', 'Barbearia / Grooming',
  'Educação / Coaching', 'Varejo / E-commerce', 'Serviços / Consultoria',
  'Alimentação / Food', 'Moda / Lifestyle', 'Tecnologia / SaaS', 'Outro',
];

interface BriefingFormProps {
  onComplete: (token: string, sessionId: string) => void;
}

export function BriefingForm({ onComplete }: BriefingFormProps) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState({
    name: '', email: '', whatsapp: '',
    company_name: '', segment: '',
    main_challenge: '', already_tried: '',
  });

  const STEPS = [
    {
      label: 'Sobre você',
      fields: (
        <div className="space-y-3">
          <Field label="Seu nome" required>
            <input value={data.name} onChange={e => setData(d => ({ ...d, name: e.target.value }))}
              placeholder="Como prefere ser chamado" className={inputCls} />
          </Field>
          <Field label="WhatsApp" required>
            <input type="tel" value={data.whatsapp} onChange={e => setData(d => ({ ...d, whatsapp: e.target.value }))}
              placeholder="+55 11 99999-9999" className={inputCls} />
          </Field>
          <Field label="E-mail" required>
            <input type="email" value={data.email} onChange={e => setData(d => ({ ...d, email: e.target.value }))}
              placeholder="seu@email.com" className={inputCls} />
          </Field>
        </div>
      ),
      valid: () => data.name.trim() && data.email.trim() && data.whatsapp.trim(),
    },
    {
      label: 'Seu negócio',
      fields: (
        <div className="space-y-3">
          <Field label="Nome da empresa ou projeto">
            <input value={data.company_name} onChange={e => setData(d => ({ ...d, company_name: e.target.value }))}
              placeholder="Studio Élite, Barbearia Mendes…" className={inputCls} />
          </Field>
          <Field label="Segmento" required>
            <select value={data.segment} onChange={e => setData(d => ({ ...d, segment: e.target.value }))}
              className={inputCls + ' cursor-pointer'}>
              <option value="">Selecione seu segmento</option>
              {SEGMENTS.map(s => <option key={s} value={s} className="bg-background">{s}</option>)}
            </select>
          </Field>
        </div>
      ),
      valid: () => data.segment.trim(),
    },
    {
      label: 'Seu maior desafio',
      fields: (
        <Field label="Qual é o maior desafio do seu negócio hoje?" required>
          <textarea value={data.main_challenge} onChange={e => setData(d => ({ ...d, main_challenge: e.target.value }))}
            placeholder="Ex: Não consigo atrair clientes novos. Tenho clientes mas não consigo fidelizar. Minha marca não se diferencia da concorrência..."
            rows={4} className={inputCls + ' resize-none'} />
        </Field>
      ),
      valid: () => data.main_challenge.trim().length > 10,
    },
    {
      label: 'O que já tentou',
      fields: (
        <Field label="O que você já tentou para resolver isso?">
          <textarea value={data.already_tried} onChange={e => setData(d => ({ ...d, already_tried: e.target.value }))}
            placeholder="Ex: Contratei um gestor de tráfego, fiz curso de marketing, redesenhei o logo... ou se ainda não tentou nada, diga isso."
            rows={4} className={inputCls + ' resize-none'} />
        </Field>
      ),
      valid: () => true,
    },
  ];

  async function handleNext() {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
      return;
    }
    // Last step: submit
    setError('');
    setLoading(true);
    try {
      const res = await fetch(EDGE_BRIEFING_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Erro ao salvar briefing');
      localStorage.setItem('atom_session_token', json.session_token);
      localStorage.setItem('atom_session_id', json.session_id);
      onComplete(json.session_token, json.session_id);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }

  const current = STEPS[step];
  const canProceed = current.valid();

  return (
    <div className="flex flex-col h-full bg-background px-5 sm:px-8 py-6 max-w-xl mx-auto w-full">
      {/* Progress */}
      <div className="mb-6 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-medium text-primary uppercase tracking-widest">
            Briefing · {step + 1} de {STEPS.length}
          </p>
          <p className="text-[10px] text-muted-foreground">{current.label}</p>
        </div>
        <div className="flex gap-1">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-0.5 flex-1 rounded-full transition-all ${i <= step ? 'bg-emerald-500' : 'bg-border/40'}`} />
          ))}
        </div>
      </div>

      {/* Step heading */}
      <div className="mb-6 shrink-0">
        <h2 className="text-xl font-serif text-foreground">{current.label}</h2>
        <p className="text-xs text-muted-foreground mt-1">
          {step === 0 && 'Para personalizar o diagnóstico, precisamos te conhecer.'}
          {step === 1 && 'Contexto do negócio para calibrar a análise.'}
          {step === 2 && 'Essa é a pergunta mais importante. Seja específico.'}
          {step === 3 && 'Saber o que já foi tentado evita repetir caminhos.'}
        </p>
      </div>

      {/* Fields */}
      <div className="flex-1">
        {current.fields}
        {error && (
          <p className="mt-3 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-sm px-3 py-2">{error}</p>
        )}
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between pt-6 shrink-0">
        {step > 0 ? (
          <button onClick={() => setStep(s => s - 1)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            ← Voltar
          </button>
        ) : <div />}

        <button
          disabled={!canProceed || loading}
          onClick={handleNext}
          className="flex items-center gap-2 px-5 py-2.5 rounded-sm bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors disabled:opacity-40"
        >
          {loading ? (
            <><Loader2 className="w-3.5 h-3.5 animate-spin" />Enviando...</>
          ) : step < STEPS.length - 1 ? (
            <>Próximo <ChevronRight className="w-3.5 h-3.5" /></>
          ) : (
            <>Iniciar diagnóstico <ChevronRight className="w-3.5 h-3.5" /></>
          )}
        </button>
      </div>
    </div>
  );
}

const inputCls = 'w-full h-10 bg-card/50 border border-border rounded-sm px-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-emerald-500/60 transition-colors';

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">
        {label}{required && <span className="text-emerald-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
