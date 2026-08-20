"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { Award, Copy, ExternalLink, Loader2, Mail, Trash2 } from "lucide-react";
import {
  deleteCertificate,
  emailCertificate,
  issueCertificate,
} from "@/app/actions/certificates";
import { CourseCertificate } from "@/components/public/course-certificate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialFormState, type FormState } from "@/lib/validations/lead";

export interface AdminCourseOption {
  id: string;
  title: string;
  durationLabel: string;
}

export interface AdminCertificateRow {
  id: string;
  serialNumber: string;
  recipientName: string;
  recipientEmail: string | null;
  completedAt: string;
  issuedAt: string;
  courseTitle: string;
  durationLabel: string;
}

export function CertificatesManager({
  courses,
  certificates,
  studioName,
  tagline,
}: {
  courses: AdminCourseOption[];
  certificates: AdminCertificateRow[];
  studioName: string;
  tagline: string;
}) {
  const router = useRouter();
  const [state, setState] = useState<FormState>(initialFormState);
  const [pending, startTransition] = useTransition();
  const [rowPending, setRowPending] = useState<string | null>(null);
  const [recipientName, setRecipientName] = useState("");
  const [courseId, setCourseId] = useState(courses[0]?.id ?? "");
  const [completedAt, setCompletedAt] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const errors = state.fieldErrors ?? {};
  const selected = courses.find((course) => course.id === courseId) ?? courses[0];

  function handleIssue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await issueCertificate(initialFormState, fd);
      setState(result);
      if (result.status === "success") {
        setRecipientName("");
        router.refresh();
      }
    });
  }

  function runRowAction(id: string, action: () => Promise<FormState>) {
    setRowPending(id);
    startTransition(async () => {
      const result = await action();
      setState(result);
      setRowPending(null);
      if (result.status === "success") router.refresh();
    });
  }

  return (
    <div className="space-y-10">
      <form
        onSubmit={handleIssue}
        className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8"
        noValidate
      >
        <div className="mb-5 flex items-center gap-2 text-primary">
          <Award className="h-5 w-5 text-terracotta" aria-hidden />
          <h2 className="font-heading text-2xl font-semibold">Issue a certificate</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="recipientName">Student name</Label>
            <Input
              id="recipientName"
              name="recipientName"
              required
              value={recipientName}
              onChange={(event) => setRecipientName(event.target.value)}
              aria-invalid={Boolean(errors.recipientName)}
            />
            {errors.recipientName && (
              <p className="text-sm text-destructive">{errors.recipientName[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="recipientEmail">Student email (optional)</Label>
            <Input
              id="recipientEmail"
              name="recipientEmail"
              type="email"
              aria-invalid={Boolean(errors.recipientEmail)}
            />
            {errors.recipientEmail && (
              <p className="text-sm text-destructive">{errors.recipientEmail[0]}</p>
            )}
            <p className="text-xs text-muted-foreground">
              If provided, the certificate link is emailed after issuing.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="courseId">Course</Label>
            <select
              id="courseId"
              name="courseId"
              required
              value={courseId}
              onChange={(event) => setCourseId(event.target.value)}
              className="h-11 w-full rounded-lg border border-input bg-transparent px-3 text-base md:h-8 md:text-sm"
              aria-invalid={Boolean(errors.courseId)}
            >
              {courses.length === 0 && <option value="">No courses yet</option>}
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
            {errors.courseId && (
              <p className="text-sm text-destructive">{errors.courseId[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="completedAt">Completion date</Label>
            <Input
              id="completedAt"
              name="completedAt"
              type="date"
              required
              value={completedAt}
              onChange={(event) => setCompletedAt(event.target.value)}
              aria-invalid={Boolean(errors.completedAt)}
            />
            {errors.completedAt && (
              <p className="text-sm text-destructive">{errors.completedAt[0]}</p>
            )}
          </div>
        </div>

        {state.message && (
          <p
            className={`mt-4 rounded-lg px-4 py-3 text-sm ${
              state.status === "error"
                ? "bg-destructive/10 text-destructive"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            {state.message}
          </p>
        )}

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={pending || courses.length === 0}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />}
            {pending ? "Issuing..." : "Issue certificate"}
          </Button>
        </div>
      </form>

      <div>
        <h2 className="mb-3 font-heading text-xl font-semibold text-primary">Live preview</h2>
        <CourseCertificate
          certificate={{
            studioName,
            tagline,
            recipientName: recipientName.trim() || "Student name",
            courseTitle: selected?.title ?? "Course title",
            durationLabel: selected?.durationLabel ?? "Duration",
            completedAt,
            issuedAt: new Date().toISOString(),
            serialNumber: "MS-PREVIEW",
          }}
        />
      </div>

      <div>
        <h2 className="font-heading text-xl font-semibold text-primary">Issued certificates</h2>
        {certificates.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No certificates issued yet.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {certificates.map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-foreground">{item.recipientName}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.courseTitle} · {item.serialNumber}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Completed {new Date(item.completedAt).toLocaleDateString("en-IN")}
                    {item.recipientEmail ? ` · ${item.recipientEmail}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-10"
                    render={<a href={`/certificate/${item.serialNumber}`} target="_blank" rel="noreferrer" />}
                  >
                    <ExternalLink className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                    View
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-10"
                    onClick={async () => {
                      const url = `${window.location.origin}/certificate/${item.serialNumber}`;
                      await navigator.clipboard.writeText(url);
                      setState({ status: "success", message: "Link copied." });
                    }}
                  >
                    <Copy className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                    Copy link
                  </Button>
                  {item.recipientEmail && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-10"
                      disabled={rowPending === item.id}
                      onClick={() =>
                        runRowAction(item.id, () => emailCertificate(item.id))
                      }
                    >
                      <Mail className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                      Email
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="h-10"
                    disabled={rowPending === item.id}
                    onClick={() => {
                      if (confirm("Remove this certificate? The public link will stop working.")) {
                        runRowAction(item.id, () => deleteCertificate(item.id));
                      }
                    }}
                  >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
