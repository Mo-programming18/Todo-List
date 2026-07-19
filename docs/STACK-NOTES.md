# Stack gotchas (Next 16 / Tailwind v4 / Auth.js v5 / Prisma 7)

Verified against the local docs and npm. These differ from older conventions — follow them.

## Next.js 16.2
- `params` and `searchParams` are **Promises** — `const { id } = await params`. In Client Components use `use(params)`.
- `cookies()`, `headers()`, `draftMode()` are **async**. `redirect()`/`notFound()` throw (call outside try/catch).
- **Middleware is renamed to `proxy.ts`** (root, exports `proxy`). A `middleware.ts` is silently ignored. Runtime is Node, not configurable.
- Server Actions: `'use server'`, `revalidatePath('/x')`, `revalidateTag('tag','max')` (2nd arg required), `updateTag('tag')` (action-only, read-your-writes). Re-check auth inside every action.
- Route handlers: `ctx.params` is a Promise. `GET` is uncached by default.
- `next/image`: `priority` prop deprecated → use `preload`. `images.domains` → `remotePatterns`.
- `next lint` removed; Turbopack is default. Node 20.9+, React 19.2.

## Tailwind v4 (CSS-first, no tailwind.config.js)
- `@import "tailwindcss";` first line. Dark mode via `@custom-variant dark (&:where(.dark, .dark *));` (class strategy).
- Semantic tokens: raw vars in `:root`/`.dark`, mapped through **`@theme inline`** (the `inline` keyword is load-bearing so `.dark` overrides resolve and `/opacity` works).
- Reference a CSS var in a utility: `bg-(--brand)` or `bg-[var(--brand)]`.
- Animations: `@import "tw-animate-css";`.

## Auth.js v5 (`next-auth@beta`)
- Install `next-auth@beta @auth/prisma-adapter bcryptjs @prisma/adapter-mariadb` with `--legacy-peer-deps` (peer range gap, not a runtime break).
- **Split config**: `auth.config.ts` (edge-safe: providers metadata + `authorized` callback, no DB/bcrypt) and `auth.ts` (Node: adapter + Credentials + bcrypt). `proxy.ts` imports only `auth.config`.
- Credentials provider **requires `session.strategy = 'jwt'`**. Adapter still backs OAuth account linking + user table.
- `PrismaAdapter(prisma)` takes the client instance — custom output path is irrelevant to it.
- Use **`bcryptjs`** (pure JS) not `bcrypt` (native build fails on Windows).
- `passwordHash String?` on User (null for OAuth-only users).

## Prisma 7.8 (new `prisma-client` generator, custom output)
- The generated client uses the **WASM client engine → a driver adapter is MANDATORY**. `new PrismaClient()` alone throws. For MySQL use `@prisma/adapter-mariadb` (`PrismaMariaDb`), passed as `new PrismaClient({ adapter })`.
- Import client/enums/types from `@/generated/prisma`. Enums are const objects (`Priority.HIGH`).
- DB URL lives in `prisma.config.ts` `datasource.url` (not schema). CLI needs the `mysql://` scheme.
- `migrate dev`/`db push` **no longer auto-run `generate`** — run `prisma generate` separately. Add `postinstall: prisma generate`.
- Seed command goes in `prisma.config.ts` `migrations.seed` (e.g. `tsx prisma/seed.ts`).
- Keep `src/generated/prisma` gitignored.
