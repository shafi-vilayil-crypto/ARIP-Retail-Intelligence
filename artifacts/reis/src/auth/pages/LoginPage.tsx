import React, { useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuthStore } from "@/shared/stores/authStore";
import { Zap, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { login, isLoading, error } = useAuthStore() as any; // Cast for custom fields if any
  const [email, setEmail] = useState("admin@retailiq.com");
  const [password, setPassword] = useState("password");
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    try {
      await login(email, password);
      setLocation("/companies");
    } catch (err: any) {
      setFormError(err.message || "Failed to log in.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background gradient-landing">
      <Card className="w-full max-w-md bg-card/80 backdrop-blur-xl border border-border/80 shadow-2xl rounded-3xl p-4">
        <CardHeader className="flex flex-col items-center pb-2">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg mb-4">
            <Zap className="h-6 w-6 text-white animate-pulse" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-center text-foreground">
            Sign in to RetailIQ
          </CardTitle>
          <CardDescription className="text-sm text-center text-muted-foreground">
            Enterprise Operating System for Retail Companies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="rounded-xl py-3 border-border"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="rounded-xl py-3 border-border"
              />
            </div>

            {(formError || error) && (
              <p className="text-xs text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                {formError || error}
              </p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/95 text-primary-foreground py-6 rounded-xl font-semibold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <div className="text-center pt-2">
            <span className="text-xs text-muted-foreground">Don't have an account? </span>
            <Link href="/register">
              <span className="text-xs text-primary hover:underline cursor-pointer font-medium">Register company</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
