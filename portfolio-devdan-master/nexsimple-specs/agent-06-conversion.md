# Agent 06 — Conversion Funnel Spec

Scope: end-to-end conversion design for the landing (`/`). Hybrid CTA model — in-page form is primary, WhatsApp is shortcut/fallback. No email capture beyond análise gratuita. No competing funnels. Audiences: Marketing/Growth + Dono/CEO PME, sectors beleza/serviços + educação/comunidades, mixed tech maturity.

---

## 1. User journey scenarios (5 personas)

### 1.1 Dono apressado — PME atendimento, chegou por indicação
- **Entry section:** Hero. Veio com confiança transferida; lê só o H1 e a sub-head.
- **Key obstacle:** Tempo. Não quer rolar o site inteiro. Precisa de prova social rápida e um caminho curto pra falar.
- **What convinces:** Nome do indicador na cabeça + sub-head com prazo concreto ("Diagnóstico em 30 min. Sistema rodando em 4 semanas.") + CTA WhatsApp visível.
- **Ideal CTA path:** Hero CTA primário → âncora pra `#contato` → form com 3 campos required (nome, WhatsApp, contexto). OU floater WhatsApp ativa em <30s. Conversão esperada em <60s.

### 1.2 Gestor cético — chegou via LinkedIn
- **Entry section:** Hero, mas rola até ProblemSolution e UseCases antes de qualquer ação.
- **Key obstacle:** Medo de "mais um agência de IA". Quer ver inimigos nomeados, casos reais com setor.
- **What convinces:** ProblemSolution (lado "ruim" sendo afiado) + UseCases com setor explícito + Benefits bio em primeira pessoa.
- **Ideal CTA path:** Lê 60-80% da página → scroll-trigger do popup-mini WhatsApp aparece (após 50% scroll) → ignora popup → chega no form com expectativas alinhadas → preenche campo opcional "contexto do projeto" também. Conversão em 4-6 min de leitura.

