"use client";

import { motion } from "framer-motion";

interface HeroMinimalProps {
  title?: string;
  subtitle?: string;
  primaryCta?: string;
  secondaryCta?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

export function HeroMinimal({
  title = "Build Something Amazing",
  subtitle = "Clean minimal hero with typography focus, subtle animations, and dark mode support.",
  primaryCta = "Get Started",
  secondaryCta = "Learn More",
  onPrimaryClick,
  onSecondaryClick,
}: HeroMinimalProps) {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[0.95]"
          >
            <span className="text-white">{title.split(" ").slice(0, -1).join(" ")}</span>
            <br />
            <span className="text-gray-500">{title.split(" ").slice(-1)}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-gray-500 max-w-xl mx-auto mb-12 leading-relaxed font-light"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={onPrimaryClick}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-black font-semibold rounded-full transition-all duration-300 hover:bg-gray-200 hover:-translate-y-0.5"
            >
              {primaryCta}
            </button>
            <button
              onClick={onSecondaryClick}
              className="inline-flex items-center gap-2 px-8 py-3.5 text-gray-400 font-medium transition-all duration-300 hover:text-white"
            >
              {secondaryCta}
              <span className="text-lg">→</span>
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Subtle line accent */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent via-gray-700 to-transparent" />
    </section>
  );
}
