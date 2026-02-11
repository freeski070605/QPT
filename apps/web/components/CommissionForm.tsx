"use client";

import { FormEvent, useState } from "react";
import { createCommission } from "../lib/api";

type CommissionDraft = {
  name: string;
  email: string;
  sizeRequest: string;
  colorPalette: string;
  description: string;
  budget: string;
  timeline: string;
};

const EMPTY_FORM: CommissionDraft = {
  name: "",
  email: "",
  sizeRequest: "",
  colorPalette: "",
  description: "",
  budget: "",
  timeline: ""
};

export function CommissionForm() {
  const [form, setForm] = useState<CommissionDraft>(EMPTY_FORM);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setSent(false);
    setError(null);

    try {
      await createCommission({
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        sizeRequest: form.sizeRequest.trim(),
        colorPalette: form.colorPalette.trim(),
        description: form.description.trim(),
        budget: form.budget.trim(),
        timeline: form.timeline.trim()
      });
      setSent(true);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send commission request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-pad">
      <div className="brand-shell">
        <div className="mx-auto max-w-3xl rounded-soft bg-brand-neutral p-6 shadow-soft sm:p-10">
          <p className="text-xs uppercase tracking-[0.22em] text-brand-accent">Commission Request</p>
          <h1 className="mt-3 text-4xl sm:text-5xl">Create A Defining Moment</h1>
          <p className="mt-4 text-brand-text/75">
            Share your vision and we will shape a one-of-one resin composition with intentional form, tone, and depth.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-8">
            <Field label="Name" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} type="text" required />
            <Field label="Email" value={form.email} onChange={(value) => setForm((current) => ({ ...current, email: value }))} type="email" required />
            <Field
              label="Size Request"
              value={form.sizeRequest}
              onChange={(value) => setForm((current) => ({ ...current, sizeRequest: value }))}
              type="text"
              required
            />
            <Field
              label="Color Palette"
              value={form.colorPalette}
              onChange={(value) => setForm((current) => ({ ...current, colorPalette: value }))}
              type="text"
              required
            />
            <AreaField
              label="Describe Your Piece"
              value={form.description}
              onChange={(value) => setForm((current) => ({ ...current, description: value }))}
              required
            />
            <Field label="Budget" value={form.budget} onChange={(value) => setForm((current) => ({ ...current, budget: value }))} type="text" required />
            <Field label="Timeline" value={form.timeline} onChange={(value) => setForm((current) => ({ ...current, timeline: value }))} type="text" required />

            <button type="submit" className="btn-primary w-full sm:w-auto" disabled={loading}>
              {loading ? "Sending..." : "Send Commission Brief"}
            </button>

            {sent ? (
              <p className="text-sm text-brand-accent">Your request has been received. We will reply with availability and next steps.</p>
            ) : null}
            {error ? <p className="text-sm text-red-700">{error}</p> : null}
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  required
}: {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block border-b border-brand-accent/30 pb-3">
      <span className="mb-3 block text-xs uppercase tracking-[0.18em] text-brand-primary/70">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full bg-transparent text-brand-primary outline-none placeholder:text-brand-primary/40"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </label>
  );
}

function AreaField({
  label,
  value,
  onChange,
  required
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block border-b border-brand-accent/30 pb-3">
      <span className="mb-3 block text-xs uppercase tracking-[0.18em] text-brand-primary/70">{label}</span>
      <textarea
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="w-full resize-y bg-transparent text-brand-primary outline-none placeholder:text-brand-primary/40"
        placeholder="Describe subject, mood, style, and any must-have details"
      />
    </label>
  );
}
