"use client";

import { useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    const form = e.currentTarget;
    const data = new FormData(form);

    // In production, wire to a server action that sends via Resend
    // For now, simulate a short delay and succeed
    await new Promise((r) => setTimeout(r, 800));

    console.info("[contact]", {
      name: data.get("name"),
      email: data.get("email"),
      subject: data.get("subject"),
      message: data.get("message")
    });

    setState("success");
    form.reset();
  }

  const inputClass =
    "mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-950 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500";

  if (state === "success") {
    return (
      <div className="rounded-md border border-teal-200 bg-teal-50 p-6 text-center">
        <p className="text-base font-bold text-teal-900">Message sent!</p>
        <p className="mt-2 text-sm text-teal-700">
          Thank you for reaching out. We&apos;ll get back to you by email or phone within a few business days.
        </p>
        <button
          onClick={() => setState("idle")}
          className="mt-4 text-sm font-medium text-teal-700 underline hover:text-teal-900"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {state === "error" && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800" role="alert">
          {errorMsg || "Something went wrong. Please try again or email us directly."}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name <span className="text-red-500">*</span>
          </label>
          <input name="name" required placeholder="Your full name" className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input name="email" type="email" required placeholder="email@example.com" className={inputClass} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Subject</label>
        <select name="subject" className={inputClass}>
          <option value="membership">Membership question</option>
          <option value="payment">Payment or dues</option>
          <option value="claim">Death claim</option>
          <option value="meeting">Meetings</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="How can we help you?"
          className={inputClass}
        />
      </div>
      <button
        type="submit"
        disabled={state === "submitting"}
        className="inline-flex items-center gap-2 rounded-md bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-teal-400"
      >
        {state === "submitting" ? (
          <>
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Sending…
          </>
        ) : "Send message"}
      </button>
    </form>
  );
}
