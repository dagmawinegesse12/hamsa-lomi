import { describe, expect, it } from "vitest";
import { AuthorizationError } from "@/lib/errors";
import { assertRole, hasMinimumRole, hasRole } from "@/lib/rbac";

describe("rbac", () => {
  it("allows explicitly listed roles", () => {
    expect(hasRole("TREASURER", ["ADMIN", "TREASURER"])).toBe(true);
  });

  it("supports role hierarchy checks", () => {
    expect(hasMinimumRole("SUPER_ADMIN", "ADMIN")).toBe(true);
    expect(hasMinimumRole("MEMBER", "ADMIN")).toBe(false);
  });

  it("throws when role is not allowed", () => {
    expect(() => assertRole("MEMBER", ["ADMIN"])).toThrow(AuthorizationError);
  });
});
