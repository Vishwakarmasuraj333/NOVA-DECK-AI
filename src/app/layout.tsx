import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "NOVA DECK AI — Professional AI Presentation Studio",
  description:
    "Generate publication-ready presentations, pitch decks, and academic defenses with Google Gemini AI and 28+ cinematic visual design templates.",
  keywords: [
    "AI Presentation Generator",
    "PPTX Export",
    "Pitch Deck",
    "MSc IT Viva",
    "Slide Editor",
    "Executive Presentations",
  ],
  openGraph: {
    title: "NOVA DECK AI — Cinematic AI Presentation Studio",
    description: "Generate publication-grade decks from prompts and source documents.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased bg-nova-midnight text-nova-softWhite`}>
        {children}
      </body>
    </html>
  );
}
