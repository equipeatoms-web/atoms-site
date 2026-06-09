# Agent 02 — Visual Design Tokens (Refined)

Extension layer for `src/index.css` and `tailwind.config.ts`. Nothing here replaces existing tokens — every new variable is additive, every refined value preserves the dark-luxury black + gold + glass direction defined in `06-discovery-answers.md`. References: NVIDIA RTX (neon holographic), Apple Vision Pro (glass + aurora), Linear (typography + subtle glow).

---

## 1. Color tokens (refined)

### 1.1 Base — deepen for OLED-grade contrast

| Token | Current intent | Refined HSL | Use |
|---|---|---|---|
| `--background` | near-black | `0 0% 4%` | Page floor. Slightly warmer than pure black so gold reads as ember, not citrus. |
| `--foreground` | warm bone | `38 22% 96%` | Body/display text. Keep warm — never `#ffffff`. |
| `--card` | raised plane | `0 0% 6%` | Solid cards (non-glass). +2L over background. |
| `--border` | hairline | `38 8% 14%` | Hairlines, grid `gap-px`. Already used as bg behind grids. |
| `--background-deep` (new) | well bottom | `0 0% 2.5%` | Beneath hero aurora; gives radial gradients depth. |
| `--surface-raised` (new) | scroll-pinned | `38 6% 8%` | Pinned MainSolution slides. |

### 1.2 Gold system — three temperatures + atmosphere

Current `--primary` lives around `38 33% 70%` (warm bone-gold). Keep it; add siblings.

| Token | HSL | Opacity at rest | Use |
|---|---|---|---|
| `--primary` | `38 33% 70%` | 100% | CTA fill, italic accent word, focus ring base. |
| `--primary-glow` | `38 45% 78%` | 100% | Inner highlight on CTA hover, conic sheen midpoint. |
| `--accent` | `38 50% 60%` | 100% | Underlines, list arrows, link hover. |
| `--gold-deep` (new) | `34 38% 42%` | 100% | Step numerals ghost outline; line-art icons stroke. |
| `--gold-light` (new) | `42 60% 88%` | 100% | Pulse peak (badge dot at apex), text-mask shimmer. |
| `--gold-fog` (new) | `38 30% 70%` | 6% | Aurora bottom-right blob; rests under hero. |
| `--gold-vapor` (new) | `38 40% 75%` | 3% | Animated grain overlay tint; section ghost numerals. |

### 1.3 Neon accents (NVIDIA-ish) — surgical, never loud

| Token | HSL | Opacity | Use |
|---|---|---|---|
| `--neon-cyan-faint` (new) | `190 90% 65%` | 4% | One conic-sheen highlight per glass card on hover; aurora 3rd layer at 3–5%. Never above 6%. |
| `--neon-amber` (new) | `28 95% 60%` | 8% | Warm flare in hero aurora bottom-right; CTA glow rim at hover peak. |
| `--neon-violet` (new, optional) | `268 80% 65%` | 3% | Reserved for ContactForm signature reveal only — used once. |

Rule: combined non-gold neon never exceeds ~10% surface area or page reads "tech-startup" instead of "luxury".

### 1.4 Glass — depth tiers

| Token | Value | Use |
|---|---|---|
| `--glass-bg` | keep current | Default glass cards. |
| `--glass-bg-strong` | keep current | MainSolution wrapper, Header. |
| `--glass-border` | keep current `12%` gold | All glass edges. |
| `--glass-highlight` | keep current | Inset top highlight. |
| `--glass-bg-deep` (new) | `hsl(0 0% 6% / 0.62)` + `backdrop-blur(28px) saturate(140%)` | Hero floating spec card, pinned scroll panels. |
| `--glass-edge-glow` (new) | `hsl(38 45% 78% / 0.18)` | 1px outer ring on glass hover (`box-shadow: 0 0 0 1px var)`). |
| `--glass-mirror` (new) | `hsl(0 0% 8% / 0.45)` + `backdrop-blur(40px) saturate(180%) brightness(1.05)` | ContactForm card only — most reflective tier. |
| `--glass-tint-cool` (new) | `hsl(220 30% 50% / 0.04)` | Subtle blue cast under `--glass-mirror` to read "polished". |

