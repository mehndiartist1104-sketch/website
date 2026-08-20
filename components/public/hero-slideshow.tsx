"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

function SlideImage({ src, priority }: { src: string; priority?: boolean }) {
  const className = "absolute inset-0 h-full w-full object-cover";
  if (src.startsWith("http")) {
    return (
      <Image
        src={src}
        alt=""
        fill
        priority={priority}
        quality={70}
        sizes="100vw"
        className="object-cover"
        fetchPriority={priority ? "high" : "auto"}
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className={className} fetchPriority={priority ? "high" : "auto"} />
  );
}

export function HeroSlideshow({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);
  const slides = images.filter(Boolean);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  if (slides.length === 1) {
    return (
      <div className="absolute inset-0">
        <SlideImage src={slides[0]} priority />
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      <AnimatePresence initial={false}>
        <motion.div
          key={`${slides[index]}-${index}`}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
        >
          <SlideImage src={slides[index]} priority={index === 0} />
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-4 left-1/2 z-10 hidden -translate-x-1/2 gap-2 lg:flex">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Show hero image ${i + 1}`}
            className={`min-h-8 min-w-8 rounded-full transition-all ${
              i === index ? "w-8 bg-gold" : "w-8 bg-primary-foreground/40"
            }`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
