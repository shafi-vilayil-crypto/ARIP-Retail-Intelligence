import { useState } from "react";
import {
  useListCompetitors, useCreateCompetitor, useDeleteCompetitor,
  getListCompetitorsQueryKey, useGetCompetitorHeatmap
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Star } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { motion } from "framer-motion";

const COMPETITOR_TYPES = [
  "milma_booth", "juice_shop", "tea_shop", "bubble_tea", "cafe",
  "fresh_juice_chain", "ice_cream_chain", "convenience_store", "mall_food_court", "petrol_station", "other"
];

const formSchema = z.object({
  name: z.string().min(1),
  brand: z.string().optional(),
  type: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  priceRange: z.string().optional(),
  avgRating: z.coerce.number().min(0).max(5).optional(),
  deliveryAvailable: z.boolean().optional(),
});

function typeColor(type: string) {
  const map: Record<string, string> = {
    milma_booth: "bg-blue-500/20 text-blue-400",
    juice_shop: "bg-green-500/20 text-green-400",
    cafe: "bg-amber-500/20 text-amber-400",
    bubble_tea: "bg-purple-500/20 text-purple-400",
    tea_shop: "bg-orange-500/20 text-orange-400",
  };
  return map[type] ?? "bg-muted text-muted-foreground";
}

export default function Competitors() {
  const qc = useQueryClient();
  const [filterType, setFilterType] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [open, setOpen] = useState(false);

  const { data: competitorsRaw, isLoading } = useListCompetitors({
    type: filterType || undefined,
    city: filterCity || undefined,
  });
  const competitors = Array.isArray(competitorsRaw) ? competitorsRaw : [];
  const { data: heatmapRaw } = useGetCompetitorHeatmap();
  const heatmap = Array.isArray(heatmapRaw) ? heatmapRaw : [];
  const createMut = useCreateCompetitor({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListCompetitorsQueryKey() });
        setOpen(false);
        form.reset();
      }
    }
  });
  const deleteMut = useDeleteCompetitor({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListCompetitorsQueryKey() }) } });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", brand: "", type: "", city: "", state: "", priceRange: "" },
  });

  function onSubmit(vals: z.infer<typeof formSchema>) {
    createMut.mutate({ data: { name: vals.name, brand: vals.brand, type: vals.type, city: vals.city, state: vals.state, priceRange: vals.priceRange, avgRating: vals.avgRating, deliveryAvailable: vals.deliveryAvailable } });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold font-mono tracking-tight">COMPETITION INTELLIGENCE</h1>
          <p className="text-muted-foreground text-sm font-mono mt-1">{competitors?.length ?? 0} competitors tracked</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-competitor" className="gap-2">
              <Plus className="h-4 w-4" /> Add Competitor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-mono">Add Competitor</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Name</FormLabel><FormControl><Input data-testid="input-competitor-name" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="brand" render={({ field }) => (
                    <FormItem><FormLabel>Brand</FormLabel><FormControl><Input data-testid="input-competitor-brand" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="type" render={({ field }) => (
                    <FormItem><FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger data-testid="select-competitor-type"><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                        <SelectContent>{COMPETITOR_TYPES.map(t => <SelectItem key={t} value={t}>{t.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
                      </Select><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="priceRange" render={({ field }) => (
                    <FormItem><FormLabel>Price Range</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger data-testid="select-price-range"><SelectValue placeholder="Select range" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="budget">Budget</SelectItem>
                          <SelectItem value="mid">Mid</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                        </SelectContent>
                      </Select><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem><FormLabel>City</FormLabel><FormControl><Input data-testid="input-competitor-city" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="state" render={({ field }) => (
                    <FormItem><FormLabel>State</FormLabel><FormControl><Input data-testid="input-competitor-state" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <Button type="submit" disabled={createMut.isPending} className="w-full" data-testid="button-submit-competitor">
                  {createMut.isPending ? "Adding..." : "Add Competitor"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {heatmap && heatmap.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="font-mono text-sm uppercase tracking-widest text-muted-foreground">Competitor Density by City</CardTitle></CardHeader>
          <CardContent className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={heatmap.slice(0, 12)} layout="vertical">
                <XAxis type="number" stroke="#888" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="city" stroke="#888" fontSize={11} tickLine={false} axisLine={false} width={100} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))" }} />
                <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-4">
          <div className="flex gap-3">
            <Input data-testid="input-filter-city" placeholder="Filter by city..." value={filterCity} onChange={e => setFilterCity(e.target.value)} className="max-w-[200px]" />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger data-testid="select-filter-type" className="w-[200px]">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">All Types</SelectItem>
                {COMPETITOR_TYPES.map(t => <SelectItem key={t} value={t}>{t.replace(/_/g, " ")}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="ghost" onClick={() => { setFilterType(""); setFilterCity(""); }}>Clear</Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
      ) : (
        <div className="space-y-2">
          {competitors?.length === 0 && (
            <Card><CardContent className="py-10 text-center text-muted-foreground font-mono">No competitors found.</CardContent></Card>
          )}
          {competitors?.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="hover:border-primary/30 transition-colors">
                <CardContent className="py-3 px-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium" data-testid={`text-competitor-name-${c.id}`}>{c.name}</span>
                        {c.brand && <span className="text-xs text-muted-foreground">({c.brand})</span>}
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono uppercase ${typeColor(c.type)}`}>{c.type.replace(/_/g, " ")}</span>
                        {c.priceRange && <Badge variant="outline" className="text-[10px] font-mono">{c.priceRange}</Badge>}
                        {c.deliveryAvailable && <Badge variant="outline" className="text-[10px] font-mono border-green-500/30 text-green-400">delivery</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">{c.city}, {c.state}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      {c.avgRating != null && (
                        <div className="flex items-center gap-1 text-amber-400 text-sm font-mono">
                          <Star className="h-3 w-3 fill-current" />
                          {c.avgRating.toFixed(1)}
                          {c.reviewCount != null && <span className="text-muted-foreground text-xs">({c.reviewCount})</span>}
                        </div>
                      )}
                      <Button variant="ghost" size="icon" data-testid={`button-delete-competitor-${c.id}`} onClick={() => deleteMut.mutate({ id: c.id })}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
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
