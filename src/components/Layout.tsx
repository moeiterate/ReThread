import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';

export const Layout = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <div className="texture"></div>

      {/* Mobile top bar (does not affect desktop) */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white/90 backdrop-blur border-b border-[var(--line-color)] z-40">
        <div className="h-full px-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-[var(--line-color)] bg-white text-[var(--text-main)]"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="font-serif text-lg font-semibold text-[var(--text-main)]">
            ReThread
          </div>
          <div className="w-10" />
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <main className="flex-1 min-w-0 pt-16 md:pt-0 md:ml-64 px-4 py-6 sm:px-6 md:p-12 max-w-5xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
};
