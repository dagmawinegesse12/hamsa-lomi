import { z } from "zod";

export const memberCreateSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(7),
  address: z.string().min(3),
  organizationId: z.string().uuid(),
  tierId: z.string().uuid().optional()
});

export const dependentCreateSchema = z.object({
  name: z.string().min(1),
  relationship: z.enum(["SPOUSE", "CHILD", "PARENT", "SIBLING"]),
  dateOfBirth: z.string().datetime().optional()
});
