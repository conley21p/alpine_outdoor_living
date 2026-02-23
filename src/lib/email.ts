import nodemailer, { type Transporter } from "nodemailer";
import { Resend } from "resend";
import { getServerConfig, publicConfig, type EmailProvider } from "@/lib/config";
import { createPaymentApprovalSignature } from "@/lib/payment-approval";

export interface SendEmailOptions {
  toEmail: string;
  toName?: string;
  subject: string;
  bodyHtml: string;
  bodyText?: string;
}

export interface EmailTemplateResult {
  subject: string;
  bodyHtml: string;
  bodyText: string;
}

let cachedTransporter: Transporter | null = null;
let cachedResend: Resend | null = null;

const getFromAddress = (provider: EmailProvider) => {
  const server = getServerConfig();
  if (provider === "gmail") {
    return `"${server.gmail.fromName}" <${server.gmail.user}>`;
  }
  if (provider === "smtp") {
    return `"${server.smtp.fromName}" <${server.smtp.fromEmail}>`;
  }
  return `"${server.resend.fromName}" <${server.resend.fromEmail}>`;
};

const getNodemailerTransporter = () => {
  if (cachedTransporter) return cachedTransporter;
  const server = getServerConfig();

  if (server.emailProvider === "gmail") {
    cachedTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: server.gmail.user,
        pass: server.gmail.appPassword,
      },
    });
    return cachedTransporter;
  }

  cachedTransporter = nodemailer.createTransport({
    host: server.smtp.host,
    port: server.smtp.port,
    secure: server.smtp.secure,
    auth: {
      user: server.smtp.user,
      pass: server.smtp.password,
    },
  });
  return cachedTransporter;
};

const getResendClient = () => {
  if (cachedResend) return cachedResend;
  const server = getServerConfig();
  cachedResend = new Resend(server.resend.apiKey);
  return cachedResend;
};

