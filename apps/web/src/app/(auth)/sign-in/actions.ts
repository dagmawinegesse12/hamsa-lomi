"use server";

import { AuthError } from "next-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth";
import { rateLimit } from "@/lib/utils/rate-limit";

const DEFAULT_CALLBACK_URL = "/admin/dashboard";

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function getSafeCallbackUrl(callbackUrl: string) {
  if (!callbackUrl.startsWith("/") || callbackUrl.startsWith("//")) {
    return DEFAULT_CALLBACK_URL;
  }

  return callbackUrl;
}

export async function signInWithCredentials(formData: FormData) {
  const email = getFormValue(formData, "email");
  const password = getFormValue(formData, "password");
  const callbackUrl = getSafeCallbackUrl(getFormValue(formData, "callbackUrl") || DEFAULT_CALLBACK_URL);

  // Rate limit: 5 attempts per IP per 15 minutes
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { limited } = rateLimit(`sign-in:${ip}`, 5, 15 * 60 * 1000);
  if (limited) {
    redirect(`/sign-in?error=RateLimit&callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect(`/sign-in?error=CredentialsSignin&callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }

    throw error;
  }
}
