import React from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, MapPin, Map, Users, Target, Activity, Settings } from "lucide-react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Locations", href: "/locations", icon: MapPin },
    { label: "Markets", href: "/markets", icon: Map },
    { label: "Competitors", href: "/competitors", icon: Users },
    { label: "Financial Simulator", href: "/financial", icon: Activity },
    { label: "Scoring Engine", href: "/scoring", icon: Target },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground dark">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <span className="font-mono font-bold tracking-tight text-lg uppercase">REIS Cockpit</span>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
                data-testid={`nav-${item.label.toLowerCase().replace(" ", "-")}`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border text-xs text-muted-foreground font-mono">
          System Active: {new Date().toLocaleTimeString()}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-14 border-b border-border bg-card/50 flex items-center px-6 justify-between shrink-0">
          <div className="text-sm text-muted-foreground font-mono">
            {location.toUpperCase() || "/ DASHBOARD"}
          </div>
          <div className="flex items-center gap-4">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-xs text-primary font-mono tracking-widest">LIVE</span>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
