import React from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";

// Landing & Auth Views
import LandingPage from "@/landing/pages/LandingPage";
import LoginPage from "@/auth/pages/LoginPage";
import RegisterPage from "@/auth/pages/RegisterPage";
import CompanySelectPage from "@/auth/pages/CompanySelectPage";
import OnboardingPage from "@/onboarding/pages/OnboardingPage";

// Platform Shell Layout
import PlatformLayout from "@/platform/layout/PlatformLayout";

// Home Dashboard & Settings & Reports
import HomePage from "@/platform/pages/HomePage";
import ReportsPage from "@/reports/pages/ReportsPage";
import SettingsPage from "@/settings/pages/SettingsPage";

// Market Intelligence Modules
import MarketDashboard from "@/studios/market-intelligence/pages/MarketDashboard";
import MarketOverview from "@/studios/market-intelligence/modules/MarketOverview";
import StateExplorer from "@/studios/market-intelligence/modules/StateExplorer";
import SiteSelection from "@/studios/market-intelligence/modules/SiteSelection";
import CompetitorMapping from "@/studios/market-intelligence/modules/CompetitorMapping";

// Operations Intelligence Modules
import OperationsDashboard from "@/studios/operations-intelligence/pages/OperationsDashboard";
import InventoryDashboard from "@/studios/operations-intelligence/modules/InventoryDashboard";
import WarehouseManagement from "@/studios/operations-intelligence/modules/WarehouseManagement";
import RouteOptimization from "@/studios/operations-intelligence/modules/RouteOptimization";
import SupplierAnalytics from "@/studios/operations-intelligence/modules/SupplierAnalytics";

// Executive Intelligence Modules
import ExecutiveDashboard from "@/studios/executive-intelligence/pages/ExecutiveDashboard";
import CompanyKPIs from "@/studios/executive-intelligence/modules/CompanyKPIs";
import FinancialSimulator from "@/studios/executive-intelligence/modules/FinancialSimulator";
import ScenarioPlanning from "@/studios/executive-intelligence/modules/ScenarioPlanning";
import GoalTracking from "@/studios/executive-intelligence/modules/GoalTracking";

// AI Research Modules
import AIResearchDashboard from "@/studios/ai-research/pages/AIResearchDashboard";
import AIAgentManager from "@/studios/ai-research/modules/AIAgentManager";
import ResearchQueue from "@/studios/ai-research/modules/ResearchQueue";
import DataSources from "@/studios/ai-research/modules/DataSources";
import CompetitorIntel from "@/studios/ai-research/modules/CompetitorIntel";

import NotFound from "@/pages/not-found";

function PlatformRouter() {
  return (
    <PlatformLayout>
      <Switch>
        <Route path="/app" component={HomePage} />
        
        {/* Market Intelligence */}
        <Route path="/app/market-intelligence" component={MarketDashboard} />
        <Route path="/app/market-intelligence/overview" component={MarketOverview} />
        <Route path="/app/market-intelligence/state-explorer" component={StateExplorer} />
        <Route path="/app/market-intelligence/site-selection" component={SiteSelection} />
        <Route path="/app/market-intelligence/competitor-mapping" component={CompetitorMapping} />

        {/* Operations Intelligence */}
        <Route path="/app/operations" component={OperationsDashboard} />
        <Route path="/app/operations/inventory" component={InventoryDashboard} />
        <Route path="/app/operations/warehouses" component={WarehouseManagement} />
        <Route path="/app/operations/routes" component={RouteOptimization} />
        <Route path="/app/operations/suppliers" component={SupplierAnalytics} />

        {/* Executive Intelligence */}
        <Route path="/app/executive" component={ExecutiveDashboard} />
        <Route path="/app/executive/kpis" component={CompanyKPIs} />
        <Route path="/app/executive/financial" component={FinancialSimulator} />
        <Route path="/app/executive/scenarios" component={ScenarioPlanning} />
        <Route path="/app/executive/goals" component={GoalTracking} />

        {/* AI Research */}
        <Route path="/app/ai-research" component={AIResearchDashboard} />
        <Route path="/app/ai-research/agents" component={AIAgentManager} />
        <Route path="/app/ai-research/queue" component={ResearchQueue} />
        <Route path="/app/ai-research/sources" component={DataSources} />
        <Route path="/app/ai-research/competitor-intel" component={CompetitorIntel} />

        {/* Reports & Settings */}
        <Route path="/app/reports" component={ReportsPage} />
        <Route path="/app/settings" component={SettingsPage} />
        
        <Route component={NotFound} />
      </Switch>
    </PlatformLayout>
  );
}

export default function App() {
  return (
    <TooltipProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Switch>
          <Route path="/" component={LandingPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/companies" component={CompanySelectPage} />
          <Route path="/onboarding" component={OnboardingPage} />
          <Route path="/app" component={PlatformRouter} />
          <Route path="/app/:any*" component={PlatformRouter} />
          <Route component={NotFound} />
        </Switch>
      </WouterRouter>
      <Toaster />
    </TooltipProvider>
  );
}
