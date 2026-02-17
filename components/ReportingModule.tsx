
import React, { useState } from 'react';
import { 
  FileText, Download, Calendar, Filter, 
  Printer, CheckCircle, Database, ChevronDown, ShieldAlert,
  Layout, Grid, FileBarChart, Layers, Send, Search
} from 'lucide-react';
import { SKU } from '../types';

interface Props {
  inventory: SKU[];
}

const REPORT_TEMPLATES = [
  { id: 'exec', title: 'Executive Summary', icon: Layout, desc: 'High-level capital efficiency & service levels.', color: 'indigo' },
  { id: 'audit', title: 'Inventory Audit', icon: Grid, desc: 'Deep-dive SKU divergence & risk levels.', color: 'emerald' },
  { id: 'supplier', title: 'Supplier Accuracy', icon: Layers, desc: 'Cross-vendor accuracy & delay matrices.', color: 'amber' },
  { id: 'logistics', title: 'Tactical Logistics', icon: FileBarChart, desc: 'Hub capacity & regional load analysis.', color: 'rose' },
];

const ReportingModule: React.FC<Props> = ({ inventory }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('exec');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleExport = (type: 'CSV' | 'PDF') => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      if (type === 'PDF') {
        window.print();
      } else {
        const headers = "SKU,Description,Category,Value,ABC\n";
        const rows = inventory.map(i => `${i.id},${i.description},${i.category},${i.totalValue},${i.abcClass}`).join("\n");
        const blob = new Blob([headers + rows], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `OPTISTOCK_ELITE_${new Date().getTime()}.csv`;
        a.click();
      }
    }, 1200);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Visual Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic">Intelligence Studio</h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em]">Configure and Dispatch Strategic Reports</p>
        </div>
        <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button className="px-5 py-2.5 bg-[#1E293B] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/20 transition-all hover:scale-[1.02]">
            New Configuration
          </button>
          <button className="px-5 py-2.5 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">
            Browse Archive
          </button>
        </div>
      </div>

      {/* Template Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {REPORT_TEMPLATES.map(t => (
          <button 
            key={t.id}
            onClick={() => setSelectedTemplate(t.id)}
            className={`text-left p-8 rounded-[2.5rem] border-2 transition-all group ${selectedTemplate === t.id ? 'bg-white border-[#1E293B] shadow-2xl' : 'bg-white/50 border-slate-100 hover:border-slate-300'}`}
          >
            <div className={`w-14 h-14 rounded-3xl mb-8 flex items-center justify-center transition-transform group-hover:scale-110 ${selectedTemplate === t.id ? 'bg-[#1E293B] text-white shadow-xl shadow-slate-900/20' : 'bg-slate-100 text-slate-400'}`}>
               <t.icon size={28} />
            </div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">{t.title}</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase leading-relaxed">{t.desc}</p>
          </button>
        ))}
      </div>

      {/* Main Studio Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
           <div className="bg-white rounded-[3rem] p-12 border border-slate-200 shadow-sm space-y-12">
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Configuration Hub</h3>
                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest">Active Draft</span>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Temporal Scale</label>
                  <div className="relative">
                    <select className="w-full pl-6 pr-10 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] text-xs font-black uppercase tracking-widest text-slate-900 appearance-none focus:ring-4 focus:ring-slate-100 outline-none">
                      <option>FY24 Global Review</option>
                      <option>Rolling 90-Day Delta</option>
                      <option>Daily Node Sync</option>
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Data Granularity</label>
                  <div className="flex bg-slate-50 p-1.5 rounded-[2rem] border border-slate-100">
                    {['Aggregate', 'SKU Level'].map(mode => (
                      <button key={mode} className={`flex-1 py-3.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'SKU Level' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
             </div>

             <div className="space-y-6">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Analytic Dimensions</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {[
                     { label: 'Supply Risk Matrix', meta: 'Divergence scores & lead times' },
                     { label: 'Capital Leakage', meta: 'Excess stock & aging cost' },
                     { label: 'Hub Capacity Load', meta: 'Regional resource saturation' },
                     { label: 'Perfect Order Rate', meta: 'Delivery accuracy KPI' },
                   ].map(d => (
                     <label key={d.label} className="flex items-center p-6 bg-slate-50 border border-slate-100 rounded-[2rem] cursor-pointer hover:bg-white hover:shadow-xl hover:border-indigo-100 transition-all group">
                        <div className="w-6 h-6 rounded-lg border-2 border-slate-200 flex items-center justify-center group-has-[:checked]:bg-[#1E293B] group-has-[:checked]:border-[#1E293B] transition-all">
                           <input type="checkbox" className="hidden" defaultChecked />
                           <CheckCircle className="text-white scale-0 group-has-[:checked]:scale-100 transition-transform" size={12} />
                        </div>
                        <div className="ml-5">
                          <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{d.label}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase">{d.meta}</p>
                        </div>
                     </label>
                   ))}
                </div>
             </div>
           </div>
        </div>

        <div className="lg:col-span-4 sticky top-32 space-y-6">
           <div className="bg-[#1E293B] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="relative z-10 space-y-8">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                   <Send className="text-indigo-400" size={28} />
                </div>
                <div>
                  <h4 className="text-2xl font-black italic tracking-tighter">Ready for Dispatch</h4>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Review finalized metrics below</p>
                </div>
                
                <div className="space-y-3 pt-4">
                   <button 
                    onClick={() => handleExport('PDF')}
                    disabled={isGenerating}
                    className="w-full py-4 bg-white text-slate-900 font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                   >
                     {isGenerating ? 'Synthesizing...' : 'Print Exec Summary'}
                   </button>
                   <button 
                    onClick={() => handleExport('CSV')}
                    disabled={isGenerating}
                    className="w-full py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all disabled:opacity-50"
                   >
                     Export Data Matrix (CSV)
                   </button>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 blur-[100px] -mr-24 -mt-24 transition-all group-hover:bg-indigo-500/20"></div>
           </div>

           {showSuccess && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-[2.5rem] p-8 flex items-center space-x-5 shadow-lg animate-in slide-in-from-top-4">
               <div className="w-12 h-12 bg-white text-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <CheckCircle size={24} />
               </div>
               <div>
                  <p className="text-[10px] font-black text-emerald-900 uppercase tracking-widest">Generation Success</p>
                  <p className="text-[9px] text-emerald-700 font-bold uppercase tracking-widest">Vault ID: #REF-49-A1</p>
               </div>
            </div>
           )}

           <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 flex items-start space-x-5">
              <ShieldAlert className="text-slate-400 shrink-0 mt-1" size={20} />
              <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed tracking-wide">
                Security clearance level 4 required for PII-inclusive exports. All financial data is rounded to nearest cluster.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ReportingModule;
