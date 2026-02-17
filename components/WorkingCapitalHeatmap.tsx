
import React from 'react';
import { Map, TrendingDown, Target, Zap, Layers } from 'lucide-react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { SKU } from '../types';

interface Props {
  inventory: SKU[];
}

const WorkingCapitalHeatmap: React.FC<Props> = ({ inventory }) => {
  const catMap: Record<string, number> = {};
  inventory.forEach(i => {
    catMap[i.category || 'Other'] = (catMap[i.category || 'Other'] || 0) + Math.max(0, i.totalValue);
  });

  const treemapData = [
    {
      name: 'Capital Exposure',
      children: Object.entries(catMap).map(([name, value]) => ({
        name,
        size: value
      }))
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
           <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic">Working Capital Concentration View</h2>
           <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Global exposure heatmap by plant and strategic category</p>
        </div>
        <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-sm">
           <div className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Value Heatmap</div>
           <div className="px-5 py-2.5 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest">Risk Heatmap</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white rounded-[3rem] p-12 border border-slate-200 shadow-sm min-h-[600px] flex flex-col">
           <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-10">Strategic Exposure Heatmap</h4>
           <div className="flex-1">
             <ResponsiveContainer width="100%" height="100%">
               <Treemap 
                data={treemapData} 
                dataKey="size" 
                aspectRatio={4 / 3} 
                stroke="#fff" 
                fill="#1E293B"
               >
                 <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'}}
                    formatter={(val: number) => [`$${val.toLocaleString()}`, 'Exposure']}
                 />
               </Treemap>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="bg-[#1E293B] rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="relative z-10 space-y-8">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                   <Target className="text-rose-400" size={28} />
                </div>
                <div>
                   <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 mb-2 italic">Corporate Risk Alert</h5>
                   <p className="text-xl font-black italic tracking-tight leading-relaxed">
                     42% of C-Class capital is concentrated in 'Electronics' category. Higher-than-average leakage risk detected.
                   </p>
                </div>
                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                   <div>
                      <p className="text-2xl font-black italic text-rose-400">92%</p>
                      <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mt-1">Exposure Level</p>
                   </div>
                   <TrendingDown className="text-rose-400" size={32} />
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 blur-[100px] rounded-full"></div>
           </div>

           <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm space-y-8">
              <div className="flex items-center space-x-3">
                 <Layers className="text-indigo-600" size={20} />
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Aging concentration ({'>'}36M)</h4>
              </div>
              <div className="space-y-6">
                 {['Plant Alpha', 'Hub Beta', 'Central Hub'].map((loc, i) => (
                    <div key={loc} className="space-y-2">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                          <span className="text-slate-400">{loc}</span>
                          <span className="text-slate-900">{80 - (i*15)}%</span>
                       </div>
                       <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-slate-900" style={{ width: `${80 - (i*15)}%` }}></div>
                       </div>
                    </div>
                 ))}
              </div>
              <p className="text-[9px] text-slate-400 font-bold uppercase text-center leading-loose pt-4">
                CXO Strategic Summary Dispatching Enabled for this cluster.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default WorkingCapitalHeatmap;
