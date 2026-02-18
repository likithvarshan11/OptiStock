import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Clock, 
  TrendingDown, 
  TrendingUp, 
  Package, 
  Shield, 
  Shuffle, 
  AlertTriangle,
  DollarSign,
  BarChart3,
  Activity,
  Check,
  X,
  Layers,
  ArrowRight,
  RefreshCw,
  Save,
  Info
} from 'lucide-react';
import { SKU } from '../types';

interface Props {
  inventory: SKU[];
}

interface RuleConfig {
  deadStockThreshold: number;
  fsnFastCutoff: number;
  fsnSlowCutoff: number;
  abcWeight: number;
  fsnWeight: number;
  vedWeight: number;
  maxScrapPercent: number;
  protectCritical: boolean;
  transferEnabled: boolean;
  transferFromPlant: string;
  transferToPlant: string;
  serviceLevelSensitivity: number;
}

interface ImpactMetrics {
  workingCapitalRelease: number;
  workingCapitalPercent: number;
  deadStockValue: number;
  deadStockChange: number;
  atRiskSKUs: number;
  totalRecommendations: number;
  actionSplit: {
    hold: number;
    transfer: number;
    scrap: number;
    dispose: number;
    review: number;
  };
  topImpactedSKUs: {
    id: string;
    description: string;
    action: string;
    impact: number;
    reason: string;
  }[];
}

const PLANTS = ['Plant A - Mumbai', 'Plant B - Delhi', 'Plant C - Chennai', 'Plant D - Bangalore', 'Plant E - Kolkata'];

