// ═══════════════════════════════════════════════════════════════════
// Retail Intelligence Platform — Mock Data
// ═══════════════════════════════════════════════════════════════════
import type {
  User, CompanyProfile, ExpansionGoals, Competitor, DataUpload,
  Studio, StudioModule, AIAgent, AITask, ResearchItem, Notification,
  Report, KPI, InventoryItem, Warehouse, Route, Supplier,
  MarketData, SiteCandidate, FinancialModel, Scenario, ActivityItem,
  DashboardKPI,
} from "@/shared/types";

// ── Current User ──────────────────────────────────────────────────
export const mockUser: User = {
  id: "u_001",
  email: "admin@retailiq.com",
  name: "Shafi Vilayil",
  avatarUrl: undefined,
  role: "admin",
  companyId: "c_001",
  createdAt: "2025-01-15T10:00:00Z",
};

// ── Companies ─────────────────────────────────────────────────────
export const mockCompanies: CompanyProfile[] = [
  {
    id: "c_001",
    name: "FreshMart India",
    industry: "Supermarket",
    businessCategory: "Grocery & Fresh Foods",
    headquarters: "Mumbai, Maharashtra",
    website: "https://freshmart.in",
    logoUrl: undefined,
    brandColors: { primary: "#10B981", secondary: "#3B82F6", accent: "#F59E0B" },
    currentStates: ["Maharashtra", "Gujarat", "Karnataka"],
    currentCities: ["Mumbai", "Pune", "Ahmedabad", "Bangalore"],
    businessModel: "Owned + Franchise",
    franchiseOrOwned: "Mixed",
    productCategories: ["Fresh Produce", "Dairy", "Bakery", "Beverages", "Household", "Personal Care"],
    outletCount: 145,
    warehouseCount: 8,
    manufacturingUnits: 2,
    distributionCenters: 5,
    onboardingCompleted: true,
    onboardingStep: 5,
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-06-20T14:30:00Z",
  },
  {
    id: "c_002",
    name: "Chai Junction",
    industry: "Beverage Chain",
    businessCategory: "Tea & Beverages",
    headquarters: "Kochi, Kerala",
    website: "https://chaijunction.in",
    logoUrl: undefined,
    brandColors: { primary: "#D97706", secondary: "#7C3AED", accent: "#EC4899" },
    currentStates: ["Kerala", "Tamil Nadu"],
    currentCities: ["Kochi", "Trivandrum", "Chennai", "Coimbatore"],
    businessModel: "Franchise",
    franchiseOrOwned: "Franchise",
    productCategories: ["Tea", "Coffee", "Juices", "Snacks", "Light Meals"],
    outletCount: 52,
    warehouseCount: 3,
    manufacturingUnits: 1,
    distributionCenters: 2,
    onboardingCompleted: true,
    onboardingStep: 5,
    createdAt: "2025-03-10T08:00:00Z",
    updatedAt: "2025-06-18T11:00:00Z",
  },
];

// ── Expansion Goals ───────────────────────────────────────────────
export const mockExpansionGoals: ExpansionGoals = {
  companyId: "c_001",
  targetStates: ["Rajasthan", "Madhya Pradesh", "Uttar Pradesh", "Tamil Nadu"],
  targetDistricts: ["Jaipur", "Indore", "Lucknow", "Chennai"],
  targetCities: ["Jaipur", "Indore", "Lucknow", "Chennai", "Coimbatore", "Udaipur"],
  expansionTimeline: "3 Years",
  investmentBudget: "₹120 Crore",
  preferredOutletSize: "3000-5000 sq ft",
  preferredCustomerSegment: "Middle Income Urban Families",
  priorityMarkets: ["Tier 1 Cities", "Tier 2 Cities with growing middle class"],
};

