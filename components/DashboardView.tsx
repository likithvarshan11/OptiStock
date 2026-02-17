
import React, { useMemo, useState } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, 
  CartesianGrid, ReferenceLine, AreaChart, Area,
  LineChart, Line, ScatterChart, Scatter, ZAxis,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ComposedChart
} from 'recharts';
import { 
  Activity, 
  TrendingUp,
  AlertCircle,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Target,
  Calendar,
  RefreshCcw,
  Truck,
  Zap,
  Package,
  Clock,
  Briefcase
} from 'lucide-react';
import { SKU, Alert } from '../types';

interface DashboardProps {
  inventory: SKU[];
  recommendations: any[];
  alerts: Alert[];
}

const CHART_COLORS = {
  emerald: '#10B981',
  amber: '#F59E0B',
  rose: '#EF4444',
  blue: '#3B82F6',
  slate: '#94A3B8',
  indigo: '#6366F1',
  teal: '#14B8A6'
};

const DashboardView: React.FC<DashboardProps> = ({ inventory, alerts }) => {
  const [startDate, setStartDate] = useState('2025-02-17');
  const [endDate, setEndDate] = useState('2026-02-17');

  const formatCurrency = (val: number) => {
    return `₹${val.toLocaleString()}`;
  };

  const stats = useMemo(() => {
    if (inventory.length === 0) return null;

    const totalInvValue = inventory.reduce((acc, i) => acc + Math.max(0, i.totalValue), 0);
    const deadStockValue = inventory
      .filter(i => i.fsnClass === 'N')
      .reduce((acc, i) => acc + Math.max(0, i.totalValue), 0);
    const criticalAlertsCount = alerts.filter(a => a.severity === 'HIGH').length;

    // Trend Data (Line)
    const trendData = [
      { date: 'Feb 17', value: 16500000 },
      { date: 'Mar 25', value: 17800000 },
      { date: 'May 1', value: 16200000 },
      { date: 'Jun 6', value: 17500000 },
      { date: 'Jul 13', value: 17600000 },
      { date: 'Aug 18', value: 17700000 },
      { date: 'Sep 24', value: 16100000 },
      { date: 'Oct 30', value: 16200000 },
      { date: 'Dec 6', value: 17900000 },
      { date: 'Jan 11', value: 16500000 },
    ];

    // Risk Scatter Data (Clustered)
    const riskScatterData = inventory.slice(0, 80).map(i => {
      const days = Math.floor((new Date().getTime() - new Date(i.lastSaleDate).getTime()) / (1000 * 3600 * 24));
      return {
        x: days,
        y: Math.max(0, i.totalValue),
        z: i.qtyOnHand,
        fill: days > 170 ? CHART_COLORS.rose : days > 85 ? CHART_COLORS.amber : CHART_COLORS.emerald
      };
    });

    // Warehouse Utilization
    const warehouseData = [
      { name: 'Warehouse 1', value: 75.56, fill: CHART_COLORS.rose },
      { name: 'Warehouse 2', value: 70.38, fill: CHART_COLORS.rose },
      { name: 'Warehouse 3', value: 86.88, fill: CHART_COLORS.amber },
      { name: 'Warehouse 4', value: 94.44, fill: CHART_COLORS.emerald },
      { name: 'Warehouse 5', value: 92.75, fill: CHART_COLORS.emerald },
    ];

    // Cost Breakdown
    const costBreakdownData = [
      { name: 'Procurement', value: 49, fill: '#6FCF97' },
      { name: 'Transportation', value: 41, fill: '#4E96B5' },
      { name: 'Warehousing', value: 10, fill: '#E15759' },
    ];

    // Supplier Accuracy
    const supplierData = [
      { name: 'SUPPLIER 1 ACCURACY', value: 95, color: CHART_COLORS.emerald },
      { name: 'SUPPLIER 2 ACCURACY', value: 87, color: CHART_COLORS.rose },
      { name: 'SUPPLIER 3 ACCURACY', value: 91, color: CHART_COLORS.amber },
      { name: 'SUPPLIER 4 ACCURACY', value: 94, color: CHART_COLORS.amber },
    ];

    // TOP MOVING SKUS (New Chart)
    const topMoving = inventory
      .filter(i => i.fsnClass === 'F')
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 5)
      .map(i => ({ name: i.id, value: Math.max(0, i.totalValue) }));

    // RADAR DATA (New Chart)
    const supplierPerformance = [
      { subject: 'Lead Time', A: 120, B: 110, fullMark: 150 },
      { subject: 'Quality', A: 98, B: 130, fullMark: 150 },
      { subject: 'Compliance', A: 86, B: 130, fullMark: 150 },
      { subject: 'Cost Efficiency', A: 99, B: 100, fullMark: 150 },
      { subject: 'Sustainability', A: 85, B: 90, fullMark: 150 },
      { subject: 'Logistics', A: 65, B: 85, fullMark: 150 },
    ];

    return {
      totalInvValue,
      deadStockValue,
      criticalAlertsCount,
      trendData,
      riskScatterData,
      warehouseData,
      costBreakdownData,
      supplierData,
      topMoving,
      supplierPerformance
    };
  }, [inventory, alerts]);

  if (!stats) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header with Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 no-print">
        <div>
          <h1 className="text-3xl font-bold text-[#1E293B] tracking-tight">Supply Chain Risk Management</h1>
          <p className="text-slate-400 text-sm mt-1 font-medium">Last updated: {new Date().toLocaleTimeString()}</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl px-4 py-2 space-x-4 shadow-sm">
             <div className="flex items-center space-x-2 border-r border-slate-100 pr-4">
                <Calendar size={16} className="text-slate-400" />
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)}
                  className="text-sm font-semibold text-slate-600 outline-none bg-transparent cursor-pointer"
                />
             </div>
             <div className="flex items-center space-x-2 border-r border-slate-100 pr-4">
                <Calendar size={16} className="text-slate-400" />
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)}
                  className="text-sm font-semibold text-slate-600 outline-none bg-transparent cursor-pointer"
                />
             </div>
             <button onClick={() => { setStartDate('2025-02-17'); setEndDate('2026-02-17'); }} title="Reset View">
                <RefreshCcw size={16} className="text-slate-300 hover:text-indigo-600 transition-colors" />
             </button>
          </div>
          <div className="flex items-center bg-white border border-slate-200 rounded-xl px-4 py-2 space-x-2 shadow-sm">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">System Operational</span>
          </div>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPIBox 
          title="INVENTORY VALUE" 
          value={formatCurrency(stats.totalInvValue)} 
          subLabel={`${inventory.length} SKUs`}
          subTitle="Items Count"
          badgeText="Active"
          badgeColor="emerald"
          iconType="dollar"
        />
        <KPIBox 
          title="DEAD STOCK RISK" 
          value={formatCurrency(stats.deadStockValue)} 
          subLabel={`${((stats.deadStockValue/stats.totalInvValue)*100).toFixed(1)}%`}
          subTitle="Share"
          badgeText="High"
          badgeColor="rose"
        />
        <KPIBox 
          title="CRITICAL ALERTS" 
          value={stats.criticalAlertsCount.toString()} 
          subLabel={alerts.length.toString()}
          subTitle="Total Alerts"
          badgeText="-5.4%"
          badgeColor="emerald"
          badgeIcon="down"
        />
        <KPIBox 
          title="SERVICE LEVEL" 
          value="94.2%" 
          subLabel="95.0%"
          subTitle="Target"
          badgeText="-0.8%"
          badgeColor="amber"
          badgeIcon="down"
        />
      </div>

      {/* CHARTS ROW 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-[1.5rem] border border-slate-200 p-8 shadow-sm">
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-900">Inventory Value Trend</h3>
            <p className="text-xs text-slate-500 font-medium">Historical capital lock-up over selected period</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.trendData} margin={{ left: 10, right: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 10, fontWeight: 'bold'}} tickFormatter={(v) => `₹${(v/100000).toFixed(0)}L`} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#FFF' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-[1.5rem] border border-slate-200 p-8 shadow-sm">
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-900">Risk Matrix (Value vs. Aging)</h3>
            <p className="text-xs text-slate-500 font-medium">Top Right = High Value Dead Stock (Critical Risk)</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis type="number" dataKey="x" name="days" unit="d" axisLine={true} tick={{fill: '#64748B', fontSize: 10, fontWeight: 'bold'}} />
                <YAxis type="number" dataKey="y" name="value" unit="₹" axisLine={true} tick={{fill: '#64748B', fontSize: 10, fontWeight: 'bold'}} tickFormatter={(v) => `${(v/100000).toFixed(0)}L`} />
                <ZAxis type="number" dataKey="z" range={[50, 400]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter data={stats.riskScatterData}>
                   {stats.riskScatterData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* CHARTS ROW 2 (OPERATIONAL) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Warehouse Utilization */}
        <div className="lg:col-span-7 bg-white rounded-[1.5rem] border border-slate-200 p-8 shadow-sm">
           <h4 className="text-sm font-bold text-slate-600 text-center mb-10">Warehouse Resource Utilization</h4>
           <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={stats.warehouseData} layout="vertical" margin={{ left: 40, right: 60 }}>
                    <CartesianGrid horizontal={false} stroke="#F1F5F9" />
                    <XAxis type="number" hide domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 10, fontWeight: 'bold' }} />
                    <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ fontSize: '10px', borderRadius: '12px' }} />
                    <Bar dataKey="value" barSize={32} radius={[0, 4, 4, 0]} label={{ position: 'right', fill: '#000', fontSize: 11, fontWeight: 'bold', formatter: (v: number) => `${v}%` }}>
                       {stats.warehouseData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                    </Bar>
                    <ReferenceLine x={40} stroke="#E15759" strokeWidth={1} strokeDasharray="3 3" />
                    <ReferenceLine x={85} stroke="#EBC152" strokeWidth={1} strokeDasharray="3 3" />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Cost Breakdown */}
        <div className="lg:col-span-5 bg-white rounded-[1.5rem] border border-slate-200 p-8 shadow-sm">
           <h4 className="text-sm font-bold text-slate-600 text-center mb-6">Total Supply Chain Cost Breakdown</h4>
           <div className="h-[350px] relative">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie 
                       data={stats.costBreakdownData} 
                       cx="50%" cy="50%" 
                       innerRadius={0}
                       outerRadius={100} 
                       dataKey="value"
                       label={({ value }) => `${value}%`}
                       stroke="#FFF"
                       strokeWidth={2}
                    >
                       {stats.costBreakdownData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                    </Pie>
                    <Tooltip />
                 </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-0 right-0 text-[10px] space-y-2 p-2 bg-white/80 backdrop-blur-sm rounded-lg">
                 {stats.costBreakdownData.map(item => (
                    <div key={item.name} className="flex items-center space-x-2">
                       <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }}></span>
                       <span className="text-slate-500 font-bold uppercase tracking-widest">{item.name}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* SUPPLIER ACCURACY ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.supplierData.map((sup, idx) => (
          <div key={idx} className="bg-white rounded-[1.5rem] border border-slate-200 p-6 shadow-sm">
             <h5 className="text-[10px] font-bold text-slate-500 text-center mb-6 uppercase tracking-[0.2em]">{sup.name}</h5>
             <div className="h-40 flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                      {/* Fixed: Replaced RechartsPie with Pie component from recharts */}
                      <Pie
                         data={[{value: sup.value}, {value: 100 - sup.value}]}
                         cx="50%"
                         cy="50%"
                         innerRadius={55}
                         outerRadius={75}
                         startAngle={90}
                         endAngle={450}
                         paddingAngle={0}
                         dataKey="value"
                         stroke="none"
                      >
                         <Cell fill={sup.color} />
                         <Cell fill="#E2E8F0" />
                      </Pie>
                   </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                   <span className="text-2xl font-black text-slate-900 tracking-tight">{sup.value}%</span>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* NEW SECTION: ADVANCED LOGISTICS INTELLIGENCE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-12">
        {/* Radar Chart: Supplier Diversification & Risk */}
        <div className="lg:col-span-6 bg-white rounded-[2rem] border border-slate-200 p-10 shadow-sm overflow-hidden relative group">
           <div className="flex items-center space-x-3 mb-10">
              <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/20"><ShieldCheck size={20}/></div>
              <div>
                 <h4 className="text-lg font-bold text-slate-900">Strategic Performance Matrix</h4>
                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Multi-vector analysis of global supply health</p>
              </div>
           </div>
           <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                 <RadarChart cx="50%" cy="50%" outerRadius="80%" data={stats.supplierPerformance}>
                    <PolarGrid stroke="#F1F5F9" />
                    <PolarAngleAxis dataKey="subject" tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 'bold'}} />
                    <PolarRadiusAxis angle={30} domain={[0, 150]} axisLine={false} tick={false} />
                    <Radar name="Primary Supplier" dataKey="A" stroke={CHART_COLORS.indigo} fill={CHART_COLORS.indigo} fillOpacity={0.4} />
                    <Radar name="Secondary Benchmark" dataKey="B" stroke={CHART_COLORS.rose} fill={CHART_COLORS.rose} fillOpacity={0.1} />
                    <Tooltip contentStyle={{borderRadius: '16px', border: 'none', fontSize: '12px'}} />
                    <Legend iconType="circle" wrapperStyle={{paddingTop: '20px', fontSize: '11px', fontWeight: 'bold'}} />
                 </RadarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Bar Chart: Top Moving SKUs by Value */}
        <div className="lg:col-span-6 bg-[#1E293B] rounded-[2rem] p-10 text-white shadow-2xl relative overflow-hidden">
           <div className="flex items-center space-x-3 mb-10 relative z-10">
              <div className="p-2.5 bg-emerald-500 text-white rounded-xl"><TrendingUp size={20}/></div>
              <div>
                 <h4 className="text-lg font-bold">Top High-Velocity Assets</h4>
                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Highest valuation items in constant rotation</p>
              </div>
           </div>
           <div className="h-[350px] relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={stats.topMoving} layout="vertical" margin={{ left: 20, right: 40 }}>
                    <CartesianGrid horizontal={false} stroke="#334155" strokeDasharray="3 3" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={80} axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 'bold'}} />
                    <Tooltip 
                       cursor={{fill: '#334155', opacity: 0.5}}
                       formatter={(val: number) => formatCurrency(val)}
                       contentStyle={{backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '12px', fontSize: '11px'}}
                    />
                    <Bar dataKey="value" barSize={28} radius={[0, 8, 8, 0]}>
                       {stats.topMoving.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? CHART_COLORS.emerald : index === 1 ? CHART_COLORS.teal : '#475569'} />
                       ))}
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
           </div>
           {/* Background decorative element */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[120px] -mr-32 -mt-32"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Gauge Mock / Simplified Status */}
        <div className="bg-white rounded-[1.5rem] border border-slate-200 p-8 shadow-sm flex flex-col justify-between">
           <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lead Time Variance</span>
              <Clock size={16} className="text-slate-300" />
           </div>
           <div className="my-6">
              <div className="flex items-baseline space-x-2">
                 <span className="text-4xl font-black text-slate-900 italic">±2.4d</span>
                 <span className="text-xs font-bold text-rose-500">+12% vs LY</span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">Historical drift across Tier-1 vendors</p>
           </div>
           <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500" style={{ width: '74%' }}></div>
           </div>
        </div>

        <div className="bg-white rounded-[1.5rem] border border-slate-200 p-8 shadow-sm flex flex-col justify-between">
           <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventory Turn Ratio</span>
              <RefreshCcw size={16} className="text-slate-300" />
           </div>
           <div className="my-6">
              <div className="flex items-baseline space-x-2">
                 <span className="text-4xl font-black text-slate-900 italic">4.8x</span>
                 <span className="text-xs font-bold text-emerald-500">Stable</span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">Global aggregate efficiency coefficient</p>
           </div>
           <div className="flex gap-1 h-2">
              {[1,2,3,4,5,6,7,8].map(i => <div key={i} className={`flex-1 rounded-full ${i <= 6 ? 'bg-emerald-500' : 'bg-slate-100'}`}></div>)}
           </div>
        </div>

        <div className="bg-white rounded-[1.5rem] border border-slate-200 p-8 shadow-sm flex flex-col justify-between">
           <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Procurement Accuracy</span>
              <Briefcase size={16} className="text-slate-300" />
           </div>
           <div className="my-6">
              <div className="flex items-baseline space-x-2">
                 <span className="text-4xl font-black text-slate-900 italic">98.9%</span>
                 <span className="text-xs font-bold text-emerald-500">Target Reached</span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">Purchase order to receipt alignment</p>
           </div>
           <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Synchronized with ERP Cluster</span>
           </div>
        </div>
      </div>
    </div>
  );
};

const KPIBox = ({ title, value, subLabel, subTitle, badgeText, badgeColor, badgeIcon, iconType }: any) => {
  const themes = {
    emerald: 'bg-emerald-50 text-emerald-600',
    rose: 'bg-rose-50 text-rose-600',
    amber: 'bg-amber-50 text-amber-600'
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between h-40 relative group transition-all hover:shadow-md">
      {iconType === 'dollar' && (
        <div className="absolute right-0 top-0 p-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
           <DollarSign size={100} />
        </div>
      )}
      <div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">{title}</p>
        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h3>
      </div>
      <div className="flex justify-between items-end border-t border-slate-100 pt-4">
        <div className="flex flex-col">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{subTitle}</p>
          <p className="text-xs font-black text-slate-600">{subLabel}</p>
        </div>
        <div className={`flex items-center text-[10px] font-black px-2.5 py-1 rounded-lg ${themes[badgeColor as keyof typeof themes]}`}>
          {badgeIcon === 'down' ? <ArrowDownRight size={14} className="mr-1" /> : <TrendingUp size={14} className="mr-1" />}
          {badgeText}
        </div>
      </div>
    </div>
  );
}

export default DashboardView;
