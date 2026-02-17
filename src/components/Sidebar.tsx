import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, Trello, MessageSquare, Settings, X, Zap, FileText, FileEdit, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

type SidebarProps = {
  mobileOpen?: boolean;
  onClose?: () => void;
};

export const Sidebar = ({ mobileOpen = false, onClose }: SidebarProps) => {
  const links = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/roadmap", icon: Map, label: "Roadmap" },
    { to: "/sprints", icon: Zap, label: "Active Sprint" },
    { to: "/backlog", icon: Trello, label: "Backlog" },
    { to: "/communications", icon: MessageSquare, label: "Communications" },
    { to: "/documents", icon: FileEdit, label: "Documents" },
    { to: "/articles", icon: FileText, label: "Articles" },
  ];

  return (
    <div
      className={[
        "w-64 h-screen bg-white border-r border-[var(--line-color)] fixed left-0 top-0 flex flex-col z-50",
        "transform transition-transform duration-200 ease-out md:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
      ].join(" ")}
      role="navigation"
      aria-label="Primary"
    >
      <div className="p-6 pb-4 md:p-8">
        <div className="flex items-center justify-between gap-2 text-[var(--text-main)] mb-6 md:mb-8">
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
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg border border-[var(--line-color)] bg-white text-[var(--text-main)]"
              onClick={onClose}
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {links.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              onClick={onClose}
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

      <div className="p-4 border-t border-[var(--line-color)] space-y-1">
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 text-[var(--text-muted)] hover:bg-gray-50 rounded-lg transition-all"
          onClick={(e) => {
            e.preventDefault();
            onClose?.();
          }}
        >
            <Settings className="w-5 h-5" />
            <span className="text-sm tracking-wide">Settings</span>
        </a>
        
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            onClose?.();
          }}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm tracking-wide">Logout</span>
        </button>
      </div>
    </div>
  );
};
