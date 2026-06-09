-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: 20260609000002_dossie.sql
-- Dossiê de Clientes — ATom's (agência de IA First para negócios tradicionais)
-- Preenchido pelo formulário da landing page, SDR WhatsApp e agente ÁTOM.
-- Idempotente: usa ADD COLUMN IF NOT EXISTS, CREATE TABLE IF NOT EXISTS,
--              CREATE INDEX IF NOT EXISTS, CREATE POLICY IF NOT EXISTS,
--              INSERT ... ON CONFLICT DO NOTHING.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── 1. Extensão da tabela leads ─────────────────────────────────────────────

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS segment              text,           -- setor/nicho do negócio
  ADD COLUMN IF NOT EXISTS company_website      text,
  ADD COLUMN IF NOT EXISTS company_size         text,           -- 'solo' | 'pequeno' | 'medio' | 'grande'
  ADD COLUMN IF NOT EXISTS ai_maturity          text,           -- 'zero' | 'basico' | 'intermediario' | 'avancado'
  ADD COLUMN IF NOT EXISTS urgency              text,           -- 'imediato' | '30dias' | '90dias' | 'explorando'
  ADD COLUMN IF NOT EXISTS pain_main            text,           -- dor principal descrita pelo lead
  ADD COLUMN IF NOT EXISTS fit_score            integer,        -- 0-100, calculado pela IA
  ADD COLUMN IF NOT EXISTS profile_type         text,           -- 'A' | 'B' | 'C' | 'D' (bifurcação do funil)
  ADD COLUMN IF NOT EXISTS diagnosis_summary    text,           -- resumo do diagnóstico gerado pela IA
  ADD COLUMN IF NOT EXISTS opportunities        jsonb DEFAULT '[]'::jsonb,  -- array de oportunidades identificadas
  ADD COLUMN IF NOT EXISTS proposed_solutions   jsonb DEFAULT '[]'::jsonb,  -- soluções propostas pela IA
  ADD COLUMN IF NOT EXISTS wa_chat_summary      text,           -- resumo da conversa no WhatsApp
  ADD COLUMN IF NOT EXISTS diagnosis_requested  boolean DEFAULT false,  -- pediu diagnóstico completo?
  ADD COLUMN IF NOT EXISTS wants_human          boolean DEFAULT false;  -- quer falar com humano?

-- ─── 2. Tabela dossie_sections ───────────────────────────────────────────────
-- Cada linha é uma seção/bloco do dossiê: análise de mercado, rebrand,
-- análise de logo, posicionamento, oportunidades, plano de ação, concorrentes.

CREATE TABLE IF NOT EXISTS public.dossie_sections (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id       uuid        NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  category      text        NOT NULL,  -- 'market_analysis' | 'brand_audit' | 'logo_analysis'
                                       -- | 'positioning' | 'opportunities' | 'action_plan'
                                       -- | 'competitor_analysis'
  title         text        NOT NULL,
  content       text        NOT NULL,
  data          jsonb       DEFAULT '{}'::jsonb,  -- dados estruturados (scores, métricas, etc.)
  generated_by  text        DEFAULT 'ia',          -- 'ia' | 'human' | 'form'
  model_used    text,                              -- 'gemini-2.5-flash' | 'claude-opus' | etc.
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS dossie_sections_lead_idx
  ON public.dossie_sections (lead_id);

CREATE INDEX IF NOT EXISTS dossie_sections_category_idx
  ON public.dossie_sections (category);

-- ─── 3. RLS para dossie_sections ─────────────────────────────────────────────

ALTER TABLE public.dossie_sections ENABLE ROW LEVEL SECURITY;

-- Somente usuários autenticados (admins no painel) lêem e escrevem.
-- Service role bypassa RLS nativamente — sem policy extra necessária.

CREATE POLICY IF NOT EXISTS "authenticated_can_read_dossie"
  ON public.dossie_sections
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY IF NOT EXISTS "authenticated_can_write_dossie"
  ON public.dossie_sections
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ─── 4. Trigger updated_at em dossie_sections ────────────────────────────────
-- Reusa a função handle_updated_at() criada na migration inicial.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'set_dossie_sections_updated_at'
      AND tgrelid = 'public.dossie_sections'::regclass
  ) THEN
    CREATE TRIGGER set_dossie_sections_updated_at
      BEFORE UPDATE ON public.dossie_sections
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. SEEDS — 3 clientes de amostra com dossiê completo
--
-- IDs fixos para idempotência:
--   Leads   : 11111111-0001-0001-0001-000000000001 ... 0003
--   Sections: 22222222-0001-0001-0001-000000000001 ... 0009
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Lead 1: Fernanda Rocha — Studio Élite Estética (Perfil A) ─────────────

