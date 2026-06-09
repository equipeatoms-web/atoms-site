# Agent 03 — Motion Storyboard (Awwwards-tier, holographic dark luxury)

**Authoring stack:** framer-motion + gsap/@gsap/react + lenis. No Three.js (removed).
**Direction:** NVIDIA/Tesla holographic + Apple glass. Continuous, silent, gold-on-black. Reduced-motion respected globally.
**Reference primitives already in `src/components/motion/`:** `Reveal.tsx`, `TextSplit.tsx`, `MagneticButton.tsx`, `CountUp.tsx`, `StaggerGroup.tsx`, `ScrollPin.tsx`, `MotionConfigProvider.tsx`, `SmoothScrollProvider.tsx`. This spec assumes those exist and only specifies new files/edits.

**Global easings (add to `src/lib/animations/easings.ts`):**
- `EXPO_OUT = [0.16, 1, 0.3, 1]` — entrances
- `EXPO_IN_OUT = [0.87, 0, 0.13, 1]` — pinned/horizontal scrolls
- `SOFT_OUT = [0.22, 1, 0.36, 1]` — micro UI (hover, focus)
- `SINE_IN_OUT = [0.65, 0, 0.35, 1]` — infinite loops (aurora, pulse)
- `MAGNETIC = [0.25, 0.46, 0.45, 0.94]` — magnetic pull spring approximation

---

## 1. Hero opening — first 3000 ms

Stagger anchor at `t = 0` (after fonts load + `useReducedMotion` check). Container is `<motion.section>` with `MotionConfig transition={{ ease: EXPO_OUT }}`. All transforms on GPU. CSS root sets `transform-style: preserve-3d; perspective: 1200px;`.

| Beat | Layer | t-start (ms) | Duration (ms) | From → To | Ease | will-change |
|---|---|---|---|---|---|---|
| 1a | Body bg gradient | 0 | 500 | `opacity 0 → 1` | EXPO_OUT | `opacity` |
| 1b | Aurora blob A (top-left, gold) | 0 | 500 | `opacity 0 → 0.55, scale 0.92 → 1` | EXPO_OUT | `transform, opacity` |
| 1c | Aurora blob B (bottom-right, amber) | 100 | 500 | `opacity 0 → 0.40, scale 0.9 → 1` | EXPO_OUT | `transform, opacity` |
| 1d | Aurora idle loop (infinite from 600ms) | 600 | 40000 | `translate ±40px / scale 1↔1.08` | SINE_IN_OUT | `transform` |
| 1e | Particle field (24 dots desktop / 12 mobile) | 200 | 800 | `opacity 0 → 0.6`; then `y -100% / 60s linear loop` | EXPO_OUT → linear loop | `transform, opacity` |
| 2a | `IA` backdrop wrapper (`Hero.tsx:14`) | 300 | 1200 | `opacity 0 → 0.3, scale 1.15 → 1.0, blur 24px → 0px` | EXPO_OUT | `transform, filter, opacity` |
| 2b | `IA` parallax primer | 500 | — | bind `useScroll` + `useTransform(scrollY, [0, 600], [0, -200])` | linear (scrub) | `transform` |
| 2c | `IA` glow shadow ramp | 800 | 700 | `text-shadow 0 0 0 → 0 0 60px gold/25%` | SOFT_OUT | `filter` |
| 3a | H1 line 1 — per-word | 500 | 700 each | `opacity 0 → 1, y 24 → 0, blur 8 → 0` stagger 60 ms | EXPO_OUT | `transform, filter, opacity` |
| 3b | H1 line 2 — per-word | 950 | 700 each | same, stagger 60 ms | EXPO_OUT | same |
| 3c | `em` "sua empresa" underline (SVG) | 1700 | 800 | `strokeDashoffset 100% → 0` | EXPO_OUT | `stroke-dashoffset` |
| 3d | Subhead paragraph | 1300 | 600 | `opacity 0 → 1, y 12 → 0` | EXPO_OUT | `transform, opacity` |
| 4a | Agent diagram svg lines (draw) | 1500 | 800 | `pathLength 0 → 1` (Framer `path`) | EXPO_OUT | `stroke-dashoffset` |
| 4b | Agent diagram nodes | 1900 | 500 stagger 80 | `scale 0 → 1, opacity 0 → 1` | back.out(1.4) (GSAP) | `transform, opacity` |
| 4c | Diagram pulse loop (infinite from 2400ms) | 2400 | 2600 each | inner ring `scale 1↔1.06, opacity 0.6↔1` | SINE_IN_OUT | `transform, opacity` |
| 5a | Primary CTA | 2000 | 600 | `opacity 0 → 1, y 16 → 0`, then MagneticButton armed | EXPO_OUT | `transform, opacity` |
| 5b | Secondary CTA (WhatsApp) | 2100 | 600 | same, 100 ms offset | EXPO_OUT | `transform, opacity` |
| 5c | CTA halo loop (infinite from 2700ms) | 2700 | 3200 | `box-shadow blur 28 → 44 → 28px, gold/25 → 40 → 25%` | SINE_IN_OUT | `filter` |
| 5d | Scroll cue (already present) | 2800 | 200 fade + loop | `opacity 0 → 1; y 0↔6 loop 1500ms` | SINE_IN_OUT | `transform, opacity` |