---

## 2. Type scale — fluid `clamp()`

Stack: **Instrument Serif** (display + italic accents) + **DM Sans** (body, meta, UI). Already declared via `.font-serif`.

| Token | `clamp()` | line-height | letter-spacing | Family | Use |
|---|---|---|---|---|---|
| `--text-display-hero` | `clamp(64px, 9vw, 160px)` | `0.94` | `-0.04em` | Serif | Hero H1 only. |
| `--text-display-section` | `clamp(44px, 6vw, 88px)` | `1.0` | `-0.03em` | Serif | UseCases intro, ContactForm tentpole H2. |
| `--text-display-mid` | `clamp(32px, 4vw, 56px)` | `1.08` | `-0.025em` | Serif | Section H3, MainSolution step name. |
| `--text-body-lg` | `clamp(17px, 1.3vw, 20px)` | `1.55` | `-0.005em` | Sans, weight 300 | Hero paragraph, Benefits intro. |
| `--text-body` | `clamp(15px, 1vw, 16px)` | `1.65` | `-0.005em` | Sans, weight 300 | Default body — replaces current `text-sm`. |
| `--text-meta` | `13px` static | `1.5` | `0.04em` uppercase | Sans, weight 500 | Section labels, "30 min · vídeo · sem custo", footer meta. |
| `--text-micro` | `11px` static | `1.4` | `0.08em` uppercase | Sans, weight 600 | Year tag, badge text inside chips. |
| `--text-ghost-numeral` | `clamp(180px, 22vw, 380px)` | `0.85` | `-0.06em` | Serif, weight 300 | Giant `01`, `02`, `03`, `04` behind MainSolution and section watermarks. |

**Serif vs Sans rules**

- **Instrument Serif** → display, single italic accent word per section (gold), giant ghost numerals, signature reveal in ContactForm.
- **DM Sans** → all body, all UI (buttons, labels, form fields), meta/micro. Use `font-light` (300) on body for editorial gravity; `font-medium` (500) for meta/buttons.
- Pair rule: every serif display ≥ display-mid carries `tracking-[-0.025em]` and one italic word in `--primary`.

---

## 3. Spacing rhythm — 3-tier heartbeat

Replaces the current flat `py-20` on every section.

| Token | Mobile | Desktop | Sections |
|---|---|---|---|
| `--space-tentpole` | `py-32` (128px) | `py-40` (160px) | Hero, UseCases, ContactForm. |
| `--space-narrative` | `py-20` (80px) | `py-24` (96px) | ProblemSolution, MainSolution, Benefits, TeamEnablement. |
| `--space-connective` | `py-12` (48px) | `py-16` (64px) | Hairline dividers, SocialProof strip, micro-CTAs. |

**Inner padding (per section)**

- Container width unchanged: `max-w-[1400px]` default; allow `max-w-[1600px]` for full-bleed escapes.
- Card padding: `--pad-card-sm` = `24px`, `--pad-card` = `32px`, `--pad-card-lg` = `48px` (Hero spec card, ContactForm).
- Section side padding: clamp `px-6` mobile → `px-12` desktop; full-bleed sections drop to `px-0` and rely on inner safe-area.

**Grid gap standards**

- Hairline grids (current pattern): `gap-px` over `bg-border`. Keep — but limit to 2 sections per page max so the device stops being a tic.
- Card grids: `--gap-card` = `clamp(16px, 1.6vw, 32px)`.
- Editorial drift indent: `pl-[15vw]` on alternating sections (ProblemSolution, Benefits) for asymmetric rag.

---

## 4. Glow + shadow system

Current: `--shadow-glow`, `--shadow-card`, `--shadow-glass`. Keep all. Extend with intent-named tokens.

