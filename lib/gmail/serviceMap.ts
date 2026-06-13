import type { AccountCategory } from '@/types';

type ServiceInfo = {
  serviceName: string;
  serviceUrl?: string;
  logoUrl?: string;
  category: AccountCategory;
  riskScore: number;
  riskReason?: string;
};

export const SERVICE_MAP: Record<string, ServiceInfo> = {
  'hdfcbank.com': { serviceName: 'HDFC Bank', serviceUrl: 'https://www.hdfcbank.com', category: 'financial', riskScore: 94, riskReason: 'Direct access to funds and sensitive banking records.' },
  'icicibank.com': { serviceName: 'ICICI Bank', serviceUrl: 'https://www.icicibank.com', category: 'financial', riskScore: 93, riskReason: 'Full banking access including payments and transfers.' },
  'sbi.co.in': { serviceName: 'SBI', serviceUrl: 'https://sbi.co.in', category: 'financial', riskScore: 92, riskReason: 'Primary banking access with high financial exposure.' },
  'axisbank.com': { serviceName: 'Axis Bank', serviceUrl: 'https://www.axisbank.com', category: 'financial', riskScore: 91, riskReason: 'Banking and credit card access.' },
  'amazon.in': { serviceName: 'Amazon India', serviceUrl: 'https://www.amazon.in', category: 'financial', riskScore: 80, riskReason: 'Saved payment methods and purchase history.' },
  'amazon.com': { serviceName: 'Amazon', serviceUrl: 'https://www.amazon.com', category: 'financial', riskScore: 80, riskReason: 'Saved payment methods and purchase history.' },
  'zerodha.com': { serviceName: 'Zerodha', serviceUrl: 'https://zerodha.com', category: 'financial', riskScore: 91, riskReason: 'Stock trading account with irreversible transaction risk.' },
  'groww.in': { serviceName: 'Groww', serviceUrl: 'https://groww.in', category: 'financial', riskScore: 89, riskReason: 'Investments and financial portfolio access.' },
  'paytm.com': { serviceName: 'Paytm', serviceUrl: 'https://paytm.com', category: 'financial', riskScore: 82, riskReason: 'Digital wallet and linked payment instruments.' },
  'phonepe.com': { serviceName: 'PhonePe', serviceUrl: 'https://www.phonepe.com', category: 'financial', riskScore: 83, riskReason: 'UPI payments linked to bank account.' },
  'coinbase.com': { serviceName: 'Coinbase', serviceUrl: 'https://www.coinbase.com', category: 'crypto', riskScore: 98, riskReason: 'Crypto exchange access can lead to irreversible loss.' },
  'binance.com': { serviceName: 'Binance', serviceUrl: 'https://www.binance.com', category: 'crypto', riskScore: 97, riskReason: 'Crypto exchange access can lead to unrecoverable transactions.' },
  'wazirx.com': { serviceName: 'WazirX', serviceUrl: 'https://wazirx.com', category: 'crypto', riskScore: 95, riskReason: 'Crypto holdings and irreversible transfer risk.' },
  'google.com': { serviceName: 'Google', serviceUrl: 'https://myaccount.google.com', category: 'storage', riskScore: 86, riskReason: 'Core identity, email, photos, and cloud data access.' },
  'apple.com': { serviceName: 'Apple', serviceUrl: 'https://appleid.apple.com', category: 'storage', riskScore: 84, riskReason: 'Core identity, devices, payment methods, and iCloud data.' },
  'dropbox.com': { serviceName: 'Dropbox', serviceUrl: 'https://www.dropbox.com', category: 'storage', riskScore: 75, riskReason: 'Private documents and shared files may be stored.' },
  'box.com': { serviceName: 'Box', serviceUrl: 'https://www.box.com', category: 'storage', riskScore: 70, riskReason: 'Enterprise and personal cloud storage access.' },
  'linkedin.com': { serviceName: 'LinkedIn', serviceUrl: 'https://www.linkedin.com', category: 'work', riskScore: 65, riskReason: 'Professional identity and private messages.' },
  'github.com': { serviceName: 'GitHub', serviceUrl: 'https://github.com', category: 'work', riskScore: 72, riskReason: 'Private code, tokens, and software supply-chain access.' },
  'slack.com': { serviceName: 'Slack', serviceUrl: 'https://slack.com', category: 'work', riskScore: 60, riskReason: 'Workplace communications may contain sensitive information.' },
  'notion.so': { serviceName: 'Notion', serviceUrl: 'https://www.notion.so', category: 'work', riskScore: 55, riskReason: 'Private notes, plans, and possible credentials.' },
  'atlassian.com': { serviceName: 'Atlassian', serviceUrl: 'https://www.atlassian.com', category: 'work', riskScore: 62, riskReason: 'Project and work documentation access.' },
  'facebook.com': { serviceName: 'Facebook', serviceUrl: 'https://www.facebook.com', category: 'social', riskScore: 62, riskReason: 'Personal data, contacts, and private messages.' },
  'instagram.com': { serviceName: 'Instagram', serviceUrl: 'https://www.instagram.com', category: 'social', riskScore: 58, riskReason: 'Personal media and social identity.' },
  'twitter.com': { serviceName: 'Twitter/X', serviceUrl: 'https://x.com', category: 'social', riskScore: 55, riskReason: 'Public identity and direct messages.' },
  'x.com': { serviceName: 'X', serviceUrl: 'https://x.com', category: 'social', riskScore: 55, riskReason: 'Public identity and direct messages.' },
  'reddit.com': { serviceName: 'Reddit', serviceUrl: 'https://www.reddit.com', category: 'social', riskScore: 35, riskReason: 'Pseudonymous identity with lower financial risk.' },
  'netflix.com': { serviceName: 'Netflix', serviceUrl: 'https://www.netflix.com', category: 'entertainment', riskScore: 22, riskReason: 'Subscription account with low financial exposure.' },
  'spotify.com': { serviceName: 'Spotify', serviceUrl: 'https://www.spotify.com', category: 'entertainment', riskScore: 18, riskReason: 'Subscription account with limited sensitive data.' },
  'primevideo.com': { serviceName: 'Prime Video', serviceUrl: 'https://www.primevideo.com', category: 'entertainment', riskScore: 30, riskReason: 'Streaming account linked to Amazon ecosystem.' },
  'hotstar.com': { serviceName: 'Disney+ Hotstar', serviceUrl: 'https://www.hotstar.com', category: 'entertainment', riskScore: 25, riskReason: 'Subscription streaming account.' },
  'steampowered.com': { serviceName: 'Steam', serviceUrl: 'https://store.steampowered.com', category: 'entertainment', riskScore: 45, riskReason: 'Game library, wallet balance, and social account access.' },
};
