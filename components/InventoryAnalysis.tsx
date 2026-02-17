
import React, { useState, useMemo } from 'react';
import { Search, Filter, Package, TrendingUp, BarChart, Trash2, Calculator, Layers, Zap, Info, ChevronDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { SKU } from '../types';

interface Props {
  inventory: SKU[];
}

const COLORS = {
  A: '#4F46E5',
  B: '#10B981',
  C: '#F59E0B',
  F: '#10B981',
  S: '#F59E0B',
  N: '#EF4444'
};

const InventoryAnalysis: React.FC<Props> = ({ inventory }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = inventory.filter(i => 
    i.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = useMemo(() => {
    if (inventory.length === 0) return null;
    const totalVal = inventory.reduce((acc, i) => acc + Math.max(0, i.totalValue), 0);
    const nonMoving = inventory.filter(i => i.fsnClass === 'N').length;
    const highScore = Math.max(...inventory.map(i => i.compositeScore || 0));

    const abcDist = [
      { name: 'A Class', value: inventory.filter(i => i.abcClass === 'A').length, color: COLORS.A },
      { name: 'B Class', value: inventory.filter(i => i.abcClass === 'B').length, color: COLORS.B },
      { name: 'C Class', value: inventory.filter(i => i.abcClass === 'C').length, color: COLORS.C },
    ];

    const fsnDist = [
      { name: 'Fast Moving', value: inventory.filter(i => i.fsnClass === 'F').length, color: COLORS.F },
      { name: 'Slow Moving', value: inventory.filter(i => i.fsnClass === 'S').length, color: COLORS.S },
      { name: 'Non-Moving', value: inventory.filter(i => i.fsnClass === 'N').length, color: COLORS.N },
    ];

    return { totalVal, nonMoving, highScore, abcDist, fsnDist };
  }, [inventory]);

  if (!stats) return (
    <div className="flex flex-col items-center justify-center py-40 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
      <Package className="text-slate-300 mb-4" size={48} />
      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Awaiting Inventory Data Sync...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Inventory Classification Matrix</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Multi-dimensional SKU prioritization based on value, velocity, and criticality.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-sm">
            <Zap size={16} fill="white" />
            <span className="text-xs font-bold uppercase tracking-wider">Live Engine</span>
          </div>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPIBox label="Total SKUs" value={inventory.length.toLocaleString()} icon={Package} />
        <KPIBox label="Gross Capital" value={`₹${(stats.totalVal / 10000000).toFixed(2)} Cr`} icon={TrendingUp} />
        <KPIBox label="Max Composite Score" value={stats.highScore.toString()} icon={BarChart} />
        <KPIBox label="Dormant Units" value={stats.nonMoving.toString()} icon={Trash2} />
      </div>

      {/* Logic Card: Formula & Weights - FIXED VISIBILITY */}
      <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm overflow-hidden relative">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center space-x-3">
               <div className="p-2.5 bg-slate-900 text-white rounded-xl">
                  <Calculator size={20} />
               </div>
               <h3 className="text-lg font-bold text-slate-900">Scoring Architecture</h3>
            </div>
            <div className="px-6 py-4 bg-slate-50 rounded-xl border border-slate-100 font-mono text-sm text-slate-600">
               <span className="font-bold text-indigo-600">priority_score =</span> (0.3×ABC) + (0.4×VED) + (0.15×XYZ) + (0.15×FSN)
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <LogicDefinition title="ABC (30%)" items={[{l:'A (High Value)', v:3}, {l:'B (Medium)', v:2}, {l:'C (Low)', v:1}]} color="indigo" />
            <LogicDefinition title="VED (40%)" items={[{l:'V (Vital)', v:3}, {l:'E (Essential)', v:2}, {l:'D (Desirable)', v:1}]} color="rose" />
            <LogicDefinition title="XYZ (15%)" items={[{l:'X (Stable)', v:3}, {l:'Y (Variable)', v:2}, {l:'Z (Irregular)', v:1}]} color="purple" />
            <LogicDefinition title="FSN (15%)" items={[{l:'F (Fast)', v:3}, {l:'S (Slow)', v:2}, {l:'N (Dead)', v:1}]} color="emerald" />
         </div>

         <div className="mt-8 pt-8 border-t border-slate-100 flex flex-wrap gap-8">
            <InterpretationTag color="bg-emerald-500" label="Strategic (≥2.5)" />
            <InterpretationTag color="bg-amber-500" label="Standard (1.5-2.5)" />
            <InterpretationTag color="bg-rose-500" label="Review (<1.5)" />
         </div>
      </section>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartBox title="ABC Value Distribution" data={stats.abcDist} />
        <ChartBox title="FSN Velocity Breakdown" data={stats.fsnDist} />
      </div>

      {/* Data Table Core */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
           <div className="flex items-center space-x-3">
              <Layers size={18} className="text-slate-500" />
              <h4 className="text-sm font-bold text-slate-900">Item Audit Register</h4>
           </div>
           
           <div className="flex items-center space-x-3">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text" 
                  placeholder="Filter items..." 
                  className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-indigo-500/10 outline-none w-64 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-100">
                <th className="px-8 py-4 text-[11px] font-bold uppercase text-slate-400 tracking-wider">SKU ID</th>
                <th className="px-8 py-4 text-[11px] font-bold uppercase text-slate-400 tracking-wider">Description</th>
                <th className="px-4 py-4 text-[11px] font-bold uppercase text-slate-400 tracking-wider text-center">Classes</th>
                <th className="px-4 py-4 text-[11px] font-bold uppercase text-slate-400 tracking-wider text-center">Score</th>
                <th className="px-8 py-4 text-[11px] font-bold uppercase text-slate-400 tracking-wider text-right">Valuation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((sku) => (
                <tr key={sku.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                     <span className="text-xs font-bold font-mono text-slate-900">{sku.id}</span>
                  </td>
                  <td className="px-8 py-5">
                     <div className="flex flex-col">
                        <span className="text-xs font-semibold text-slate-800 truncate max-w-[200px]">{sku.description}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{sku.category || 'Standard'}</span>
                     </div>
                  </td>
                  <td className="px-4 py-5">
                     <div className="flex items-center justify-center space-x-1.5">
                        <MetricDot label={sku.abcClass!} color="indigo" />
                        <MetricDot label={sku.vedClass!} color="rose" />
                        <MetricDot label={sku.xyzClass!} color="purple" />
                        <MetricDot label={sku.fsnClass!} color="emerald" />
                     </div>
                  </td>
                  <td className="px-4 py-5 text-center">
                     <div className={`inline-flex items-center justify-center px-3 py-1 rounded-lg border font-bold text-xs ${
                       (sku.compositeScore || 0) >= 2.5 ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                       (sku.compositeScore || 0) >= 1.5 ? 'bg-amber-50 border-amber-100 text-amber-700' : 'bg-rose-50 border-rose-100 text-rose-700'
                     }`}>
                       {(sku.compositeScore || 0).toFixed(2)}
                     </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                     <div className="flex flex-col items-end">
                       <span className="text-xs font-bold text-slate-900 tracking-tight">
                         ₹{sku.totalValue >= 100000 ? `${(sku.totalValue / 100000).toFixed(2)} L` : sku.totalValue.toLocaleString()}
                       </span>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const KPIBox = ({ label, value, icon: Icon }: any) => (
  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-indigo-200 transition-all group">
    <div className="flex items-center justify-between mb-4">
      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      <Icon size={18} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
    </div>
    <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</div>
  </div>
);

const LogicDefinition = ({ title, items, color }: any) => {
  const themes: Record<string, string> = {
    indigo: 'bg-indigo-50 border-indigo-100 text-indigo-700',
    rose: 'bg-rose-50 border-rose-100 text-rose-700',
    purple: 'bg-purple-50 border-purple-100 text-purple-700',
    emerald: 'bg-emerald-50 border-emerald-100 text-emerald-700'
  };

  return (
    <div className={`p-5 rounded-xl border ${themes[color]}`}>
      <h5 className="text-[11px] font-bold uppercase tracking-wider mb-4 opacity-80">{title}</h5>
      <div className="space-y-2">
        {items.map((item: any) => (
          <div key={item.l} className="flex items-center justify-between text-xs">
            <span className="font-medium opacity-70">{item.l}</span>
            <span className="font-bold">= {item.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ChartBox = ({ title, data }: any) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
     <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">{title}</h4>
     <div className="h-[280px]">
       <ResponsiveContainer width="100%" height="100%">
         <PieChart>
           <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" stroke="none">
             {data.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={entry.color} />)}
           </Pie>
           <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: '600'}} />
           <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '11px', fontWeight: 'bold'}} />
         </PieChart>
       </ResponsiveContainer>
     </div>
  </div>
);

const InterpretationTag = ({ color, label }: any) => (
  <div className="flex items-center space-x-2">
    <div className={`w-2.5 h-2.5 rounded-full ${color}`}></div>
    <span className="text-[11px] font-bold uppercase text-slate-500">{label}</span>
  </div>
);

const MetricDot = ({ label, color }: { label: string, color: 'indigo' | 'rose' | 'purple' | 'emerald' }) => {
  const themes = {
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    rose: 'bg-rose-50 text-rose-700 border-rose-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100'
  };

  return (
    <div className={`w-6 h-6 flex items-center justify-center rounded-lg border text-[10px] font-bold ${themes[color]}`}>
      {label}
    </div>
  );
};

export default InventoryAnalysis;