**Reduced motion:** all beats jump to final state at `t=0`. Aurora idle, particles, glow loops and pulse are killed (CSS `animation: none` + `motion.div` with `transition={{ duration: 0 }}`). Magnetic pull disabled (renders plain `<button>`).

---

## 2. Section-to-section video transitions (3 × 5 s)

Each video sits in a dedicated `<section data-transition>` between page sections, full-bleed (`w-screen h-[80vh]` desktop, `h-[60vh]` mobile). Mounted via React lazy + `<video muted playsInline preload="metadata" poster>`. Playback driven by `IntersectionObserver` (start playing when 20% in view, pause when out).

Scroll-driven layering uses GSAP `ScrollTrigger` with `scrub: 0.6` so video reveal locks to scroll. Lenis lerp `0.1`. No audio anywhere (`muted` enforced).

### 2.1 Transition T1 — Hero → Problema
- **Theme:** dataflow neon emerging from darkness.
- **Container:** `position: relative; height: 80vh; background: #000;`. Video `position: absolute; inset: 0; object-fit: cover; opacity: 0;`.
- **Reveal:** clip-path mask. ScrollTrigger `start: "top 90%"`, `end: "top 30%"`, `scrub: 0.6`:
  - video `opacity 0 → 1` over first 30% of progress
  - `clip-path: inset(50% 0 50% 0) → inset(0 0 0 0)` over full progress
  - `scale 1.06 → 1.0` (subtle push-out)
- **Layered overlays:**
  - Gold radial vignette (`background: radial-gradient(circle at 50% 50%, transparent 40%, #000 90%)`) `opacity 0.5 → 0.2` on scrub.
  - SVG scanline (1 px gold, `mix-blend-mode: screen`) sweeps top → bottom over the full reveal (`y: -100% → 100%`).
  - Center mask-text "PARA" set in `text-[clamp(4rem,12vw,11rem)] font-serif` with `background: url(#videoframe); background-clip: text; -webkit-text-fill-color: transparent`. Fades in at 60% progress, fades out at end.
- **Exit:** ScrollTrigger `start: "bottom 80%"`, `end: "bottom 20%"`, `scrub: 0.6` reverses `clip-path: inset(0) → inset(50% 0 50% 0)` and `opacity 1 → 0`.

### 2.2 Transition T2 — Casos (UseCases) → Capacitação (TeamEnablement)
- **Theme:** light-grid hand-off; team unlocks scale.
- **Container:** same shell, but the reveal is **horizontal wipe** instead of vertical clip.
- **Reveal:** `clip-path: inset(0 50% 0 50%) → inset(0 0 0 0)` driven by scrub (single horizontal expand from center). Video `opacity 0 → 1` in first 20% of progress; `filter: blur(8px) → blur(0)` over 50%.
- **Layered overlays:**
  - Two glass hairlines (`h-px bg-gradient-to-r from-transparent via-gold to-transparent`) at 25 % and 75 % of viewport height, `scaleX 0 → 1` from `transform-origin: center`.
  - Floating word "ESCALA" right-aligned, Framer `useTransform(scrollY, [...], [80, -40])` for slow parallax, blends `mix-blend-mode: overlay`.
