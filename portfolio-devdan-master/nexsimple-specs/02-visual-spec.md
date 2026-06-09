# 02 — Visual Spec (Awwwards-Tier Aesthetic Audit)

Read-only audit of the dark-luxury landing page. Target: editorial scroll + dark luxury + glassmorphism/aurora. All paths relative to project root `nexsimple-ai-spark-main/`.

---

## 1. Typography Hierarchy Critique

**Current state**

- Hero H1: `text-5xl sm:text-6xl lg:text-7xl leading-[1.05]` (`src/components/Hero.tsx:21`). At lg this is ~72px. For an Awwwards hero, this is conservative — peers ship 120–180px display.
- Section H2s are tiny: `text-3xl sm:text-4xl` (`MainSolution.tsx:13`, `SocialProof.tsx:15`, `Benefits.tsx:25`). The gap between H1 (72px) and H2 (36px) is too soft — there is no editorial cadence.
- Body sits at `text-sm` (14px) almost everywhere (`ProblemSolution.tsx:24`, `MainSolution.tsx:14, 23`, `UseCases.tsx:47`, `Benefits.tsx:28`). Editorial dark sites usually anchor body at 16–18px with relaxed line-height ~1.7.
- Leading uses `leading-[1.05]` on H1 (good — tight display) but `leading-relaxed` (1.625) and `leading-loose` (2.0) on body — `leading-loose` is too airy for `text-sm`; the cap-height is small, the lines feel stranded (`Benefits.tsx:28,34,37`).
- `.font-serif` is only applied at hero, section headings, and the giant ghost word "IA" (`Hero.tsx:12`). Numbers (`MainSolution.tsx:21`) use `font-serif text-4xl text-border` — beautiful but invisible (`text-border` = `#1e1e1e`, basically black-on-black).
- Weights are flat: body is 400 throughout, headings rely on serif. Missing weight contrast (e.g., `font-light` 300 for body to compress, paired with full serif display).

**Recommendations**

- Push hero H1 to `clamp(64px, 11vw, 180px)` with `leading-[0.95]` and `tracking-[-0.04em]`. Allow line breaks to be intentional, not responsive — use `<br>` to compose a 2 or 3-line poem.
- Promote Instrument Serif italics as a distinct register (already used at `Hero.tsx:24`, `ContactForm.tsx:43`). Reserve italics for one keyword per section to act as the "lyrical pivot".
- Introduce a display-mid step between H1 and H2: `text-5xl sm:text-6xl` for section H2s in marquee moments (UseCases intro, ContactForm CTA). Keep `text-3xl` only for inline subheads.
- Body baseline: bump `text-sm` to `text-[15px]` with `leading-[1.65]` and `font-light`. Use `text-[13px]` only for meta/labels.
- Make the ghost word "IA" (`Hero.tsx:12-15`) a recurring device: one giant outlined serif word per major section, sitting behind content at ~`text-[14rem]` and `text-foreground/[0.04]`.
- Add `tracking-[-0.02em]` to all serif displays (already in `.font-serif`) and `tracking-[-0.01em]` to body for tighter editorial rhythm.

---

## 2. Color & Light Usage

**Where gold currently lives**

- Primary CTA fill (`Hero.tsx:35`, `Header.tsx:41`, `ContactForm.tsx:78`).
- Italic accent word (`Hero.tsx:24`, `ContactForm.tsx:43`).
- List arrows (`ProblemSolution.tsx:36`), result lines (`UseCases.tsx:48`).
- `shadow-glow` on primary CTA and WhatsApp button (`Hero.tsx:35`, `WhatsAppButton.tsx:14`).

**Where gold is missed**

- The mesh background (`index.css:54-56`) is set to 5–7% opacity gold — at fixed attachment it disappears entirely against the body. Either crank to 10–14% in pockets or render aurora blobs (see §5).
- Step numbers in `MainSolution.tsx:21` (`text-border`) read invisible. They should be the editorial heroes — render in `text-foreground/10` outlined serif OR `bg-gradient-accent bg-clip-text text-transparent`.
- Hairlines (`Index.tsx:17,19,21,23,25`) are pure `border`. A thin animated gold scan-line on scroll (gradient with `mask-image`) would tie sections together.
- No gold on focus rings — Tailwind defaults will show generic blue.
- The hero radial gradient (`--gradient-hero`, `index.css:51`) sits at 6–8%. Compose two more layered radials at top-left and bottom (offset) to read as aurora.

