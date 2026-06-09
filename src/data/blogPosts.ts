export interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  readTime: string;
  date: string;
  excerpt: string;
  content: string; // markdown-style paragraphs split by \n\n
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "empresa-que-depende-de-voce-nao-e-empresa",
    title: "Empresa que depende de você não é empresa. É um emprego disfarçado.",
    subtitle: "O fundador que não consegue tirar férias tem um sinal claro: a operação ainda não virou sistema.",
    category: "Operação",
    readTime: "4 min",
    date: "2026-06-05",
    excerpt: "Se você sai e a empresa para, você não tem uma empresa. Tem um emprego com CNPJ.",
    tags: ["Operação", "IA", "Fundador"],
    content: `Se você sai de férias por 15 dias e quando volta encontra incêndio, você não tem uma empresa. Tem um emprego com CNPJ.

Essa frase incomoda porque é precisa. A maioria dos donos de negócio que chegam até a ATom's não tem problema de produto. Tem produto bom, time razoável, receita crescendo. O problema é que tudo passa pela cabeça deles.

Atendimento? O cliente quer falar com o dono. Aprovação de proposta? Passa pelo dono. Cobrança de inadimplente? O time não tem autoridade — passa pelo dono. Contratação? O dono entrevista todos.

Isso tem um nome técnico: ponto único de falha humano. E é o maior risco operacional que uma empresa pode ter.

**Por que isso acontece?**

Não é falta de delegação. É falta de sistema. Quando os processos vivem na cabeça de uma pessoa, não existe protocolo para delegar — existe improvisação. E improvisação não escala.

A solução não é contratar mais gente. É construir a arquitetura que faz a informação fluir, a decisão acontecer e o cliente ser atendido — independente de quem está online.

**O que a ATom's faz com isso**

Mapeamos onde você está no centro da operação e construímos o sistema que te tira do caminho crítico. Agente de atendimento que qualifica e responde sem você. Fluxo de cobrança automático. CRM que atualiza sem input manual. Dashboard que te mostra o número certo sem ter que perguntar para ninguém.

O objetivo não é tirar você da empresa. É tirar você do operacional para você entrar no estratégico.

Empresa que depende de uma pessoa para funcionar vale menos, cresce menos e estafa o fundador mais rápido. Não precisa ser assim.`,
  },
  {
    slug: "agente-de-ia-nao-e-chatbot",
    title: "Agente de IA não é chatbot. Entenda a diferença antes de comprar.",
    subtitle: "A maioria das empresas está pagando por automação de resposta quando precisa de automação de decisão.",
    category: "IA",
    readTime: "5 min",
    date: "2026-05-28",
    excerpt: "Chatbot responde. Agente decide, age e reporta. São coisas completamente diferentes.",
    tags: ["IA", "Agentes", "Tecnologia"],
    content: `Chatbot responde. Agente decide, age e reporta. Parece sutil, mas é a diferença entre uma ferramenta e um colaborador.

Um chatbot é um menu de respostas com interface conversacional. Ele reconhece padrões no texto e devolve uma resposta pré-cadastrada ou gerada. É útil para FAQ, triagem básica e desvio de volume. Não faz nada além disso.

Um agente de IA tem memória, contexto, ferramentas e autonomia para agir. Ele pode acessar seu CRM, atualizar o status de um lead, agendar uma reunião no Google Calendar, enviar um e-mail de follow-up, verificar se um pagamento foi confirmado e escalar para um humano — tudo no mesmo fluxo, sem intervenção.

**Por que a confusão existe?**

Porque os dois usam linguagem natural na interface. A maioria das empresas que "implementou IA" implementou um chatbot e chamou de agente. Não é desonestidade — é que a indústria abusou do termo.

A distinção prática: chatbot para quando o usuário não responde ao script. Agente segue em frente, toma a próxima ação lógica e registra o que aconteceu.

**O que muda na prática**

Com chatbot: você automatiza resposta. O lead ainda precisa de um humano para avançar no funil.

Com agente: você automatiza o processo inteiro. O lead chega, é qualificado, recebe proposta, assina contrato e tem o acesso criado — sem um humano tocar.

Na ATom's construímos agentes, não chatbots. A diferença no resultado é a diferença entre "economizamos 2h por semana de atendimento" e "nosso atendimento funciona 24/7 sem nenhuma contratação nova".`,
  },
  {
    slug: "quanto-custa-nao-ter-sistema",
    title: "Quanto custa não ter sistema? Calculamos para você.",
    subtitle: "O custo do improviso não aparece no DRE. Mas está lá, todo mês.",
    category: "Financeiro",
    readTime: "6 min",
    date: "2026-05-15",
    excerpt: "Retrabalho, lead perdido, cobrança manual, reunião de alinhamento que não alinha ninguém. Isso tem preço.",
    tags: ["Operação", "Financeiro", "Gestão"],
    content: `O custo do improviso não aparece no DRE. Não tem linha de "Retrabalho" ou "Reunião Inútil" no balanço. Mas está lá, todo mês, comendo margem de forma invisível.

Fizemos essa conta com dezenas de empresas. Os números variam, mas o padrão é sempre o mesmo.

**Custo 1: Lead sem follow-up**

Em média, uma empresa perde 40% dos leads por falta de contato nas primeiras 2 horas. Se você gera 100 leads por mês a R$ 30 cada (custo de tráfego), está jogando fora R$ 1.200/mês só em custo de aquisição — sem contar a receita que não entrou.

**Custo 2: Cobrança manual**

Um time de 3 pessoas passando 30 minutos por dia em cobrança é 45 horas/mês. A R$ 25/hora, são R$ 1.125/mês gastos em uma tarefa que um agente faz em segundos.

**Custo 3: Retrabalho por falta de processo**

"Mas como ficou combinado?" é a pergunta mais cara da operação. Cada ciclo de retrabalho consome em média 2h do time. Com 10 ciclos por mês, são 20h — o equivalente a meio colaborador.

**Custo 4: Reuniões de alinhamento**

Reunião de alinhamento é sintoma de ausência de sistema. Se você precisa reunir as pessoas para elas saberem o que está acontecendo, seu fluxo de informação está quebrado. Cada hora de reunião custa o dobro em produtividade perdida.

**O total**

Sem fazer nenhum cálculo exótico: R$ 6.000 a R$ 15.000 por mês em custo invisível é o que vemos na maioria das PMEs com faturamento entre R$ 200k e R$ 2M mensais.

A ATom's cobra menos do que isso para construir o sistema que elimina esses custos. A conta não é "quanto vou gastar". A conta é "quanto estou gastando sem perceber".`,
  },
  {
    slug: "por-que-automacao-fracassa",
    title: "Por que 80% das automações fracassam em 90 dias",
    subtitle: "Não é o tool que falha. É a falta de arquitetura antes da ferramenta.",
    category: "IA",
    readTime: "5 min",
    date: "2026-05-02",
    excerpt: "A empresa compra a ferramenta, conecta duas coisas e chama de automação. Depois de 3 meses ninguém usa mais.",
    tags: ["Automação", "IA", "Erros comuns"],
    content: `"A gente tentou o n8n mas não deu certo." "Contratamos uma agência de automação, fizeram um fluxo que parou de funcionar." "Instalamos o ChatGPT no WhatsApp mas o time não usou."

Esses relatos aparecem em quase toda conversa que temos com novos clientes. E o padrão é sempre o mesmo: a empresa comprou a ferramenta antes de entender o problema.

**Por que falha**

Automação sem arquitetura é encanamento sem projeto hidráulico. Você conecta os canos, funciona por uma semana, aí uma atualização de API quebra tudo, ou o fluxo não previu um caso de uso comum, ou o time não foi treinado e simplesmente ignorou.

Os motivos reais de falha, em ordem de frequência:

1. **Automatizaram o processo errado.** Colocaram robô em cima de processo que já estava quebrado. O robô só acelerou o erro.

2. **Não definiram quem é dono da automação.** Ninguém no time assume responsabilidade quando quebra. Fica sem manutenção.

3. **Dependência de uma pessoa que saiu.** O freelancer que construiu foi embora e ninguém sabe como funciona.

4. **Falta de monitoramento.** Nenhum alerta quando o fluxo falha silenciosamente. A empresa descobre que não está funcionando 30 dias depois.

5. **Ferramenta errada para o problema.** Zapier para volume alto, n8n sem servidor adequado, ChatGPT sem memória para atendimento que precisa de contexto.

**O que muda com arquitetura**

Antes de escrever uma linha de código ou configurar um workflow, a ATom's mapeia: qual o processo, quem são os atores, o que pode dar errado, quem monitora, como escala.

A ferramenta é a última decisão, não a primeira. E por isso os sistemas que construímos ainda funcionam 12 meses depois.`,
  },
];
