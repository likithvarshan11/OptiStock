
import React, { useState, useMemo } from 'react';
import { Recommendation, Role, RecommendationAction, SKU } from '../types';
import { 
  Check, X, Search, Filter, 
  ChevronRight, ArrowRight, ShieldCheck,
  Zap, Info, Clock, Layers, ChevronDown, ChevronUp,
  Package, Target, TrendingUp, DollarSign
} from 'lucide-react';

interface Props {
  inventory: SKU[];
  recommendations: Recommendation[];
  onAction: (id: string, status: 'PENDING' | 'APPROVED' | 'REJECTED') => void;
  role: Role;
}

const RecommendationsView: React.FC<Props> = ({ inventory, recommendations, onAction, role }) => {
  const [activeFilter, setActiveFilter] = useState<'All' | RecommendationAction>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const isViewer = role === 'VIEWER';

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val.toLocaleString()}`;
  };

  const actionMeta = useMemo(() => {
    const actions: RecommendationAction[] = ['Pending', 'Hold', 'Transfer', 'Scrap', 'Dispose', 'Review'];
    return actions.map(action => {
      const items = recommendations.filter(r => r.action === action);
      const value = items.reduce((acc, curr) => acc + curr.impact, 0);
      return {
        label: action,
        count: items.length,
        value: formatCurrency(value),
        colorClass: 
          action === 'Pending' ? 'text-slate-500' :
          action === 'Hold' ? 'text-blue-600' :
          action === 'Transfer' ? 'text-emerald-600' :
          action === 'Scrap' ? 'text-amber-600' :
          action === 'Dispose' ? 'text-rose-600' :
          'text-purple-600'
      };
    });
  }, [recommendations]);

  const filteredRecs = useMemo(() => {
    return recommendations.filter(r => {
      const matchesFilter = activeFilter === 'All' || r.action === activeFilter;
      const matchesSearch = r.skuId.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           r.skuDescription.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [recommendations, activeFilter, searchTerm]);

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Strategic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Recommendations: Demo Inventory Dataset</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Review and approve inventory actions</p>
        </div>
      </div>

      {/* Summary Filter Cards - Matching image exactly */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {actionMeta.map((action) => (
          <button 
            key={action.label}
            onClick={() => setActiveFilter(action.label)}
            className={`p-6 rounded-2xl border transition-all text-left flex flex-col justify-between h-36 bg-white shadow-sm ${
              activeFilter === action.label ? 'ring-2 ring-indigo-500 ring-offset-2 border-transparent shadow-md bg-slate-50' : 'border-slate-200 hover:border-indigo-300'
            }`}
          >
            <span className={`text-[11px] font-bold uppercase tracking-widest ${action.colorClass}`}>
              {action.label}
            </span>
            <div>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {action.count}
              </div>
              <div className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tight">
                {action.value} total
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Data Table Core */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/10">
           <div className="flex items-center space-x-6">
              <h4 className="text-sm font-bold text-slate-900">Action Items</h4>
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                {(['All', 'Pending', 'Hold', 'Transfer', 'Scrap', 'Dispose', 'Review'] as const).map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveFilter(tab)}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                      activeFilter === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {tab} ({tab === 'All' ? recommendations.length : recommendations.filter(r => r.action === tab).length})
                  </button>
                ))}
              </div>
           </div>
           
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="Search recommendations..." 
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-indigo-500/10 outline-none w-72 transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredRecs.length === 0 ? (
            <div className="py-24 text-center">
               <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                 <Filter className="text-slate-300" size={20} />
               </div>
               <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">No matching recommendations found.</p>
            </div>
          ) : (
            filteredRecs.map(rec => {
              const sku = inventory.find(i => i.id === rec.skuId);
              const isExpanded = expandedId === rec.id;

              return (
                <div key={rec.id} className={`flex flex-col transition-all duration-300 ${rec.status === 'REJECTED' ? 'opacity-40 grayscale-[0.5]' : ''}`}>
                  <div 
                    onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                    className={`group px-8 py-6 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors ${isExpanded ? 'bg-slate-50/80' : ''}`}
                  >
                    <div className="flex items-center space-x-10">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border font-bold text-[10px] uppercase shadow-sm ${
                        rec.action === 'Pending' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                        rec.action === 'Hold' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                        rec.action === 'Transfer' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        rec.action === 'Scrap' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        rec.action === 'Dispose' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                        'bg-purple-50 text-purple-700 border-purple-100'
                      }`}>
                        {rec.action.substring(0, 3)}
                      </div>
                      
                      <div className="space-y-1.5">
                        <div className="flex items-center space-x-4">
                          <span className="text-xs font-bold font-mono text-slate-900 tracking-tight">{rec.skuId}</span>
                          {sku && (
                            <div className="flex items-center space-x-1.5">
                              <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-100 text-[10px] font-bold text-indigo-700" title="ABC Classification">
                                {sku.abcClass}
                              </div>
                              <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-700" title="FSN Classification">
                                {sku.fsnClass}
                              </div>
                            </div>
                          )}
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                            rec.status === 'PENDING' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                            rec.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                          }`}>
                            {rec.status}
                          </span>
                        </div>
                        <h5 className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight">{rec.skuDescription}</h5>
                      </div>
                    </div>

                    <div className="flex items-center space-x-12">
                      <div className="text-right">
                        <p className="text-[12px] font-extrabold text-slate-900 tracking-tight">{formatCurrency(rec.impact)}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Potential Impact</p>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                          {rec.status === 'PENDING' ? (
                            <>
                              <button 
                                disabled={isViewer}
                                onClick={(e) => { e.stopPropagation(); onAction(rec.id, 'REJECTED'); }}
                                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                                  isViewer ? 'opacity-50 cursor-not-allowed' : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                                }`}
                              >
                                Reject
                              </button>
                              <button 
                                disabled={isViewer}
                                onClick={(e) => { e.stopPropagation(); onAction(rec.id, 'APPROVED'); }}
                                className={`px-4 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-md hover:bg-indigo-600 hover:scale-[1.03] transition-all ${
                                  isViewer ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                              >
                                Approve
                              </button>
                            </>
                          ) : (
                            <button 
                              disabled={isViewer}
                              onClick={(e) => { e.stopPropagation(); onAction(rec.id, 'PENDING'); }}
                              className={`px-4 py-2 text-[10px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-wider ${
                                isViewer ? 'hidden' : ''
                              }`}
                            >
                              Reset to Queue
                            </button>
                          )}
                        </div>
                        {isExpanded ? <ChevronUp size={16} className="text-slate-300" /> : <ChevronDown size={16} className="text-slate-300" />}
                      </div>
                    </div>
                  </div>
                  
                  {isExpanded && sku && (
                    <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 animate-in slide-in-from-top-2 duration-300">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                        <DetailItem label="Current Stock" value={`${sku.qtyOnHand.toLocaleString()} Units`} icon={Package} />
                        <DetailItem label="Critical Min Level" value={`${sku.minLevel.toLocaleString()} Units`} icon={Target} />
                        <DetailItem label="Total Book Value" value={formatCurrency(sku.totalValue)} icon={DollarSign} />
                        <DetailItem label="Last Transaction" value={sku.lastSaleDate} icon={Clock} />
                      </div>
                      <div className="mt-8 pt-8 border-t border-slate-200/50 flex flex-wrap gap-8">
                         <InterpretationBadge label="STRATEGIC" color="indigo" />
                         <InterpretationBadge label="AUTO-DETECTED" color="emerald" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value, icon: Icon }: any) => (
  <div className="space-y-2">
    <div className="flex items-center space-x-2">
      <Icon size={12} className="text-slate-400" />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{label}</p>
    </div>
    <p className="text-sm font-bold text-slate-900 tracking-tight">{value}</p>
  </div>
);

const InterpretationBadge = ({ label, color }: any) => {
  const themes: Record<string, string> = {
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  };
  return (
    <div className={`px-2 py-1 rounded border text-[9px] font-black uppercase tracking-widest ${themes[color]}`}>
      {label}
    </div>
  );
}

export default RecommendationsView;
