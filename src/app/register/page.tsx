"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NovaLogo } from "@/components/brand/NovaLogo";
import { Button } from "@/components/ui/Button";
import { User, Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-nova-midnight text-nova-softWhite flex flex-col justify-center items-center p-4 sm:p-6 relative">
      <div className="absolute top-8 left-8">
        <Link href="/">
          <NovaLogo size="md" variant="glow" />
        </Link>
      </div>

      <div className="w-full max-w-md bg-nova-surface/80 backdrop-blur-xl rounded-3xl border border-nova-border p-8 sm:p-10 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-nova-softWhite">
            Create an Account
          </h1>
          <p className="text-xs text-nova-muted mt-1.5">
            Start creating cinematic presentations in seconds.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs mb-6 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-nova-muted mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-nova-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Jane Doe"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-nova-midnight border border-nova-border text-sm text-nova-softWhite placeholder-nova-muted/60 focus:border-nova-cyan focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-nova-muted mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-nova-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.edu"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-nova-midnight border border-nova-border text-sm text-nova-softWhite placeholder-nova-muted/60 focus:border-nova-cyan focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-nova-muted mb-1.5">
              Password (min. 6 characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-nova-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-nova-midnight border border-nova-border text-sm text-nova-softWhite placeholder-nova-muted/60 focus:border-nova-cyan focus:outline-none"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full font-bold mt-2"
          >
            Create Free Account
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </form>

        <div className="mt-8 text-center text-xs text-nova-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-nova-cyan hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
