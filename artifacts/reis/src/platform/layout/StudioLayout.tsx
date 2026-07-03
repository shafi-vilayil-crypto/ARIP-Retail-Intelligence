import React from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Play, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StudioLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  studioColor: string;
  studioId: string;
}

export default function StudioLayout({ children, title, description, studioColor, studioId }: StudioLayoutProps) {
  const [, setLocation] = useLocation();

  return (
    <div className="space-y-6">
      {/* Studio Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border p-6 shadow-md bg-card">
        <div
          className="absolute top-0 left-0 bottom-0 w-2"
          style={{ backgroundColor: studioColor }}
        />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pl-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                Studio Workspace
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] text-emerald-500 font-bold">Online</span>
            </div>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">{title}</h1>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation("/app")}
              className="rounded-xl flex gap-1.5 items-center cursor-pointer text-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
            </Button>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl flex gap-1.5 items-center cursor-pointer text-xs shadow-sm"
              style={{ backgroundColor: studioColor }}
            >
              <Play className="h-3.5 w-3.5 fill-current" /> Run Diagnostics
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {children}
      </div>
    </div>
  );
}
