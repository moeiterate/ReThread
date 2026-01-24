import React from 'react';
import roadmapData from '../roadmap.json';

export const Roadmap = () => {
  return (
    <div className="animate-in fade-in duration-500 pt-8">
      <h2 className="font-serif text-3xl mb-8 font-medium border-t border-[var(--line-color)] pt-12 mt-12">
        Strategic Roadmap
      </h2>
      
      <div className="border-t-2 border-b-2 border-[var(--text-main)] divide-y divide-[var(--line-color)]">
        {roadmapData.sprints.map((sprint, idx) => (
          <div key={idx} className="grid grid-cols-[150px_1fr_1fr] py-8">
            <div className={`font-bold text-sm uppercase tracking-widest mt-1 ${
              sprint.label === 'Sprint 1' ? 'text-[var(--secondary)]' : 'text-[var(--text-muted)]'
            }`}>
              {sprint.label}
            </div>
            
            <div className="pr-8">
              <strong className="block font-serif text-xl mb-2">{sprint.title}</strong>
              <span className="text-[var(--text-muted)]">{sprint.date}</span>
            </div>

            <div className="text-[var(--text-muted)]">
              {sprint.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
