import React from 'react';
import roadmapData from '../roadmap.json';
import { Plus, GripVertical } from 'lucide-react';

export const Roadmap = () => {
  // Group by quarter
  const quarters = ['Q1 2026', 'Q2 2026', 'Q3 2026'];
  const groupedData = quarters.map(q => ({
    quarter: q,
    items: roadmapData.initiatives.filter(i => i.quarter === q)
  }));

  return (
    <div className="animate-in fade-in duration-500 pt-8">
      <div className="flex justify-between items-start mb-16">
        <div>
            <h2 className="font-serif text-4xl text-[var(--text-main)] mb-2">Strategic Roadmap</h2>
            <p className="text-[var(--text-muted)]">Long-term vision and quarterly goals.</p>
        </div>
        <button className="bg-[var(--secondary)] text-white px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-orange-100">
            <Plus className="w-4 h-4" /> Add Initiative
        </button>
      </div>

      <div className="space-y-12">
        {groupedData.map((group) => (
          <div key={group.quarter} className="relative pl-8 border-l-2 border-dashed border-gray-200 pb-8 last:border-0">
            {/* Quarter Dot */}
            <div className="absolute left-[-9px] top-0 w-4 h-4 bg-[var(--secondary)] rounded-full border-4 border-white shadow-sm"></div>
            
            <h3 className="font-serif text-2xl font-bold text-[var(--text-main)] mb-6 leading-none">{group.quarter}</h3>

            {group.items.length > 0 ? (
                <div className="space-y-4">
                    {group.items.map((item) => (
                        <div key={item.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex gap-4 items-start">
                             <div className="mt-1 text-gray-300 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
                                <GripVertical className="w-5 h-5" />
                             </div>
                             <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-serif text-xl font-bold text-[var(--text-main)]">{item.title}</h4>
                                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                                        {item.status}
                                    </span>
                                </div>
                                <p className="text-[var(--text-muted)] text-sm">{item.description}</p>
                             </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-100 border-dashed">
                    <p className="text-gray-400 italic">No initiatives planned for this quarter.</p>
                </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
