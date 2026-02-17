
import React, { useMemo } from 'react';
import { Alert, SKU } from '../types';
import { AlertTriangle, AlertCircle, Info, Clock, ShieldAlert } from 'lucide-react';

interface Props {
  alerts: Alert[];
  inventory: SKU[];
}

const AlertsPanel: React.FC<Props> = ({ alerts, inventory }) => {
  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val.toLocaleString()}`;
  };

  const alertStats = useMemo(() => {
    const high = alerts.filter(a => a.severity === 'HIGH').length;
    const med = alerts.filter(a => a.severity === 'MEDIUM').length;
    
    // Value at Risk: Sum of totalValue for SKUs that have HIGH or MEDIUM alerts
    // Ensuring we only sum positive values for "Risk" purposes in capital allocation
    const alertSkuIds = new Set(alerts.map(a => a.skuId));
    const valueAtRisk = inventory
      .filter(sku => alertSkuIds.has(sku.id))
      .reduce((acc, sku) => acc + Math.max(0, sku.totalValue), 0);

    return {
      total: alerts.length,
      high,
      med,
      valueAtRisk
    };
  }, [alerts, inventory]);

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Strategic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Alerts: Demo Inventory Dataset</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Monitor anomalies and data quality issues</p>
        </div>
      </div>

      {/* Summary KPI Cards - Exact Labels Requested */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <AlertKPICard label="Total Alerts" value={alertStats.total.toString()} color="text-slate-900" />
        <AlertKPICard label="Open" value={alertStats.total.toString()} color="text-slate-600" />
        <AlertKPICard label="High Severity" value={alertStats.high.toString()} color="text-rose-600" />
        <AlertKPICard label="Medium Severity" value={alertStats.med.toString()} color="text-amber-600" />
        <AlertKPICard label="Value at Risk" value={formatCurrency(alertStats.valueAtRisk)} color="text-indigo-600" />
      </div>

      {/* Alerts Feed */}
      <div className="max-w-4xl mx-auto space-y-6 mt-12">
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
  );
};

const AlertKPICard = ({ label, value, color }: { label: string, value: string, color: string }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-36 hover:border-indigo-200 transition-all group">
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{label}</span>
    <span className={`text-3xl font-black tracking-tighter transition-transform group-hover:scale-105 origin-left ${color}`}>{value}</span>
  </div>
);

export default AlertsPanel;