// ── Competitors ───────────────────────────────────────────────────
export const mockCompetitors: Competitor[] = [
  { id: "comp_001", companyId: "c_001", name: "Reliance Fresh", scope: "national", industry: "Supermarket", outletCount: 1800, marketShare: 22, strengthAreas: ["Brand Recognition", "Supply Chain", "Pricing"], weaknessAreas: ["Customer Service", "Store Ambiance"], notes: "Strongest national competitor" },
  { id: "comp_002", companyId: "c_001", name: "DMart", scope: "national", industry: "Supermarket", outletCount: 350, marketShare: 18, strengthAreas: ["Value for Money", "Private Labels", "Efficient Operations"], weaknessAreas: ["Limited Online Presence", "Smaller Store Format"] },
  { id: "comp_003", companyId: "c_001", name: "BigBazaar", scope: "national", industry: "Supermarket", outletCount: 290, marketShare: 12, strengthAreas: ["Promotions", "Wide Range"], weaknessAreas: ["Operational Efficiency", "Debt Issues"] },
  { id: "comp_004", companyId: "c_001", name: "Star Bazaar", scope: "regional", industry: "Supermarket", outletCount: 45, marketShare: 5, strengthAreas: ["Premium Experience", "Imported Products"], weaknessAreas: ["Limited Coverage"] },
  { id: "comp_005", companyId: "c_001", name: "Nature's Basket", scope: "regional", industry: "Supermarket", outletCount: 30, marketShare: 3, strengthAreas: ["Premium Organic", "Niche Market"], weaknessAreas: ["High Pricing", "Limited Reach"] },
  { id: "comp_006", companyId: "c_001", name: "Local Kirana Alliance", scope: "local", industry: "Grocery", outletCount: 5000, marketShare: 35, strengthAreas: ["Customer Loyalty", "Credit System", "Neighborhood Presence"], weaknessAreas: ["No Technology", "Limited Scale"] },
];

// ── AI Agents ─────────────────────────────────────────────────────
export const mockAgents: AIAgent[] = [
  { id: "agent_001", name: "Market Research Agent", description: "Demographics, income, urbanization analysis", type: "market_research", status: "completed", lastRun: "2025-06-20T10:00:00Z", nextRun: "2025-06-27T10:00:00Z", taskCount: 24, completedTasks: 24, confidence: 0.92, schedule: "Weekly" },
  { id: "agent_002", name: "Competitor Intelligence Agent", description: "Rival brand mapping & market gap analysis", type: "competitor_intel", status: "completed", lastRun: "2025-06-20T10:30:00Z", nextRun: "2025-06-27T10:30:00Z", taskCount: 18, completedTasks: 18, confidence: 0.88, schedule: "Weekly" },
  { id: "agent_003", name: "GIS Intelligence Agent", description: "Roads, transit, POI, catchment area analysis", type: "gis_intelligence", status: "running", lastRun: "2025-06-21T06:00:00Z", taskCount: 32, completedTasks: 28, confidence: 0.85, schedule: "Daily" },
  { id: "agent_004", name: "Demand Forecasting Agent", description: "Consumption patterns & demand prediction", type: "demand_forecast", status: "completed", lastRun: "2025-06-19T14:00:00Z", nextRun: "2025-06-26T14:00:00Z", taskCount: 12, completedTasks: 12, confidence: 0.87, schedule: "Weekly" },
  { id: "agent_005", name: "Logistics Optimization Agent", description: "Route & supply chain optimization", type: "logistics_optimization", status: "idle", lastRun: "2025-06-18T09:00:00Z", taskCount: 8, completedTasks: 8, confidence: 0.90, schedule: "On Demand" },
  { id: "agent_006", name: "Financial Modeling Agent", description: "ROI projections & investment analysis", type: "financial_modeling", status: "completed", lastRun: "2025-06-20T12:00:00Z", taskCount: 6, completedTasks: 6, confidence: 0.91, schedule: "Monthly" },
  { id: "agent_007", name: "Data Validation Agent", description: "Data quality checks & normalization", type: "data_validation", status: "completed", lastRun: "2025-06-20T08:00:00Z", taskCount: 15, completedTasks: 15, confidence: 0.95, schedule: "On Upload" },
  { id: "agent_008", name: "Report Generation Agent", description: "Executive synthesis & board reports", type: "report_generation", status: "idle", lastRun: "2025-06-15T16:00:00Z", taskCount: 4, completedTasks: 4, confidence: 0.89, schedule: "Monthly" },
  { id: "agent_009", name: "Executive Insight Agent", description: "Strategic recommendations & alerts", type: "executive_insight", status: "scheduled", lastRun: "2025-06-19T18:00:00Z", nextRun: "2025-06-22T18:00:00Z", taskCount: 10, completedTasks: 10, confidence: 0.86, schedule: "Bi-Weekly" },
];