INSERT INTO public.leads (
  id,
  name, email, whatsapp,
  business_type, message, status, source,
  segment, company_size, ai_maturity, urgency,
  pain_main, fit_score, profile_type,
  diagnosis_summary,
  opportunities,
  proposed_solutions,
  diagnosis_requested, wants_human
) VALUES (
  '11111111-0001-0001-0001-000000000001',
  'Fernanda Rocha',
  'fernanda@studioelite.com.br',
  '5511987650001',
  'Clínica de Estética',
  'Preciso aumentar o movimento da minha clínica e competir com quem tem mais presença online.',
  'qualified',
  'website',
  'Estética e Beleza',
  'pequeno',
  'basico',
  '30dias',
  'Perco clientes para concorrentes com presença digital mais forte. Minha agenda não está cheia.',
  82,
  'A',
  'Studio Élite tem base de clientes sólida e boa reputação local, mas enfrenta perda de participação para concorrentes com presença digital mais estruturada. Existe oportunidade imediata de posicionamento premium via rebranding e automação de retenção (WhatsApp + CRM). Score de fit elevado: negócio existente com receita comprovada e dor clara.',
  '[
    {"titulo": "Retenção via WhatsApp", "descricao": "Automação de pós-atendimento e reativação de clientes inativos pode aumentar o LTV em até 40%."},
    {"titulo": "Posicionamento premium", "descricao": "Rebranding visual e narrativa de autoridade para justificar ticket médio maior e atrair perfil de cliente ideal."},
    {"titulo": "Agenda sempre cheia", "descricao": "Funil de captação com Instagram + anúncios locais direcionados para preenchimento de horários ociosos."}
  ]'::jsonb,
  '[
    {"solucao": "ATom SDR WhatsApp", "descricao": "Agente de reativação de clientes inativos com follow-up automatizado."},
    {"solucao": "Rebrand Studio Élite", "descricao": "Identidade visual premium + narrativa de posicionamento para redes sociais."}
  ]'::jsonb,
  true,
  false
) ON CONFLICT (id) DO NOTHING;

-- ── Lead 2: Carlos Mendes — Barbearia Mendes Premium (Perfil D) ──────────
-- Nota: status 'proposal' não existe no CHECK constraint da tabela leads
-- (válidos: new | contacted | qualified | converted | lost).
-- Usando 'qualified' como equivalente mais próximo de lead em proposta.

INSERT INTO public.leads (
  id,
  name, email, whatsapp,
  business_type, message, status, source,
  segment, company_size, ai_maturity, urgency,
  pain_main, fit_score, profile_type,
  diagnosis_summary,
  opportunities,
  proposed_solutions,
  diagnosis_requested, wants_human
) VALUES (
  '11111111-0001-0001-0001-000000000002',
  'Carlos Mendes',
  'carlos@barberiaamendes.com.br',
  '5511976540002',
  'Barbearia / Grooming',
  'Sou conhecido no bairro mas não consigo cobrar mais caro e meus clientes somem depois de um tempo.',
  'qualified',
  'website',
  'Barbearia / Grooming',
  'solo',
  'zero',
  '90dias',
  'Tenho fama no bairro mas não consigo cobrar mais caro. Clientes somem depois de um tempo.',
  74,
  'D',
  'Barbearia Mendes tem forte reconhecimento local, porém opera em posicionamento de comodidade sem diferenciação percebida, o que limita o teto de preço e gera churn silencioso. Perfil D indica necessidade de reposicionamento de marca antes de qualquer investimento em captação. Potencial de crescimento real se o repositório de identidade for reestruturado.',
  '[
    {"titulo": "Reposicionamento premium", "descricao": "Criar narrativa de barbeiro-artesão e identidade visual coerente para justificar aumento de 30-50% no ticket."},
    {"titulo": "Programa de fidelidade", "descricao": "Automação de agendamento + pontuação para reduzir churn e aumentar frequência de visitas."}
  ]'::jsonb,
  '[
    {"solucao": "Diagnóstico de Marca", "descricao": "Auditoria completa de posicionamento, logo e tom de voz com entregável de rebranding."},
    {"solucao": "ATom SDR WhatsApp", "descricao": "Agente de retenção com lembretes de agendamento e programa de indicações."}
  ]'::jsonb,
  true,
  true
) ON CONFLICT (id) DO NOTHING;

