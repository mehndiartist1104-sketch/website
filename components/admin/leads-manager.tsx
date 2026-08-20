"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Eye } from "lucide-react";
import { updateLeadStatus } from "@/app/actions/leads-admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type LeadStatusValue = "NEW" | "CONTACTED" | "ENROLLED" | "CLOSED";

export interface AdminLead {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  source: "CONTACT_FORM" | "COURSE_ENQUIRY" | "REVIEW_FORM";
  status: LeadStatusValue;
  createdAt: string;
  courseTitle: string | null;
}

const STATUSES: LeadStatusValue[] = ["NEW", "CONTACTED", "ENROLLED", "CLOSED"];

const STATUS_STYLES: Record<LeadStatusValue, string> = {
  NEW: "bg-terracotta text-primary-foreground",
  CONTACTED: "bg-gold text-primary",
  ENROLLED: "bg-primary text-primary-foreground",
  CLOSED: "bg-muted text-muted-foreground",
};

const SOURCE_LABELS: Record<AdminLead["source"], string> = {
  CONTACT_FORM: "Contact",
  COURSE_ENQUIRY: "Course",
  REVIEW_FORM: "Review",
};

function StatusSelect({ lead }: { lead: AdminLead }) {
  const router = useRouter();
  const [status, setStatus] = useState(lead.status);
  const [, startTransition] = useTransition();

  return (
    <Select
      value={status}
      onValueChange={(value) => {
        const next = value as LeadStatusValue;
        setStatus(next);
        startTransition(async () => {
          const result = await updateLeadStatus(lead.id, next);
          if (result.ok) router.refresh();
          else setStatus(lead.status);
        });
      }}
    >
      <SelectTrigger
        size="sm"
        className={cn("border-none", STATUS_STYLES[status])}
        aria-label={`Status for ${lead.name}`}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUSES.map((s) => (
          <SelectItem key={s} value={s}>
            {s.charAt(0) + s.slice(1).toLowerCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function LeadsManager({ leads }: { leads: AdminLead[] }) {
  const [viewing, setViewing] = useState<AdminLead | null>(null);

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="hidden md:table-cell">Source</TableHead>
              <TableHead className="hidden lg:table-cell">Course</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="sr-only">View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">{lead.name}</TableCell>
                <TableCell>
                  <a
                    href={`tel:${lead.phone.replace(/\s/g, "")}`}
                    className="text-terracotta hover:underline"
                  >
                    {lead.phone}
                  </a>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="secondary">{SOURCE_LABELS[lead.source]}</Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {lead.courseTitle ?? "—"}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </TableCell>
                <TableCell>
                  <StatusSelect lead={lead} />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setViewing(lead)}
                    aria-label={`View message from ${lead.name}`}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {leads.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No leads in this view.
          </p>
        )}
      </div>

      <Dialog open={viewing !== null} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogTitle>{viewing?.name}</DialogTitle>
          <DialogDescription className="sr-only">Lead details</DialogDescription>
          {viewing && (
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Phone</dt>
                <dd>
                  <a
                    href={`tel:${viewing.phone.replace(/\s/g, "")}`}
                    className="font-medium text-terracotta"
                  >
                    {viewing.phone}
                  </a>
                </dd>
              </div>
              {viewing.email && (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Email</dt>
                  <dd className="font-medium">{viewing.email}</dd>
                </div>
              )}
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Source</dt>
                <dd className="font-medium">{SOURCE_LABELS[viewing.source]}</dd>
              </div>
              {viewing.courseTitle && (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Course</dt>
                  <dd className="font-medium">{viewing.courseTitle}</dd>
                </div>
              )}
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Received</dt>
                <dd className="font-medium">
                  {new Date(viewing.createdAt).toLocaleString("en-IN")}
                </dd>
              </div>
              {viewing.message && (
                <div>
                  <dt className="mb-1 text-muted-foreground">Message</dt>
                  <dd className="rounded-lg bg-muted px-4 py-3 leading-relaxed">
                    {viewing.message}
                  </dd>
                </div>
              )}
            </dl>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
