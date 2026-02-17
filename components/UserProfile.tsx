
import React from 'react';
import { 
  User, Shield, Palette, Settings2, Bell, 
  Layout, Fingerprint, Lock, Globe 
} from 'lucide-react';

interface Props {
  user: any;
  preferences: any;
  setPreferences: (p: any) => void;
}

const UserProfile: React.FC<Props> = ({ user, preferences, setPreferences }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Header Profile Section */}
      <div className="bg-white rounded-[3.5rem] p-12 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-12">
        <div className="relative group">
          <div className="w-40 h-40 bg-slate-900 rounded-[3rem] p-1.5 shadow-2xl transition-transform group-hover:scale-105 duration-500">
            <div className="w-full h-full rounded-[2.75rem] bg-[#F1F5F9] flex items-center justify-center overflow-hidden border-2 border-slate-900">
              <User size={64} className="text-slate-300" strokeWidth={1.5} />
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-3 rounded-2xl shadow-xl border-4 border-white">
            <Fingerprint size={20} />
          </div>
        </div>
        
        <div className="flex-1 text-center md:text-left space-y-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic">{user.name}</h2>
            <div className="bg-slate-900 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Verified Elite</div>
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-xs leading-none">Security Clearance: LEVEL 4A • Infrastructure Lead</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
             <span className="flex items-center space-x-2 text-[10px] font-black text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
               <Globe size={12} />
               <span>REGIONAL ACCESS: GLOBAL</span>
             </span>
             <span className="flex items-center space-x-2 text-[10px] font-black text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
               <Lock size={12} />
               <span>MFA ACTIVE</span>
             </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Col: Appearance & Notifications */}
        <div className="lg:col-span-7 space-y-10">
          <section className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm space-y-8">
            <div className="flex items-center space-x-4 mb-4">
               <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                 <Palette size={24} />
               </div>
               <h3 className="text-xl font-black text-slate-900 tracking-tight">System Aesthetics</h3>
            </div>
            
            <div className="space-y-8">
              <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl">
                <div>
                  <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Interface Mode</p>
                  <p className="text-xs text-slate-400 font-bold mt-1 uppercase">Adjust display luminance</p>
                </div>
                <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
                  <button 
                    onClick={() => setPreferences({ ...preferences, theme: 'light' })}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${preferences.theme === 'light' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100'}`}
                  >
                    Light
                  </button>
                  <button 
                    onClick={() => setPreferences({ ...preferences, theme: 'dark' })}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${preferences.theme === 'dark' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100'}`}
                  >
                    Dark
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl">
                <div>
                  <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Default Command Tab</p>
                  <p className="text-xs text-slate-400 font-bold mt-1 uppercase">Landing focus on sync</p>
                </div>
                <select 
                  value={preferences.defaultTab}
                  onChange={(e) => setPreferences({ ...preferences, defaultTab: e.target.value })}
                  className="bg-white border-none rounded-xl px-5 py-2.5 text-xs font-black uppercase tracking-widest text-slate-900 shadow-sm focus:ring-2 focus:ring-indigo-500/20"
                >
                   <option value="Dashboard">Strategy HUD</option>
                   <option value="Analysis">Divergence Analysis</option>
                   <option value="Recommendations">Approval Queue</option>
                </select>
              </div>
            </div>
          </section>

          <section className="bg-slate-900 rounded-[2.5rem] p-10 text-white flex items-center justify-between shadow-[0_30px_60px_-15px_rgba(15,23,42,0.3)]">
             <div className="space-y-2">
                <h4 className="text-xl font-black italic tracking-tight">Notification Pulse</h4>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Critical Alert Relay Active</p>
             </div>
             <button className="w-16 h-8 bg-indigo-600 rounded-full relative p-1 transition-all">
                <div className="w-6 h-6 bg-white rounded-full translate-x-8"></div>
             </button>
          </section>
        </div>

        {/* Right Col: Permissions & API */}
        <div className="lg:col-span-5 space-y-10">
          <section className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm space-y-8">
             <div className="flex items-center space-x-4 mb-4">
               <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                 <Shield size={24} />
               </div>
               <h3 className="text-xl font-black text-slate-900 tracking-tight">Role Capabilities</h3>
            </div>
            
            <div className="space-y-4">
               {[
                 { label: 'Strategic Override', status: user.role === 'ADMIN' ? 'Permitted' : 'Locked' },
                 { label: 'Bulk Data Wipe', status: 'Restricted' },
                 { label: 'Encrypted Export', status: 'Active' },
                 { label: 'Audit Trail Signature', status: 'Active' }
               ].map(perm => (
                 <div key={perm.label} className="flex items-center justify-between border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{perm.label}</span>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${perm.status === 'Locked' || perm.status === 'Restricted' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {perm.status}
                    </span>
                 </div>
               ))}
            </div>
            
            <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center space-x-2">
               <Lock size={14} />
               <span>Update Security Keys</span>
            </button>
          </section>

          <div className="p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100 flex items-start space-x-5">
             <Layout className="text-indigo-600 shrink-0 mt-1" size={24} />
             <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-900 mb-2">Beta Preview v3.2</h5>
                <p className="text-xs text-indigo-700 font-medium leading-relaxed">Early access to Predictive Logistics Map enabled for your account. Report discrepancies via the Internal Pulse console.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
