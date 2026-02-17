
import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileBarChart, ShieldCheck, Activity, UserCheck } from 'lucide-react';
import { SKU } from '../types';

interface Props {
  inventory: SKU[];
}

const GovernanceAnalytics: React.FC<Props> = ({ inventory }) => {
  const governanceData = [
    { month: 'Sep', rulesApplied: 4200, overrides: 120, accuracy: 94 },
    { month: 'Oct', rulesApplied: 4500, overrides: 110, accuracy: 95 },
    { month: 'Nov', rulesApplied: 4100, overrides: 140, accuracy: 92 },
    { month: 'Dec', rulesApplied: 4800, overrides: 105, accuracy: 96 },
    { month: 'Jan', rulesApplied: 5200, overrides: 95, accuracy: 97 },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
         <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter italic">Classification Governance Analytics</h2>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Auditing rule accuracy and managerial override frequency</p>
         </div>
         <div className="flex items-center space-x-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Global Audit Mode</div>
            <div className="px-5 py-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">Regional Drift</div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm">
           <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">Rule Performance & Override Trend</h4>
           <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                 <ComposedChart data={governanceData}>
                    <CartesianGrid vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10}} />
                    <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'}} />
                    <Legend iconType="circle" wrapperStyle={{fontSize: '10px', fontWeight: 'bold', paddingTop: '20px'}} />
                    <Bar dataKey="rulesApplied" barSize={20} fill="#6366F1" radius={[4, 4, 0, 0]} name="Rules Applied" />
                    <Bar dataKey="overrides" barSize={20} fill="#EF4444" radius={[4, 4, 0, 0]} name="Manager Overrides" />
                    <Line type="monotone" dataKey="accuracy" stroke="#10B981" strokeWidth={3} name="Rule Accuracy %" />
                 </ComposedChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm space-y-8">
              <div className="flex items-center space-x-4">
                 <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><ShieldCheck size={24} /></div>
                 <div>
                    <h5 className="text-xs font-black text-slate-900 uppercase">Self-Audit Score</h5>
                    <p className="text-2xl font-black text-emerald-600 tracking-tighter italic">97.2%</p>
                 </div>
              </div>
              <div className="space-y-4 pt-6 border-t border-slate-50">
                 <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-400">False Positive Rate</span>
                    <span className="text-slate-900">2.1%</span>
                 </div>
                 <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-400">Review Cycle Time</span>
                    <span className="text-slate-900">1.4 Days</span>
                 </div>
              </div>
           </div>

           <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl flex items-start space-x-5 relative overflow-hidden group">
              <UserCheck className="text-white/20 shrink-0 mt-1" size={32} />
              <div className="relative z-10">
                 <h5 className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-2">Compliance Alert</h5>
                 <p className="text-xs font-bold leading-relaxed italic">Manager "Delta-Lead" has 40% higher override rate than peer group. Investigative review recommended.</p>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[50px] rounded-full group-hover:scale-150 transition-transform"></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default GovernanceAnalytics;
