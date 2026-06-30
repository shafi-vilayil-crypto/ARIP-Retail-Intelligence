import { useState } from "react";
import { Link } from "wouter";
import { useListLocations, useDeleteLocation, getListLocationsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, Trash2, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const STATES = ["Kerala", "Karnataka", "Tamil Nadu", "Maharashtra", "Goa"];
const STATUSES = ["candidate", "shortlisted", "approved", "rejected"];

function scoreColor(score: number) {
  if (score >= 70) return "text-green-400";
  if (score >= 40) return "text-amber-400";
  return "text-red-400";
}

function recBadgeVariant(rec: string): "default" | "secondary" | "destructive" | "outline" {
  if (rec === "expand") return "default";
  if (rec === "watch") return "secondary";
  if (rec === "avoid") return "destructive";
  return "outline";
}

export default function Locations() {
  const qc = useQueryClient();
  const [state, setState] = useState<string>("");
  const [city, setCity] = useState("");
  const [status, setStatus] = useState<string>("");
  const [minScore, setMinScore] = useState("");

  const params = {
    state: state || undefined,
    city: city || undefined,
    status: status || undefined,
    minScore: minScore ? Number(minScore) : undefined,
  };

  const { data: locationsRaw, isLoading } = useListLocations(params);
  const locations = Array.isArray(locationsRaw) ? locationsRaw : [];
  const deleteMut = useDeleteLocation({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListLocationsQueryKey() }) } });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold font-mono tracking-tight">LOCATION EXPLORER</h1>
          <p className="text-muted-foreground text-sm font-mono mt-1">
            {locations?.length ?? 0} candidate sites analyzed
          </p>
        </div>
        <Link href="/locations/new">
          <Button data-testid="button-add-location" className="gap-2">
            <Plus className="h-4 w-4" /> Add Location
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[160px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                data-testid="input-filter-city"
                placeholder="Filter by city..."
                className="pl-8"
                value={city}
                onChange={e => setCity(e.target.value)}
              />
            </div>
            <Select value={state} onValueChange={setState}>
              <SelectTrigger data-testid="select-filter-state" className="w-[160px]">
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">All States</SelectItem>
                {STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger data-testid="select-filter-status" className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">All Statuses</SelectItem>
                {STATUSES.map(s => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input
              data-testid="input-filter-minscore"
              placeholder="Min score"
              className="w-[120px]"
              type="number"
              min="0"
              max="100"
              value={minScore}
              onChange={e => setMinScore(e.target.value)}
            />
            <Button variant="ghost" onClick={() => { setState(""); setCity(""); setStatus(""); setMinScore(""); }}>
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
        </div>
      ) : (
        <div className="space-y-2">
          {locations?.length === 0 && (
            <Card><CardContent className="py-12 text-center text-muted-foreground font-mono">No locations found. Add your first candidate site.</CardContent></Card>
          )}
          {locations?.map((loc, i) => (
            <motion.div
              key={loc.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className="hover:border-primary/40 transition-colors">
                <CardContent className="py-3 px-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium" data-testid={`text-location-name-${loc.id}`}>{loc.name}</span>
                        <Badge variant={recBadgeVariant(loc.recommendation)} className="text-[10px] font-mono uppercase">
                          {loc.recommendation}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] font-mono">
                          {loc.status}
                        </Badge>
                        <Badge variant="outline" className={`text-[10px] font-mono ${loc.riskLevel === "low" ? "border-green-500/40 text-green-400" : loc.riskLevel === "high" ? "border-red-500/40 text-red-400" : "border-amber-500/40 text-amber-400"}`}>
                          {loc.riskLevel} risk
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">{loc.city}, {loc.state}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                        <div className={`text-2xl font-bold font-mono ${scoreColor(loc.overallScore)}`} data-testid={`text-score-${loc.id}`}>
                          {loc.overallScore.toFixed(1)}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono uppercase">Overall</div>
                      </div>
                      <div className="flex gap-1">
                        <Link href={`/locations/${loc.id}`}>
                          <Button variant="ghost" size="icon" data-testid={`button-view-location-${loc.id}`}>
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          data-testid={`button-delete-location-${loc.id}`}
                          disabled={deleteMut.isPending}
                          onClick={() => deleteMut.mutate({ id: loc.id })}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
