import type { Account, AccountCategory, AccountDecision } from '@/types';
import { scoreUnknownDomains } from '@/lib/ai/riskScorer';
import { SERVICE_MAP } from '@/lib/gmail/serviceMap';
import { supabase } from '@/lib/supabase/client';

const SKIP_DOMAINS = new Set([
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'outlook.com',
  'hotmail.com',
]);

export async function scanGmail(accessToken: string, userId: string): Promise<Account[]> {
  const listRes = await fetch(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=500&fields=messages/id',
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );

  if (!listRes.ok) {
    throw new Error(`Gmail API error: ${listRes.status}`);
  }

  const { messages = [] } = (await listRes.json()) as {
    messages?: Array<{ id: string }>;
  };

  const fromAddresses: string[] = [];
  const batch = messages.slice(0, 200);
  const chunkSize = 30;

  for (let i = 0; i < batch.length; i += chunkSize) {
    const chunk = batch.slice(i, i + chunkSize);
    const results = await Promise.allSettled(
      chunk.map((message) =>
        fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}?format=metadata&metadataHeaders=From`,
          { headers: { Authorization: `Bearer ${accessToken}` } },
        ).then((res) => res.json()),
      ),
    );

    for (const result of results) {
      if (result.status !== 'fulfilled') continue;

      const from = result.value?.payload?.headers?.find(
        (header: { name: string }) => header.name.toLowerCase() === 'from',
      );

      if (from?.value) {
        fromAddresses.push(from.value);
      }
    }
  }

  const domains = [
    ...new Set(
      fromAddresses
        .map((from) => from.match(/@([\w.-]+)/)?.[1]?.toLowerCase())
        .filter(Boolean) as string[],
    ),
  ];

  const knownAccounts: Array<Omit<Account, 'id' | 'createdAt'>> = [];
  const unknownDomains: string[] = [];

  for (const domain of domains) {
    const known = SERVICE_MAP[domain];

    if (known) {
      knownAccounts.push({
        ...known,
        userId,
        decision: 'undecided' as AccountDecision,
        discoveredVia: 'gmail' as const,
      });
    } else if (!SKIP_DOMAINS.has(domain)) {
      unknownDomains.push(domain);
    }
  }

  let aiAccounts: Array<Omit<Account, 'id' | 'createdAt'>> = [];
  if (unknownDomains.length > 0) {
    try {
      aiAccounts = await scoreUnknownDomains(unknownDomains.slice(0, 30), userId);
    } catch (error) {
      console.error('Kimi scoring failed, skipping unknown domains:', error);
    }
  }

  const allAccounts = [...knownAccounts, ...aiAccounts];

  if (allAccounts.length > 0) {
    const rows = allAccounts.map(accountToDbRow);
    const { error } = await supabase
      .from('accounts')
      .upsert(rows, { onConflict: 'user_id,service_name', ignoreDuplicates: false });

    if (error) {
      throw error;
    }
  }

  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    throw error;
  }

  return (data ?? []).map(dbRowToAccount);
}

export function accountToDbRow(account: Partial<Account>) {
  return {
    ...(account.userId && { user_id: account.userId }),
    ...(account.serviceName && { service_name: account.serviceName }),
    ...(account.serviceUrl !== undefined && { service_url: account.serviceUrl }),
    ...(account.logoUrl !== undefined && { logo_url: account.logoUrl }),
    ...(account.category && { category: account.category }),
    ...(account.riskScore !== undefined && { risk_score: account.riskScore }),
    ...(account.riskReason !== undefined && { risk_reason: account.riskReason }),
    ...(account.decision && { decision: account.decision }),
    ...(account.transferTo !== undefined && { transfer_to: account.transferTo }),
    ...(account.notes !== undefined && { notes: account.notes }),
    ...(account.discoveredVia && { discovered_via: account.discoveredVia }),
  };
}

export function dbRowToAccount(row: Record<string, unknown>): Account {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    serviceName: row.service_name as string,
    serviceUrl: row.service_url as string | undefined,
    logoUrl: row.logo_url as string | undefined,
    category: row.category as AccountCategory,
    riskScore: row.risk_score as number,
    riskReason: row.risk_reason as string | undefined,
    decision: row.decision as AccountDecision,
    transferTo: row.transfer_to as string | undefined,
    notes: row.notes as string | undefined,
    discoveredVia: row.discovered_via as 'gmail' | 'manual',
    createdAt: row.created_at as string,
  };
}
