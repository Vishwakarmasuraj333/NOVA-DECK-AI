import React from "react";
import Link from "next/link";
import { NovaLogo } from "@/components/brand/NovaLogo";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-nova-border/60 bg-nova-midnight pt-16 pb-12 text-nova-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-nova-border/50">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <NovaLogo size="md" variant="glow" />
            <p className="text-sm leading-relaxed max-w-sm text-nova-muted/90">
              NOVA DECK AI empowers founders, scholars, enterprise executives, and creators to transform raw concepts and research documents into cinematic, publication-ready presentations in seconds.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-nova-darkMuted">
              <span>Engineered with Google Gemini 1.5</span>
              <span>•</span>
              <span>Full Export Pipeline</span>
            </div>
          </div>

          {/* Column 1: Product */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-nova-softWhite">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/create" className="hover:text-nova-cyan transition-colors">
                  AI Generator
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-nova-cyan transition-colors">
                  28+ Templates
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-nova-cyan transition-colors">
                  Pricing & Plans
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-nova-cyan transition-colors">
                  Workspace
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Legal & Trust */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-nova-softWhite">Trust & Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-nova-magenta transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-nova-magenta transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-nova-magenta transition-colors">
                  Security & Compliance
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-nova-magenta transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Templates */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-nova-softWhite">Popular Styles</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/templates/virtual-reality-lab" className="hover:text-nova-softWhite transition-colors">
                  Virtual Reality Lab
                </Link>
              </li>
              <li>
                <Link href="/templates/msc-it-viva" className="hover:text-nova-softWhite transition-colors">
                  MSc IT Viva Defense
                </Link>
              </li>
              <li>
                <Link href="/templates/startup-pitch-deck" className="hover:text-nova-softWhite transition-colors">
                  Startup Pitch Deck
                </Link>
              </li>
              <li>
                <Link href="/templates/cybersecurity" className="hover:text-nova-softWhite transition-colors">
                  Cybersecurity SOC
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-nova-darkMuted gap-4">
          <p>© {new Date().getFullYear()} NOVA DECK AI Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-nova-muted">Privacy</Link>
            <Link href="/terms" className="hover:text-nova-muted">Terms</Link>
            <Link href="/contact" className="hover:text-nova-muted">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
