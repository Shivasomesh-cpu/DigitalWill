# DigitalWill Frontend - Built with Next.js 14 & TypeScript

Complete dark-mode SaaS frontend for DigitalWill — a digital estate planning application.

## 🚀 Quick Start

### Installation
```bash
cd frontend
yarn install  # or npm install
```

### Development
```bash
yarn dev  # or npm run dev
```

Server runs at `http://localhost:3000`

### Environment Setup
```bash
cp .env.local.example .env.local
# Edit .env.local with your Google OAuth credentials
```

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages
│   │   └── login/page.tsx  # Google sign-in page
│   ├── (dashboard)/       # Protected dashboard
│   │   ├── page.tsx       # Home/stats dashboard
│   │   ├── scan/          # Gmail scanner
│   │   ├── accounts/      # Account manager
│   │   ├── will/          # Will builder wizard
│   │   └── deadman/       # Dead Man's Switch config
│   ├── layout.tsx         # Root layout with fonts
│   └── providers.tsx      # NextAuth & React Query setup
├── components/
│   ├── Sidebar.tsx        # Main navigation
│   ├── TopBar.tsx         # Header with breadcrumbs
│   └── ui/                # shadcn/ui components (buttons, inputs, etc.)
├── hooks/                 # Custom React hooks
│   ├── useAccounts.ts     # Account CRUD operations
│   ├── useScan.ts         # Gmail scanning with polling
│   ├── useWill.ts         # Will config management
│   └── useDeadman.ts      # Dead Man's Switch config
├── stores/
│   └── appStore.ts        # Zustand global state
├── types/
│   └── index.ts           # TypeScript type definitions (READ ONLY)
├── lib/
│   └── utils.ts           # Utilities (cn, getRiskColor, getRiskGlow)
├── constants/
│   └── mockData.ts        # Mock data for development
├── globals.css            # Design system & animations
├── tailwind.config.ts     # Tailwind with custom colors
└── tsconfig.json          # TypeScript configuration
```

## 🎨 Design System

### Colors (CSS Variables)
- `--bg`: #0A0A0F (deep dark background)
- `--surface`: #111118 (card background)
- `--surface-raised`: #1A1A25 (raised elements)
- `--accent`: #6366F1 (indigo primary)
- `--danger`: #EF4444 (red alerts)
- `--warning`: #F59E0B (amber warnings)
- `--success`: #22C55E (green success)
- `--text`: #F1F5F9 (light text)
- `--muted`: #64748B (secondary text)
- `--border`: #1E1E2E (border color)

### Fonts
- **Display/Headings**: Syne (700, 800)
- **Body**: Inter (400, 500)
- **Monospace**: JetBrains Mono (scores, IDs)

## 🔌 API Integration

All hooks automatically fall back to mock data when `NEXT_PUBLIC_USE_MOCK=true`.

### Endpoints
```
POST   /api/gmail/scan          → { jobId: string }
GET    /api/gmail/accounts      → Account[]

GET    /api/accounts            → Account[]
POST   /api/accounts            → Account
PATCH  /api/accounts/:id        → Account
DELETE /api/accounts/:id        → { deleted: true }

GET    /api/will                → WillConfig
PUT    /api/will                → WillConfig

GET    /api/deadman             → DeadManConfig
POST   /api/deadman             → DeadManConfig
DELETE /api/deadman             → { disabled: true }
POST   /api/deadman/ping        → { pingedAt: string }
```

## 📦 Dependencies

**Core Framework**
- Next.js 14
- React 18
- TypeScript

**State & Data**
- Zustand (global state)
- @tanstack/react-query (server state)
- @tanstack/react-table (advanced tables)

**UI & Animation**
- shadcn/ui components
- Radix UI primitives
- Tailwind CSS 3.4
- Framer Motion
- Lucide React icons

**Auth & Validation**
- next-auth@beta (Google OAuth)
- zod (schema validation)

**Charts**
- recharts (data visualization)

## 🛠️ Build & Deploy

### Production Build
```bash
yarn build
yarn start
```

### Type Checking
```bash
npx tsc --noEmit
```

### Linting
```bash
yarn lint  # if configured
```

## 🔐 Authentication

Uses **NextAuth.js v5** with Google OAuth provider.

1. Configure Google OAuth credentials at [Google Cloud Console](https://console.cloud.google.com/)
2. Add credentials to `.env.local`
3. Login flow: `signIn('google')` → Redirect to `/` after auth

## 📊 State Management

**Global State (Zustand)**
- `accounts`: Account[]
- `scanStatus`: 'idle' | 'scanning' | 'complete' | 'error'
- `scannedCount`: number
- `will`: WillConfig | null
- `deadman`: DeadManConfig | null

**Server State (React Query)**
- Managed within custom hooks
- Auto caching with 60s stale time

## 🧪 Mock Data

When `NEXT_PUBLIC_USE_MOCK=true`:
- 12 sample accounts with realistic risk scores
- Mock will config template
- Mock dead man's switch config
- Simulated scanning animation

**To switch to real backend:**
```bash
# Set in .env.local
NEXT_PUBLIC_USE_MOCK=false
```

## 🎯 Key Features Implemented

✅ **Login Page**
- Google OAuth integration
- Animated network background
- Security messaging

✅ **Dashboard Home**
- Real-time stats cards
- Risk distribution pie chart
- Quick action CTAs
- Framer Motion animations

✅ **Gmail Scanner**
- Three-state UI (idle/scanning/complete)
- Animated pulse rings during scan
- Live counter updates
- Account card stagger animation

✅ **Account Manager**
- Advanced filtering (category, decision, sort)
- Editable table with bulk actions
- Real-time risk glow effects
- Notes and transfer-to fields

✅ **Will Builder**
- 3-step wizard with progress bar
- Decision grouping by action type
- Email preview modal
- Character counter

✅ **Dead Man's Switch**
- Progress bar with dynamic coloring
- Threshold selector (7, 14, 30, 60, 90 days)
- Warning banner at 80% threshold
- Confirmation dialog for disable

## 📝 Notes for Backend Team

- All hooks support both mock and real API
- API responses must match `ApiResponse<T>` type
- Polling for scan results needs backend support (see `useScan.ts`)
- User authentication handled by NextAuth
- Zustand store is read-only from components; mutations only via hooks

## 🚀 Next Steps

1. ✅ Frontend complete and ready for integration
2. Backend: Implement `/api/**` endpoints
3. Testing: E2E tests with Playwright
4. Deployment: Vercel (recommended for Next.js)
5. Monitoring: Set up error tracking (Sentry)

---

Built with ❤️ for the hackathon. Let's secure digital legacies.
