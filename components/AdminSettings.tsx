
import React from 'react';
import { ScoringConfig, Role } from '../types';
import { Lock, Sliders, Info } from 'lucide-react';

interface Props {
  config: ScoringConfig;
  setConfig: (c: ScoringConfig) => void;
  role: Role;
}

const AdminSettings: React.FC<Props> = ({ config, setConfig, role }) => {
  const isAdmin = role === 'ADMIN';

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <Lock className="text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Access Denied</h3>
        <p className="text-slate-500 text-center max-w-sm mt-2">
          Only users with the <span className="font-bold text-slate-900">ADMIN</span> role can modify scoring heuristics and composite weights.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Sliders size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Composite Score Configuration</h3>
            <p className="text-sm text-slate-500">Adjust how SKU priority is calculated across the platform</p>
          </div>
        </div>

        <div className="space-y-10">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700">Financial Value Weight</label>
              <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-black">{config.valueWeight}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={config.valueWeight}
              onChange={(e) => setConfig({ ...config, valueWeight: parseInt(e.target.value) })}
              className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <p className="text-xs text-slate-400">Impact: High weight prioritizes SKUs with high inventory value (A-Class focus).</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700">Velocity (FSN) Weight</label>
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-black">{config.velocityWeight}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={config.velocityWeight}
              onChange={(e) => setConfig({ ...config, velocityWeight: parseInt(e.target.value) })}
              className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <p className="text-xs text-slate-400">Impact: High weight prioritizes items based on movement speed (Fast Movers vs. Dead Stock).</p>
          </div>
        </div>

        <div className="mt-12 bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start space-x-3">
          <Info className="text-blue-500 shrink-0 mt-1" size={18} />
          <p className="text-sm text-blue-700 leading-relaxed">
            Changes to weights are reflected <span className="font-bold underline">instantly</span> across the Analysis and Recommendations modules. System-wide re-calculation triggers upon setiap slider move.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
