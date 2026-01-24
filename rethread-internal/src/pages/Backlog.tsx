import React from 'react';
import { Plus, MoreHorizontal, Layers } from 'lucide-react';

export const Backlog = () => {
  const backlogItems = [
    { id: 1, title: "Research transportation vertical competitors", priority: "HIGH", status: "TODO" },
    { id: 2, title: "Build demo for NEMT dispatch", priority: "HIGH", status: "IN_PROGRESS" },
    { id: 3, title: "Outreach script for Hudson replacement pitch", priority: "MEDIUM", status: "TODO" },
    { id: 4, title: "Set up analytics for demo tracking", priority: "LOW", status: "TODO" },
  ];

  const priorityColors = {
    HIGH: "bg-red-50 text-red-600 border-red-200",
    MEDIUM: "bg-yellow-50 text-yellow-600 border-yellow-200",
    LOW: "bg-gray-50 text-gray-600 border-gray-200"
  };

  const statusColors = {
    TODO: "bg-gray-100 text-gray-600",
    IN_PROGRESS: "bg-blue-100 text-blue-600",
    DONE: "bg-green-100 text-green-600"
  };

  return (
    <div className="animate-in fade-in duration-500 pt-8">
      <div className="flex justify-between items-start mb-12">
        <div>
          <h2 className="font-serif text-4xl text-[var(--text-main)] mb-2">Backlog</h2>
          <p className="text-[var(--text-muted)]">Ideas, tasks, and initiatives waiting to be prioritized.</p>
        </div>
        <button className="bg-[var(--primary)] text-white px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      {backlogItems.length > 0 ? (
        <div className="space-y-3">
          {backlogItems.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-xl border border-gray-100 hover:shadow-md transition-shadow group flex items-center gap-4"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-gray-100 transition-colors">
                <Layers className="w-4 h-4" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium text-[var(--text-main)] mb-1">{item.title}</h3>
                <div className="flex gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${priorityColors[item.priority as keyof typeof priorityColors]} uppercase tracking-wider`}>
                    {item.priority}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${statusColors[item.status as keyof typeof statusColors]} uppercase tracking-wider`}>
                    {item.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <button className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-16 text-center border border-gray-100 border-dashed">
          <Layers className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No items in backlog yet.</p>
          <p className="text-gray-400 text-sm mt-2">Add ideas and tasks that need to be prioritized.</p>
        </div>
      )}
    </div>
  );
};
