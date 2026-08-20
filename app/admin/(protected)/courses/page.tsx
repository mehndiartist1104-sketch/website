import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CoursesManager } from "@/components/admin/courses-manager";

export const metadata: Metadata = { title: "Courses" };

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-heading text-3xl font-semibold text-primary">Courses</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Create and manage courses. Toggle a course off to hide it without deleting.
      </p>
      <div className="mt-8">
        <CoursesManager courses={courses} />
      </div>
    </div>
  );
}
