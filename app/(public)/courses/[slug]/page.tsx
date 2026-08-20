import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Clock3 } from "lucide-react";
import { getActiveCourses, getCourseBySlug } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { LeadForm } from "@/components/public/lead-form";
import { formatPrice } from "@/lib/types";

export const revalidate = 3600;

export async function generateStaticParams() {
  const courses = await getActiveCourses();
  return courses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return {};
  return {
    title: course.title,
    description: course.description,
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <Link
        href="/courses"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-terracotta"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        All courses
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-12">
        <div>
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <h1 className="font-heading text-3xl font-semibold text-primary sm:text-5xl">
              {course.title}
            </h1>
            {course.offerPrice !== null && (
              <Badge className="bg-gold text-primary">Offer</Badge>
            )}
          </div>

          <p className="mt-4 flex items-center gap-2 text-muted-foreground">
            <Clock3 className="h-4 w-4 text-terracotta" aria-hidden />
            {course.durationLabel}
          </p>

          <div className="mt-6">
            {course.offerPrice !== null ? (
              <>
                <span className="font-heading text-4xl font-semibold text-terracotta">
                  {formatPrice(course.offerPrice)}
                </span>{" "}
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(course.price)}
                </span>
              </>
            ) : (
              <span className="font-heading text-4xl font-semibold text-primary">
                {formatPrice(course.price)}
              </span>
            )}
          </div>

          <p className="mt-6 leading-relaxed text-foreground/85">
            {course.description}
          </p>

          <h2 className="mt-10 font-heading text-2xl font-semibold text-primary">
            What you will learn
          </h2>
          <ul className="mt-4 space-y-3">
            {course.curriculumPoints.map((point) => (
              <li key={point} className="flex items-start gap-3 text-foreground/85">
                <span className="mt-1 rounded-full bg-secondary p-1">
                  <Check className="h-3.5 w-3.5 text-terracotta" aria-hidden />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8 lg:sticky lg:top-24">
            <h2 className="font-heading text-2xl font-semibold text-primary">
              Enquire about this course
            </h2>
            <p className="mb-6 mt-2 text-sm text-muted-foreground">
              Leave your details and we will call you back with batch dates and seats.
            </p>
            <LeadForm
              source="COURSE_ENQUIRY"
              courseId={course.id}
              courseTitle={course.title}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