**Opportunities for luminance**

- Add a `--gradient-aurora` layer: 3 displaced radial gradients (gold + warm amber + faint cyan glaze at 4%) animated with low-frequency `transform` translation. Cyan/teal at 3–5% will keep it luxury, not loud.
- Promote `--shadow-glow` to a hovering "atmosphere" around the hero CTA and the centered `Daniel — Engenheiro de IA` chip (`SocialProof.tsx:28-32`). Today the dot is a 6px circle; an actual gold pulse (radial glow + animated scale) elevates the badge to a halo.
- Gold-on-glass: gold border at 12% (`--glass-border`) is correct. Push to a conic-gradient sheen on hover (a slow rotating 1px conic from gold → transparent → gold) — same trick as Linear/Vercel signature cards.

---

## 3. Spacing & Rhythm

**Current state**

- Every section ships `py-20` (`ProblemSolution.tsx:16`, `MainSolution.tsx:10`, `UseCases.tsx:34`, `SocialProof.tsx:10`, `Benefits.tsx:8`). The cadence is flat and metronomic.
- Hero is `pt-32 pb-20` (`Hero.tsx:6`) — 128/80. The bottom feels rushed relative to the top.
- All grids use `gap-px` over `bg-border` (`ProblemSolution.tsx:19`, `MainSolution.tsx:18`, `UseCases.tsx:37`, `SocialProof.tsx:27`) — a 1px hairline grid. Tight, consistent, but every section uses the same trick. The repetition flattens hierarchy.
- Container is `max-w-4xl` at hero (`Hero.tsx:9`) then default container (1400px) for everything below — but the inner content is left-anchored only at hero; the rest centers within container with no asymmetry.

**Recommendations**

- Use a 3-tier vertical rhythm: `py-40` for tentpole sections (Hero, UseCases, ContactForm), `py-24` for narrative sections (ProblemSolution, MainSolution, Benefits), `py-16` for connective tissue. Forces a heartbeat instead of a flatline.
- Break the container at one moment per page: a full-bleed UseCases or SocialProof that escapes the 1400px column entirely.
- Asymmetric grid in Hero: today everything left-aligned in `max-w-4xl`. Push the H1 left, drop the paragraph + CTAs into a right column offset down by ~120px, and let the giant `IA` ghost word actually bleed off-canvas to the right.
- Add `pl-[15vw]` indents on alternating sections to drift content left/right — editorial rag.
- ContactForm form is centered `max-w-xl` (`ContactForm.tsx:52`) — that is the most generic possible. Move it to a 2-column: left = giant serif quote / signature, right = form glass card.

---

## 4. Glass Surface Placement

**Where glass currently lives**

- Header bar (`Header.tsx:22`), mobile menu drawer (`Header.tsx:52`).
- ProblemSolution wrapper, MainSolution wrapper, UseCases wrapper, SocialProof grid wrapper — all use `glass` on the grid (`ProblemSolution.tsx:19`, `MainSolution.tsx:18`, `UseCases.tsx:37`, `SocialProof.tsx:27`).
- Hero secondary CTA (`Hero.tsx:41`), Benefits portrait card (`Benefits.tsx:12`), ContactForm card (`ContactForm.tsx:52`), WhatsApp button (`WhatsAppButton.tsx:14`).

**Missed glass moments**

- **Hero CTA cluster** — primary CTA is solid gold; add a glass receipt-style spec card (e.g., "30 min · vídeo · sem custo") floating to the right of the CTAs with `glass glass-highlight` and inset shadow.
- **MainSolution step cards** — currently use `bg-card/60` inside a glass grid (`MainSolution.tsx:20`). Each card should itself be `glass-strong` so the inner cells gain individual depth.
- **Stack pills** (`Benefits.tsx:46-50`) — flat border pills. Convert to `glass` chips so they catch light and feel tactile.
- **Quote/badge moments** — `SocialProof.tsx:28` is a flat row inside the grid. Replace with a true glass capsule, gold-dot pulse, and inset white highlight.
- **Floating scroll progress / section indicator** — vertical glass rail with current section name, fixed right.
- **WhatsAppButton** already uses `glass glass-highlight` (`WhatsAppButton.tsx:14`) but combines with `bg-gradient-primary/80` which kills the translucency — drop the gradient, lean on glass + glow only.

