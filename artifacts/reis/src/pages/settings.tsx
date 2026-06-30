import React, { useState } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Moon, Sun, Palette, Globe, Bell, Shield, Info } from "lucide-react";

export default function SettingsPage() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));

  const toggleDark = () => {
    setDark(d => {
      document.documentElement.classList.toggle("dark", !d);
      return !d;
    });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Platform configuration and preferences</p>
      </div>

      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-card-border rounded-[20px] p-5 card-float">
        <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <Palette className="h-4 w-4 text-primary" />
          Appearance
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-foreground">Theme</div>
              <div className="text-xs text-muted-foreground">Toggle between light and dark mode</div>
            </div>
            <button
              onClick={toggleDark}
              className={`relative w-14 h-7 rounded-full transition-colors ${dark ? "bg-primary" : "bg-muted"}`}
            >
              <motion.div
                className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md flex items-center justify-center"
                animate={{ left: dark ? 30 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {dark ? <Moon className="h-3 w-3 text-primary" /> : <Sun className="h-3 w-3 text-amber-500" />}
              </motion.div>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Platform */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-card border border-card-border rounded-[20px] p-5 card-float">
        <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <Globe className="h-4 w-4 text-primary" />
          Platform
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-foreground">Language</div>
              <div className="text-xs text-muted-foreground">Display language</div>
            </div>
            <select className="px-3 py-1.5 rounded-xl bg-muted/60 border border-border text-sm text-foreground">
              <option>English</option>
              <option>Hindi</option>
              <option>Malayalam</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-foreground">Currency</div>
              <div className="text-xs text-muted-foreground">Default currency for financial models</div>
            </div>
            <select className="px-3 py-1.5 rounded-xl bg-muted/60 border border-border text-sm text-foreground">
              <option>₹ INR</option>
              <option>$ USD</option>
              <option>€ EUR</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* About */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-card border border-card-border rounded-[20px] p-5 card-float">
        <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <Info className="h-4 w-4 text-primary" />
          About ARIP
        </h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>Platform</span>
            <span className="text-foreground font-medium">Autonomous Retail Intelligence Platform</span>
          </div>
          <div className="flex justify-between">
            <span>Version</span>
            <span className="text-foreground font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span>AI Engine</span>
            <span className="text-foreground font-medium">Gemini 2.5 Flash</span>
          </div>
          <div className="flex justify-between">
            <span>Agents</span>
            <span className="text-foreground font-medium">9 Autonomous Agents</span>
          </div>
          <div className="flex justify-between">
            <span>Database</span>
            <span className="text-foreground font-medium">Supabase (PostgreSQL)</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
