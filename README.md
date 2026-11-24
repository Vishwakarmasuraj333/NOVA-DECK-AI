# NOVA DECK AI — Cinematic AI Presentation Studio

> **High-Stakes AI Presentation Generator** powered by Google Gemini 1.5, featuring 28 genuinely distinct visual design systems, authentic Microsoft PowerPoint (.pptx) & multi-page PDF export pipelines, live slide editor, and enterprise workspace persistence.

---

## 1. Overview & Key Capabilities

- **Google Gemini 1.5 Integration**: Generates structured outlines, slide layouts, presentation speaker notes, and verified citations through official SDKs.
- **28 Genuinely Distinct Templates**: Distinct typographic hierarchies, custom color palettes, and domain-specific layout topologies (VR Lab, MSc IT Viva, AI Technology, Startup Pitch, Cybersecurity, Healthcare, Minimal White, etc.).
- **Real Export System**:
  - **Microsoft PowerPoint (.pptx)**: Generates true editable presentation binaries with native shapes, bullets, and charts using `pptxgenjs`.
  - **Printable PDF**: High-fidelity multi-page landscape documents using `jspdf`.
- **Full Slide Workspace Editor**:
  - Inline text editing with autosave and debouncing.
  - Slide add, duplicate, delete, reorder, and aspect ratio controls (16:9 and 4:3).
  - AI slide regenerator: shorten, expand, make formal, persuasive rewrite.
  - Fullscreen presenter / slideshow mode with arrow key navigation.
- **Persistent Database & Auth**:
  - Zero-config persistent SQLite database with Prisma ORM (switchable to PostgreSQL via `DATABASE_URL`).
  - Bcrypt password hashing, JWT HTTP-only cookie sessions.
  - Role-based permissions (`USER`, `PRO`, `ADMIN`).
  - Server-side entitlement checks locking premium templates.

---

## 2. Tech Stack

- **Framework**: Next.js 14 App Router (TypeScript, React 18)
- **Styling**: Tailwind CSS, custom design tokens, Lucide Icons
- **Database & ORM**: SQLite (`dev.db`) + Prisma ORM
- **Authentication**: BcryptJS + Jose JWT + Secure Cookies
- **AI Engine**: Google Gemini API (`@google/generative-ai`)
- **Document Generation**: `pptxgenjs` (PPTX) + `jspdf` (PDF)
- **Testing**: Vitest automated test suite

---

## 3. Quick Start & Local Setup

### Prerequisites
- Node.js v18+ (tested on Node v24)
- npm or pnpm

### 1. Clone or Open Workspace
```bash
cd C:\Users\imdee\.gemini\antigravity\scratch\novadeck-ai
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="novadeck_super_secure_secret_key_change_in_production_2026_xyz"
GEMINI_API_KEY="" # Optional: Add your Google AI Studio key for live AI generation
IMAGE_PROVIDER="curated_fallback"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Initialize Database & Seed Templates
```bash
npx prisma db push
node prisma/seed.js
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 4. Testing & Verification

Run the automated test suite:
```bash
npm run test
```
Runs 12 unit and integration tests covering:
- Template specifications across all 28 templates
- Bcrypt password hashing & JWT token verification
- PPTX binary generation & PDF document export
- AI provider configuration honest reporting

Run the production build:
```bash
npm run build
```

---

## 5. API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/register` | `POST` | Registers user, creates workspace & session cookie |
| `/api/auth/login` | `POST` | Validates credentials, sets session cookie |
| `/api/auth/logout` | `POST` | Clears authentication session |
| `/api/auth/me` | `GET` | Returns current user, subscription, workspaces |
| `/api/presentations` | `GET`, `POST` | Lists & creates presentations (with server entitlement check) |
| `/api/presentations/[id]` | `GET`, `PUT`, `DELETE` | Retrieves, autosaves, and soft-deletes decks |
| `/api/presentations/[id]/duplicate` | `POST` | Duplicates presentation and all slides |
| `/api/presentations/[id]/trash` | `POST` | Restores or permanently destroys deck |
| `/api/ai/outline` | `POST` | Generates structured slide outline with Gemini |
| `/api/ai/generate` | `POST` | Generates complete structured presentation slides |
| `/api/ai/regenerate-slide` | `POST` | AI slide rewriter (shorten, expand, tone) |
| `/api/billing/upgrade` | `POST` | Upgrades workspace subscription entitlement |
| `/api/admin/metrics` | `GET` | Live telemetry from database records |

---

## 6. Architecture & Security

- **Strict Server Entitlements**: Locked templates cannot be generated on the server without `PRO` or `ADMIN` status.
- **Confidentiality**: Documents and prompts are never used for public model training.
- **Safe Secrets Handling**: Provider credentials (`GEMINI_API_KEY`) are read strictly on the server and never exposed to client-side bundles or admin viewers.
- **Audit Logging**: Every login, registration, and subscription upgrade generates an immutable audit record in the `AuditLog` table.
