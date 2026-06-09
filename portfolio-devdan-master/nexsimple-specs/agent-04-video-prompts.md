# Agent 04 — Veo / Sora 2 Video Prompts

Três transições de 5 segundos, 16:9, sem áudio, câmera estática, loop-friendly. Paleta gold #c8b89a + deep black #0a0a0a com leve acento cyan tech opcional. Estética NVIDIA RTX × Apple Vision Pro × Sora 2.

---

## Vídeo 1 — Genesis grid (Hero -> Problema)

```
Static locked-off shot, 35mm equivalent, 16:9 cinematic frame. An abstract holographic genesis sequence inside an infinite void of deep volumetric black (#0a0a0a). At t=0 the frame is pure black with faint anisotropic dust. A single luminous core ignites at the exact optical center, an anodized golden seed (#c8b89a, HSL 36, 25%, 70%) pulsing once with a soft volumetric bloom. From the core, a precise wireframe grid unfolds outward across the XY plane in perspective, lines drawing themselves at 1.2 units per second with smooth ease-out, forming a 3D lattice that recedes to vanishing point. Thin dataflow tracers race along the grid edges in short staccato pulses, gold to faint cyan (#7fd1de) accents at intersections. Shallow depth of field, f/2.0, soft falloff at edges. Key light: rim of golden specular from screen-right at 3200K; fill: cool 6500K negative space. Subtle chromatic aberration, fine 35mm film grain, anamorphic vertical flares from grid nodes. Mood: emergent, sovereign, holographic, awakening, sacred-tech. Closing state: fully formed grid pulses softly at the same intensity it started, ready to seamlessly loop back to darkness.
```

**Por que funciona:** o prompt instrui o modelo a começar e terminar em estados visualmente próximos (preto com leve poeira no início, grade pulsando levemente no fim) — isso facilita o loop com crossfade no CSS. O termo "anodized" puxa o ouro pra um acabamento metálico sofisticado em vez de amarelo plástico. "Genesis sequence" + "system coming online" são gatilhos fortes pro Veo 2 entregar a sensação de inicialização. A câmera locked-off + lattice em perspectiva resolve o brief de "estático com mundo se movendo dentro". O cyan #7fd1de como acento secundário evita monotonia sem quebrar a paleta gold.

---

## Vídeo 2 — Network pulse (Casos -> Capacitação)

```
Static locked-off shot, 50mm equivalent, 16:9 cinematic frame, no camera movement whatsoever. An abstract neural network organism suspended in deep volumetric black space (#0a0a0a). Twelve to fifteen translucent glass node-orbs float in 3D arrangement, each orb 40 to 90 pixels in diameter, refracting internal golden light (#c8b89a, anodized warm gold, HSL 36, 25%, 70%). Orbs are connected by ultra-thin luminous filaments of liquid gold, catenary curves with slight physical sag, glowing at 60 percent opacity. Every 0.8 seconds a bright energy pulse travels along a random filament from one orb to another at 2.4 units per second, easing in-out, briefly illuminating the destination orb with a soft bloom flare. Orbs breathe with subtle scale modulation at 0.25 Hz, plus and minus 4 percent. Shallow depth of field, f/1.8, bokeh discs in deep background. Key light: soft top-down golden 3200K rim on each orb; fill: cool deep 6500K negative space; rim: faint cyan (#7fd1de) glint on orb edges. Volumetric haze, lens dust, vertical anamorphic flares from brightest pulses. Mood: alive, intelligent, conversational, bio-luminescent, orchestrated. Closing state: network continues breathing with at least three active pulses mid-flight, identical density and rhythm as the opening frame to allow seamless loop.
```

**Por que funciona:** o sistema multi-agente é o coração da Nexsimple — esse prompt traduz isso visualmente como organismo neural. O termo "catenary curves with slight physical sag" força os filamentos a parecerem cabos físicos reais (Apple Vision Pro vibes) e não linhas chapadas. "Breathe at 0.25 Hz, ±4%" dá pro Veo um valor numérico concreto, evitando que ele exagere a oscilação. A frequência de 0.8s entre pulsos garante que o vídeo tenha 5-6 pulsos visíveis nos 5 segundos — densidade certa pra "agentes conversando". Loop-friendly porque o prompt explicita que o estado final tem 3+ pulsos em voo, espelhando o início.

---

## Vídeo 3 — Convergence flare (Sobre -> Contato)

