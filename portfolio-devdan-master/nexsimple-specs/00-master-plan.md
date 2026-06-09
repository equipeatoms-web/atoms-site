# 00 — Master Implementation Plan

Synthesizes specs 01 (positioning), 02 (visual), 03 (architecture), 04 (motion).

**Goal:** Lift the site from "well-styled corporate" → "Awwwards-tier dark-luxury portfolio" that translates the 8s `ATOM'S.` video's narrative arc (orbital → focus → growth → cradle → climax) into a scroll-driven storytelling experience.

## Convergent priorities across all 4 specs

| Theme | Spec 01 | Spec 02 | Spec 03 | Spec 04 |
|---|---|---|---|---|
| Hero rebuild | ✓ sharpen sub-head | ✓ #1 visual upgrade | ✓ R3F + Framer + GSAP | ✓ orbital cards + IA backdrop |
| Pinned horizontal MainSolution | — | ✓ #2 visual | ✓ GSAP scrub | ✓ focus-pull beat |
| Animated hairlines + scroll storytelling | — | ✓ #4 | ✓ GSAP timeline | ✓ section transitions |
| Real SocialProof data | ✓ #2 | ✓ #5 (badge halo) | — | ✓ KPI count-up climax |
| ContactForm signature reveal | ✓ #4 (Cal.com + pre-form list) | ✓ #7 asymmetric | ✓ Framer | ✓ lens flare beat |
| Orphan routes (`/sobre`, `/solucoes`) | ✓ #1 delete or rewrite | (flagged orphan components) | (route code-split) | — |
| Trust signals (GitHub, LinkedIn) | ✓ #5 | — | — | — |

## P0 — Infrastructure (blocking all visual work)

1. `npm install` framer-motion + gsap + @gsap/react + lenis + three + @react-three/fiber + @react-three/drei + @types/three (versions from spec 03 §1).
2. Create `src/lib/animations/` — `easings.ts` ✅, `variants.ts`, `gsap.ts`, `scroll.ts` (scrollToId helper).
3. Create `src/components/motion/` — `SmoothScrollProvider.tsx` ✅, `MotionConfigProvider.tsx`, `Reveal.tsx` ✅, `CountUp.tsx` ✅, `MagneticButton.tsx` ✅, `TextSplit.tsx`, `StaggerGroup.tsx`, `ScrollPin.tsx`.
4. Create `src/components/three/` — `SceneCanvas.tsx`, `HeroScene.tsx`, `ParticleField.tsx`, `OrbitalCards.tsx`.
5. Mount `SmoothScrollProvider` + `MotionConfigProvider` in `App.tsx` around `<Routes>`.
6. Migrate `scrollIntoView` → `scrollToId` in `Header.tsx:9`, `Hero.tsx:3`, `SectorUseCases.tsx:22`.

## P1 — Hero rebuild (single biggest visual win)

Apply spec 02 §5 + spec 04 §3.1 simultaneously:
- Asymmetric 12-col layout, full-bleed
- H1 → `clamp(64px, 11vw, 180px)` 4-line poetic composition (Eu construo o / sistema / de IA da / *sua empresa*)
- Per-char Framer reveal with blur-in (spec 04: ease `[0.16, 1, 0.3, 1]`, stagger 80–150ms)
- Big `IA` ghost backdrop, parallax via GSAP ScrollTrigger
- 3-layer aurora background (radials + grain + animated orbs) — spec 02 §5
- R3F backdrop: orbital glass cards + gold particle field (spec 04 §3.1)
- Magnetic primary CTA with conic sheen on hover (use `MagneticButton`)
- Meta sub-line: "Resposta em ≤ 24h · 4 vagas no mês"
- Scroll cue at bottom

## P1 — Section animations

| Section | Pattern |
|---|---|
| Header | `useScroll` → shrink padding; nav underline reveal on hover |
| ProblemSolution | `<Reveal direction="left">` + `<Reveal direction="right">` two columns; checkmark scale-punch stagger |
| MainSolution | GSAP `ScrollTrigger` pin (desktop) with stagger; Framer fallback (mobile) |
| UseCases | `<Reveal>` slide-up + hover `y:-6` + gradient border overlay; result clip-path reveal |
| SocialProof | `<Reveal>` + `<CountUp>` for KPIs; primary dots infinite pulse |
| Benefits | GSAP scrub parallax portrait + stack chips stagger + TextSplit paragraph word reveal |
| ContactForm | Headline italic offset + fields stagger 50ms + submit `whileTap` scale 0.97 |
| Footer | `<Reveal direction="up">` fade; social icons `whileHover={{ y: -2 }}` |
| WhatsAppButton | Spring entrance + infinite glow pulse |

## P2 — Polish & content fixes (per spec 01)

- Unify CTA labels: pick ONE ("Agendar 30 min" recommended) — change in `Header.tsx:43`, `Hero.tsx:37`, `ContactForm.tsx:80`
- Fix SocialProof placeholder grid → use real names (Íris, Lari, Ketoe, EstudioLooks) per `UseCases.tsx`
- Add GitHub + LinkedIn to `Footer.tsx` and `Benefits.tsx`
- Add "what you walk away with" 3-bullet list above ContactForm
- Spacing rhythm 3-tier: `py-40` tentpole / `py-24` narrative / `py-16` connective
- Bump body baseline to `text-[15px] leading-[1.65] font-light`
- Section H2s up to `text-5xl sm:text-6xl` serif italic for tentpole moments
- Step numbers in `MainSolution.tsx:21` from `text-border` (invisible) → `bg-gradient-accent bg-clip-text text-transparent`

## P3 — Optional / nice-to-have

- Cursor follower with `mix-blend-difference` (spec 02 §7.1)
- Cal.com inline embed in ContactForm (spec 01 §6.4)
- Real-data counter row in SocialProof (Supabase queries)
- Animated gold scan-line hairlines (replace flat `border-top`)
- Vite manualChunks for three/r3f/framer/gsap

## Execution order (≈ what we'll do this session)

1. ✅ Install deps
2. ✅ Save spec files
3. ✅ Pre-write infra files (easings, Reveal, CountUp, MagneticButton, SmoothScrollProvider)
4. → Finish infra: variants.ts, gsap.ts, scroll.ts, MotionConfigProvider, TextSplit, StaggerGroup, ScrollPin
5. → R3F: SceneCanvas, HeroScene, ParticleField, OrbitalCards
6. → Mount providers in App.tsx
7. → Migrate scrollIntoView → scrollToId
8. → Hero rebuild (full)
9. → Animate Header, ProblemSolution, UseCases, SocialProof, Benefits, ContactForm, Footer, WhatsAppButton
10. → Animate MainSolution with GSAP pin
11. → Run `npm run dev`, verify in browser, screenshot
12. → P2 polish (CTA unification, SocialProof real names, spacing rhythm)

P3 deferred unless time permits.
