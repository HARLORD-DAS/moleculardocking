import React from 'react';
import { Beaker, Microscope, Folder, CheckSquare, FileText, Zap, ArrowUpRight, TrendingUp } from 'lucide-react';

export const Dashboard: React.FC<{ onLoadProject: (id: string) => void }> = ({ onLoadProject }) => {
  const stats = [
    { label: 'Total Projects', value: 12, icon: <Folder className="w-5 h-5 text-cyan-400" />, change: '+2 this week' },
    { label: 'Uploaded Proteins', value: 8, icon: <Microscope className="w-5 h-5 text-indigo-400" />, change: '4 unique classes' },
    { label: 'Uploaded Ligands', value: 45, icon: <Beaker className="w-5 h-5 text-emerald-400" />, change: '15 lead optimized' },
    { label: 'Completed Analyses', value: 38, icon: <CheckSquare className="w-5 h-5 text-amber-400" />, change: '100% convergence' },
    { label: 'Optimization Reports', value: 14, icon: <FileText className="w-5 h-5 text-purple-400" />, change: 'Export-ready' },
    { label: 'High Priority Candidates', value: 6, icon: <Zap className="w-5 h-5 text-rose-400" />, change: 'Ready for Docking' },
  ];

  const recentAnalyses = [
    { name: 'EGFR + Erlotinib', date: '2 hours ago', prob: 94, decision: 'HIGH PRIORITY', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', id: 'egfr-erlotinib' },
    { name: 'COX-2 + Celecoxib', date: '5 hours ago', prob: 87, decision: 'HIGH PRIORITY', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', id: 'cox2-celecoxib' },
    { name: 'BRAF V600E + Vemurafenib', date: '1 day ago', prob: 91, decision: 'HIGH PRIORITY', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', id: 'braf-vemurafenib' },
    { name: 'HIV Protease + Ritonavir', date: '2 days ago', prob: 91, decision: 'MODERATE PRIORITY', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', id: 'hiv-ritonavir' },
  ];

  return (
    <div className="space-y-8 text-left">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Workspace Overview</h1>
        <p className="text-slate-400 text-sm">Real-time status of your molecular docking pre-screening campaigns.</p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {stats.map((s, idx) => (
          <div key={idx} className="glass-panel p-4 rounded-xl flex flex-col justify-between hover:border-slate-700/80 transition-all">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                {s.icon}
              </div>
              <span className="text-[10px] text-slate-400 font-semibold">{s.change}</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-white mb-0.5">{s.value}</div>
              <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Core Charts Simulation */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-white font-bold text-lg">Screening Quality Distribution</h3>
              <p className="text-slate-400 text-xs">Comparison of binding scores vs. chemical complexities across libraries.</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Pipeline Hit Rate: +350%</span>
            </div>
          </div>

          {/* Graph visual representation */}
          <div className="h-64 flex flex-col justify-between relative pt-4">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div className="w-full border-t border-slate-800/80 h-0" />
              <div className="w-full border-t border-slate-800/80 h-0" />
              <div className="w-full border-t border-slate-800/80 h-0" />
              <div className="w-full border-t border-slate-800/80 h-0" />
            </div>

            <div className="relative z-10 flex items-end justify-around h-full pb-2">
              {[
                { label: 'EGFR Target', val: 94, color: 'from-cyan-500 to-blue-500' },
                { label: 'COX-2 Target', val: 87, color: 'from-cyan-500 to-indigo-500' },
                { label: 'BRAF Mutant', val: 91, color: 'from-cyan-500 to-teal-500' },
                { label: 'HIV Protease', val: 78, color: 'from-blue-500 to-indigo-500' },
                { label: 'HER2 Target', val: 62, color: 'from-slate-600 to-slate-500' },
                { label: 'D2 Receptor', val: 45, color: 'from-slate-600 to-slate-500' }
              ].map((bar, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 group w-14">
                  <div className="text-[10px] text-cyan-400 font-extrabold opacity-0 group-hover:opacity-100 transition-opacity">
                    {bar.val}%
                  </div>
                  <div 
                    className={`w-8 bg-gradient-to-t ${bar.color} rounded-t-lg transition-all duration-1000 ease-out`}
                    style={{ height: `${bar.val * 1.8}px` }}
                  />
                  <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">
                    {bar.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Project Quick Access widget */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-white font-bold text-lg mb-1">Preloaded Target Studies</h3>
            <p className="text-slate-400 text-xs mb-6">Select a preset to load structure coordinates & AI analysis modules.</p>
          </div>

          <div className="space-y-3">
            {recentAnalyses.map((p, idx) => (
              <button
                key={idx}
                onClick={() => onLoadProject(p.id)}
                className="w-full p-3.5 bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-xl flex items-center justify-between group transition-all"
              >
                <div className="space-y-1 text-left">
                  <h4 className="text-slate-200 font-semibold text-sm group-hover:text-white transition-colors">{p.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-semibold">{p.date}</span>
                    <span className="text-[9px] w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span className="text-[10px] text-cyan-400 font-bold">Prob: {p.prob}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded border font-extrabold ${p.color}`}>
                    {p.decision.replace(' PRIORITY', '')}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