**Header upgrade**

- Today the header glass is a fixed-width capsule. At scroll = 0, shrink the glass to half-width and shift it slightly translucent; on scroll, expand to full container, increase blur intensity, drop in a subtle gold underline beneath the active section. Use `scroll-driven animations` or IntersectionObserver.

---

## 5. Hero Specification (Concrete)

**Layout: asymmetric 12-column composition**

- Container: full-bleed (`100vw`), inner safe-area 1400px, vertical: `min-h-[100svh]`, anchored content baseline at ~62% from top.
- Columns 1–7: oversized serif H1 stack, 4 lines deep, mixed weights via italics. Columns 8–12: meta column (section-label, paragraph, CTA cluster, "scroll" indicator). Right column starts ~120px below H1 baseline (asymmetric drop).
- Bottom-left: a vertical column of micro-meta — Brazil dot, year, version tag (mirrors editorial sites like Cosmos).

**Background — aurora layered stack (3 layers, all `position: absolute; inset: 0`)**

1. Base: deeper version of `--gradient-hero` with two extra radials at top-left (gold 12% → transparent 50%) and bottom-right (warm amber 8% → transparent 55%).
2. Mid: animated SVG grain (~3% opacity) with `mix-blend-mode: overlay` for film texture.
3. Top: floating large blurred orbs — 2 to 3 `div`s, `w-[40vw] h-[40vw]`, `rounded-full`, `blur-3xl`, gold 14% and amber 8%, slow `translate` + `rotate` keyframes (40–60s loops, opposing directions).
4. Optional 4th: WebGL shader plane (react-three-fiber) with a flow-noise gradient, masked to ~15% opacity. Falls back to layers 1–3 gracefully.

**Typography composition**

- Line 1: `Eu construo o` — `font-serif`, `font-light`, `text-[clamp(72px,9vw,140px)]`, `text-foreground/95`.
- Line 2: `sistema` — same scale, but `italic`, gold `text-primary`, slightly indented (`pl-[6vw]`).
- Line 3: `de IA da` — back to roman, foreground.
- Line 4: `sua empresa.` — italic gold, with a hand-drawn underline SVG that draws on scroll-into-view.
- Ghost `IA` watermark behind type (`Hero.tsx:12`) scaled to `text-[clamp(280px,28vw,500px)]`, color `text-foreground/[0.035]`, sitting bottom-right, partially bleeding past viewport.

**CTA treatment**

- Primary: gold solid, but with three layered states:
  - Resting: solid gold + `shadow-[0_0_40px_hsl(38_33%_70%/0.25)]`.
  - Hover: gradient sweep (conic gold→amber→gold) rotating across the surface; lift `translate-y-[-2px]`; glow intensifies to 60px / 0.45.
  - On click: brief 200ms scale 0.98 with inset shadow.
- Secondary: keep glass, but add an animated underline reveal under the label ("Ver casos reais" with a 1px gold line that draws left-to-right on hover, 400ms ease).
- Below CTAs: a tiny meta-line "Resposta em ≤ 24h · 4 vagas no mês" — editorial signal of scarcity.

**Scroll cue**

- Bottom-center vertical thin gold line (`h-16 w-px bg-gradient-to-b from-primary to-transparent`) with a small "scroll" rotated 90°. Animates subtly down on a 2s loop.

---

## 6. Scroll Storytelling Sections

Four scroll-triggered moments. Suggested stack: Framer Motion + `useScroll`/`useTransform`, GSAP ScrollTrigger if budgeted.

**M1. Hero → ProblemSolution handoff (text mask reveal)**

- Pin the hero for ~1.2 viewports. The H1 morphs: italic gold word "sua empresa" expands and translates upward; behind it the `ProblemSolution` "O que não funciona" panel slides into the right half. Net: hero never "ends" — it dissolves into the contrast grid. Upgrades `ProblemSolution.tsx` from a static py-20 grid to a transition.

**M2. MainSolution as horizontal pinned scroll**

- Pin `MainSolution.tsx:18` for the height of the 4 steps. Translate the grid horizontally (`x: -75vw`) as user scrolls. Each step becomes a full-screen moment: giant `01` ghost numeral, step name in serif display, description as right-column. Replaces the 4-up flat grid with a cinematic sequence. Standard Awwwards device (Cosmos, Locomotive).

