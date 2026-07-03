import React, { useEffect, useRef } from "react";
import { useOnboardingStore } from "@/shared/stores/onboardingStore";
import { Loader2, Play, CheckCircle2, AlertTriangle, Terminal, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function AIInitializationStep() {
  const { aiStatus, aiProgress, aiLogs, startAIInit } = useOnboardingStore();
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [aiLogs]);

  return (
    <div className="space-y-6 text-center max-w-xl mx-auto py-4">
      <div className="flex flex-col items-center">
        <div className={`h-16 w-16 rounded-3xl flex items-center justify-center mb-4 ${
          aiStatus === "completed"
            ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-600"
            : aiStatus === "running"
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground"
        }`}>
          {aiStatus === "running" ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : aiStatus === "completed" ? (
            <CheckCircle2 className="h-8 w-8 animate-bounce" />
          ) : (
            <Sparkles className="h-8 w-8" />
          )}
        </div>
        <h3 className="text-xl font-bold text-foreground">AI Intelligence Initialization</h3>
        <p className="text-sm text-muted-foreground mt-1.5">
          Launch our 9-agent pipeline to automatically enrich, map relationships, and validate your profile.
        </p>
      </div>

      {aiStatus === "idle" && (
        <div className="py-6">
          <Button
            size="lg"
            onClick={startAIInit}
            className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-8 py-6 rounded-2xl shadow-lg cursor-pointer flex items-center justify-center gap-2 mx-auto ai-pulse"
          >
            <Play className="h-5 w-5 fill-current" />
            Initialize AI Operating System
          </Button>
        </div>
      )}

      {aiStatus !== "idle" && (
        <div className="space-y-4 text-left">
          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-muted-foreground">
              <span>{aiStatus === "completed" ? "Pipeline Completed" : "Agents Processing..."}</span>
              <span>{aiProgress}%</span>
            </div>
            <div className="w-full bg-muted h-3 rounded-full overflow-hidden border border-border/80 shadow-inner">
              <div
                className="bg-gradient-to-r from-blue-500 via-emerald-500 to-primary h-full rounded-full transition-all duration-300"
                style={{ width: `${aiProgress}%` }}
              />
            </div>
          </div>

          {/* Real-time agent console log */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
              <Terminal className="h-4 w-4" /> Agent System Logs
            </Label>
            <div
              ref={logContainerRef}
              className="bg-zinc-950 text-emerald-400 font-mono text-xs p-4 rounded-2xl border border-zinc-800 h-64 overflow-y-auto custom-scrollbar space-y-1.5 shadow-2xl"
            >
              {aiLogs.map((log, idx) => (
                <div key={idx} className="leading-relaxed whitespace-pre-wrap">
                  {log}
                </div>
              ))}
              {aiStatus === "running" && (
                <div className="flex items-center gap-1.5 text-zinc-500 mt-1 animate-pulse">
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-ping" />
                  <span>Crawl queue listener polling active...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
