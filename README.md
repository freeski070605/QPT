# Resin Art Authority Platform

Monorepo scaffold for the luxury resin art platform.

## Apps
- `apps/web` Next.js frontend
- `apps/api` Express + MongoDB API

## Quick Start
1. Install dependencies in each app folder.
2. Copy `apps/api/.env.example` to `apps/api/.env` and fill values.
3. Copy `apps/web/.env.example` to `apps/web/.env.local` and fill values.
4. Start API and web.

Commands (from repo root):
- `npm run dev:api`
- `npm run dev:web`

## Docs
- `docs/information-architecture.md`
- `docs/wireframes.md`

## Deployments

### API on Render
- This repo includes `render.yaml` configured for `apps/api`.
- In Render, create a new Blueprint service from this repository.
- Set required secret env vars in Render:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `WEB_ORIGIN` (your Vercel URL, or comma-separated list)
  - `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` / `CLOUDINARY_UPLOAD_FOLDER` (if you use image uploads)
  - `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` (if you want bootstrap admin creation)

### Web on Vercel
- Create a Vercel project using this repository.
- Set **Root Directory** to `apps/web`.
- `apps/web/vercel.json` is included for Next.js install/build/dev commands.
- Set env var in Vercel:
  - `NEXT_PUBLIC_API_BASE` = your Render API URL (example: `https://qpt-api.onrender.com`)
