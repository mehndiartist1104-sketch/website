import { Resend } from "resend";

interface LeadNotification {
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  source: "CONTACT_FORM" | "COURSE_ENQUIRY";
  courseTitle: string | null;
}

export async function notifyAdminOfLead(lead: LeadNotification) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!apiKey || !to) {
    console.warn("Resend not configured; skipping lead notification email");
    return;
  }

  const resend = new Resend(apiKey);
  const sourceLabel =
    lead.source === "COURSE_ENQUIRY" ? "Course enquiry" : "Contact form";

  await resend.emails.send({
    from: "Mehndi Studio <onboarding@resend.dev>",
    to,
    subject: `New lead: ${lead.name} (${sourceLabel})`,
    html: `
      <h2>New ${sourceLabel}</h2>
      <p><strong>Name:</strong> ${lead.name}</p>
      <p><strong>Phone:</strong> ${lead.phone}</p>
      ${lead.email ? `<p><strong>Email:</strong> ${lead.email}</p>` : ""}
      ${lead.courseTitle ? `<p><strong>Course:</strong> ${lead.courseTitle}</p>` : ""}
      ${lead.message ? `<p><strong>Message:</strong><br/>${lead.message}</p>` : ""}
    `,
  });
}

export async function sendCertificateEmail(payload: {
  to: string;
  recipientName: string;
  courseTitle: string;
  studioName: string;
  serialNumber: string;
  certificateUrl: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("Resend not configured; skipping certificate email");
    return;
  }

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: `${payload.studioName} <onboarding@resend.dev>`,
    to: payload.to,
    subject: `Your ${payload.courseTitle} certificate of completion`,
    html: `
      <p>Dear ${payload.recipientName},</p>
      <p>Congratulations on completing <strong>${payload.courseTitle}</strong>.</p>
      <p>Your official certificate number is <strong>${payload.serialNumber}</strong>.</p>
      <p><a href="${payload.certificateUrl}">View and print your certificate</a></p>
    `,
  });
}
