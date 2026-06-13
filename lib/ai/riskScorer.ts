import type { Account, AccountCategory, AccountDecision } from '@/types';

const KIMI_BASE = process.env.KIMI_API_URL ?? 'https://api.moonshot.cn/v1';
const KIMI_KEY = process.env.KIMI_API_KEY;

type KimiClassification = {
  domain: string;
  serviceName: string;
  category: AccountCategory;
  riskScore: number;
  riskReason: string;
};

export async function scoreUnknownDomains(
  domains: string[],
  userId: string,
): Promise<Omit<Account, 'id' | 'createdAt'>[]> {
  if (!KIMI_KEY || domains.length === 0) {
    return [];
  }

  const prompt = `
You are a cybersecurity risk analyst. Given these email sender domains, identify the service
behind each and assess the risk if the account is compromised or left unmanaged after death.

Domains: ${domains.join(', ')}

Return ONLY valid JSON array. No markdown. No explanation. No extra text:
[
  {
    "domain": "example.com",
    "serviceName": "Example Service",
    "category": "financial",
    "riskScore": 85,
    "riskReason": "One plain-English sentence explaining the risk score."
  }
]

Category options: financial | social | storage | entertainment | work | crypto | other

Risk score guide:
90-100: Crypto exchanges, primary banks, irreversible financial access
70-89: Secondary banks, cloud storage, core identity providers
50-69: Social media, professional networks, work tools
20-49: Entertainment, low-value subscriptions
0-19: Newsletters, one-time transactional emails, marketing

Skip any domain that is clearly a newsletter, transactional mailer, or spam.
`;

  const res = await fetch(`${KIMI_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${KIMI_KEY}`,
    },
    body: JSON.stringify({
      model: 'moonshot-v1-8k',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      max_tokens: 2000,
    }),
  });

  if (!res.ok) {
    throw new Error(`Kimi API error: ${res.status}`);
  }

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content?.trim() ?? '[]';
  const clean = raw.replace(/```json|```/g, '').trim();
  const classified = JSON.parse(clean) as KimiClassification[];

  return classified
    .filter((item) => item.riskScore >= 15)
    .map((item) => ({
      userId,
      serviceName: item.serviceName,
      serviceUrl: `https://${item.domain}`,
      category: item.category,
      riskScore: Math.min(100, Math.max(0, item.riskScore)),
      riskReason: item.riskReason,
      decision: 'undecided' as AccountDecision,
      discoveredVia: 'gmail' as const,
    }));
}
