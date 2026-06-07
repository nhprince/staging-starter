"use client";

import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface FeaturesGridProps {
  title?: string;
  subtitle?: string;
  features?: Feature[];
  columns?: 2 | 3 | 4;
}

const defaultFeatures: Feature[] = [
  { icon: () => null, title: "Feature One", description: "Amazing feature description that explains the value proposition." },
  { icon: () => null, title: "Feature Two", description: "Amazing feature description that explains the value proposition." },
  { icon: () => null, title: "Feature Three", description: "Amazing feature description that explains the value proposition." },
  { icon: () => null, title: "Feature Four", description: "Amazing feature description that explains the value proposition." },
  { icon: () => null, title: "Feature Five", description: "Amazing feature description that explains the value proposition." },
  { icon: () => null, title: "Feature Six", description: "Amazing feature description that explains the value proposition." },
];

export function FeaturesGrid({
  title = "Why Choose Us",
  subtitle = "Everything you need to build modern web applications.",
  features = defaultFeatures,
  columns = 3,
}: FeaturesGridProps) {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">{title}</h2>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">{subtitle}</p>
      </motion.div>

      <div className={`grid ${gridCols[columns]} gap-6`}>
        {features.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group p-6 md:p-8 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/10 flex items-center justify-center mb-5 group-hover:border-indigo-500/30 transition-colors">
                <Icon className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
