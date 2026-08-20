import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getActiveCourses } from "@/lib/data";
import { CourseCard } from "@/components/public/course-card";
import { SectionHeading } from "@/components/public/section-heading";
import { Reveal } from "@/components/public/reveal";

export async function CourseTeaser() {
  const courses = (await getActiveCourses()).slice(0, 3);
  if (courses.length === 0) return null;

  return (
    <section className="relative bg-transparent py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Learn the Craft"
            title="Mehndi courses"
            description="Small-batch, hands-on classes — from your first cone to full bridal commissions."
          />
        </Reveal>
        <div className="mt-10 grid gap-5 sm:mt-14 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, i) => (
            <Reveal key={course.id} delay={i * 0.08} className="h-full">
              <CourseCard course={course} />
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 text-center">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 font-medium text-terracotta transition-colors hover:text-primary"
          >
            View all courses
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
