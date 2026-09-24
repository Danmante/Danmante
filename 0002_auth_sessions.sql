-- Danmante authentication persistence
-- Apply after 0001_init.sql. Runtime auth must use these tables in production;
-- the current in-memory adapter remains test/development-only.

CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT,
  CHECK (expires_at > created_at)
);

CREATE INDEX idx_user_sessions_user_active
  ON user_sessions (user_id, expires_at)
  WHERE revoked_at IS NULL;

CREATE TABLE email_verification_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  consumed_at TIMESTAMPTZ,
  CHECK (expires_at > created_at)
);

CREATE INDEX idx_email_verification_user_active
  ON email_verification_tokens (user_id, expires_at)
  WHERE consumed_at IS NULL;

CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  consumed_at TIMESTAMPTZ,
  CHECK (expires_at > created_at)
);

CREATE INDEX idx_password_reset_user_active
  ON password_reset_tokens (user_id, expires_at)
  WHERE consumed_at IS NULL;

ALTER TABLE users
  ADD COLUMN email_verified_at TIMESTAMPTZ,
  ADD COLUMN failed_login_attempts INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN locked_until TIMESTAMPTZ;

ALTER TABLE audit_events
  ADD CONSTRAINT audit_events_actor_role_nonempty CHECK (length(trim(actor_role)) > 0),
  ADD CONSTRAINT audit_events_action_nonempty CHECK (length(trim(action)) > 0);
