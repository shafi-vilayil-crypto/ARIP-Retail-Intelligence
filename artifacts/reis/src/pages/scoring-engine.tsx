import { useGetScoringWeights, useUpdateScoringWeights, getGetScoringWeightsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { Save, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WEIGHT_FIELDS = [
  { key: "populationDensity", label: "Population Density", desc: "Weight given to how densely populated the area is — higher density means more potential customers per sqft." },
  { key: "youngPopulation", label: "Young Population (15-35)", desc: "Proportion of the target demographic aged 15-35 who are primary beverage consumers." },
  { key: "officeDensity", label: "Office / IT Density", desc: "Concentration of office buildings and IT parks that drive daytime demand for beverages." },
  { key: "studentDensity", label: "Student Density", desc: "Presence of colleges, universities, and hostels driving high-volume, price-sensitive demand." },
  { key: "deliveryDemand", label: "Online Delivery Demand", desc: "Readiness for Swiggy/Zomato/Blinkit delivery — apartment density, dark store suitability, digital ordering behavior." },
  { key: "commercialActivity", label: "Commercial Activity", desc: "Level of retail and commercial development in the area — malls, markets, high streets." },
  { key: "competitionGap", label: "Competition Gap", desc: "Inverse of competitor density — higher gap means less saturation and more market opportunity." },
  { key: "accessibility", label: "Accessibility", desc: "Quality of road access, parking, public transport, walkability score." },
  { key: "rentalAffordability", label: "Rental Affordability", desc: "Rental cost relative to expected revenue — lower rent improves unit economics." },
  { key: "tourism", label: "Tourism", desc: "Tourist footfall from airports, heritage sites, beaches, and attractions." },
  { key: "nightlife", label: "Nightlife / Evening Crowd", desc: "Evening and night economy activity — restaurants, pubs, entertainment venues nearby." },
  { key: "income", label: "Average Income", desc: "Disposable income level of the local population — proxy for willingness to pay." },
  { key: "growthProjection", label: "Growth Projection", desc: "Future growth trajectory of the area — upcoming infra, real estate development, population influx." },
];

export default function ScoringEngine() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: weights, isLoading } = useGetScoringWeights();
  const updateMut = useUpdateScoringWeights({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getGetScoringWeightsQueryKey() });
        toast({ title: "Weights saved", description: "AI scoring model updated successfully." });
      }
    }
  });

  const [local, setLocal] = useState<Record<string, number>>({});

  useEffect(() => {
    if (weights) {
      const vals: Record<string, number> = {};
      WEIGHT_FIELDS.forEach(f => { vals[f.key] = (weights as Record<string, number>)[f.key] ?? 0; });
      setLocal(vals);
    }
  }, [weights]);

  const total = Object.values(local).reduce((a, b) => a + b, 0);
  const isValid = Math.abs(total - 100) < 0.1;

  function handleSave() {
    updateMut.mutate({ data: local });
  }

  if (isLoading) return <div className="space-y-4">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold font-mono tracking-tight">AI SCORING ENGINE</h1>
          <p className="text-muted-foreground text-sm font-mono mt-1">Configure the weighted scoring model for expansion decisions</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`font-mono text-sm px-3 py-1 rounded border ${isValid ? "border-green-500/40 text-green-400 bg-green-500/10" : "border-red-500/40 text-red-400 bg-red-500/10"}`}>
            Total: {total.toFixed(1)}% {isValid ? "✓" : "(must = 100%)"}
          </div>
          <Button data-testid="button-save-weights" disabled={!isValid || updateMut.isPending} onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            {updateMut.isPending ? "Saving..." : "Save Weights"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {WEIGHT_FIELDS.map((field) => (
          <Card key={field.key} className="hover:border-primary/30 transition-colors">
            <CardContent className="py-4 px-5">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-medium text-sm font-mono">{field.label}</div>
                  <CardDescription className="text-xs mt-0.5 leading-relaxed">{field.desc}</CardDescription>
                </div>
                <div className="text-2xl font-bold font-mono text-primary ml-4 shrink-0">
                  {(local[field.key] ?? 0).toFixed(0)}%
                </div>
              </div>
              <Slider
                data-testid={`slider-${field.key}`}
                min={0}
                max={30}
                step={1}
                value={[local[field.key] ?? 0]}
                onValueChange={([v]) => setLocal(prev => ({ ...prev, [field.key]: v }))}
                className="mt-3"
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
