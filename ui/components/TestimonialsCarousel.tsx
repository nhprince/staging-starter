"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  company?: string;
  avatar?: string;
  content: string;
  rating?: number;
}

interface TestimonialsCarouselProps {
  title?: string;
  subtitle?: string;
  testimonials?: Testimonial[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const defaultTestimonials: Testimonial[] = [
  {
    name: "Sarah Johnson",
    role: "CTO",
    company: "TechCorp",
    content: "This framework completely transformed how we build products. The developer experience is unmatched.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Lead Developer",
    company: "StartupXYZ",
    content: "I've tried every framework out there. This one just works. Clean, fast, and incredibly intuitive.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Product Manager",
    company: "DesignStudio",
    content: "Our team shipped 3x faster after switching. The component library alone saved us months.",
    rating: 5,
  },
];

export function TestimonialsCarousel({
  title = "Loved by Developers",
  subtitle = "See what others are building with our platform.",
  testimonials = defaultTestimonials,
  autoPlay = true,
  autoPlayInterval = 5000,
}: TestimonialsCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (!autoPlay || testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [autoPlay, autoPlayInterval, testimonials.length]);

  const goTo = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const next = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  const t = testimonials[current];

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">{title}</h2>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">{subtitle}</p>
      </motion.div>

      <div className="relative max-w-3xl mx-auto">
        <div className="relative min-h-[280px] flex items-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center"
            >
              <div className="w-full p-8 md:p-12 rounded-3xl bg-white/[0.03] border border-white/[0.06] text-center">
                <Quote className="w-10 h-10 text-indigo-500/30 mx-auto mb-6" />
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8 italic">
                  &ldquo;{t.content}&rdquo;
                </p>
                {t.rating && (
                  <div className="flex items-center justify-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < (t.rating ?? 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-700"}`}
                      />
                    ))}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="text-sm text-gray-500">
                        {t.role}{t.company ? ` at ${t.company}` : ""}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === current ? "w-6 bg-indigo-500" : "bg-white/20 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={next}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>
      );
    }
