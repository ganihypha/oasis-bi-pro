-- ============================================================================
-- OASIS BI PRO — Migration 0002
-- Adds: leads table (lead-capture for Sovereign BI Playbook PDF magnet)
--       status_events table (uptime + incident log for /status page)
-- ============================================================================

-- 9. Leads (lead-capture form on homepage / pricing — UP-2 closure)
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  source TEXT,                       -- 'hero-magnet' / 'pricing-cta' / 'footer'
  magnet TEXT,                       -- 'sovereign-bi-playbook' / 'lifetime-deal-waitlist'
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  ip TEXT,
  user_agent TEXT,
  consent INTEGER DEFAULT 1,         -- UU PDP 27/2022 consent flag
  status TEXT DEFAULT 'new',         -- 'new' / 'engaged' / 'converted' / 'unsubscribed'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);

-- 10. Status events (uptime + incident log — UP-5 closure)
CREATE TABLE IF NOT EXISTS status_events (
  id TEXT PRIMARY KEY,
  component TEXT NOT NULL,           -- 'pages' / 'workers' / 'd1' / 'kv' / 'r2' / 'duitku'
  status TEXT NOT NULL,              -- 'operational' / 'degraded' / 'down'
  message TEXT,
  region TEXT,                       -- 'sin' / 'jkt' / 'sgp' / 'global'
  latency_ms INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_status_component ON status_events(component);
CREATE INDEX IF NOT EXISTS idx_status_created ON status_events(created_at);
