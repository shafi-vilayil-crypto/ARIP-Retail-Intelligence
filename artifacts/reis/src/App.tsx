import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import NotFound from "@/pages/not-found";

import Dashboard from "@/pages/dashboard";
import Locations from "@/pages/locations";
import NewLocation from "@/pages/new-location";
import LocationProfile from "@/pages/location-profile";
import Markets from "@/pages/markets";
import MarketProfile from "@/pages/market-profile";
import Competitors from "@/pages/competitors";
import ScoringEngine from "@/pages/scoring-engine";
import FinancialSimulator from "@/pages/financial-simulator";

const queryClient = new QueryClient();

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/locations/new" component={NewLocation} />
        <Route path="/locations/:id" component={LocationProfile} />
        <Route path="/locations" component={Locations} />
        <Route path="/markets/:id" component={MarketProfile} />
        <Route path="/markets" component={Markets} />
        <Route path="/competitors" component={Competitors} />
        <Route path="/scoring" component={ScoringEngine} />
        <Route path="/financial" component={FinancialSimulator} />
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
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
