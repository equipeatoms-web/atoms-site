# 04 — Motion Design Spec (from 8s video analysis)

**Source:** `WhatsApp Video 2026-05-26 at 2.52.11 PM.mp4` (Google Veo generated, vertical 9:16, ~8s)
**Frames extracted:** 32 @ 4fps → `frames/frame_001.jpg` … `frame_032.jpg`

## 1. Storyboard breakdown

| Beat | Time | Frames | What happens | Visual technique |
|---|---|---|---|---|
| **Establish** | 0–2s | 001–008 | Wide orbital composition. Subject centered, surrounded by 6–8 floating holographic dashboard cards (bar charts, line graphs, mini-dashboards). Brand wordmark `ATOM'S.` glowing behind/above head. Particle field drifting. | Orbital 3D arrangement, slow push-in, heavy bokeh, neon-on-black contrast |
| **Focus pull** | 2–4s | 009–016 | Subject raises hand toward camera. Cards begin to recede / blur. Narrative tension building. | Camera push-in, depth-of-field shift, gesture-driven focal point |
| **Conjure** | 4–5s | 017–020 | Hand projects upward — a chart materializes from his palm. | Particle convergence into shape, glow burst, scale-in from 0 |
| **Growth** | 5–6s | 021–024 | Bar chart appears in front. Bars rise left-to-right (ascending pattern). Trend arrow climbs up-right. | Staggered bar grow-in, easeOutExpo, trail line drawing along arrow |
| **Cradle** | 6–7s | 025–028 | He cradles the chart with palm underneath — supporting it. Composition is now centered & stable. | Anchor moment — minimal motion, stabilization |
| **Climax** | 7–8s | 029–032 | **Lens flare burst** overhead (anamorphic horizontal streak). Number reveal **`+12.8%`** large center-screen with horizontal progress fill. Subtitle (KPI line) appears. | Lens flare ramp-in, count-up number, progress bar fill, particle explosion |

## 2. Visual DNA to translate (NOT 1:1 copy)

