# Flight Finder — Deploy Guide

A globe-based flight search you can bookmark and run from any browser.

## What you get
- Live URL like `https://flight-finder-xyz.vercel.app`
- 3D rotating Earth with real continent data
- Type natural commands ("Cheapest Mumbai to Dubai next month")
- Claude searches Google Flights, Skyscanner, MakeMyTrip, Cleartrip and returns the cheapest with live weather

## Cost
- Vercel hosting: **free forever**
- Anthropic API: **₹400 free credit on signup** (~100 searches). After that ~₹2–5 per search.

---

## Deploy in 5 steps (10 minutes, no coding)

### 1. Get an Anthropic API key
- Go to https://console.anthropic.com
- Sign up → Settings → API Keys → Create Key
- Copy it (starts with `sk-ant-...`). You won't see it again.

### 2. Get this code on GitHub
- Sign up at https://github.com (free)
- Create a new repo called `flight-finder` (public or private, doesn't matter)
- Upload **every file in this folder** (including `api/` and `src/` folders) to that repo via the web interface (Add file → Upload files → drag everything in → Commit)

### 3. Deploy on Vercel
- Go to https://vercel.com → sign in with your GitHub account
- Click **Add New → Project**
- Pick your `flight-finder` repo → Import
- **Before clicking Deploy**: scroll to **Environment Variables**
  - Name: `ANTHROPIC_API_KEY`
  - Value: paste the key from step 1
- Click **Deploy**. Wait ~1 minute.

### 4. Open your live URL
Vercel gives you a URL like `flight-finder-yourname.vercel.app`. Bookmark it. Done.

### 5. (Optional) Custom domain
In Vercel → your project → Settings → Domains → add any domain you own.

---

## Run locally first (optional, to test before deploying)
```
npm install
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local
npx vercel dev
```
Opens at http://localhost:3000

---

## Limits & honest reality
- Claude searches ~5 booking sites via web search — not literally every site
- Fares shown are scraped snapshots, **verify on the actual airline site before paying**
- Small Indian sites (ixigo, EaseMyTrip) sometimes show up, sometimes don't
- Each search costs you ~₹2–5 in Anthropic credit. Free $5 signup credit = ~100 searches.

## If something breaks
- Vercel build fails → check the build log, usually a typo in `package.json`
- Search returns "Couldn't plot that" → either the API key is wrong, the route uses cities not in the hub list, or Anthropic credit ran out
- Globe doesn't load → hard refresh (Ctrl+Shift+R)
