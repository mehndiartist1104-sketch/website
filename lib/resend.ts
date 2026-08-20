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