**M3. UseCases mosaic parallax**

- Each case article (`UseCases.tsx:39`) gets a vertical translate based on scroll progress with different rates (`y: -10%` for odd, `y: -25%` for even). Combined with a tilted entrance (rotateX 12deg → 0). On hover, the article lifts and a subtle gold scanline crosses the card.

**M4. ContactForm "signature" reveal**

- Pin the section; the heading "Sua empresa pode ser a próxima que eu construo" types/strokes in via SVG path animation (handwritten gold underline draws under "próxima"). The form glass card fades up from below as the headline locks. Adds intentionality to the conversion moment.

---

## 7. Micro-interactions List

1. **Cursor follower** — soft 24px gold dot blended `mix-blend-difference`, with a 40px ring lagging behind via spring physics. Expands and gains label on hoverable elements (button → "click", link → "go").
2. **Magnetic CTAs** — primary buttons attract the cursor within a 60px radius; `transform` lerps toward pointer position. Applies to `Hero.tsx:33`, `Header.tsx:39`, `ContactForm.tsx:75`.
3. **Button glow swell on hover** — `shadow-glow` value transitions from 40px/0.25 to 60px/0.5; inner conic sweep rotates 360deg over 1.4s.
4. **Link underline reveal** — header nav links (`Header.tsx:29-37`) currently only do `text-foreground` color change. Add `::after` 1px gold underline scaling from `scaleX(0)` to `scaleX(1)` left-origin, 280ms `cubic-bezier(0.4,0,0.2,1)`.
5. **Glass card tilt** — UseCases articles (`UseCases.tsx:39`) and Benefits portrait (`Benefits.tsx:12`) get 3D `rotateX/rotateY` based on cursor position (max ±6deg).
6. **Scroll-linked section labels** — fixed left-edge tickmark with current section name fading in/out as it enters viewport.
7. **Animated hairlines** — replace `<div className="hairline" />` (`Index.tsx:17` etc) with a gold scan-line that animates `mask-position` left-to-right when scrolled into view.
8. **Input focus** — form inputs (`ContactForm.tsx:54-73`) currently rely on shadcn defaults. Add gold underline that animates from center on focus; label morphs into floating label.
9. **Number ticker** — when SocialProof enters viewport, animate small counters (e.g., "4 setores", "12 meses", "0 demos") with a 1.4s ease-out count.
10. **Premium tab/chip hover** — Benefits stack pills (`Benefits.tsx:46`) — show a soft gold halo and a tooltip with a one-line "what for".

---

## 8. Top 7 Visual Upgrades (Ranked by Visible Impact)

1. **Hero scale + composition rebuild** — explode H1 to ~140px clamped, asymmetric 12-col layout, 3-layer aurora background, magnetic gold CTA with conic sheen. Single biggest jump in perceived production value. Files: `Hero.tsx:1-50`, new aurora component, update `index.css:51-56`.
2. **Pinned horizontal MainSolution** — convert the 4-step grid (`MainSolution.tsx:18`) into a pinned, horizontally-scrolled cinematic sequence with giant ghost numerals. Defines the page as Awwwards-tier.
3. **Cursor follower + magnetic buttons** — global addition. Two ingredients, transforms entire feel of the site from "well-styled" to "crafted".
4. **Aurora background system + animated hairlines** — replace static `--gradient-mesh` body bg with 3-layer aurora (radials + grain + animated orbs); replace flat hairlines with animated gold scan-lines (`Index.tsx:17,19,21,23,25`). Adds continuous motion without distraction.
5. **Typography rhythm overhaul** — bump body to 15px/light, introduce display-mid H2 at 56–72px serif italic, recurring giant ghost serif words behind sections, intentional italic gold accents per section. Cheap to ship, immediate editorial gravity.
6. **Header scroll-state + nav underline reveals** — capsule that morphs on scroll, animated gold underlines under nav links (`Header.tsx:22-49`), pulse-glow indicator under active section. Sells the polish before the user even scrolls.
7. **ContactForm asymmetric "signature" moment** — break the centered `max-w-xl` form (`ContactForm.tsx:50-82`) into a 2-col: left = oversized serif quote + handwritten signature SVG; right = glass form with floating-label inputs and gold focus underlines. Converts the weakest section into a closing crescendo.

---

*End of audit. Word count: ~1450.*
