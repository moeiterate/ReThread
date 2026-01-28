import { Terminal, Cpu, Box, ChevronRight, Activity } from 'lucide-react';

export const SaaSDark = () => {
  return (
    <div className="min-h-screen bg-[#0B0C10] font-mono text-gray-300 selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Top Bar */}
      <div className="border-b border-gray-800 bg-[#0B0C10]/80 backdrop-blur-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold tracking-wider">
            <Terminal className="w-5 h-5 text-emerald-400" />
            RETHREAD_IO
          </div>
          <div className="hidden md:flex gap-8 text-sm">
            <a href="#" className="hover:text-emerald-400 transition-colors">Documentation</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">API Reference</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Pricing</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Github</a>
          </div>
          <div className="flex gap-4 items-center">
            <a href="#" className="text-sm hover:text-white transition-colors">Sign in</a>
            <button className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-1.5 rounded text-sm font-bold transition-colors">
              Start Building
            </button>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            SYSTEM OPERATIONAL
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
            Infrastructure at <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Lightning Speed
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Managed Redis, Postgres, and Kafka instances with microsecond latency.
            Deploy regionally, scale globally. No DevOps required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button className="h-12 px-8 rounded bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all w-full sm:w-auto flex items-center justify-center gap-2">
              Deploy Database <ChevronRight className="w-4 h-4" />
            </button>
            <div className="relative group">
               <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded opacity-50 blur group-hover:opacity-75 transition duration-200"></div>
               <button className="relative h-12 px-8 rounded bg-[#0B0C10] text-white border border-gray-800 font-bold hover:bg-gray-900 transition-all w-full sm:w-auto flex items-center justify-center gap-2">
                 $ npm install rethread
               </button>
            </div>
          </div>

          {/* Terminal / Code Preview */}
          <div className="relative max-w-3xl mx-auto">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-emerald-500/20 blur-[100px] rounded-full"></div>
             
             <div className="relative bg-[#1a1b26] rounded-lg border border-gray-800 shadow-2xl overflow-hidden text-left font-mono text-sm">
                <div className="flex items-center justify-between px-4 py-3 bg-[#13141f] border-b border-gray-800">
                   <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                   </div>
                   <div className="text-gray-500 text-xs">bash — 80x24</div>
                </div>
                <div className="p-6 space-y-2 text-gray-300">
                   <div className="flex">
                      <span className="text-emerald-500 mr-2">➜</span>
                      <span>npm install @rethread/core</span>
                   </div>
                   <div className="text-gray-500">
                      + @rethread/core@2.4.0 <br/>
                      added 14 packages in 0.8s
                   </div>
                   <div className="flex mt-4">
                      <span className="text-emerald-500 mr-2">➜</span>
                      <span>rethread init --region eu-west-1</span>
                   </div>
                   <div className="text-gray-500">
                      <span className="text-blue-400">ℹ</span> Detecting project configuration...<br/>
                      <span className="text-green-400">✔</span> Next.js 14 detected<br/>
                      <span className="text-green-400">✔</span> Creating config file...<br/>
                      <span className="text-emerald-500">✔ Project initialized successfully!</span>
                   </div>
                   <div className="flex mt-4">
                      <span className="text-emerald-500 mr-2">➜</span>
                      <span className="w-2 h-5 bg-gray-500 animate-pulse block"></span>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>

      {/* Grid Stats */}
      <div className="border-t border-gray-800 bg-[#0F1014]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded border border-gray-800 bg-[#0B0C10] hover:border-emerald-500/50 transition-colors">
              <Activity className="w-8 h-8 text-emerald-500 mb-4" />
              <div className="text-3xl font-bold text-white mb-1">99.99%</div>
              <div className="text-gray-500">Uptime SLA Guarantee</div>
            </div>
            <div className="p-6 rounded border border-gray-800 bg-[#0B0C10] hover:border-emerald-500/50 transition-colors">
              <Cpu className="w-8 h-8 text-emerald-500 mb-4" />
              <div className="text-3xl font-bold text-white mb-1">&lt; 10ms</div>
              <div className="text-gray-500">Global Read Latency</div>
            </div>
            <div className="p-6 rounded border border-gray-800 bg-[#0B0C10] hover:border-emerald-500/50 transition-colors">
              <Box className="w-8 h-8 text-emerald-500 mb-4" />
              <div className="text-3xl font-bold text-white mb-1">Infinite</div>
              <div className="text-gray-500">Automatic Scaling</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
