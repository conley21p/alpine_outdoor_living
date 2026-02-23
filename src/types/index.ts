export type ContactStatus = "active" | "inactive" | "blocked";
export type LeadStatus =
  | "new"
  | "contacted"
  | "quoted"
  | "won"
  | "lost"
  | "unresponsive";
export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";
export type JobStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "invoiced"
  | "paid";
export type EmailQueueStatus =
  | "pending_approval"
  | "approved"
  | "sent"
  | "failed"
  | "cancelled";
export type PaymentRequestStatus =
  | "pending"
  | "approved"
  | "denied"
  | "executed"
  | "expired";
export type AgentLogStatus = "success" | "error" | "pending";
export type AgentEntityType =
  | "contact"
  | "lead"
  | "appointment"
  | "job"
  | "email"
  | "payment"
  | "general";

export interface Contact {
  id: string;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string | null;
  phone: string | null;
  email: string | null;
  source: string | null;
  notes: string | null;
  tags: string[];
  status: ContactStatus;
}

export interface Lead {
  id: string;
  created_at: string;
  updated_at: string;
  contact_id: string | null;
  service_needed: string | null;
  preferred_date: string | null;
  message: string | null;
  status: LeadStatus;
  source: string | null;
  agent_notes: string | null;
  owner_notes: string | null;
  assigned_to: string | null;
}

export interface Appointment {
  id: string;
  created_at: string;
  updated_at: string;
  contact_id: string | null;
  lead_id: string | null;
  title: string;
  start_time: string;
  end_time: string | null;
  address: string | null;
  service: string | null;
  assigned_to: string | null;
  status: AppointmentStatus;
  google_event_id: string | null;
  notes: string | null;
  reminder_sent: boolean;
}

export interface Job {
  id: string;
  created_at: string;
  updated_at: string;
  contact_id: string | null;
  appointment_id: string | null;
  title: string;
  status: JobStatus;
  service: string | null;
  assigned_to: string | null;
  scheduled_date: string | null;
  completed_date: string | null;
  invoice_amount: number | null;
  paid_amount: number | null;
  notes: string | null;
  photos: string[];
}

export interface Employee {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  phone: string | null;
  email: string | null;
  google_calendar_id: string | null;
  role: string | null;
  active: boolean;
  notes: string | null;
}

export interface EmailQueue {
  id: string;
  created_at: string;
  updated_at: string;
  to_email: string;
  to_name: string | null;
  subject: string;
  body_html: string;
  body_text: string | null;
  status: EmailQueueStatus;
  type: string | null;
  approved_at: string | null;
  sent_at: string | null;
  contact_id: string | null;
  error_message: string | null;
}

export interface PaymentRequest {
  id: string;
  created_at: string;
  updated_at: string;
  amount: number;
  vendor: string;
  reason: string;
  status: PaymentRequestStatus;
  requested_by: string;
  approved_at: string | null;
  executed_at: string | null;
  approval_token: string | null;
  expires_at: string | null;
  transaction_ref: string | null;
  notes: string | null;
}

export interface AgentLog {
  id: string;
  created_at: string;
  action: string;
  entity_type: AgentEntityType | null;
  entity_id: string | null;
  description: string;
  metadata: Record<string, unknown>;
  status: AgentLogStatus;
}

export interface Review {
  id: string;
  created_at: string;
  updated_at: string;
  customer_name: string;
  service: string | null;
  quote: string;
  rating: number;
  review_date: string;
  source: string | null;
  published: boolean;
}
