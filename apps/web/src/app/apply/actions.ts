"use server";

import { z } from "zod";
import { rateLimit } from "@/lib/utils/rate-limit";
import { headers } from "next/headers";

const dependentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  relationship: z.enum(["SPOUSE", "CHILD", "PARENT", "SIBLING"]),
  dateOfBirth: z.string().optional()
});

export const applicationSchema = z.object({
  // Applicant
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(7, "Valid phone number is required"),
  address: z.string().min(5, "Address is required"),
  maritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]),
  // Family
  dependents: z.array(dependentSchema).optional(),
  // Beneficiaries
  primaryBeneficiaryName: z.string().min(1, "Primary beneficiary name is required"),
  primaryBeneficiaryPhone: z.string().min(7, "Phone is required"),
  primaryBeneficiaryAddress: z.string().min(5, "Address is required"),
  contingentBeneficiaryName: z.string().optional(),
  contingentBeneficiaryPhone: z.string().optional(),
  // Acknowledgement
  signatureName: z.string().min(1, "Printed name is required"),
  agreedToTerms: z.literal(true, { errorMap: () => ({ message: "You must agree to the terms" }) }),
  registrationFeePaid: z.boolean()
});

export type ApplicationData = z.infer<typeof applicationSchema>;

export type SubmitApplicationResult =
  | { success: true }
  | { success: false; error: string };

export async function submitApplication(data: ApplicationData): Promise<SubmitApplicationResult> {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { limited } = rateLimit(`apply:${ip}`, 3, 60 * 60 * 1000);
  if (limited) {
    return { success: false, error: "Too many applications submitted. Please try again later." };
  }

  const parsed = applicationSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid application data." };
  }

  // In production this would send an email via Resend and/or create a pending member record.
  // For now we log and return success so the form flow is complete.
  console.info("[apply] New application received", {
    name: `${parsed.data.firstName} ${parsed.data.lastName}`,
    email: parsed.data.email,
    phone: parsed.data.phone
  });

  return { success: true };
}
