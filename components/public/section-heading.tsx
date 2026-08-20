export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div
      className={`max-w-2xl rounded-2xl bg-background/80 px-5 py-5 shadow-sm sm:px-8 ${alignClass}`}
    >
      {eyebrow && (
        <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-terracotta sm:text-xs sm:tracking-[0.3em]">
          {eyebrow}
        </p>
      )}
      <h2 className="font-heading text-3xl font-semibold text-primary sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 leading-relaxed text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
