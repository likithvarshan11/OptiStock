
import React, { useMemo, useState, useEffect } from 'react';
import { Alert, SKU } from '../types';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  Clock, 
  ShieldAlert, 
  Settings, 
  Bell, 
  ToggleLeft, 
  ToggleRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Calendar,
  Layers,
  Filter,
  RefreshCw,
  Save,
  ChevronRight
} from 'lucide-react';

interface Props {
  alerts: Alert[];
  inventory: SKU[];
}

interface AlertRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  valueThreshold: number;
  stalenessThreshold: number;
  duplicateThreshold: number;
  categories: string[];
  plants: string[];
}

interface AlertConfigResults {
  openAlerts: number;
  highSeverityAlerts: number;
  valueAtRisk: number;
  newAlerts7d: number;
  resolvedAlerts7d: number;
  newAlerts14d: number;
  resolvedAlerts14d: number;
  topRiskySKUs: { id: string; description: string; reason: string; impact: number }[];
}

const CATEGORIES = ['Bearings', 'Valves', 'Pumps', 'Motors', 'Connectors', 'Electronics', 'Raw Materials'];
const PLANTS = ['Plant A - Mumbai', 'Plant B - Delhi', 'Plant C - Chennai', 'Plant D - Bangalore'];

const DEFAULT_RULES: AlertRule[] = [
  { id: 'rule-1', name: 'Critical Cost Discrepancy', description: 'Flags items with zero or negative unit cost', enabled: true, severity: 'HIGH', valueThreshold: 50000, stalenessThreshold: 30, duplicateThreshold: 95, categories: [], plants: [] },
  { id: 'rule-2', name: 'Negative Inventory Lock', description: 'Detects negative quantity on hand values', enabled: true, severity: 'HIGH', valueThreshold: 25000, stalenessThreshold: 14, duplicateThreshold: 90, categories: [], plants: [] },
  { id: 'rule-3', name: 'High Value Concentration', description: 'Alerts when single SKU exceeds ₹50L value', enabled: true, severity: 'MEDIUM', valueThreshold: 500000, stalenessThreshold: 60, duplicateThreshold: 85, categories: [], plants: [] },
  { id: 'rule-4', name: 'Stale Data Warning', description: 'Items with no updates beyond threshold days', enabled: true, severity: 'MEDIUM', valueThreshold: 10000, stalenessThreshold: 90, duplicateThreshold: 80, categories: [], plants: [] },
  { id: 'rule-5', name: 'Duplicate SKU Detection', description: 'Near-duplicate descriptions or attributes', enabled: false, severity: 'LOW', valueThreshold: 5000, stalenessThreshold: 45, duplicateThreshold: 92, categories: [], plants: [] },
  { id: 'rule-6', name: 'Orphan Category Items', description: 'Items missing category or plant assignment', enabled: true, severity: 'LOW', valueThreshold: 15000, stalenessThreshold: 30, duplicateThreshold: 88, categories: [], plants: [] },
];

