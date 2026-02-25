"use client";

import { FormEvent, useMemo, useState } from "react";
import { publicConfig } from "@/lib/config";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface ContactFormState {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  serviceNeeded: string;
  preferredDate: string;
  message: string;
}

const initialFormState = (services: readonly string[]): ContactFormState => ({
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  serviceNeeded: services[0] ?? "",
  preferredDate: "",
  message: "",
});

export function ContactForm() {
  const services = useMemo(() => publicConfig.servicesOffered, []);
  const [form, setForm] = useState<ContactFormState>(initialFormState(services));
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const onChange = (field: keyof ContactFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.firstName.trim()) nextErrors.firstName = "First name is required.";
    if (!form.serviceNeeded.trim()) {
      nextErrors.serviceNeeded = "Select a service.";
    }
    if (!form.phone.trim() && !form.email.trim()) {
      nextErrors.contact = "Phone or email is required.";
    }
    return nextErrors;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validate();
    setFieldErrors(validationErrors);
    setError("");

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const payload = (await response.json()) as {
          error?: string;
          errors?: Record<string, string>;
        };
        setFieldErrors(payload.errors || {});
        setError(payload.error || "Unable to submit your request.");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Unable to submit your request right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-2xl bg-brand-bgLight p-10 lg:p-12">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary text-2xl text-white">
            ✓
          </div>
          <h3 className="text-2xl font-semibold text-brand-textDark">Thank you!</h3>
          <p className="mt-3 text-base leading-relaxed text-brand-textDark/70">
            Your request has been submitted. We will contact you soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 rounded-2xl bg-brand-bgLight p-8 lg:p-10">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-[14px] font-medium text-brand-textDark">First Name *</label>
          <Input
            value={form.firstName}
            onChange={(event) => onChange("firstName", event.target.value)}
            required
          />
          {fieldErrors.firstName && (
            <p className="mt-2 text-[13px] text-red-600">{fieldErrors.firstName}</p>
          )}
        </div>
        <div>
          <label className="mb-2 block text-[14px] font-medium text-brand-textDark">Last Name</label>
          <Input value={form.lastName} onChange={(event) => onChange("lastName", event.target.value)} />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-[14px] font-medium text-brand-textDark">Phone</label>
          <Input value={form.phone} onChange={(event) => onChange("phone", event.target.value)} />
        </div>
        <div>
          <label className="mb-2 block text-[14px] font-medium text-brand-textDark">Email</label>
          <Input
            type="email"
            value={form.email}
            onChange={(event) => onChange("email", event.target.value)}
          />
        </div>
      </div>
      {fieldErrors.contact && <p className="text-[13px] text-red-600">{fieldErrors.contact}</p>}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-[14px] font-medium text-brand-textDark">Service Needed *</label>
          <select
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[15px] outline-none transition-all focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 hover:border-black/20"
            value={form.serviceNeeded}
            onChange={(event) => onChange("serviceNeeded", event.target.value)}
            required
          >
            {services.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
          {fieldErrors.serviceNeeded && (
            <p className="mt-2 text-[13px] text-red-600">{fieldErrors.serviceNeeded}</p>
          )}
        </div>
        <div>
          <label className="mb-2 block text-[14px] font-medium text-brand-textDark">Preferred Date</label>
          <Input
            type="date"
            value={form.preferredDate}
            onChange={(event) => onChange("preferredDate", event.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-[14px] font-medium text-brand-textDark">Message</label>
        <textarea
          className="min-h-32 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[15px] outline-none transition-all focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 hover:border-black/20"
          value={form.message}
          onChange={(event) => onChange("message", event.target.value)}
        />
      </div>

      {error && <p className="text-[14px] text-red-600">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full sm:w-auto sm:min-w-[180px]">
        {loading ? "Submitting..." : "Submit Request"}
      </Button>
    </form>
  );
}
