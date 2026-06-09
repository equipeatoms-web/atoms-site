# 06 — Discovery: respostas consolidadas

Sessão de 2026-05-26. 30 perguntas em 8 rodadas. Base para os 5 agentes especialistas.

## Posicionamento

1. **Frase-âncora:** "Eu construo a IA que sua empresa precisa pra crescer sem inchar o time"
2. **Concorrentes a superar:** Devs freelancers sem visão de negócio + Agências de IA genéricas (chatbot pronto)
3. **Faixa de preço:** Médio — R$10k a R$30k
4. **Identidade:** Híbrido — Daniel como rosto, time invisível atrás

## Cliente ideal

5. **Decisor:** Marketing/Growth + Dono/CEO de PME
6. **Setores:** Beleza & serviços + Educação & comunidades
7. **Tamanho:** Múltiplos — depende do problema
8. **Maturidade tech:** Mista — depende do projeto

## Identidade visual

9. **Sistema visual:** MANTER — dark luxury preto + dourado + glass
10. **Fotos do Daniel:** NÃO — só tipografia, diagramas e motion
11. **Referências:** Apple/Arc (glassmorphism, aurora) + Tesla/NVIDIA (dark luxury, neon, cinemat.)
12. **Ousadia:** 5/5 — sem freio, vai ao limite do Awwwards

## Motion

13. **Motion forte em:** Hero + Transições entre seções + Scroll-driven + Micro-interações (TUDO)
14. **Referência motion:** NVIDIA/Tesla — neon holográfico, glow, 3D abstrato
15. **Continuidade:** Contínuo — sempre tem algo respirando (partículas, aurora, glow)
16. **Áudio:** Mudo absoluto

## Vídeo (Veo) — brief

17. **Tema:** Abstrato holográfico — ondas de dados, grids de luz, dataflow neon
18. **Quantidade/duração:** 3 vídeos de 5s — entre seções-chave
19. **Posições sugeridas:** Hero→Problema | Casos→Capacitação | Sobre→Contato
20. **Paleta:** Dourado + preto profundo
21. **Câmera:** Estático com motion interno — câmera parada, mundo se move

## Conteúdo

22. **Cases reais:** Só Íris + Lari por agora — outros futuramente como "em produção"
23. **Mídia visual:** Não tem screenshots/back-office agora — manter narrativo
24. **Capacidades a destacar:** Multi-agente orquestrado + Pipelines de geração (IA Looks) + Integrações reais (WhatsApp Cloud, MP, Stripe, Google Cal, ERPs)
25. **Depoimentos:** Não tem ainda — deixar placeholder bem desenhado pra próximas semanas

## Conversão

26. **CTA:** Formulário + WhatsApp (híbrido — form principal, Wpp como atalho)
27. **WhatsApp Floater:** Popup-mini "posso ajudar?" após 30s de scroll
28. **Lead capture (email):** Não — só quem agenda análise
29. **Outros funis:** Só serviço agora (ATOMS/Comunidade/IA Looks ficam mencionados como capacidade, sem CTA paralelo)

## Técnico

30. **Hospedagem:** Servidor próprio / VPS (Daniel já administra)
31. **Domínio:** Decide depois — v1 sai em URL temporário

---

## Implicações imediatas pro design + motion

- **Awwwards-level (5/5)** + **NVIDIA/Tesla holográfico** + **glass Apple** = referência clara para o motion: neon holográfico em superfícies de vidro, com aurora dourada respirando ao fundo.
- **Motion contínuo + mudo absoluto** = partículas, glow, gradiente animado em loops longos (40s+) sem áudio.
- **Sem fotos** = aposta total em tipografia gigante + diagramas técnicos + vídeo abstrato.
- **3 vídeos de 5s estáticos com motion interno** = perfeito para Veo (ele performa bem nesse formato).
- **Híbrido form+Wpp + popup 30s** = Footer com formulário robusto + WhatsAppButton com delay-show + microcopy.

---

## Próximo passo: execução multi-agente

Vou spawnar 5 agentes em paralelo. Cada um produz um spec.md. Depois sintetizo e implemento.

| Agente | Produz | Tempo estimado |
|---|---|---|
| Brand Voice Writer | Copy reescrita seção por seção com a frase-âncora e tom anti-chatbot | ~3 min |
| Visual Design System | Tokens refinados (paleta gold deepened, type scale, spacing rhythm 3-tier) | ~3 min |
| Motion Choreographer | Storyboard de Hero + 3 transições + 7 micro-interações + scroll-driven | ~3 min |
| Veo Video Brief Writer | Prompt detalhado pros 3 vídeos (Veo-ready) com paleta, câmera, mood | ~2 min |
| Architecture Refactor | Refatoração de componentes + performance budget + plano de v2 | ~3 min |
