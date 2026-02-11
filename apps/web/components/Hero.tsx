"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

export function Hero() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 50]);

  return (
    <section ref={ref} className="section-pad relative overflow-hidden">
      <div className="brand-shell relative">
        <motion.div style={{ y }} className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2">
          <div className="relative h-64 w-64 rounded-full border border-brand-primary/15 sm:h-80 sm:w-80">
            <div className="absolute left-1/2 top-1/2 h-16 w-px -translate-x-1/2 -translate-y-full bg-brand-primary/30" />
            <div className="absolute left-1/2 top-1/2 h-px w-12 -translate-y-1/2 bg-brand-primary/25" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mx-auto flex max-w-3xl flex-col items-center pt-10 text-center"
        >
          <p className="font-display text-4xl tracking-[0.16em] text-brand-primary sm:text-6xl">
            QUARTER PAST TWELVE
          </p>
          <p className="mt-2 text-[11px] uppercase tracking-[0.5em] text-brand-accent">
            RESIN ARTS
          </p>
          <h1 className="mt-10 text-4xl leading-tight text-brand-primary sm:text-6xl sm:leading-tight">
            Resin Art Captured In A Moment
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-brand-text/70 sm:text-lg">
            A refined study in stillness, precision, and movement, expressed through hand-poured resin compositions.
          </p>

          <div className="mt-10 flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
            <Link href="/gallery" className="btn-primary">
              Explore Collection
            </Link>
            <Link href="/commission" className="btn-outline">
              Commission Work
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
