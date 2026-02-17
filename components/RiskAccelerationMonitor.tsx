
import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
import { TrendingUp, AlertCircle, Clock, MoveUpRight } from 'lucide-react';
import { SKU } from '../types';

interface Props {
  inventory: SKU[];
}

const RiskAccelerationMonitor: React.FC<Props> = ({ inventory }) => {
  const riskTrendData = [
    { month: 'Jul 23', risk: 12, acceleration: 2 },
    { month: 'Aug 23', risk: 14, acceleration: 2.5 },
    { month: 'Sep 23', risk: 13, acceleration: -1 },
    { month: 'Oct 23', risk: 15, acceleration: 3 },
    { month: 'Nov 23', risk: 19, acceleration: 4.5 },
    { month: 'Dec 23', risk: 24, acceleration: 6 },
    { month: 'Jan 24', risk: 28, acceleration: 8.2 },
  ];

  const emergingRisks = inventory.filter(i => {
    const days = Math.floor((new Date().getTime() - new Date(i.lastSaleDate).getTime()) / (1000 * 3600 * 24));
    return days > 60 && days < 120 && i.abcClass === 'A';
  }).slice(0, 5);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Risk Momentum Chart */}
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
             <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Risk Momentum Index</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">QoQ acceleration of inventory dormancy</p>
             </div>
             <div className="bg-rose-50 px-4 py-2 rounded-2xl flex items-center space-x-2 border border-rose-100">
                <MoveUpRight className="text-rose-600" size={16} />
                <span className="text-xs font-black text-rose-600">+8.2% acceleration</span>
             </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={riskTrendData}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'}}
                />
                <Area type="monotone" dataKey="risk" stroke="#EF4444" strokeWidth={3} fillOpacity={1} fill="url(#colorRisk)" />
                <Line type="monotone" dataKey="acceleration" stroke="#6366F1" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Emerging Risk Panel */}
        <div className="lg:col-span-4 bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
           <div className="relative z-10 space-y-8">
              <div className="flex items-center space-x-3">
                 <div className="p-2 bg-rose-500 rounded-lg"><AlertCircle size={20} /></div>
                 <h4 className="text-sm font-black uppercase tracking-widest">Emerging Risk SKUs</h4>
              </div>
              
              <div className="space-y-4">
                {emergingRisks.map(sku => (
                  <div key={sku.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-black text-white">{sku.id}</span>
                      <span className="text-[8px] font-black text-rose-400 uppercase tracking-widest">Dormancy Spike</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium truncate">{sku.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                       <span className="text-[10px] font-black text-white">${sku.totalValue.toLocaleString()}</span>
                       <div className="flex items-center space-x-1 text-[8px] font-black text-rose-400">
                          <Clock size={10} />
                          <span>94 Days Idle</span>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="text-[9px] text-slate-500 font-bold uppercase text-center tracking-widest leading-loose">
                Identifying future NHC before capital lock. Strategic alerts generated via early-warning drift detection.
              </p>
           </div>
           <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-rose-500/10 blur-[100px] rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default RiskAccelerationMonitor;
