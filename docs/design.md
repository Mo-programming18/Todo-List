# TaskFlow — Design & Architecture Spec

> A professional task-management SaaS. Portfolio-grade product, not a CRUD demo.
> Stack: Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · shadcn-style components · Prisma 7 · MySQL · Auth.js v5.

## 1. Product decisions (locked)

| Decision | Choice |
|---|---|
| Scope | Full product, phased delivery with a commit per phase |
| Auth | Auth.js v5 — Credentials (email + password, bcrypt) + optional GitHub/Google OAuth |
| Visual anchor | Linear-inspired refined neutrals + one indigo accent; Todoist-style priority color coding |
| Theme | Light + dark mode, both designed from the start (class strategy) |
| Density | Comfortable-dense (dashboard) |

## 2. Design read (design-taste)

Reading this as: **product/dashboard UI for professionals**, with a **Linear-clean language**, leaning toward **Tailwind v4 tokens + Geist + shadcn-style components + restrained motion**.

Dials: `VARIANCE 5 / MOTION 4 / DENSITY 7`. The marketing/landing page (public `/`) uses the full design-taste landing playbook at `VARIANCE 7 / MOTION 5`.

### Anti-slop rules enforced app-wide
- **Zero em-dashes** in any user-visible string.
- No AI-purple glows/gradients. Indigo is used flat and with intent, one accent locked across the app.
- One neutral family (slate), one radius scale, one icon family (lucide, consistent stroke).
- Real, believable seed data and names (no "John Doe", no "Acme").
- WCAG AA contrast in both themes; color never the sole signal (priority = color + label + icon).
- Full interaction states everywhere: loading (skeletons), empty, error, success.

## 3. Color system (design tokens)

Semantic tokens (shadcn naming) exposed to Tailwind v4 via `@theme`. Values switch between `:root` (light) and `.dark`.

**Neutrals** — slate scale. **Primary accent** — indigo `#6366F1` (validated by the UI/UX Pro Max "Micro SaaS" palette). **Success** emerald, **warning** amber, **destructive** red.

| Token | Light | Dark |
|---|---|---|
| background | `#F8FAFC` | `#0B0F19` |
| foreground | `#0F172A` | `#E2E8F0` |
| card | `#FFFFFF` | `#111725` |
| muted | `#F1F5F9` | `#1A2233` |
| muted-foreground | `#64748B` | `#94A3B8` |
| border | `#E2E8F0` | `#232C3D` |
| primary | `#6366F1` | `#818CF8` |
| primary-foreground | `#FFFFFF` | `#0B0F19` |
| ring | `#6366F1` | `#818CF8` |
| success | `#16A34A` | `#22C55E` |
| warning | `#D97706` | `#F59E0B` |
| destructive | `#DC2626` | `#F87171` |

**Priority colors** (Todoist-style, always paired with a label + icon):

| Priority | Hue | Light | Dark |
|---|---|---|---|
| LOW | slate | `#64748B` | `#94A3B8` |
| MEDIUM | blue | `#2563EB` | `#60A5FA` |
| HIGH | amber | `#D97706` | `#FBBF24` |
| URGENT | red | `#DC2626` | `#F87171` |

## 4. Typography

Single family: **Geist Sans** (already wired via `next/font`), with **Geist Mono** for numbers/dates/counts (tabular figures, prevents layout shift). Weight hierarchy: 600–700 headings, 500 labels, 400 body. Base 16px, body line-height 1.5.

## 5. Data model

Enums: `Priority { LOW MEDIUM HIGH URGENT }`, `TaskStatus { TODO IN_PROGRESS DONE }`.

- **User** — Auth.js core (id, name, email, emailVerified, image, hashedPassword?) + relations.
- **Account / Session / VerificationToken** — Auth.js Prisma adapter models (OAuth linking).
- **Task** — id, title, description?, status, priority, dueDate?, position, completedAt?, userId, categoryId?, createdAt, updatedAt, tags (many-to-many).
- **Category** (project) — id, name, color, userId; unique (userId, name).
- **Tag** — id, name, userId; unique (userId, name); many-to-many with Task via implicit or explicit join.

Sessions use the **JWT strategy** (required for the Credentials provider); the Prisma adapter still backs OAuth account linking and the user table.

## 6. Architecture

```
src/
  app/
    (marketing)/            # public landing at /
    (auth)/login, /register # auth pages
    (dashboard)/            # protected: /dashboard, /tasks, /calendar, /analytics, /settings
    api/auth/[...nextauth]/  # Auth.js route handler
  components/
    ui/                     # shadcn-style primitives (button, input, dialog, ...)
    dashboard/              # navbar, sidebar, stat cards, task card, task modal, filters
    marketing/              # landing sections
  lib/                      # prisma, auth, validations (zod), utils, data access
  server/actions/           # Server Actions (task/category/tag CRUD)
  generated/prisma/         # Prisma client (custom output)
```

- **Data mutations**: Next.js Server Actions with Zod validation, `revalidatePath` after writes.
- **Auth protection**: middleware guards the `(dashboard)` group; Server Components read `await auth()`.
- **Forms**: React Hook Form + Zod resolver; `useActionState`/`useFormStatus` for pending UI.
- **Toasts**: `sonner`. **Charts**: Recharts (analytics). **Drag/reorder**: dnd-kit (optional polish).

## 7. Feature phases (one commit each)

1. `setup:` project structure, deps, design tokens, base UI primitives
2. `feat: auth` — Auth.js credentials + OAuth, register/login, protected routes, profile
3. `feat: dashboard layout` — navbar, sidebar, shell, theme toggle
4. `feat: task management` — CRUD, complete/restore, priority, due date, category, tags, modal
5. `feat: filters + search` — status/priority/category filters, search, sort
6. `feat: stats + analytics` — overview cards, progress, charts, upcoming deadlines
7. `feat: calendar view`
8. `style:` marketing landing page + final UI polish

## 8. Quality bar

Strong TypeScript typing, reusable components, server-side validation on every mutation, secure password handling (bcrypt, never returned to client), responsive from 375px, WCAG AA, empty/loading/error states throughout.
