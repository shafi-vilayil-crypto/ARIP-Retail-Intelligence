// ═══════════════════════════════════════════════════════════════════
// Retail Intelligence Platform — Core Type System
// ═══════════════════════════════════════════════════════════════════

// ── Auth & Users ──────────────────────────────────────────────────
export type UserRole = "admin" | "manager" | "analyst" | "viewer";

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  companyId: string;
  createdAt: string;
}

// ── Company ───────────────────────────────────────────────────────
export type IndustryType =
  | "Beverage Chain"
  | "Dairy Brand"
  | "Restaurant"
  | "Quick Service Restaurant"
  | "Supermarket"
  | "Convenience Store"
  | "Pharmacy Chain"
  | "Franchise Business"
  | "Fashion Retail"
  | "Electronics Retail"
  | "Fuel Station"
  | "Coffee & Café"
  | "FMCG"
  | "Grocery"
  | "Other";

export type BusinessModel =
  | "Owned"
  | "Franchise"
  | "Owned + Franchise"
  | "License"
  | "Cooperative"
  | "Hybrid";

export interface CompanyProfile {
  id: string;
  name: string;
  industry: IndustryType;
  businessCategory: string;
  headquarters: string;
  website?: string;
  logoUrl?: string;
  brandColors: { primary: string; secondary: string; accent: string };
  currentStates: string[];
  currentCities: string[];
  businessModel: BusinessModel;
  franchiseOrOwned: "Franchise" | "Owned" | "Mixed";
  productCategories: string[];
  outletCount: number;
  warehouseCount: number;
  manufacturingUnits: number;
  distributionCenters: number;
  onboardingCompleted: boolean;
  onboardingStep: number;
  createdAt: string;
  updatedAt: string;
}

// ── Expansion Goals ───────────────────────────────────────────────
export interface ExpansionGoals {
  companyId: string;
  targetStates: string[];
  targetDistricts: string[];
  targetCities: string[];
  expansionTimeline: string;
  investmentBudget: string;
  preferredOutletSize: string;
  preferredCustomerSegment: string;
  priorityMarkets: string[];
}

// ── Competitors ───────────────────────────────────────────────────
export type CompetitorScope = "national" | "regional" | "local";

export interface Competitor {
  id: string;
  companyId: string;
  name: string;
  scope: CompetitorScope;
  industry: string;
  outletCount?: number;
  marketShare?: number;
  strengthAreas: string[];
  weaknessAreas: string[];
  notes?: string;
}

// ── Data Uploads ──────────────────────────────────────────────────
export type UploadDataType =
  | "outlet_list"
  | "sales_history"
  | "customer_data"
  | "inventory"
  | "warehouses"
  | "distributor_list"
  | "supplier_list"
  | "delivery_data"
  | "logistics_data"
  | "product_catalog"
  | "pricing"
  | "marketing_campaigns"
  | "financial_statements";

export type UploadFormat = "csv" | "xlsx" | "json" | "sql";
export type UploadStatus = "pending" | "validating" | "validated" | "failed" | "imported";

export interface DataUpload {
  id: string;
  companyId: string;
  dataType: UploadDataType;
  fileName: string;
  fileSize: number;
  format: UploadFormat;
  status: UploadStatus;
  rowCount: number;
  duplicateCount: number;
  errorCount: number;
  validationReport?: ValidationReport;
  columnMapping?: Record<string, string>;
  uploadedAt: string;
}

export interface ValidationReport {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  duplicates: number;
  errors: Array<{ row: number; column: string; message: string }>;
  warnings: Array<{ row: number; column: string; message: string }>;
}

// ── Studios ───────────────────────────────────────────────────────
export type StudioId =
  | "market-intelligence"
  | "operations"
  | "executive"
  | "ai-research";

export interface Studio {
  id: StudioId;
  name: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  modules: StudioModule[];
}

export type ModuleStatus = "active" | "coming_soon" | "beta";

export interface StudioModule {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: ModuleStatus;
  route: string;
}

// ── Market Intelligence ───────────────────────────────────────────
export interface MarketData {
  id: string;
  name: string;
  level: "country" | "state" | "district" | "city" | "town";
  state: string;
  district?: string;
  city?: string;
  population: number;
  populationDensity: number;
  avgIncome: number;
  urbanizationRate: number;
  growthRate: number;
  expansionScore: number;
  demandScore: number;
  competitionScore: number;
}

export interface SiteCandidate {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  overallScore: number;
  demandScore: number;
  competitionScore: number;
  logisticsScore: number;
  financialScore: number;
  accessibilityScore: number;
  recommendation: "expand" | "watch" | "avoid";
  riskLevel: "low" | "medium" | "high";
}

