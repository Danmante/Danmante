import { beforeEach, describe, expect, it, vi } from "vitest";
import { getDatabasePool } from "../db";

vi.mock("../db", () => ({
  getDatabasePool: vi.fn(),
}));

import { verifyUserCredentials } from "../auth";

describe("database-backed auth", () => {
  beforeEach(() => {
    vi.mocked(getDatabasePool).mockReset();
  });

  it("validates credentials against the configured database user record", async () => {
    const salt = "salt";
    const password = "Password123!";
    const expectedHash = "0140b6b8cf52acb77dbdfb02d752af4d9a75c20d649f51286b87380c9ae43edd8fa74d89c6b73e38e4ba301352199163048e8377af98531d30307019f5b3c4b0";

    const mockQuery = vi.fn().mockResolvedValue({
      rows: [
        {
          id: "11111111-1111-4111-8111-111111111111",
          email: "alice@example.com",
          full_name: "Alice Example",
          password_hash: `${salt}:${expectedHash}`,
          role: "patient",
          created_at: "2025-01-01T00:00:00.000Z",
          updated_at: "2025-01-01T00:00:00.000Z",
          email_verified_at: null,
        },
      ],
    });

    const mockDatabase = { query: mockQuery };
    vi.mocked(getDatabasePool).mockReturnValue(mockDatabase as any);

    const result = await verifyUserCredentials("alice@example.com", password);

    expect(result).toBeTruthy();
    expect(result?.email).toBe("alice@example.com");
    expect(result?.role).toBe("PATIENT");
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining("FROM users u"),
      ["alice@example.com"],
    );
  });
});
