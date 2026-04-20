"use client";

import { useState } from "react";
import { publicSite } from "@/lib/content/public-site";
import { submitApplication, type ApplicationData } from "./actions";

type Step = "applicant" | "family" | "beneficiaries" | "acknowledgement" | "submitted";

type Dependent = { name: string; relationship: string; dateOfBirth: string };

const STEPS: { id: Step; label: string }[] = [
  { id: "applicant", label: "Applicant" },
  { id: "family", label: "Family" },
  { id: "beneficiaries", label: "Beneficiaries" },
  { id: "acknowledgement", label: "Acknowledgement" }
];

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      {children}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-950 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:bg-gray-50"
    />
  );
}

function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return (
    <select
      {...props}
      className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-950 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
    />
  );
}

export function ApplicationForm() {
  const [step, setStep] = useState<Step>("applicant");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [applicant, setApplicant] = useState({
    firstName: "", middleName: "", lastName: "", dateOfBirth: "",
    email: "", phone: "", address: "", maritalStatus: "SINGLE"
  });
  const [dependents, setDependents] = useState<Dependent[]>([]);
  const [beneficiaries, setBeneficiaries] = useState({
    primaryBeneficiaryName: "", primaryBeneficiaryPhone: "", primaryBeneficiaryAddress: "",
    contingentBeneficiaryName: "", contingentBeneficiaryPhone: ""
  });
  const [acknowledgement, setAcknowledgement] = useState({
    signatureName: "", agreedToTerms: false, registrationFeePaid: false
  });

  const currentStepIndex = STEPS.findIndex((s) => s.id === step);

  function addDependent() {
    setDependents((prev) => [...prev, { name: "", relationship: "SPOUSE", dateOfBirth: "" }]);
  }

  function removeDependent(i: number) {
    setDependents((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateDependent(i: number, field: keyof Dependent, value: string) {
    setDependents((prev) => prev.map((d, idx) => idx === i ? { ...d, [field]: value } : d));
  }

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);
    try {
      const payload: ApplicationData = {
        ...applicant,
        maritalStatus: applicant.maritalStatus as ApplicationData["maritalStatus"],
        dependents: dependents.filter((d) => d.name) as ApplicationData["dependents"],
        ...beneficiaries,
        signatureName: acknowledgement.signatureName,
        agreedToTerms: true,
        registrationFeePaid: acknowledgement.registrationFeePaid
      };
      const result = await submitApplication(payload);
      if (result.success) {
        setStep("submitted");
      } else {
        setError(result.error);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (step === "submitted") {
    return (
      <div className="rounded-md border border-teal-200 bg-teal-50 p-8 text-center">
        <p className="text-2xl font-bold text-teal-900">Application received!</p>
        <p className="mt-3 text-sm leading-6 text-teal-800">
          Thank you for applying to Hamsa Lomi. The office will review your application and follow up by phone or email within a few days.
        </p>
        <p className="mt-4 text-sm text-teal-700">
          Questions? Contact us at <a href={`mailto:${publicSite.contact.email}`} className="underline">{publicSite.contact.email}</a> or call {publicSite.contact.phone}.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Step indicator */}
      <nav aria-label="Application steps" className="mb-8">
        <ol className="flex gap-1">
          {STEPS.map((s, i) => {
            const done = i < currentStepIndex;
            const active = s.id === step;
            return (
              <li key={s.id} className="flex-1">
                <div className={`flex flex-col items-center gap-1 rounded-md px-2 py-2 text-xs font-semibold ${
                  active ? "bg-teal-700 text-white" : done ? "bg-teal-100 text-teal-800" : "bg-gray-100 text-gray-500"
                }`}>
                  <span className="text-[10px] font-bold">{i + 1}</span>
                  <span>{s.label}</span>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>

      {error && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800" role="alert">
          {error}
        </div>
      )}

      {/* Step 1 — Applicant */}
      {step === "applicant" && (
        <div className="space-y-5">
          <h2 className="text-xl font-bold text-gray-950">Applicant information</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <FieldLabel required>First name</FieldLabel>
              <TextInput value={applicant.firstName} onChange={(e) => setApplicant((p) => ({ ...p, firstName: e.target.value }))} placeholder="First name" />
            </div>
            <div>
              <FieldLabel>Middle name</FieldLabel>
              <TextInput value={applicant.middleName} onChange={(e) => setApplicant((p) => ({ ...p, middleName: e.target.value }))} placeholder="Middle name" />
            </div>
            <div>
              <FieldLabel required>Last name</FieldLabel>
              <TextInput value={applicant.lastName} onChange={(e) => setApplicant((p) => ({ ...p, lastName: e.target.value }))} placeholder="Last name" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel required>Date of birth</FieldLabel>
              <TextInput type="date" value={applicant.dateOfBirth} onChange={(e) => setApplicant((p) => ({ ...p, dateOfBirth: e.target.value }))} />
            </div>
            <div>
              <FieldLabel required>Marital status</FieldLabel>
              <SelectInput value={applicant.maritalStatus} onChange={(e) => setApplicant((p) => ({ ...p, maritalStatus: e.target.value }))}>
                <option value="SINGLE">Single</option>
                <option value="MARRIED">Married</option>
                <option value="DIVORCED">Divorced</option>
                <option value="WIDOWED">Widowed</option>
              </SelectInput>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel required>Email</FieldLabel>
              <TextInput type="email" value={applicant.email} onChange={(e) => setApplicant((p) => ({ ...p, email: e.target.value }))} placeholder="email@example.com" />
            </div>
            <div>
              <FieldLabel required>Phone</FieldLabel>
              <TextInput type="tel" value={applicant.phone} onChange={(e) => setApplicant((p) => ({ ...p, phone: e.target.value }))} placeholder="629-000-0000" />
            </div>
          </div>
          <div>
            <FieldLabel required>Current address</FieldLabel>
            <TextInput value={applicant.address} onChange={(e) => setApplicant((p) => ({ ...p, address: e.target.value }))} placeholder="Street, City, State, ZIP" />
          </div>
          <div className="rounded-md border border-amber-100 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
            <strong>Eligibility reminder:</strong> You must be at least 18 years old and live within 60 miles of Nashville, TN.
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => {
                if (!applicant.firstName || !applicant.lastName || !applicant.dateOfBirth || !applicant.email || !applicant.phone || !applicant.address) {
                  setError("Please fill in all required fields.");
                  return;
                }
                setError(null);
                setStep("family");
              }}
              className="rounded-md bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
            >
              Next: Family information →
            </button>
          </div>
        </div>
      )}

      {/* Step 2 — Family */}
      {step === "family" && (
        <div className="space-y-5">
          <h2 className="text-xl font-bold text-gray-950">Family information</h2>
          <p className="text-sm text-gray-600">Add your spouse, children, and other dependents. These are the family members covered under your membership.</p>
          {dependents.map((dep, i) => (
            <div key={i} className="rounded-md border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-950">Dependent {i + 1}</p>
                <button onClick={() => removeDependent(i)} className="text-xs text-red-600 hover:text-red-800">Remove</button>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div>
                  <FieldLabel required>Full name</FieldLabel>
                  <TextInput value={dep.name} onChange={(e) => updateDependent(i, "name", e.target.value)} placeholder="Full name" />
                </div>
                <div>
                  <FieldLabel required>Relationship</FieldLabel>
                  <SelectInput value={dep.relationship} onChange={(e) => updateDependent(i, "relationship", e.target.value)}>
                    <option value="SPOUSE">Spouse</option>
                    <option value="CHILD">Child</option>
                    <option value="PARENT">Parent</option>
                    <option value="SIBLING">Sibling</option>
                  </SelectInput>
                </div>
                <div>
                  <FieldLabel>Date of birth</FieldLabel>
                  <TextInput type="date" value={dep.dateOfBirth} onChange={(e) => updateDependent(i, "dateOfBirth", e.target.value)} />
                </div>
              </div>
            </div>
          ))}
          <button onClick={addDependent} className="rounded-md border border-dashed border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:border-teal-400 hover:text-teal-700">
            + Add family member
          </button>
          {dependents.length === 0 && (
            <p className="text-sm text-gray-500">No dependents added. You can skip this step if you have no family members to register.</p>
          )}
          <div className="flex justify-between">
            <button onClick={() => setStep("applicant")} className="rounded-md border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
              ← Back
            </button>
            <button
              onClick={() => { setError(null); setStep("beneficiaries"); }}
              className="rounded-md bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
            >
              Next: Beneficiaries →
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — Beneficiaries */}
      {step === "beneficiaries" && (
        <div className="space-y-5">
          <h2 className="text-xl font-bold text-gray-950">Beneficiary information</h2>
          <p className="text-sm text-gray-600">Your primary beneficiary will receive the $20,000 benefit in the event of your passing.</p>
          <div className="rounded-md border border-gray-200 bg-white p-5">
            <p className="text-sm font-bold text-gray-950">Primary beneficiary</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <FieldLabel required>Full name</FieldLabel>
                <TextInput value={beneficiaries.primaryBeneficiaryName} onChange={(e) => setBeneficiaries((p) => ({ ...p, primaryBeneficiaryName: e.target.value }))} placeholder="Full name" />
              </div>
              <div>
                <FieldLabel required>Phone</FieldLabel>
                <TextInput type="tel" value={beneficiaries.primaryBeneficiaryPhone} onChange={(e) => setBeneficiaries((p) => ({ ...p, primaryBeneficiaryPhone: e.target.value }))} placeholder="629-000-0000" />
              </div>
            </div>
            <div className="mt-3">
              <FieldLabel required>Address</FieldLabel>
              <TextInput value={beneficiaries.primaryBeneficiaryAddress} onChange={(e) => setBeneficiaries((p) => ({ ...p, primaryBeneficiaryAddress: e.target.value }))} placeholder="Street, City, State, ZIP" />
            </div>
          </div>
          <div className="rounded-md border border-gray-200 bg-white p-5">
            <p className="text-sm font-bold text-gray-950">Contingent beneficiary <span className="font-normal text-gray-500">(optional)</span></p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <FieldLabel>Full name</FieldLabel>
                <TextInput value={beneficiaries.contingentBeneficiaryName} onChange={(e) => setBeneficiaries((p) => ({ ...p, contingentBeneficiaryName: e.target.value }))} placeholder="Full name" />
              </div>
              <div>
                <FieldLabel>Phone</FieldLabel>
                <TextInput type="tel" value={beneficiaries.contingentBeneficiaryPhone} onChange={(e) => setBeneficiaries((p) => ({ ...p, contingentBeneficiaryPhone: e.target.value }))} placeholder="629-000-0000" />
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <button onClick={() => setStep("family")} className="rounded-md border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
              ← Back
            </button>
            <button
              onClick={() => {
                if (!beneficiaries.primaryBeneficiaryName || !beneficiaries.primaryBeneficiaryPhone || !beneficiaries.primaryBeneficiaryAddress) {
                  setError("Please fill in primary beneficiary details.");
                  return;
                }
                setError(null);
                setStep("acknowledgement");
              }}
              className="rounded-md bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
            >
              Next: Acknowledgement →
            </button>
          </div>
        </div>
      )}

      {/* Step 4 — Acknowledgement */}
      {step === "acknowledgement" && (
        <div className="space-y-5">
          <h2 className="text-xl font-bold text-gray-950">Acknowledgement</h2>
          <div className="rounded-md border border-gray-200 bg-gray-50 p-5 text-sm leading-6 text-gray-700 space-y-2">
            <p>By submitting this application I confirm that:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>I am at least 18 years old.</li>
              <li>I live within 60 miles of Nashville, Tennessee.</li>
              <li>I agree to abide by the association bylaws and General Assembly decisions.</li>
              <li>I understand the $300 registration fee is due upon membership approval.</li>
              <li>I understand there is a 6-month waiting period before benefit eligibility.</li>
            </ul>
          </div>
          <div>
            <FieldLabel required>Printed name (signature)</FieldLabel>
            <TextInput
              value={acknowledgement.signatureName}
              onChange={(e) => setAcknowledgement((p) => ({ ...p, signatureName: e.target.value }))}
              placeholder="Type your full name to sign"
            />
          </div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={acknowledgement.agreedToTerms}
              onChange={(e) => setAcknowledgement((p) => ({ ...p, agreedToTerms: e.target.checked }))}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="text-sm text-gray-700">I agree to the terms above and the association bylaws.</span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={acknowledgement.registrationFeePaid}
              onChange={(e) => setAcknowledgement((p) => ({ ...p, registrationFeePaid: e.target.checked }))}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="text-sm text-gray-700">I understand that the $300 registration fee is payable upon membership approval.</span>
          </label>
          <div className="flex justify-between">
            <button onClick={() => setStep("beneficiaries")} className="rounded-md border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
              ← Back
            </button>
            <button
              disabled={submitting || !acknowledgement.agreedToTerms || !acknowledgement.signatureName}
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 rounded-md bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-teal-400"
            >
              {submitting ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Submitting…
                </>
              ) : "Submit application"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
