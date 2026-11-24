"use client";

import React, { useState } from "react";
import Link from "next/link";
import { NovaLogo } from "@/components/brand/NovaLogo";
import { Button } from "@/components/ui/Button";
import { Mail, CheckCircle2, ArrowRight } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
          <h1 className="text-2xl font-extrabold text-nova-softWhite">
            Reset Password
          </h1>
          <p className="text-xs text-nova-muted mt-1.5">
            Enter your email to receive password reset instructions.
          </p>
        </div>

        {submitted ? (
          <div className="space-y-4 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <p className="text-xs text-nova-muted leading-relaxed">
              If an account exists for {email}, a recovery link has been dispatched.
            </p>
            <Link href="/login">
              <Button variant="secondary" className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="name@organization.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-nova-midnight border border-nova-border text-sm text-nova-softWhite placeholder-nova-muted/60 focus:border-nova-cyan focus:outline-none"
                />
              </div>
            </div>

            <Button type="submit" variant="cyan" size="lg" className="w-full font-bold">
              Send Reset Link
            </Button>
          </form>
        )}

        <div className="mt-8 text-center text-xs text-nova-muted">
          Remembered your password?{" "}
          <Link href="/login" className="font-bold text-nova-cyan hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
