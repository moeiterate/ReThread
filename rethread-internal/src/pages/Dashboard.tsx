import React from 'react';
import { NavLink } from 'react-router-dom';
import { CheckCircle2, FlaskConical, TrendingUp, ArrowRight } from 'lucide-react';

export const Dashboard = () => {
  return (
    <div className="space-y-24 animate-in fade-in duration-500 pt-12">
      
      {/* Hero Section */}
      <section className="max-w-4xl">
        <h1 className="text-7xl font-serif font-medium leading-[1.1] mb-8 tracking-tight text-[var(--text-main)]">
          Weaving Strategy <br />
          <span className="text-[var(--secondary)] italic font-serif">Into Software.</span>
        </h1>
        <p className="text-xl text-[var(--text-muted)] max-w-2xl leading-relaxed font-light mb-12">
          A structured approach to product development that bridges the gap between high-level strategy and daily execution.
        </p>
        
        <div className="flex gap-4">
            <NavLink to="/sprints" className="bg-[var(--primary)] text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
                View Active Sprints <ArrowRight className="w-4 h-4" />
            </NavLink>
            <NavLink to="/roadmap" className="bg-white border-2 border-[var(--text-main)] text-[var(--text-main)] px-8 py-4 rounded-full font-bold hover:bg-gray-50 transition-colors">
                Strategic Roadmap
            </NavLink>
        </div>
      </section>

      {/* Core Tenets */}
      <section>
        <div className="flex items-center gap-4 mb-12">
            <div className="h-px bg-gray-200 flex-1"></div>
            <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">Our Core Tenets</h2>
            <div className="h-px bg-gray-200 flex-1"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
                id: "01", 
                title: "Consulting Before Coding", 
                desc: "Code is a tool, not the product. We value impact over hours.",
                icon: CheckCircle2,
                color: "bg-blue-50 text-blue-600"
            },
            { 
                id: "02", 
                title: "Validate, Then Build", 
                desc: "We never build \"speculative\" products. Mockups sell the vision first.",
                icon: FlaskConical,
                color: "bg-orange-50 text-orange-600"
            },
            { 
                id: "03", 
                title: "Data Over Intuition", 
                desc: "Research is our spearhead for acquisition. Quantify the pain.",
                icon: TrendingUp,
                color: "bg-green-50 text-green-600"
            }
          ].map((item) => (
            <div key={item.id} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center mb-6`}>
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3 text-[var(--text-main)]">{item.title}</h3>
              <p className="text-[var(--text-muted)] leading-relaxed text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center text-xs text-gray-300 uppercase tracking-widest pt-12 pb-12">
        ReThread © 2026 Strategy Document
      </footer>
    </div>
  );
};
