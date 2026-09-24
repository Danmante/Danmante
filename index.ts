import { createHash } from "node:crypto";

export interface AuditEventInput {
  actorId: string | null;         // null for unauthenticated/system events
  actorRole: "patient" | "nurse" | "pharmacy" | "pharmacist" | "admin" | "system";
  action: string;                 // e.g. "record.read", "verification.approve"
  resourceType: string;           // e.g. "patient", "consultation", "prescription"
  resourceId: string;
  result: "allowed" | "denied";
  context?: Record<string, unknown>; // request metadata; never put secrets/PHI content here, only pointers
}

export interface AuditEvent extends AuditEventInput {
  id: string;
  timestamp: string;
  prevHash: string | null;
  hash: string;
}

/**
 * Append-only, hash-chained audit log. Each event's hash covers the previous
 * event's hash, so any tampering with historical records is detectable.
 * In production this is backed by an INSERT-only `audit_events` table with
 * no UPDATE/DELETE grants for application roles (see database/policies).
 */
export class AuditLog {
  private events: AuditEvent[] = [];

  record(input: AuditEventInput): AuditEvent {
    const prevHash = this.events.length ? this.events[this.events.length - 1].hash : null;
    const timestamp = new Date().toISOString();
    const id = crypto.randomUUID();
    const payload = JSON.stringify({ ...input, id, timestamp, prevHash });
    const hash = createHash("sha256").update(payload).digest("hex");
    const event: AuditEvent = { ...input, id, timestamp, prevHash, hash };
    this.events.push(event);
    return event;
  }

  verifyChainIntegrity(): boolean {
    let prevHash: string | null = null;
    for (const e of this.events) {
      if (e.prevHash !== prevHash) return false;
      const { hash, ...rest } = e;
      const recomputed = createHash("sha256").update(JSON.stringify(rest)).digest("hex");
      if (recomputed !== hash) return false;
      prevHash = e.hash;
    }
    return true;
  }

  all(): readonly AuditEvent[] {
    return this.events;
  }
}