-- ── Lead 3: Patricia Lima — PL Método (Perfil B) ─────────────────────────

INSERT INTO public.leads (
  id,
  name, email, whatsapp,
  business_type, message, status, source,
  segment, company_size, ai_maturity, urgency,
  pain_main, fit_score, profile_type,
  diagnosis_summary,
  opportunities,
  proposed_solutions,
  diagnosis_requested, wants_human
) VALUES (
  '11111111-0001-0001-0001-000000000003',
  'Patricia Lima',
  'patricia@plmetodo.com.br',
  '5511965430003',
  'Educação / Coaching',
  'Tenho audiência no Instagram mas não monetizo. Quero lançar algo mas não sei por onde começar.',
  'contacted',
  'website',
  'Educação / Coaching',
  'solo',
  'basico',
  '90dias',
  'Tenho audiência no Instagram mas não monetizo. Quero lançar algo mas não sei por onde começar.',
  68,
  'B',
  'Patricia tem ativo de audiência real (seguidores engajados) mas sem estrutura de produto nem posicionamento claro, o que a coloca no Perfil B — potencial alto, execução zero. O principal desbloqueio é definir o método, nomear o produto e criar a jornada de compra. IA pode acelerar a criação de conteúdo de autoridade e o funil de lançamento.',
  '[
    {"titulo": "Produto digital de entrada", "descricao": "Workshop ou mini-curso para monetizar a audiência existente sem criar produto complexo de imediato."},
    {"titulo": "Funil de lançamento", "descricao": "Sequência de e-mail + WhatsApp automatizada para converter seguidores em compradores."},
    {"titulo": "Posicionamento de método", "descricao": "Nomear e estruturar o PL Método como produto com identidade própria para criar percepção de valor."}
  ]'::jsonb,
  '[
    {"solucao": "Sprint de Posicionamento", "descricao": "Sessão intensiva para definir nicho, método, produto de entrada e narrativa de autoridade."},
    {"solucao": "Funil ATom", "descricao": "Automação de lançamento com agente SDR para qualificação de leads da audiência Instagram."}
  ]'::jsonb,
  false,
  false
) ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. SEEDS — dossie_sections (3 por lead = 9 seções total)
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Seções do Lead 1: Fernanda Rocha ─────────────────────────────────────

INSERT INTO public.dossie_sections (id, lead_id, category, title, content, data, generated_by, model_used)
VALUES (
  '22222222-0001-0001-0001-000000000001',
  '11111111-0001-0001-0001-000000000001',
  'market_analysis',
  'Análise de Mercado — Estética e Beleza SP',
  'O segmento de estética e beleza no Brasil movimenta R$ 47 bi/ano e cresce 8% a.a., impulsionado pela demanda por procedimentos minimamente invasivos e bem-estar. Em São Paulo, a densidade de clínicas é alta, criando competição por diferenciação — especialmente entre o público feminino de 28-45 anos com renda B/A. Clínicas com posicionamento premium e presença digital estruturada cobram 2-3x mais que as sem marca definida. A principal ameaça vem de franquias com marketing centralizado. A oportunidade está em nichos de especialização (drenagem, skincare personalizado) combinados com automação de relacionamento.',
  '{
    "tamanho_mercado_br": "R$ 47 bi",
    "crescimento_anual": "8%",
    "publico_alvo": "mulheres 28-45 anos, renda B/A",
    "diferencial_premium": "2-3x de ticket médio com marca posicionada",
    "ameaca_principal": "franquias com marketing centralizado",
    "score_oportunidade": 78
  }'::jsonb,
  'ia',
  'gemini-2.5-flash'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.dossie_sections (id, lead_id, category, title, content, data, generated_by, model_used)
