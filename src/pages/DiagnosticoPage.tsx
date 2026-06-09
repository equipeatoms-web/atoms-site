import { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { BriefingForm } from '@/components/consultoria/BriefingForm';
import { GuidedChat } from '@/components/consultoria/GuidedChat';
import { DiagnosisPanel } from '@/components/consultoria/DiagnosisPanel';

type FlowStep = 'briefing' | 'guided_chat' | 'diagnosis';

export default function DiagnosticoPage() {
  const [step, setStep]   = useState<FlowStep>('briefing');
  const [token, setToken] = useState('');
  const [sessId, setSessId] = useState('');
  const [email, setEmail] = useState('');

  // Resume session if already started
  useEffect(() => {
    const savedToken = localStorage.getItem('atom_session_token');
    const savedSessId = localStorage.getItem('atom_session_id');
    const savedStep = localStorage.getItem('atom_flow_step') as FlowStep | null;
    if (savedToken && savedSessId && savedStep && savedStep !== 'briefing') {
      setToken(savedToken);
      setSessId(savedSessId);
      setStep(savedStep);
    }
  }, []);

  function handleBriefingComplete(t: string, sid: string) {
    setToken(t);
    setSessId(sid);
    setStep('guided_chat');
    localStorage.setItem('atom_flow_step', 'guided_chat');
  }

  function handleChatComplete() {
    setStep('diagnosis');
    localStorage.setItem('atom_flow_step', 'diagnosis');
  }

  const showDiagnosis = step === 'diagnosis';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="shrink-0 border-b border-border/60 bg-background/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-3">
          <div className="w-7 h-7 rounded-sm bg-primary/10 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="font-semibold text-sm text-foreground">ATom's</span>
          <span className="text-muted-foreground/40 text-sm">/</span>
          <span className="text-sm text-muted-foreground">Diagnóstico Gratuito</span>

          {/* Step indicator */}
          <div className="ml-auto hidden sm:flex items-center gap-2">
            {(['briefing', 'guided_chat', 'diagnosis'] as FlowStep[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                {i > 0 && <div className="w-8 h-px bg-border/40" />}
                <div className={`flex items-center gap-1.5 text-[10px] font-medium transition-colors ${
                  step === s ? 'text-primary' : s < step ? 'text-muted-foreground/60' : 'text-border/40'
                }`}>
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold transition-colors ${
                    step === s ? 'bg-primary text-primary-foreground' :
                    isStepPast(step, s) ? 'bg-emerald-500/20 text-emerald-400' : 'bg-border/30 text-muted-foreground/30'
                  }`}>
                    {isStepPast(step, s) ? '✓' : i + 1}
                  </div>
                  {s === 'briefing' ? 'Briefing' : s === 'guided_chat' ? 'Qualificação' : 'Diagnóstico'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Content — split layout when in diagnosis */}
      <div className={`flex-1 flex overflow-hidden ${showDiagnosis ? 'flex-row' : 'flex-col items-center justify-center'}`}>

        {/* Left — form/chat */}
        <div className={`${showDiagnosis ? 'flex-1 min-w-0 border-r border-border/60 overflow-hidden' : 'w-full max-w-xl px-4 py-8'}`}>
          {step === 'briefing' && (
            <BriefingForm onComplete={handleBriefingComplete} />
          )}
          {step === 'guided_chat' && token && (
            <GuidedChat
              sessionToken={token}
              sessionId={sessId}
              onComplete={handleChatComplete}
            />
          )}
          {step === 'diagnosis' && (
            <div className="flex flex-col h-full items-center justify-center p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary animate-pulse" />
              </div>
              <h2 className="text-xl font-serif text-foreground mb-2">
                Diagnóstico em andamento
              </h2>
              <p className="text-sm text-muted-foreground max-w-xs">
                Claude está processando todas as informações. Acompanhe o progresso ao lado.
              </p>
              <p className="text-xs text-muted-foreground/60 mt-6">
                Você receberá a proposta por e-mail assim que a equipe ATom's aprovar.
              </p>
            </div>
          )}
        </div>

        {/* Right — diagnosis panel (only in diagnosis step) */}
        {showDiagnosis && token && (
          <div className="w-80 sm:w-96 shrink-0 overflow-hidden">
            <DiagnosisPanel
              sessionToken={token}
              sessionId={sessId}
              clientEmail={email}
            />
          </div>
        )}
      </div>
    </div>
  );
}

const STEP_ORDER: FlowStep[] = ['briefing', 'guided_chat', 'diagnosis'];
function isStepPast(current: FlowStep, check: FlowStep) {
  return STEP_ORDER.indexOf(current) > STEP_ORDER.indexOf(check);
}
