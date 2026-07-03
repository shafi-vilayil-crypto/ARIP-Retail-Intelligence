import React from "react";
import { Link } from "wouter";
import { ArrowRight, BarChart3, Globe, Shield, Sparkles, Zap, MapPin, Truck, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  const industries = [
    { name: "Supermarkets", desc: "Optimize fresh food waste & inventory replenishment.", icon: Globe },
    { name: "QSR Chains", desc: "Site selection mapping based on target youth density.", icon: Sparkles },
    { name: "Beverage Chains", desc: "Identify supply chain routes & direct logistics.", icon: Zap },
    { name: "Convenience Stores", desc: "Track competitor density and local demographics.", icon: MapPin },
    { name: "Pharmacy Chains", desc: "Optimize medicine stock health and supply route.", icon: Shield },
    { name: "Fashion Retail", desc: "Forecast demand patterns and optimize collection cycles.", icon: Truck }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground gradient-landing flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/60 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
            <Zap className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-foreground tracking-tight">Retail Intelligence Platform</div>
            <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Enterprise OS</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-sm cursor-pointer">Sign In</Button>
          </Link>
          <Link href="/register">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm cursor-pointer shadow-md rounded-xl px-5">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center max-w-5xl mx-auto z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 animate-pulse">
          <Sparkles className="h-3.5 w-3.5" />
          Next-Gen AI Retail OS
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gradient-primary leading-[1.15] mb-6">
          The Enterprise Operating System <br /> for Retail Intelligence.
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mb-10 leading-relaxed">
          Autonomously analyze, optimize, and scale your retail expansion anywhere in India. Stop relying on basic dashboards. Use an AI-native GIS and Operations platform.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Link href="/register">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl px-8 shadow-lg text-base cursor-pointer">
              Launch Setup Wizard <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="rounded-2xl px-8 text-base cursor-pointer">
              Demo Access
            </Button>
          </Link>
        </div>

        {/* Studio Cards Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full text-left mb-24">
          {[
            {
              id: "market",
              title: "Market Intelligence",
              desc: "Identify high-potential expansion sites using demography, income, and rival maps.",
              icon: Globe,
              color: "text-blue-500 bg-blue-500/10",
              accent: "border-blue-500/20"
            },
            {
              id: "operations",
              title: "Operations Intelligence",
              desc: "Forecast demand patterns and optimize distribution routes between stores.",
              icon: Zap,
              color: "text-emerald-500 bg-emerald-500/10",
              accent: "border-emerald-500/20"
            },
            {
              id: "executive",
              title: "Executive Intelligence",
              desc: "Simulate financial scenarios, track regional KPIs, and generate reports.",
              icon: BarChart3,
              color: "text-amber-500 bg-amber-500/10",
              accent: "border-amber-500/20"
            },
            {
              id: "research",
              title: "AI Research Studio",
              desc: "Autonomously crawl news, social listening, and geo-data streams to monitor competition.",
              icon: Sparkles,
              color: "text-violet-500 bg-violet-500/10",
              accent: "border-violet-500/20"
            }
          ].map((studio) => (
            <Card key={studio.id} className={`bg-card/75 backdrop-blur-md border ${studio.accent} elevation-2 hover:translate-y-[-4px] transition-transform`}>
              <CardContent className="p-6">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${studio.color}`}>
                  <studio.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">{studio.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{studio.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Industry Focus Grid */}
        <div className="w-full text-left border-t border-border/60 pt-20">
          <h2 className="text-3xl font-bold mb-12 text-center text-foreground">Built for Any Retail Concept</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {industries.map((ind, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-muted/40 transition-colors">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <ind.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-foreground mb-1">{ind.name}</h4>
                  <p className="text-sm text-muted-foreground leading-normal">{ind.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 py-8 text-center text-xs text-muted-foreground bg-background/80 mt-auto z-10">
        <p>© 2026 Retail Intelligence Platform. Enterprise Multi-Tenant Operating System. All rights reserved.</p>
      </footer>
    </div>
  );
}
