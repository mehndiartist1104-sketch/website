"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import type { Course } from "@prisma/client";
import { deleteCourse, toggleCourseActive } from "@/app/actions/courses";
import { CourseForm } from "@/components/admin/course-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { formatPrice } from "@/lib/types";

export function CoursesManager({ courses }: { courses: Course[] }) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [deleting, setDeleting] = useState<Course | null>(null);
  const [pending, startTransition] = useTransition();

  function refreshAndClose() {
    setCreateOpen(false);
    setEditing(null);
    router.refresh();
  }

  return (
    <div>
      <div className="flex justify-end">
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" aria-hidden />
          Add course
        </Button>
      </div>

      <div className="mt-6 space-y-4">
        {courses.map((course) => (
          <Card key={course.id} className="border-border/70">
            <CardHeader className="flex-row items-start justify-between gap-4 space-y-0 pb-2">
              <div>
                <p className="font-heading text-xl font-semibold text-primary">
                  {course.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  /courses/{course.slug} · {course.durationLabel}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {course.offerPrice !== null && (
                  <Badge className="bg-gold text-primary">Offer</Badge>
                )}
                <Badge variant={course.isActive ? "default" : "secondary"}>
                  {course.isActive ? "Live" : "Hidden"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-foreground/85">
                {course.offerPrice !== null ? (
                  <>
                    <span className="font-semibold text-terracotta">
                      {formatPrice(course.offerPrice)}
                    </span>{" "}
                    <span className="line-through opacity-60">
                      {formatPrice(course.price)}
                    </span>
                  </>
                ) : (
                  <span className="font-semibold">{formatPrice(course.price)}</span>
                )}
              </p>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  Live
                  <Switch
                    checked={course.isActive}
                    disabled={pending}
                    onCheckedChange={() =>
                      startTransition(async () => {
                        await toggleCourseActive(course.id);
                        router.refresh();
                      })
                    }
                    aria-label={`Toggle visibility of ${course.title}`}
                  />
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditing(course)}
                >
                  <Pencil className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => setDeleting(course)}
                >
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {courses.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No courses yet — create the first one.
          </p>
        )}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-xl">
          <DialogTitle>Add course</DialogTitle>
          <DialogDescription className="sr-only">Create a new course</DialogDescription>
          <CourseForm onDone={refreshAndClose} />
        </DialogContent>
      </Dialog>

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-xl">
          <DialogTitle>Edit course</DialogTitle>
          <DialogDescription className="sr-only">Edit course details</DialogDescription>
          {editing && <CourseForm course={editing} onDone={refreshAndClose} />}
        </DialogContent>
      </Dialog>

      <Dialog open={deleting !== null} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Delete course</DialogTitle>
          <DialogDescription>
            Deleting &ldquo;{deleting?.title}&rdquo; removes it from the public site.
            Existing leads keep their message but lose the course link. Prefer hiding
            it with the Live toggle if you may bring it back.
          </DialogDescription>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setDeleting(null)} disabled={pending}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  if (!deleting) return;
                  await deleteCourse(deleting.id);
                  setDeleting(null);
                  router.refresh();
                })
              }
            >
              {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