| Token | Value (HSL/opacity) | Use |
|---|---|---|
| `--shadow-glow` (existing) | `0 0 40px hsl(var(--primary) / 0.25)` | Default CTA rest state. |
| `--shadow-card` (existing) | keep | Solid cards. |
| `--shadow-glass` (existing) | keep | Glass cards. |
| `--glow-soft` (new) | `0 0 24px hsl(var(--primary) / 0.18)` | Resting state on gold badges, inline chip hover, focus ring on form fields. |
| `--glow-strong` (new) | `0 0 64px hsl(var(--primary) / 0.45), 0 0 16px hsl(var(--neon-amber) / 0.25)` | CTA hover apex, "Daniel — Engenheiro de IA" badge halo. |
| `--glow-pulse` (new) | animated keyframe: `--glow-soft` → `--glow-strong` → `--glow-soft` over `4s ease-in-out infinite` | Live dots (badge, WhatsApp floater, "4 vagas" indicator). |
| `--shadow-aurora` (new) | `0 0 200px 80px hsl(var(--primary) / 0.12), 0 0 320px 120px hsl(var(--neon-amber) / 0.06)` | Large diffuse halo around hero subject and behind hero CTA cluster — sells "atmospheric". |
| `--shadow-inset-glass` (new) | `inset 0 1px 0 hsl(var(--gold-light) / 0.18), inset 0 -1px 0 hsl(0 0% 0% / 0.4)` | Top highlight + bottom shadow on glass cards — replaces flat borders. |

**When to use which**

- Resting interactive (button at rest): `--glow-soft`.
- Hover/focus apex: `--glow-strong`.
- Live indicators (dots, breathing badges): `--glow-pulse`.
- Backgrounds/atmosphere (hero, ContactForm bg): `--shadow-aurora` rendered via pseudo-element, never on the card itself.
- Inside all `glass*` utilities: `--shadow-inset-glass` for tactile edge.

---

## 5. Glass surface utilities (extend `.glass`, `.glass-strong`, `.glass-highlight`)

Pseudo-code intent only — full CSS to be written by the implementation pass.

### `.glass-deep`

```
background: var(--glass-bg-deep);
backdrop-filter: blur(28px) saturate(140%);
border: 1px solid hsl(var(--primary) / 0.10);
box-shadow: var(--shadow-glass), var(--shadow-inset-glass);
```

Use: Hero floating spec card ("30 min · vídeo · sem custo"), pinned scroll panels in MainSolution, large narrative wrappers.

### `.glass-edge` (conic sheen on hover — Linear/Vercel signature)

```
position: relative;
isolation: isolate;
/* ::before pseudo */
background: conic-gradient(from 0deg,
  transparent 0deg,
  hsl(var(--primary) / 0.55) 90deg,
  transparent 180deg,
  hsl(var(--neon-cyan-faint) / 0.40) 270deg,
  transparent 360deg);
animation: edge-rotate 6s linear infinite;
mask: linear-gradient(#000, #000) content-box, linear-gradient(#000, #000);
mask-composite: exclude;
/* visible on :hover only via opacity 0 → 1 over 400ms */
```

Use: UseCases articles, Benefits diagram card, MainSolution step cards on hover. Only one sheen visible at a time per viewport.

### `.glass-mirror` (ContactForm signature card)

```
background: var(--glass-mirror) + tint layer var(--glass-tint-cool);
backdrop-filter: blur(40px) saturate(180%) brightness(1.05);
border: 1px solid hsl(var(--gold-light) / 0.20);
box-shadow:
  var(--shadow-glass),
  0 0 0 1px var(--glass-edge-glow),
  var(--shadow-inset-glass);
```

Use: ContactForm right column only. Higher reflectivity than any other glass surface so it reads as the conversion centerpiece.

### `.glass-chip`

Variant for stack pills (`Benefits` tech list) and badges. Same `--glass-bg` but with `padding: 6px 12px`, `--glow-soft` on hover, `--text-micro` typography.

---

## 6. Component-by-component upgrade plan