- **Exit:** mirrors reveal in reverse (inset 0 → 50% horizontal).

### 2.3 Transition T3 — Sobre (Benefits/About-style block) → Contato
- **Theme:** climax, lens-flare hand-off into contact CTA.
- **Container:** sticky pin for 100 vh using GSAP `ScrollTrigger.pin`. Video plays full 5 s while pinned; user scrolls "through" it.
- **Reveal:** opacity ramp tied to pin progress; clip-path stays full. Add `filter: saturate(0.9) → saturate(1.1)` linear scrub.
- **Layered overlays:**
  - Anamorphic lens-flare SVG (horizontal gold streak `1600 × 60`, `mix-blend-mode: screen`) `opacity 0 → 0.9 → 0` peaking at 60% progress (Framer keyframe array).
  - Headline "VAMOS CONSTRUIR" reveals via TextSplit per-word (stagger 80 ms, EXPO_OUT) at 40% progress; persists until exit.
  - Bottom-edge gradient ramp (`linear-gradient(to bottom, transparent 70%, #000 100%)`) fades section into ContactForm bg.
- **Exit:** ScrollTrigger releases pin; video opacity drops to 0 over the last 15 % of pin distance.

### Reduced-motion fallback for all 3 transitions
Replace `<video>` with a `<div class="aurora-still">` containing the existing radial gold gradient + a still SVG of the headline word. ScrollTrigger removed; only a single Framer `Reveal` fade-in (300 ms). Container height drops to `40vh` to keep flow tight.

---

## 3. Scroll-driven per section

| Section | File | Effect | Trigger / params | Easing |
|---|---|---|---|---|
| Header | `Header.tsx` | shrink + bg blur on scroll | `scrollY > 24` → `height 80 → 56px, bg rgba 0/0/0/0 → 0/0/0/0.7, backdrop-blur 0 → 12px` over 200 ms | SOFT_OUT |
| Hero | `Hero.tsx:14` | `IA` backdrop parallax | `useScroll` `useTransform([0,600],[0,-200])` y | linear scrub |
| Hero | `Hero.tsx` | foreground parallax (CTAs) | `useTransform([0,400],[0,-40])` y | linear scrub |
| ProblemSolution | `ProblemSolution.tsx` | two cols slide in | left col `x -80 → 0, opacity 0 → 1`; right col `x 80 → 0, opacity 0 → 1`; stagger 120 ms; `viewport={{ once:true, margin:"-15%" }}` | EXPO_OUT 700 ms |
| MainSolution (≥1024px) | `MainSolution.tsx` | pinned horizontal scroll | GSAP `ScrollTrigger.pin` for `100vh × cards.length`; container `x: 0 → -(scrollWidth - innerWidth)`, `scrub: 0.8` | EXPO_IN_OUT |
| MainSolution (<1024px) | same | Framer stagger vertical | `staggerChildren: 0.12`, `y 32 → 0, opacity 0 → 1` | EXPO_OUT 600 ms |
| UseCases | `UseCases.tsx` / `SectorUseCases.tsx` | card stagger + 3D tilt hover | enter: `y 60 → 0, opacity 0 → 1, blur 10 → 0`, stagger 150 ms. Hover: `rotateX/rotateY` capped ±6° via pointer-position → motion values, spring `{ stiffness: 180, damping: 18 }` | EXPO_OUT 700 ms |
| TeamEnablement | `TeamEnablement.tsx` | step cards reveal sequentially | each step `clip-path: inset(100% 0 0 0) → inset(0)`, 600 ms, stagger 200 ms tied to `whileInView` | EXPO_OUT |
| TeamEnablement | same | before/after line morph | SVG `<path>` morphs via GSAP `attr: { d: targetD }`, 1200 ms, triggers at 50 % in view | EXPO_IN_OUT |
| SocialProof | `SocialProof.tsx` | KPI count-up | `CountUp` from 0 → target, 1800 ms; trigger when in view | EXPO_OUT |
| SocialProof | same | dot pulse | infinite `scale 1↔1.4, opacity 0.6↔0` 1800 ms loop, `transform-origin: center` | SINE_IN_OUT |
| Benefits | `Benefits.tsx` | portrait/diagram parallax | `useTransform([0,800],[0,-80])` on diagram wrapper | linear scrub |
| Benefits | same | bullet stagger | `staggerChildren: 0.08, y 18 → 0, opacity 0 → 1` | EXPO_OUT 500 ms |
| ContactForm | `ContactForm.tsx` | heading SVG underline draw | `pathLength 0 → 1`, 900 ms on first in-view | EXPO_OUT |
| ContactForm | same | field stagger | `staggerChildren: 0.05, opacity 0 → 1, y 8 → 0` | SOFT_OUT 400 ms |
| ContactForm | same | submit halo on view | enter `box-shadow 0 0 0 → 0 0 32px gold/40`, then loop `28 → 44 → 28` 3200 ms | SOFT_OUT then SINE_IN_OUT |
| Footer | `Footer.tsx` | scan-line draw on view | full-width `h-px` div, `scaleX 0 → 1` from `transform-origin: left`, 1000 ms | EXPO_OUT |
| Footer | same | aurora gradient idle | CSS `@keyframes aurora` 40s loop on `background-position` | SINE_IN_OUT |

