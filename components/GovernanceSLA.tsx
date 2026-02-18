import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  Users, 
  TrendingUp, 
  TrendingDown,
  Bell,
  Calendar,
  Shield,
  Timer,
  ChevronRight,
  Filter,
  RefreshCw,
  Save,
  ArrowUpRight,
  User,
  Building,
  Layers,
  Info,
  Zap
} from 'lucide-react';

interface SLAConfig {
  reviewHours: number;
  approvalHours: number;
  escalationL1Hours: number;
  escalationL2Hours: number;
  escalationL3Hours: number;
  warnThreshold: number;
  breachThreshold: number;
  workingHoursStart: number;
  workingHoursEnd: number;
  excludeWeekends: boolean;
  excludeHolidays: boolean;
  selectedPlants: string[];
  selectedCategories: string[];
  selectedOwners: string[];
  selectedSeverity: string[];
}

interface SLAItem {
  id: string;
  skuId: string;
  description: string;
  action: string;
  owner: string;
  team: string;
  plant: string;
  category: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'pending' | 'warning' | 'breached';
  createdAt: Date;
  dueAt: Date;
  hoursRemaining: number;
  percentComplete: number;
  escalationLevel: number;
}

interface EscalationEvent {
  id: string;
  itemId: string;
  skuId: string;
  fromLevel: number;
  toLevel: number;
  triggeredAt: Date;
  notifiedTo: string;
  reason: string;
}

interface OwnerBacklog {
  owner: string;
  team: string;
  pending: number;
  warning: number;
  breached: number;
  avgResponseTime: number;
}

const PLANTS = ['Plant A - Mumbai', 'Plant B - Delhi', 'Plant C - Chennai', 'Plant D - Bangalore'];
const CATEGORIES = ['Bearings', 'Valves', 'Pumps', 'Motors', 'Connectors', 'Electronics'];
const OWNERS = ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Gupta', 'Vikram Singh', 'Ananya Reddy'];
const TEAMS = ['Procurement', 'Operations', 'Finance', 'Quality', 'Logistics'];

const generateMockSLAItems = (): SLAItem[] => {
  const actions = ['Review Transfer', 'Approve Scrap', 'Validate Disposal', 'Confirm Hold', 'Audit Classification'];
  const items: SLAItem[] = [];
  const now = new Date();
  
  for (let i = 0; i < 45; i++) {
    const hoursAgo = Math.random() * 72;
    const createdAt = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
    const slaHours = 24 + Math.random() * 48;
    const dueAt = new Date(createdAt.getTime() + slaHours * 60 * 60 * 1000);
    const hoursRemaining = (dueAt.getTime() - now.getTime()) / (60 * 60 * 1000);
    const percentComplete = Math.min(100, ((hoursAgo / slaHours) * 100));
    
    let status: 'pending' | 'warning' | 'breached' = 'pending';
    if (percentComplete >= 100 || hoursRemaining < 0) status = 'breached';
    else if (percentComplete >= 80) status = 'warning';
    
    items.push({
      id: `sla-${i + 1}`,
      skuId: `SKU-${1000 + Math.floor(Math.random() * 9000)}`,
      description: `${['Industrial', 'Precision', 'Heavy-duty', 'Standard', 'Custom'][Math.floor(Math.random() * 5)]} ${['Valve', 'Bearing', 'Pump', 'Motor', 'Connector'][Math.floor(Math.random() * 5)]} Assembly`,
      action: actions[Math.floor(Math.random() * actions.length)],
      owner: OWNERS[Math.floor(Math.random() * OWNERS.length)],
      team: TEAMS[Math.floor(Math.random() * TEAMS.length)],
      plant: PLANTS[Math.floor(Math.random() * PLANTS.length)].split(' - ')[0],
      category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
      severity: ['HIGH', 'MEDIUM', 'LOW'][Math.floor(Math.random() * 3)] as 'HIGH' | 'MEDIUM' | 'LOW',
      status,
      createdAt,
      dueAt,
      hoursRemaining: Math.max(-48, hoursRemaining),
      percentComplete: Math.min(150, percentComplete),
      escalationLevel: status === 'breached' ? (Math.random() > 0.5 ? 2 : 1) : 0
    });
  }
  
  return items.sort((a, b) => a.hoursRemaining - b.hoursRemaining);
};

