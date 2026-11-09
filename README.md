# MOTRIX — The Art of M Performance

A cinematic, scroll-driven website showcasing BMW M cars (M2, M3, M4, M5, M8), with light and dark mode. Deployed on [Vercel](https://vercel.com).

## Tech

React 19 · TypeScript · Vite · Tailwind CSS · GSAP · React Router

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build

```bash
npm run build     # outputs to dist/
npm run preview   # serve the build locally
```

## Deploy on Vercel

1. Push the repo to GitHub.
2. Import it in Vercel. The Vite preset is detected automatically:
   - Build command: `npm run build`
   - Output directory: `dist`
3. Deploy. Every push to `main` redeploys.

## Project layout

```
src/
  components/   page sections and UI
  pages/        Home and model pages
  data/         model content
  styles/       CSS per section
public/         images and hero video
docs/           asset notes
```
