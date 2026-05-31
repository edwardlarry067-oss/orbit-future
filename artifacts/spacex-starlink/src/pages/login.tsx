import React, { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Satellite, Mail, Lock } from "lucide-react";

export default function Login() {
  const { login, register } = useAuth();
  const [, navigate] = useLocation();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const redirect = urlParams.get("redirect") || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isRegister) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      navigate(redirect);
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 dark">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.05)_0%,transparent_70%)]" />
      <Card className="w-full max-w-md bg-background/80 backdrop-blur-xl border-border relative z-10">
        <CardHeader className="text-center pt-10 pb-6 border-b border-border/50">
          <div className="mx-auto w-14 h-14 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mb-4">
            <Satellite className="w-7 h-7 text-primary" />
          </div>
          <CardTitle className="text-xl font-bold uppercase tracking-widest text-white">
            {isRegister ? "Create Account" : "Sign In"}
          </CardTitle>
          <CardDescription className="text-xs uppercase tracking-widest">
            {isRegister ? "Join OrbitFuture" : "Access your portal"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8 px-8 pb-10">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="relative">
                <Input
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 bg-card"
                  required
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-card pl-10"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 bg-card pl-10"
                required
                minLength={6}
              />
            </div>
            {error && (
              <p className="text-destructive text-sm text-center">{error}</p>
            )}
            <Button type="submit" className="w-full h-12 uppercase tracking-widest font-bold" disabled={loading}>
              {loading ? "Please wait..." : isRegister ? "Create Account" : "Sign In"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => { setIsRegister(!isRegister); setError(""); }}
              className="text-xs text-gray-500 hover:text-primary transition-colors"
            >
              {isRegister ? "Already have an account? Sign in" : "New here? Create an account"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