// ── Dashboard KPIs ────────────────────────────────────────────────
export const mockDashboardKPIs: DashboardKPI[] = [
  { label: "Total Outlets", value: 145, change: "+12", trend: "up", icon: "MapPin", color: "emerald" },
  { label: "Revenue (MTD)", value: "₹24.8Cr", change: "+8.2%", trend: "up", icon: "TrendingUp", color: "blue" },
  { label: "Expansion Score", value: 82, change: "+5", trend: "up", icon: "Target", color: "violet" },
  { label: "Active Markets", value: 28, change: "+3", trend: "up", icon: "Globe", color: "amber" },
];

// ── Activity Feed ─────────────────────────────────────────────────
export const mockActivities: ActivityItem[] = [
  { id: "act_001", type: "ai_analysis", title: "Market Research Completed", description: "Analysis of 6 target states completed with 92% confidence", timestamp: "2025-06-20T10:00:00Z", studioId: "market-intelligence" },
  { id: "act_002", type: "data_upload", title: "Sales Data Imported", description: "Q1-Q2 2025 sales data uploaded and validated (42,847 records)", timestamp: "2025-06-19T16:30:00Z", studioId: "operations" },
  { id: "act_003", type: "report", title: "Board Report Generated", description: "Q2 2025 Executive Summary ready for download", timestamp: "2025-06-18T14:00:00Z", studioId: "executive" },
  { id: "act_004", type: "alert", title: "Low Stock Alert", description: "12 products below reorder level in Mumbai Central warehouse", timestamp: "2025-06-18T09:15:00Z", studioId: "operations" },
  { id: "act_005", type: "ai_analysis", title: "New Expansion Opportunity", description: "AI identified Jaipur as a high-potential market (Score: 87/100)", timestamp: "2025-06-17T11:00:00Z", studioId: "market-intelligence" },
  { id: "act_006", type: "user_action", title: "Competitor Profile Updated", description: "DMart profile updated with Q2 financial data", timestamp: "2025-06-16T13:45:00Z", studioId: "ai-research" },
];

// ── Notifications ─────────────────────────────────────────────────
export const mockNotifications: Notification[] = [
  { id: "n_001", type: "ai_insight", title: "New Market Opportunity", message: "AI detected a growing demand gap in Jaipur's residential areas. Recommended for immediate evaluation.", read: false, actionUrl: "/app/market-intelligence/site-selection", createdAt: "2025-06-20T10:30:00Z" },
  { id: "n_002", type: "warning", title: "Inventory Alert", message: "15 SKUs are below safety stock levels across 3 warehouses.", read: false, actionUrl: "/app/operations/inventory", createdAt: "2025-06-20T08:00:00Z" },
  { id: "n_003", type: "success", title: "Report Ready", message: "Q2 2025 Executive Intelligence Report is ready for download.", read: true, actionUrl: "/app/reports", createdAt: "2025-06-19T16:00:00Z" },
  { id: "n_004", type: "info", title: "Agent Completed", message: "GIS Intelligence Agent completed analysis of 32 potential sites.", read: true, createdAt: "2025-06-19T12:00:00Z" },
];

