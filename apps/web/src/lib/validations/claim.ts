import { z } from "zod";
import { moneySchema } from "@/lib/validations/common";

export const claimCreateSchema = z.object({
  memberId: z.string().uuid(),
  deceasedName: z.string().min(1),
  relationship: z.enum(["MEMBER", "SPOUSE", "CHILD", "PARENT", "SIBLING"]),
  dateOfDeath: z.string().datetime(),
  benefitAmount: moneySchema,
  documents: z
    .array(
      z.object({
        fileUrl: z.string().url(),
        documentType: z.enum(["DEATH_CERTIFICATE", "ID", "PHOTO"])
      })
    )
    .default([])
});
