
import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  Save, 
  TrendingDown, 
  TrendingUp, 
  AlertCircle,
  Activity,
  DollarSign,
  Package,
  Layers,
  Bell,
  CheckCircle2,
  PieChart as PieIcon,
  BarChart as BarIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';

const SimulationConsole: React.FC = () => {
  const [safetyStockFactor, setSafetyStockFactor] = useState(1.2);
  const [reorderPointAdjustment, setReorderPointAdjustment] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  // Mock data for the simulation results
  const [impacts, setImpacts] = useState({
    workingCapitalValue: 12500000,
    workingCapitalPercent: 12.5,
    deadStockValue: 4500000,
    deadStockPercent: 8.2,
    atRiskSKUs: 142,
    openAlertsChange: -12,
    serviceLevel: 98.2,
    actionDistribution: [
      { name: 'Hold', value: 450, color: '#6366f1' },
      { name: 'Transfer', value: 320, color: '#10b981' },
      { name: 'Scrap', value: 120, color: '#f59e0b' },
      { name: 'Dispose', value: 85, color: '#ef4444' },
      { name: 'Review', value: 240, color: '#64748b' }
    ]
  });

  // Dynamic simulation logic - updates whenever inputs change
  useEffect(() => {
    // We can add a small artificial delay or just update immediately for a "live" feel
    const factor = safetyStockFactor / 1.2;
    const rOPFactor = 1 + (reorderPointAdjustment / 100);
    
    // Derived calculations for mock data
    const newWCValue = 12500000 * factor * rOPFactor;
    const newWCPercent = 12.5 * factor * rOPFactor;
    const newDSValue = 4500000 * (1 / factor) * (1 / rOPFactor);
    const newDSPercent = 8.2 * (1 / factor) * (1 / rOPFactor);
    const newAtRisk = Math.round(142 / (factor * rOPFactor));
    const newAlerts = Math.round(-12 * factor * rOPFactor);
    
    setImpacts({
      workingCapitalValue: newWCValue,
      workingCapitalPercent: newWCPercent,
      deadStockValue: newDSValue,
      deadStockPercent: newDSPercent,
      atRiskSKUs: newAtRisk,
      openAlertsChange: newAlerts,
      serviceLevel: Math.min(99.9, 98.2 * factor * rOPFactor),
      actionDistribution: [
        { name: 'Hold', value: Math.round(450 * factor), color: '#6366f1' },
        { name: 'Transfer', value: Math.round(320 * rOPFactor), color: '#10b981' },
        { name: 'Scrap', value: Math.max(10, Math.round(120 / factor)), color: '#f59e0b' },
        { name: 'Dispose', value: Math.max(5, Math.round(85 / rOPFactor)), color: '#ef4444' },
        { name: 'Review', value: Math.round(240 * factor * rOPFactor), color: '#64748b' }
      ]
    });
  }, [safetyStockFactor, reorderPointAdjustment]);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    // Visual feedback for "processing"
    setTimeout(() => {
      setIsSimulating(false);
    }, 600);
  };

  const handleReset = () => {
    setSafetyStockFactor(1.2);
    setReorderPointAdjustment(0);
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1E293B]">Simulation Console</h2>
          <p className="text-slate-500 text-sm mt-1">Test policy changes and inventory actions in a safe environment.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleReset}
            className="flex items-center space-x-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all"
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
          <button 
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className={`flex items-center space-x-2 px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 transition-all ${isSimulating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
          >
            {isSimulating ? (
              <Activity className="animate-spin" size={16} />
            ) : (
              <Play size={16} />
            )}
            <span>{isSimulating ? 'Simulating...' : 'Run Simulation'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Policy Controls */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-8">
          <h3 className="font-bold text-[#1E293B] uppercase tracking-widest text-[10px]">Policy Parameters</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-700">Safety Stock Factor</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="number" 
                  value={safetyStockFactor}
                  onChange={(e) => setSafetyStockFactor(parseFloat(e.target.value) || 0)}
                  className="w-16 text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded border-none focus:ring-1 focus:ring-indigo-400"
                  step="0.1"
                />
                <span className="text-[10px] font-bold text-indigo-400">x</span>
              </div>
            </div>
            <input 
              type="range" 
              min="0.5" 
              max="2.5" 
              step="0.1"
              value={safetyStockFactor}
              onChange={(e) => setSafetyStockFactor(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>LEAN (0.5x)</span>
              <span>BUFFERED (2.5x)</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-700">Reorder Point Adj.</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="number" 
                  value={reorderPointAdjustment}
                  onChange={(e) => setReorderPointAdjustment(parseInt(e.target.value) || 0)}
                  className="w-16 text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded border-none focus:ring-1 focus:ring-indigo-400"
                />
                <span className="text-[10px] font-bold text-indigo-400">%</span>
              </div>
            </div>
            <input 
              type="range" 
              min="-50" 
              max="50" 
              step="5"
              value={reorderPointAdjustment}
              onChange={(e) => setReorderPointAdjustment(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>DECREASE (-50%)</span>
              <span>INCREASE (+50%)</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div className="bg-slate-50 p-4 rounded-xl space-y-3">
              <div className="flex items-center space-x-2 text-slate-600">
                <AlertCircle size={14} />
                <span className="text-[11px] font-bold uppercase">Simulation Scope</span>
              </div>
              <p className="text-[12px] text-slate-500 leading-relaxed">
                Changes will be applied across 14,230 SKUs. This allows you to preview the financial impact before actual procurement execution.
              </p>
            </div>
          </div>
        </div>

        {/* Results / Impact */}
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Working Capital */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                  <DollarSign size={18} />
                </div>
                <div className={`text-[10px] font-bold ${impacts.workingCapitalPercent >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {impacts.workingCapitalPercent >= 0 ? '+' : ''}{impacts.workingCapitalPercent.toFixed(1)}%
                </div>
              </div>
              <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest mb-1">WC Release Potential</p>
              <h4 className="text-xl font-bold text-[#1E293B]">₹{(impacts.workingCapitalValue / 1000000).toFixed(1)}M</h4>
            </div>

            {/* Dead Stock */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                  <Package size={18} />
                </div>
                <div className="text-amber-600 text-[10px] font-bold">-{impacts.deadStockPercent.toFixed(1)}%</div>
              </div>
              <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest mb-1">Dead Stock Reduction</p>
              <h4 className="text-xl font-bold text-[#1E293B]">₹{(impacts.deadStockValue / 1000000).toFixed(1)}M</h4>
            </div>

            {/* Stock-out Risk */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                  <AlertCircle size={18} />
                </div>
                <div className="text-rose-600 text-[10px] font-bold">
                  {impacts.atRiskSKUs > 200 ? 'High' : impacts.atRiskSKUs > 100 ? 'Med' : 'Low'} Risk
                </div>
              </div>
              <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest mb-1">At-Risk SKUs</p>
              <h4 className="text-xl font-bold text-[#1E293B]">{impacts.atRiskSKUs} Units</h4>
            </div>

            {/* Open Alerts */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <Bell size={18} />
                </div>
                <div className={`text-[10px] font-bold ${impacts.openAlertsChange <= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {impacts.openAlertsChange > 0 ? '+' : ''}{impacts.openAlertsChange}
                </div>
              </div>
              <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest mb-1">Open Alerts Impact</p>
              <h4 className="text-xl font-bold text-[#1E293B]">{impacts.openAlertsChange <= 0 ? 'Decreased' : 'Increased'}</h4>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Charts Section */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <BarIcon size={16} className="text-indigo-600" />
                  <h3 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider">Action Distribution</h3>
                </div>
              </div>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={impacts.actionDistribution}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#64748b'}} />
                    <Tooltip 
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {impacts.actionDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <PieIcon size={16} className="text-indigo-600" />
                  <h3 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider">Risk Composition</h3>
                </div>
              </div>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={impacts.actionDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {impacts.actionDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-[#1E293B] p-8 rounded-2xl text-white">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Save className="text-indigo-400" size={20} />
                <span className="font-bold text-sm uppercase tracking-[0.2em]">Approval Workflow</span>
              </div>
              <button className="bg-white text-[#1E293B] px-6 py-2 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors uppercase tracking-widest">
                Submit for Approval
              </button>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-2xl">
              Once satisfied with the simulation results, you can submit these policy changes to the Inventory Control Board. Submitting will generate a formal proposal with the projected financial impacts shown above.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationConsole;