| Component | Tokens to apply | Upgrades |
|---|---|---|
| **Header** | `.glass-strong`, `--glow-soft` on active nav | Sticky shrink already done — verify capsule narrows on `scrollY=0` and expands at `scrollY>40`. Add `::after` nav underline reveal using `--accent`, 280ms cubic-bezier(0.4,0,0.2,1), left-origin scaleX. Active section gets `--glow-pulse` dot. |
| **Hero** | `--text-display-hero`, `--space-tentpole`, `--glass-deep` spec card, `--shadow-aurora`, `--gold-fog` + `--neon-amber` aurora blobs, `--text-ghost-numeral` for "IA" watermark | Push H1 to `clamp(64px,9vw,160px)`, italic gold on "sistema" + "sua empresa", `tracking-[-0.04em]`, `leading-[0.94]`. Aurora: 3 stacked radial layers + animated blurred orbs (40–60s loops). Floating spec card uses `.glass-deep`. Agent diagram (architecture node graph) sits right-column, polished with thin gold connectors at `--gold-deep`, nodes as `.glass-chip` with `--glow-pulse`. Magnetic CTA with `--glow-strong` on hover apex. |
| **MainSolution** | `--text-ghost-numeral`, `.glass-deep`, `--space-narrative` → `--space-tentpole` desktop only, `--glow-pulse` on active step | Desktop: pinned horizontal scroll, 4 panels translate `x: -75vw`. Each panel: giant `01`–`04` ghost numeral in `--gold-deep` outlined serif (`-webkit-text-stroke: 1px`), step name in `--text-display-mid`, description in `--text-body`. Mobile: stacked, no pinning, ghost numeral scales to `clamp(120px, 28vw, 200px)`. |
| **UseCases** | `.glass-edge`, `--shadow-aurora` per card, `--space-tentpole`, full-bleed escape | Desktop: container escapes `max-w-[1400px]` → full-bleed with `px-[6vw]` inner safe-area. Cards: 3D tilt via `rotateX/rotateY ±6deg` on cursor, `.glass-edge` conic sheen on hover, gold scanline crosses card top-down on hover-in (1px gold gradient with `mask-image` animating `mask-position`). Result line (`UseCases.tsx:48`) gets `--accent` with `--glow-soft`. |
| **TeamEnablement** | `--text-display-mid`, `.glass`, `--gold-vapor` watermark | Currently low-hierarchy. Add: section label in `--text-meta` uppercase, H2 in `--text-display-section`, asymmetric 2-column with left = giant outlined word "TIME" in `--text-ghost-numeral` (`--gold-vapor` 3% opacity), right = 3 stacked benefit chips in `.glass-chip` with hairline connectors. Background: single soft radial in `--gold-fog` top-right. |
| **SocialProof** | `--text-ghost-numeral` (giant quote mark `"`), `--glow-pulse` on KPI counters, `.glass-mirror` for badge capsule | KPI counters: animated count-up on viewport-enter (1.4s ease-out), numbers in `--text-display-mid` serif, units in `--text-meta`. Big quote mark `"` behind quote text at `clamp(240px, 30vw, 420px)` in `--gold-vapor`. Daniel badge: `.glass-mirror` capsule with `--glow-pulse` dot. |
| **Benefits** | `.glass-edge`, animated diagram replaces portrait card, `.glass-chip` for stack pills | Per direction "no photography": replace `Benefits.tsx:12` portrait with an animated SVG diagram — orbiting nodes around a central gold core, lines pulse on a 6s loop using `--glow-pulse`. Stack pills (`Benefits.tsx:46-50`) → `.glass-chip` with `--glow-soft` on hover and tooltip in `--text-micro`. |
| **ContactForm** | `.glass-mirror`, `--text-display-section`, `--space-tentpole`, `--neon-violet` signature accent (once), `--glow-strong` on submit | Asymmetric 2-col grid. Left (5/12): oversized serif quote `"Sua empresa pode ser a próxima que eu construo"` in `--text-display-section`, italic gold on "próxima", handwritten SVG underline that strokes-in via `stroke-dasharray` on viewport-enter. Below: gold signature SVG with `--neon-violet` 3% glow halo (single use of violet on whole page). Right (7/12): `.glass-mirror` form card. Inputs: floating labels, gold underline animating from center on focus (`--accent`), `--glow-soft` focus ring. Submit: `--glow-strong` on hover, conic sheen sweep. |
| **Footer** | `--space-connective`, animated gold scan-line top divider, `.glass-chip` for socials | Replace static `.hairline` above footer with a continuous gold scan-line: 1px `linear-gradient(90deg, transparent, var(--primary), transparent)` with `mask-position` animating 0→100% over 8s loop. Footer body: 3-col, `--text-meta` for labels, `--text-micro` for legal. Social icons as `.glass-chip` with `--glow-soft` on hover. |

