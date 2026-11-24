"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NovaLogo } from "@/components/brand/NovaLogo";
import { Button } from "@/components/ui/Button";
import {
  LayoutDashboard,
  Presentation,
  LayoutGrid,
  Heart,
  Share2,
  Trash2,
  Sliders,
  CreditCard,
  BarChart2,
  Sparkles,
  LogOut,
  ShieldAlert,
  Menu,
  X,
  User,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const navItems = [
    { name: "All Presentations", href: "/dashboard", icon: Presentation },
    { name: "Browse Templates", href: "/templates", icon: LayoutGrid },
    { name: "Trash", href: "/dashboard/trash", icon: Trash2 },
    { name: "Usage & Limits", href: "/dashboard/usage", icon: BarChart2 },
    { name: "Billing & Plans", href: "/dashboard/billing", icon: CreditCard },
    { name: "Settings", href: "/dashboard/settings", icon: Sliders },
  ];

  return (
    <div className="min-h-screen bg-nova-midnight text-nova-softWhite flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className="w-64 border-r border-nova-border bg-nova-surface/70 backdrop-blur-xl hidden md:flex flex-col justify-between p-4 flex-shrink-0">
        <div className="space-y-6">
          {/* Logo */}
          <div className="px-2 pt-2">
            <Link href="/">
              <NovaLogo size="md" variant="glow" />
            </Link>
          </div>

          {/* Quick Create CTA */}
          <Link href="/create" className="block">
            <Button variant="cyan" size="md" className="w-full font-bold gap-2">
              <Sparkles className="w-4 h-4" />
              New Presentation
            </Button>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-nova-magenta/15 text-nova-softWhite border border-nova-magenta/40 font-bold"
                      : "text-nova-muted hover:text-nova-softWhite hover:bg-nova-surface"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-nova-magenta" : "text-nova-cyan"}`} />
                  {item.name}
                </Link>
              );
            })}

            {user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-nova-cyan hover:bg-nova-surface border border-nova-cyan/30 mt-4`}
              >
                <ShieldAlert className="w-4 h-4 text-nova-cyan" />
                Admin Console
              </Link>
            )}
          </nav>
        </div>

        {/* User profile card & logout */}
        <div className="p-3 rounded-2xl bg-nova-midnight/80 border border-nova-border flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-nova-magenta/20 border border-nova-magenta flex items-center justify-center text-xs font-bold text-nova-magenta flex-shrink-0">
              {user?.name?.slice(0, 1) || "U"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-nova-softWhite truncate">{user?.name || "Workspace Member"}</p>
              <p className="text-[10px] text-nova-muted truncate">{user?.email || "Signed In"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-nova-muted hover:text-red-400 hover:bg-nova-surface transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden border-b border-nova-border bg-nova-surface px-4 py-3 flex items-center justify-between">
        <Link href="/">
          <NovaLogo size="sm" variant="glow" />
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/create">
            <Button variant="cyan" size="sm" className="h-8 px-2.5 text-xs">
              + New
            </Button>
          </Link>
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-2 rounded-lg bg-nova-midnight border border-nova-border text-nova-muted"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileNavOpen && (
        <div className="md:hidden bg-nova-surface border-b border-nova-border p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileNavOpen(false)}
              className="flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold text-nova-softWhite hover:bg-nova-surfaceHover"
            >
              <item.icon className="w-4 h-4 text-nova-cyan" />
              {item.name}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold text-red-400 w-full text-left"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}

      {/* Main Content Pane */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
