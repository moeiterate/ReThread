import React from 'react';
import { MessageSquare, Clock, Users } from 'lucide-react';

export const Communications = () => {
  return (
    <div className="animate-in fade-in duration-500">
      <h2 className="font-serif text-4xl mb-12 border-b-2 border-[var(--primary)] pb-8 text-[var(--primary)]">
        Communications Protocol
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Slack Channels */}
        <div>
          <h3 className="text-[var(--secondary)] font-bold text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> Slack Architecture
          </h3>
          <p className="mb-8 text-[var(--text-muted)]">
            Async-first. Sync-strategic. 
            <a href="https://app.slack.com/client/T0AAME65N1L/C0AAPF88674" target="_blank" className="text-[var(--primary)] font-bold ml-2 hover:underline">
              Open Workspace →
            </a>
          </p>

          <ul className="space-y-8">
            {[
              { channel: "#standup", desc: "Daily async updates (Yesterday, Today, Blockers)." },
              { channel: "#leads", desc: "Target tracking, cold outreach results, and pipeline updates." },
              { channel: "#research", desc: "NotebookLM insights, market data, and industry reports." },
              { channel: "#sprint-planning", desc: "Bi-weekly prioritization and validation gates." }
            ].map((item) => (
              <li key={item.channel} className="pl-6 border-l-2 border-[var(--line-color)]">
                <strong className="block text-[var(--primary)] mb-1">{item.channel}</strong>
                <span className="text-sm text-[var(--text-muted)]">{item.desc}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Rituals */}
        <div>
           <h3 className="text-[var(--secondary)] font-bold text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
            <Users className="w-4 h-4" /> Sync Rituals
          </h3>

           <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 mb-8">
                <div className="mb-8">
                    <strong className="font-serif text-2xl display block mb-2">Bi-Weekly Huddle</strong>
                    <div className="text-[var(--text-muted)] text-lg flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[var(--secondary)]" />
                        <div>
                            Every <strong>Tuesday</strong> & <strong>Thursday</strong>
                        </div>
                    </div>
                    <div className="mt-2 text-[var(--primary)] font-bold bg-blue-50 inline-block px-3 py-1 rounded">
                        10:00 AM - 10:15 AM MST
                    </div>
                </div>

                <a href="https://app.slack.com/client/T0AAME65N1L/C0ABHRD0L9E" target="_blank" className="block w-full text-center bg-[var(--primary)] text-white py-3 rounded-lg font-bold hover:bg-[var(--secondary)] transition-colors">
                    Join Standup Channel
                </a>
           </div>
        </div>
      </div>
    </div>
  );
};
