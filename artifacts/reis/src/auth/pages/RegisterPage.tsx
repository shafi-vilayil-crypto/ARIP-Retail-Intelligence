import React, { useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuthStore } from "@/shared/stores/authStore";
import { Zap, Loader2, Sparkles, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function RegisterPage() {
  const [, setLocation] = useLocation();
  const { register, isLoading, error } = useAuthStore() as any;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!name || !email || !password || !companyName) {
      setFormError("All fields are required.");
      return;
    }
    try {
      await register(name, email, password);
      // Since it's a new company, let's redirect directly to onboarding wizard!
      setLocation("/onboarding");
    } catch (err: any) {
      setFormError(err.message || "Failed to register.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background gradient-landing">
      <Card className="w-full max-w-md bg-card/80 backdrop-blur-xl border border-border/80 shadow-2xl rounded-3xl p-4">
        <CardHeader className="flex flex-col items-center pb-2">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg mb-4">
            <Building2 className="h-6 w-6 text-white animate-pulse" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-center text-foreground">
            Create Enterprise Account
          </CardTitle>
          <CardDescription className="text-sm text-center text-muted-foreground">
            Register your company on the Retail Intelligence OS
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-sm font-medium">Company Name</Label>
              <Input
                id="companyName"
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. FreshMart India"
                className="rounded-xl py-3 border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Administrator Name</Label>
              <Input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Shafi Vilayil"
                className="rounded-xl py-3 border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Work Email</Label>
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
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
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
                  Register & Continue
                </>
              )}
            </Button>
          </form>

          <div className="text-center pt-2">
            <span className="text-xs text-muted-foreground">Already registered? </span>
            <Link href="/login">
              <span className="text-xs text-primary hover:underline cursor-pointer font-medium">Sign in</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
