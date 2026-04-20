import twilio from "twilio";
import { env } from "@/lib/env";

function getTwilioClient() {
  if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN || !env.TWILIO_PHONE_NUMBER) {
    throw new Error("Twilio credentials are required to send SMS notifications.");
  }

  return twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
}

export async function sendSms(input: { to: string; body: string }) {
  return getTwilioClient().messages.create({
    from: env.TWILIO_PHONE_NUMBER,
    to: input.to,
    body: input.body
  });
}