// ── Reports ───────────────────────────────────────────────────────
export const mockReports: Report[] = [
  { id: "r_001", title: "Q2 2025 Expansion Intelligence Report", type: "expansion", description: "Comprehensive analysis of 6 target states with site recommendations", generatedBy: "Report Generation Agent", status: "ready", createdAt: "2025-06-18T14:00:00Z" },
  { id: "r_002", title: "Competitor Landscape Analysis", type: "competitor", description: "Market share analysis across 8 major competitors in western India", generatedBy: "Competitor Intelligence Agent", status: "ready", createdAt: "2025-06-15T10:00:00Z" },
  { id: "r_003", title: "Financial Projections FY26", type: "financial", description: "Revenue and ROI projections for planned expansion", generatedBy: "Financial Modeling Agent", status: "ready", createdAt: "2025-06-12T09:00:00Z" },
  { id: "r_004", title: "Operations Efficiency Report", type: "operations", description: "Supply chain optimization and warehouse utilization analysis", generatedBy: "Logistics Optimization Agent", status: "generating", createdAt: "2025-06-20T10:00:00Z" },
];

// ── Market Intelligence Mock ──────────────────────────────────────
export const mockMarkets: MarketData[] = [
  { id: "m_001", name: "Maharashtra", level: "state", state: "Maharashtra", population: 124000000, populationDensity: 365, avgIncome: 185000, urbanizationRate: 45.2, growthRate: 6.8, expansionScore: 88, demandScore: 91, competitionScore: 72 },
  { id: "m_002", name: "Gujarat", level: "state", state: "Gujarat", population: 71000000, populationDensity: 308, avgIncome: 165000, urbanizationRate: 42.6, growthRate: 7.2, expansionScore: 82, demandScore: 84, competitionScore: 68 },
  { id: "m_003", name: "Rajasthan", level: "state", state: "Rajasthan", population: 81000000, populationDensity: 200, avgIncome: 125000, urbanizationRate: 24.9, growthRate: 5.4, expansionScore: 76, demandScore: 72, competitionScore: 45 },
  { id: "m_004", name: "Tamil Nadu", level: "state", state: "Tamil Nadu", population: 77000000, populationDensity: 555, avgIncome: 175000, urbanizationRate: 48.4, growthRate: 6.1, expansionScore: 85, demandScore: 87, competitionScore: 78 },
  { id: "m_005", name: "Uttar Pradesh", level: "state", state: "Uttar Pradesh", population: 231000000, populationDensity: 828, avgIncome: 95000, urbanizationRate: 22.3, growthRate: 4.8, expansionScore: 71, demandScore: 68, competitionScore: 35 },
  { id: "m_006", name: "Karnataka", level: "state", state: "Karnataka", population: 68000000, populationDensity: 319, avgIncome: 195000, urbanizationRate: 38.7, growthRate: 7.5, expansionScore: 86, demandScore: 89, competitionScore: 75 },
];

export const mockSiteCandidates: SiteCandidate[] = [
  { id: "s_001", name: "Jaipur Central Mall Area", address: "MI Road, Jaipur", city: "Jaipur", state: "Rajasthan", district: "Jaipur", latitude: 26.9124, longitude: 75.7873, overallScore: 87, demandScore: 90, competitionScore: 42, logisticsScore: 78, financialScore: 85, accessibilityScore: 92, recommendation: "expand", riskLevel: "low" },
  { id: "s_002", name: "Indore Vijay Nagar", address: "AB Road, Vijay Nagar", city: "Indore", state: "Madhya Pradesh", district: "Indore", latitude: 22.7196, longitude: 75.8577, overallScore: 82, demandScore: 85, competitionScore: 38, logisticsScore: 72, financialScore: 80, accessibilityScore: 88, recommendation: "expand", riskLevel: "low" },
  { id: "s_003", name: "Lucknow Gomti Nagar", address: "Gomti Nagar Extension", city: "Lucknow", state: "Uttar Pradesh", district: "Lucknow", latitude: 26.8467, longitude: 80.9462, overallScore: 79, demandScore: 82, competitionScore: 55, logisticsScore: 68, financialScore: 76, accessibilityScore: 85, recommendation: "expand", riskLevel: "medium" },
  { id: "s_004", name: "Chennai OMR", address: "Old Mahabalipuram Road", city: "Chennai", state: "Tamil Nadu", district: "Chennai", latitude: 12.9516, longitude: 80.2423, overallScore: 84, demandScore: 88, competitionScore: 72, logisticsScore: 82, financialScore: 78, accessibilityScore: 90, recommendation: "expand", riskLevel: "medium" },
];

