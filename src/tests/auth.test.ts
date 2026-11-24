import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword, signSessionToken, verifySessionToken } from "../lib/auth/jwt";

describe("Authentication & JWT Security", () => {
  it("should securely hash passwords and verify matches", async () => {
    const plain = "SuperSecretSecurePass123!";
    const hash = await hashPassword(plain);

    expect(hash).not.toBe(plain);
    expect(hash.startsWith("$2")).toBe(true);

    const isMatch = await verifyPassword(plain, hash);
    expect(isMatch).toBe(true);

    const wrongMatch = await verifyPassword("WrongPassword!", hash);
    expect(wrongMatch).toBe(false);
  });

  it("should sign and verify JWT session tokens", async () => {
    const session = {
      id: "user_test_123",
      email: "researcher@university.edu",
      name: "Dr. Jane Smith",
      role: "PRO" as const,
    };

    const token = await signSessionToken(session);
    expect(typeof token).toBe("string");
    expect(token.split(".").length).toBe(3);

    const decoded = await verifySessionToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.id).toBe(session.id);
    expect(decoded?.email).toBe(session.email);
    expect(decoded?.role).toBe(session.role);
  });

  it("should reject invalid or tampered tokens", async () => {
    const tampered = "invalid.tampered.token";
    const decoded = await verifySessionToken(tampered);
    expect(decoded).toBeNull();
  });
});
