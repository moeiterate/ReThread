import { ChevronRight, Play, Shield, Zap, Globe } from 'lucide-react';

export const SaaSCentered = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* Navbar */}
      <nav className="border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-bold text-xl flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-sm"></div>
            ReThread
          </div>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-blue-600">Features</a>
            <a href="#" className="hover:text-blue-600">Testimonials</a>
            <a href="#" className="hover:text-blue-600">Pricing</a>
          </div>
          <div className="flex gap-3">
             <button className="text-sm font-medium text-slate-600 hover:text-slate-900">Log in</button>
             <button className="text-sm font-medium bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800">Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          
          <a href="#" className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-8 hover:bg-blue-100 transition-colors">
            <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
            v2.0 is now live: See what's new <ChevronRight className="w-3 h-3" />
          </a>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6">
            Turn buying signals into <br/>
            <span className="text-blue-600">booked conversations</span>
          </h1>

          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            ReThread finds high-intent leads across your entire digital footprint, then arms your sales team with AI-crafted outreach that actually converts.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button className="h-12 px-8 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-600/20 w-full sm:w-auto">
              Start Free Trial
            </button>
            <button className="h-12 px-8 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-all flex items-center justify-center gap-2 w-full sm:w-auto">
              <Play className="w-4 h-4 fill-slate-700" /> Watch Demo
            </button>
          </div>

          {/* Hero Image / Dashboard Preview */}
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute -inset-1 bg-gradient-to-b from-blue-100 to-white rounded-2xl blur-xl opacity-50"></div>
            <div className="relative rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden aspect-[16/9] flex flex-col">
              {/* Fake Browser Header */}
              <div className="h-10 bg-slate-50 border-b border-slate-200 flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                </div>
                <div className="flex-1 text-center text-xs text-slate-400 font-mono">dashboard.rethread.com</div>
              </div>
              {/* Fake Dashboard Content */}
              <div className="flex-1 bg-slate-50 p-6 flex gap-6">
                 {/* Sidebar */}
                 <div className="w-48 hidden sm:block">
                    <div className="h-8 w-32 bg-slate-200 rounded mb-6"></div>
                    <div className="space-y-3">
                      <div className="h-4 w-full bg-slate-200 rounded"></div>
                      <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
                      <div className="h-4 w-5/6 bg-slate-200 rounded"></div>
                    </div>
                 </div>
                 {/* Main Area */}
                 <div className="flex-1 bg-white rounded-lg shadow-sm border border-slate-100 p-6">
                    <div className="flex justify-between items-center mb-8">
                      <div className="h-8 w-48 bg-slate-100 rounded"></div>
                      <div className="h-8 w-24 bg-blue-600/10 rounded"></div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-8">
                       <div className="h-24 bg-slate-50 rounded border border-slate-100"></div>
                       <div className="h-24 bg-slate-50 rounded border border-slate-100"></div>
                       <div className="h-24 bg-slate-50 rounded border border-slate-100"></div>
                    </div>
                    <div className="space-y-4">
                       {[1,2,3].map(i => (
                         <div key={i} className="h-16 w-full bg-white border border-slate-100 rounded flex items-center px-4 gap-4">
                            <div className="h-8 w-8 rounded-full bg-slate-100"></div>
                            <div className="flex-1">
                               <div className="h-3 w-32 bg-slate-100 rounded mb-1"></div>
                               <div className="h-2 w-24 bg-slate-50 rounded"></div>
                            </div>
                            <div className="h-6 w-20 bg-green-100 rounded-full"></div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-3">Instant Deployment</h3>
              <p className="text-slate-600 leading-relaxed">Connect your data sources in minutes, not months. No engineering resources required.</p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-3">Enterprise Security</h3>
              <p className="text-slate-600 leading-relaxed">SOC2 Type II certified. Your data is encrypted at rest and in transit.</p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 mb-6">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-3">Global Infrastructure</h3>
              <p className="text-slate-600 leading-relaxed">Low latency access from anywhere in the world with our distributed edge network.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
