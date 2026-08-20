"use client";

import dynamic from "next/dynamic";

export const BrideBackground = dynamic(
  () => import("@/components/public/bride-scene").then((mod) => mod.BrideBackground),
  { ssr: false }
);
