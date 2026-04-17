"use client";

import { FormEvent, useMemo, useState, useEffect } from "react";
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

interface ContactFormProps {
  initialService?: string;
}

const initialFormState = (services: readonly string[], defaultService?: string): ContactFormState => ({
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  serviceNeeded: defaultService || services[0] || "",
  preferredDate: "",
  message: "",
});

export function ContactForm({ initialService }: ContactFormProps) {
  const services = useMemo(() => [...publicConfig.servicesOffered], []);
  const [form, setForm] = useState<ContactFormState>(initialFormState(services, initialService));
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // If we have an initialService prop, use it immediately
    if (initialService) {
      setForm(prev => ({ ...prev, serviceNeeded: initialService }));
      return;
    }

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const serviceQuery = params.get("service");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (serviceQuery && services.includes(serviceQuery as any)) {
        setForm((prev) => ({ ...prev, serviceNeeded: serviceQuery }));
      }
    }
  }, [services, initialService]);

  const onChange = (field: keyof ContactFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.firstName.trim()) nextErrors.firstName = "First name is required.";
    if (!form.serviceNeeded.trim()) {
      nextErrors.serviceNeeded = "Select a service.";
    }
    if (!form.phone.trim()) {
      nextErrors.phone = "Phone number is required.";
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
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          access_key: "4880cd5b-7e22-4d93-9e8a-84d7c3d8f38d",
          to: publicConfig.businessEmail,
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          phone: form.phone,
          service: form.serviceNeeded,
          message: form.message,
          subject: `New Contact: ${form.serviceNeeded} from ${form.firstName}`,
          from_name: "Alpine Outdoor Living",
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message || "Unable to submit your request.");
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
      <div className="bg-transparent py-12 lg:py-20 text-center max-w-2xl mx-auto">
        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-3xl font-bold text-brand-textDark mb-6">Thank you for reaching out!</h3>
        <p className="text-lg leading-relaxed text-brand-textDark/80 mb-8">
          We&rsquo;ve received your request and are excited to learn more about your vision. Austin or a 
          member of the Alpine Team will review your details and get back with you within 24-48 hours 
          to discuss the next steps for your outdoor space.
        </p>
        <div className="space-y-4">
          <p className="text-base text-brand-textDark/60 italic">
            In the meantime, feel free to browse The Portfolio for more inspiration
          </p>
          <a 
            href="#services" 
            className="inline-block text-brand-primary font-bold border-b border-brand-primary pb-1 hover:text-brand-primary-dark hover:border-brand-primary-dark transition-all"
            onClick={() => setSuccess(false)} // Optional: allow them to reset if they want
          >
            Explore Our Services &rarr;
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 bg-transparent p-0">
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
          <label className="mb-2 block text-[14px] font-medium text-brand-textDark">Phone *</label>
          <Input 
            value={form.phone} 
            onChange={(event) => onChange("phone", event.target.value)} 
            required
          />
          {fieldErrors.phone && (
            <p className="mt-2 text-[13px] text-red-600">{fieldErrors.phone}</p>
          )}
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
