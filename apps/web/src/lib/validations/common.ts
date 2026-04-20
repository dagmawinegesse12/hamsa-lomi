import { z } from "zod";

export const uuidSchema = z.string().uuid();
export const periodSchema = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Period must use YYYY-MM format");
export const moneySchema = z.coerce.number().positive().max(10_000_000);

export const paginationSchema = z.object({
  cursor: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(25)
});