```
Static locked-off shot, 85mm equivalent, 16:9 widescreen, anamorphic 2.39 letterbox feel within the 16:9 frame. Abstract convergence event in deep volumetric black void (#0a0a0a). The scene opens with twelve thin particle streams entering from every edge of the frame, each stream composed of micro-particles of anodized golden light (#c8b89a, HSL 36, 25%, 70%) trailing fine luminous tracers. All streams travel toward a single off-center focal point at rule-of-thirds upper-left, accelerating from 0.6 to 3.0 units per second with strong ease-in. At t=2.8 seconds the streams collide and ignite a high-intensity anamorphic lens flare: horizontal blue-cyan streak (#7fd1de) spanning 90 percent of frame width, vertical golden bloom column, six-point starburst, halo refraction rings. Flare peaks at t=3.4 seconds then dissolves over 1.6 seconds into a soft sustained golden glow at the focal point. Shallow depth of field, f/1.4, heavy bokeh of unfocused incoming particles. Key light: the flare itself is the light source, golden 2900K core surrounded by cool 7200K halo. Volumetric god rays, lens dust, subtle chromatic aberration, fine grain. Mood: decisive, igniting, destiny, climactic, luminous threshold. Closing state: a calm sustained golden orb pulsing softly at the focal point, matching the latent intensity of the opening particles to enable seamless loop.
```

**Por que funciona:** "Convergence flare" é o momento de decisão — o usuário acabou de ler sobre o Daniel e agora vai pra conversa. O off-center rule-of-thirds upper-left posiciona o flare exatamente onde o CTA "Conversar" deve aparecer na seção seguinte (continuidade visual). A referência anamorphic 2.39 + lens flare horizontal cyan é a assinatura JJ Abrams / Blade Runner 2049 / Sora 2 demos — entrega o "ignition moment" sem precisar de fogo literal. O timing explícito (t=2.8, t=3.4) força o Veo a respeitar a curva dramática nos 5 segundos. Loop fecha com um orb dourado calmo que pode ser cruzado com o estado inicial via fade.

---

## Prompt engineering notes (tweaks pro Daniel)

**Se a primeira render vier muito clara / desbotada:**
- Adicionar no início: `extremely high contrast, true blacks, OLED display reference`
- Trocar `volumetric black` por `crushed shadow blacks, zero ambient light`
- Reduzir o cyan accent — remover a menção a #7fd1de e deixar só gold puro

**Se o motion vier rápido demais (mais comum no Veo 2):**
- Reduzir todos os valores numéricos pela metade (`1.2 units/sec` -> `0.6 units/sec`)
- Adicionar `slow contemplative pace, meditative timing, hypnotic rhythm`
- Trocar `ease-out` por `linear glide with extreme dampening`

**Se vier muito ocupado / poluído:**
- Reduzir densidade: `12-15 orbs` -> `5-7 orbs`; `12 streams` -> `5 streams`
- Adicionar `minimalist composition, negative space dominant, 70 percent empty frame`
- Remover lens dust e chromatic aberration

**Se vier sem o "metálico" do ouro (parecer amarelo plástico):**
- Reforçar: `anodized brushed gold, champagne metallic, NOT yellow, NOT saturated, desaturated luxury gold`
- Adicionar referência: `like a polished brass instrument under museum lighting`

**Se o lens flare vier exagerado no Vídeo 3:**
- Trocar `high-intensity anamorphic lens flare` por `restrained elegant lens flare, JJ Abrams style but subtle`
- Remover `six-point starburst` (geralmente entrega kitsch)

**Variantes de lighting pra testar (1 palavra muda muito):**
- `soft` -> `clinical` -> `cinematic` -> `volumetric` -> `god-ray-heavy`
- Cada uma muda o mood. Daniel deve renderizar 2-3 variações de cada vídeo e escolher.

**Loop seamless no front-end (independente do que o Veo entregar):**
- Aplicar CSS: `animation: fade 5s ease-in-out infinite alternate` no `<video>` ou usar dois `<video>` empilhados com crossfade de 800ms.
- Garantir export H.264 com `-pix_fmt yuv420p` pra compatibilidade Safari.

**Aspect ratio:**
- Veo 2 entrega 16:9 nativo. Sora 2 prefere prompt explícito `16:9 widescreen, 1920x1080`.
- Se for usar como background full-bleed em mobile, cortar pelo centro mantendo o focal point visível (especialmente Vídeo 3, cujo flare é off-center).

**Negative prompts (se a plataforma permitir):**
- `no humans, no faces, no text, no logos, no recognizable objects, no UI elements, no watermarks, no letterboxing bars, no shaky cam, no camera movement, no zoom, no pan`
