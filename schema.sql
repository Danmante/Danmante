-- Danmante Core Schema (foundation subset — see docs/architecture/ARCHITECTURE.md)
-- Extend via database/migrations; never hand-edit this file post-launch.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email CITEXT UNIQUE NOT NULL,
  password_hash TEXT, -- null if OIDC-only account
  role TEXT NOT NULL CHECK (role IN ('patient','nurse','pharmacy','pharmacist','admin')),
  mfa_enabled BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended','deleted')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE jurisdictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country CHAR(2) NOT NULL,
  region TEXT,
  active BOOLEAN NOT NULL DEFAULT false,
  rules JSONB NOT NULL, -- matches packages/jurisdiction JurisdictionRuleSet
  source TEXT NOT NULL CHECK (source IN ('externally_reviewed','external_review_required','provisional_placeholder')),
  last_reviewed_at TIMESTAMPTZ,
  UNIQUE (country, region)
);

CREATE TABLE patients (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  preferred_language TEXT NOT NULL DEFAULT 'en',
  country CHAR(2) NOT NULL,
  region TEXT,
  emergency_contact JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE nurses (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  country CHAR(2) NOT NULL,
  region TEXT,
  scope_of_practice JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE professional_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nurse_id UUID NOT NULL REFERENCES nurses(id) ON DELETE CASCADE,
  credential_type TEXT NOT NULL,
  document_ref TEXT NOT NULL, -- pointer to encrypted object storage, never the raw file
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE professional_licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nurse_id UUID NOT NULL REFERENCES nurses(id) ON DELETE CASCADE,
  license_number TEXT NOT NULL,
  issuing_authority TEXT NOT NULL,
  jurisdiction_id UUID NOT NULL REFERENCES jurisdictions(id),
  expires_at DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','submitted','under_review','verified','expired','suspended','rejected','revoked')),
  verification_source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (license_number, issuing_authority)
);

CREATE TABLE pharmacies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_name TEXT NOT NULL,
  country CHAR(2) NOT NULL,
  region TEXT,
  responsible_pharmacist_id UUID,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','submitted','under_review','verified','expired','suspended','rejected','revoked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE pharmacists (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  pharmacy_id UUID REFERENCES pharmacies(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  license_number TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE pharmacies
  ADD CONSTRAINT fk_pharmacy_responsible_pharmacist
  FOREIGN KEY (responsible_pharmacist_id) REFERENCES pharmacists(id);

CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id),
  nurse_id UUID NOT NULL REFERENCES nurses(id),
  jurisdiction_id UUID NOT NULL REFERENCES jurisdictions(id),
  consultation_type TEXT NOT NULL CHECK (consultation_type IN ('video','audio','message')),
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled'
    CHECK (status IN ('scheduled','confirmed','cancelled','completed','no_show')),
  payment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending','paid','failed','refunded')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (nurse_id, scheduled_at) -- prevents double-booking at the DB layer
);

CREATE TABLE encounters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES appointments(id),
  clinical_notes TEXT, -- encrypted at rest at the application layer
  ai_assisted_summary TEXT,
  ai_assisted BOOLEAN NOT NULL DEFAULT false,
  professional_reviewed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE medication_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  encounter_id UUID NOT NULL REFERENCES encounters(id),
  jurisdiction_id UUID NOT NULL REFERENCES jurisdictions(id),
  medication_name TEXT NOT NULL,
  requires_prescription BOOLEAN NOT NULL,
  is_controlled_substance BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending_jurisdiction_check'
    CHECK (status IN ('pending_jurisdiction_check','blocked','eligible','sent_to_pharmacy','fulfilled','rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE pharmacy_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_request_id UUID NOT NULL REFERENCES medication_requests(id),
  pharmacy_id UUID NOT NULL REFERENCES pharmacies(id),
  status TEXT NOT NULL DEFAULT 'pending_review'
    CHECK (status IN ('pending_review','accepted','rejected','fulfilled')),
  reviewed_by UUID REFERENCES pharmacists(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES appointments(id),
  user_id UUID NOT NULL REFERENCES users(id),
  provider TEXT NOT NULL, -- 'card' | 'walletconnect' | 'celo'
  idempotency_key TEXT NOT NULL UNIQUE,
  amount_cents BIGINT NOT NULL,
  currency CHAR(3) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','succeeded','failed','refunded')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES payments(id),
  chain TEXT NOT NULL DEFAULT 'celo',
  tx_hash TEXT NOT NULL UNIQUE,
  confirmed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  -- Intentionally no clinical/PHI columns on this table — see CLINICAL_SAFETY.md.
);

CREATE TABLE consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id),
  consent_type TEXT NOT NULL, -- 'telehealth' | 'data_sharing' | 'recording' etc.
  granted BOOLEAN NOT NULL,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at TIMESTAMPTZ
);

CREATE TABLE audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  result TEXT NOT NULL CHECK (result IN ('allowed','denied')),
  context JSONB,
  prev_hash TEXT,
  hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Application DB roles must be granted INSERT + SELECT only on audit_events,
-- never UPDATE/DELETE. Enforce in database/policies/audit_immutability.sql.

CREATE INDEX idx_appointments_nurse_time ON appointments (nurse_id, scheduled_at);
CREATE INDEX idx_audit_events_resource ON audit_events (resource_type, resource_id);
CREATE INDEX idx_licenses_status ON professional_licenses (status);
