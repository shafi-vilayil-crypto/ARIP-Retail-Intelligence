import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function IntegrationsTab() {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Connected Integrations</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { name: "Google Maps API", status: "Connected", desc: "Coordinates caching and site catchment metrics" },
          { name: "Swiggy / Zomato / Blinkit", status: "Connected", desc: "Competitor presence mapping and direct logistics" },
          { name: "Enterprise ERP / CRM integrations", status: "Setup Pending", desc: "Synchronize inventory, warehouses, or catalogs" }
        ].map((integ, idx) => (
          <div key={idx} className="border border-border/80 rounded-2xl p-4 bg-muted/10 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-foreground mb-1">
                <span>{integ.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  integ.status === "Connected" ? "bg-emerald-100 text-emerald-800" : "bg-muted text-muted-foreground"
                }`}>
                  {integ.status}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-normal">{integ.desc}</p>
            </div>
            <Button size="sm" variant="outline" className="rounded-xl w-fit cursor-pointer mt-2">
              {integ.status === "Connected" ? "Configure Connection" : "Connect API Key"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
