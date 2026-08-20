"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintCertificateButton() {
  return (
    <Button
      type="button"
      className="h-11 bg-gold text-primary hover:bg-gold/90"
      onClick={() => window.print()}
    >
      <Printer className="mr-2 h-4 w-4" aria-hidden />
      Print / Save PDF
    </Button>
  );
}