---

## 7. Motion-related tokens (handoff to Motion agent)

### Easings

| Token | Value | Use |
|---|---|---|
| `--ease-expo-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Hero entrance, section reveals, large translations. |
| `--ease-smooth` | `cubic-bezier(0.4, 0, 0.2, 1)` | Default UI (button hover, underline reveal, nav). |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Magnetic buttons, chip pops, badge entrance. |
| `--ease-glass` | `cubic-bezier(0.22, 0.61, 0.36, 1)` | Glass card tilt, sheen rotation start/stop. |

### Durations

| Token | Value | Use |
|---|---|---|
| `--dur-instant` | `120ms` | Hover color/opacity. |
| `--dur-fast` | `220ms` | Underline reveal, focus ring. |
| `--dur-base` | `400ms` | Standard transitions, card tilt return. |
| `--dur-slow` | `800ms` | Section entrance, glow swell. |
| `--dur-cinema` | `1400ms` | Counter ticker, signature stroke, hero text mask. |
| `--dur-loop-short` | `4s` | `--glow-pulse`. |
| `--dur-loop-medium` | `8s` | Footer scan-line, edge sheen rotation per card. |
| `--dur-loop-long` | `40s` | Aurora orb translation. |
| `--dur-loop-deep` | `60s` | Counter-rotating aurora layer. |

### Stagger steps

| Token | Value | Use |
|---|---|---|
| `--stagger-tight` | `40ms` | Letter-by-letter or word reveals in display headings. |
| `--stagger-base` | `80ms` | List items, chip rows, KPI counters. |
| `--stagger-wide` | `140ms` | Section-to-section narrative reveal, card grid entrance. |

### Motion principles for Motion agent

1. Continuous motion (per discovery #15): aurora orbs + grain overlay always running on hero and ContactForm; `--glow-pulse` always on live dots; never freeze the page.
2. Scroll-driven: prefer `useScroll`/`useTransform` (Framer) over GSAP for v1 unless pinned-horizontal MainSolution demands it.
3. Mute absolute (per discovery #16): no audio cues, no haptic-styled visual punches that imply sound (no shockwaves, no impact rings).
4. Reduced motion: every loop animation must respect `@media (prefers-reduced-motion: reduce)` — fall back to static aurora at peak opacity, kill orb translation, kill `--glow-pulse` (keep `--glow-soft` static), kill `.glass-edge` sheen rotation.

---

## Implementation note

All new tokens above belong in `src/index.css` under `:root` (HSL channel-only values for compatibility with Tailwind's `hsl(var(--token) / <alpha-value>)` pattern). Tailwind config (`tailwind.config.ts`) extends `theme.extend.colors`, `theme.extend.boxShadow`, `theme.extend.fontSize`, `theme.extend.spacing`, `theme.extend.transitionTimingFunction`, `theme.extend.transitionDuration`, and `theme.extend.animation` to surface each new token as a utility class. Existing utilities (`.glass`, `.glass-strong`, `.glass-highlight`, `.hairline`, `.font-serif`) remain untouched; new utilities (`.glass-deep`, `.glass-edge`, `.glass-mirror`, `.glass-chip`) are added alongside.

*End of spec. Word count: ~1820.*
