import React from 'react';
import { ExternalLink } from 'lucide-react';

export const Sprints = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
      <div className="max-w-2xl">
        <h2 className="font-serif text-5xl mb-6">Central Command</h2>
        <p className="text-xl text-[var(--text-muted)] mb-12 leading-relaxed">
            <strong>The single source of truth.</strong><br/>
            All new leads start in the <em>Backlog</em>. Use <em>Comments</em> for async updates. <br/>
            If it's not in Trello, it doesn't exist.
        </p>

        <a 
            href="https://trello.com/invite/b/6974090f27a8fbaf8c11e6f8/ATTIff9ca1d998508cd51b5e4c9c60e8c619D680FE6E/rethread-sprint-board" 
            target="_blank"
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-3 bg-[var(--secondary)] text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:-translate-y-1 transition-all"
        >
            <ExternalLink className="w-5 h-5" />
            Access Live Sprint Board
        </a>

        <div className="mt-16 p-4 bg-gray-50 rounded-xl border border-[var(--line-color)] inline-block">
            <div className="text-sm text-[var(--text-muted)] uppercase tracking-widest mb-2 font-bold">Current Sprint Status</div>
            <div className="flex items-center gap-2 justify-center">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                Active: Sprint 1 (Transportation)
            </div>
        </div>
      </div>
    </div>
  );
};
