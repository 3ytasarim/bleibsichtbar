# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite, Tailwind CSS, Framer Motion, React Hook Form, wouter

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── bleibsichtbar/      # Main agency website (React + Vite)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Project: Bleibsichtbar Agency Website

A professional social media agency website for **Bleibsichtbar** (bleibsichtbar.com).

### Features

**Public Website:**
- Home page with phone mockups, hero section, stats, services overview
- Social Media page with animated process timeline (Framer Motion)
- Projects gallery `/projekte` 
- References/testimonials page `/referenzen`
- Blog listing and detail pages `/blog`
- Contact page `/kontakt`
- Contact form section on every page (call-to-action)

**Admin Panel (`/admin`):**
- Protected by session-based authentication
- Login at `/admin/login`
- Projects CRUD (`/admin/projekte`)
- Blog posts CRUD (`/admin/blog`)
- References CRUD (`/admin/referenzen`)

### Admin Credentials
- **Username**: `admin` (configurable via `ADMIN_USERNAME` env var)
- **Password**: `bleibsichtbar2024` (configurable via `ADMIN_PASSWORD` env var)

### Database Schema
- `projects` - Project portfolio items
- `blog_posts` - Blog articles
- `references` - Client testimonials (note: "references" is a reserved SQL word, must be quoted)
- `contacts` - Contact form submissions

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

- **Always typecheck from the root** — run `pnpm run typecheck`
- **`emitDeclarationOnly`** — only `.d.ts` files during typecheck
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/bleibsichtbar` (`@workspace/bleibsichtbar`)

Main agency website. React + Vite frontend served at `/`.

- Entry: `src/main.tsx`
- App: `src/App.tsx` - sets up routing with wouter
- Pages: `src/pages/` - Home, Services, SocialMedia, Blog, BlogPost, References, Projects, Contact
- Admin pages: `src/pages/admin/` - Login, Dashboard, AdminProjects, AdminBlog, AdminReferences
- Components: `src/components/` - shared (PhoneMockup, ContactSection), layout (Navbar, Footer), admin (SimpleModal)

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server at `/api`.

- Auth routes: `src/routes/auth.ts` - login/logout/me (session-based)
- Projects routes: `src/routes/projects.ts`
- Blog routes: `src/routes/blog.ts`
- References routes: `src/routes/references.ts`
- Contact routes: `src/routes/contact.ts`
- Middleware: `src/middlewares/auth.ts` - requireAdmin middleware

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL.

- `src/schema/projects.ts` - Projects table
- `src/schema/blog.ts` - Blog posts table
- `src/schema/references.ts` - References/testimonials table (use quoted SQL)
- `src/schema/contacts.ts` - Contact submissions table

### `lib/api-spec` (`@workspace/api-spec`)

OpenAPI 3.1 spec with all endpoints for the agency website.
Run codegen: `pnpm --filter @workspace/api-spec run codegen`