Lenis: keep default `lerp 0.1`. Hook `lenis.on('scroll', ScrollTrigger.update)` and call `ScrollTrigger.refresh()` after font load and on resize (debounced 200 ms).

---

## 4. Micro-interactions inventory

| # | Interaction | Target(s) | Params | Implementation file |
|---|---|---|---|---|
| 1 | Cursor follower | global (pointer devices only) | 24 px gold dot, `mix-blend-mode: difference`, follows with `spring { stiffness: 350, damping: 28, mass: 0.4 }` (≈ 0.08 s lag). Hides on `pointer:coarse` | `motion/CursorFollower.tsx` (new) |
| 2 | Magnetic CTAs | `MagneticButton` instances | activation radius 50 px, pull strength 0.25 (button moves `dx * 0.25`); release spring `{ stiffness: 200, damping: 18 }` | existing `MagneticButton.tsx` (verify radius/strength) |
| 3 | Link underline reveal | nav links, footer links | `::after` 1 px bar, `transform: scaleX(0)`, origin `left`; hover `scaleX(1)`, 280 ms `cubic-bezier(0.22,1,0.36,1)` | `Header.tsx`, `Footer.tsx` (CSS) |
| 4 | Button glow swell | primary CTAs | hover: `box-shadow 0 0 40px hsl(38 33% 70% / 0.25) → 0 0 60px hsl(38 33% 70% / 0.5)`; 320 ms SOFT_OUT | global `.btn-primary` in `index.css` |
| 5 | Form field focus underline draw | `input`, `textarea` in ContactForm | bottom 2 px bar, `scaleX 0 → 1` from `transform-origin: center` on `:focus-within`, 280 ms SOFT_OUT; color `gold` | `ContactForm.tsx` |
| 6 | Glass card 3D tilt | UseCases cards, Benefits cards | pointer-tracked `rotateX/Y` capped ±6°, plus `translateZ(0)` to force GPU; spring `{ stiffness: 180, damping: 18 }`; resets on leave | `motion/TiltCard.tsx` (new) |
| 7 | Hairline scan on view | section dividers | `h-px` gradient bar `scaleX 0 → 1`, origin left, 900 ms EXPO_OUT, `viewport={{ once: true }}` | `motion/Hairline.tsx` (new) |
| 8 | Section label hover | small caps eyebrow labels | `letter-spacing 0.08em → 0.18em, color muted → gold` over 240 ms SOFT_OUT | `index.css` `.eyebrow:hover` |
| 9 | Hover word highlight | italics "sua empresa", "próxima" | wrap in `<span class="hl">`, on hover `background: linear-gradient(transparent 60%, hsl(38 33% 70% / 0.35) 60%); background-size: 0% 100%; background-no-repeat;` then animate `background-size 0% → 100%` 320 ms SOFT_OUT | `index.css` `.hl:hover` |
| 10 | Scroll cue bounce | Hero scroll arrow | infinite `y 0 → 6 → 0` 1500 ms SINE_IN_OUT, `opacity 0.6 ↔ 1` | `Hero.tsx` (verify present) |
| 11 | Card border ignite on hover | glass cards | `border-color hsl(0 0 100% / 0.06) → hsl(38 33% 70% / 0.5)`, plus inset `box-shadow 0 0 0 1px hsl(38 33% 70% / 0.3)` 280 ms SOFT_OUT | `index.css` `.glass:hover` |
| 12 | WhatsApp floater entrance | `WhatsAppButton.tsx` | after 30 s on page (or 60 % scroll), `scale 0.6 → 1, opacity 0 → 1`, 500 ms back.out(1.6); idle pulse `box-shadow` 3200 ms loop | `WhatsAppButton.tsx` |