const generateMockEscalations = (): EscalationEvent[] => {
  const events: EscalationEvent[] = [];
  const now = new Date();
  
  for (let i = 0; i < 12; i++) {
    const hoursAgo = Math.random() * 168;
    events.push({
      id: `esc-${i + 1}`,
      itemId: `sla-${Math.floor(Math.random() * 45) + 1}`,
      skuId: `SKU-${1000 + Math.floor(Math.random() * 9000)}`,
      fromLevel: Math.random() > 0.6 ? 1 : 0,
      toLevel: Math.random() > 0.6 ? 2 : 1,
      triggeredAt: new Date(now.getTime() - hoursAgo * 60 * 60 * 1000),
      notifiedTo: ['Head of Procurement', 'VP Operations', 'Plant Manager', 'CFO', 'Director Supply Chain'][Math.floor(Math.random() * 5)],
      reason: ['SLA breach > 24h', 'High value item pending', 'Critical severity breach', 'Multiple warnings ignored', 'Escalation threshold hit'][Math.floor(Math.random() * 5)]
    });
  }
  
  return events.sort((a, b) => b.triggeredAt.getTime() - a.triggeredAt.getTime());
};

const generateOwnerBacklogs = (items: SLAItem[]): OwnerBacklog[] => {
  const backlogMap = new Map<string, OwnerBacklog>();
  
  items.forEach(item => {
    if (!backlogMap.has(item.owner)) {
      backlogMap.set(item.owner, {
        owner: item.owner,
        team: item.team,
        pending: 0,
        warning: 0,
        breached: 0,
        avgResponseTime: 12 + Math.random() * 24
      });
    }
    const backlog = backlogMap.get(item.owner)!;
    if (item.status === 'pending') backlog.pending++;
    else if (item.status === 'warning') backlog.warning++;
    else backlog.breached++;
  });
  
  return Array.from(backlogMap.values()).sort((a, b) => (b.breached + b.warning) - (a.breached + a.warning));
};