VALUES (
  '22222222-0001-0001-0001-000000000002',
  '11111111-0001-0001-0001-000000000001',
  'brand_audit',
  'Auditoria de Marca — Studio Élite Estética',
  'A marca Studio Élite comunica competência mas não exclusividade. O nome é adequado porém genérico — "Élite" é usado por dezenas de clínicas na região. Ausência de logotipo proprietário consistente: redes sociais usam três variações diferentes do nome. Paleta de cores (rosa-claro + branco) é esperada para o segmento, sem diferenciação. Tom de voz nas legendas do Instagram mistura linguagem íntima e formal sem consistência. Principais gaps: (1) identidade visual não transmite o ticket premium cobrado; (2) bio do Instagram não comunica posicionamento nem chamada de ação clara; (3) sem brand voice documentado, posts variam de autoria para autoria.',
  '{
    "consistencia_visual": 42,
    "alinhamento_tom_voz": 38,
    "clareza_posicionamento": 35,
    "presenca_digital_score": 55,
    "gaps": ["logo inconsistente", "paleta genérica", "brand voice ausente", "bio fraca"],
    "pontuacao_geral": 43
  }'::jsonb,
  'ia',
  'claude-opus'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.dossie_sections (id, lead_id, category, title, content, data, generated_by, model_used)
VALUES (
  '22222222-0001-0001-0001-000000000003',
  '11111111-0001-0001-0001-000000000001',
  'opportunities',
  'Oportunidades Identificadas — Studio Élite',
  'Três alavancas de crescimento foram identificadas com base no diagnóstico de marca e no mercado local. (1) Rebranding estratégico: reformular identidade visual para comunicar premium real — nova paleta, tipografia e logo únicos, com kit de brand para redes e materiais físicos. ROI esperado: aumento de 25-35% no ticket médio em 90 dias. (2) Automação de retenção: implementar agente WhatsApp para follow-up pós-procedimento, aniversários e reativação de clientes inativos (>60 dias). Estimativa de recuperação: 15-20% da base inativa por ciclo. (3) Captação local segmentada: campanhas Meta Ads geolocalizadas com criativos de autoridade (antes/depois, depoimentos em vídeo) para preenchimento de agenda nos horários ociosos (terças e quartas, 14h-17h).',
  '{
    "alavancas": [
      {"id": 1, "nome": "Rebranding estratégico", "impacto": "alto", "prazo": "60 dias", "roi_estimado": "25-35% ticket médio"},
      {"id": 2, "nome": "Automação de retenção", "impacto": "alto", "prazo": "30 dias", "roi_estimado": "15-20% reativação base"},
      {"id": 3, "nome": "Captação local Meta Ads", "impacto": "médio", "prazo": "15 dias", "roi_estimado": "R$ 3-5 por agendamento gerado"}
    ],
    "prioridade_recomendada": [2, 1, 3]
  }'::jsonb,
  'ia',
  'gemini-2.5-flash'
) ON CONFLICT (id) DO NOTHING;

-- ── Seções do Lead 2: Carlos Mendes ──────────────────────────────────────

INSERT INTO public.dossie_sections (id, lead_id, category, title, content, data, generated_by, model_used)
VALUES (
  '22222222-0001-0001-0001-000000000004',
  '11111111-0001-0001-0001-000000000002',
  'positioning',
  'Análise de Posicionamento — Barbearia Mendes Premium',
  'A Barbearia Mendes opera em posicionamento de conveniência local, não premium. O nome "Premium" no nome fantasia cria dissonância cognitiva: o cliente espera premium mas experimenta uma barbearia de bairro com precificação de mercado. Essa contradição sabota o aumento de preço — qualquer reajuste parece abusivo porque a experiência não sustenta a promessa. O posicionamento atual compete por proximidade geográfica e simpatia do Carlos, não por valor percebido. Para cobrar 30-50% a mais, a marca precisa justificar o preço antes do cliente entrar — via identidade visual, narrativa de artesanato/especialização e prova social (fotos de resultado, depoimentos em vídeo).',
  '{
    "posicionamento_atual": "conveniência local",
    "posicionamento_alvo": "barbeiro-artesão premium",
    "gap_preco_mercado": "30-50% abaixo do potencial premium",
    "dissonancia_nome": true,
    "score_posicionamento_atual": 31,
    "score_posicionamento_alvo": 75
  }'::jsonb,
  'ia',
  'claude-opus'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.dossie_sections (id, lead_id, category, title, content, data, generated_by, model_used)