### 1.3 Marketing/Growth — chegou via case search (Google "case IA atendimento clínica")
- **Entry section:** UseCases (deep-link possível #cases) ou Hero via busca branded.
- **Key obstacle:** Quer ver métricas, stack e arquitetura. Compara com agências.
- **What convinces:** Cards de UseCases com métricas + tags de stack (n8n, Supabase, WhatsApp Cloud) + Benefits mostrando o "como" técnico.
- **Ideal CTA path:** Lê UseCases → âncora "Ver arquitetura" (link inline) → volta → desce até form → preenche os 5 campos incluindo "qual o desafio" detalhado. Conversão pondo o problema concreto no campo livre.

### 1.4 Dev curioso — chegou via tech content (post técnico ou repo)
- **Entry section:** Benefits (bio) ou Footer (link GitHub).
- **Key obstacle:** Não é decisor. Validação técnica antes de indicar pro decisor interno.
- **What convinces:** Stack chips reais, menção a integrações (Supabase, Stripe, Google Cal, ERPs), camada "que a maioria ignora".
- **Ideal CTA path:** Não converte agora. Provavelmente compartilha a URL com decisor interno. Tracking importante: `share_intent` (copy URL, abrir aba de mensagem), `external_link_click` (GitHub/LinkedIn). Pode ativar WhatsApp pra perguntar dúvida técnica.

### 1.5 Leigo curioso — chegou via Instagram / word of mouth
- **Entry section:** Hero. Pode não entender "engenheiro de IA aplicada" no primeiro segundo.
- **Key obstacle:** Vocabulário. Não sabe se serve pro caso dele. Maturidade tech baixa.
- **What convinces:** ProblemSolution em linguagem direta + UseCases em setores familiares (beleza, educação) + WhatsApp como caminho de menor fricção.
- **Ideal CTA path:** Rola superficial → popup-mini WhatsApp aparece após 30s → clica no floater → abre WhatsApp com mensagem pré-preenchida ("Oi Daniel, vi seu site e queria entender se serve pro meu caso"). Conversão por canal humano, não por form.

---

## 2. Form microcopy redesign

### 2.1 Labels (floating, não placeholders)
- `Nome` → "Como te chamo?"
- `Empresa` → "Empresa / Marca"
- `WhatsApp` → "WhatsApp com DDD"
- `Email` → "Email" (mantém clean)
- `Mensagem` → "Conta o cenário em 2 linhas"

### 2.2 Placeholders (exemplos concretos quando o campo recebe foco)
- Nome: `ex: Daniel Alves`
- Empresa: `ex: Studio Lari Beauty`
- WhatsApp: `(11) 9 9999-9999`
- Email: `voce@suaempresa.com.br`
- Mensagem: `ex: Tenho uma clínica com 4 unidades e perco agendamento à noite. Quero ver se IA resolve.`

### 2.3 Validation messages (inline, gentil, abaixo do campo, dourado-muted)
- Nome vazio (required): "Preciso de um nome pra te chamar."
- WhatsApp inválido: "Confere o formato — DDD + número, ex: (11) 9 9999-9999."
- Email inválido: "Esse email tem algo estranho — confere o @ e o domínio."
- Mensagem < 10 chars: "Me conta um pouco mais — 1-2 linhas já ajudam."
- Erro genérico: "Algo travou aqui. Tenta de novo ou me chama no WhatsApp."

### 2.4 Submit button states
- **Idle:** "Agendar meus 30 minutos"
- **Loading:** "Enviando..." + spinner dourado, botão desabilitado, mantém largura
- **Success:** "Recebido. Te chamo em 24h." (verde-dourado, 2s) → transição para success state da seção
- **Error:** "Não consegui enviar. Tenta o WhatsApp?" + botão secundário "Abrir WhatsApp" aparece abaixo

### 2.5 Success toast (top-right, glass card, 6s auto-dismiss)
> "Recebi seu cenário. Te respondo no WhatsApp ou email em até 24h — geralmente bem antes. — Daniel"

### 2.6 Email auto-confirmation copy (enviado on-submit via Supabase trigger ou edge function)
- **Assunto:** "Recebi seu pedido — Daniel Alves"
- **Corpo (texto puro, sem template HTML pesado):**
```
Oi {{nome}},

Recebi seu cenário sobre {{empresa}}. Vou ler com calma e te chamar
no WhatsApp ({{whatsapp}}) em até 24h.

Antes da call, dá uma olhada nos casos que já estão em produção:
https://[dominio]/#cases

Se for urgente, me chama direto:
https://wa.me/55XXXXXXXXXXX

— Daniel Alves
Engenheiro de IA Aplicada
```

### 2.7 Error recovery (Supabase down ou rate limit)
- **Detecção:** catch no insert → distinguir 5xx (infra) vs 4xx (validação) vs network error.
- **UI:** o botão troca pra error state, abaixo aparece card secundário:
  > "O envio do form travou (lado nosso). Me chama no WhatsApp que eu pego direto — sem perder seu contexto."
- **Botão fallback:** "Abrir WhatsApp com o que eu escrevi" → monta `wa.me` URL com `text=` pré-preenchido contendo nome + empresa + mensagem que o user já digitou no form (preserva o trabalho dele).
- **Telemetria:** `form_submit_error` com payload `{reason: 'network'|'5xx'|'4xx', recovered_via: 'whatsapp'|'retry'|null}`.

---

## 3. WhatsApp popup-mini design

### 3.1 Trigger logic
- Aparece após o que ocorrer primeiro entre: **30s na página** OU **50% de scroll vertical**.
- Suprimido se: user já clicou no floater nessa sessão, já enviou form, ou tem flag `wa_popup_dismissed` em localStorage com timestamp < 24h.
- Suprimido também se viewport width < 360px (telas muito estreitas — só o floater base).

### 3.2 Position
- Desktop: âncora `position: fixed`, `bottom: calc(96px + 12px)`, `right: 24px` (12px acima do botão WhatsApp, alinhado à direita do botão).
- Pequena seta CSS (8px) apontando pra baixo, alinhada ao centro do floater (right: 48px do popup).

### 3.3 Copy variants (rotation A/B/C — sortear por sessão, registrar variant_id em tracking)
- **Variant A:** "Posso te ajudar?"
- **Variant B:** "Em dúvida? Me chama."
- **Variant C:** "Quer falar antes de agendar?"

Cada variante leva um sub-line opcional: "Eu respondo direto, sem bot." (12px, dourado-muted)

### 3.4 Interaction
- Botão X discreto no canto superior direito do card (16x16, hover dourado).
- Click no X → fade-out 200ms → grava `localStorage.setItem('wa_popup_dismissed', Date.now())` (TTL 24h, checado no mount).
- Click no corpo do card → abre WhatsApp (mesma ação do floater principal) + dispara `wa_popup_converted` event + remove popup da sessão.

### 3.5 Visual
- Glass card: `backdrop-filter: blur(20px)`, `background: rgba(15,15,17,0.72)`, border `1px solid rgba(212,175,55,0.32)` (gold accent), shadow `0 12px 40px rgba(0,0,0,0.6)`.
- Padding: 16px 20px. Max-width: 260px.
- Type: copy 14px/1.4, sub-line 12px/1.3, peso 500/400.
- Arrow connecting to button: pseudo-element `::after`, 8x8 rotated 45deg, mesma cor do card border-bottom.
- Entrance: `scale(0.92) → 1` + `opacity 0 → 1`, 280ms `cubic-bezier(0.16, 1, 0.3, 1)`.

### 3.6 Open behavior — pre-fill variants
- **Pre-fill A (low-context):** `Oi Daniel, vi seu site e queria entender se IA serve pro meu caso.`
- **Pre-fill B (mid-context):** `Oi Daniel, vi o case da [primeiro UseCase em viewport] e queria saber se rola algo parecido pra mim.`

Lógica: se `IntersectionObserver` capturou que o user passou por UseCases antes do trigger, usa Variant B com o nome do último case visto; senão Variant A.

URL: `https://wa.me/55XXXXXXXXXXX?text={encodeURIComponent(preFill)}`

### 3.7 Mobile vs desktop
- **Mobile (< 768px):** trigger igual, mas posição muda — popup ocupa `width: calc(100vw - 32px)`, `bottom: calc(80px + 8px)`, sem seta (a proximidade do botão floater já comunica). Padding maior pra área de toque (20px 24px).
- **Desktop:** seta visível, max-width 260px, hover state com leve lift (`translateY(-2px)`).
- **Tap-outside-to-dismiss** no mobile (overlay invisível); no desktop, mantém só o X (não bloqueia leitura).

---

## 4. Tracking events (tool-agnostic — Plausible/PostHog/GA4 compatible)

Convenção: `snake_case`, verbo + objeto. Toda payload inclui `path`, `viewport_w`, `session_id` (UUID em sessionStorage). Custom props opcionais entre `{}`.

### 4.1 Pageview / scroll
| Event | Payload | Trigger |
|---|---|---|
| `page_view` | `{referrer, utm_source, utm_medium, utm_campaign, utm_content}` | mount do `Index` |
| `scroll_depth_25` | `{seconds_since_load}` | 25% scroll |
| `scroll_depth_50` | `{seconds_since_load}` | 50% scroll |
| `scroll_depth_75` | `{seconds_since_load}` | 75% scroll |
| `scroll_depth_100` | `{seconds_since_load}` | 100% scroll |

### 4.2 Section in-view (IntersectionObserver threshold 0.5)
| Event | Trigger |
|---|---|
| `section_view_hero` | hero 50% in view |
| `section_view_problem` | ProblemSolution 50% in view |
| `section_view_solution` | MainSolution 50% in view |
| `section_view_cases` | UseCases 50% in view |
| `section_view_proof` | SocialProof 50% in view |
| `section_view_bio` | Benefits 50% in view |
| `section_view_contact` | ContactForm 50% in view |

### 4.3 CTA click
| Event | Payload |
|---|---|
| `cta_click_primary` | `{location: 'header'\|'hero'\|'inline'\|'sticky', label}` |
| `cta_click_secondary` | `{location, target: 'cases'\|'arquitetura'\|...}` |
| `anchor_click_contato` | `{from_section}` |

### 4.4 Form interaction
| Event | Payload |
|---|---|
| `form_view` | section ContactForm in viewport (uma vez por sessão) |
| `form_start` | primeiro `focus` em qualquer campo |
| `form_field_focus` | `{field: 'nome'\|'empresa'\|...}` |
| `form_field_complete` | `{field, char_count}` (on blur, se valid) |
| `form_field_error` | `{field, error_type}` (validation falhou) |
| `form_submit_attempt` | `{fields_filled: number, optional_filled: bool}` |
| `form_submit_success` | `{time_to_submit_ms, session_seconds}` |
| `form_submit_error` | `{reason, recovered_via}` |
| `form_abandon` | unload com `form_start` mas sem `form_submit_success` |

### 4.5 WhatsApp
| Event | Payload |
|---|---|
| `wa_button_click` | `{location: 'floater'\|'header'\|'form_fallback'\|'popup'}` |
| `wa_popup_show` | `{trigger: 'time'\|'scroll', variant: 'A'\|'B'\|'C', seconds_on_page}` |
| `wa_popup_dismiss` | `{variant, seconds_visible}` |
| `wa_popup_converted` | `{variant, seconds_visible, prefill: 'A'\|'B'}` |

### 4.6 Conversion funnel (derivada — relatório)
Sequência crítica pra dashboard:
1. `section_view_hero` (denominador)
2. `cta_click_primary` (location=hero) OU `scroll_depth_50`
3. `section_view_contact`
4. `form_view`
5. `form_start`
6. `form_submit_success` OR `wa_button_click`

Conversion rate = (`form_submit_success` + `wa_button_click` únicos por session) / `section_view_hero`.

---

## 5. CTA hierarchy (visual + UX system)

### 5.1 Primary CTA
- **Label canônico em toda a página:** "Agendar meus 30 minutos" (consistência total — substitui as 3 variantes atuais).
- **Aparições:** Header (right-aligned), Hero (centro abaixo da sub-head), ContactForm (submit). Total: **3 instâncias**.
- **Visual treatment (já implementado, manter):** gold accent (`#D4AF37` saturado), glow animado (loop 3s, opacity 0.6→1→0.6), magnetic hover (cursor attract 8px radius), border 1px solid rgba(212,175,55,0.6), shadow `0 8px 24px rgba(212,175,55,0.25)`.
- **Behavior:** click smooth-scroll para `#contato`, foca no primeiro campo do form (`<input autoFocus>` programaticamente). No mobile, scroll + foco sem teclado (`preventScroll: false`).

### 5.2 Secondary CTAs
- **"Ver casos"** (Hero, abaixo do primário, como link com `→`) — sub-CTA pra cético que precisa ver prova antes.
- **"Ver arquitetura →"** (dentro de cada UseCase card — quando case study pages existirem).
- **Scroll cue no Hero** (chevron animado embaixo, opacity 0.4) — indica "tem mais abaixo".
- **Quando secundário vira primário:** se usuário rolou >75% sem clicar no primary, sticky header CTA ganha pulse-glow (2 ciclos, depois para) — indicativo gentil sem ser dark.

### 5.3 Friction reduction (campos do form)
- **Required (3):** Nome, WhatsApp, Mensagem (cenário).
- **Optional (2):** Empresa, Email.
- **Justificativa:** WhatsApp já é canal de retorno preferido (cliente PME); email é redundância opcional. Empresa ajuda contexto mas não bloqueia. Nome + WhatsApp + Mensagem = mínimo viável pra Daniel responder com contexto.
- **Indicação visual:** required tem asterisco dourado discreto (8px) no label; optional tem "(opcional)" em 11px após o label.

### 5.4 Anchor links inline
- Toda menção textual a "agendar", "diagnóstico", "análise grátis" no copy do meio da página vira `<a href="#contato">` com underline animado on hover (gradient dourado).
- Especialmente em: ProblemSolution (último bullet), MainSolution (depois da fase 04), UseCases (CTA inferior "quero um caso assim →").

### 5.5 Sticky header CTA behavior
- **Estado inicial:** header transparente, CTA visível mas leve.
- **Após 100vh scroll:** header ganha background glass (`backdrop-filter: blur(12px)`, `bg: rgba(10,10,12,0.72)`), CTA fica mais sólido (border opacity 0.6 → 0.9).
- **Em `#contato` viewport:** CTA do header esconde (`opacity 0`, `pointer-events: none`) — evita redundância com o form já visível. Reaparece se user rolar pra cima.
- **Mobile:** CTA do header collapse pra ícone-only (calendar icon) abaixo de 640px pra liberar espaço.

---

## 6. Post-conversion experience

### 6.1 Success state (form submit OK)
- Toast top-right (copy seção 2.5), 6s auto-dismiss.
- O form em si **transforma in-place**: campos desaparecem com fade 300ms, container mantém altura mínima, surge card centrado:
  > **"Recebido."**
  > Te chamo no WhatsApp em até 24h. Geralmente bem antes.
  >
  > [Ver casos em produção →] (link secundário pra #cases)
- **Sem confetti**, sem reload, sem mudança de rota. Página inteira continua scrollable — user pode voltar a ler.
- Persiste estado em sessionStorage (`form_submitted: timestamp`) — se user reload, vê o card "Recebido." e não o form de novo.

### 6.2 Email auto-reply
Já especificado em 2.6. Enviado via Supabase Edge Function trigger no insert. Latência alvo < 30s.

### 6.3 Scroll-back behavior após submit
- Form area mostra o card "Recebido." (estado persistido em sessionStorage).
- WhatsAppButton (floater) ganha badge sutil dourado com "✓" (sem emoji visual — usar SVG checkmark) por 2 min, indicando "já estamos conversando".
- Popup-mini WhatsApp **fica suprimido** pelo resto da sessão (flag `form_submitted` checa antes do trigger).
- Header CTA permanece, mas com label trocado pra "Conversar no WhatsApp →" se `form_submitted` true — oferece canal alternativo caso user queira agilizar.

---

## 7. A/B test hypotheses (v2, após baseline de 200+ sessões)

### Hypothesis 1 — Pre-form expectation list (impacto alto)
- **Variant A (control):** form atual.
- **Variant B:** acima do form, lista de 3 bullets: "Saí da call com: 1) viabilidade técnica do seu caso 2) arquitetura sugerida 3) faixa de prazo e investimento."
- **Hipótese:** reduz ansiedade pré-call, aumenta `form_submit_success` em 18-25%.
- **Success metric:** taxa `form_view → form_submit_success`.
- **Sample size estimate:** 1.200 sessões por variante (alpha 0.05, power 0.8, baseline 6%, MDE 1.5pp). ~3 semanas em tráfego médio.

### Hypothesis 2 — WhatsApp popup variant winner (impacto médio-alto)
- **Variants:** copy A ("Posso te ajudar?"), B ("Em dúvida? Me chama."), C ("Quer falar antes de agendar?").
- **Hipótese:** variant C ganha por intent-matching (user que dá scroll mas hesita é exatamente "quer falar antes de agendar").
- **Success metric:** `wa_popup_converted` / `wa_popup_show` por variant.
- **Sample size estimate:** 600 shows por variant (3.600 total). 2-3 semanas. Multi-arm bandit pode encurtar.

### Hypothesis 3 — Calendar embed vs form (impacto alto, esforço médio)
- **Variant A (control):** form com retorno manual em 24h.
- **Variant B:** Cal.com inline embed acima do form, com header "Escolha 30 minutos direto na minha agenda". Form vira fallback abaixo ("ou me mande uma mensagem").
- **Hipótese:** remove o gap async, aumenta total conversões (booked + form) em 30-40%. Pode reduzir form submissions mas aumenta meetings agendadas — métrica composta.
- **Success metric:** total qualified actions = `calendar_booked` + `form_submit_success` (deduplicado por session).
- **Sample size estimate:** 1.000 sessões por variante. ~3 semanas. Tracking precisa incluir `calendar_booked` event via Cal.com webhook.

---

## 8. Implementation checklist (handoff)

- [ ] Refatorar `ContactForm.tsx` com floating labels, 3 required / 2 optional, success in-place state.
- [ ] Adicionar componente `WhatsAppPopup` (novo) gerenciando trigger time/scroll + localStorage TTL 24h.
- [ ] Setar event tracker stub (`lib/analytics.ts`) com `track(event, payload)` — implementação concreta (Plausible/PostHog) plugável.
- [ ] Padronizar label primary CTA em Header, Hero, ContactForm para "Agendar meus 30 minutos".
- [ ] Implementar Supabase Edge Function pra auto-reply email (copy seção 2.6).
- [ ] Implementar `form_submitted` sessionStorage persistence + scroll-back UI.
- [ ] Adicionar anchor underline animation pra menções inline.
- [ ] Sticky header CTA collapse logic na seção `#contato`.

---

**Word count:** ~2.350 palavras.
