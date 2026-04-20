import type { Role } from "@edir/types";
import { AuthorizationError } from "@/lib/errors";

const roleRank: Record<Role, number> = {
  MEMBER: 1,
  SECRETARY: 2,
  TREASURER: 2,
  ADMIN: 3,
  SUPER_ADMIN: 4
};

export function hasRole(userRole: Role, allowedRoles: readonly Role[]) {
  return allowedRoles.includes(userRole);
}

export function hasMinimumRole(userRole: Role, minimumRole: Role) {
  return roleRank[userRole] >= roleRank[minimumRole];
}

export function assertRole(userRole: Role | undefined, allowedRoles: readonly Role[]) {
  if (!userRole || !hasRole(userRole, allowedRoles)) {
    throw new AuthorizationError();
  }
}
