-- ============================================================================
-- OASIS BI PRO — Seed data for local development
-- Demo user: demo@oasis-bi-pro.web.id  ·  password: Demo1234
-- password_hash below is sha-256 of "Demo1234" (matches src/lib/auth.ts)
-- ============================================================================

INSERT OR IGNORE INTO users (id, email, password_hash, full_name, company, phone, email_verified)
VALUES (
  'usr_demo_001',
  'demo@oasis-bi-pro.web.id',
  'b22f213ec710f0b0e86297d10279d69171f50f01a04edf40f472a563e7ad8576',
  'Demo Sovereign',
  'OASIS BI Pro',
  '+628111111111',
  1
);

INSERT OR IGNORE INTO teams (id, name, slug, plan, billing_status)
VALUES ('team_demo_001', 'Demo Team', 'demo-team', 'professional', 'active');

INSERT OR IGNORE INTO team_members (id, team_id, user_id, role)
VALUES ('tm_demo_001', 'team_demo_001', 'usr_demo_001', 'admin');

INSERT OR IGNORE INTO subscriptions (id, team_id, plan, status, current_period_start, current_period_end, payment_gateway)
VALUES (
  'sub_demo_001',
  'team_demo_001',
  'professional',
  'active',
  datetime('now'),
  datetime('now', '+30 days'),
  'duitku'
);

-- Sample BI metrics — last 30 days
INSERT OR IGNORE INTO daily_metrics (id, team_id, metric_date, metric_name, metric_value) VALUES
  ('m1',  'team_demo_001', date('now', '-29 days'), 'revenue',  4250000),
  ('m2',  'team_demo_001', date('now', '-28 days'), 'revenue',  5120000),
  ('m3',  'team_demo_001', date('now', '-27 days'), 'revenue',  4870000),
  ('m4',  'team_demo_001', date('now', '-26 days'), 'revenue',  6310000),
  ('m5',  'team_demo_001', date('now', '-25 days'), 'revenue',  5890000),
  ('m6',  'team_demo_001', date('now', '-24 days'), 'revenue',  7100000),
  ('m7',  'team_demo_001', date('now', '-23 days'), 'revenue',  6450000),
  ('m8',  'team_demo_001', date('now', '-22 days'), 'revenue',  7820000),
  ('m9',  'team_demo_001', date('now', '-21 days'), 'revenue',  8410000),
  ('m10', 'team_demo_001', date('now', '-20 days'), 'revenue',  7960000),
  ('m11', 'team_demo_001', date('now', '-19 days'), 'revenue',  9100000),
  ('m12', 'team_demo_001', date('now', '-18 days'), 'revenue',  8730000),
  ('m13', 'team_demo_001', date('now', '-17 days'), 'revenue',  9540000),
  ('m14', 'team_demo_001', date('now', '-16 days'), 'revenue', 10210000),
  ('m15', 'team_demo_001', date('now', '-15 days'), 'revenue',  9870000),
  ('m16', 'team_demo_001', date('now', '-14 days'), 'revenue', 10940000),
  ('m17', 'team_demo_001', date('now', '-13 days'), 'revenue', 11380000),
  ('m18', 'team_demo_001', date('now', '-12 days'), 'revenue', 10720000),
  ('m19', 'team_demo_001', date('now', '-11 days'), 'revenue', 11890000),
  ('m20', 'team_demo_001', date('now', '-10 days'), 'revenue', 12450000),
  ('m21', 'team_demo_001', date('now',  '-9 days'), 'revenue', 11930000),
  ('m22', 'team_demo_001', date('now',  '-8 days'), 'revenue', 13100000),
  ('m23', 'team_demo_001', date('now',  '-7 days'), 'revenue', 12780000),
  ('m24', 'team_demo_001', date('now',  '-6 days'), 'revenue', 13560000),
  ('m25', 'team_demo_001', date('now',  '-5 days'), 'revenue', 14210000),
  ('m26', 'team_demo_001', date('now',  '-4 days'), 'revenue', 13890000),
  ('m27', 'team_demo_001', date('now',  '-3 days'), 'revenue', 14920000),
  ('m28', 'team_demo_001', date('now',  '-2 days'), 'revenue', 15470000),
  ('m29', 'team_demo_001', date('now',  '-1 days'), 'revenue', 15110000),
  ('m30', 'team_demo_001', date('now'),             'revenue', 16240000);

-- Traffic & users metrics
INSERT OR IGNORE INTO daily_metrics (id, team_id, metric_date, metric_name, metric_value) VALUES
  ('t1',  'team_demo_001', date('now', '-6 days'), 'visitors', 1240),
  ('t2',  'team_demo_001', date('now', '-5 days'), 'visitors', 1380),
  ('t3',  'team_demo_001', date('now', '-4 days'), 'visitors', 1520),
  ('t4',  'team_demo_001', date('now', '-3 days'), 'visitors', 1610),
  ('t5',  'team_demo_001', date('now', '-2 days'), 'visitors', 1490),
  ('t6',  'team_demo_001', date('now', '-1 days'), 'visitors', 1740),
  ('t7',  'team_demo_001', date('now'),            'visitors', 1890);

INSERT OR IGNORE INTO daily_metrics (id, team_id, metric_date, metric_name, metric_value) VALUES
  ('s1',  'team_demo_001', date('now', '-6 days'), 'signups', 18),
  ('s2',  'team_demo_001', date('now', '-5 days'), 'signups', 24),
  ('s3',  'team_demo_001', date('now', '-4 days'), 'signups', 31),
  ('s4',  'team_demo_001', date('now', '-3 days'), 'signups', 27),
  ('s5',  'team_demo_001', date('now', '-2 days'), 'signups', 35),
  ('s6',  'team_demo_001', date('now', '-1 days'), 'signups', 42),
  ('s7',  'team_demo_001', date('now'),            'signups', 48);
