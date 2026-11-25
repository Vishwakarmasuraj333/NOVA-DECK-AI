export type AspectRatio = "16:9" | "4:3" | "A4";

export type SlideLayoutType =
  | "cover"
  | "agenda"
  | "section_divider"
  | "text"
  | "image_text"
  | "full_image"
  | "comparison"
  | "stats"
  | "timeline"
  | "process"
  | "chart"
  | "diagram"
  | "quote"
  | "case_study"
  | "conclusion"
  | "references";

export interface ColorPalette {
  id: string;
  name: string;
  background: string;
  surface: string;
  primary: string; // e.g. Magenta #E82DA8
  accent: string;  // e.g. Cyan #43D5E8
  text: string;    // #F8F5FF
  muted: string;   // #B7AEC9
  border: string;  // #2E224D
  gradient?: string;
}

export interface TypographyTheme {
  headingFont: string;
  bodyFont: string;
  headingStyle: string;
  bodyStyle: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}

export interface SlideChartData {
  type: "bar" | "line" | "pie" | "metric_grid";
  title?: string;
  data: ChartDataPoint[];
  unit?: string;
}

export interface SlideCitation {
  source: string;
  url?: string;
  note?: string;
}

export interface SlideDocument {
  slideId: string;
  order: number;
  title: string;
  subtitle?: string;
  layoutType: SlideLayoutType;
  body?: string;
  bulletPoints?: string[];
  imagePrompt?: string;
  imageAsset?: string;
  chartData?: SlideChartData;
  speakerNotes?: string;
  citations?: SlideCitation[];
  themeTokens?: {
    customBg?: string;
    customPrimary?: string;
    customAccent?: string;
    customText?: string;
    highlightWord?: string;
    textAlign?: "left" | "center" | "right";
  };
}

export interface PresentationDocument {
  id: string;
  title: string;
  description?: string;
  slug: string;
  aspectRatio: AspectRatio;
  templateId: string;
  themeTokens?: Record<string, unknown>;
  workspaceId: string;
  userId: string;
  slides: SlideDocument[];
  version: number;
  isArchived: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateDefinition {
  id: string;
  slug: string;
  name: string;
  description: string;
  category:
    | "Technology"
    | "Business"
    | "Academic"
    | "Education"
    | "Creative"
    | "Marketing"
    | "Minimal"
    | "Industry"
    | "Data";
  tags: string[];
  previewThumbnail: string;
  isPremium: boolean;
  colorPalette: ColorPalette;
  typography: TypographyTheme;
  supportedLayouts: SlideLayoutType[];
  sampleSlides: Partial<SlideDocument>[];
  version: string;
}

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: "USER" | "PRO" | "ADMIN";
}

export interface CreatePresentationInput {
  prompt: string;
  title?: string;
  language?: string;
  audience?: string;
  purpose?: string;
  numSlides: number;
  tone?: string;
  templateId: string;
  aspectRatio?: AspectRatio;
  contentDensity?: "concise" | "balanced" | "detailed";
  includeImages?: boolean;
  includeSpeakerNotes?: boolean;
  includeCitations?: boolean;
  sourceText?: string;
}

export interface OutlineItem {
  order: number;
  title: string;
  layoutType: SlideLayoutType;
  description: string;
}
