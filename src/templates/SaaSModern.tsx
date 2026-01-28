import { ArrowRight, CheckCircle2, Menu, X } from 'lucide-react';
import { useState } from 'react';

export const SaaSModern = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <span className="font-bold text-xl tracking-tight">ReThread</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Product</a>
              <a href="#" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Solutions</a>
              <a href="#" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Pricing</a>
              <a href="#" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Docs</a>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <a href="#" className="text-slate-900 font-medium hover:text-indigo-600 transition-colors">Log in</a>
              <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-indigo-700 transition-all hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95">
                Get Started
              </button>
            </div>

            <button 
              className="md:hidden p-2 text-slate-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute w-full bg-white border-b border-slate-100 p-4 flex flex-col gap-4 shadow-xl">
            <a href="#" className="text-slate-600 font-medium">Product</a>
            <a href="#" className="text-slate-600 font-medium">Solutions</a>
            <a href="#" className="text-slate-600 font-medium">Pricing</a>
            <hr className="border-slate-100" />
            <a href="#" className="text-slate-900 font-medium">Log in</a>
            <button className="bg-indigo-600 text-white w-full py-3 rounded-lg font-medium">
              Get Started
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            
            {/* Left Content */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                New: AI-Powered Workflows
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6 text-slate-900">
                Supercharge your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">revenue growth</span>
              </h1>
              
              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
                Stop losing customers to friction. Our platform identifies, engages, and converts your most valuable visitors automatically.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <div className="relative flex-grow max-w-sm">
                  <input 
                    type="email" 
                    placeholder="Enter your work email" 
                    className="w-full h-12 px-4 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                  />
                </div>
                <button className="h-12 px-8 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 whitespace-nowrap">
                  Start Free Trial <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>14-day free trial</span>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="mt-16 lg:mt-0 relative">
              <div className="relative rounded-2xl bg-slate-900 p-2 shadow-2xl shadow-indigo-500/20 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl opacity-20 blur-lg"></div>
                <div className="relative bg-slate-800 rounded-xl overflow-hidden aspect-[4/3] flex items-center justify-center border border-slate-700">
                  {/* Abstract UI representation */}
                  <div className="w-full h-full p-8 flex flex-col gap-4">
                    <div className="flex gap-4 mb-4">
                      <div className="w-1/3 h-24 bg-slate-700/50 rounded-lg animate-pulse"></div>
                      <div className="w-1/3 h-24 bg-slate-700/50 rounded-lg animate-pulse delay-75"></div>
                      <div className="w-1/3 h-24 bg-slate-700/50 rounded-lg animate-pulse delay-150"></div>
                    </div>
                    <div className="flex-1 bg-slate-700/30 rounded-lg p-4">
                      <div className="w-3/4 h-4 bg-slate-600/50 rounded mb-3"></div>
                      <div className="w-1/2 h-4 bg-slate-600/50 rounded mb-3"></div>
                      <div className="w-full h-32 bg-gradient-to-tr from-indigo-500/20 to-violet-500/20 rounded-lg mt-4 border border-indigo-500/20 relative">
                         <div className="absolute bottom-4 left-4 right-4 h-16 bg-indigo-500/20 rounded blur-xl"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating element */}
              <div className="absolute -bottom-8 -left-8 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-4 animate-bounce-slow">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                  <span className="font-bold">+$</span>
                </div>
                <div>
                  <div className="text-sm text-slate-500">Revenue added</div>
                  <div className="font-bold text-slate-900">$12,450.00</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-8">Trusted by 750+ leading brands</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Placeholders for logos */}
             {['Acme Corp', 'GlobalBank', 'TechFlow', 'Nebula', 'Velocity'].map((name) => (
               <div key={name} className="text-xl font-bold text-slate-800 flex items-center gap-2">
                 <div className="w-6 h-6 bg-slate-800 rounded-full"></div>
                 {name}
               </div>
             ))}
          </div>
        </div>
      </section>
    </div>
  );
};