const RuleManagement: React.FC<Props> = ({ inventory }) => {
  const [config, setConfig] = useState<RuleConfig>({
    deadStockThreshold: 180,
    fsnFastCutoff: 30,
    fsnSlowCutoff: 90,
    abcWeight: 30,
    fsnWeight: 40,
    vedWeight: 30,
    maxScrapPercent: 2,
    protectCritical: true,
    transferEnabled: true,
    transferFromPlant: 'Plant A - Mumbai',
    transferToPlant: 'Plant C - Chennai',
    serviceLevelSensitivity: 50,
  });

  const [impacts, setImpacts] = useState<ImpactMetrics>({
    workingCapitalRelease: 18750000,
    workingCapitalPercent: 14.2,
    deadStockValue: 4250000,
    deadStockChange: -8.5,
    atRiskSKUs: 87,
    totalRecommendations: 1215,
    actionSplit: {
      hold: 425,
      transfer: 340,
      scrap: 95,
      dispose: 75,
      review: 280,
    },
    topImpactedSKUs: [
      { id: 'SKU-7842', description: 'Industrial Valve Assembly XL', action: 'Transfer', impact: 2450000, reason: 'High value, low velocity at source' },
      { id: 'SKU-3291', description: 'Precision Bearing Set 42mm', action: 'Scrap', impact: 1875000, reason: 'Dead stock >365 days, non-critical' },
      { id: 'SKU-5567', description: 'Hydraulic Pump Motor', action: 'Hold', impact: 1650000, reason: 'Critical item, seasonal demand' },
      { id: 'SKU-9012', description: 'Steel Flange Connector', action: 'Dispose', impact: 980000, reason: 'Discontinued, no substitute' },
      { id: 'SKU-1456', description: 'Control Panel Module', action: 'Review', impact: 875000, reason: 'Borderline metrics, needs audit' },
      { id: 'SKU-6734', description: 'Gearbox Assembly 200HP', action: 'Transfer', impact: 720000, reason: 'Excess at Plant A, shortage at Plant C' },
    ]
  });

  const [isRecalculating, setIsRecalculating] = useState(false);

  // Recalculate impacts when config changes
  useEffect(() => {
    setIsRecalculating(true);
    const timer = setTimeout(() => {
      // Mock dynamic calculation based on config
      const deadStockFactor = config.deadStockThreshold / 180;
      const serviceFactor = config.serviceLevelSensitivity / 50;
      const scrapFactor = config.maxScrapPercent / 2;
      
      setImpacts({
        workingCapitalRelease: Math.round(18750000 * (1 / deadStockFactor) * (config.transferEnabled ? 1.15 : 0.85)),
        workingCapitalPercent: parseFloat((14.2 * (1 / deadStockFactor) * (config.transferEnabled ? 1.1 : 0.9)).toFixed(1)),
        deadStockValue: Math.round(4250000 * deadStockFactor),
        deadStockChange: parseFloat((-8.5 / deadStockFactor).toFixed(1)),
        atRiskSKUs: Math.round(87 * serviceFactor),
        totalRecommendations: Math.round(1215 * (1 / deadStockFactor) * scrapFactor),
        actionSplit: {
          hold: Math.round(425 * serviceFactor),
          transfer: config.transferEnabled ? Math.round(340 * 1.2) : 0,
          scrap: config.protectCritical ? Math.round(95 * 0.7 * scrapFactor) : Math.round(95 * scrapFactor),
          dispose: Math.round(75 * scrapFactor),
          review: Math.round(280 * (1 / serviceFactor)),
        },
        topImpactedSKUs: [
          { id: 'SKU-7842', description: 'Industrial Valve Assembly XL', action: config.transferEnabled ? 'Transfer' : 'Hold', impact: 2450000, reason: config.transferEnabled ? 'High value, low velocity at source' : 'Transfer disabled, monitoring' },
          { id: 'SKU-3291', description: 'Precision Bearing Set 42mm', action: config.protectCritical ? 'Review' : 'Scrap', impact: 1875000, reason: config.protectCritical ? 'Critical protection enabled' : 'Dead stock >365 days, non-critical' },
          { id: 'SKU-5567', description: 'Hydraulic Pump Motor', action: 'Hold', impact: 1650000, reason: 'Critical item, seasonal demand' },
          { id: 'SKU-9012', description: 'Steel Flange Connector', action: 'Dispose', impact: 980000, reason: 'Discontinued, no substitute' },
          { id: 'SKU-1456', description: 'Control Panel Module', action: 'Review', impact: 875000, reason: 'Borderline metrics, needs audit' },
          { id: 'SKU-6734', description: 'Gearbox Assembly 200HP', action: config.transferEnabled ? 'Transfer' : 'Review', impact: 720000, reason: config.transferEnabled ? `Excess at ${config.transferFromPlant.split(' - ')[0]}, shortage at ${config.transferToPlant.split(' - ')[0]}` : 'Transfer disabled' },
        ]
      });
      setIsRecalculating(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [config]);

  const handleReset = () => {
    setConfig({
      deadStockThreshold: 180,
      fsnFastCutoff: 30,
      fsnSlowCutoff: 90,
      abcWeight: 30,
      fsnWeight: 40,
      vedWeight: 30,
      maxScrapPercent: 2,
      protectCritical: true,
      transferEnabled: true,
      transferFromPlant: 'Plant A - Mumbai',
      transferToPlant: 'Plant C - Chennai',
      serviceLevelSensitivity: 50,
    });
  };

  const getActionColor = (action: string) => {
    switch(action) {
      case 'Hold': return 'bg-indigo-100 text-indigo-700';
      case 'Transfer': return 'bg-emerald-100 text-emerald-700';
      case 'Scrap': return 'bg-amber-100 text-amber-700';
      case 'Dispose': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const totalWeight = config.abcWeight + config.fsnWeight + config.vedWeight;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Rule Management</h2>
          <p className="text-sm text-slate-500 mt-1">Configure business thresholds and scoring weights to align recommendations with your policies</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleReset}
            className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all shadow-sm"
          >
            <RefreshCw size={14} />
            <span>Reset to Defaults</span>
          </button>
          <button className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
            <Save size={14} />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Configuration Controls */}
        <div className="col-span-5 space-y-5">
          {/* Dead Stock Threshold */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-50 text-red-600 rounded-xl">
                <Clock size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Dead Stock Threshold</h3>
                <p className="text-[10px] text-slate-500">Days without movement to classify as dead</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">90 days</span>
                <span className="text-lg font-black text-red-600">{config.deadStockThreshold} days</span>
                <span className="text-xs text-slate-500">365 days</span>
              </div>
              <input
                type="range"
                min={90}
                max={365}
                value={config.deadStockThreshold}
                onChange={(e) => setConfig({ ...config, deadStockThreshold: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
            </div>
          </div>

          {/* FSN Movement Cutoffs */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Activity size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">FSN Movement Cutoffs</h3>
                <p className="text-[10px] text-slate-500">Define Fast/Slow/Non-moving thresholds</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-emerald-600">Fast Moving (&lt; X days)</span>
                  <span className="text-sm font-bold text-slate-900">{config.fsnFastCutoff} days</span>
                </div>
                <input
                  type="range"
                  min={7}
                  max={60}
                  value={config.fsnFastCutoff}
                  onChange={(e) => setConfig({ ...config, fsnFastCutoff: parseInt(e.target.value) })}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-amber-600">Slow Moving (&lt; X days)</span>
                  <span className="text-sm font-bold text-slate-900">{config.fsnSlowCutoff} days</span>
                </div>
                <input
                  type="range"
                  min={60}
                  max={180}
                  value={config.fsnSlowCutoff}
                  onChange={(e) => setConfig({ ...config, fsnSlowCutoff: parseInt(e.target.value) })}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
              </div>
              <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Non-moving: </span>
                <span className="text-xs font-bold text-red-600">&gt; {config.fsnSlowCutoff} days</span>
              </div>
            </div>
          </div>

          {/* Scoring Weights */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Sliders size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Scoring Weights</h3>
                  <p className="text-[10px] text-slate-500">Composite score calculation weights</p>
                </div>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${totalWeight === 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                {totalWeight === 100 ? '✓ 100%' : `${totalWeight}%`}
              </span>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-indigo-600">ABC Weight (Value)</span>
                  <span className="text-sm font-bold text-slate-900">{config.abcWeight}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={config.abcWeight}
                  onChange={(e) => setConfig({ ...config, abcWeight: parseInt(e.target.value) })}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-emerald-600">FSN Weight (Velocity)</span>
                  <span className="text-sm font-bold text-slate-900">{config.fsnWeight}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={config.fsnWeight}
                  onChange={(e) => setConfig({ ...config, fsnWeight: parseInt(e.target.value) })}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-purple-600">VED Weight (Criticality)</span>
                  <span className="text-sm font-bold text-slate-900">{config.vedWeight}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={config.vedWeight}
                  onChange={(e) => setConfig({ ...config, vedWeight: parseInt(e.target.value) })}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>
            </div>
          </div>

          {/* Action Policy Caps */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                <Shield size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Action Policy Caps</h3>
                <p className="text-[10px] text-slate-500">Limit aggressive disposal actions</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-600">Max Scrap/Dispose %</span>
                  <span className="text-sm font-bold text-amber-600">{config.maxScrapPercent}%</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={0.5}
                  value={config.maxScrapPercent}
                  onChange={(e) => setConfig({ ...config, maxScrapPercent: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-xs font-bold text-slate-700">Protect Critical Items</span>
                  <p className="text-[10px] text-slate-500">Don't recommend scrap for VED-V items</p>
                </div>
                <button
                  onClick={() => setConfig({ ...config, protectCritical: !config.protectCritical })}
                  className={`w-12 h-6 rounded-full transition-all ${config.protectCritical ? 'bg-emerald-500' : 'bg-slate-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${config.protectCritical ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                </button>
              </div>
            </div>
          </div>

          {/* Transfer Settings */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Shuffle size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Transfer Policy</h3>
                  <p className="text-[10px] text-slate-500">Inter-plant transfer recommendations</p>
                </div>
              </div>
              <button
                onClick={() => setConfig({ ...config, transferEnabled: !config.transferEnabled })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${config.transferEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}
              >
                {config.transferEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
            {config.transferEnabled && (
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">From Plant</label>
                  <select
                    value={config.transferFromPlant}
                    onChange={(e) => setConfig({ ...config, transferFromPlant: e.target.value })}
                    className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {PLANTS.map(plant => (
                      <option key={plant} value={plant}>{plant}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-center">
                  <ArrowRight size={16} className="text-slate-400" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">To Plant</label>
                  <select
                    value={config.transferToPlant}
                    onChange={(e) => setConfig({ ...config, transferToPlant: e.target.value })}
                    className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {PLANTS.filter(p => p !== config.transferFromPlant).map(plant => (
                      <option key={plant} value={plant}>{plant}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Service Level Sensitivity */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                <TrendingUp size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Stock-out Sensitivity</h3>
                <p className="text-[10px] text-slate-500">Balance between cost savings and service level</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-600">Conservative</span>
                <span className="font-bold text-purple-600">{config.serviceLevelSensitivity}%</span>
                <span className="font-semibold text-red-600">Aggressive</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={config.serviceLevelSensitivity}
                onChange={(e) => setConfig({ ...config, serviceLevelSensitivity: parseInt(e.target.value) })}
                className="w-full h-2 bg-gradient-to-r from-emerald-200 via-purple-200 to-red-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
                <Info size={12} className="text-blue-500" />
                <span className="text-[10px] text-blue-700">
                  {config.serviceLevelSensitivity < 33 ? 'Prioritizing lower stock-out risk, higher inventory holding' : 
                   config.serviceLevelSensitivity > 66 ? 'Prioritizing cost reduction, accepting higher stock-out risk' : 
                   'Balanced approach between cost and service level'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Impact Results */}
        <div className="col-span-7 space-y-5">
          {/* Recalculating Indicator */}
          {isRecalculating && (
            <div className="flex items-center justify-center space-x-2 py-2 bg-indigo-50 rounded-xl border border-indigo-100">
              <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-bold text-indigo-700">Recalculating impacts...</span>
            </div>
          )}

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Working Capital Release</span>
                <DollarSign size={16} className="opacity-60" />
              </div>
              <div className="text-3xl font-black">₹{(impacts.workingCapitalRelease / 10000000).toFixed(2)} Cr</div>
              <div className="flex items-center space-x-1 mt-2">
                <TrendingUp size={12} />
                <span className="text-xs font-bold">{impacts.workingCapitalPercent}% of inventory</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Dead Stock Value</span>
                <Package size={16} className="opacity-60" />
              </div>
              <div className="text-3xl font-black">₹{(impacts.deadStockValue / 10000000).toFixed(2)} Cr</div>
              <div className="flex items-center space-x-1 mt-2">
                <TrendingDown size={12} />
                <span className="text-xs font-bold">{impacts.deadStockChange}% vs baseline</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Stock-out Risk</span>
                <AlertTriangle size={16} className="text-red-400" />
              </div>
              <div className="text-3xl font-black text-slate-900">{impacts.atRiskSKUs}</div>
              <div className="text-xs font-medium text-slate-500 mt-1">SKUs at risk</div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Recommendations</span>
                <Layers size={16} className="text-indigo-400" />
              </div>
              <div className="text-3xl font-black text-slate-900">{impacts.totalRecommendations.toLocaleString()}</div>
              <div className="text-xs font-medium text-slate-500 mt-1">Action items generated</div>
            </div>
          </div>

          {/* Action Split */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Action Distribution</h3>
            <div className="grid grid-cols-5 gap-3">
              {[
                { key: 'hold', label: 'Hold', color: 'indigo', value: impacts.actionSplit.hold },
                { key: 'transfer', label: 'Transfer', color: 'emerald', value: impacts.actionSplit.transfer },
                { key: 'scrap', label: 'Scrap', color: 'amber', value: impacts.actionSplit.scrap },
                { key: 'dispose', label: 'Dispose', color: 'red', value: impacts.actionSplit.dispose },
                { key: 'review', label: 'Review', color: 'slate', value: impacts.actionSplit.review },
              ].map(item => (
                <div key={item.key} className={`p-3 rounded-xl bg-${item.color}-50 border border-${item.color}-100`}>
                  <div className={`text-2xl font-black text-${item.color}-600`}>{item.value}</div>
                  <div className={`text-[10px] font-bold text-${item.color}-700 uppercase`}>{item.label}</div>
                </div>
              ))}
            </div>
            {/* Visual Bar */}
            <div className="mt-4 h-3 bg-slate-100 rounded-full overflow-hidden flex">
              {(() => {
                const total = impacts.actionSplit.hold + impacts.actionSplit.transfer + impacts.actionSplit.scrap + impacts.actionSplit.dispose + impacts.actionSplit.review;
                return (
                  <>
                    <div className="bg-indigo-500 h-full" style={{ width: `${(impacts.actionSplit.hold / total) * 100}%` }}></div>
                    <div className="bg-emerald-500 h-full" style={{ width: `${(impacts.actionSplit.transfer / total) * 100}%` }}></div>
                    <div className="bg-amber-500 h-full" style={{ width: `${(impacts.actionSplit.scrap / total) * 100}%` }}></div>
                    <div className="bg-red-500 h-full" style={{ width: `${(impacts.actionSplit.dispose / total) * 100}%` }}></div>
                    <div className="bg-slate-400 h-full" style={{ width: `${(impacts.actionSplit.review / total) * 100}%` }}></div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Top Impacted SKUs */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Top Impacted SKUs</h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">By Value Impact</span>
            </div>
            <div className="space-y-3">
              {impacts.topImpactedSKUs.map((sku, idx) => (
                <div key={sku.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 bg-slate-200 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-600">{idx + 1}</span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900">{sku.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${getActionColor(sku.action)}`}>{sku.action}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">{sku.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-slate-900">₹{(sku.impact / 100000).toFixed(1)}L</div>
                    <p className="text-[9px] text-slate-400 max-w-[150px] truncate">{sku.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start space-x-3">
            <Info className="text-blue-500 shrink-0 mt-0.5" size={16} />
            <p className="text-xs text-blue-700 leading-relaxed">
              Changes are reflected <span className="font-bold">instantly</span> in the impact metrics. Click "Save Configuration" to apply these rules across all analysis modules. Saved rules will persist until the next policy review cycle.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RuleManagement;
