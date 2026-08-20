import { Leaf, Award, Clock3, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/public/section-heading";
import { Reveal } from "@/components/public/reveal";

const REASONS = [
  {
    icon: Leaf,
    title: "100% Organic Henna",
    text: "Hand-mixed cones with pure henna, eucalyptus, and clove oils — never chemical black cones.",
  },
  {
    icon: Award,
    title: "Award-Winning Artistry",
    text: "Over a decade of bridal commissions, featured in regional wedding publications.",
  },
  {
    icon: Clock3,
    title: "On-Time, Every Time",
    text: "Wedding mornings run on schedules. We arrive early and finish before the photographer does.",
  },
  {
    icon: Sparkles,
    title: "Designs That Last",
    text: "Deep, even stains that hold for two weeks with our aftercare guidance included.",
  },
];

export function WhyUs() {
  return (
    <section className="relative bg-transparent py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Reveal>
        <SectionHeading
          eyebrow="Why Choose Us"
          title="Craft in every cone"
          description="Mehndi is temporary, but the memory of it shouldn't be. Every design is drawn freehand and tailored to you."
        />
      </Reveal>
      <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {REASONS.map((reason, i) => (
          <Reveal key={reason.title} delay={i * 0.08}>
            <Card className="h-full border-border/70 bg-card/90 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md">
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex rounded-full bg-secondary p-3">
                  <reason.icon className="h-6 w-6 text-terracotta" aria-hidden />
                </div>
                <h3 className="font-heading text-xl font-semibold text-primary">
                  {reason.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {reason.text}
                </p>
              </CardContent>
            </Card>
          </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
