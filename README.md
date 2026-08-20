# Mehndi Studio Website

Single-tenant marketing site and admin panel for a henna studio. Built with Next.js 15 (App Router), Neon Postgres, Prisma, Auth.js, Cloudinary, Resend, Tailwind CSS v4, and shadcn/ui.

## Setup

1. Copy `.env.example` to `.env` and fill in the keys.
2. Use Neon's **pooled** connection string (`-pooler` host) for `DATABASE_URL`.
3. Generate `AUTH_SECRET` with `npx auth secret`.
4. Run:

```bash
npx prisma migrate deploy
npx prisma db seed
npm run dev
```

First launch: open `/admin/setup` to create the single admin account. That route locks permanently afterward.

## Scripts

- `npm run dev` — development
- `npm run build` / `npm start` — production
- `npx prisma studio` — inspect the database

## Deploy (Vercel)

1. Import `https://github.com/mehndiartist1104-sketch/website` in Vercel.
2. Framework preset: **Next.js**.
3. Add the environment variables from `.env.example`. For production:
   - `AUTH_URL` and `NEXT_PUBLIC_SITE_URL` must be the live domain, e.g. `https://your-app.vercel.app`
   - `DATABASE_URL` must be Neon’s **pooled** (`-pooler`) connection string
4. Deploy. The build runs `prisma migrate deploy` then `next build`.
5. After the first deploy, open `/admin/setup` once to create the admin account.