---

## 5. Performance budget

- **Max concurrent animations:** 8 transform/opacity animations active simultaneously on desktop, 4 on mobile. Loops (aurora, particles, dot pulse, halo) count as 1 each. Throttle by pausing offscreen ScrollTriggers via IntersectionObserver `rootMargin: "200px"`.
- **Mobile / low-end disable matrix** (single `matchMedia` resolved once in `MotionConfigProvider`):
  - `(max-width: 768px)` → particle count 24 → 12, disable cursor follower, disable tilt cards, disable horizontal pinned scroll (fallback Framer stagger).
  - `(prefers-reduced-motion: reduce)` → kill all loops, kill ScrollTrigger, replace transition videos with static fallbacks, all entrances jump to end-state.
  - `navigator.hardwareConcurrency <= 4 || navigator.deviceMemory <= 4` → same as mobile downgrade, plus disable aurora idle loop and reduce video reveal to opacity-only (no clip-path scrub).
- **GPU hints:** every animated element gets `transform: translateZ(0); will-change: transform, opacity` only during animation; remove `will-change` on animation end (`onAnimationComplete`) to free layers. Sections wrapping heavy animations get `contain: layout paint`.
- **Lenis interaction with native scroll:**
  - Anchor links (`<a href="#x">`): intercept click, call `lenis.scrollTo(target, { offset: -80, duration: 1.2, easing: t => 1 - Math.pow(1 - t, 3) })`.
  - Focus-driven scroll (`element.focus()`): listen to `focusin`, if target offscreen call `lenis.scrollTo(target, { offset: -120 })` to honor a11y.
  - Disable Lenis on `prefers-reduced-motion` (native scroll only) and on touch devices that already have native smooth scroll (`window.matchMedia('(pointer: coarse)')`) keep Lenis (consistent on iOS/Android).
- **Lazy boundaries:** videos and the GSAP-heavy `MainSolution` pin code-split via `React.lazy` + `Suspense fallback={<div aria-hidden style={{ height: '80vh' }} />}`.

---

## 6. Implementation guidance

### 6.1 New files to add

| Path | Purpose |
|---|---|
| `src/lib/animations/easings.ts` | export `EXPO_OUT`, `EXPO_IN_OUT`, `SOFT_OUT`, `SINE_IN_OUT`, `MAGNETIC` |
| `src/lib/animations/scroll.ts` | shared GSAP/ScrollTrigger registration + Lenis sync helpers (`registerScroll`, `refreshScroll`) |
| `src/lib/animations/useDeviceTier.ts` | reads matchMedia + `hardwareConcurrency` once, returns `'high' \| 'mid' \| 'low' \| 'reduced'` |
| `src/components/motion/CursorFollower.tsx` | 24 px gold dot, spring follow |
| `src/components/motion/TiltCard.tsx` | pointer-tracked 3D tilt wrapper |
| `src/components/motion/Hairline.tsx` | reveal-on-view 1 px scan line |
| `src/components/motion/AuroraBackdrop.tsx` | layered radial gradients + idle loop (no Three) |
| `src/components/motion/ParticleField.tsx` | DOM/SVG particles (24/12), respects reduced-motion |
| `src/components/motion/ParallaxLayer.tsx` | wrapper using `useScroll` + `useTransform` for translate Y |
| `src/components/motion/VideoTransition.tsx` | shell for the 3 transitions (props: `src`, `posterSrc`, `revealMode: 'vertical' \| 'horizontal' \| 'pin'`, `overlayText`) |
| `src/components/motion/HorizontalScrollPin.tsx` | desktop pinned horizontal scroll wrapper (uses ScrollPin under the hood) |
| `src/components/motion/UnderlineSVG.tsx` | reusable SVG underline with `pathLength` draw |

