# 05 — Architecture Refactor Plan v2

VPS-deployed Vite + React 18 + TS + Tailwind + shadcn landing page. Builds on `specs/03-architecture-spec.md` and `specs/00-master-plan.md`. Project root: `nexsimple-ai-spark-main/`.

---

## 1. Folder Structure Refactor

**Current pain:** flat `src/components/` (~15 sections + orphans + `motion/` + `three/` + `ui/`). No domain boundary.

**Target layout (feature-based + capability namespaces):**

```
src/
  app/                          # App shell, providers, routes
    App.tsx
    routes.tsx                  # central route registry, lazy() everything
    providers/
      QueryProvider.tsx
      MotionConfigProvider.tsx
      SmoothScrollProvider.tsx
      ThemeProvider.tsx
  features/
    hero/
      Hero.tsx
      hero.copy.ts              # extracted strings
      hero.variants.ts          # Framer variants local
    problem-solution/
    main-solution/
      MainSolution.tsx
      ScrollPin.tsx             # pinned sequence (GSAP)
    use-cases/
      UseCases.tsx
      use-cases.data.ts         # case array typed
    team-enablement/
    social-proof/
    benefits/
    contact/
      ContactForm.tsx
      contact.schema.ts         # zod schema
      useContactSubmit.ts       # Supabase hook
    whatsapp/
      WhatsAppButton.tsx
      WhatsAppPopup.tsx         # 30s "posso ajudar?" popup
  components/
    layout/
      Header.tsx
      Footer.tsx
      SkipLink.tsx              # new a11y
      SectionDivider.tsx        # hairline component
    motion/                     # exists
    seo/
      SEO.tsx                   # react-helmet-async wrapper
      StructuredData.tsx        # JSON-LD injector
    ui/                         # shadcn — UNTOUCHED
  lib/
    animations/
    supabase/client.ts
    seo/jsonld.ts
    a11y/announce.ts            # live-region helper
  hooks/                        # cross-feature only
  pages/
    Index.tsx                   # composes features
    NotFound.tsx
    legacy/                     # SEE §8
  styles/
    index.css                   # tokens
    tokens.ts                   # generated TS mirror of CSS vars
  types/
    global.d.ts
    supabase.ts                 # generated types
```

**Migration path (no broken imports):** add tsconfig path aliases first; `git mv` one feature at a time; `npm run build` between each move; barrel `index.ts` per feature; `src/App.tsx` becomes a 10-line shell.

Order: `lib/` → `components/layout` → `components/motion` (exists) → `features/*` → `app/` shell.

---

## 2. Type Safety

- Form handlers → `react-hook-form` + `zod` resolver; `z.infer<typeof contactSchema>`
- Supabase → `supabase gen types typescript --project-id <id> > src/types/supabase.ts`; client `createClient<Database>()`
- Framer Motion variants → `lib/animations/variants.ts` with `Variants` typing
- Component variants → adopt `cva` (already used by shadcn) for custom components (`Reveal`, `Magnetic`, `SectionDivider`)
- Tokens → `src/styles/tokens.ts` mirroring CSS variables; long-term `style-dictionary`
- Strict mode → enable `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` in `tsconfig.app.json`

---

## 3. Performance Budget v2

**Targets (Lighthouse mobile, slow 4G):**

| Metric | Target |
|---|---|
| Performance | 90+ |
| Accessibility | 100 |
| SEO | 100 |
| Best Practices | 100 |
| LCP | < 2.0s |
| INP | < 200ms |
| CLS | < 0.05 |
| Initial JS | < 200 KB gz |
| Total transfer | < 1.0 MB |

**Cuts beyond current ~800 KB initial:**

1. Tree-shake **recharts** if unused — save ~120 KB gz
2. Tree-shake sonner vs shadcn toaster — pick one (sonner smaller, ~8 KB save)
3. drei subpath imports — `import { OrbitControls } from "@react-three/drei/core/OrbitControls"`
4. GSAP — only `import { ScrollTrigger } from "gsap/ScrollTrigger"` — no `gsap/all`
5. Framer Motion — `m` (mini) + `LazyMotion` with `domAnimation` feature — save ~30 KB
6. Remove orphan components (see §8)
7. Vite `manualChunks` for `three`, `@react-three/*`, `framer-motion`, `gsap`, `@supabase/supabase-js`, `react-hook-form + zod` — already partial
8. Route splitting — `React.lazy` for legacy routes

**Image pipeline:** `vite-imagetools`; `<picture>` with avif/webp/jpeg, srcset, lazy/async, hero `fetchpriority="high"` + preload; SVG icons via `vite-plugin-svgr`.

**Video:** webm (VP9) + mp4 (H.264) 1080p ~600KB each; `<video muted playsInline preload="none" loop>` + IntersectionObserver toggling preload + play 200px before viewport; disable autoplay if reduced-motion (poster instead); self-host on VPS, `Cache-Control: public, max-age=31536000, immutable`.

