# 03 — Architecture & Animation Integration Spec

Vite + React 18 + TypeScript + Tailwind + shadcn landing page — animation stack integration.

Project root: `C:\Users\Daniel alves\Downloads\nexsimple-ai-spark-main\nexsimple-ai-spark-main`

## 1. Dependency Install

```
npm install framer-motion@^11.18.0 gsap@^3.13.0 @gsap/react@^2.1.2 lenis@^1.1.20 three@^0.171.0 @react-three/fiber@^8.17.10 @react-three/drei@^9.121.4
npm install -D @types/three@^0.171.0
```

Pin notes:
- `lenis` is the current package; `@studio-freight/lenis` is deprecated. Import: `import Lenis from "lenis"`.
- `@react-three/fiber` 8.x is the last R3F compatible with React 18 (project uses 18.3.1).
- `three` 0.171 matches drei 9.121 peer range.
- `@gsap/react` provides `useGSAP` (auto-cleanup on unmount).
- GSAP 3.13 ScrollTrigger is MIT (no Club license).

## 2. Provider / Wrapper Setup

### 2.1 Lenis (wrap inside App.tsx, not main.tsx)
`SmoothScrollProvider` mounts Lenis, wires `lenis.on("scroll", ScrollTrigger.update)`, drives GSAP ticker via `lenis.raf`. Returns native scroll if `prefers-reduced-motion: reduce`.

### 2.2 GSAP registration
`src/lib/animations/gsap.ts` calls `gsap.registerPlugin(ScrollTrigger)` once and re-exports both.

### 2.3 Framer MotionConfig
`<MotionConfig reducedMotion="user" transition={{ ease: [0.22,1,0.36,1], duration: 0.6 }}>` wraps `<Routes>`.

### 2.4 R3F Canvas strategy
Per-section Canvas (NOT global). `frameloop="demand"` for static scenes, `"always"` only on Hero. Shared wrapper `SceneCanvas` provides defaults + Suspense.

## 3. File Structure

```
src/lib/animations/
  gsap.ts                  — ScrollTrigger registration + barrel
  variants.ts              — Framer variants (fadeUp, stagger, scaleIn)
  easings.ts               — cubic-bezier presets
  scroll.ts                — useLenis(), scrollToId(id) (replaces scrollIntoView)

src/components/motion/
  SmoothScrollProvider.tsx — Lenis + ScrollTrigger sync
  MotionConfigProvider.tsx — Framer MotionConfig wrapper
  Reveal.tsx               — declarative whileInView fadeUp
  StaggerGroup.tsx         — parent with staggerChildren
  Magnetic.tsx             — cursor-magnetic button
  TextSplit.tsx            — char/word reveal
  ScrollPin.tsx            — GSAP ScrollTrigger pin wrapper

src/components/three/
  SceneCanvas.tsx          — shared Canvas + Suspense
  HeroScene.tsx            — animated 3D for Hero (lazy)
  FloatingShapes.tsx       — drei floating gold geometric primitives
  ParticleField.tsx        — Points cloud ambient depth
  hooks/useReducedMotion.ts

src/hooks/
  useScrollProgress.ts     — Lenis scroll progress as 0..1
```

## 4. Per-Section Animation

| Section | Lib | Key animation |
|---|---|---|
| Header | Framer | mount slide-down, scroll-shrink padding via `useScroll` + `useTransform` |
| Hero | R3F + Framer + GSAP | 3D backdrop (distorted icosahedron / particle field), per-char H1 reveal, GSAP parallax on `IA` decorative text |
| ProblemSolution | Framer | two columns slide from left/right, list items stagger 60ms |
| MainSolution | GSAP + Framer | desktop: pinned for ~1vh with progress-based reveals; mobile: Framer stagger |
| UseCases | Framer | `whileInView` slide-up, hover `y: -6` + gradient border overlay, result text clip-path reveal |
| SocialProof | Framer | left text fades up, right grid staggers, primary dots infinite pulse |
| Benefits | GSAP + Framer | portrait card parallax via scrub, stack chips stagger, paragraphs TextSplit word reveal |
| ContactForm | Framer | heading slide-up, italic em offset x, fields stagger 50ms, submit tap-scale |
| Footer | Framer | fade-in, social icons hover lift + gold color |
| WhatsAppButton | Framer | spring entrance, hover scale 1.08, tap 0.95, infinite glow pulse |

## 5. Performance

- Lazy-load HeroScene with Suspense → fallback `bg-gradient-hero`
- Route code-split Solucoes / Sobre / Auth / NotFound (currently eager in `src/App.tsx:8-12`)
- R3F: `dpr={[1, 1.5]}`, `gl={{ powerPreference: "high-performance" }}`, `frameloop="demand"` non-hero
- Mobile fallback: if `window.innerWidth < 768`, render static gradient instead of HeroScene
- Reduced motion: Lenis skipped, Framer MotionConfig respects, R3F gated via `useReducedMotion` hook
- Vite chunk splitting: `manualChunks` isolates `three`, `@react-three/*`, `framer-motion`, `gsap`

## 6. Risk List & Mitigations

| Risk | Mitigation |
|---|---|
| Lenis breaks `scrollIntoView` at `Header.tsx:9`, `Hero.tsx:3`, `SectorUseCases.tsx:22` | Replace with `scrollToId(id)` helper using `lenis.scrollTo("#" + id, { offset: -80 })` |
| ScrollTrigger desync with Lenis | Wire `lenis.on("scroll", ScrollTrigger.update)` + `gsap.ticker.add(t => lenis.raf(t*1000))` |
| R3F bundle bloat (~600KB) | Route-split + lazy HeroScene + Vite manualChunks |
| `lovable-tagger` may inject attrs breaking Framer refs | Already dev-only in `vite.config.ts:4,12`. If problem, disable or scope motion components. |
| backdrop-filter + R3F on Safari → GPU thrash | One Canvas per section; don't stack `.glass` over Canvas with `alpha: true` |
| ScrollTrigger leaves stale triggers after route change | Add `useLocation` effect calling `ScrollTrigger.refresh()` + `lenis.scrollTo(0, { immediate: true })` |
| `useGSAP` scope ref unmounts during HMR → leaked tweens | Always pass `{ scope: ref }` |
| TS strict + three | Install `@types/three@^0.171.0` |
| Mobile Safari iOS Lenis stutter | `smoothTouch: false` (default) — preserve OS scroll on touch |

## 7. Implementation Order

1. Install deps (section 1). Verify `npm ls`.
2. Create `src/lib/animations/` (gsap.ts, variants.ts, easings.ts, scroll.ts).
3. Create motion providers (SmoothScrollProvider, MotionConfigProvider). Mount in `App.tsx` around `<Routes>`.
4. Migrate `scrollIntoView` → `scrollToId` in Header:9, Hero:3, SectorUseCases:22.
5. Add reusable Framer wrappers (Reveal, StaggerGroup, TextSplit, Magnetic).
6. Wire Framer into ProblemSolution, UseCases, SocialProof, ContactForm, Footer.
7. Add GSAP-driven sections (MainSolution pinned, Benefits parallax, Hero IA parallax).
8. Header scroll-shrink with useScroll + useTransform.
9. Build SceneCanvas + useReducedMotion hook.
10. Build HeroScene (lazy, Suspense fallback static gradient).
11. Route code-splitting: `React.lazy` for Solucoes/Sobre/Auth/NotFound.
12. WhatsAppButton → motion.a.
13. Vite manualChunks for three/r3f/framer/gsap.
14. Cross-browser + reduced-motion QA + Lighthouse ≥85.
15. ScrollTrigger.refresh on route change.
