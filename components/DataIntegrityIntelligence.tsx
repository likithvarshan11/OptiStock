
import React from 'react';
import { ShieldAlert, Database, CheckCircle, AlertTriangle, Activity } from 'lucide-react';
import { SKU } from '../types';

interface Props {
  inventory: SKU[];
}

const DataIntegrityIntelligence: React.FC<Props> = ({ inventory }) => {
  const dataMetrics = [
    { label: 'UOM Consistency', score: 99.8, status: 'Healthy' },
    { label: 'Location Accuracy', score: 94.2, status: 'Warning' },
    { label: 'Material Duplicates', score: 98.1, status: 'Healthy' },
    { label: 'Price Convergence', score: 86.5, status: 'Critical' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {dataMetrics.map(m => (
          <div key={m.label} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
             <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.label}</p>
                   {m.status === 'Healthy' ? <CheckCircle size={14} className="text-emerald-500" /> : <AlertTriangle size={14} className="text-amber-500" />}
                </div>
                <div>
                   <h3 className="text-4xl font-black text-slate-900 tracking-tighter italic">{m.score}%</h3>
                   <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full mt-2 inline-block ${m.status === 'Healthy' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {m.status}
                   </span>
                </div>
             </div>
             <div className="absolute -bottom-2 -right-2 opacity-5 group-hover:opacity-10 transition-opacity">
                <Database size={80} className="text-slate-900" />
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
           <div className="px-10 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center space-x-3">
                 <div className="p-2 bg-slate-900 text-white rounded-lg"><Activity size={16} /></div>
                 <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">ERP Pattern Anomaly Log</h4>
              </div>
              <button className="text-[10px] font-black text-indigo-600 uppercase hover:underline">Download Integrity Report</button>
           </div>
           <div className="p-10 space-y-4">
              {[
                { type: 'Duplicate Material', sku: 'SKU-1022 / SKU-1049', detail: 'Fuzzy match 94% on dimension/spec', impact: 'Medium' },
                { type: 'UOM Mismatch', sku: 'SKU-1008', detail: 'ERP reports EA, Ingest detected Packs', impact: 'High' },
                { type: 'Lead Time Outlier', sku: 'SKU-1031', detail: 'Historical delta > 120 days from ERP Master', impact: 'Low' },
                { type: 'Missing Location', sku: 'SKU-1002', detail: 'Null bin-ID for active stock cluster', impact: 'Medium' },
              ].map((log, idx) => (
                <div key={idx} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-all cursor-pointer">
                   <div className="flex items-center space-x-6">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center">
                         <ShieldAlert size={18} className={log.impact === 'High' ? 'text-rose-500' : 'text-amber-500'} />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{log.type}</p>
                         <p className="text-[11px] font-bold text-slate-400 mt-1">{log.sku}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">{log.detail}</p>
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${log.impact === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>{log.impact} Impact</span>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-[#1E293B] rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-8 italic">Data Trust Score</h4>
              <div className="flex flex-col items-center justify-center space-y-6">
                 <div className="relative w-48 h-48 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                       <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                       <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={552} strokeDashoffset={552 - (552 * 0.92)} className="text-indigo-500 transition-all duration-1000" strokeLinecap="round" />
                    </svg>
                    <div className="absolute text-center">
                       <p className="text-5xl font-black italic tracking-tighter">92.4</p>
                       <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Global Index</p>
                    </div>
                 </div>
                 <p className="text-[10px] text-slate-400 font-bold uppercase text-center leading-relaxed tracking-widest">
                    Enterprise health index improved by <span className="text-emerald-400">+4.2%</span> vs last sync cycle.
                 </p>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[60px] rounded-full"></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DataIntegrityIntelligence;
