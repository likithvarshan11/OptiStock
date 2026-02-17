
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Target, Info, ShieldAlert, Cpu } from 'lucide-react';
import { SKU } from '../types';

interface Props {
  inventory: SKU[];
}

const ForwardRiskOutlook: React.FC<Props> = ({ inventory }) => {
  const forecastData = [
    { period: 'Now', actual: 420, forecast: 420 },
    { period: '+3m', forecast: 480, upper: 510, lower: 450 },
    { period: '+6m', forecast: 560, upper: 620, lower: 500 },
    { period: '+9m', forecast: 680, upper: 760, lower: 600 },
    { period: '+12m', forecast: 810, upper: 920, lower: 700 },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm">
           <div className="flex items-center justify-between mb-10">
              <div className="flex items-center space-x-4">
                 <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-sm"><Cpu size={24} /></div>
                 <div>
                    <h3 className="text-xl font-black text-slate-900 italic tracking-tighter">Predictive Obsolescence Outlook</h3>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">AI-driven 12-month forward capital exposure projection</p>
                 </div>
              </div>
              <div className="flex items-center space-x-2 text-[9px] font-black text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100 uppercase tracking-widest">
                 <ShieldAlert size={14} />
                 <span>Advisory Projection — No Auto-Action</span>
              </div>
           </div>

           <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={forecastData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                       <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366F1" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="#F1F5F9" strokeDasharray="5 5" />
                    <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 'bold'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10}} />
                    <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'}} />
                    <Area type="monotone" dataKey="forecast" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorForecast)" />
                    <Area type="monotone" dataKey="upper" stroke="none" fill="#6366F1" fillOpacity={0.05} />
                    <Area type="monotone" dataKey="lower" stroke="none" fill="#6366F1" fillOpacity={0.05} />
                    <ReferenceLine x="Now" stroke="#1E293B" strokeDasharray="3 3" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="space-y-8 relative z-10">
                 <div className="flex items-center space-x-2">
                    <Target className="text-indigo-400" size={20} />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] italic">Projection Highlights</h4>
                 </div>
                 <div className="space-y-6">
                    <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                       <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2">High Confidence Shift</p>
                       <p className="text-sm font-black text-white italic">SKU-1092 → Non-Moving (92% Prob.)</p>
                       <p className="text-[8px] text-slate-500 font-bold uppercase mt-2">Driver: Tech Substitution Cycle</p>
                    </div>
                    <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                       <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2">Portfolio Drift</p>
                       <p className="text-sm font-black text-white italic">+14% A-Class Dormancy risk by Q4</p>
                    </div>
                 </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[120px] rounded-full"></div>
           </div>

           <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm flex items-start space-x-4">
              <Info className="text-slate-400 shrink-0 mt-1" size={18} />
              <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-wide">
                 Models use ML-driven sentiment analysis from procurement logs and seasonal demand vectors to calculate drift probability.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ForwardRiskOutlook;
