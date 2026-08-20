import type { Metadata } from "next";
import { getActiveCourses } from "@/lib/data";
import { CourseCard } from "@/components/public/course-card";
import { SectionHeading } from "@/components/public/section-heading";
import { Reveal } from "@/components/public/reveal";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Courses",
  description:
    "Hands-on mehndi courses — from beginner cone control to advanced bridal mastery. Small batches, real practice.",
};

export default async function CoursesPage() {
  const courses = await getActiveCourses();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <SectionHeading
        eyebrow="Learn the Craft"
        title="Courses & offers"
        description="Structured, hands-on mehndi training with live practice and personal feedback."
      />
      {courses.length > 0 ? (
        <div className="mt-10 grid gap-5 sm:mt-14 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, i) => (
            <Reveal key={course.id} delay={i * 0.08} className="h-full">
              <CourseCard course={course} />
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="py-20 text-center text-muted-foreground">
          New batches are being scheduled — check back soon.
        </p>
      )}
    </div>
  );
}