const GovernanceSLA: React.FC = () => {
  const [config, setConfig] = useState<SLAConfig>({
    reviewHours: 24,
    approvalHours: 48,
    escalationL1Hours: 4,
    escalationL2Hours: 12,
    escalationL3Hours: 24,
    warnThreshold: 80,
    breachThreshold: 100,
    workingHoursStart: 9,
    workingHoursEnd: 18,
    excludeWeekends: true,
    excludeHolidays: true,
    selectedPlants: [],
    selectedCategories: [],
    selectedOwners: [],
    selectedSeverity: []
  });

  const [slaItems] = useState<SLAItem[]>(generateMockSLAItems());
  const [escalations] = useState<EscalationEvent[]>(generateMockEscalations());
  const [activeTab, setActiveTab] = useState<'overview' | 'config'>('overview');
  const [isRecalculating, setIsRecalculating] = useState(false);

  const ownerBacklogs = generateOwnerBacklogs(slaItems);

  // Filter items based on config
  const filteredItems = slaItems.filter(item => {
    if (config.selectedPlants.length > 0 && !config.selectedPlants.some(p => p.includes(item.plant))) return false;
    if (config.selectedCategories.length > 0 && !config.selectedCategories.includes(item.category)) return false;
    if (config.selectedOwners.length > 0 && !config.selectedOwners.includes(item.owner)) return false;
    if (config.selectedSeverity.length > 0 && !config.selectedSeverity.includes(item.severity)) return false;
    return true;
  });

  const stats = {
    total: filteredItems.length,
    compliant: filteredItems.filter(i => i.status === 'pending').length,
    warning: filteredItems.filter(i => i.status === 'warning').length,
    breached: filteredItems.filter(i => i.status === 'breached').length,
    complianceRate: filteredItems.length > 0 
      ? ((filteredItems.filter(i => i.status === 'pending').length / filteredItems.length) * 100).toFixed(1)
      : '100',
    escalationsToday: escalations.filter(e => {
      const today = new Date();
      return e.triggeredAt.toDateString() === today.toDateString();
    }).length,
    escalationsWeek: escalations.filter(e => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return e.triggeredAt >= weekAgo;
    }).length,
    breaches7d: Math.floor(filteredItems.filter(i => i.status === 'breached').length * 0.7),
    breaches14d: Math.floor(filteredItems.filter(i => i.status === 'breached').length * 1.2),
    breaches30d: Math.floor(filteredItems.filter(i => i.status === 'breached').length * 2.1),
  };

  const teamStats = TEAMS.map(team => {
    const teamItems = filteredItems.filter(i => i.team === team);
    const compliant = teamItems.filter(i => i.status === 'pending').length;
    return {
      team,
      total: teamItems.length,
      complianceRate: teamItems.length > 0 ? ((compliant / teamItems.length) * 100).toFixed(0) : '100'
    };
  }).filter(t => t.total > 0);

  useEffect(() => {
    setIsRecalculating(true);
    const timer = setTimeout(() => setIsRecalculating(false), 200);
    return () => clearTimeout(timer);
  }, [config]);

  const formatTimeRemaining = (hours: number) => {
    if (hours < 0) return `${Math.abs(hours).toFixed(1)}h overdue`;
    if (hours < 1) return `${Math.round(hours * 60)}m remaining`;
    return `${hours.toFixed(1)}h remaining`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'warning': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'breached': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'HIGH': return 'bg-red-50 text-red-600';
      case 'MEDIUM': return 'bg-amber-50 text-amber-600';
      default: return 'bg-blue-50 text-blue-600';
    }
  };

  const handleReset = () => {
    setConfig({
      reviewHours: 24,
      approvalHours: 48,
      escalationL1Hours: 4,
      escalationL2Hours: 12,
      escalationL3Hours: 24,
      warnThreshold: 80,
      breachThreshold: 100,
      workingHoursStart: 9,
      workingHoursEnd: 18,
      excludeWeekends: true,
      excludeHolidays: true,
      selectedPlants: [],
      selectedCategories: [],
      selectedOwners: [],
      selectedSeverity: []
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Governance SLA & Escalation Monitor</h2>
          <p className="text-sm text-slate-500 mt-1">Track review/approval SLAs, breaches, and auto-escalations in real time</p>
        </div>
        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'overview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <div className="flex items-center space-x-2">
              <Shield size={14} />
              <span>SLA Overview</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'config' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <div className="flex items-center space-x-2">
              <Timer size={14} />
              <span>SLA Configuration</span>
            </div>
          </button>
        </div>
      </div>

      {/* Recalculating Indicator */}
      {isRecalculating && (
        <div className="flex items-center justify-center space-x-2 py-2 bg-indigo-50 rounded-xl border border-indigo-100">
          <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold text-indigo-700">Recalculating SLA metrics...</span>
        </div>
      )}

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">SLA Compliance</span>
                <CheckCircle2 size={16} className="opacity-60" />
              </div>
              <div className="text-3xl font-black">{stats.complianceRate}%</div>
              <div className="text-[10px] font-medium opacity-70 mt-1">Overall rate</div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">On Track</span>
                <Clock size={16} className="text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-emerald-600">{stats.compliant}</div>
              <div className="text-[10px] font-medium text-slate-400 mt-1">Items compliant</div>
            </div>

            <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Near Breach</span>
                <AlertTriangle size={16} className="opacity-60" />
              </div>
              <div className="text-3xl font-black">{stats.warning}</div>
              <div className="text-[10px] font-medium opacity-70 mt-1">Due soon</div>
            </div>

            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Breached</span>
                <AlertCircle size={16} className="opacity-60" />
              </div>
              <div className="text-3xl font-black">{stats.breached}</div>
              <div className="text-[10px] font-medium opacity-70 mt-1">Overdue items</div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Escalations</span>
                <Zap size={16} className="opacity-60" />
              </div>
              <div className="text-3xl font-black">{stats.escalationsWeek}</div>
              <div className="text-[10px] font-medium opacity-70 mt-1">This week</div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Breach Trend</span>
                <TrendingUp size={16} className="text-slate-400" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-black text-slate-900">{stats.breaches7d}</span>
                <span className="text-xs text-slate-400">/</span>
                <span className="text-lg font-black text-slate-600">{stats.breaches14d}</span>
                <span className="text-xs text-slate-400">/</span>
                <span className="text-lg font-black text-slate-400">{stats.breaches30d}</span>
              </div>
              <div className="text-[10px] font-medium text-slate-400 mt-1">7d / 14d / 30d</div>
            </div>
          </div>

          {/* Team Compliance */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4">SLA Compliance by Team</h3>
            <div className="grid grid-cols-5 gap-4">
              {teamStats.map(team => (
                <div key={team.team} className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-600">{team.team}</span>
                    <span className={`text-sm font-black ${parseInt(team.complianceRate) >= 80 ? 'text-emerald-600' : parseInt(team.complianceRate) >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                      {team.complianceRate}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${parseInt(team.complianceRate) >= 80 ? 'bg-emerald-500' : parseInt(team.complianceRate) >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${team.complianceRate}%` }}
                    ></div>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">{team.total} items</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Items Near Breach & Breached */}
            <div className="col-span-7 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900">Items Nearing Breach</h3>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">{stats.warning} items</span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredItems.filter(i => i.status === 'warning').slice(0, 8).map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-amber-50/50 rounded-xl border border-amber-100 hover:bg-amber-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                          <Timer size={18} className="text-amber-600" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-slate-900">{item.skuId}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${getSeverityColor(item.severity)}`}>{item.severity}</span>
                          </div>
                          <p className="text-[10px] text-slate-500">{item.action} · {item.owner}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black text-amber-600">{formatTimeRemaining(item.hoursRemaining)}</div>
                        <div className="w-20 h-1.5 bg-amber-200 rounded-full overflow-hidden mt-1">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(100, item.percentComplete)}%` }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900">Breached Items</h3>
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">{stats.breached} items</span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredItems.filter(i => i.status === 'breached').slice(0, 8).map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-red-50/50 rounded-xl border border-red-100 hover:bg-red-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                          <AlertCircle size={18} className="text-red-600" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-slate-900">{item.skuId}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${getSeverityColor(item.severity)}`}>{item.severity}</span>
                            {item.escalationLevel > 0 && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">L{item.escalationLevel}</span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500">{item.action} · {item.owner}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black text-red-600">{formatTimeRemaining(item.hoursRemaining)}</div>
                        <p className="text-[9px] text-red-500">{item.plant}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-5 space-y-4">
              {/* Recent Escalations */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900">Recent Escalations</h3>
                  <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">{stats.escalationsToday} today</span>
                </div>
                <div className="space-y-2 max-h-52 overflow-y-auto">
                  {escalations.slice(0, 6).map(esc => (
                    <div key={esc.id} className="flex items-center space-x-3 p-3 bg-purple-50/50 rounded-xl border border-purple-100">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Zap size={14} className="text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold text-slate-900">{esc.skuId}</span>
                          <span className="text-[9px] font-bold text-purple-600">L{esc.fromLevel} → L{esc.toLevel}</span>
                        </div>
                        <p className="text-[9px] text-slate-500 truncate">Notified: {esc.notifiedTo}</p>
                      </div>
                      <div className="text-[9px] text-slate-400">
                        {esc.triggeredAt.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Owner/Queue Backlog */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900">Owner Backlog</h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">By urgency</span>
                </div>
                <div className="space-y-2">
                  {ownerBacklogs.slice(0, 5).map(backlog => (
                    <div key={backlog.owner} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                          <User size={14} className="text-slate-500" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{backlog.owner}</div>
                          <p className="text-[10px] text-slate-500">{backlog.team}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {backlog.breached > 0 && (
                          <span className="text-[10px] font-bold px-2 py-1 rounded bg-red-100 text-red-600">{backlog.breached}</span>
                        )}
                        {backlog.warning > 0 && (
                          <span className="text-[10px] font-bold px-2 py-1 rounded bg-amber-100 text-amber-600">{backlog.warning}</span>
                        )}
                        <span className="text-[10px] font-bold px-2 py-1 rounded bg-slate-100 text-slate-600">{backlog.pending}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Tab */}
      {activeTab === 'config' && (
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Configuration */}
          <div className="col-span-5 space-y-5">
            {/* SLA Targets */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Clock size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">SLA Targets</h3>
                  <p className="text-[10px] text-slate-500">Set time limits per workflow step</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-600">Review SLA</span>
                    <span className="text-sm font-bold text-indigo-600">{config.reviewHours}h</span>
                  </div>
                  <input
                    type="range"
                    min={4}
                    max={72}
                    value={config.reviewHours}
                    onChange={(e) => setConfig({ ...config, reviewHours: parseInt(e.target.value) })}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-600">Approval SLA</span>
                    <span className="text-sm font-bold text-emerald-600">{config.approvalHours}h</span>
                  </div>
                  <input
                    type="range"
                    min={8}
                    max={120}
                    value={config.approvalHours}
                    onChange={(e) => setConfig({ ...config, approvalHours: parseInt(e.target.value) })}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                </div>
              </div>
            </div>

            {/* Escalation Levels */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                  <ArrowUpRight size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Escalation Levels</h3>
                  <p className="text-[10px] text-slate-500">Hours after breach to escalate</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { key: 'escalationL1Hours', label: 'L1 Escalation', color: 'amber' },
                  { key: 'escalationL2Hours', label: 'L2 Escalation', color: 'orange' },
                  { key: 'escalationL3Hours', label: 'L3 Escalation', color: 'red' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="text-xs font-semibold text-slate-600">{item.label}</span>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min={1}
                        max={72}
                        value={config[item.key as keyof SLAConfig] as number}
                        onChange={(e) => setConfig({ ...config, [item.key]: parseInt(e.target.value) || 0 })}
                        className={`w-16 px-2 py-1 text-sm font-bold text-center bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-${item.color}-500`}
                      />
                      <span className="text-xs text-slate-400">hours</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Breach Thresholds */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Alert Thresholds</h3>
                  <p className="text-[10px] text-slate-500">When to warn and breach</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-amber-600">Warn at</span>
                    <span className="text-sm font-bold text-amber-600">{config.warnThreshold}%</span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={95}
                    value={config.warnThreshold}
                    onChange={(e) => setConfig({ ...config, warnThreshold: parseInt(e.target.value) })}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-red-600">Breach at</span>
                    <span className="text-sm font-bold text-red-600">{config.breachThreshold}%</span>
                  </div>
                  <input
                    type="range"
                    min={100}
                    max={150}
                    value={config.breachThreshold}
                    onChange={(e) => setConfig({ ...config, breachThreshold: parseInt(e.target.value) })}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-red-600"
                  />
                </div>
              </div>
            </div>

            {/* Business Calendar */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Calendar size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Business Calendar</h3>
                  <p className="text-[10px] text-slate-500">SLA clock configuration</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Start</label>
                    <select
                      value={config.workingHoursStart}
                      onChange={(e) => setConfig({ ...config, workingHoursStart: parseInt(e.target.value) })}
                      className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 6).map(h => (
                        <option key={h} value={h}>{h}:00</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">End</label>
                    <select
                      value={config.workingHoursEnd}
                      onChange={(e) => setConfig({ ...config, workingHoursEnd: parseInt(e.target.value) })}
                      className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 12).map(h => (
                        <option key={h} value={h}>{h}:00</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-xs font-semibold text-slate-600">Exclude Weekends</span>
                  <button
                    onClick={() => setConfig({ ...config, excludeWeekends: !config.excludeWeekends })}
                    className={`w-10 h-5 rounded-full transition-all ${config.excludeWeekends ? 'bg-indigo-500' : 'bg-slate-300'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${config.excludeWeekends ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-xs font-semibold text-slate-600">Exclude Holidays</span>
                  <button
                    onClick={() => setConfig({ ...config, excludeHolidays: !config.excludeHolidays })}
                    className={`w-10 h-5 rounded-full transition-all ${config.excludeHolidays ? 'bg-indigo-500' : 'bg-slate-300'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${config.excludeHolidays ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Scope Filters & Actions */}
          <div className="col-span-7 space-y-5">
            {/* Scope Filters */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-slate-100 text-slate-600 rounded-xl">
                    <Filter size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Scope Filters</h3>
                    <p className="text-[10px] text-slate-500">Apply rules to specific segments</p>
                  </div>
                </div>
                <button onClick={handleReset} className="text-[10px] font-bold text-slate-500 hover:text-slate-700 flex items-center space-x-1">
                  <RefreshCw size={12} />
                  <span>Reset All</span>
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-2 block">Plants</label>
                  <div className="bg-slate-50 rounded-xl p-3 max-h-32 overflow-y-auto space-y-1">
                    {PLANTS.map(plant => (
                      <label key={plant} className="flex items-center space-x-2 py-1 cursor-pointer hover:bg-slate-100 px-2 rounded-lg">
                        <input
                          type="checkbox"
                          checked={config.selectedPlants.includes(plant)}
                          onChange={(e) => {
                            const plants = e.target.checked 
                              ? [...config.selectedPlants, plant]
                              : config.selectedPlants.filter(p => p !== plant);
                            setConfig({ ...config, selectedPlants: plants });
                          }}
                          className="w-3 h-3 rounded accent-indigo-600"
                        />
                        <span className="text-[10px] font-medium text-slate-600">{plant}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-2 block">Categories</label>
                  <div className="bg-slate-50 rounded-xl p-3 max-h-32 overflow-y-auto space-y-1">
                    {CATEGORIES.map(cat => (
                      <label key={cat} className="flex items-center space-x-2 py-1 cursor-pointer hover:bg-slate-100 px-2 rounded-lg">
                        <input
                          type="checkbox"
                          checked={config.selectedCategories.includes(cat)}
                          onChange={(e) => {
                            const cats = e.target.checked 
                              ? [...config.selectedCategories, cat]
                              : config.selectedCategories.filter(c => c !== cat);
                            setConfig({ ...config, selectedCategories: cats });
                          }}
                          className="w-3 h-3 rounded accent-indigo-600"
                        />
                        <span className="text-[10px] font-medium text-slate-600">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-2 block">Owners</label>
                  <div className="bg-slate-50 rounded-xl p-3 max-h-32 overflow-y-auto space-y-1">
                    {OWNERS.map(owner => (
                      <label key={owner} className="flex items-center space-x-2 py-1 cursor-pointer hover:bg-slate-100 px-2 rounded-lg">
                        <input
                          type="checkbox"
                          checked={config.selectedOwners.includes(owner)}
                          onChange={(e) => {
                            const owners = e.target.checked 
                              ? [...config.selectedOwners, owner]
                              : config.selectedOwners.filter(o => o !== owner);
                            setConfig({ ...config, selectedOwners: owners });
                          }}
                          className="w-3 h-3 rounded accent-indigo-600"
                        />
                        <span className="text-[10px] font-medium text-slate-600">{owner}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-2 block">Severity</label>
                  <div className="bg-slate-50 rounded-xl p-3 space-y-1">
                    {['HIGH', 'MEDIUM', 'LOW'].map(sev => (
                      <label key={sev} className="flex items-center space-x-2 py-1 cursor-pointer hover:bg-slate-100 px-2 rounded-lg">
                        <input
                          type="checkbox"
                          checked={config.selectedSeverity.includes(sev)}
                          onChange={(e) => {
                            const sevs = e.target.checked 
                              ? [...config.selectedSeverity, sev]
                              : config.selectedSeverity.filter(s => s !== sev);
                            setConfig({ ...config, selectedSeverity: sevs });
                          }}
                          className="w-3 h-3 rounded accent-indigo-600"
                        />
                        <span className={`text-[10px] font-bold ${sev === 'HIGH' ? 'text-red-600' : sev === 'MEDIUM' ? 'text-amber-600' : 'text-blue-600'}`}>{sev}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Live Preview Stats */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold">Live Preview with Current Filters</h3>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/20 px-2 py-1 rounded-full">Auto-updating</span>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <div className="text-2xl font-black">{filteredItems.length}</div>
                  <div className="text-[10px] opacity-70">Total Items</div>
                </div>
                <div className="p-3 bg-emerald-500/20 rounded-xl">
                  <div className="text-2xl font-black text-emerald-400">{stats.complianceRate}%</div>
                  <div className="text-[10px] opacity-70">Compliance</div>
                </div>
                <div className="p-3 bg-amber-500/20 rounded-xl">
                  <div className="text-2xl font-black text-amber-400">{stats.warning}</div>
                  <div className="text-[10px] opacity-70">Near Breach</div>
                </div>
                <div className="p-3 bg-red-500/20 rounded-xl">
                  <div className="text-2xl font-black text-red-400">{stats.breached}</div>
                  <div className="text-[10px] opacity-70">Breached</div>
                </div>
              </div>
            </div>

            {/* Save Actions */}
            <div className="flex items-center justify-between">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start space-x-3 flex-1 mr-4">
                <Info className="text-blue-500 shrink-0 mt-0.5" size={16} />
                <p className="text-xs text-blue-700 leading-relaxed">
                  Changes are previewed <span className="font-bold">instantly</span> on the SLA Overview tab. Click "Save Configuration" to apply these settings to production escalation workflows.
                </p>
              </div>
              <button className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
                <Save size={16} />
                <span>Save Configuration</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GovernanceSLA;