VALUES (
  '22222222-0001-0001-0001-000000000005',
  '11111111-0001-0001-0001-000000000002',
  'logo_analysis',
  'Análise de Logo — Barbearia Mendes',
  'Logo atual: texto simples com tesoura e navalha clipart, em preto e dourado. Problemas identificados: (1) Clipart de tesoura é a solução de logo mais comum em barbearias brasileiras — zero diferenciação; (2) A tipografia serifada usada remete a farmácias dos anos 90, não ao universo grooming masculino moderno; (3) A proporção horizontal do logo não funciona bem em perfil circular de redes sociais; (4) O dourado é adequado para premium mas a execução é chapada, sem variações de luz/sombra que criam percepção de qualidade. Recomendação: desenvolver monograma "M" estilizado com conceito de navalha integrada à letra, em versão horizontal, quadrada e circular. Paleta: preto fosco + dourado metálico com versão monocromática.',
  '{
    "score_diferenciacao": 18,
    "score_execucao_tecnica": 35,
    "score_versatilidade": 25,
    "score_alinhamento_posicionamento": 22,
    "score_geral": 25,
    "problemas": ["clipart genérico", "tipografia desatualizada", "proporção rígida", "dourado chapado"],
    "conceito_proposto": "monograma M com navalha integrada"
  }'::jsonb,
  'ia',
  'gemini-2.5-flash'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.dossie_sections (id, lead_id, category, title, content, data, generated_by, model_used)
VALUES (
  '22222222-0001-0001-0001-000000000006',
  '11111111-0001-0001-0001-000000000002',
  'action_plan',
  'Plano de Ação 90 Dias — Barbearia Mendes Premium',
  'Sprint 1 (dias 1-30): Rebranding. Novo logo, paleta e brand voice documentados. Atualização de perfis Google Meu Negócio, Instagram e WhatsApp Business. Meta: identidade coesa em todos os pontos de contato. Sprint 2 (dias 31-60): Prova social. Produção de fotos profissionais de resultado (antes/depois), captação de 5 depoimentos em vídeo de clientes satisfeitos, criação de sequência de conteúdo de autoridade para Instagram (técnica, história, bastidores). Meta: 30 posts de portfólio publicados. Sprint 3 (dias 61-90): Reajuste de preço e automação. Comunicar novo posicionamento para base existente via WhatsApp, implementar agente de agendamento automático e programa de indicação (desconto para quem indicar amigo). Meta: primeiro reajuste de 20% com zero cancelamentos.',
  '{
    "sprints": [
      {"numero": 1, "foco": "Rebranding", "prazo": "30 dias", "meta": "identidade coesa em todos os canais"},
      {"numero": 2, "foco": "Prova social", "prazo": "60 dias", "meta": "30 posts de portfólio publicados"},
      {"numero": 3, "foco": "Reajuste + automação", "prazo": "90 dias", "meta": "aumento de 20% no ticket sem cancelamentos"}
    ],
    "investimento_estimado": "R$ 2.800 - R$ 4.500",
    "roi_esperado_90d": "R$ 8.000 - R$ 15.000 em receita incremental"
  }'::jsonb,
  'ia',
  'claude-opus'
) ON CONFLICT (id) DO NOTHING;

-- ── Seções do Lead 3: Patricia Lima ──────────────────────────────────────

INSERT INTO public.dossie_sections (id, lead_id, category, title, content, data, generated_by, model_used)
VALUES (
  '22222222-0001-0001-0001-000000000007',
  '11111111-0001-0001-0001-000000000003',
  'market_analysis',
  'Análise de Mercado — Educação e Coaching Digital',
  'O mercado brasileiro de educação digital (cursos online, mentorias, infoprodutos) faturou R$ 8 bi em 2024 e projeta crescimento de 18% a.a. até 2027. O segmento de coaching pessoal e profissional representa aproximadamente 15% desse volume. A barreira de entrada é baixa, o que cria saturação nos nichos genéricos (coaching de vida, produtividade). Diferenciação por método proprietário e nicho específico é o principal vetor de margem: coaches com método nomeado e posicionamento claro cobram 3-5x mais que generalistas. Audiência de 1.000-10.000 seguidores engajados no Instagram é ativo suficiente para um primeiro lançamento de R$ 50k-150k sem investimento em tráfego pago.',
  '{
    "mercado_br_2024": "R$ 8 bi",
    "crescimento_anual": "18%",
    "fatia_coaching": "15%",
    "multiplicador_metodo_proprietario": "3-5x ticket",
    "potencial_lancamento_audiencia_existente": "R$ 50k-150k",
    "score_oportunidade": 71
  }'::jsonb,
  'ia',
  'gemini-2.5-flash'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.dossie_sections (id, lead_id, category, title, content, data, generated_by, model_used)
