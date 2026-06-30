import { useRoute, Link } from "wouter";
import { useGetMarket, useGetMarketRanking } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, TrendingUp, Users, IndianRupee, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

function scoreColor(score: number) {
  if (score >= 70) return "text-green-400";
  if (score >= 40) return "text-amber-400";
  return "text-red-400";
}

function fmt(n: number | null | undefined, prefix = "") {
  if (n == null) return "—";
  if (n >= 10000000) return `${prefix}${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `${prefix}${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `${prefix}${(n / 1000).toFixed(0)}K`;
  return `${prefix}${Math.round(n)}`;
}

export default function MarketProfile() {
  const [, params] = useRoute("/markets/:id");
  const id = params ? parseInt(params.id, 10) : 0;

  const { data: market, isLoading } = useGetMarket(id, { query: { enabled: !!id, queryKey: [`/markets/${id}`] } });
  const { data: ranking } = useGetMarketRanking(id, { query: { enabled: !!id, queryKey: [`/markets/${id}/ranking`] } });

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-32 w-full" /><Skeleton className="h-64 w-full" /></div>;
  if (!market) return <div className="py-20 text-center font-mono text-muted-foreground">Market not found.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <Link href="/markets">
          <Button variant="ghost" size="icon" data-testid="button-back"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold font-mono tracking-tight">{market.name}</h1>
            <Badge variant="outline" className="font-mono text-xs uppercase">{market.level.replace("_", " ")}</Badge>
          </div>
          <p className="text-muted-foreground font-mono text-sm mt-1 flex items-center gap-1">
            <MapPin className="h-3 w-3" />{market.city ? `${market.city}, ` : ""}{market.state}
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs font-mono text-muted-foreground uppercase">{market.locationCount} Locations</div>
          {market.avgScore != null && (
            <div className={`text-3xl font-bold font-mono ${scoreColor(market.avgScore)}`}>{market.avgScore.toFixed(1)}</div>
          )}
          {market.avgScore != null && <div className="text-xs text-muted-foreground font-mono">Avg Score</div>}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Users, label: "Population", val: fmt(market.population) },
          { icon: IndianRupee, label: "Avg Income", val: fmt(market.avgIncome, "₹") },
          { icon: TrendingUp, label: "Growth Rate", val: market.growthRate != null ? `${(market.growthRate * 100).toFixed(1)}%` : "—" },
          { icon: MapPin, label: "Urbanization", val: market.urbanizationRate != null ? `${(market.urbanizationRate * 100).toFixed(0)}%` : "—" },
        ].map(item => (
          <Card key={item.label}>
            <CardContent className="py-3 px-4 flex items-center gap-3">
              <item.icon className="h-5 w-5 text-muted-foreground shrink-0" />
              <div>
                <div className="text-xs text-muted-foreground font-mono">{item.label}</div>
                <div className="font-bold font-mono">{item.val}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {market.notes && (
        <Card><CardContent className="py-3 px-4 text-sm text-muted-foreground">{market.notes}</CardContent></Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
            Location Rankings in {market.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!ranking || ranking.length === 0 ? (
            <p className="text-center text-muted-foreground font-mono py-8">No locations assigned to this market yet.</p>
          ) : (
            <div className="space-y-2">
              {ranking.map((loc, i) => (
                <motion.div key={loc.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <div className="flex items-center gap-4 p-3 rounded-md bg-muted/30 border border-border hover:border-primary/30 transition-colors">
                    <div className="text-2xl font-bold font-mono text-muted-foreground/50 w-8 text-center">
                      #{loc.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{loc.name}</span>
                        <Badge variant={loc.recommendation === "expand" ? "default" : loc.recommendation === "avoid" ? "destructive" : "secondary"} className="text-[10px] font-mono uppercase">
                          {loc.recommendation}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">{loc.city}, {loc.state}</p>
                    </div>
                    <div className={`text-xl font-bold font-mono ${scoreColor(loc.overallScore)}`}>{loc.overallScore.toFixed(1)}</div>
                    <Link href={`/locations/${loc.id}`}>
                      <Button variant="ghost" size="icon" data-testid={`button-view-ranked-${loc.id}`}><ExternalLink className="h-4 w-4" /></Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
