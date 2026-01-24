import { useEffect } from 'react';
import { ExternalLink, Trello } from 'lucide-react';

declare global {
  interface Window {
    TrelloBoards?: {
      load?: (root?: Document | HTMLElement, options?: { allAnchors?: boolean }) => void;
    };
  }
}

export const Backlog = () => {
  // Trello blocks embedding the full interactive board in an iframe (security headers).
  // The supported approach is Trello's embed script, which renders a compact board preview.
  const boardShortId = 'm47dQixP';
  const trelloBoardUrl = `https://trello.com/b/${boardShortId}/rethread-sprint-board`;
  const trelloEmbedScriptSrc = 'https://p.trellocdn.com/embed.min.js';

  useEffect(() => {
    const load = () => window.TrelloBoards?.load?.(document, { allAnchors: false });

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${trelloEmbedScriptSrc}"]`
    );

    if (existing) {
      load();
      return;
    }

    const script = document.createElement('script');
    script.src = trelloEmbedScriptSrc;
    script.async = true;
    script.onload = load;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="animate-in fade-in duration-500 pt-8">
      {/* Trello Board Embed - Show FIRST */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden mb-12">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-serif text-xl font-bold flex items-center gap-2">
            <Trello className="w-6 h-6 text-[#0079BF]" />
            Live Sprint Board
          </h3>
          <span className="text-xs text-[var(--text-muted)]">
            Preview here — open Trello to edit
          </span>
        </div>
        
        <div className="p-6">
          <blockquote className="trello-board-compact">
            <a href={trelloBoardUrl}>ReThread Sprint Board</a>
          </blockquote>
          <p className="mt-3 text-sm text-[var(--text-muted)]">
            If the preview doesn’t load (ad blockers / CSP), use the button below to open Trello.
          </p>
        </div>
      </div>

      {/* Command Center - Show BELOW board */}
      <div className="bg-[var(--primary)] text-white py-24 px-12 rounded-2xl mb-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-5xl mb-6">Central Command</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            <strong>The single source of truth.</strong><br />
            All new leads start in the <em>Backlog</em>. Use <em>Comments</em> for async updates. Move your own cards.<br />
            If it's not in Trello, it doesn't exist. Shared diligence drives our speed.
          </p>
        </div>

        <div className="flex justify-center">
          <a 
            href={trelloBoardUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[var(--secondary)] text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-3 hover:opacity-90 transition-opacity shadow-xl"
          >
            <ExternalLink className="w-5 h-5" />
            Open Full Board in New Tab →
          </a>
        </div>
      </div>
    </div>
  );
};
