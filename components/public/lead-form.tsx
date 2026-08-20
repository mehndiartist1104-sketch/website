"use client";

import { useState, useTransition, type FormEvent } from "react";
import { submitLead } from "@/app/actions/leads";
import { initialFormState, type FormState } from "@/lib/validations/lead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

export function LeadForm({
  source,
  courseId,
  courseTitle,
}: {
  source: "CONTACT_FORM" | "COURSE_ENQUIRY";
  courseId?: string;
  courseTitle?: string;
}) {
  const [state, setState] = useState<FormState>(initialFormState);
  const [pending, startTransition] = useTransition();
  const errors = state.fieldErrors ?? {};

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    startTransition(async () => {
      setState(await submitLead(initialFormState, fd));
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <input type="hidden" name="source" value={source} />
      {courseId && <input type="hidden" name="courseId" value={courseId} />}

      {courseTitle && (
        <p className="rounded-lg bg-secondary px-4 py-3 text-sm text-secondary-foreground">
          Enquiring about: <strong>{courseTitle}</strong>
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="lead-name">Name *</Label>
        <Input
          id="lead-name"
          name="name"
          required
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="lead-phone">Phone *</Label>
        <Input
          id="lead-phone"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          aria-invalid={Boolean(errors.phone)}
        />
        {errors.phone && <p className="text-sm text-destructive">{errors.phone[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="lead-email">Email (optional)</Label>
        <Input
          id="lead-email"
          name="email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="lead-message">
          {source === "COURSE_ENQUIRY" ? "Questions (optional)" : "Message (optional)"}
        </Label>
        <Textarea
          id="lead-message"
          name="message"
          rows={4}
          aria-invalid={Boolean(errors.message)}
          placeholder={
            source === "COURSE_ENQUIRY"
              ? "Preferred schedule, experience level..."
              : "Tell us about your occasion, date, and what you have in mind..."
          }
        />
        {errors.message && <p className="text-sm text-destructive">{errors.message[0]}</p>}
      </div>

      {state.status === "error" && state.message && (
        <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.message}
        </p>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="w-full bg-primary hover:bg-primary/90 h-12 text-base"
        size="lg"
      >
        {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />}
        {pending ? "Sending..." : source === "COURSE_ENQUIRY" ? "Send enquiry" : "Send message"}
      </Button>
    </form>
  );
}
