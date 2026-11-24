"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { Button } from "@/components/ui/Button";
import { Mail, MessageSquare, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-nova-midnight text-nova-softWhite flex flex-col justify-between">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full flex-1">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Contact Support & Sales</h1>
          <p className="text-sm text-nova-muted mt-2">
            Have questions about enterprise deployment, academic licensing, or custom templates?
          </p>
        </div>

        {submitted ? (
          <div className="p-8 rounded-3xl bg-nova-surface border border-nova-border text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h2 className="text-xl font-bold">Message Received</h2>
            <p className="text-xs text-nova-muted">
              Thank you for reaching out. Our engineering and support team will respond to {email} within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-nova-surface/80 rounded-3xl border border-nova-border p-8 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-nova-muted mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Alex Rivera"
                className="w-full p-3 rounded-xl bg-nova-midnight border border-nova-border text-sm text-nova-softWhite focus:border-nova-cyan focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-nova-muted mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@enterprise.com"
                className="w-full p-3 rounded-xl bg-nova-midnight border border-nova-border text-sm text-nova-softWhite focus:border-nova-cyan focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-nova-muted mb-1.5">
                Message / Inquiry
              </label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Details about your team requirements, custom template styles, or API integration..."
                className="w-full p-3 rounded-xl bg-nova-midnight border border-nova-border text-sm text-nova-softWhite focus:border-nova-cyan focus:outline-none"
              />
            </div>

            <Button type="submit" variant="cyan" size="lg" className="w-full font-bold gap-2">
              <Send className="w-4 h-4" />
              Send Inquiry
            </Button>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}