// ── Operations Mock ───────────────────────────────────────────────
export const mockWarehouses: Warehouse[] = [
  { id: "w_001", name: "Mumbai Central Hub", address: "Bhiwandi, Thane", city: "Mumbai", state: "Maharashtra", capacity: 50000, utilization: 78, type: "central", operatingCost: 1200000, latitude: 19.3219, longitude: 73.0583 },
  { id: "w_002", name: "Pune Distribution Center", address: "Chakan Industrial Area", city: "Pune", state: "Maharashtra", capacity: 30000, utilization: 65, type: "distribution", operatingCost: 800000, latitude: 18.7570, longitude: 73.8534 },
  { id: "w_003", name: "Ahmedabad Cold Chain", address: "Sanand GIDC", city: "Ahmedabad", state: "Gujarat", capacity: 15000, utilization: 82, type: "cold_chain", operatingCost: 950000, latitude: 22.9920, longitude: 72.3710 },
];

// ── KPIs ──────────────────────────────────────────────────────────
export const mockKPIs: KPI[] = [
  { id: "kpi_001", name: "Total Revenue", value: 298500000, target: 350000000, unit: "₹", trend: "up", trendValue: "+12.4%", category: "revenue", period: "FY25 YTD" },
  { id: "kpi_002", name: "Gross Margin", value: 34.2, target: 36, unit: "%", trend: "up", trendValue: "+1.8%", category: "revenue", period: "Q2 2025" },
  { id: "kpi_003", name: "Same-Store Sales Growth", value: 8.7, target: 10, unit: "%", trend: "up", trendValue: "+2.1%", category: "growth", period: "Q2 2025" },
  { id: "kpi_004", name: "New Outlets Opened", value: 12, target: 20, unit: "outlets", trend: "up", trendValue: "+4 QoQ", category: "growth", period: "Q2 2025" },
  { id: "kpi_005", name: "Inventory Turnover", value: 14.2, target: 16, unit: "x", trend: "up", trendValue: "+0.8x", category: "efficiency", period: "Q2 2025" },
  { id: "kpi_006", name: "Customer Satisfaction", value: 4.3, target: 4.5, unit: "/5", trend: "neutral", trendValue: "No change", category: "operations", period: "Q2 2025" },
];

