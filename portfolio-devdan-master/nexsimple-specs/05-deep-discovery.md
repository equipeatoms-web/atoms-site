# 05 — Deep Discovery (30 perguntas para spec-driven design + dev)

Discovery completo para gerar specs de Designer (visual + motion) e Developer (arquitetura + comportamento) que serão executadas em paralelo por multi-agentes.

Estrutura: **8 rodadas de 4 perguntas** (32 no total — algumas opcionais).

---

## Rodada 1 — Posicionamento estratégico (CRÍTICO)

1. Qual é a UMA frase que melhor descreve seu trabalho pra alguém leigo (não-tech)?
2. Quem é seu concorrente direto que você quer superar em percepção? (agências, freelancers, devs, consultorias)
3. Faixa de preço — premium (acima de R$30k/projeto), médio (R$10–30k), entrada (até R$10k), depende?
4. Você quer ser visto como **pessoa** (Daniel) ou como **estúdio/equipe**?

## Rodada 2 — Cliente ideal

5. Quem decide a contratação no cliente? (dono, gestor, diretor de TI, marketing, RH)
6. Setor primário onde quer crescer? (saúde, beleza, indústria, serviços, varejo, etc)
7. Tamanho de empresa ideal? (solo, PME até 50, média 50–300, grande)
8. Maturidade tecnológica do cliente? (tradicional, em transição, digital nativo)

## Rodada 3 — Identidade visual

9. Já tem identidade definida (logo, paleta, tipografia)? Manter ou repensar?
10. Quer fotos suas no site, ilustrações, ou só tipografia + diagramas?
11. Inspirações específicas (3 sites/marcas que você gosta esteticamente)?
12. Quão "ousado" pode ir? (1=sóbrio elegante / 5=momentos chocantes)

## Rodada 4 — Motion + animação

13. Onde quer motion MAIS forte — hero, transições entre seções, hover, scroll, todas?
14. Sua referência de motion mais próxima — Apple, Stripe, Linear, Awwwards, Vercel, outra?
15. Pode ter motion contínuo (loops, partículas) ou só quando o usuário interage?
16. Áudio? (mudo absoluto / vídeo com som / botão de mute / ambiente sutil)

## Rodada 5 — Vídeo gerado (Veo/MCP)

17. Tema do vídeo de motion das transições? (abstrato, dataflow, agentes, paisagem técnica)
18. Duração ideal por transição? (3s, 5s, 8s)
19. Quantas transições no site? (1, 2, 3+ posições diferentes)
20. Cor predominante do vídeo? (dourado, gradiente, monocromático preto, outra)

## Rodada 6 — Conteúdo

21. Quantos cases reais consegue mostrar publicamente além de Íris + Lari?
22. Tem screenshots/vídeos do back-office, agentes, dashboards pra publicar?
23. Tem depoimento em texto/vídeo de Dr. Garotti ou Lari?
24. Quais capacidades técnicas quer destacar MAIS? (multi-agente, RAG, fine-tuning, voice, vision, automação, integrações)

## Rodada 7 — Conversão e funil

25. CTA principal final — análise gratuita, contato direto, formulário, Cal.com integrado?
26. WhatsApp como porta de entrada permanente, ou só depois do form?
27. Captura de email pra leads que não estão prontos (newsletter, lead magnet)?
28. Tem outro funil paralelo? (curso, comunidade, mentoria) ou só serviço?

## Rodada 8 — Técnico e lançamento

29. Hospedagem decidida? (Vercel, Netlify, próprio servidor, Lovable)
30. Domínio próprio? Qual? Já registrado?

---

## Pós-discovery — execução multi-agente

Após coletar as respostas, vou spawnar **5 agentes em paralelo**:

| Agente | Output |
|---|---|
| **Brand Voice Spec** | Reescrita completa de copy de todas as seções no tom escolhido |
| **Visual Design Spec** | Tokens (paleta refinada, type scale, spacing rhythm) + componentes que precisam upgrade |
| **Motion Design Spec** | Storyboard completo de cada transição + parâmetros (easing, duration, stagger) |
| **Video Generation Brief** | Prompt detalhado pra cada vídeo de motion (cena, câmera, paleta, mood) — pra rodar em MCP Hingsfild/Algrow |
| **Architecture Refactor Spec** | Refatoração de componentes (Atomic Design, naming, separação client/server) + performance budget |

Depois eu **sintetizo** os 5 specs em um plano de execução e implemento sequencialmente.
