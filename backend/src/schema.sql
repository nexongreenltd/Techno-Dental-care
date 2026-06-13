-- Techno Dental Care — PostgreSQL Schema
-- Run: psql "$DATABASE_URL" -f src/schema.sql

-- Enable UUID support
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── USERS ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email           VARCHAR(200) UNIQUE NOT NULL,
  password_hash   VARCHAR(255) NOT NULL,
  full_name       VARCHAR(100) NOT NULL,
  phone           VARCHAR(30),
  gender          VARCHAR(20),
  dob             DATE,
  role            VARCHAR(20) NOT NULL DEFAULT 'patient'
                    CHECK (role IN ('patient', 'doctor', 'admin')),
  specialization  VARCHAR(100),
  bio             TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── CHAMBERS ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chambers (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            VARCHAR(100) UNIQUE NOT NULL,
  name            VARCHAR(200) NOT NULL,
  address         TEXT        NOT NULL,
  phone           VARCHAR(30) NOT NULL,
  map_url         TEXT,
  available_days  INTEGER[]   NOT NULL DEFAULT '{1,2,3,4,5}',
  start_hour      INTEGER     NOT NULL DEFAULT 9,
  end_hour        INTEGER     NOT NULL DEFAULT 17,
  is_active       BOOLEAN     NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── APPOINTMENTS ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS appointments (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  chamber_id        UUID        NOT NULL REFERENCES chambers(id),
  appointment_date  DATE        NOT NULL,
  time_slot         VARCHAR(10) NOT NULL,
  booking_code      VARCHAR(20) UNIQUE NOT NULL,
  patient_name      VARCHAR(100) NOT NULL,
  patient_phone     VARCHAR(30) NOT NULL,
  patient_email     VARCHAR(200),
  patient_age       INTEGER,
  patient_user_id   UUID        REFERENCES users(id) ON DELETE SET NULL,
  doctor_user_id    UUID        REFERENCES users(id) ON DELETE SET NULL,
  service           VARCHAR(120),
  notes             TEXT,
  status            VARCHAR(30) NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending','confirmed','completed','cancelled','no_show','follow_up')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(chamber_id, appointment_date, time_slot)
);

-- ─── PRESCRIPTIONS ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS prescriptions (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id  UUID        REFERENCES appointments(id) ON DELETE SET NULL,
  doctor_id       UUID        NOT NULL REFERENCES users(id),
  patient_id      UUID        REFERENCES users(id) ON DELETE SET NULL,
  patient_name    VARCHAR(100) NOT NULL,
  patient_age     INTEGER,
  patient_phone   VARCHAR(30),
  diagnosis       TEXT        NOT NULL,
  chief_complaint TEXT,
  medicines       JSONB       NOT NULL DEFAULT '[]',
  instructions    TEXT,
  follow_up_date  DATE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── APPOINTMENT STATUS LOGS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS appointment_status_logs (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id  UUID        NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  from_status     VARCHAR(30),
  to_status       VARCHAR(30) NOT NULL,
  changed_by      UUID        REFERENCES users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── TREATMENT HISTORY ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS treatment_history (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  doctor_id       UUID        REFERENCES users(id) ON DELETE SET NULL,
  appointment_id  UUID        REFERENCES appointments(id) ON DELETE SET NULL,
  title           VARCHAR(200) NOT NULL,
  description     TEXT,
  treated_at      DATE        NOT NULL DEFAULT CURRENT_DATE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── SEED: DEFAULT CHAMBERS ──────────────────────────────────────────────────
INSERT INTO chambers (slug, name, address, phone, available_days, start_hour, end_hour)
VALUES
  (
    'main',
    'Techno Dental Care',
    '767 Rokeya Sarani (2nd Floor), Near Metro Rail Pillar No. 305, Shewrapara, Mirpur, Dhaka-1216',
    '01711-102-368',
    '{0,2,4}',
    18,
    21
  )
ON CONFLICT (slug) DO NOTHING;

-- No default seed user — the clinic doctor account is created via the app.
