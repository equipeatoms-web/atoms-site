import { useEffect, useRef, useState } from 'react';
import {
  Sparkles,
  Tag,
  Layers,
  PenTool,
  Settings,
  TrendingUp,
  Info,
  RotateCcw,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InsightBlock {
  id: string;
  category: 'brand' | 'posicionamento' | 'stack' | 'logo' | 'operacao' | 'geral';
  title: string;
  body: string;
  tags: string[];
  createdAt: Date;
}

export interface InsightsPanelProps {
  insights: InsightBlock[];
  onClear?: () => void;
}

// ─── Category config ──────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<
  InsightBlock['category'],
  { label: string; badgeClass: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  brand: {
    label: 'Brand',
    badgeClass: 'bg-primary/15 text-primary',
    Icon: Sparkles,
  },
  posicionamento: {
    label: 'Posicionamento',
    badgeClass: 'bg-purple-500/15 text-purple-400',
    Icon: TrendingUp,
  },
  stack: {
    label: 'Stack',
    badgeClass: 'bg-blue-500/15 text-blue-400',
    Icon: Layers,
  },
  logo: {
    label: 'Logo',
    badgeClass: 'bg-yellow-500/15 text-yellow-400',
    Icon: PenTool,
  },
  operacao: {
    label: 'Operação',
    badgeClass: 'bg-green-500/15 text-green-400',
    Icon: Settings,
  },
  geral: {
    label: 'Geral',
    badgeClass: 'bg-card/60 text-muted-foreground',
    Icon: Info,
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(date: Date): string {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

// ─── InsightCard ──────────────────────────────────────────────────────────────

interface InsightCardProps {
  block: InsightBlock;
  isNew: boolean;
}

function InsightCard({ block, isNew }: InsightCardProps) {
  const [visible, setVisible] = useState(!isNew);
  const { label, badgeClass, Icon } = CATEGORY_CONFIG[block.category];

  useEffect(() => {
    if (isNew) {
      // Defer to next frame so the opacity-0 base class is applied first
      const raf = requestAnimationFrame(() => {
        setVisible(true);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isNew]);

  return (
    <div
      className={`
        bg-card/60 border border-border/60 rounded-sm px-4 py-3.5 space-y-2.5
        transition-all duration-500 ease-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
      `}
    >
      {/* Top row: category badge + timestamp */}
      <div className="flex items-center justify-between gap-2">
        <span
          className={`inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide px-2 py-0.5 rounded-sm ${badgeClass}`}
        >
          <Icon className="w-3 h-3 shrink-0" />
          {label}
        </span>
        <span className="text-[10px] text-muted-foreground/60 tabular-nums shrink-0">
          {formatTime(block.createdAt)}
        </span>
      </div>

      {/* Title */}
      <p className="text-sm font-semibold text-foreground leading-snug">
        {block.title}
      </p>

      {/* Body */}
      <p className="text-xs text-muted-foreground leading-relaxed">
        {block.body}
      </p>

      {/* Tags */}
      {block.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {block.tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 text-[10px] text-muted-foreground/70 border border-border/60 px-1.5 py-0.5 rounded-sm"
            >
              <Tag className="w-2.5 h-2.5" />
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── InsightsPanel ────────────────────────────────────────────────────────────

export function InsightsPanel({ insights, onClear }: InsightsPanelProps) {
  const prevLengthRef = useRef(insights.length);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());

  // Track which cards are newly added so they get the enter animation
  useEffect(() => {
    if (insights.length > prevLengthRef.current) {
      const added = insights
        .slice(prevLengthRef.current)
        .map(b => b.id);
      setNewIds(prev => new Set([...prev, ...added]));

      // Clean up after animation completes (500ms transition + 100ms buffer)
      const timer = setTimeout(() => {
        setNewIds(prev => {
          const next = new Set(prev);
          added.forEach(id => next.delete(id));
          return next;
        });
      }, 700);

      prevLengthRef.current = insights.length;
      return () => clearTimeout(timer);
    }
    prevLengthRef.current = insights.length;
  }, [insights]);

  // Newest first
  const sorted = [...insights].reverse();

  return (
    <div className="flex flex-col h-full bg-background border-l border-border/60">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-border/60 flex items-center gap-3 shrink-0">
        <div className="w-7 h-7 rounded-sm bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
        </div>
        <span className="text-sm font-semibold text-foreground tracking-wide">
          Insights
        </span>
        {insights.length > 0 && (
          <span className="text-[10px] font-medium text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-sm tabular-nums">
            {insights.length}
          </span>
        )}
        {onClear && insights.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="ml-auto p-1.5 rounded-sm text-muted-foreground hover:text-red-400 transition-colors"
            title="Resetar conversa e insights"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {sorted.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground/50 tracking-wide select-none">
              ÁTOM está ouvindo.
            </p>
          </div>
        ) : (
          sorted.map(block => (
            <InsightCard
              key={block.id}
              block={block}
              isNew={newIds.has(block.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
