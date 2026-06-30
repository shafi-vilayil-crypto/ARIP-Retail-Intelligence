import { useRoute } from "wouter";
import {
  useGetLocation, useScoreLocation, useUpdateLocation,
  getGetLocationQueryKey, getListLocationsQueryKey,
  useGetLocationFinancial, useGetLocationCompetitors
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  MapPin, Zap, TrendingUp, IndianRupee, Users, Star, Truck
} from "lucide-react";
import { motion } from "framer-motion";

const SCORE_DIMS = [
  { key: "demandScore", label: "Demand" },
  { key: "competitionScore", label: "Competition Gap" },
  { key: "logisticsScore", label: "Logistics" },
  { key: "financialScore", label: "Financial" },
  { key: "accessibilityScore", label: "Accessibility" },
  { key: "growthScore", label: "Growth" },
];

function scoreColor(score: number) {
  if (score >= 70) return "text-green-400";
  if (score >= 40) return "text-amber-400";
  return "text-red-400";
}

function scoreBg(score: number) {
  if (score >= 70) return "bg-green-500";
  if (score >= 40) return "bg-amber-500";
  return "bg-red-500";
}

function fmt(n: number | null | undefined, prefix = "") {
  if (n == null) return "—";
  if (n >= 10000000) return `${prefix}${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `${prefix}${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `${prefix}${(n / 1000).toFixed(0)}K`;
  return `${prefix}${n.toFixed(0)}`;
}

export default function LocationProfile() {
  const [, params] = useRoute("/locations/:id");
  const id = params ? parseInt(params.id, 10) : 0;
  const qc = useQueryClient();

  const { data: loc, isLoading } = useGetLocation(id, { query: { enabled: !!id, queryKey: getGetLocationQueryKey(id) } });
  const { data: financial } = useGetLocationFinancial(id, { query: { enabled: !!id, queryKey: [`/locations/${id}/financial`] } });
  const { data: nearby } = useGetLocationCompetitors(id, { query: { enabled: !!id, queryKey: [`/locations/${id}/competitors`] } });

  const scoreMut = useScoreLocation({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getGetLocationQueryKey(id) });
        qc.invalidateQueries({ queryKey: getListLocationsQueryKey() });
      }
    }
  });

  const updateMut = useUpdateLocation({
    mutation: {
      onSuccess: () => qc.invalidateQueries({ queryKey: getGetLocationQueryKey(id) })
    }
  });

  if (isLoading) {
    return <div className="space-y-6"><Skeleton className="h-32 w-full" /><div className="grid grid-cols-3 gap-4">{[1,2,3].map(i => <Skeleton key={i} className="h-48 w-full" />)}</div></div>;
  }

  if (!loc) {
    return <div className="text-center py-20 font-mono text-muted-foreground">Location not found.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold font-mono tracking-tight">{loc.name}</h1>
            <Badge variant={loc.recommendation === "expand" ? "default" : loc.recommendation === "avoid" ? "destructive" : "secondary"} className="font-mono uppercase text-xs">
              {loc.recommendation}
            </Badge>
            <Badge variant="outline" className={`font-mono text-xs ${loc.riskLevel === "low" ? "border-green-500/40 text-green-400" : loc.riskLevel === "high" ? "border-red-500/40 text-red-400" : "border-amber-500/40 text-amber-400"}`}>
              {loc.riskLevel} risk
            </Badge>
          </div>
          <p className="text-muted-foreground font-mono text-sm mt-1 flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {loc.address || `${loc.city}, ${loc.state}`}
          </p>
          <p className="text-xs text-muted-foreground/60 font-mono mt-0.5">
            {loc.latitude?.toFixed(4)}, {loc.longitude?.toFixed(4)} | Confidence: {loc.confidenceLevel}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className={`text-5xl font-bold font-mono ${scoreColor(loc.overallScore)}`} data-testid="text-overall-score">
            {loc.overallScore.toFixed(1)}
          </div>
          <div className="text-xs font-mono text-muted-foreground uppercase">Overall Score</div>
          <Button
            data-testid="button-run-ai-score"
            size="sm"
            className="gap-1.5"
            disabled={scoreMut.isPending}
            onClick={() => scoreMut.mutate({ id })}
          >
            <Zap className="h-3 w-3" />
            {scoreMut.isPending ? "Scoring..." : "Run AI Score"}
          </Button>
        </div>
      </div>

      {/* Status controls */}
      <Card>
        <CardContent className="py-3 px-4 flex items-center gap-4">
          <span className="text-xs font-mono uppercase text-muted-foreground">Status</span>
          <Select
            value={loc.status}
            onValueChange={(v) => updateMut.mutate({ id, data: { status: v } })}
          >
            <SelectTrigger data-testid="select-location-status" className="w-[160px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="candidate">Candidate</SelectItem>
              <SelectItem value="shortlisted">Shortlisted</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          {loc.notes && <p className="text-xs text-muted-foreground flex-1 truncate">{loc.notes}</p>}
        </CardContent>
      </Card>

      {/* Score breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="font-mono text-sm uppercase tracking-widest text-muted-foreground">Score Breakdown</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {SCORE_DIMS.map((dim, i) => {
              const val = (loc as any)[dim.key] as number | null;
              return (
                <motion.div key={dim.key} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-muted-foreground uppercase">{dim.label}</span>
                    <span className={val != null ? scoreColor(val) : "text-muted-foreground"}>{val != null ? val.toFixed(1) : "N/A"}</span>
                  </div>
                  <Progress value={val ?? 0} className={`h-1.5 [&>div]:${val != null ? scoreBg(val) : "bg-muted"}`} />
                </motion.div>
              );
            })}
          </CardContent>
        </Card>

        {/* Location intel */}
        <Card>
          <CardHeader><CardTitle className="font-mono text-sm uppercase tracking-widest text-muted-foreground">Market Intelligence</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { icon: Users, label: "Population", val: fmt((loc as any).population) },
                { icon: IndianRupee, label: "Avg Income/mo", val: fmt((loc as any).avgMonthlyIncome, "₹") },
                { icon: TrendingUp, label: "Daily Footfall", val: fmt((loc as any).footfallPerDay) },
                { icon: Truck, label: "Delivery Score", val: (loc as any).deliveryDemandScore != null ? `${((loc as any).deliveryDemandScore as number).toFixed(0)}/100` : "—" },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-2 p-2 rounded bg-muted/30">
                  <item.icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs text-muted-foreground font-mono">{item.label}</div>
                    <div className="font-mono font-medium">{item.val}</div>
                  </div>
                </div>
              ))}
            </div>
            <Separator className="my-3" />
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              <div className={`text-center p-1.5 rounded ${(loc as any).roadAccess ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>Road Access</div>
              <div className={`text-center p-1.5 rounded ${(loc as any).parkingAvailable ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>Parking</div>
              <div className={`text-center p-1.5 rounded ${(loc as any).publicTransport ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>Transit</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial simulation */}
      {financial && (
        <Card>
          <CardHeader><CardTitle className="font-mono text-sm uppercase tracking-widest text-muted-foreground">Financial Simulation</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "CAPEX", val: fmt(financial.capex, "₹"), highlight: false },
                { label: "Monthly OPEX", val: fmt(financial.monthlyOpex, "₹"), highlight: false },
                { label: "Monthly Revenue", val: fmt(financial.monthlyRevenue, "₹"), highlight: true },
                { label: "EBITDA/mo", val: fmt(financial.ebitda, "₹"), highlight: financial.ebitda != null && financial.ebitda > 0 },
                { label: "ROI", val: financial.roiPct != null ? `${financial.roiPct}%` : "—", highlight: true },
                { label: "Break-even", val: financial.breakEvenMonths != null ? `${financial.breakEvenMonths}mo` : "—", highlight: false },
                { label: "Payback", val: financial.paybackPeriodMonths != null ? `${financial.paybackPeriodMonths}mo` : "—", highlight: false },
                { label: "Gross Margin", val: financial.grossMarginPct != null ? `${financial.grossMarginPct}%` : "—", highlight: true },
              ].map(item => (
                <div key={item.label} className="text-center p-3 rounded bg-muted/30 border border-border">
                  <div className={`text-lg font-bold font-mono ${item.highlight ? "text-primary" : "text-foreground"}`}>{item.val}</div>
                  <div className="text-xs text-muted-foreground font-mono uppercase mt-0.5">{item.label}</div>
                </div>
              ))}
            </div>
            <Separator className="my-3" />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div><div className="text-sm font-mono font-bold text-primary">{fmt(financial.year1Revenue, "₹")}</div><div className="text-xs text-muted-foreground font-mono">Year 1</div></div>
              <div><div className="text-sm font-mono font-bold text-primary">{fmt(financial.year3Revenue, "₹")}</div><div className="text-xs text-muted-foreground font-mono">Year 3</div></div>
              <div><div className="text-sm font-mono font-bold text-primary">{fmt(financial.year5Revenue, "₹")}</div><div className="text-xs text-muted-foreground font-mono">Year 5</div></div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Nearby competitors */}
      {nearby && nearby.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="font-mono text-sm uppercase tracking-widest text-muted-foreground">Nearby Competitors ({nearby.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {nearby.map(c => (
                <div key={c.id} className="flex items-center justify-between p-2 rounded bg-muted/30 text-sm">
                  <div>
                    <span className="font-medium">{c.name}</span>
                    {c.brand && <span className="text-muted-foreground text-xs ml-1">({c.brand})</span>}
                    <span className="text-xs text-muted-foreground font-mono ml-2">{c.type.replace(/_/g, " ")}</span>
                  </div>
                  {c.avgRating != null && (
                    <span className="flex items-center gap-1 text-amber-400 text-xs font-mono">
                      <Star className="h-3 w-3 fill-current" />{c.avgRating.toFixed(1)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
