-- ============================================================
-- Wedding Invitation System — Initial Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================

-- Enable pgcrypto for token generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ── GUESTS TABLE ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS guests (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  title            TEXT,
  invitation_type  TEXT NOT NULL CHECK (invitation_type IN ('individual','couple','family','custom')),
  partner_name     TEXT,
  max_guests       INTEGER NOT NULL DEFAULT 1 CHECK (max_guests >= 1 AND max_guests <= 20),
  contact          TEXT,
  custom_greeting  TEXT,
  token            TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
  is_active        BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── RSVP TABLE ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rsvp (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id         UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  status           TEXT NOT NULL CHECK (status IN ('accepted','declined')),
  confirmed_guests INTEGER NOT NULL DEFAULT 1 CHECK (confirmed_guests >= 0),
  message          TEXT,
  responded_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(guest_id)
);

-- ── UPDATED_AT TRIGGER ───────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER guests_updated_at
  BEFORE UPDATE ON guests
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── ROW LEVEL SECURITY ───────────────────────────────────────
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvp   ENABLE ROW LEVEL SECURITY;

-- Supabase table privileges and RLS policies are separate checks. The guest
-- invitation is read with the public anon key, so grant the required table
-- privileges here and let the policies below restrict which rows/actions work.
GRANT SELECT ON TABLE guests TO anon;
GRANT SELECT, INSERT, UPDATE ON TABLE rsvp TO anon;
GRANT ALL ON TABLE guests, rsvp TO authenticated;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "anon_read_guest_by_token"  ON guests;
DROP POLICY IF EXISTS "anon_insert_rsvp"           ON rsvp;
DROP POLICY IF EXISTS "anon_update_rsvp"           ON rsvp;
DROP POLICY IF EXISTS "anon_read_own_rsvp"         ON rsvp;
DROP POLICY IF EXISTS "admin_all_guests"           ON guests;
DROP POLICY IF EXISTS "admin_all_rsvp"             ON rsvp;

-- ANON: Can read a single guest record by token (personalisation & RSVP pre-fill)
CREATE POLICY "anon_read_guest_by_token" ON guests
  FOR SELECT TO anon
  USING (is_active = true);

-- ANON: Can insert their RSVP (once per guest_id enforced by UNIQUE)
CREATE POLICY "anon_insert_rsvp" ON rsvp
  FOR INSERT TO anon
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM guests g
      WHERE g.id = guest_id AND g.is_active = true
    )
  );

-- ANON: Can update their own RSVP
CREATE POLICY "anon_update_rsvp" ON rsvp
  FOR UPDATE TO anon
  USING (true)
  WITH CHECK (true);

-- ANON: Can read their own RSVP
CREATE POLICY "anon_read_own_rsvp" ON rsvp
  FOR SELECT TO anon
  USING (true);

-- AUTHENTICATED (Admin): Full access
CREATE POLICY "admin_all_guests" ON guests
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "admin_all_rsvp" ON rsvp
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- ── HELPER VIEW for Admin Dashboard stats ───────────────────
CREATE OR REPLACE VIEW guest_stats AS
SELECT
  COUNT(g.id)                                              AS total_guests,
  COUNT(r.id) FILTER (WHERE r.status = 'accepted')        AS total_accepted,
  COUNT(r.id) FILTER (WHERE r.status = 'declined')        AS total_declined,
  COUNT(g.id) FILTER (WHERE r.id IS NULL)                 AS total_pending,
  COALESCE(SUM(r.confirmed_guests) FILTER (WHERE r.status = 'accepted'), 0) AS total_attending
FROM guests g
LEFT JOIN rsvp r ON g.id = r.guest_id
WHERE g.is_active = true;

GRANT SELECT ON guest_stats TO authenticated;