VALUES (
  '22222222-0001-0001-0001-000000000008',
  '11111111-0001-0001-0001-000000000003',
  'opportunities',
  'Oportunidades Identificadas — PL Método',
  'A audiência da Patricia é o ativo mais valioso e mais subutilizado. Três oportunidades imediatas: (1) Produto de entrada: Workshop ao vivo de R$ 197 sobre o método PL aplicado ao maior problema do nicho. Baixo custo de produção, alto índice de conversão para audiência quente. Meta realista: 80-120 vendas = R$ 15-23k em uma semana. (2) Comunidade fechada: grupo de continuidade (R$ 97/mês) para quem comprou o workshop — produto de receita recorrente com churn baixo em comunidades bem moderadas. (3) Mentoria premium: para as 5-10% da base que querem acompanhamento individualizado. Ticket de R$ 2.500-5.000 por ciclo de 3 meses. Todas as três oportunidades podem coexistir como escada de valor.',
  '{
    "alavancas": [
      {"id": 1, "nome": "Workshop produto de entrada", "ticket": "R$ 197", "meta_vendas": "80-120", "receita_estimada": "R$ 15-23k"},
      {"id": 2, "nome": "Comunidade de continuidade", "ticket": "R$ 97/mês", "meta_membros": "40-60", "mrr_estimado": "R$ 3.880-5.820"},
      {"id": 3, "nome": "Mentoria premium", "ticket": "R$ 2.500-5.000", "vagas": "5-8", "receita_estimada": "R$ 12-40k/ciclo"}
    ],
    "modelo_recomendado": "escada de valor",
    "receita_potencial_12m": "R$ 180k-360k"
  }'::jsonb,
  'ia',
  'claude-opus'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.dossie_sections (id, lead_id, category, title, content, data, generated_by, model_used)
VALUES (
  '22222222-0001-0001-0001-000000000009',
  '11111111-0001-0001-0001-000000000003',
  'action_plan',
  'Plano de Ação 60 Dias — PL Método (Lançamento Zero)',
  'Fase 1 — Posicionamento (dias 1-14): Definir nicho-dor específico (quem exatamente Patricia ajuda e com qual transformação), nomear o método, criar bio e pitch de 30 segundos. Deliverável: documento de posicionamento aprovado. Fase 2 — Produto (dias 15-28): Estruturar o Workshop PL em 3 módulos de 45 min cada, criar página de vendas simples (Hotmart ou Kiwify), gravar vídeo de lançamento. Deliverável: produto pronto para venda. Fase 3 — Lançamento (dias 29-42): Sequência de aquecimento no Instagram (5 posts de conteúdo de autoridade), abertura de lista VIP via link na bio, live de lançamento com oferta especial. Deliverável: primeira receita gerada. Fase 4 — Automação (dias 43-60): Implementar agente SDR no WhatsApp para follow-up de quem não comprou, sequência de e-mail para nurturing da lista.',
  '{
    "fases": [
      {"numero": 1, "nome": "Posicionamento", "prazo": "14 dias", "deliverable": "documento de posicionamento aprovado"},
      {"numero": 2, "nome": "Produto", "prazo": "28 dias", "deliverable": "workshop pronto para venda"},
      {"numero": 3, "nome": "Lançamento", "prazo": "42 dias", "deliverable": "primeira receita gerada"},
      {"numero": 4, "nome": "Automação", "prazo": "60 dias", "deliverable": "funil automatizado ativo"}
    ],
    "investimento_estimado": "R$ 1.200 - R$ 2.000",
    "meta_lancamento": "R$ 15.000 - R$ 23.000"
  }'::jsonb,
  'ia',
  'gemini-2.5-flash'
) ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- Fim da migration 20260609000002_dossie.sql
-- ─────────────────────────────────────────────────────────────────────────────
