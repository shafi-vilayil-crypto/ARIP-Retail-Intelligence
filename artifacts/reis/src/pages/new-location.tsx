import { useLocation } from "wouter";
import { useCreateLocation, getListLocationsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana",
  "Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur",
  "Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Puducherry","Jammu and Kashmir","Ladakh"
];

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  address: z.string().optional(),
  state: z.string().min(1, "State is required"),
  district: z.string().optional(),
  city: z.string().min(1, "City is required"),
  ward: z.string().optional(),
  microMarket: z.string().optional(),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  population: z.coerce.number().optional(),
  populationDensity: z.coerce.number().optional(),
  avgMonthlyIncome: z.coerce.number().optional(),
  footfallPerDay: z.coerce.number().optional(),
  deliveryDemandScore: z.coerce.number().min(0).max(100).optional(),
  roadAccess: z.boolean().default(false),
  parkingAvailable: z.boolean().default(false),
  publicTransport: z.boolean().default(false),
  rentalCostPerSqft: z.coerce.number().optional(),
  notes: z.string().optional(),
});

export default function NewLocation() {
  const [, navigate] = useLocation();
  const qc = useQueryClient();

  const createMut = useCreateLocation({
    mutation: {
      onSuccess: (loc) => {
        qc.invalidateQueries({ queryKey: getListLocationsQueryKey() });
        navigate(`/locations/${loc.id}`);
      }
    }
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "", address: "", state: "", district: "", city: "",
      ward: "", microMarket: "", latitude: 0, longitude: 0,
      roadAccess: false, parkingAvailable: false, publicTransport: false, notes: "",
    },
  });

  function onSubmit(vals: z.infer<typeof schema>) {
    createMut.mutate({ data: vals });
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/locations">
          <Button variant="ghost" size="icon" data-testid="button-back"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-mono tracking-tight">ADD LOCATION</h1>
          <p className="text-muted-foreground text-sm font-mono">Register a new candidate site for analysis</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          <Card>
            <CardHeader><CardTitle className="font-mono text-sm uppercase tracking-widest text-muted-foreground">Basic Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Location Name *</FormLabel><FormControl><Input data-testid="input-location-name" placeholder="MG Road Junction" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="address" render={({ field }) => (
                <FormItem><FormLabel>Full Address</FormLabel><FormControl><Input data-testid="input-location-address" placeholder="Street address..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="state" render={({ field }) => (
                  <FormItem><FormLabel>State *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger data-testid="select-state"><SelectValue placeholder="Select state" /></SelectTrigger></FormControl>
                      <SelectContent className="max-h-64">{INDIAN_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="city" render={({ field }) => (
                  <FormItem><FormLabel>City *</FormLabel><FormControl><Input data-testid="input-city" placeholder="Kochi" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="district" render={({ field }) => (
                  <FormItem><FormLabel>District</FormLabel><FormControl><Input data-testid="input-district" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="ward" render={({ field }) => (
                  <FormItem><FormLabel>Ward / Area</FormLabel><FormControl><Input data-testid="input-ward" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="latitude" render={({ field }) => (
                  <FormItem><FormLabel>Latitude *</FormLabel><FormControl><Input data-testid="input-latitude" type="number" step="0.0001" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="longitude" render={({ field }) => (
                  <FormItem><FormLabel>Longitude *</FormLabel><FormControl><Input data-testid="input-longitude" type="number" step="0.0001" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="font-mono text-sm uppercase tracking-widest text-muted-foreground">Demand Inputs</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="population" render={({ field }) => (
                  <FormItem><FormLabel>Local Population</FormLabel><FormControl><Input data-testid="input-population" type="number" placeholder="350000" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="populationDensity" render={({ field }) => (
                  <FormItem><FormLabel>Density (per km²)</FormLabel><FormControl><Input data-testid="input-pop-density" type="number" placeholder="8200" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="avgMonthlyIncome" render={({ field }) => (
                  <FormItem><FormLabel>Avg Monthly Income (₹)</FormLabel><FormControl><Input data-testid="input-income" type="number" placeholder="72000" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="footfallPerDay" render={({ field }) => (
                  <FormItem><FormLabel>Est. Daily Footfall</FormLabel><FormControl><Input data-testid="input-footfall" type="number" placeholder="4200" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="deliveryDemandScore" render={({ field }) => (
                  <FormItem><FormLabel>Delivery Demand (0-100)</FormLabel><FormControl><Input data-testid="input-delivery-score" type="number" min="0" max="100" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="rentalCostPerSqft" render={({ field }) => (
                  <FormItem><FormLabel>Rental Cost (₹/sqft/mo)</FormLabel><FormControl><Input data-testid="input-rental" type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <div className="flex gap-6">
                {[
                  { name: "roadAccess" as const, label: "Road Access" },
                  { name: "parkingAvailable" as const, label: "Parking Available" },
                  { name: "publicTransport" as const, label: "Public Transport" },
                ].map(item => (
                  <FormField key={item.name} control={form.control} name={item.name} render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormControl><Checkbox data-testid={`checkbox-${item.name}`} checked={!!field.value} onCheckedChange={field.onChange} /></FormControl>
                      <FormLabel className="font-normal text-sm">{item.label}</FormLabel>
                    </FormItem>
                  )} />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="font-mono text-sm uppercase tracking-widest text-muted-foreground">Notes</CardTitle></CardHeader>
            <CardContent>
              <FormField control={form.control} name="notes" render={({ field }) => (
                <FormItem><FormControl>
                  <textarea
                    data-testid="textarea-notes"
                    placeholder="Any additional context about this location..."
                    className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                    {...field}
                  />
                </FormControl><FormMessage /></FormItem>
              )} />
            </CardContent>
          </Card>

          <Button type="submit" disabled={createMut.isPending} className="w-full" data-testid="button-submit-location">
            {createMut.isPending ? "Adding Location..." : "Add & Analyze Location"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
