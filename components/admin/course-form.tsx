"use client";

import { useState, useTransition, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { createCourse, updateCourse } from "@/app/actions/courses";
import { initialFormState, type FormState } from "@/lib/validations/lead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { Course } from "@prisma/client";

export function CourseForm({
  course,
  onDone,
}: {
  course?: Course;
  onDone: () => void;
}) {
  const [state, setState] = useState<FormState>(initialFormState);
  const [pending, startTransition] = useTransition();
  const [active, setActive] = useState(course?.isActive ?? true);
  const errors = state.fieldErrors ?? {};

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    if (active) fd.set("isActive", "on");
    else fd.delete("isActive");

    startTransition(async () => {
      const result = course
        ? await updateCourse(course.id, initialFormState, fd)
        : await createCourse(initialFormState, fd);
      setState(result);
      if (result.status === "success") onDone();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="course-title">Title</Label>
        <Input
          id="course-title"
          name="title"
          required
          defaultValue={course?.title}
          aria-invalid={Boolean(errors.title)}
        />
        {errors.title && <p className="text-sm text-destructive">{errors.title[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="course-description">Description</Label>
        <Textarea
          id="course-description"
          name="description"
          rows={4}
          required
          defaultValue={course?.description}
          aria-invalid={Boolean(errors.description)}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="course-curriculum">Curriculum (one point per line)</Label>
        <Textarea
          id="course-curriculum"
          name="curriculumPoints"
          rows={5}
          required
          defaultValue={course?.curriculumPoints.join("\n")}
          placeholder={"Cone making and grip techniques\nLines, dots, and pressure drills"}
          aria-invalid={Boolean(errors.curriculumPoints)}
        />
        {errors.curriculumPoints && (
          <p className="text-sm text-destructive">{errors.curriculumPoints[0]}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="course-duration">Duration</Label>
          <Input
            id="course-duration"
            name="durationLabel"
            required
            defaultValue={course?.durationLabel}
            placeholder="2 weeks · 8 sessions"
            aria-invalid={Boolean(errors.durationLabel)}
          />
          {errors.durationLabel && (
            <p className="text-sm text-destructive">{errors.durationLabel[0]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="course-price">Price (₹)</Label>
          <Input
            id="course-price"
            name="price"
            type="number"
            min={0}
            required
            defaultValue={course?.price}
            aria-invalid={Boolean(errors.price)}
          />
          {errors.price && <p className="text-sm text-destructive">{errors.price[0]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="course-offer">Offer price (₹, optional)</Label>
          <Input
            id="course-offer"
            name="offerPrice"
            type="number"
            min={0}
            defaultValue={course?.offerPrice ?? ""}
            aria-invalid={Boolean(errors.offerPrice)}
          />
          {errors.offerPrice && (
            <p className="text-sm text-destructive">{errors.offerPrice[0]}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
        <Label htmlFor="course-active" className="cursor-pointer">
          Visible on public site
        </Label>
        <Switch
          id="course-active"
          name="isActive"
          checked={active}
          onCheckedChange={(checked) => setActive(checked)}
        />
      </div>

      {state.status === "error" && state.message && (
        <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.message}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onDone} disabled={pending}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />}
          {pending ? "Saving..." : course ? "Save changes" : "Create course"}
        </Button>
      </div>
    </form>
  );
}
