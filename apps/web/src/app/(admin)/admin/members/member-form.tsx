"use client";

import { useFormState as useActionState } from "react-dom";
import { SubmitButton } from "@/components/ui/submit-button";
import type { MemberFormState } from "./actions";

interface MemberTier {
  id: string;
  name: string;
}

interface MemberFormProps {
  action: (prev: MemberFormState, formData: FormData) => Promise<MemberFormState>;
  defaultValues?: {
    memberId?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    status?: string;
    tierId?: string | null;
  };
  tiers: MemberTier[];
  mode: "create" | "edit";
}

const initialState: MemberFormState = { success: false, error: "" };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

const inputClass = "block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-950 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500";

export function MemberForm({ action, defaultValues, tiers, mode }: MemberFormProps) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {defaultValues?.memberId && (
        <input type="hidden" name="memberId" value={defaultValues.memberId} />
      )}

      {state && !state.success && state.error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800" role="alert">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="rounded-md border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-800" role="status">
          Member updated successfully.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="First name *">
          <input name="firstName" required defaultValue={defaultValues?.firstName} placeholder="First name" className={inputClass} />
        </Field>
        <Field label="Last name *">
          <input name="lastName" required defaultValue={defaultValues?.lastName} placeholder="Last name" className={inputClass} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Phone *">
          <input name="phone" required type="tel" defaultValue={defaultValues?.phone} placeholder="629-000-0000" className={inputClass} />
        </Field>
        <Field label="Membership tier">
          <select name="tierId" defaultValue={defaultValues?.tierId ?? ""} className={inputClass}>
            <option value="">No tier assigned</option>
            {tiers.map((tier) => (
              <option key={tier.id} value={tier.id}>{tier.name}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Address *">
        <input name="address" required defaultValue={defaultValues?.address} placeholder="Street, City, State, ZIP" className={inputClass} />
      </Field>

      {mode === "edit" && (
        <Field label="Status">
          <select name="status" defaultValue={defaultValues?.status ?? "ACTIVE"} className={inputClass}>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="EXPELLED">Expelled</option>
            <option value="DECEASED">Deceased</option>
          </select>
        </Field>
      )}

      <div className="flex justify-end">
        <SubmitButton pendingLabel={mode === "create" ? "Creating…" : "Saving…"}>
          {mode === "create" ? "Create member" : "Save changes"}
        </SubmitButton>
      </div>
    </form>
  );
}
