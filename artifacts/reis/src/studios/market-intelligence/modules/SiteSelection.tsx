import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MapPin, ArrowLeft, CheckCircle2, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { mockSiteCandidates } from "@/shared/lib/mockData";

export default function SiteSelection() {
  const [, setLocation] = useLocation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/app/market-intelligence")} className="rounded-xl cursor-pointer">
            <ArrowLeft className="h-4.5 w-4.5" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-foreground">Site Selection</h2>
            <p className="text-xs text-muted-foreground">Catchment score profiles for shortlisted store candidate locations.</p>
          </div>
        </div>
        <Button size="sm" variant="outline" className="rounded-xl flex gap-1 cursor-pointer">
          <MapPin className="h-3.5 w-3.5" /> Analyze Custom Coordinates
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Shortlisted Location Scorecard</h3>
          <div className="border border-border/80 rounded-2xl overflow-hidden shadow-sm bg-card">
            <Table>
              <TableHeader className="bg-muted/10">
                <TableRow>
                  <TableHead className="text-xs font-semibold py-3">Site</TableHead>
                  <TableHead className="text-xs font-semibold py-3 text-center">Score</TableHead>
                  <TableHead className="text-xs font-semibold py-3 text-center">Demand</TableHead>
                  <TableHead className="text-xs font-semibold py-3 text-center">Competition</TableHead>
                  <TableHead className="text-xs font-semibold py-3 text-center">Recommendation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSiteCandidates.map((site) => (
                  <TableRow key={site.id}>
                    <TableCell className="py-3">
                      <div className="text-xs font-bold text-foreground">{site.name}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{site.address}</div>
                    </TableCell>
                    <TableCell className="text-center font-bold text-xs">{site.overallScore}</TableCell>
                    <TableCell className="text-center text-xs text-muted-foreground">{site.demandScore}</TableCell>
                    <TableCell className="text-center text-xs text-muted-foreground">{site.competitionScore}</TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold score-excellent">
                        {site.recommendation}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">AI Evaluation Log</h3>
          <Card className="bg-card border border-border/80 rounded-3xl shadow-sm p-4 space-y-3">
            {[
              "🔍 Analyzing Jaipur catchment zone boundaries...",
              "🚶 Estimated monthly footfall density computed: 18K",
              "📦 Logistics check: closest warehouse is Bhiwandi DC (24h)",
              "✅ Score calculated: 87/100 (Jaipur Central Mall)"
            ].map((log, idx) => (
              <div key={idx} className="flex gap-2 items-start text-xs text-muted-foreground">
                <span className="text-primary mt-0.5">•</span>
                <span>{log}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
