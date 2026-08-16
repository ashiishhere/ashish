# Ashish Dabhade — Portfolio Website

A full-stack cinematic portfolio website and CMS for filmmaker, creative producer and senior
video editor **Ashish Dabhade**. Built with Next.js App Router, TypeScript, Prisma/PostgreSQL,
Auth.js, and Cloudinary.

## 1. Project Overview

- **Public site** — Home, Work (with filterable long/short video grid), individual project
  pages with embedded YouTube players, About, Experience, Services, Awards (with image gallery),
  and Contact.
- **Admin CMS** at `/admin` — full CRUD for projects, categories, awards (with image upload),
  experience, services, about content, contact messages, SEO settings, and site settings —
  protected by authentication.
- Every page and section is its own component/file — no monolithic pages.

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS + Framer Motion |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | Auth.js (NextAuth) — Credentials provider |
| Validation | Zod |
| Image storage | Cloudinary (swappable — see `lib/cloudinary.ts`) |
| Video | YouTube (iframe embeds; only video IDs are stored) |
| Deployment | Vercel |

## 3. Requirements

- Node.js 18.18+ (20.x recommended)
- A PostgreSQL database (Vercel Postgres, Supabase, Neon, Railway, or local Postgres)
- A free [Cloudinary](https://cloudinary.com) account (for award image uploads)

## 4. Installation

```bash
npm install
```

## 5. Environment Variables

Copy `.env.example` to `.env` and fill in real values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | Random secret for NextAuth — generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Base URL of the app (e.g. `http://localhost:3000` locally) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Credentials for the seeded admin account — used only by the seed script |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | From your Cloudinary dashboard |
| `NEXT_PUBLIC_SITE_URL` | Public URL used for SEO, sitemap and OG tags |

Never commit `.env` — it's already in `.gitignore`.

## 6. Database Setup

Push the schema to your database:

```bash
npx prisma generate
npx prisma db push
```

For production, prefer migrations instead of `db push`:

```bash
npx prisma migrate dev --name init
```

## 7. Prisma Migration (Production)

```bash
npx prisma migrate deploy
```

## 8. Seed the Database

Seeds only the real information from Ashish's resume/brief (experience, awards, services,
categories, site settings, social links) plus one admin account. **No portfolio projects are
invented** — add real project entries from `/admin/projects/new` after launch.

```bash
npm run db:seed
```

## 9. Local Development

```bash
npm run dev
```

Visit `http://localhost:3000` for the public site and `http://localhost:3000/admin/login` for
the admin panel (sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`).

## 10. Cloudinary Setup

1. Create a free account at [cloudinary.com](https://cloudinary.com).
2. From the dashboard, copy your **Cloud Name**, **API Key**, and **API Secret** into `.env`.
3. Uploads happen through `/api/admin/upload`, which calls `lib/cloudinary.ts`. Images are
   stored under the `ashish-portfolio/` folder prefix, organized by feature (e.g.
   `ashish-portfolio/awards/main`).
4. To swap providers later (e.g. Vercel Blob), only `lib/cloudinary.ts` needs to change — the
   rest of the app calls `uploadImage()` / `deleteImage()` from that one module.

## 11. YouTube Usage

- The admin pastes any YouTube URL format (`watch?v=`, `youtu.be/`, `/shorts/`) into a project's
  video fields.
- `lib/youtube.ts` extracts and stores only the **video ID** — never the full URL — so nothing
  breaks if YouTube's URL formats change.
- Playback happens inside the site via a lazy-loaded `youtube-nocookie.com` iframe; visitors are
  never redirected to youtube.com. YouTube's own player UI/branding cannot be fully removed —
  that's controlled by YouTube.
- `LONG` videos render in 16:9; `SHORT` videos render in 9:16.

## 12. Admin Login Setup

The admin account is created by the seed script from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in your
environment. Passwords are hashed with bcrypt before storage — never stored in plain text.

To change the admin password later, update `ADMIN_PASSWORD` and re-run:

```bash
npm run db:seed
```

## 13. GitHub Deployment

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

`.gitignore` already excludes `node_modules`, `.next`, `.env`, and local uploads.

## 14. Vercel Deployment

1. Import the GitHub repo into [Vercel](https://vercel.com/new).
2. Add all variables from `.env.example` under **Project Settings → Environment Variables**
   (use your production database URL and a fresh `AUTH_SECRET`).
3. Set `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` to your production domain.
4. Deploy. The `postinstall` script runs `prisma generate` automatically; `npm run build` also
   runs `prisma generate` before `next build`.
5. After the first deploy, run migrations against production (from your machine, with
   production `DATABASE_URL` set):
   ```bash
   npx prisma migrate deploy
   npm run db:seed
   ```

## 15. Production Environment Variables

Same as `.env.example`, with production values:
- `DATABASE_URL` — production Postgres connection string
- `AUTH_SECRET` — a **different**, freshly generated secret from local dev
- `NEXTAUTH_URL` / `NEXT_PUBLIC_SITE_URL` — your live domain, e.g. `https://ashishdabhade.com`
- Cloudinary credentials — can reuse the same Cloudinary account as local dev

## 16. Troubleshooting

| Issue | Fix |
|---|---|
| `PrismaClientInitializationError` | Check `DATABASE_URL` is correct and the database is reachable; run `npx prisma generate`. |
| Admin login fails | Confirm `ADMIN_EMAIL`/`ADMIN_PASSWORD` were set when you ran `npm run db:seed`, and that `AUTH_SECRET` is set. |
| Images not uploading | Verify all three `CLOUDINARY_*` variables are set and correct. |
| YouTube video won't parse | Ensure the pasted URL is a standard `watch?v=`, `youtu.be/`, or `/shorts/` link. |
| Build fails on Vercel with Prisma errors | Ensure `DATABASE_URL` is set in Vercel's environment variables before deploying — Prisma needs it at build time to generate the client. |
| Hydration mismatch warnings | Usually caused by browser extensions in dev; verify in an incognito window. |

## Project Structure

```
app/
  (website)/        Public site routes (home, work, about, experience, services, awards, contact)
  admin/
    login/           Public login route (outside the auth-protected layout)
    (dashboard)/      All authenticated admin routes, wrapped by layout.tsx's session check
  api/               Route handlers (contact form, admin CRUD, uploads, NextAuth)
components/          Organized by feature: layout, ui, home, work, project, video, awards, admin, contact
lib/                 db, auth, youtube, cloudinary, validations, utils — all shared logic
prisma/              schema.prisma + seed.ts
public/images/       Home_Page.jpeg, About_Page.png
types/, hooks/       Shared TypeScript types and React hooks
middleware.ts        Protects all /admin/* routes except /admin/login
```
