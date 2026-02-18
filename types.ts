
export type Role = 'ADMIN' | 'REVIEWER' | 'VIEWER';

export interface User {
  name: string;
  role: Role;
}

export type ABCClass = 'A' | 'B' | 'C';
export type FSNClass = 'F' | 'S' | 'N';
export type VEDClass = 'V' | 'E' | 'D';
export type XYZClass = 'X' | 'Y' | 'Z';

export type ActiveTab = 
  | 'Dashboard' 
  | 'Inventory Analysis' 
  | 'Recommendations' 
  | 'Reporting' 
  | 'Alerts' 
  | 'Simulation Console' 
  | 'Rule Management'
  | 'Governance SLA'
  | 'Admin Settings' 
  | 'Profile'
  | 'Risk Acceleration Monitor'
  | 'Reuse & Transfer Intelligence'
  | 'Material Substitution Intelligence'
  | 'Forward Risk Outlook'
  | 'Classification Governance Analytics'
  | 'Data Health & ERP Integrity'
  | 'Working Capital Concentration';

export interface SKU {
  id: string;
  description: string;
  category: string;
  unitCost: number;
  qtyOnHand: number;
  totalValue: number;
  lastSaleDate: string;
  minLevel: number;
  status: 'Active' | 'Discontinued';
  abcClass?: ABCClass;
  fsnClass?: FSNClass;
  vedClass?: VEDClass;
  xyzClass?: XYZClass;
  compositeScore?: number;
}

export type RecommendationAction = 'Pending' | 'Hold' | 'Transfer' | 'Scrap' | 'Dispose' | 'Review';

export interface Recommendation {
  id: string;
  skuId: string;
  skuDescription: string;
  action: RecommendationAction;
  impact: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface Alert {
  id: string;
  skuId: string;
  message: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  timestamp: string;
}

export interface ScoringConfig {
  valueWeight: number;
  velocityWeight: number;
}

export interface UploadLog {
  id: string;
  filename: string;
  date: string;
  user: string;
  rowCount: number;
  status: 'SUCCESS' | 'WARNING' | 'ERROR';
}
