const siteKnowledge = `Você é o atendimento virtual oficial da Caverna Torrinha, em Iraquara, Chapada Diamantina, Bahia.

Use somente as informações abaixo. Responda em português do Brasil, com clareza e brevidade. Se a pergunta não for sobre a Caverna Torrinha ou se a informação não estiver nesta base, diga que não possui essa informação e recomende contato pelo WhatsApp (75) 99856-1666. Nunca invente preços, horários, disponibilidade, regras ou informações de segurança.

Informações do site:
- A Caverna Torrinha fica na zona rural de Iraquara-BA, a cerca de 15 km do centro de Iraquara, 1 km da BA-122 e 64 km de Lençóis.
- Funcionamento: todos os dias, das 8h às 17h.
- Reservas não são obrigatórias, exceto para grupos grandes ou alta temporada.
- Preços informados no site: de R$ 40 no passeio mais simples até R$ 150 no roteiro completo. Confirme valores atuais pelo WhatsApp.
- Guia é obrigatório. Capacete e lanterna são fornecidos. O terreno é irregular e possui escadas; pode haver limitação para pessoas com mobilidade reduzida.
- Crianças devem estar acompanhadas por um adulto responsável. Recomenda-se levar apenas água e usar calçado fechado.
- A caverna possui 14,5 km mapeados e 2,5 km acessíveis à visitação, dentro da APA Marimbus-Iraquara.
- Se perguntarem quantos quilômetros a caverna tem, responda: a Caverna Torrinha tem 14,5 km mapeados, dos quais 2,5 km são acessíveis à visitação.
- Roteiro do Capitão: cerca de 700 m, duração média de 1 hora, esforço leve; inclui estalactites, estalagmites, colunas e cortinas.
- Roteiro Valery: cerca de 1,2 km, duração média de 1h30, esforço moderado; destaca flores de aragonita, helictites e agulhas de gipsita.
- Roteiro das Raridades: inclui a bolha de calcita com flor de aragonita, o Salão dos Vulcões, helictite com flor na ponta e a réplica do Morro do Pai Inácio.
- Roteiro Completo: reúne os roteiros anteriores, cerca de 3 km, duração de até 2h30 e esforço moderado a avançado.
- Contato: WhatsApp (75) 99856-1666; Instagram @cavernatorrinha_oficial.`;

const getOfficialSiteText = async () => {
  try {
    const response = await fetch('https://cavernatorrinha.com/', { signal: AbortSignal.timeout(5000) });
    if (!response.ok) return '';
    const html = await response.text();
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 30000);
  } catch {
    return '';
  }
};

export default async function handler(req, res) {
  const allowedOrigins = new Set(['https://cavernatorrinha.com', 'https://sitetorrinha.vercel.app']);
  const requestOrigin = req.headers.origin;
  if (allowedOrigins.has(requestOrigin)) res.setHeader('Access-Control-Allow-Origin', requestOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido.' });
  if (!process.env.OPENAI_API_KEY) return res.status(500).json({ error: 'A chave da OpenAI ainda não foi configurada.' });
  try {
    const messages = Array.isArray(req.body?.messages) ? req.body.messages.slice(-8) : [];
    const question = String(messages.filter(message => message.role === 'user').at(-1)?.content || '').toLowerCase();
    if (question.includes('instagram') || question.includes('insta')) {
      return res.status(200).json({ answer: 'O Instagram oficial é @cavernatorrinha_oficial. Você também pode acessar: https://www.instagram.com/cavernatorrinha_oficial/' });
    }
    if (question.includes('km') || question.includes('quilometr')) {
      return res.status(200).json({ answer: 'A Caverna Torrinha tem 14,5 km mapeados. Desse total, 2,5 km são acessíveis à visitação.' });
    }
    const officialSiteText = await getOfficialSiteText();
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: 'gpt-5-mini',
        instructions: `${siteKnowledge}\n\nConteúdo atualizado consultado no site oficial:\n${officialSiteText || 'O site oficial não respondeu agora; use a base fixa acima.'}\n\nQuando a informação não estiver no conteúdo da Caverna Torrinha, pesquise na internet antes de responder. Dê prioridade a fontes oficiais e atuais. Se não encontrar uma resposta confiável, diga isso claramente.`,
        tools: [{ type: 'web_search' }],
        input: messages
      })
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: 'A OpenAI não conseguiu responder agora.' });
    return res.status(200).json({ answer: data.output_text || 'Não encontrei uma resposta confiável agora. Para confirmar essa informação, fale com a equipe da Caverna Torrinha pelo WhatsApp: (75) 99856-1666.' });
  } catch {
    return res.status(500).json({ error: 'Não foi possível conectar ao atendimento agora.' });
  }
}
