"use client";

import { useFormState as useActionState } from "react-dom";
import { useState } from "react";
import { SubmitButton } from "@/components/ui/submit-button";
import { reviewClaim, type ClaimActionResult } from "./actions";

const initialState: ClaimActionResult = { success: false, error: "" };

export function ClaimActions({ claimId, currentStatus }: { claimId: string; currentStatus: string }) {
  const [state, formAction] = useActionState(reviewClaim, initialState);
  const [showNotes, setShowNotes] = useState(false);

  const canReview = currentStatus === "SUBMITTED";
  const canApprove = currentStatus === "SUBMITTED" || currentStatus === "UNDER_REVIEW";
  const canReject = currentStatus === "SUBMITTED" || currentStatus === "UNDER_REVIEW";
  const canPay = currentStatus === "APPROVED";
  const isFinal = currentStatus === "PAID" || currentStatus === "REJECTED";

  if (isFinal) {
    return (
      <p className="text-sm text-gray-500 italic">
        This claim is {currentStatus.toLowerCase()} and cannot be modified.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {state && !state.success && state.error && (
        <p className="text-sm font-medium text-red-600">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-sm font-medium text-teal-700">Action completed successfully.</p>
      )}
      <button
        onClick={() => setShowNotes((v) => !v)}
        className="text-xs text-gray-500 underline hover:text-gray-800"
      >
        {showNotes ? "Hide" : "Add"} review notes
      </button>
      {showNotes && (
        <form action={formAction} className="space-y-2">
          <input type="hidden" name="claimId" value={claimId} />
          <input type="hidden" name="action" value="review" />
          <textarea
            name="reviewNotes"
            rows={3}
            placeholder="Optional notes for the record…"
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
          <SubmitButton variant="ghost" pendingLabel="Saving…">Save notes</SubmitButton>
        </form>
      )}
      <div className="flex flex-wrap gap-2">
        {canReview && (
          <form action={formAction}>
            <input type="hidden" name="claimId" value={claimId} />
            <input type="hidden" name="action" value="review" />
            <SubmitButton variant="ghost" pendingLabel="Moving…">Mark under review</SubmitButton>
          </form>
        )}
        {canApprove && (
          <form action={formAction}>
            <input type="hidden" name="claimId" value={claimId} />
            <input type="hidden" name="action" value="approve" />
            <SubmitButton pendingLabel="Approving…">Approve</SubmitButton>
          </form>
        )}
        {canPay && (
          <form action={formAction}>
            <input type="hidden" name="claimId" value={claimId} />
            <input type="hidden" name="action" value="pay" />
            <SubmitButton pendingLabel="Processing…">Mark as paid</SubmitButton>
          </form>
        )}
        {canReject && (
          <form action={formAction}>
            <input type="hidden" name="claimId" value={claimId} />
            <input type="hidden" name="action" value="reject" />
            <SubmitButton variant="danger" pendingLabel="Rejecting…">Reject</SubmitButton>
          </form>
        )}
      </div>
    </div>
  );
}
