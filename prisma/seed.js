const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const TEMPLATES = [
  {
    id: "tpl_vr_lab",
    slug: "virtual-reality-lab",
    name: "Virtual Reality Lab",
    description: "Cinematic neon magenta and cyan aesthetic crafted for immersive tech, metaverse, and spatial computing.",
    category: "Technology",
    tags: JSON.stringify(["VR", "Spatial", "Metaverse", "Neon", "Cyberpunk", "Cinematic"]),
    previewThumbnail: "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=800&q=80",
    isPremium: false,
    colorPalette: JSON.stringify({
      background: "#10091F",
      surface: "#1B1230",
      primary: "#E82DA8",
      accent: "#43D5E8",
      text: "#F8F5FF",
      muted: "#B7AEC9",
      border: "#2E224D",
    }),
    typography: JSON.stringify({
      headingFont: "font-display",
      bodyFont: "font-sans",
    }),
    supportedLayouts: JSON.stringify(["cover", "agenda", "stats", "chart", "diagram", "image_text", "conclusion"]),
    sampleSlides: JSON.stringify([
      { order: 1, title: "Spatial Immersion 2030", subtitle: "Next-Gen Neural Haptics", layoutType: "cover" },
      { order: 2, title: "Perception Architecture", subtitle: "Sub-4ms Latency", layoutType: "stats" },
    ]),
  },
  {
    id: "tpl_ai_tech",
    slug: "ai-technology",
    name: "AI Technology",
    description: "Futuristic editorial layouts with neural node motifs, deep cobalt surfaces, and electric gradients.",
    category: "Technology",
    tags: JSON.stringify(["AI", "Deep Learning", "Generative AI", "Future"]),
    previewThumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    isPremium: false,
    colorPalette: JSON.stringify({
      background: "#0A0D1A",
      surface: "#12182B",
      primary: "#6366F1",
      accent: "#06B6D4",
      text: "#F1F5F9",
      muted: "#94A3B8",
      border: "#1E293B",
    }),
    typography: JSON.stringify({ headingFont: "font-display", bodyFont: "font-sans" }),
    supportedLayouts: JSON.stringify(["cover", "process", "diagram", "stats", "conclusion"]),
    sampleSlides: JSON.stringify([]),
  },
  {
    id: "tpl_pitch_deck",
    slug: "startup-pitch-deck",
    name: "Startup Pitch Deck",
    description: "High-stakes investor storytelling with clean metric emphasis, market sizing, and valuation layouts.",
    category: "Business",
    tags: JSON.stringify(["Pitch", "Venture", "Seed", "Series A", "Investors"]),
    previewThumbnail: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80",
    isPremium: true,
    colorPalette: JSON.stringify({
      background: "#081412",
      surface: "#0F2622",
      primary: "#10B981",
      accent: "#34D399",
      text: "#ECFDF5",
      muted: "#A7F3D0",
      border: "#164E43",
    }),
    typography: JSON.stringify({ headingFont: "font-sans", bodyFont: "font-sans" }),
    supportedLayouts: JSON.stringify(["cover", "stats", "chart", "comparison", "conclusion"]),
    sampleSlides: JSON.stringify([]),
  },
  {
    id: "tpl_corp_strategy",
    slug: "corporate-strategy",
    name: "Corporate Strategy",
    description: "Sleek executive boardroom presentation with structured executive summaries and milestone roadmaps.",
    category: "Business",
    tags: JSON.stringify(["Enterprise", "Executive", "Board", "Strategy"]),
    previewThumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    isPremium: false,
    colorPalette: JSON.stringify({
      background: "#0F172A",
      surface: "#1E293B",
      primary: "#3B82F6",
      accent: "#60A5FA",
      text: "#F8FAFC",
      muted: "#94A3B8",
      border: "#334155",
    }),
    typography: JSON.stringify({ headingFont: "font-sans", bodyFont: "font-sans" }),
    supportedLayouts: JSON.stringify(["cover", "timeline", "process", "chart", "conclusion"]),
    sampleSlides: JSON.stringify([]),
  },
  {
    id: "tpl_msc_it_viva",
    slug: "msc-it-viva",
    name: "MSc IT Viva",
    description: "Academic viva presentation structured with problem statement, methodology, architecture, and defense.",
    category: "Academic",
    tags: JSON.stringify(["MSc", "Viva", "University", "Thesis", "Defense"]),
    previewThumbnail: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    isPremium: false,
    colorPalette: JSON.stringify({
      background: "#150C1B",
      surface: "#22132C",
      primary: "#C026D3",
      accent: "#38BDF8",
      text: "#FAF5FF",
      muted: "#D8B4FE",
      border: "#3B1B4F",
    }),
    typography: JSON.stringify({ headingFont: "font-sans", bodyFont: "font-sans" }),
    supportedLayouts: JSON.stringify(["cover", "diagram", "process", "references", "conclusion"]),
    sampleSlides: JSON.stringify([]),
  },
  {
    id: "tpl_cybersecurity",
    slug: "cybersecurity",
    name: "Cybersecurity",
    description: "Deep terminal black, neon warning cues, threat landscape topology, and vulnerability mitigation.",
    category: "Technology",
    tags: JSON.stringify(["Infosec", "Hacking", "SOC", "Zero Trust"]),
    previewThumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    isPremium: false,
    colorPalette: JSON.stringify({
      background: "#070B0E",
      surface: "#0E171E",
      primary: "#EF4444",
      accent: "#10B981",
      text: "#F0FDF4",
      muted: "#86EFAC",
      border: "#1C303E",
    }),
    typography: JSON.stringify({ headingFont: "font-mono", bodyFont: "font-sans" }),
    supportedLayouts: JSON.stringify(["cover", "diagram", "stats", "timeline", "conclusion"]),
    sampleSlides: JSON.stringify([]),
  },
];

async function main() {
  console.log("Seeding templates into database...");
  for (const t of TEMPLATES) {
    await prisma.template.upsert({
      where: { slug: t.slug },
      update: t,
      create: t,
    });
  }
  console.log("Seeded database successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
