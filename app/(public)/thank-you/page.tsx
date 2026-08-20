import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Thank You",
  robots: { index: false },
};

export default function ThankYouPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-32">
      <CheckCircle2 className="h-16 w-16 text-terracotta" aria-hidden />
      <h1 className="mt-6 font-heading text-4xl font-semibold text-primary sm:text-5xl">
        Thank you!
      </h1>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        Your message has been received. We usually reply within a few hours during
        studio time — keep an eye on your phone.
      </p>
      <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
        <Button className="h-12 w-full bg-primary hover:bg-primary/90 sm:w-auto" render={<Link href="/gallery" />}>
          Browse the gallery
        </Button>
        <Button variant="outline" className="h-12 w-full sm:w-auto" render={<Link href="/" />}>
          Back to home
        </Button>
      </div>
    </div>
  );
}