// ── Studio Definitions ────────────────────────────────────────────
export const mockStudios: Studio[] = [
  {
    id: "market-intelligence",
    name: "Market Intelligence",
    description: "Identify where your company should expand",
    icon: "Globe",
    color: "#3B82F6",
    gradient: "from-blue-500 to-blue-600",
    modules: [
      { id: "market-overview", name: "Market Overview", description: "High-level market analysis and trends", icon: "BarChart3", status: "active", route: "/app/market-intelligence/overview" },
      { id: "state-explorer", name: "State Explorer", description: "Deep-dive into state-level demographics", icon: "Map", status: "active", route: "/app/market-intelligence/state-explorer" },
      { id: "site-selection", name: "Site Selection", description: "AI-powered location scoring and ranking", icon: "MapPin", status: "active", route: "/app/market-intelligence/site-selection" },
      { id: "competitor-mapping", name: "Competitor Mapping", description: "Competitive landscape visualization", icon: "Users", status: "active", route: "/app/market-intelligence/competitor-mapping" },
      { id: "demand-analysis", name: "Demand Analysis", description: "Consumer demand patterns and forecasting", icon: "TrendingUp", status: "active", route: "/app/market-intelligence/demand-analysis" },
      { id: "heatmaps", name: "Heatmaps", description: "Geographic density and opportunity maps", icon: "Flame", status: "beta", route: "/app/market-intelligence/heatmaps" },
      { id: "expansion-scoring", name: "Expansion Scoring", description: "Multi-dimensional expansion scores", icon: "Target", status: "active", route: "/app/market-intelligence/expansion-scoring" },
      { id: "customer-segmentation", name: "Customer Segmentation", description: "Target audience analysis", icon: "UserCircle", status: "coming_soon", route: "/app/market-intelligence/customer-segmentation" },
      { id: "growth-forecasting", name: "Growth Forecasting", description: "Predictive growth models", icon: "LineChart", status: "coming_soon", route: "/app/market-intelligence/growth-forecasting" },
    ],
  },
  {
    id: "operations",
    name: "Operations Intelligence",
    description: "Optimize your retail operations",
    icon: "Settings",
    color: "#10B981",
    gradient: "from-emerald-500 to-emerald-600",
    modules: [
      { id: "inventory", name: "Inventory Dashboard", description: "Real-time inventory monitoring", icon: "Package", status: "active", route: "/app/operations/inventory" },
      { id: "warehouse-mgmt", name: "Warehouse Management", description: "Warehouse capacity and operations", icon: "Warehouse", status: "active", route: "/app/operations/warehouses" },
      { id: "route-optimization", name: "Route Optimization", description: "AI-optimized delivery routes", icon: "Route", status: "active", route: "/app/operations/routes" },
      { id: "supplier-analytics", name: "Supplier Analytics", description: "Supplier performance tracking", icon: "Truck", status: "active", route: "/app/operations/suppliers" },
      { id: "demand-forecasting", name: "Demand Forecasting", description: "Predict future demand patterns", icon: "Brain", status: "beta", route: "/app/operations/demand-forecast" },
      { id: "cold-chain", name: "Cold Chain Monitoring", description: "Temperature-sensitive logistics", icon: "Thermometer", status: "coming_soon", route: "/app/operations/cold-chain" },
      { id: "procurement", name: "Procurement", description: "Purchase order management", icon: "ShoppingCart", status: "coming_soon", route: "/app/operations/procurement" },
    ],
  },
  {
    id: "executive",
    name: "Executive Intelligence",
    description: "Strategic insights for leadership",
    icon: "Crown",
    color: "#F59E0B",
    gradient: "from-amber-500 to-amber-600",
    modules: [
      { id: "executive-dashboard", name: "Executive Dashboard", description: "C-suite overview and KPIs", icon: "LayoutDashboard", status: "active", route: "/app/executive/dashboard" },
      { id: "company-kpis", name: "Company KPIs", description: "Key performance indicators tracking", icon: "Activity", status: "active", route: "/app/executive/kpis" },
      { id: "financial-simulator", name: "Financial Simulator", description: "What-if financial modeling", icon: "Calculator", status: "active", route: "/app/executive/financial" },
      { id: "scenario-planning", name: "Scenario Planning", description: "Business scenario comparisons", icon: "GitBranch", status: "active", route: "/app/executive/scenarios" },
      { id: "goal-tracking", name: "Goal Tracking", description: "Strategic objective monitoring", icon: "Target", status: "active", route: "/app/executive/goals" },
      { id: "board-reports", name: "Board Reports", description: "Auto-generated board materials", icon: "FileText", status: "beta", route: "/app/executive/board-reports" },
      { id: "risk-analysis", name: "Risk Analysis", description: "Risk assessment and mitigation", icon: "Shield", status: "coming_soon", route: "/app/executive/risk" },
    ],
  },
  {
    id: "ai-research",
    name: "AI Research Studio",
    description: "Autonomous intelligence collection and analysis",
    icon: "Sparkles",
    color: "#8B5CF6",
    gradient: "from-violet-500 to-violet-600",
    modules: [
      { id: "agent-manager", name: "AI Agent Manager", description: "Configure and monitor AI agents", icon: "Bot", status: "active", route: "/app/ai-research/agents" },
      { id: "research-queue", name: "Research Queue", description: "Pending and active research tasks", icon: "ListChecks", status: "active", route: "/app/ai-research/queue" },
      { id: "data-sources", name: "Data Sources", description: "External data source management", icon: "Database", status: "active", route: "/app/ai-research/sources" },
      { id: "competitor-intel", name: "Competitor Intelligence", description: "Real-time competitor monitoring", icon: "Eye", status: "active", route: "/app/ai-research/competitor-intel" },
      { id: "news-monitoring", name: "News Monitoring", description: "Industry news and trends", icon: "Newspaper", status: "beta", route: "/app/ai-research/news" },
      { id: "research-history", name: "Research History", description: "Historical research results", icon: "History", status: "active", route: "/app/ai-research/history" },
      { id: "social-listening", name: "Social Listening", description: "Social media brand monitoring", icon: "MessageCircle", status: "coming_soon", route: "/app/ai-research/social" },
    ],
  },
];

