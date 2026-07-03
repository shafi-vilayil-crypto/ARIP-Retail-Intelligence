import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ListChecks, RefreshCw } from "lucide-react";
import { useLocation } from "wouter";

export default function ResearchQueue() {
  const [, setLocation] = useLocation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/app/ai-research")} className="rounded-xl cursor-pointer">
            <ArrowLeft className="h-4.5 w-4.5" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-foreground">Research Queue</h2>
            <p className="text-xs text-muted-foreground">Queues of pending data gathering requests and web scrape processes.</p>
          </div>
        </div>
        <Button size="sm" variant="outline" className="rounded-xl flex gap-1 cursor-pointer">
          <RefreshCw className="h-3.5 w-3.5" /> Clear Queue
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 rounded-3xl bg-card border border-border/80 p-5 space-y-4 shadow-sm min-h-[300px] flex flex-col justify-center items-center text-center">
          <ListChecks className="h-12 w-12 text-primary/40 mb-3 animate-pulse" />
          <h3 className="text-sm font-bold text-foreground">Pending Crawler Jobs Queue</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            AI is monitoring the crawler schedules. Active scraper schedules and timelines will render here in Phase 2.
          </p>
        </Card>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Queue Highlights</h3>
          <div className="space-y-3">
            {[
              { source: "Zomato Restaurant listings", status: "In Progress" },
              { source: "Jaipur Ward Census demographic files", status: "Queued" },
              { source: "Blinkit Coverage coordinate blocks", status: "Queued" }
            ].map((queue, idx) => (
              <div key={idx} className="p-3 border border-border/80 rounded-2xl bg-muted/10 space-y-1">
                <div className="flex justify-between items-center text-xs font-bold text-foreground">
                  <span>{queue.source}</span>
                  <span className="text-primary">{queue.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
