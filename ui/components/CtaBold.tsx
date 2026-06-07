"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";

interface CtaBoldProps {
  title?: string;
  subtitle?: string;
  primaryCta?: string;
  secondaryCta?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

export function CtaBold({
  title = "Ready to Build Something Amazing?",
  subtitle = "Join thousands of developers who are already building the future. Start for free, no credit card required.",
  primaryCta = "Get Started Free",
  secondaryCta = "View Documentation",
  onPrimaryClick,
  onSecondaryClick,
}: CtaBoldProps) {
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-purple-600/20 to-cyan-600/10" />
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0 border border-white/[0.08] rounded-3xl" />

        <div className="relative z-10 px-8 py-16 md:px-16 md:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/10 rounded-full mb-8"
          >
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-300">100% Free Forever</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-5xl lg:text-6xl font-black mb-6 text-white leading-tight"
          >
            {title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={onPrimaryClick}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-white/10 hover:-translate-y-1"
            >
              {primaryCta}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={onSecondaryClick}
              className="inline-flex items-center gap-2 px-8 py-4 text-gray-300 font-medium transition-all duration-300 hover:text-white"
            >
              {secondaryCta}
              <span className="text-lg">→</span>
            </button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
