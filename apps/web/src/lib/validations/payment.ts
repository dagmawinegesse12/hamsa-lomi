import { z } from "zod";
import { moneySchema, periodSchema } from "@/lib/validations/common";

export const paymentCreateSchema = z.object({
  memberId: z.string().uuid(),
  period: periodSchema,
  amount: moneySchema,
  paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "MOBILE_MONEY"]),
  receiptNumber: z.string().min(3)
});
