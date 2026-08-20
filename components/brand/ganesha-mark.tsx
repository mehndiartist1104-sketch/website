import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function GaneshaMark({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      role="img"
      aria-hidden
      className={cn("inline-block bg-current align-middle", className)}
      style={{
        WebkitMaskImage: "url(/ganesha-logo.png)",
        maskImage: "url(/ganesha-logo.png)",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
      {...props}
    />
  );
}
