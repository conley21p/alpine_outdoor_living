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

const initialFormState = (services: string[]): ContactFormState => ({
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
      <div className="rounded-2xl border-2 border-brand-primary/20 bg-brand-primary/5 p-8 shadow-modern">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-primary text-white">
            ✓
          </div>
          <div>
            <h3 className="text-xl font-bold text-brand-primary">Thank you!</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              Your request has been submitted. We will contact you soon.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-gray-100 bg-white p-8 shadow-card">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-800">First Name *</label>
          <Input
            value={form.firstName}
            onChange={(event) => onChange("firstName", event.target.value)}
            required
          />
          {fieldErrors.firstName && (
            <p className="mt-2 text-xs font-medium text-red-600">{fieldErrors.firstName}</p>
          )}
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-800">Last Name</label>
          <Input value={form.lastName} onChange={(event) => onChange("lastName", event.target.value)} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-800">Phone</label>
          <Input value={form.phone} onChange={(event) => onChange("phone", event.target.value)} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-800">Email</label>
          <Input
            type="email"
            value={form.email}
            onChange={(event) => onChange("email", event.target.value)}
          />
        </div>
      </div>
      {fieldErrors.contact && <p className="text-xs font-medium text-red-600">{fieldErrors.contact}</p>}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-800">Service Needed *</label>
          <select
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none transition-all focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 hover:border-gray-300"
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
            <p className="mt-2 text-xs font-medium text-red-600">{fieldErrors.serviceNeeded}</p>
          )}
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-800">Preferred Date</label>
          <Input
            type="date"
            value={form.preferredDate}
            onChange={(event) => onChange("preferredDate", event.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-800">Message</label>
        <textarea
          className="min-h-32 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none transition-all focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 hover:border-gray-300"
          value={form.message}
          onChange={(event) => onChange("message", event.target.value)}
        />
      </div>

      {error && <p className="text-sm font-medium text-red-600">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {loading ? "Submitting..." : "Submit Request"}
      </Button>
    </form>
  );
}
