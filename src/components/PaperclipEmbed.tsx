import { ExternalLink, AlertTriangle } from 'lucide-react';

const EMBED_URL = import.meta.env.VITE_PAPERCLIP_EMBED_URL ?? 'https://basededados-paperclip.g653zr.easypanel.host';
const EMBED_TOKEN = import.meta.env.VITE_PAPERCLIP_EMBED_TOKEN ?? 'pk-paperclip-embed-2025-TOKEN-DY5G2Z1NF1';
const IFRAME_SRC = `${EMBED_URL}/?token=${EMBED_TOKEN}`;

const isMixedContent =
  typeof window !== 'undefined' &&
  window.location.protocol === 'https:' &&
  EMBED_URL.startsWith('http:');

export const PaperclipEmbed = () => {
  if (isMixedContent) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-5 text-center px-6">
        <div className="w-12 h-12 rounded-sm bg-yellow-500/10 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-yellow-400" />
        </div>
        <div className="space-y-1.5 max-w-sm">
          <p className="text-sm font-medium text-foreground">Mixed content bloqueado</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Este site usa HTTPS mas o Paperclip está em HTTP. O navegador bloqueia esse embed por segurança.
          </p>
        </div>
        <a
          href={IFRAME_SRC}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Abrir Paperclip em nova aba
        </a>
      </div>
    );
  }

  return (
    <iframe
      src={IFRAME_SRC}
      title="Paperclip Dashboard"
      className="w-full h-full"
      style={{ border: 'none', background: '#000', display: 'block' }}
      allow="camera; microphone; clipboard-read; clipboard-write"
    />
  );
};
