
import { SKU } from './types';

// Enhanced Mock Data Generation for 250 SKUs
export const MOCK_SKUS: SKU[] = Array.from({ length: 250 }, (_, i) => {
  const categories = [
    'Semiconductors', 
    'Heavy Machinery', 
    'Precision Tools', 
    'Chemical Reagents', 
    'Circuit Boards', 
    'Fasteners', 
    'Lubricants', 
    'Safety Gear', 
    'Packaging Materials', 
    'Hydraulic Components'
  ];

  // Logic to ensure a distribution of data types (A, B, C and F, S, N)
  // Higher indices will generally have lower values to simulate the Pareto (80/20) rule
  const isHighValue = i < 25; // Top 10%
  const isMediumValue = i >= 25 && i < 100;
  
  let cost: number;
  if (isHighValue) {
    cost = parseFloat((5000 + Math.random() * 15000).toFixed(2));
  } else if (isMediumValue) {
    cost = parseFloat((500 + Math.random() * 4500).toFixed(2));
  } else {
    cost = parseFloat((10 + Math.random() * 490).toFixed(2));
  }

  // Triggering alerts: 5% chance of zero cost, 5% chance of negative quantity
  if (Math.random() < 0.05) cost = 0;
  
  let qty = isHighValue 
    ? Math.floor(Math.random() * 50) + 5 
    : Math.floor(Math.random() * 1000) - 10;
  
  if (Math.random() < 0.05) qty = -Math.floor(Math.random() * 20);

  const cat = Math.random() < 0.05 ? '' : categories[Math.floor(Math.random() * categories.length)];
  
  // Logic for Last Sale Date (Velocity)
  // 30% Fast (0-30 days), 40% Slow (31-90 days), 30% Non-Moving (91-400 days)
  const velocityRand = Math.random();
  let daysAgo: number;
  if (velocityRand < 0.3) {
    daysAgo = Math.floor(Math.random() * 30);
  } else if (velocityRand < 0.7) {
    daysAgo = Math.floor(Math.random() * 60) + 31;
  } else {
    daysAgo = Math.floor(Math.random() * 310) + 91;
  }
  
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);

  const status: 'Active' | 'Discontinued' = Math.random() > 0.9 ? 'Discontinued' : 'Active';
  const minLevel = isHighValue ? 5 : 50 + Math.floor(Math.random() * 100);

  return {
    id: `SKU-${1000 + i}`,
    description: `${cat.slice(0, 4)}-${String.fromCharCode(65 + (i % 26))}${i} Strategic Component`,
    category: cat,
    unitCost: cost,
    qtyOnHand: qty,
    totalValue: qty * cost,
    lastSaleDate: date.toISOString().split('T')[0],
    minLevel: minLevel,
    status: status,
  };
});

export const PROJECTION_DATA = [
  { month: 'Jan', value: 4200, safety: 3800 },
  { month: 'Feb', value: 4500, safety: 3900 },
  { month: 'Mar', value: 4100, safety: 3850 },
  { month: 'Apr', value: 4800, safety: 4000 },
  { month: 'May', value: 5200, safety: 4100 },
  { month: 'Jun', value: 4900, safety: 4050 },
  { month: 'Jul', value: 5500, safety: 4200 },
  { month: 'Aug', value: 5800, safety: 4300 },
];

export const LEAD_TIME_DATA = [
  { supplier: 'Precision Dynamics', leadTime: 12, cost: 45, risk: 'Low' },
  { supplier: 'Global Logistics Hub', leadTime: 24, cost: 32, risk: 'Med' },
  { supplier: 'Prime Material Corp', leadTime: 8, cost: 68, risk: 'Low' },
  { supplier: 'Secondary Source Ltd', leadTime: 45, cost: 12, risk: 'High' },
  { supplier: 'Titan Industrial', leadTime: 18, cost: 55, risk: 'Med' },
  { supplier: 'Apex Components', leadTime: 14, cost: 48, risk: 'Low' },
];
