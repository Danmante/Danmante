-- Prevents application roles from mutating or deleting audit history.
REVOKE UPDATE, DELETE ON audit_events FROM app_role;
GRANT INSERT, SELECT ON audit_events TO app_role;