const AlertsPanel: React.FC<Props> = ({ alerts, inventory }) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'config'>('feed');
  const [rules, setRules] = useState<AlertRule[]>(DEFAULT_RULES);
  const [configResults, setConfigResults] = useState<AlertConfigResults>({
    openAlerts: 0,
    highSeverityAlerts: 0,
    valueAtRisk: 0,
    newAlerts7d: 0,
    resolvedAlerts7d: 0,
    newAlerts14d: 0,
    resolvedAlerts14d: 0,
    topRiskySKUs: []
  });
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val.toLocaleString()}`;
  };

  // Recalculate results when rules change
  useEffect(() => {
    setIsRecalculating(true);
    const timer = setTimeout(() => {
      const enabledRules = rules.filter(r => r.enabled);
      const highRules = enabledRules.filter(r => r.severity === 'HIGH');
      const avgValueThreshold = enabledRules.length > 0 
        ? enabledRules.reduce((sum, r) => sum + r.valueThreshold, 0) / enabledRules.length 
        : 50000;
      
      // Mock calculations based on rules
      const baseAlerts = alerts.length;
      const multiplier = enabledRules.length / 6;
      
      setConfigResults({
        openAlerts: Math.round(baseAlerts * multiplier + enabledRules.length * 12),
        highSeverityAlerts: Math.round(highRules.length * 18 + (multiplier * 8)),
        valueAtRisk: Math.round((avgValueThreshold * enabledRules.length * 85) + (inventory.length * 1200)),
        newAlerts7d: Math.round(enabledRules.length * 8),
        resolvedAlerts7d: Math.round(enabledRules.length * 5),
        newAlerts14d: Math.round(enabledRules.length * 15),
        resolvedAlerts14d: Math.round(enabledRules.length * 12),
        topRiskySKUs: [
          { id: 'SKU-7842', description: 'Industrial Valve Assembly XL', reason: highRules.length > 0 ? 'Critical cost discrepancy' : 'High value concentration', impact: 2450000 },
          { id: 'SKU-3291', description: 'Precision Bearing Set 42mm', reason: 'Stale data - 124 days without update', impact: 1875000 },
          { id: 'SKU-5567', description: 'Hydraulic Pump Motor', reason: 'Negative inventory detected', impact: 1650000 },
          { id: 'SKU-9012', description: 'Steel Flange Connector', reason: 'Near-duplicate detected (94% match)', impact: 980000 },
          { id: 'SKU-1456', description: 'Control Panel Module', reason: 'Missing plant assignment', impact: 875000 },
        ]
      });
      setIsRecalculating(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [rules, alerts, inventory]);

  const alertStats = useMemo(() => {
    const high = alerts.filter(a => a.severity === 'HIGH').length;
    const med = alerts.filter(a => a.severity === 'MEDIUM').length;
    const alertSkuIds = new Set(alerts.map(a => a.skuId));
    const valueAtRisk = inventory
      .filter(sku => alertSkuIds.has(sku.id))
      .reduce((acc, sku) => acc + Math.max(0, sku.totalValue), 0);

    return { total: alerts.length, high, med, valueAtRisk };
  }, [alerts, inventory]);

  const updateRule = (ruleId: string, updates: Partial<AlertRule>) => {
    setRules(prev => prev.map(r => r.id === ruleId ? { ...r, ...updates } : r));
  };

  const toggleRule = (ruleId: string) => {
    setRules(prev => prev.map(r => r.id === ruleId ? { ...r, enabled: !r.enabled } : r));
  };

  const handleReset = () => {
    setRules(DEFAULT_RULES);
    setSelectedRuleId(null);
  };

  const selectedRule = selectedRuleId ? rules.find(r => r.id === selectedRuleId) : null;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'HIGH': return 'bg-red-100 text-red-700 border-red-200';
      case 'MEDIUM': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Header with Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Alert Intelligence Center</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Monitor anomalies and configure detection rules</p>
        </div>
        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'feed' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <div className="flex items-center space-x-2">
              <Bell size={14} />
              <span>Alert Feed</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'config' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <div className="flex items-center space-x-2">
              <Settings size={14} />
              <span>Alert Configuration</span>
            </div>
          </button>
        </div>
      </div>

      {/* Alert Feed Tab */}
      {activeTab === 'feed' && (
        <div className="space-y-8">
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <AlertKPICard label="Total Alerts" value={alertStats.total.toString()} color="text-slate-900" />
            <AlertKPICard label="Open" value={alertStats.total.toString()} color="text-slate-600" />
            <AlertKPICard label="High Severity" value={alertStats.high.toString()} color="text-rose-600" />
            <AlertKPICard label="Medium Severity" value={alertStats.med.toString()} color="text-amber-600" />
            <AlertKPICard label="Value at Risk" value={formatCurrency(alertStats.valueAtRisk)} color="text-indigo-600" />
          </div>

          {/* Alerts Feed */}
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between px-2">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Recent Anomalous Patterns ({alerts.length})</p>
              <button className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest">Acknowledge Global Cluster</button>
            </div>

            {alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-slate-200">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                  <ShieldAlert size={40} />
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">System Integrity 100%</h3>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">No critical heuristic violations found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map(alert => (
                  <div 
                    key={alert.id} 
                    className={`bg-white p-6 rounded-2xl border flex items-start space-x-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5 ${
                      alert.severity === 'HIGH' ? 'border-l-4 border-l-rose-500' :
                      alert.severity === 'MEDIUM' ? 'border-l-4 border-l-amber-500' :
                      'border-l-4 border-l-blue-500'
                    }`}
                  >
                    <div className={`mt-1 flex-shrink-0 ${
                      alert.severity === 'HIGH' ? 'text-rose-500' : 
                      alert.severity === 'MEDIUM' ? 'text-amber-500' : 'text-blue-500'
                    }`}>
                      {alert.severity === 'HIGH' ? <AlertCircle size={24} /> : 
                       alert.severity === 'MEDIUM' ? <AlertTriangle size={24} /> : <Info size={24} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-bold text-slate-900 tracking-tight truncate">Anomalous SKU Signature: {alert.skuId}</h4>
                        <div className="flex items-center text-[9px] text-slate-400 font-bold uppercase tracking-widest ml-4">
                          <Clock size={12} className="mr-1" />
                          <span>{new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                      <p className="text-slate-600 text-xs font-medium leading-relaxed">{alert.message}</p>
                      <div className="mt-4 flex items-center space-x-4">
                        <span className={`text-[9px] font-black px-2.5 py-1 rounded uppercase tracking-widest ${
                          alert.severity === 'HIGH' ? 'bg-rose-50 text-rose-700 border border-rose-100' : 
                          alert.severity === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-blue-50 text-blue-700 border border-blue-100'
                        }`}>
                          {alert.severity} SEVERITY
                        </span>
                        <button className="text-[9px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest transition-colors flex items-center space-x-1">
                          <span>Investigate Drift</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Alert Configuration Tab */}
      {activeTab === 'config' && (
        <div className="space-y-6">
          {/* Recalculating Indicator */}
          {isRecalculating && (
            <div className="flex items-center justify-center space-x-2 py-2 bg-indigo-50 rounded-xl border border-indigo-100">
              <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-bold text-indigo-700">Recalculating alert impacts...</span>
            </div>
          )}

          {/* Results Summary - Top Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">Open Alerts</span>
                <Bell size={16} className="opacity-50" />
              </div>
              <div className="text-3xl font-black">{configResults.openAlerts}</div>
              <div className="text-[10px] font-medium opacity-60 mt-1">Based on {rules.filter(r => r.enabled).length} active rules</div>
            </div>

            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">High Severity</span>
                <AlertCircle size={16} className="opacity-60" />
              </div>
              <div className="text-3xl font-black">{configResults.highSeverityAlerts}</div>
              <div className="text-[10px] font-medium opacity-70 mt-1">Requires immediate action</div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Value at Risk</span>
                <DollarSign size={16} className="opacity-60" />
              </div>
              <div className="text-2xl font-black">{formatCurrency(configResults.valueAtRisk)}</div>
              <div className="text-[10px] font-medium opacity-70 mt-1">Sum of impacted items</div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Alert Trend (7d)</span>
                <Calendar size={16} className="text-slate-400" />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <TrendingUp size={14} className="text-red-500" />
                  <span className="text-lg font-black text-red-600">+{configResults.newAlerts7d}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingDown size={14} className="text-emerald-500" />
                  <span className="text-lg font-black text-emerald-600">-{configResults.resolvedAlerts7d}</span>
                </div>
              </div>
              <div className="text-[10px] font-medium text-slate-400 mt-1">New vs Resolved</div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Left Column - Rule List */}
            <div className="col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Alert Rules</h3>
                <div className="flex items-center space-x-2">
                  <button onClick={handleReset} className="text-[10px] font-bold text-slate-500 hover:text-slate-700 flex items-center space-x-1">
                    <RefreshCw size={12} />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {rules.map(rule => (
                  <div 
                    key={rule.id}
                    onClick={() => setSelectedRuleId(rule.id)}
                    className={`bg-white p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                      selectedRuleId === rule.id ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-slate-100'
                    } ${!rule.enabled ? 'opacity-60' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleRule(rule.id); }}
                          className={`transition-colors ${rule.enabled ? 'text-emerald-500' : 'text-slate-300'}`}
                        >
                          {rule.enabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                        </button>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{rule.name}</h4>
                          <p className="text-[10px] text-slate-500 mt-0.5">{rule.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-[9px] font-bold px-2 py-1 rounded-full border ${getSeverityColor(rule.severity)}`}>
                          {rule.severity}
                        </span>
                        <ChevronRight size={14} className="text-slate-300" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Rule Configuration */}
            <div className="col-span-7 space-y-4">
              {selectedRule ? (
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{selectedRule.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">{selectedRule.description}</p>
                    </div>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-sm">
                      <Save size={14} />
                      <span>Save Rule</span>
                    </button>
                  </div>

                  {/* Enable/Disable Toggle */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <span className="text-sm font-bold text-slate-700">Rule Status</span>
                      <p className="text-[10px] text-slate-500">Enable or disable this alert rule</p>
                    </div>
                    <button
                      onClick={() => toggleRule(selectedRule.id)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${selectedRule.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}
                    >
                      {selectedRule.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>

                  {/* Severity Threshold */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-3 block">Severity Level</label>
                    <div className="flex items-center space-x-2">
                      {(['LOW', 'MEDIUM', 'HIGH'] as const).map(sev => (
                        <button
                          key={sev}
                          onClick={() => updateRule(selectedRule.id, { severity: sev })}
                          className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all border ${
                            selectedRule.severity === sev 
                              ? getSeverityColor(sev) + ' border-current'
                              : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'
                          }`}
                        >
                          {sev}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Value-at-Risk Threshold */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-700">Value-at-Risk Threshold</label>
                      <span className="text-sm font-black text-indigo-600">{formatCurrency(selectedRule.valueThreshold)}</span>
                    </div>
                    <input
                      type="range"
                      min={5000}
                      max={1000000}
                      step={5000}
                      value={selectedRule.valueThreshold}
                      onChange={(e) => updateRule(selectedRule.id, { valueThreshold: parseInt(e.target.value) })}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>₹5K</span>
                      <span>₹10L</span>
                    </div>
                  </div>

                  {/* Staleness Threshold */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-700">Staleness Threshold</label>
                      <span className="text-sm font-black text-amber-600">{selectedRule.stalenessThreshold} days</span>
                    </div>
                    <input
                      type="range"
                      min={7}
                      max={180}
                      value={selectedRule.stalenessThreshold}
                      onChange={(e) => updateRule(selectedRule.id, { stalenessThreshold: parseInt(e.target.value) })}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>7 days</span>
                      <span>180 days</span>
                    </div>
                  </div>

                  {/* Duplicate Trigger Threshold */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-700">Duplicate Similarity Threshold</label>
                      <span className="text-sm font-black text-purple-600">{selectedRule.duplicateThreshold}%</span>
                    </div>
                    <input
                      type="range"
                      min={70}
                      max={100}
                      value={selectedRule.duplicateThreshold}
                      onChange={(e) => updateRule(selectedRule.id, { duplicateThreshold: parseInt(e.target.value) })}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>70% (Near match)</span>
                      <span>100% (Exact)</span>
                    </div>
                  </div>

                  {/* Category/Plant Scope */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-2 block">Category Scope</label>
                      <div className="bg-slate-50 rounded-xl p-3 max-h-32 overflow-y-auto space-y-1">
                        {CATEGORIES.map(cat => (
                          <label key={cat} className="flex items-center space-x-2 py-1 cursor-pointer hover:bg-slate-100 px-2 rounded-lg">
                            <input
                              type="checkbox"
                              checked={selectedRule.categories.includes(cat)}
                              onChange={(e) => {
                                const cats = e.target.checked 
                                  ? [...selectedRule.categories, cat]
                                  : selectedRule.categories.filter(c => c !== cat);
                                updateRule(selectedRule.id, { categories: cats });
                              }}
                              className="w-3 h-3 rounded accent-indigo-600"
                            />
                            <span className="text-[10px] font-medium text-slate-600">{cat}</span>
                          </label>
                        ))}
                      </div>
                      <p className="text-[9px] text-slate-400 mt-1">{selectedRule.categories.length === 0 ? 'All categories' : `${selectedRule.categories.length} selected`}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-2 block">Plant Scope</label>
                      <div className="bg-slate-50 rounded-xl p-3 max-h-32 overflow-y-auto space-y-1">
                        {PLANTS.map(plant => (
                          <label key={plant} className="flex items-center space-x-2 py-1 cursor-pointer hover:bg-slate-100 px-2 rounded-lg">
                            <input
                              type="checkbox"
                              checked={selectedRule.plants.includes(plant)}
                              onChange={(e) => {
                                const plants = e.target.checked 
                                  ? [...selectedRule.plants, plant]
                                  : selectedRule.plants.filter(p => p !== plant);
                                updateRule(selectedRule.id, { plants: plants });
                              }}
                              className="w-3 h-3 rounded accent-indigo-600"
                            />
                            <span className="text-[10px] font-medium text-slate-600">{plant}</span>
                          </label>
                        ))}
                      </div>
                      <p className="text-[9px] text-slate-400 mt-1">{selectedRule.plants.length === 0 ? 'All plants' : `${selectedRule.plants.length} selected`}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-12 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Settings size={28} className="text-slate-400" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-600">Select a Rule to Configure</h4>
                  <p className="text-xs text-slate-400 mt-1">Click on any rule from the list to adjust its settings</p>
                </div>
              )}

              {/* Top Risky SKUs */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900">Top Risky SKUs</h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Preview based on rules</span>
                </div>
                <div className="space-y-2">
                  {configResults.topRiskySKUs.map((sku, idx) => (
                    <div key={sku.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <span className="w-5 h-5 bg-slate-200 rounded-lg flex items-center justify-center text-[9px] font-black text-slate-600">{idx + 1}</span>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{sku.id}</div>
                          <p className="text-[10px] text-slate-500">{sku.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black text-slate-900">{formatCurrency(sku.impact)}</div>
                        <p className="text-[9px] text-red-500 font-medium max-w-[140px] truncate">{sku.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start space-x-3">
            <Info className="text-blue-500 shrink-0 mt-0.5" size={16} />
            <p className="text-xs text-blue-700 leading-relaxed">
              Changes are previewed <span className="font-bold">instantly</span> in the results above. Click "Save Rule" on individual rules to push changes live. Saved rules will trigger new alerts on the next data refresh cycle.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const AlertKPICard = ({ label, value, color }: { label: string, value: string, color: string }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-36 hover:border-indigo-200 transition-all group">
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{label}</span>
    <span className={`text-3xl font-black tracking-tighter transition-transform group-hover:scale-105 origin-left ${color}`}>{value}</span>
  </div>
);

export default AlertsPanel;
