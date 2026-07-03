import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ExpansionTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="e-timeline">Expansion Timeline</Label>
          <Input id="e-timeline" defaultValue="3 Years" className="rounded-xl" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="e-budget">Investment Budget Limit</Label>
          <Input id="e-budget" defaultValue="₹120 Crore" className="rounded-xl" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="e-size">Preferred Outlet Size</Label>
          <Input id="e-size" defaultValue="3000-5000 sq ft" className="rounded-xl" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="e-segment">Customer Segment Focus</Label>
          <Input id="e-segment" defaultValue="Middle Income Urban Families" className="rounded-xl" />
        </div>
      </div>
      <Button className="bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl cursor-pointer">
        Save Expansion Goals
      </Button>
    </div>
  );
}
