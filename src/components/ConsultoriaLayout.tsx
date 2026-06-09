import { useState, useCallback } from 'react';
import { Lightbulb, X, RotateCcw } from 'lucide-react';
import { ConsultoriaAgent } from './ConsultoriaAgent';
import { InsightsPanel, InsightBlock } from './InsightsPanel';

// ─── Props ────────────────────────────────────────────────────────────────────

interface ConsultoriaLayoutProps {
  clientId: string;
  sessionId: string;
  isAdmin?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ConsultoriaLayout({ clientId, sessionId, isAdmin }: ConsultoriaLayoutProps) {
  const [insights, setInsights]           = useState<InsightBlock[]>([]);
  const [showMobileInsights, setShowMobileInsights] = useState(false);
  const [resetKey, setResetKey]           = useState(0);

  function handleNewInsights(incoming: InsightBlock[]) {
    setInsights((prev) => [...prev, ...incoming]);
  }

  const handleReset = useCallback(() => {
    setInsights([]);
    setResetKey(k => k + 1);
  }, []);

  return (
    <div className="flex h-[calc(100vh-56px)] bg-background relative">
      {/* ── Left panel — chat ─────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 border-r border-border/60 overflow-hidden">
        <ConsultoriaAgent
          key={resetKey}
          clientId={clientId}
          sessionId={sessionId || undefined}
          onNewInsights={handleNewInsights}
          onReset={handleReset}
          isAdmin={isAdmin}
        />
      </div>

      {/* ── Right panel — insights (desktop) ─────────────────────────────── */}
      <div className="w-80 shrink-0 hidden sm:block overflow-y-auto">
        <InsightsPanel insights={insights} onClear={handleReset} />
      </div>

      {/* ── Mobile: floating insights button ─────────────────────────────── */}
      <button
        type="button"
        onClick={() => setShowMobileInsights(true)}
        aria-label="Abrir painel de insights"
        className="sm:hidden fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-95 transition-all duration-150"
      >
        <Lightbulb className="w-6 h-6" />
        {insights.length > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-background border border-primary text-primary text-[11px] font-semibold leading-none">
            {insights.length}
          </span>
        )}
      </button>

      {/* ── Mobile: insights drawer/overlay ──────────────────────────────── */}
      {showMobileInsights && (
        <div className="sm:hidden fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
            <div className="flex items-center gap-2 text-primary">
              <Lightbulb className="w-5 h-5" />
              <span className="font-semibold text-sm tracking-wide uppercase">Insights</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="p-1.5 rounded-sm text-muted-foreground hover:text-red-400 transition-colors"
                title="Resetar conversa"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowMobileInsights(false)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <InsightsPanel insights={insights} onClear={handleReset} />
          </div>
        </div>
      )}
    </div>
  );
}
