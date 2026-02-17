
import React from 'react';
import { Repeat, MapPin, ArrowRightLeft, ShieldCheck, DollarSign } from 'lucide-react';
import { SKU } from '../types';

interface Props {
  inventory: SKU[];
}

const ReuseIntelligence: React.FC<Props> = ({ inventory }) => {
  const transferOps = [
    { sku: 'SKU-1022', from: 'Hub Alpha', to: 'Plant Beta', confidence: 94, savings: 12400, feasibility: 'High' },
    { sku: 'SKU-1045', from: 'Plant Gamma', to: 'Hub Alpha', confidence: 88, savings: 8900, feasibility: 'Med' },
    { sku: 'SKU-1008', from: 'Hub Alpha', to: 'Central Hub', confidence: 91, savings: 15200, feasibility: 'High' },
    { sku: 'SKU-1033', from: 'Regional Depot', to: 'Plant Delta', confidence: 76, savings: 4300, feasibility: 'Low' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-[#1E293B] rounded-[2.5rem] p-12 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
           <div className="space-y-6 max-w-xl">
             <div className="flex items-center space-x-3">
               <div className="p-2 bg-indigo-500 rounded-xl"><Repeat size={24} /></div>
               <h2 className="text-3xl font-black italic tracking-tighter">Enterprise Coordination</h2>
             </div>
             <p className="text-slate-400 text-sm font-medium leading-relaxed">
               Analyzing idle clusters against active demand vectors. These transfer recommendations prioritize internal fulfillment over external procurement.
             </p>
             <div className="flex items-center space-x-8">
               <div>
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Potential Savings</p>
                  <p className="text-2xl font-black italic">$41.2k</p>
               </div>
               <div className="w-px h-10 bg-slate-700"></div>
               <div>
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Coordination Score</p>
                  <p className="text-2xl font-black italic">82%</p>
               </div>
             </div>
           </div>
           <div className="w-full md:w-auto">
              <div className="bg-white/5 backdrop-blur-md rounded-[2rem] p-8 border border-white/10 space-y-6">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Feasibility Matrix</h4>
                 <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                       <p className="text-[10px] font-black text-indigo-400 uppercase mb-1">High ROI</p>
                       <p className="text-xl font-black">12</p>
                    </div>
                    <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                       <p className="text-[10px] font-black text-emerald-400 uppercase mb-1">Approved</p>
                       <p className="text-xl font-black">4</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] -mr-64 -mt-64"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
           <div className="px-10 py-6 border-b border-slate-100 flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Recommended Transfers</h4>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Updated 4m ago</span>
           </div>
           <div className="divide-y divide-slate-50">
             {transferOps.map(op => (
               <div key={op.sku} className="p-8 flex items-center justify-between hover:bg-slate-50 transition-all group">
                  <div className="flex items-center space-x-8">
                     <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                        <MapPin size={24} />
                     </div>
                     <div className="space-y-1">
                        <p className="text-xs font-black text-slate-900">{op.sku}</p>
                        <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-400">
                           <span className="uppercase">{op.from}</span>
                           <ArrowRightLeft size={10} />
                           <span className="uppercase">{op.to}</span>
                        </div>
                     </div>
                  </div>
                  
                  <div className="flex items-center space-x-12">
                     <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Match Confidence</p>
                        <div className="flex items-center space-x-2">
                           <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-600" style={{ width: `${op.confidence}%` }}></div>
                           </div>
                           <span className="text-[10px] font-black text-indigo-600">{op.confidence}%</span>
                        </div>
                     </div>
                     <div className="text-right w-24">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">ROI Est.</p>
                        <p className="text-xs font-black text-emerald-600">+${op.savings.toLocaleString()}</p>
                     </div>
                     <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/10 hover:scale-105 transition-all">Initiate</button>
                  </div>
               </div>
             ))}
           </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center space-x-3 mb-6">
                 <ShieldCheck className="text-emerald-500" size={20} />
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Logistics Complexity Factor</h4>
              </div>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed mb-6 italic uppercase">
                 Weighted calculation accounting for freight cost, customs (if applicable), and lead time impact of the internal transfer vs. new buy.
              </p>
              <div className="space-y-3">
                 <div className="flex justify-between text-[9px] font-black uppercase">
                    <span className="text-slate-400">Low Complexity</span>
                    <span className="text-emerald-600">62% of Ops</span>
                 </div>
                 <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: '62%' }}></div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ReuseIntelligence;
