import Link from "next/link";
import { Clock3, Check } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, type CourseItem } from "@/lib/types";

export function CourseCard({ course }: { course: CourseItem }) {
  return (
    <Card className="flex h-full flex-col border-border/70 bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-xl font-semibold leading-snug text-primary sm:text-2xl">
            {course.title}
          </h3>
          {course.offerPrice !== null && (
            <Badge className="shrink-0 bg-gold text-primary">Offer</Badge>
          )}
        </div>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock3 className="h-4 w-4 text-terracotta" aria-hidden />
          {course.durationLabel}
        </p>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {course.description}
        </p>
        <ul className="mt-4 space-y-2">
          {course.curriculumPoints.slice(0, 4).map((point) => (
            <li key={point} className="flex items-start gap-2 text-sm text-foreground/85">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" aria-hidden />
              {point}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {course.offerPrice !== null ? (
            <>
              <span className="font-heading text-2xl font-semibold text-terracotta">
                {formatPrice(course.offerPrice)}
              </span>{" "}
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(course.price)}
              </span>
            </>
          ) : (
            <span className="font-heading text-2xl font-semibold text-primary">
              {formatPrice(course.price)}
            </span>
          )}
        </div>
        <Button
          className="h-11 w-full bg-primary hover:bg-primary/90 sm:w-auto"
          render={<Link href={`/courses/${course.slug}`} />}
        >
          Enquire
        </Button>
      </CardFooter>
    </Card>
  );
}