export const sendEmail = async (options: SendEmailOptions) => {
  const server = getServerConfig();
  const from = getFromAddress(server.emailProvider);
  const to = options.toName
    ? `"${options.toName}" <${options.toEmail}>`
    : options.toEmail;

  if (server.emailProvider === "resend") {
    const resend = getResendClient();
    const response = await resend.emails.send({
      from,
      to,
      subject: options.subject,
      html: options.bodyHtml,
      text: options.bodyText,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return { provider: "resend", id: response.data?.id ?? null };
  }

  const transporter = getNodemailerTransporter();
  const response = await transporter.sendMail({
    from,
    to,
    subject: options.subject,
    html: options.bodyHtml,
    text: options.bodyText,
  });

  return { provider: server.emailProvider, id: response.messageId };
};

const shell = (title: string, body: string) => `
  <div style="margin:0;padding:0;background:#f3f5f7;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="padding:16px 0;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
            <tr>
              <td style="padding:20px;background:${publicConfig.brandPrimary};color:${publicConfig.brandTextLight};">
                <h1 style="margin:0;font-size:20px;line-height:1.3;">${publicConfig.businessName}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:20px;color:${publicConfig.brandTextDark};">
                <h2 style="margin-top:0;font-size:18px;line-height:1.3;">${title}</h2>
                ${body}
              </td>
            </tr>
            <tr>
              <td style="padding:16px 20px;background:#f9fafb;color:#6b7280;font-size:12px;line-height:1.5;">
                ${publicConfig.businessDescription}<br />
                ${publicConfig.businessPhone} • ${publicConfig.businessEmail}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
`;

export const newLeadNotificationTemplate = (params: {
  name: string;
  serviceNeeded: string;
  phone?: string;
  email?: string;
  preferredDate?: string;
  message?: string;
  crmUrl: string;
}): EmailTemplateResult => {
  const subject = `New Lead: ${params.name} — ${params.serviceNeeded}`;
  const bodyHtml = shell(
    "New lead received",
    `
      <p style="margin:0 0 12px;">A new prospect submitted the website form.</p>
      <p style="margin:0 0 6px;"><strong>Name:</strong> ${params.name}</p>
      <p style="margin:0 0 6px;"><strong>Service:</strong> ${params.serviceNeeded}</p>
      <p style="margin:0 0 6px;"><strong>Phone:</strong> ${params.phone || "Not provided"}</p>
      <p style="margin:0 0 6px;"><strong>Email:</strong> ${params.email || "Not provided"}</p>
      <p style="margin:0 0 6px;"><strong>Preferred Date:</strong> ${params.preferredDate || "Not provided"}</p>
      <p style="margin:0 0 12px;"><strong>Message:</strong><br/>${params.message || "No message provided."}</p>
      <a href="${params.crmUrl}" style="display:inline-block;padding:10px 16px;border-radius:8px;background:${publicConfig.brandSecondary};color:#ffffff;text-decoration:none;font-weight:600;">Open CRM</a>
    `,
  );
  const bodyText = `New lead received
Name: ${params.name}
Service: ${params.serviceNeeded}
Phone: ${params.phone || "Not provided"}
Email: ${params.email || "Not provided"}
Preferred Date: ${params.preferredDate || "Not provided"}
Message: ${params.message || "No message provided"}
CRM: ${params.crmUrl}`;
  return { subject, bodyHtml, bodyText };
};

export const leadAutoResponseTemplate = (params: {
  name: string;
}): EmailTemplateResult => {
  const subject = `Thanks for reaching out to ${publicConfig.businessName}`;
  const bodyHtml = shell(
    "We received your request",
    `
      <p style="margin:0 0 12px;">Hi ${params.name},</p>
      <p style="margin:0 0 12px;">Thanks for contacting ${publicConfig.businessName}. Our team has received your request and will follow up soon.</p>
      <p style="margin:0 0 0;">Need help sooner? Call us at <strong>${publicConfig.businessPhone}</strong>.</p>
    `,
  );
  const bodyText = `Hi ${params.name},

Thanks for contacting ${publicConfig.businessName}. We received your request and will follow up soon.
Need help sooner? Call ${publicConfig.businessPhone}.`;
  return { subject, bodyHtml, bodyText };
};

export const appointmentConfirmationTemplate = (params: {
  name: string;
  service: string;
  dateTime: string;
  address?: string;
}): EmailTemplateResult => {
  const subject = `Appointment Confirmed — ${params.dateTime}`;
  const bodyHtml = shell(
    "Appointment confirmed",
    `
      <p style="margin:0 0 12px;">Hi ${params.name}, your appointment is confirmed.</p>
      <p style="margin:0 0 6px;"><strong>Service:</strong> ${params.service}</p>
      <p style="margin:0 0 6px;"><strong>Date & Time:</strong> ${params.dateTime}</p>
      <p style="margin:0 0 6px;"><strong>Address:</strong> ${params.address || "Will be confirmed by phone"}</p>
      <p style="margin:0;">Questions or changes? Call ${publicConfig.businessPhone}.</p>
    `,
  );
  const bodyText = `Appointment confirmed
Service: ${params.service}
Date & Time: ${params.dateTime}
Address: ${params.address || "Will be confirmed by phone"}
Contact: ${publicConfig.businessPhone}`;
  return { subject, bodyHtml, bodyText };
};

export const appointmentReminderTemplate = (params: {
  name: string;
  service: string;
  dateTime: string;
  address?: string;
}): EmailTemplateResult => {
  const subject = "Reminder: Your appointment is tomorrow";
  const bodyHtml = shell(
    "Appointment reminder",
    `
      <p style="margin:0 0 12px;">Hi ${params.name}, this is a reminder about your appointment tomorrow.</p>
      <p style="margin:0 0 6px;"><strong>Service:</strong> ${params.service}</p>
      <p style="margin:0 0 6px;"><strong>Date & Time:</strong> ${params.dateTime}</p>
      <p style="margin:0;"><strong>Address:</strong> ${params.address || "Will be confirmed by phone"}</p>
    `,
  );
  const bodyText = `Reminder: your appointment is tomorrow
Service: ${params.service}
Date & Time: ${params.dateTime}
Address: ${params.address || "Will be confirmed by phone"}`;
  return { subject, bodyHtml, bodyText };
};

export const paymentApprovalRequestTemplate = (params: {
  amount: number;
  vendor: string;
  reason: string;
  approvalToken: string;
}): EmailTemplateResult => {
  const approveSignature = createPaymentApprovalSignature(
    params.approvalToken,
    "approve",
  );
  const denySignature = createPaymentApprovalSignature(params.approvalToken, "deny");
  const approveUrl = `${publicConfig.siteUrl}/api/webhooks/payment-approval?token=${encodeURIComponent(params.approvalToken)}&action=approve${approveSignature ? `&sig=${approveSignature}` : ""}`;
  const denyUrl = `${publicConfig.siteUrl}/api/webhooks/payment-approval?token=${encodeURIComponent(params.approvalToken)}&action=deny${denySignature ? `&sig=${denySignature}` : ""}`;
  const subject = `Payment Approval Required: $${params.amount.toFixed(2)} — ${params.vendor}`;
  const bodyHtml = shell(
    "Payment approval requested",
    `
      <p style="margin:0 0 12px;">A payment request requires your decision.</p>
      <p style="margin:0 0 6px;"><strong>Amount:</strong> $${params.amount.toFixed(2)}</p>
      <p style="margin:0 0 6px;"><strong>Vendor:</strong> ${params.vendor}</p>
      <p style="margin:0 0 16px;"><strong>Reason:</strong> ${params.reason}</p>
      <a href="${approveUrl}" style="display:inline-block;padding:10px 16px;border-radius:8px;background:#16a34a;color:#ffffff;text-decoration:none;font-weight:600;margin-right:8px;">Approve</a>
      <a href="${denyUrl}" style="display:inline-block;padding:10px 16px;border-radius:8px;background:#dc2626;color:#ffffff;text-decoration:none;font-weight:600;">Deny</a>
    `,
  );
  const bodyText = `Payment approval requested
Amount: $${params.amount.toFixed(2)}
Vendor: ${params.vendor}
Reason: ${params.reason}
Approve: ${approveUrl}
Deny: ${denyUrl}`;
  return { subject, bodyHtml, bodyText };
};