### 6.2 Files to modify

| Path | Edit |
|---|---|
| `src/App.tsx` | wrap tree in `SmoothScrollProvider` (already exists) and `MotionConfigProvider`; mount `CursorFollower` once at root (pointer-fine only) |
| `src/main.tsx` | ensure GSAP plugins registered once (`gsap.registerPlugin(ScrollTrigger)`) |
| `src/components/Header.tsx` | bind shrink/blur to `scrollY` using `useScroll` (~line 1–40); add `.nav-link` underline classes |
| `src/components/Hero.tsx` | line 14 `IA` backdrop: wrap in `ParallaxLayer` (y -200) + add glow `text-shadow`; convert headline to `TextSplit` per-word stagger; wrap CTAs in `MagneticButton`; mount `AuroraBackdrop` + `ParticleField` as siblings of the existing background; replace static H1 spans with motion variants |
| `src/components/ProblemSolution.tsx` | wrap left/right columns in `<Reveal direction="left">` and `<Reveal direction="right">`, stagger 120 ms |
| `src/components/MainSolution.tsx` | gate desktop vs mobile via `useDeviceTier`; desktop wraps content in `HorizontalScrollPin`; mobile in `StaggerGroup` |
| `src/components/UseCases.tsx` / `src/components/SectorUseCases.tsx` | wrap card grid in `StaggerGroup`; wrap each card in `TiltCard` |
| `src/components/TeamEnablement.tsx` | wrap steps in `StaggerGroup` with `clip-path` variant; add `MorphPath` SVG component inline for before/after morph |
| `src/components/SocialProof.tsx` | wrap KPIs in `CountUp`; add `.dot-pulse` class loop |
| `src/components/Benefits.tsx` | wrap diagram in `ParallaxLayer y={-80}`; wrap bullets in `StaggerGroup` |
| `src/components/ContactForm.tsx` | wrap heading word in `UnderlineSVG`; wrap fields in `StaggerGroup` 50 ms; add focus underline CSS; wrap submit in `MagneticButton` |
| `src/components/Footer.tsx` | add `Hairline` at top; aurora keyframes already in CSS — verify or add |
| `src/components/WhatsAppButton.tsx` | add 30 s `setTimeout` mount + entrance variant + halo loop |
| `src/index.css` (or `index.css`) | add keyframes `aurora`, `pulse-dot`, `glow-pulse`; add utility classes `.glass:hover`, `.hl`, `.eyebrow:hover`, `.nav-link::after` |
| `src/pages/Index.tsx` | insert 3 `<VideoTransition>` between sections: after Hero, after UseCases, after Benefits/Sobre |

### 6.3 Order of implementation (dependency chain)

1. `lib/animations/easings.ts` + `lib/animations/scroll.ts` + `useDeviceTier.ts` — foundation.
2. `MotionConfigProvider` audit (ensure exposes reduced-motion + device tier context).
3. `AuroraBackdrop`, `ParticleField`, `Hairline`, `UnderlineSVG`, `ParallaxLayer` — pure visual primitives, no deps on sections.
4. `CursorFollower`, `TiltCard` — pointer primitives, hooked into `App.tsx` root.
5. `HorizontalScrollPin`, `VideoTransition` — section-shell primitives (need scroll.ts).
6. Hero edits (uses everything above).
7. Section-by-section edits in render order: Header → ProblemSolution → MainSolution → UseCases → TeamEnablement → SocialProof → Benefits → ContactForm → Footer.
8. Insert `<VideoTransition>` in `Index.tsx`.
9. `WhatsAppButton` 30 s entrance.
10. Pass: audit `will-change`, verify `prefers-reduced-motion` fallbacks across every primitive and section (toggle in DevTools), Lighthouse mobile run, ScrollTrigger refresh on font load + resize.

---

**End of storyboard.**