**Fonts:** self-host woff2 in `/public/fonts/`; subset latin via `glyphhanger`/`subfont`; only weights actually used (Instrument Serif Regular + Italic, body Light 300 + Regular 400); `font-display: swap` + `<link rel="preload" as="font" crossorigin>` for the 2 hero-critical files.

**Critical CSS:** `vite-plugin-critical` or `beasties` inlines above-the-fold (Header + Hero only).

**Lenis tuning:** `lerp: 0.1`, `duration: 1.2`, `wheelMultiplier: 0.9`, no `smoothTouch: true` on iOS.

---

## 4. Accessibility Plan (WCAG 2.2 AA)

**Semantic HTML:** wrap content in `<main id="main">`; sections as `<section aria-labelledby="...">` with H2 referencing id; one `<h1>` (Hero); H2/H3 hierarchy strict; hairlines as `<hr role="presentation">` or pure CSS.

**ARIA:**
- Form submit success/error: `<div role="status" aria-live="polite">` in `ContactForm.tsx`; inject via `lib/a11y/announce.ts`
- Icon-only buttons (WhatsApp): `aria-label="Falar com Daniel pelo WhatsApp"` + sr-only fallback
- Mobile menu toggle: `aria-expanded`, `aria-controls="mobile-nav"`, `aria-label="Abrir menu"`
- Decorative motion (Canvas, particles, ghost "IA"): `aria-hidden="true"`
- Form fields: `<label htmlFor>`/`<input id>`, `aria-invalid`, `aria-describedby="field-error"`

**Keyboard:**
- SkipLink as first child of `<body>`
- Visible focus: `focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2`
- Mobile drawer: focus trap via `focus-trap-react`; ESC closes; focus returns to opener
- Tab order logical; never `tabindex > 0`
- Magnetic CTAs must stay native `<button>` — never `<div>`

**Reduced-motion enforcement:**
- `<MotionConfig reducedMotion="user">` already planned
- Lenis: skip init if `matchMedia("(prefers-reduced-motion: reduce)").matches`
- R3F: gate behind `useReducedMotion()` if re-added
- GSAP: `gsap.matchMedia()` with `(prefers-reduced-motion: no-preference)`
- Decorative continuous motion paused; videos render poster instead

**Color contrast:** gold `#c8b89a` on `#0a0a0a` ≈ 10.8:1 (AAA); body near-white on background ≈ 17:1; risk on glass with light tint — test each variant with axe; fix `MainSolution.tsx:21` `text-border` (invisible) → `bg-gradient-accent bg-clip-text text-transparent`; boost `--glass-border` to 25% when used as focus indicator.

**Screen reader test:** macOS Safari + VoiceOver; Windows Firefox + NVDA; axe-core via Playwright in CI.

---

## 5. SEO Plan

**Meta additions to `index.html`:** description, theme-color, color-scheme dark, canonical, OG full set (type, title, desc, image 1200x630, locale pt_BR), Twitter card large image.

**Per-route meta:** `react-helmet-async` + `components/seo/SEO.tsx`. Only `/` matters today.

**OG image (1200x630):**
- Static design (P1 recommended): export PNG/JPG from Figma, ship to `/public/og.jpg`
- Programmatic (P3): `OgCard.tsx` + `@vercel/og` or Playwright screenshot at build time

**JSON-LD:** inject via `components/seo/StructuredData.tsx`:
- `Person` schema (jobTitle, sameAs, knowsAbout)
- `ProfessionalService` (areaServed BR, priceRange R$10k–30k, serviceType)
Builders typed in `lib/seo/jsonld.ts`. Validate w/ Google Rich Results Test.

**Sitemap/robots:** static files in `/public/`; `vite-plugin-sitemap` if routes grow; robots disallow `/auth` (if returns).

**Canonical:** one per page via `<SEO canonical>`.

**hreflang:** PT-BR only at launch; EN later as `/en` (P3).

**PageSpeed checklist:**
- LCP = Hero H1 (text) — never lazy
- TTFB: Nginx + gzip/brotli; dist from RAM cache
- Preload Instrument Serif Italic + body Light woff2
- `<html lang="pt-BR">`
- All scripts deferred (module-type already deferred)
- No render-blocking CSS after critical inline

---

## 6. Testing Strategy

**Vitest + RTL:**
- `contact.schema.test.ts` — zod accepts/rejects
- `ContactForm.test.tsx` — validation, Supabase mock, aria-live announce
- `Reveal.test.tsx` — falls back to static when reduced-motion
- `lib/seo/jsonld.test.ts` — builders emit valid schema.org

**Playwright E2E:**
- `home.spec.ts` — page loads + axe `expect(violations).toHaveLength(0)`
- `contact-form.spec.ts` — fill, intercept Supabase, assert success announced
- `navigation.spec.ts` — Header anchors smooth scroll + focus
- `reduced-motion.spec.ts` — emulate, assert Lenis not initialized + videos paused
- `keyboard.spec.ts` — tab traversal + skip-link

