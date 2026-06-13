import { supabase } from '@/lib/supabase/client';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

type DeadmanConfigRow = {
  id: string;
  threshold_days: number;
  last_triggered?: string | null;
  users:
    | {
        id: string;
        email: string;
        name?: string | null;
        last_ping: string;
      }
    | Array<{
        id: string;
        email: string;
        name?: string | null;
        last_ping: string;
      }>
    | null;
  will_configs:
    | {
        trusted_contact_name: string;
        trusted_contact_email: string;
        custom_message?: string | null;
      }
    | Array<{
        trusted_contact_name: string;
        trusted_contact_email: string;
        custom_message?: string | null;
      }>
    | null;
};

type AccountRow = {
  service_name: string;
  decision: 'keep' | 'delete' | 'transfer' | 'undecided';
  transfer_to?: string | null;
};

export async function GET(req: Request): Promise<Response> {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: configs, error } = await supabase
    .from('deadman_configs')
    .select(
      `
      id,
      threshold_days,
      last_triggered,
      users ( id, email, name, last_ping ),
      will_configs ( trusted_contact_name, trusted_contact_email, custom_message )
    `,
    )
    .eq('is_active', true);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  let triggered = 0;

  for (const config of (configs ?? []) as unknown as DeadmanConfigRow[]) {
    const user = Array.isArray(config.users) ? config.users[0] : config.users;
    const will = Array.isArray(config.will_configs)
      ? config.will_configs[0]
      : config.will_configs;

    if (!user || !will) continue;

    const lastPing = new Date(user.last_ping).getTime();
    const thresholdMs = config.threshold_days * 24 * 60 * 60 * 1000;
    const elapsed = Date.now() - lastPing;

    if (config.last_triggered) {
      const sinceLastFire = Date.now() - new Date(config.last_triggered).getTime();
      if (sinceLastFire < 7 * 24 * 60 * 60 * 1000) continue;
    }

    if (elapsed < thresholdMs) continue;

    const { data: accounts, error: accountError } = await supabase
      .from('accounts')
      .select('service_name, decision, transfer_to')
      .eq('user_id', user.id);

    if (accountError) {
      console.error('Failed to fetch deadman accounts:', accountError);
      continue;
    }

    const accountRows = (accounts ?? []) as AccountRow[];
    const toDelete = accountRows.filter((account) => account.decision === 'delete');
    const toTransfer = accountRows.filter((account) => account.decision === 'transfer');
    const toKeep = accountRows.filter((account) => account.decision === 'keep');

    const emailBody = buildEmail({
      userName: user.name ?? user.email,
      contactName: will.trusted_contact_name,
      toDelete: toDelete.map((account) => account.service_name),
      toTransfer: toTransfer.map((account) => ({
        name: account.service_name,
        to: account.transfer_to ?? 'No transfer recipient specified',
      })),
      toKeep: toKeep.map((account) => account.service_name),
      customMessage: will.custom_message ?? undefined,
    });

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'DigitalWill <noreply@yourdomain.com>',
      to: will.trusted_contact_email,
      subject: `Instructions from ${user.name ?? user.email} - DigitalWill`,
      html: emailBody,
    });

    await supabase
      .from('deadman_configs')
      .update({ last_triggered: new Date().toISOString() })
      .eq('id', config.id);

    triggered++;
  }

  return Response.json({ triggered });
}

function buildEmail(opts: {
  userName: string;
  contactName: string;
  toDelete: string[];
  toTransfer: Array<{ name: string; to: string }>;
  toKeep: string[];
  customMessage?: string;
}) {
  const rows = (items: string[]) =>
    items.map((item) => `<li style="margin:4px 0">${escapeHtml(item)}</li>`).join('');

  return `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
      <h2 style="color:#6366f1">Hi ${escapeHtml(opts.contactName)},</h2>
      <p><strong>${escapeHtml(opts.userName)}</strong> set up a DigitalWill and designated you as their trusted contact. Because they have not logged in recently, their instructions have been sent to you automatically.</p>
      <hr style="border-color:#e2e8f0"/>
      ${opts.toDelete.length ? `<h3 style="color:#ef4444">To Delete</h3><ul>${rows(opts.toDelete)}</ul>` : ''}
      ${
        opts.toTransfer.length
          ? `<h3 style="color:#6366f1">To Transfer</h3><ul>${opts.toTransfer
              .map(
                (item) =>
                  `<li>${escapeHtml(item.name)} <span style="color:#64748b">(${escapeHtml(item.to)})</span></li>`,
              )
              .join('')}</ul>`
          : ''
      }
      ${opts.toKeep.length ? `<h3 style="color:#22c55e">To Keep</h3><ul>${rows(opts.toKeep)}</ul>` : ''}
      ${
        opts.customMessage
          ? `<hr style="border-color:#e2e8f0"/><h3>Their Message</h3><blockquote style="border-left:3px solid #6366f1;padding-left:12px;color:#64748b">${escapeHtml(opts.customMessage)}</blockquote>`
          : ''
      }
      <hr style="border-color:#e2e8f0"/>
      <p style="color:#94a3b8;font-size:13px">Sent automatically by DigitalWill. No passwords were shared. These are their instructions only.</p>
    </div>
  `;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
