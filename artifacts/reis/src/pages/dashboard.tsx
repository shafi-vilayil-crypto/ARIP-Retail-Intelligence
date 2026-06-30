import React from "react";
import { 
  useGetDashboardSummary, 
  useGetTopLocations, 
  useGetStateRankings,
  useGetScoreDistribution,
  useGetCompetitorHeatmap 
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { MapPin, Target, Activity, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: summary, isLoading: loadingSummary } = useGetDashboardSummary();
  const { data: topLocations, isLoading: loadingTopLocations } = useGetTopLocations({ limit: 5 });
  const { data: scoreDistribution, isLoading: loadingScoreDist } = useGetScoreDistribution();

  if (loadingSummary || loadingTopLocations || loadingScoreDist) {
    return <div className="space-y-6">
      <Skeleton className="h-10 w-64" />
      <div className="grid grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 w-full" />)}
      </div>
      <div className="grid grid-cols-2 gap-6">
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-mono">EXECUTIVE DASHBOARD</h1>
          <p className="text-muted-foreground mt-1 text-sm font-mono">Overview of the entire expansion program across {summary?.statesCovered} states.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Total Locations Analyzed" 
          value={summary?.totalLocations || 0} 
          icon={MapPin} 
          subValue={`+${summary?.locationsThisMonth || 0} this month`} 
        />
        <MetricCard 
          title="Approved Sites" 
          value={summary?.approvedLocations || 0} 
          icon={CheckCircle2} 
          trend="positive"
        />
        <MetricCard 
          title="Avg Overall Score" 
          value={summary?.avgOverallScore?.toFixed(1) || "0.0"} 
          icon={Activity} 
          trend={summary && summary.avgOverallScore > 75 ? "positive" : "neutral"}
        />
        <MetricCard 
          title="Competitor Datapoints" 
          value={summary?.competitorCount || 0} 
          icon={Target} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-mono text-sm tracking-widest text-muted-foreground uppercase">Top Candidate Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topLocations?.map((loc, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={loc.id} 
                  className="flex items-center justify-between p-3 rounded-md bg-secondary/50 border border-border"
                >
                  <div>
                    <div className="font-medium text-sm flex items-center gap-2">
                      {loc.name}
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider font-mono ${
                        loc.recommendation === 'expand' ? 'bg-green-500/20 text-green-500' :
                        loc.recommendation === 'watch' ? 'bg-amber-500/20 text-amber-500' :
                        'bg-blue-500/20 text-blue-500'
                      }`}>
                        {loc.recommendation}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono mt-1">{loc.city}, {loc.state}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-bold font-mono ${
                      loc.overallScore >= 70 ? 'text-green-500' :
                      loc.overallScore >= 40 ? 'text-amber-500' : 'text-red-500'
                    }`}>
                      {loc.overallScore}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono uppercase">Score</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-mono text-sm tracking-widest text-muted-foreground uppercase">Score Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreDistribution}>
                <XAxis dataKey="range" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {scoreDistribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={
                      entry.range.startsWith("7") || entry.range.startsWith("8") || entry.range.startsWith("9") ? "hsl(var(--chart-3))" :
                      entry.range.startsWith("4") || entry.range.startsWith("5") || entry.range.startsWith("6") ? "hsl(var(--chart-4))" :
                      "hsl(var(--chart-5))"
                    } />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, subValue, trend }: { title: string, value: string | number, icon: any, subValue?: string, trend?: "positive" | "negative" | "neutral" }) {
  return (
    <Card className="bg-card border-border overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Icon className="h-16 w-16" />
      </div>
      <CardHeader className="pb-2">
        <CardDescription className="font-mono text-xs uppercase tracking-wider">{title}</CardDescription>
        <CardTitle className="text-3xl font-mono">{value}</CardTitle>
      </CardHeader>
      {(subValue || trend) && (
        <CardContent>
          <div className={`text-xs font-mono ${trend === 'positive' ? 'text-green-500' : trend === 'negative' ? 'text-red-500' : 'text-muted-foreground'}`}>
            {subValue || (trend === 'positive' ? 'ON TRACK' : '')}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
