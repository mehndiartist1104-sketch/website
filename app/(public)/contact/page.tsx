import type { Metadata } from "next";
import { Camera, MapPin } from "lucide-react";
import { getSiteConfig } from "@/lib/data";
import { LeadForm } from "@/components/public/lead-form";
import { SectionHeading } from "@/components/public/section-heading";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a mehndi session or ask us anything — call, WhatsApp, or send the enquiry form.",
};

export default async function ContactPage() {
  const config = await getSiteConfig();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <SectionHeading
        eyebrow="Get in Touch"
        title="Book your session"
        description="Tell us the occasion and date — we usually reply within a few hours."
      />

      <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-2 lg:gap-12">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <LeadForm source="CONTACT_FORM" />
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-primary p-6 text-primary-foreground sm:p-8">
            <h2 className="font-heading text-2xl font-semibold">Studio details</h2>
            <ul className="mt-6 space-y-5">
              <li>
                <a
                  href={`tel:${config.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 font-medium hover:text-gold"
                  aria-label="Call the studio"
                >
                  <span className="text-2xl leading-none" aria-hidden>
                    📞
                  </span>
                  <span>Call</span>
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${config.whatsappNumber.replace(/[^\d]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 font-medium hover:text-gold"
                  aria-label="Chat on WhatsApp"
                >
                  <span className="text-2xl leading-none" aria-hidden>
                    💬
                  </span>
                  <span>WhatsApp</span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden />
                <div>
                  <p className="text-sm text-primary-foreground/70">Visit the studio</p>
                  <p className="font-medium">{config.address}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Camera className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden />
                <div>
                  <p className="text-sm text-primary-foreground/70">Follow our work</p>
                  <a
                    href={config.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium hover:text-gold"
                  >
                    Instagram
                  </a>
                </div>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-secondary/50 p-6 sm:p-8">
            <h3 className="font-heading text-xl font-semibold text-primary">
              Booking tips
            </h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-foreground/80">
              <li>Bridal slots fill 4–6 weeks out in wedding season.</li>
              <li>Mention your outfit colors for matched design accents.</li>
              <li>Group and festival bookings get bundled pricing.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