// ── Indian States ─────────────────────────────────────────────────
export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal", "Delhi", "Chandigarh", "Puducherry", "Jammu & Kashmir", "Ladakh",
];

// ── Industries ────────────────────────────────────────────────────
export const INDUSTRIES = [
  "Beverage Chain", "Dairy Brand", "Restaurant", "Quick Service Restaurant",
  "Supermarket", "Convenience Store", "Pharmacy Chain", "Franchise Business",
  "Fashion Retail", "Electronics Retail", "Fuel Station", "Coffee & Café",
  "FMCG", "Grocery", "Other",
];

export const BUSINESS_MODELS = ["Owned", "Franchise", "Owned + Franchise", "License", "Cooperative", "Hybrid"];
export const TIMELINES = ["6 Months", "1 Year", "2 Years", "3 Years", "5 Years", "10 Years"];
export const OUTLET_SIZES = ["500-1000 sq ft", "1000-2000 sq ft", "2000-3000 sq ft", "3000-5000 sq ft", "5000-10000 sq ft", "10000+ sq ft"];
export const CUSTOMER_SEGMENTS = ["Budget Conscious", "Middle Income", "Upper Middle Class", "Premium/Luxury", "Young Professionals", "Families", "Students", "Mixed"];

export const UPLOAD_DATA_TYPES: Array<{ value: string; label: string; description: string }> = [
  { value: "outlet_list", label: "Outlet List", description: "All store/outlet locations and details" },
  { value: "sales_history", label: "Sales History", description: "Historical sales transactions" },
  { value: "customer_data", label: "Customer Data", description: "Customer profiles and demographics" },
  { value: "inventory", label: "Inventory", description: "Current stock levels and movements" },
  { value: "warehouses", label: "Warehouses", description: "Warehouse locations and capacity" },
  { value: "distributor_list", label: "Distributor List", description: "Distribution partner details" },
  { value: "supplier_list", label: "Supplier List", description: "Supplier contacts and contracts" },
  { value: "delivery_data", label: "Delivery Data", description: "Delivery routes and performance" },
  { value: "logistics_data", label: "Logistics Data", description: "Supply chain logistics details" },
  { value: "product_catalog", label: "Product Catalog", description: "Product master list and attributes" },
  { value: "pricing", label: "Pricing", description: "Price lists and discount structures" },
  { value: "marketing_campaigns", label: "Marketing Campaigns", description: "Campaign history and performance" },
  { value: "financial_statements", label: "Financial Statements", description: "Balance sheets and P&L" },
];
