
import React from 'react';
import { Link, CheckCircle, AlertTriangle, Database, Zap } from 'lucide-react';
import { SKU } from '../types';

interface Props {
  inventory: SKU[];
}

const SubstitutionIntelligence: React.FC<Props> = ({ inventory }) => {
  const substitutions = [
    { original: 'SKU-1004', substitute: 'SKU-1029', matchScore: 98, risk: 'Low', status: 'Approved' },
    { original: 'SKU-1015', substitute: 'SKU-1044', matchScore: 82, risk: 'Med', status: 'Technical Review' },
    { original: 'SKU-1031', substitute: 'SKU-1002', matchScore: 91, risk: 'Low', status: 'Approved' },
    { original: 'SKU-1049', substitute: 'SKU-1011', matchScore: 65, risk: 'High', status: 'Pending Approval' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-black text-slate-900 italic tracking-tighter">Material Interchangeability Matrix</h2>
           <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Cross-category material-to-material compatibility mapping</p>
        </div>
        <div className="flex space-x-2">
           <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-2xl text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center space-x-2">
             <Database size={14} />
             <span>850 Pairs Indexed</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
           <table className="w-full text-left">
              <thead>
                 <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-10 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Primary Material</th>
                    <th className="px-10 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Substitution Pair</th>
                    <th className="px-10 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Compatibility</th>
                    <th className="px-10 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Action</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                 {substitutions.map(sub => (
                   <tr key={sub.original} className="hover:bg-slate-50 transition-all group">
                      <td className="px-10 py-6">
                         <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-sm group-hover:text-indigo-600 transition-all"><Link size={14} /></div>
                            <span className="text-xs font-black text-slate-900">{sub.original}</span>
                         </div>
                      </td>
                      <td className="px-10 py-6">
                         <div className="flex items-center space-x-3">
                            <div className="w-1 h-4 bg-slate-200 rounded-full"></div>
                            <span className="text-xs font-black text-slate-900">{sub.substitute}</span>
                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter ${
                              sub.risk === 'Low' ? 'bg-emerald-50 text-emerald-600' : sub.risk === 'Med' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                            }`}>
                               {sub.risk} Risk
                            </span>
                         </div>
                      </td>
                      <td className="px-10 py-6 text-center">
                         <div className="inline-flex items-center space-x-2 text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                            <Zap size={10} />
                            <span>{sub.matchScore}%</span>
                         </div>
                      </td>
                      <td className="px-10 py-6 text-right">
                         <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Configure</button>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-slate-900 rounded-[2rem] p-10 text-white shadow-xl relative overflow-hidden">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-6 italic">Substitution Impact</h4>
              <div className="space-y-6">
                 <div>
                    <p className="text-3xl font-black tracking-tighter italic text-white">$1.2M</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Capital rationalization potential</p>
                 </div>
                 <div className="pt-6 border-t border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black text-slate-400 uppercase">Lead Time Redux</span>
                       <span className="text-[10px] font-black text-emerald-400">-12 Days</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black text-slate-400 uppercase">Procurement Saving</span>
                       <span className="text-[10px] font-black text-emerald-400">+18% ROI</span>
                    </div>
                 </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full"></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SubstitutionIntelligence;