export interface HeatmapPoint {
  lat: number;
  lng: number;
  value: number;
  label?: string;
}

// ── Operations Intelligence ───────────────────────────────────────
export interface InventoryItem {
  id: string;
  productName: string;
  sku: string;
  category: string;
  currentStock: number;
  reorderLevel: number;
  reorderQuantity: number;
  unitCost: number;
  warehouseId: string;
  status: "in_stock" | "low_stock" | "out_of_stock" | "overstock";
  lastRestocked: string;
}

export interface Warehouse {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  capacity: number;
  utilization: number;
  type: "central" | "regional" | "cold_chain" | "distribution";
  operatingCost: number;
  latitude: number;
  longitude: number;
}

export interface Route {
  id: string;
  name: string;
  origin: string;
  destination: string;
  distance: number;
  estimatedTime: number;
  vehicleType: string;
  costPerTrip: number;
  efficiency: number;
  stops: number;
}

export interface Supplier {
  id: string;
  name: string;
  category: string;
  contactPerson: string;
  email: string;
  phone: string;
  rating: number;
  onTimeDeliveryPct: number;
  activeContracts: number;
  totalOrders: number;
  status: "active" | "inactive" | "under_review";
}

// ── Executive Intelligence ────────────────────────────────────────
export interface KPI {
  id: string;
  name: string;
  value: number | string;
  target?: number;
  unit: string;
  trend: "up" | "down" | "neutral";
  trendValue?: string;
  category: "revenue" | "operations" | "growth" | "efficiency" | "risk";
  period: string;
}

export interface FinancialModel {
  id: string;
  name: string;
  type: "expansion" | "scenario" | "forecast";
  assumptions: Record<string, number>;
  projections: Array<{
    year: number;
    revenue: number;
    expenses: number;
    profit: number;
    roi: number;
  }>;
  createdAt: string;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  type: "optimistic" | "base" | "pessimistic" | "custom";
  variables: Record<string, number>;
  outcome: {
    revenue: number;
    profit: number;
    marketShare: number;
    newOutlets: number;
    roi: number;
  };
}

// ── AI Research ───────────────────────────────────────────────────
export type AgentStatus = "idle" | "running" | "completed" | "failed" | "scheduled";

export interface AIAgent {
  id: string;
  name: string;
  description: string;
  type:
    | "market_research"
    | "competitor_intel"
    | "gis_intelligence"
    | "demand_forecast"
    | "logistics_optimization"
    | "financial_modeling"
    | "data_validation"
    | "report_generation"
    | "executive_insight";
  status: AgentStatus;
  lastRun?: string;
  nextRun?: string;
  taskCount: number;
  completedTasks: number;
  confidence: number;
  schedule?: string;
}

export interface AITask {
  id: string;
  agentId: string;
  agentName: string;
  description: string;
  status: AgentStatus;
  progress: number;
  result?: Record<string, unknown>;
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

export interface ResearchItem {
  id: string;
  title: string;
  source: string;
  category: string;
  summary: string;
  confidence: number;
  agentName: string;
  data: Record<string, unknown>;
  createdAt: string;
}

// ── Notifications ─────────────────────────────────────────────────
export type NotificationType = "info" | "success" | "warning" | "error" | "ai_insight";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

// ── Reports ───────────────────────────────────────────────────────
export interface Report {
  id: string;
  title: string;
  type: "expansion" | "operations" | "executive" | "competitor" | "financial";
  description: string;
  generatedBy: string;
  status: "generating" | "ready" | "archived";
  downloadUrl?: string;
  createdAt: string;
}

// ── Onboarding ────────────────────────────────────────────────────
export interface OnboardingState {
  currentStep: number;
  totalSteps: 5;
  companyProfile: Partial<CompanyProfile>;
  expansionGoals: Partial<ExpansionGoals>;
  competitors: Competitor[];
  dataUploads: DataUpload[];
  aiInitStatus: "idle" | "running" | "completed" | "failed";
  aiInitProgress: number;
  aiInitLogs: string[];
}

// ── Dashboard ─────────────────────────────────────────────────────
export interface DashboardKPI {
  label: string;
  value: string | number;
  change?: string;
  trend: "up" | "down" | "neutral";
  icon: string;
  color: string;
}

export interface ActivityItem {
  id: string;
  type: "ai_analysis" | "data_upload" | "report" | "alert" | "user_action";
  title: string;
  description: string;
  timestamp: string;
  studioId?: StudioId;
}
