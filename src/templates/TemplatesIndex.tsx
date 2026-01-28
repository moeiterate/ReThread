import { Link } from 'react-router-dom';

export const TemplatesIndex = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">ReThread SaaS Templates</h1>
        <div className="space-y-4">
          <Link to="/templates/modern" className="block p-6 bg-white rounded-xl shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all group">
            <h2 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 mb-2">Modern SaaS (Split)</h2>
            <p className="text-slate-600">High contrast, split screen layout with abstract visuals. Good for B2B SaaS.</p>
          </Link>

          <Link to="/templates/centered" className="block p-6 bg-white rounded-xl shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all group">
            <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 mb-2">Clean / Centered</h2>
            <p className="text-slate-600">Classic "Stripe-like" centered layout with product dashboard focus. Trust building.</p>
          </Link>

          <Link to="/templates/dark" className="block p-6 bg-[#0B0C10] rounded-xl shadow-sm border border-gray-800 hover:border-emerald-500 hover:shadow-md transition-all group">
            <h2 className="text-xl font-bold text-white group-hover:text-emerald-400 mb-2">Developer / Dark</h2>
            <p className="text-gray-400">Dark mode, terminal aesthetic, technical focus. Good for dev tools.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};
