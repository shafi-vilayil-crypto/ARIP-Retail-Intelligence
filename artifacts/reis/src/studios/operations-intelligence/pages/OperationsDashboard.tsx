import React from "react";
import StudioLayout from "@/platform/layout/StudioLayout";
import { useLocation } from "wouter";
import { mockStudios, mockWarehouses } from "@/shared/lib/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Warehouse, Route, Truck, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OperationsDashboard() {
  const [, setLocation] = useLocation();
  const studio = mockStudios.find((s) => s.id === "operations")!;

  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case "Package":
        return Package;
      case "Warehouse":
        return Warehouse;
      case "Route":
        return Route;
      case "Truck":
        return Truck;
      default:
        return Brain;
    }
  };

  return (
    <StudioLayout
      title={studio.name}
      description={studio.description}
      studioColor={studio.color}
      studioId={studio.id}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI Summary Cards */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-card border border-border/80 shadow-sm rounded-2xl">
              <CardContent className="p-4 flex flex-col justify-between h-28">
                <span className="text-xs font-semibold text-muted-foreground">Inventory Health</span>
                <div className="text-xl font-bold text-foreground">94.8%</div>
                <span className="text-[10px] text-emerald-500 font-bold">12 SKUs Low Stock</span>
              </CardContent>
            </Card>
            <Card className="bg-card border border-border/80 shadow-sm rounded-2xl">
              <CardContent className="p-4 flex flex-col justify-between h-28">
                <span className="text-xs font-semibold text-muted-foreground">Active Warehouses</span>
                <div className="text-xl font-bold text-foreground">3 Centers</div>
                <span className="text-[10px] text-primary font-semibold">75% Avg Capacity</span>
              </CardContent>
            </Card>
            <Card className="bg-card border border-border/80 shadow-sm rounded-2xl">
              <CardContent className="p-4 flex flex-col justify-between h-28">
                <span className="text-xs font-semibold text-muted-foreground">Route Efficiency</span>
                <div className="text-xl font-bold text-foreground">88.2%</div>
                <span className="text-[10px] text-emerald-500 font-semibold">Optimized Paths</span>
              </CardContent>
            </Card>
          </div>

          {/* Module Grid List */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Operational Modules</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {studio.modules.map((mod) => {
                const Icon = getModuleIcon(mod.icon);
                return (
                  <Card
                    key={mod.id}
                    onClick={() => {
                      if (mod.status === "active") setLocation(mod.route);
                    }}
                    className={`bg-card hover:bg-muted/20 border border-border/80 rounded-2xl shadow-sm cursor-pointer transition-colors group ${
                      mod.status !== "active" ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  >
                    <CardContent className="p-4 flex gap-3.5 items-center">
                      <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                            {mod.name}
                          </h4>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            mod.status === "active"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : mod.status === "beta"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {mod.status === "active" ? "Active" : mod.status === "beta" ? "Beta" : "Planned"}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-normal truncate">
                          {mod.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Warehouse Capacity Overview */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Warehouse Capacity</h3>
          <Card className="bg-card border border-border/80 rounded-3xl shadow-sm p-4 space-y-4">
            <div className="space-y-4">
              {mockWarehouses.map((wh) => (
                <div key={wh.id} className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-foreground truncate max-w-[150px]">{wh.name}</span>
                    <span className="text-muted-foreground font-semibold">{wh.utilization}%</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${wh.utilization}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation("/app/operations/warehouses")}
              className="w-full rounded-xl text-xs cursor-pointer"
            >
              Configure Warehouses
            </Button>
          </Card>
        </div>
      </div>
    </StudioLayout>
  );
}
