import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, Trello, MessageSquare, Settings } from 'lucide-react';

export const Sidebar = () => {
  const links = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/roadmap", icon: Map, label: "Roadmap" },
    { to: "/backlog", icon: Trello, label: "Backlog" },
    { to: "/communications", icon: MessageSquare, label: "Communications" },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-[var(--line-color)] fixed left-0 top-0 flex flex-col z-50">
      <div className="p-8 pb-4">
        <div className="flex items-center gap-2 text-[var(--text-main)] mb-8">
             <svg viewBox="0 0 260 50" fill="none" stroke="currentColor" strokeWidth="0" className="h-6 w-auto text-[var(--text-main)]">
                <text x="0" y="35" fontFamily="'Playfair Display', serif" fontWeight="800" fontSize="38" fill="var(--text-main)">Re</text>
                <path d="M 50 26 C 55 26, 55 28, 62 25" stroke="var(--secondary)" strokeWidth="2" fill="none" strokeLinecap="round" />
                <g stroke="var(--primary)" strokeWidth="2" fill="none">
                    <path d="M 62 25 L 72 22 A 3 3 0 0 1 74 28 L 64 31 A 3 3 0 0 1 62 25 Z" />
                    <path d="M 69 23 L 79 20 A 3 3 0 0 1 81 26 L 71 29 A 3 3 0 0 1 69 23 Z" />
                    <path d="M 76 21 L 86 18 A 3 3 0 0 1 88 24 L 78 27 A 3 3 0 0 1 76 21 Z" />
                </g>
                <path d="M 86 21 C 92 20, 92 18, 98 18" stroke="var(--secondary)" strokeWidth="2" fill="none" strokeLinecap="round" />
                <text x="100" y="35" fontFamily="'Playfair Display', serif" fontWeight="800" fontSize="38" fill="var(--text-main)">Thread</text>
            </svg>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {links.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all group
                ${isActive 
                  ? 'bg-gray-100 text-[var(--primary)] font-bold' 
                  : 'text-[var(--text-muted)] hover:bg-gray-50'
                }
              `}
            >
              <link.icon className={`w-5 h-5 ${link.label === 'Roadmap' && 'text-[var(--secondary)]'}`} />
              <span className="text-sm tracking-wide">{link.label}</span>
            </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-[var(--line-color)]">
        <a href="#" className="flex items-center gap-3 px-4 py-3 text-[var(--text-muted)] hover:bg-gray-50 rounded-lg transition-all">
            <Settings className="w-5 h-5" />
            <span className="text-sm tracking-wide">Settings</span>
        </a>
      </div>
    </div>
  );
};
