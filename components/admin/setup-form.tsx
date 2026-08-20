"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { completeSetup } from "@/app/actions/auth";
import { initialFormState } from "@/lib/validations/lead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SetupForm() {
  const [state, formAction, pending] = useActionState(completeSetup, initialFormState);

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="setup-email">Admin email</Label>
        <Input id="setup-email" name="email" type="email" required autoComplete="email" />
        {state.fieldErrors?.email && (
          <p className="text-sm text-destructive">{state.fieldErrors.email[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="setup-password">Password</Label>
        <Input
          id="setup-password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
        />
        <p className="text-xs text-muted-foreground">Minimum 10 characters.</p>
        {state.fieldErrors?.password && (
          <p className="text-sm text-destructive">{state.fieldErrors.password[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="setup-confirm">Confirm password</Label>
        <Input
          id="setup-confirm"
          name="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
        />
        {state.fieldErrors?.confirmPassword && (
          <p className="text-sm text-destructive">{state.fieldErrors.confirmPassword[0]}</p>
        )}
      </div>

      {state.status === "error" && state.message && (
        <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.message}
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-full" size="lg">
        {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />}
        {pending ? "Creating account..." : "Create admin account"}
      </Button>
    </form>
  );
}