CI: GH Actions matrix (chromium/firefox/webkit). axe-core integrated.

**Visual regression (P3):** Playwright `toHaveScreenshot()` for 3 viewports on `/`.

---

## 7. VPS Deploy Plan

**Stack:** Ubuntu 22.04 LTS + Nginx 1.24+ + certbot + ufw + Cloudflare in front (free tier).

**Build & upload:**
```
npm ci
npm run build
rsync -avz --delete dist/ daniel@vps:/var/www/danielalves/current/
ssh daniel@vps "sudo systemctl reload nginx"
```

Atomic releases: `/var/www/danielalves/releases/<timestamp>` + symlink `current` → newest.

**Nginx config highlights:**
- HTTP/2, brotli + gzip
- HSTS (max-age 2y, includeSubDomains, preload)
- Strict CSP: `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://*.supabase.co; media-src 'self'; frame-ancestors 'none'`
- Hashed assets: `Cache-Control: public, immutable; expires 1y`
- SPA fallback: `try_files $uri $uri/ /index.html`
- `index.html`: `Cache-Control: no-store, must-revalidate`

**SSL via certbot:**
```
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d danielalves.example.com --non-interactive --agree-tos -m adm@acomunidadeestetica.com
sudo systemctl enable certbot.timer
```

**No PM2 needed** (static site). If Node API later: systemd unit at `/etc/systemd/system/danielalves-api.service` preferred.

**HTTP/3:** requires Nginx 1.25+ with quic; defer.

**Cloudflare:** DNS A → VPS IP, proxy ON (orange). Full (strict) SSL. Page Rule cache assets 1mo.

---

## 8. Orphan Component Decisions

| File | Decision | Reason |
|---|---|---|
| `AllInOneSolutions.tsx` | **Remove** | Overlaps MainSolution; never referenced |
| `HowItWorks.tsx` | **Merge into MainSolution** | Step-by-step = pinned-horizontal job |
| `ModulesOfferings.tsx` | **Remove** | Contradicts service-only direction |
| `SectorUseCases.tsx` | **Remove** | UseCases already covers Íris + Lari |
| `FAQ.tsx` | **Move to `/legacy`** | No FAQ in current narrative; keep for future |
| `NavLink.tsx` | **Remove** | Header inline `<a>` is enough |
| `ProtectedRoute.tsx` | **Move to `/legacy`** | Only if `/auth` returns |
| `FaviconUpdater.tsx` | **Remove** | Favicons static in index.html |

**Orphan routes:**
- `/sobre` → **Delete** (bio inline in Benefits)
- `/solucoes` → **Delete** (inline in MainSolution + UseCases)
- `/auth` → **Delete** (no authenticated area)
- `/404` → **Keep, redesign** consistent with dark luxury

After deletion `routes.tsx` = `<Route index element={<Index />} /> + <Route path="*" element={<NotFound />} />`.

---

## 9. Implementation Order

**P0 — Blocking (in order)**
1. Add tsconfig path aliases (`@/app/*`, `@/features/*`)
2. Delete orphans listed in §8
3. Delete orphan routes
4. Move `Header.tsx` + `Footer.tsx` to `components/layout/`
5. Create `features/` folders; `git mv` each section; barrel `index.ts`
6. Enable TypeScript strict mode

**P1 — High impact**
7. Wire `react-helmet-async` + `<SEO />` in Index + NotFound
8. JSON-LD Person + ProfessionalService via `StructuredData.tsx`
9. Static `/public/og.jpg`, `/public/sitemap.xml`, `/public/robots.txt`
10. Add `SkipLink.tsx`, `<main id="main">`, semantic sections
11. focus-visible ring tokens
12. ARIA on icon-only buttons + mobile menu
13. `react-hook-form` + `zod` on ContactForm + aria-live
14. `vite-imagetools` for AVIF/WebP `<picture>`
15. Self-host fonts + preload critical
16. Inline critical CSS via `beasties`
17. Extend Vite manualChunks
18. Audit recharts/sonner/lodash — remove unused (vite-bundle-visualizer)
19. IntersectionObserver lazy loader for videos + reduced-motion

**P2 — Polish**
20. Generate `tokens.ts` from `index.css`
21. Adopt cva for custom variant components
22. Generate Supabase types
23. Vitest + base unit tests
24. Playwright + 5 specs + axe integration
25. GH Actions CI (build + test + Lighthouse)
26. Provision VPS (Nginx config, certbot, ufw, Cloudflare)
27. First deploy via rsync + symlink swap

**P3 — Nice-to-have**
28. Programmatic OG image generator
29. EN locale + hreflang
30. HTTP/3 via Nginx rebuild or Caddy
31. Playwright visual regression
32. `style-dictionary` single-source tokens
33. Storybook (if 2nd engineer joins)

**Launch gate:** Lighthouse mobile Performance 90+, A11y 100, SEO 100, BP 100. Axe 0 violations. Playwright green on 3 browsers.
