import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import { CompanyProvider } from "@/context/CompanyContext";
import NotFound from "@/pages/not-found";

import Dashboard from "@/pages/dashboard";
import Analysis from "@/pages/analysis";
import Locations from "@/pages/locations";
import NewLocation from "@/pages/new-location";
import LocationProfile from "@/pages/location-profile";
import Markets from "@/pages/markets";
import MarketProfile from "@/pages/market-profile";
import Competitors from "@/pages/competitors";
import ScoringEngine from "@/pages/scoring-engine";
import FinancialSimulator from "@/pages/financial-simulator";
import Reports from "@/pages/reports";
import Demand from "@/pages/demand";
import Logistics from "@/pages/logistics";
import SettingsPage from "@/pages/settings";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
});

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/analysis" component={Analysis} />
        <Route path="/locations/new" component={NewLocation} />
        <Route path="/locations/:id" component={LocationProfile} />
        <Route path="/locations" component={Locations} />
        <Route path="/markets/:id" component={MarketProfile} />
        <Route path="/markets" component={Markets} />
        <Route path="/competitors" component={Competitors} />
        <Route path="/scoring" component={ScoringEngine} />
        <Route path="/financial" component={FinancialSimulator} />
        <Route path="/reports" component={Reports} />
        <Route path="/demand" component={Demand} />
        <Route path="/logistics" component={Logistics} />
        <Route path="/settings" component={SettingsPage} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <CompanyProvider>
            <Router />
          </CompanyProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
