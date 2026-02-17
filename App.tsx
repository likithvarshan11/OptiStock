
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  CheckCircle2, 
  Settings, 
  LogOut, 
  Bell, 
  ShieldCheck,
  Package,
  AlertTriangle,
  ChevronRight,
  User as UserIcon,
  FileText,
  Plus,
  Share2,
  Edit2,
  ChevronDown,
  Cpu,
  TrendingUp,
  Repeat,
  Link,
  Target,
  FileBarChart,
  ShieldAlert,
  Map,
  ChevronUp,
  MessageSquare
} from 'lucide-react';
import { User, Role, SKU, Recommendation, Alert, ScoringConfig, ActiveTab, ABCClass, FSNClass, VEDClass, XYZClass, RecommendationAction } from './types';
import { MOCK_SKUS } from './constants';
import DashboardView from './components/DashboardView';
import UploadCentre from './components/UploadCentre';
import InventoryAnalysis from './components/InventoryAnalysis';
import RecommendationsView from './components/RecommendationsView';
import AdminSettings from './components/AdminSettings';
import AlertsPanel from './components/AlertsPanel';
import ReportingModule from './components/ReportingModule';
import UserProfile from './components/UserProfile';

// Phase 2 Components
import RiskAccelerationMonitor from './components/RiskAccelerationMonitor';
import ReuseIntelligence from './components/ReuseIntelligence';
import SubstitutionIntelligence from './components/SubstitutionIntelligence';
import ForwardRiskOutlook from './components/ForwardRiskOutlook';
import GovernanceAnalytics from './components/GovernanceAnalytics';
import DataIntegrityIntelligence from './components/DataIntegrityIntelligence';
import WorkingCapitalHeatmap from './components/WorkingCapitalHeatmap';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('optistock_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [preferences, setPreferences] = useState({
    theme: 'light',
    defaultTab: 'Dashboard',
    showNotifications: true
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('Dashboard');
  const [inventory, setInventory] = useState<SKU[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [scoringConfig, setScoringConfig] = useState<ScoringConfig>({ valueWeight: 60, velocityWeight: 40 });
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPhase2Expanded, setIsPhase2Expanded] = useState(false);
  const [isAnnotationMode, setIsAnnotationMode] = useState(false);

  useEffect(() => {
    const savedPrefs = localStorage.getItem('optistock_prefs');
    if (savedPrefs) setPreferences(JSON.parse(savedPrefs));
  }, []);

  useEffect(() => {
    if (inventory.length === 0) return;

    const sortedByValue = [...inventory].sort((a, b) => b.totalValue - a.totalValue);
    const totalInventoryValue = sortedByValue.reduce((acc, item) => acc + Math.max(0, item.totalValue), 0);
    let cumulativeValue = 0;

    const enrichedInventory = sortedByValue.map((item, index) => {
      const val = Math.max(0, item.totalValue);
      cumulativeValue += val;
      const ratio = cumulativeValue / (totalInventoryValue || 1);

      let abc: ABCClass = 'C';
      if (ratio <= 0.7) abc = 'A';
      else if (ratio <= 0.9) abc = 'B';

      const lastSale = new Date(item.lastSaleDate);
      const daysSince = Math.floor((new Date().getTime() - lastSale.getTime()) / (1000 * 3600 * 24));
      
      let fsn: FSNClass = 'N';
      if (daysSince <= 30) fsn = 'F';
      else if (daysSince <= 90) fsn = 'S';

      const ved: VEDClass = index % 3 === 0 ? 'V' : index % 3 === 1 ? 'E' : 'D';
      const xyz: XYZClass = index % 4 === 0 ? 'X' : index % 4 === 1 ? 'Y' : 'Z';

      const abcPoints = abc === 'A' ? 3 : abc === 'B' ? 2 : 1;
      const vedPoints = ved === 'V' ? 3 : ved === 'E' ? 2 : 1;
      const xyzPoints = xyz === 'X' ? 3 : xyz === 'Y' ? 2 : 1;
      const fsnPoints = fsn === 'F' ? 3 : fsn === 'S' ? 2 : 1;

      const composite = (0.3 * abcPoints) + (0.4 * vedPoints) + (0.15 * xyzPoints) + (0.15 * fsnPoints);

      return { 
        ...item, 
        abcClass: abc, 
        fsnClass: fsn, 
        vedClass: ved, 
        xyzClass: xyz, 
        compositeScore: parseFloat(composite.toFixed(2)) 
      };
    });

    setInventory(enrichedInventory);

    const newAlerts: Alert[] = [];
    enrichedInventory.forEach(item => {
      if (item.unitCost <= 0) newAlerts.push({ id: `a1-${item.id}`, skuId: item.id, message: `Critical Cost Discrepancy`, severity: 'HIGH', timestamp: new Date().toISOString() });
      if (item.qtyOnHand < 0) newAlerts.push({ id: `a2-${item.id}`, skuId: item.id, message: `Negative Inventory Lock`, severity: 'HIGH', timestamp: new Date().toISOString() });
      if (item.totalValue > 50000) newAlerts.push({ id: `a3-${item.id}`, skuId: item.id, message: `High Value Concentration`, severity: 'MEDIUM', timestamp: new Date().toISOString() });
    });
    setAlerts(newAlerts);

    const recs: Recommendation[] = enrichedInventory.map((item, index) => {
      let action: RecommendationAction = 'Review';
      
      if (item.fsnClass === 'N' && item.abcClass === 'A') action = 'Scrap';
      else if (item.qtyOnHand < item.minLevel && item.fsnClass === 'F') action = 'Hold';
      else if (item.status === 'Discontinued' && item.qtyOnHand > 0) action = 'Dispose';
      else if (item.totalValue > 50000) action = 'Transfer';
      else if (index % 5 === 0) action = 'Pending';
      else return null;

      return { 
        id: `r-${item.id}-${index}`, 
        skuId: item.id, 
        skuDescription: item.description, 
        action, 
        impact: Math.max(0, item.totalValue) || 15000, 
        status: 'PENDING' 
      };
    }).filter(Boolean) as Recommendation[];
    setRecommendations(recs);
  }, [scoringConfig, inventory.length > 0]);

  const handleLogin = (role: Role) => {
    const newUser = { name: `Principal ${role.toLowerCase()}`, role };
    setUser(newUser);
    localStorage.setItem('optistock_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('optistock_user');
  };

  const handleShare = () => {
    window.print();
  };

  const toggleAnnotation = () => {
    setIsAnnotationMode(!isAnnotationMode);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-12 space-y-10 border border-slate-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#1E293B] rounded-2xl flex items-center justify-center mx-auto mb-8">
              <Package className="text-white w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-[#1E293B] tracking-tight leading-none uppercase text-center">OptiStock Console</h1>
            <p className="text-slate-400 mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-center">Supply Chain Risk Management</p>
          </div>
          <div className="space-y-3">
            {(['ADMIN', 'REVIEWER', 'VIEWER'] as Role[]).map(role => (
              <button key={role} onClick={() => handleLogin(role)} className="w-full flex items-center justify-between p-5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all group">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                    <ShieldCheck size={18} />
                  </div>
                  <span className="font-bold text-[#1E293B] tracking-tight">{role}</span>
                </div>
                <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'Dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'Inventory Analysis', icon: BarChart3, label: 'Inventory Analysis' },
    { id: 'Recommendations', icon: CheckCircle2, label: 'Recommendations', badge: recommendations.filter(r => r.status === 'PENDING').length },
    { id: 'Alerts', icon: AlertTriangle, label: 'Alerts', badge: alerts.length },
  ];

  const phase2Items = [
    { id: 'Risk Acceleration Monitor', icon: TrendingUp, label: 'Risk Acceleration' },
    { id: 'Reuse & Transfer Intelligence', icon: Repeat, label: 'Reuse & Transfer' },
    { id: 'Material Substitution Intelligence', icon: Link, label: 'Substitution Logic' },
    { id: 'Forward Risk Outlook', icon: Target, label: 'Forward Outlook' },
    { id: 'Classification Governance Analytics', icon: FileBarChart, label: 'Governance' },
    { id: 'Data Health & ERP Integrity', icon: ShieldAlert, label: 'Data Integrity' },
    { id: 'Working Capital Concentration', icon: Map, label: 'Capital Heatmap' },
  ];

  return (
    <div className={`flex h-screen overflow-hidden ${preferences.theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-[#F8FAFC]'} ${isAnnotationMode ? 'cursor-crosshair' : ''}`}>
      <aside className="w-72 bg-[#E2E8F0] border-r border-slate-300 flex flex-col shrink-0 no-print">
        <div className="p-8 pb-6 flex items-center justify-center">
           <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#1E293B] rounded-lg flex items-center justify-center">
                <Package className="text-white w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-[#1E293B] uppercase tracking-tighter">OptiStock</span>
           </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-6">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-6 mb-2 mt-4">Core Intelligence</div>
          {navItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id as ActiveTab)} 
              className={`w-full flex items-center justify-between px-6 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-white shadow-sm text-[#2C4A86] font-bold border border-slate-200' : 'text-slate-600 hover:bg-slate-100/50'}`}
            >
              <div className="flex items-center space-x-3">
                <item.icon size={16} />
                <span className="text-[13px]">{item.label}</span>
              </div>
              {item.badge ? <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{item.badge}</span> : null}
            </button>
          ))}

          <div className="mt-6 border-t border-slate-300 pt-4">
            <button 
              onClick={() => setIsPhase2Expanded(!isPhase2Expanded)}
              className="w-full flex items-center justify-between px-6 py-3 text-slate-600 hover:bg-slate-100/50 rounded-xl group transition-all"
            >
              <div className="flex items-center space-x-3">
                <Cpu size={16} className="text-indigo-600" />
                <span className="text-[13px] font-bold uppercase tracking-widest">Phase 2</span>
              </div>
              {isPhase2Expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            
            {isPhase2Expanded && (
              <div className="mt-1 space-y-1 pl-4 animate-in slide-in-from-top-2">
                {phase2Items.map(item => (
                  <button 
                    key={item.id} 
                    onClick={() => setActiveTab(item.id as ActiveTab)} 
                    className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-[11px] font-bold transition-all ${activeTab === item.id ? 'bg-white shadow-sm text-indigo-700 border border-slate-200' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'}`}
                  >
                    <item.icon size={14} className={activeTab === item.id ? 'text-indigo-600' : 'text-slate-400'} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="p-6 border-t border-slate-300 bg-[#E2E8F0]/50 space-y-4">
           <button onClick={() => setIsUploadModalOpen(true)} className="w-full flex items-center justify-center space-x-3 py-3 bg-[#1E293B] text-white rounded-xl text-[11px] font-bold uppercase tracking-widest shadow-sm hover:bg-[#2C3E50] transition-colors">
             <Plus size={16} />
             <span>Ingest Data</span>
           </button>

           <div className="flex items-center space-x-3">
             <button 
              onClick={() => setActiveTab('Admin Settings')}
              className={`p-2 rounded-xl border border-slate-300 shadow-sm transition-all ${activeTab === 'Admin Settings' ? 'bg-white text-indigo-600 border-indigo-200' : 'bg-white text-slate-400 hover:bg-slate-50'}`}
             >
               <Settings size={18} />
             </button>
             <div onClick={() => setActiveTab('Profile')} className={`flex-1 flex items-center space-x-3 p-2 rounded-xl border shadow-sm cursor-pointer transition-all ${activeTab === 'Profile' ? 'bg-white border-indigo-200' : 'bg-white border-slate-300 hover:bg-slate-50'}`}>
               <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                 <UserIcon size={16} />
               </div>
               <div className="flex-1 overflow-hidden">
                 <p className="text-[10px] font-bold text-[#1E293B] truncate leading-none mb-1">{user.name}</p>
                 <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest leading-none">{user.role}</p>
               </div>
               <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors">
                 <LogOut size={14} />
               </button>
             </div>
           </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-white relative">
        {isAnnotationMode && (
          <div className="sticky top-0 z-[60] bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest py-1 px-4 flex items-center justify-center gap-2">
            <MessageSquare size={12} />
            <span>Annotation Mode Active - Click any chart component to add strategic notes</span>
            <button onClick={toggleAnnotation} className="ml-4 underline">Disable</button>
          </div>
        )}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-10 py-5 flex items-center justify-between no-print">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-[#1E293B] tracking-tight">
              {activeTab}
            </h1>
            <div className="mt-1 flex items-center space-x-2">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Health Context: Supply</span>
              <div className="w-1 h-1 rounded-full bg-slate-300"></div>
              <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest">Real-time Engine</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleAnnotation}
              className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ${isAnnotationMode ? 'bg-indigo-600 text-white' : 'bg-[#2C4A86] text-white hover:bg-[#1E3A8A]'}`}
            >
               <Edit2 size={14} />
               <span>{isAnnotationMode ? 'Exit Annotation' : 'Annotate'}</span>
            </button>
            <button 
              onClick={handleShare}
              className="flex items-center space-x-1 px-4 py-2 bg-white border border-slate-300 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all"
            >
               <Share2 size={14} />
               <span>Share View</span>
            </button>
          </div>
        </header>

        <div className="p-10 max-w-[1600px] mx-auto print:p-0">
          {activeTab === 'Dashboard' && <DashboardView inventory={inventory} recommendations={recommendations} alerts={alerts} />}
          {activeTab === 'Inventory Analysis' && <InventoryAnalysis inventory={inventory} />}
          {activeTab === 'Recommendations' && <RecommendationsView inventory={inventory} recommendations={recommendations} onAction={(id, status) => setRecommendations(p => p.map(r => r.id === id ? {...r, status} : r))} role={user.role} />}
          {activeTab === 'Alerts' && <AlertsPanel inventory={inventory} alerts={alerts} />}
          {activeTab === 'Profile' && <UserProfile user={user} preferences={preferences} setPreferences={(p) => { setPreferences(p); localStorage.setItem('optistock_prefs', JSON.stringify(p)); }} />}
          {activeTab === 'Admin Settings' && <AdminSettings config={scoringConfig} setConfig={setScoringConfig} role={user.role} />}

          {/* Phase 2 Views */}
          {activeTab === 'Risk Acceleration Monitor' && <RiskAccelerationMonitor inventory={inventory} />}
          {activeTab === 'Reuse & Transfer Intelligence' && <ReuseIntelligence inventory={inventory} />}
          {activeTab === 'Material Substitution Intelligence' && <SubstitutionIntelligence inventory={inventory} />}
          {activeTab === 'Forward Risk Outlook' && <ForwardRiskOutlook inventory={inventory} />}
          {activeTab === 'Classification Governance Analytics' && <GovernanceAnalytics inventory={inventory} />}
          {activeTab === 'Data Health & ERP Integrity' && <DataIntegrityIntelligence inventory={inventory} />}
          {activeTab === 'Working Capital Concentration' && <WorkingCapitalHeatmap inventory={inventory} />}
        </div>
      </main>

      <UploadCentre 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        onLoadData={() => { setInventory(MOCK_SKUS); setIsUploadModalOpen(false); }} 
        uploadHistory={[]} 
      />
    </div>
  );
};

export default App;
