import { Resend } from "resend";
import { env } from "@/lib/env";

function getResendClient() {
  if (!env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is required to send email notifications.");
  }

  return new Resend(env.RESEND_API_KEY);
}

export async function sendEmail(input: { to: string; subject: string; html: string }) {
  const result = await getResendClient().emails.send({
    from: "Hamsa Lomi <noreply@example.com>",
    to: input.to,
    subject: input.subject,
    html: input.html
  });
  if (result.error) {
    throw new Error(result.error.message);
  }
  return result.data;
}
