import { useState } from "react";
import { Link } from "wouter";
import {
  useListMarkets, useCreateMarket, useDeleteMarket,
  getListMarketsQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, MapPin, TrendingUp, Trash2, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const LEVELS = ["country", "state", "district", "city", "town", "ward", "micro_market"];
const INDIAN_STATES = ["Kerala", "Karnataka", "Tamil Nadu", "Maharashtra", "Goa", "Rajasthan", "Gujarat"];

const levelColor: Record<string, string> = {
  country: "bg-purple-500/20 text-purple-400",
  state: "bg-blue-500/20 text-blue-400",
  district: "bg-cyan-500/20 text-cyan-400",
  city: "bg-green-500/20 text-green-400",
  town: "bg-amber-500/20 text-amber-400",
  ward: "bg-orange-500/20 text-orange-400",
  micro_market: "bg-red-500/20 text-red-400",
};

const schema = z.object({
  name: z.string().min(1),
  level: z.string().min(1),
  state: z.string().min(1),
  district: z.string().optional(),
  city: z.string().optional(),
  population: z.coerce.number().optional(),
  avgIncome: z.coerce.number().optional(),
  growthRate: z.coerce.number().optional(),
});

export default function Markets() {
  const qc = useQueryClient();
  const [filterLevel, setFilterLevel] = useState("");
  const [open, setOpen] = useState(false);

  const { data: marketsRaw, isLoading } = useListMarkets({ level: filterLevel || undefined });
  const markets = Array.isArray(marketsRaw) ? marketsRaw : [];
  const deleteMut = useDeleteMarket({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListMarketsQueryKey() }) } });
  const createMut = useCreateMarket({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListMarketsQueryKey() });
        setOpen(false);
        form.reset();
      }
    }
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", level: "", state: "", district: "", city: "" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold font-mono tracking-tight">MARKET HIERARCHY</h1>
          <p className="text-muted-foreground text-sm font-mono mt-1">{markets?.length ?? 0} markets indexed</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-market" className="gap-2"><Plus className="h-4 w-4" /> Add Market</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-mono">Add Market</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(vals => createMut.mutate({ data: vals }))} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Name</FormLabel><FormControl><Input data-testid="input-market-name" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="level" render={({ field }) => (
                    <FormItem><FormLabel>Level</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger data-testid="select-market-level"><SelectValue placeholder="Select level" /></SelectTrigger></FormControl>
                        <SelectContent>{LEVELS.map(l => <SelectItem key={l} value={l}>{l.replace("_", " ")}</SelectItem>)}</SelectContent>
                      </Select><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="state" render={({ field }) => (
                    <FormItem><FormLabel>State</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger data-testid="select-market-state"><SelectValue placeholder="Select state" /></SelectTrigger></FormControl>
                        <SelectContent>{INDIAN_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                      </Select><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem><FormLabel>City</FormLabel><FormControl><Input data-testid="input-market-city" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="population" render={({ field }) => (
                    <FormItem><FormLabel>Population</FormLabel><FormControl><Input data-testid="input-market-pop" type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="growthRate" render={({ field }) => (
                    <FormItem><FormLabel>Growth Rate (%)</FormLabel><FormControl><Input data-testid="input-market-growth" type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <Button type="submit" disabled={createMut.isPending} className="w-full" data-testid="button-submit-market">
                  {createMut.isPending ? "Adding..." : "Add Market"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-4">
          <Select value={filterLevel} onValueChange={setFilterLevel}>
            <SelectTrigger data-testid="select-filter-level" className="w-[200px]">
              <SelectValue placeholder="Filter by level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">All Levels</SelectItem>
              {LEVELS.map(l => <SelectItem key={l} value={l}>{l.replace("_", " ")}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-2">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div>
      ) : (
        <div className="space-y-2">
          {markets?.length === 0 && (
            <Card><CardContent className="py-12 text-center text-muted-foreground font-mono">No markets found.</CardContent></Card>
          )}
          {markets?.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="hover:border-primary/30 transition-colors">
                <CardContent className="py-3 px-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium" data-testid={`text-market-name-${m.id}`}>{m.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono uppercase ${levelColor[m.level] ?? "bg-muted text-muted-foreground"}`}>{m.level.replace("_", " ")}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground font-mono">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{m.city ? `${m.city}, ` : ""}{m.state}</span>
                        <span>{m.locationCount} locations</span>
                        {m.avgScore != null && <span className="text-primary">{m.avgScore.toFixed(1)} avg score</span>}
                        {m.growthRate != null && <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3 text-green-400" />{(m.growthRate * 100).toFixed(1)}%</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Link href={`/markets/${m.id}`}>
                        <Button variant="ghost" size="icon" data-testid={`button-view-market-${m.id}`}><ExternalLink className="h-4 w-4" /></Button>
                      </Link>
                      <Button variant="ghost" size="icon" data-testid={`button-delete-market-${m.id}`} onClick={() => deleteMut.mutate({ id: m.id })}>
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
