# 07 — Briefing dos 6 agentes especialistas

Cada agente recebe o discovery (specs/06) + um briefing focado e produz UM arquivo de spec na pasta `specs/`. Depois eu sintetizo todos em um master plan e implemento.

---

## Agente 1 — **Brand Voice Writer**
**Modelo:** general-purpose
**Output:** `specs/agent-01-brand-voice.md`

**Brief:**
> Você é copywriter sênior. Reescreva o copy de TODAS as seções da landing page do Daniel Alves (Engenheiro de IA Aplicada) usando a frase-âncora "Eu construo a IA que sua empresa precisa pra crescer sem inchar o time".
>
> Tom: confiante-direto, primeira pessoa, anti-chatbot-genérico, anti-consultoria-vaga. Contra freelancers + agências.
>
> Para cada seção (Hero, ProblemSolution, MainSolution, UseCases, TeamEnablement, SocialProof, Benefits, ContactForm, Footer) entregue: (a) novo headline H1/H2, (b) novo parágrafo de apoio, (c) micro-copy de CTA/labels, (d) 2 alternativas pro mais crítico (Hero + CTA principal).
>
> Use ancoragem (contraste antes/depois), ofertas específicas (números, prazos), e linguagem leiga (sem jargão técnico no hero).

---

## Agente 2 — **Visual Design System Architect**
**Modelo:** general-purpose
**Output:** `specs/agent-02-visual-tokens.md`

**Brief:**
> Você é design system architect. Refine os tokens visuais do site para Awwwards-level (ousadia 5/5) misturando glassmorphism Apple/Arc + dark luxury Tesla/NVIDIA.
>
> Output: (a) paleta refinada (gold base, neon accents, deep blacks, glass borders), (b) type scale com clamp() para H1→body, (c) spacing rhythm 3-tier (tentpole/narrative/connective), (d) shadow + glow system, (e) component-by-component visual upgrade plan (hero, cards, buttons, forms).
>
> Inspirações concretas: NVIDIA RTX product pages (neon holográfico), Apple Vision Pro (glass + aurora), Linear changelog (typography + glow sutil).
>
> Restrição: manter compatibilidade com Tailwind + CSS variables atuais (não quebrar nada). Apenas EXTENDER.

---

## Agente 3 — **Motion Choreographer**
**Modelo:** general-purpose
**Output:** `specs/agent-03-motion-storyboard.md`

**Brief:**
> Você é motion designer de Awwwards. Crie o storyboard completo de motion do site usando Framer Motion + GSAP + Lenis (já instalados).
>
> Entregue: (a) HERO — sequência de abertura cinematográfica de 3s, (b) 3 TRANSIÇÕES — entre Hero→Problema | Casos→Capacitação | Sobre→Contato (cada uma terá 1 vídeo de 5s ao fundo, motion CSS por cima), (c) SCROLL-DRIVEN por seção (MainSolution pin-horizontal, UseCases parallax, TeamEnablement step-reveal), (d) MICRO-INTERAÇÕES — cursor follower, magnetic CTAs, link underlines, hover tilt, button glow swell, focus rings.
>
> Para cada momento: easing concreto (cubic-bezier), duration, delay, stagger, will-change hints.
>
> Restrição: motion contínuo permitido (aurora, partículas), sempre respeitando prefers-reduced-motion.

---

## Agente 4 — **Veo Video Brief Writer**
**Modelo:** general-purpose
**Output:** `specs/agent-04-video-prompts.md`

**Brief:**
> Você escreve prompts para Veo 2 / Sora 2 (modelos top de vídeo IA). Produza 3 prompts longos (~120 palavras cada) para os 3 vídeos de transição.
>
> Especificações fixas pra todos:
> - Duração: 5 segundos
> - Aspect: 16:9 (vai ocupar background full-bleed entre seções)
> - Paleta: dourado #c8b89a + preto profundo #0a0a0a (pode ter cyan tech sutil)
> - Câmera: estática, mundo se move por dentro
> - Mood: holográfico, neon, dataflow, abstrato
> - Som: NENHUM (mudo)
>
> Vídeo 1 (Hero→Problema): grids de luz dourada se formando do escuro, dataflow saindo de um core central
> Vídeo 2 (Casos→Capacitação): nós/orbes se conectando, pulsos viajando em uma rede
> Vídeo 3 (Sobre→Contato): convergência de partículas em um ponto, lens flare final
>
> Cada prompt deve ter: shot description, lighting, camera, color grade, motion behavior, mood/atmosphere words. Estilo: NVIDIA product reveals + Apple Vision Pro intro.

---

## Agente 5 — **Architecture Refactor Engineer**
**Modelo:** Plan
**Output:** `specs/agent-05-architecture-v2.md`

**Brief:**
> Você é staff engineer. Audite a arquitetura do código atual e produza plano de refactor v2.
>
> Tópicos: (a) organização de pastas (atomic design? feature-based?), (b) tipagem (props, variants, theme tokens), (c) performance (lazy loading, code split, image opt, video lazy, font hosting), (d) accessibility (semantic HTML, ARIA, keyboard nav, focus management, reduced-motion), (e) SEO (meta tags, og:image, structured data, sitemap), (f) testing strategy (Vitest + Playwright recommendations), (g) deploy prep para VPS próprio (Nginx config exemplo, PM2/systemd, SSL).
>
> Restrição: não reescrever do zero — propor MIGRAÇÃO incremental com etapas verificáveis.

---

## Agente 6 — **Conversion Funnel Designer**
**Modelo:** general-purpose
**Output:** `specs/agent-06-conversion.md`

**Brief:**
> Você é growth designer especialista em landing pages B2B PME. Projete o funil completo de conversão do site, sem captura de email (só análise gratuita).
>
> Entregue: (a) jornada do usuário (4-5 cenários: dono apressado, gestor cético, decisor de marketing, dev curioso, leigo curioso), (b) microcopy do form (placeholders, labels, validações, mensagens de erro/sucesso, copy do email automático de confirmação), (c) WhatsAppButton com popup-mini "posso ajudar?" após 30s — design + interação + copy, (d) eventos de tracking (sem nomear ferramenta — Plausible/PostHog/GA agnóstico), (e) micro-otimizações de CTA (cor, posição, hierarquia visual, friction reduction).
>
> Restrição: nenhuma técnica dark pattern. Foco em qualidade de lead.