| Element in video | Translate to site as | Reason |
|---|---|---|
| Neon green (#00FF7F-ish) holographic | **Gold** `hsl(38 33% 70%)` (already in design system) | Brand consistency. Don't rebrand to green. |
| Bokeh particle field (green sparkles drifting) | Gold/amber particle field, lower density, slower drift | Same texture, brand color, subtle not gimmicky |
| Orbital floating dashboard cards | Glass cards (use existing `.glass-strong`) orbiting in 3D | Reuses existing design language |
| `ATOM'S.` huge brand wordmark behind subject | `IA` (already in Hero.tsx:14 as `font-serif text-[10rem] text-muted/30`) — push larger, add glow + parallax | Echo the "big brand letter as backdrop" technique |
| Veo lens flare at climax | Gold lens flare during KPI section reveals | Reserved for emotional peaks only |
| Bar chart growth | Animated metric counters + bar growth in Benefits / SocialProof | Translates the "growth proof" beat to credibility KPIs |
| Center-staged subject | Hero's H1 + serif `em` ("sua empresa") becomes the focal point | The headline is the "subject" of our composition |

## 3. Section-by-section animation plan

### 3.1 Hero (`src/components/Hero.tsx`)
**Goal:** Replicate the orbital establishing shot — but with type as the subject, not a person.

- **Background canvas (R3F):** `<Canvas>` with:
  - `<Particles count={120}>` — gold particles drifting upward, slow (0.05–0.2 unit/s), depthWrite false, additive blending
  - `<OrbitalCards count={5}>` — 5 thin glass-card meshes orbiting the camera Y axis at varying radius (4–8), tilts ~15°, very slow rotation (0.03 rad/s)
  - Bloom postprocessing (`@react-three/drei` Bloom @ intensity 0.4, luminanceThreshold 0.7)
  - Camera fov 35, slow lookAt drift
  - Lazy-mounted with Suspense + reduced-motion fallback to static `bg-gradient-mesh`
- **Big `IA` backdrop:** scale Hero.tsx:14 to `text-[18rem]`, add `text-shadow` glow, parallax with scroll (GSAP `to(el, { y: -120, scrollTrigger })`)
- **H1 motion:** word-by-word fade-in with Framer Motion `staggerChildren: 0.08`, ease `[0.16, 1, 0.3, 1]`, blur 8px → 0
- **`em` "sua empresa":** delay extra 0.4s, animate underline draw with SVG `strokeDashoffset` 0→100% over 0.8s
- **CTAs:** Framer hover `whileHover={{ y: -2, boxShadow: var(--shadow-glow) }}`, tap scale 0.98
- **Magnetic cursor effect** on primary CTA (subtle 6px pull toward cursor on hover)

### 3.2 ProblemSolution + MainSolution (scroll trigger: "focus pull")
**Goal:** Echo beats 2–4s (cards receding, focus narrowing).

- GSAP `ScrollTrigger.pin` MainSolution for ~100vh
- Cards/items: enter with `clip-path: inset(100% 0 0 0)` → `inset(0 0 0 0)`, staggered 0.1s, ease `power3.out`
- Hairline (`div.hairline`) draws across viewport with `transform-origin: left`, `scaleX 0 → 1`, 0.6s

### 3.3 UseCases / Benefits (scroll trigger: "growth")
**Goal:** Echo beats 5–6s (bar chart growth).

- Each card has a "metric bar" — animate `width 0% → target` over 1.2s on enter
- Use Framer `useInView` + `useMotionValue` for **count-up numbers** (e.g., `0 → 87`) easeOutExpo
- Cards stagger in from below with `y: 60 → 0, opacity: 0 → 1`, blur 12px → 0, stagger 0.15s

### 3.4 SocialProof (scroll trigger: "cradle" — anchor moment)
**Goal:** Stabilize. Hero testimonial centered, large quote mark behind in glass.

- Big `"` (Instrument Serif, text-[14rem], opacity 0.08) behind testimonial — parallax scroll
- Avatar + name slide in from left, quote text from right (200ms offset)

### 3.5 ContactForm (scroll trigger: "climax")
**Goal:** Lens flare + final glow.

- Section background gets an SVG lens-flare (horizontal anamorphic streak, gold gradient, `mix-blend-mode: screen`) that fades in on scroll
- Submit button has a glow pulse loop (already in tailwind keyframes as `glow-pulse`) — but enhanced w/ Framer's `animate={{ boxShadow: [a, b, a] }}`
- Form field focus rings light up gold (already in design system via `--ring`)

### 3.6 Header
- Sticky header gets `backdrop-blur` + opacity ramp from 0 → `0.78` based on scroll position (GSAP)
- Nav links: hover underline reveal (left-to-right scale-X), gold color shift

### 3.7 Footer
- Gentle aurora gradient at bottom (radial-gradient, gold + subtle teal), slow drift via CSS `@keyframes`

## 4. Cinematic principles to apply globally

1. **Easing:** Default to `[0.16, 1, 0.3, 1]` (custom "expo-out") for entrances. Use `[0.65, 0, 0.35, 1]` (sineInOut) for loops. Never use `linear`.
2. **Stagger:** Multi-element entrances always stagger 80–150ms, never simultaneous.
3. **Blur-in:** All hero/headline reveals use `filter: blur(12px → 0)` paired with opacity. This is the "premium" feel.
4. **Push-in camera:** R3F camera does a 2s gentle z-push (z: 8 → 6) on hero mount.
5. **Lens flare reserved:** Use it only at the ContactForm CTA and maybe one KPI hit. Devalued if used everywhere.
6. **Particle field budget:** 120 particles max on desktop, 40 on mobile. Disable on `prefers-reduced-motion`.
7. **Audio:** None. Video has no sound, site stays silent.

## 5. Lenis smooth-scroll feel
- Lerp: `0.1` (default is fine, feels premium)
- Disabled on touch devices? **No** — keep on touch for consistency (the lib auto-detects and falls back gracefully)
- ScrollTrigger sync via `lenis.on('scroll', ScrollTrigger.update)` in mount

## 6. Performance ceiling
- Lighthouse target: Performance ≥ 85 on mobile (R3F is the main risk).
- LCP: Hero text must be SSR/HTML-rendered (it already is — R3F is just a backdrop, mount async).
- CLS: 0. R3F canvas takes `absolute inset-0`, no layout shift.
- Bundle: Three + R3F + drei + GSAP + Framer + Lenis ≈ 220KB gz. Acceptable. Code-split R3F hero into its own chunk.

## 7. Reduced-motion fallback
- `prefers-reduced-motion: reduce` → skip R3F entirely (replace with static `bg-gradient-hero`), disable Lenis (native scroll), disable all stagger entrances (jump to final state), keep hover micro-interactions.

## 8. Deliverables for implementation phase
1. `src/lib/animations/easings.ts` — exported easing curves
2. `src/lib/animations/motion-config.tsx` — Framer reduced-motion provider
3. `src/components/three/HeroCanvas.tsx` — R3F scene (lazy-loaded)
4. `src/components/three/Particles.tsx` — instanced particle field
5. `src/components/three/OrbitalCards.tsx` — orbiting glass cards
6. `src/components/motion/SmoothScrollProvider.tsx` — Lenis + ScrollTrigger sync
7. `src/components/motion/Reveal.tsx` — reusable `<Reveal>` wrapper (Framer + IO)
8. `src/components/motion/CountUp.tsx` — numeric counter
9. `src/components/motion/MagneticButton.tsx` — cursor-pull CTA
10. Edits to existing components: Hero, ProblemSolution, MainSolution, UseCases, SocialProof, Benefits, ContactForm, Footer, Header
