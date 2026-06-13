CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email      TEXT UNIQUE NOT NULL,
  name       TEXT,
  avatar_url TEXT,
  last_ping  TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS accounts (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID REFERENCES users(id) ON DELETE CASCADE,
  service_name   TEXT NOT NULL,
  service_url    TEXT,
  logo_url       TEXT,
  category       TEXT NOT NULL DEFAULT 'other',
  risk_score     INTEGER NOT NULL DEFAULT 50 CHECK (risk_score BETWEEN 0 AND 100),
  risk_reason    TEXT,
  decision       TEXT NOT NULL DEFAULT 'undecided',
  transfer_to    TEXT,
  notes          TEXT,
  discovered_via TEXT NOT NULL DEFAULT 'gmail',
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, service_name)
);

CREATE TABLE IF NOT EXISTS will_configs (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  trusted_contact_name  TEXT NOT NULL,
  trusted_contact_email TEXT NOT NULL,
  custom_message        TEXT,
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS deadman_configs (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  threshold_days INTEGER NOT NULL DEFAULT 30 CHECK (threshold_days IN (7, 14, 30, 60, 90)),
  is_active      BOOLEAN NOT NULL DEFAULT FALSE,
  last_triggered TIMESTAMPTZ,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE will_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE deadman_configs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own user" ON users;
DROP POLICY IF EXISTS "own accounts" ON accounts;
DROP POLICY IF EXISTS "own will" ON will_configs;
DROP POLICY IF EXISTS "own deadman" ON deadman_configs;

CREATE POLICY "own user" ON users
  FOR SELECT USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "own accounts" ON accounts
  FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "own will" ON will_configs
  FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "own deadman" ON deadman_configs
  FOR ALL USING (auth.uid()::text = user_id::text);

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON accounts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON will_configs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON deadman_configs TO authenticated;
