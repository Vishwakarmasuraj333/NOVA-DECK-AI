"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NovaLogo } from "@/components/brand/NovaLogo";
import { Button } from "@/components/ui/Button";
import {
  Sparkles,
  LayoutGrid,
  CreditCard,
  User,
  LogOut,
  Menu,
  X,
  Sliders,
  ShieldAlert,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check session
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, [pathname]);

  const navLinks = [
    { name: "Templates", href: "/templates", icon: LayoutGrid },
    { name: "Pricing", href: "/pricing", icon: CreditCard },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-nova-midnight/85 backdrop-blur-xl border-b border-nova-border/70 py-3 shadow-lg"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center">
          <NovaLogo size="md" variant="glow" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-nova-surface/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-nova-border/60">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? "text-nova-softWhite bg-nova-surfaceHover shadow-sm border border-nova-borderLight/40"
                    : "text-nova-muted hover:text-nova-softWhite hover:bg-nova-surface/40"
                }`}
              >
                <Icon className="w-4 h-4 text-nova-cyan" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/create">
                <Button variant="cyan" size="sm" className="gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Create Deck
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="secondary" size="sm" className="gap-1.5">
                  <Sliders className="w-4 h-4 text-nova-cyan" />
                  Dashboard
                </Button>
              </Link>
              {user.role === "ADMIN" && (
                <Link href="/admin">
                  <Button variant="outline" size="sm" className="border-nova-magenta/50 text-nova-magenta hover:bg-nova-magenta/10">
                    <ShieldAlert className="w-4 h-4 mr-1" />
                    Admin
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/create">
                <Button variant="primary" size="sm" className="gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Generate Presentation
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-nova-muted hover:text-white bg-nova-surface border border-nova-border"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-nova-surface/95 backdrop-blur-2xl border-b border-nova-border p-6 mt-3 space-y-4">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl text-nova-softWhite hover:bg-nova-surfaceHover"
              >
                <link.icon className="w-5 h-5 text-nova-cyan" />
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-nova-border flex flex-col gap-2.5">
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" className="w-full">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/create" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full">
                    Create Presentation
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/create" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full">
                    Get Started Free
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
export default Navbar;
