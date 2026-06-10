"use client";

import { motion, type Variants, type Transition, type Easing } from "framer-motion";
import { type ReactNode } from "react";

/* ═══════════════════════════════════════════════════════════════
   SATURDAY ANIMATION SYSTEM — Framer Motion Components
   ═══════════════════════════════════════════════════════════════ */

// ─── TYPES ──────────────────────────────────────────────────────

interface AnimationProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  staggerChildren?: number;
}

interface ScrollAnimationProps extends AnimationProps {
  threshold?: number;
  once?: boolean;
}

// ─── TRANSITION PRESETS ─────────────────────────────────────────

export const transitions = {
  smooth: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as Easing },
  bouncy: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] as Easing },
  spring: { type: "spring" as const, stiffness: 300, damping: 30 },
  springBouncy: { type: "spring" as const, stiffness: 400, damping: 15 },
  springSoft: { type: "spring" as const, stiffness: 200, damping: 25 },
  fast: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as Easing },
  slow: { duration: 1.2, ease: [0.4, 0, 0.2, 1] as Easing },
  stagger: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as Easing },
};

// ─── VARIANT PRESETS ────────────────────────────────────────────

export const variants = {
  // Fade animations
  fadeUp: {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  },
  fadeDown: {
    hidden: { opacity: 0, y: -24 },
    visible: { opacity: 1, y: 0 },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: 24 },
    visible: { opacity: 1, x: 0 },
  },
  fadeRight: {
    hidden: { opacity: 0, x: -24 },
    visible: { opacity: 1, x: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },

  // Scale animations
  scaleUp: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  },
  scaleDown: {
    hidden: { opacity: 0, scale: 1.1 },
    visible: { opacity: 1, scale: 1 },
  },
  popIn: {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 },
  },

  // Slide animations
  slideUp: {
    hidden: { y: "100%" },
    visible: { y: 0 },
  },
  slideDown: {
    hidden: { y: "-100%" },
    visible: { y: 0 },
  },

  // Rotate animations
  rotateIn: {
    hidden: { opacity: 0, rotate: -10, scale: 0.9 },
    visible: { opacity: 1, rotate: 0, scale: 1 },
  },

  // Blur animations
  blurIn: {
    hidden: { opacity: 0, filter: "blur(10px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
  },

  // Flip animations
  flipX: {
    hidden: { opacity: 0, rotateX: 90 },
    visible: { opacity: 1, rotateX: 0 },
  },
  flipY: {
    hidden: { opacity: 0, rotateY: 90 },
    visible: { opacity: 1, rotateY: 0 },
  },
};

// ─── FADE UP ────────────────────────────────────────────────────

export function FadeUp({
  children,
  className,
  delay = 0,
  duration = 0.6,
}: AnimationProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={variants.fadeUp}
      transition={{ ...transitions.smooth, delay, duration }}
    >
      {children}
    </motion.div>
  );
}

// ─── FADE DOWN ──────────────────────────────────────────────────

export function FadeDown({
  children,
  className,
  delay = 0,
  duration = 0.6,
}: AnimationProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={variants.fadeDown}
      transition={{ ...transitions.smooth, delay, duration }}
    >
      {children}
    </motion.div>
  );
}

// ─── FADE LEFT ──────────────────────────────────────────────────

export function FadeLeft({
  children,
  className,
  delay = 0,
  duration = 0.6,
}: AnimationProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={variants.fadeLeft}
      transition={{ ...transitions.smooth, delay, duration }}
    >
      {children}
    </motion.div>
  );
}

// ─── FADE RIGHT ─────────────────────────────────────────────────

export function FadeRight({
  children,
  className,
  delay = 0,
  duration = 0.6,
}: AnimationProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={variants.fadeRight}
      transition={{ ...transitions.smooth, delay, duration }}
    >
      {children}
    </motion.div>
  );
}

// ─── SCALE UP ───────────────────────────────────────────────────

export function ScaleUp({
  children,
  className,
  delay = 0,
  duration = 0.5,
}: AnimationProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={variants.scaleUp}
      transition={{ ...transitions.bouncy, delay, duration }}
    >
      {children}
    </motion.div>
  );
}

// ─── POP IN ─────────────────────────────────────────────────────

export function PopIn({
  children,
  className,
  delay = 0,
}: AnimationProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={variants.popIn}
      transition={{ ...transitions.springBouncy, delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── BLUR IN ────────────────────────────────────────────────────

export function BlurIn({
  children,
  className,
  delay = 0,
  duration = 0.8,
}: AnimationProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={variants.blurIn}
      transition={{ ...transitions.smooth, delay, duration }}
    >
      {children}
    </motion.div>
  );
}

// ─── STAGGER CONTAINER ──────────────────────────────────────────

export function StaggerContainer({
  children,
  className,
  staggerChildren = 0.1,
}: AnimationProps) {
  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={container}
    >
      {children}
    </motion.div>
  );
}

// ─── STAGGER ITEM ───────────────────────────────────────────────

export function StaggerItem({
  children,
  className,
  variant = "fadeUp",
}: AnimationProps & { variant?: keyof typeof variants }) {
  return (
    <motion.div
      className={className}
      variants={variants[variant]}
      transition={transitions.stagger}
    >
      {children}
    </motion.div>
  );
}

// ─── HOVER SCALE ────────────────────────────────────────────────

export function HoverScale({
  children,
  className,
  scale = 1.03,
}: {
  children: ReactNode;
  className?: string;
  scale?: number;
}) {
  return (
    <motion.div
      className={className}
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={transitions.spring}
    >
      {children}
    </motion.div>
  );
}

// ─── HOVER LIFT ─────────────────────────────────────────────────

export function HoverLift({
  children,
  className,
  y = -4,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      whileHover={{ y }}
      transition={transitions.spring}
    >
      {children}
    </motion.div>
  );
}

// ─── HOVER GLOW ─────────────────────────────────────────────────

export function HoverGlow({
  children,
  className,
  color = "rgba(99, 102, 241, 0.3)",
}: {
  children: ReactNode;
  className?: string;
  color?: string;
}) {
  return (
    <motion.div
      className={className}
      whileHover={{
        boxShadow: `0 0 30px ${color}`,
        borderColor: color,
      }}
      transition={transitions.smooth}
    >
      {children}
    </motion.div>
  );
}

// ─── ROTATE IN ──────────────────────────────────────────────────

export function RotateIn({
  children,
  className,
  delay = 0,
}: AnimationProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={variants.rotateIn}
      transition={{ ...transitions.bouncy, delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── COUNTER ANIMATION ──────────────────────────────────────────

export function AnimatedCounter({
  value,
  className,
  duration = 1.5,
}: {
  value: number;
  className?: string;
  duration?: number;
}) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ ...transitions.smooth, duration }}
    >
      {value}
    </motion.span>
  );
}

// ─── PULSE GLOW ─────────────────────────────────────────────────

export function PulseGlow({
  children,
  className,
  color = "rgba(99, 102, 241, 0.4)",
}: {
  children: ReactNode;
  className?: string;
  color?: string;
}) {
  return (
    <motion.div
      className={className}
      animate={{
        boxShadow: [
          `0 0 0px ${color}`,
          `0 0 20px ${color}`,
          `0 0 0px ${color}`,
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── FLOAT ANIMATION ────────────────────────────────────────────

export function Float({
  children,
  className,
  y = 10,
  duration = 3,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  duration?: number;
}) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -y, 0] }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── MORPH BACKGROUND ───────────────────────────────────────────

export function MorphBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.3), transparent 70%)",
          top: "-200px",
          right: "-100px",
          filter: "blur(80px)",
        }}
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.3), transparent 70%)",
          bottom: "-150px",
          left: "-100px",
          filter: "blur(80px)",
        }}
        animate={{
          x: [0, -40, 30, 0],
          y: [0, 30, -20, 0],
          scale: [1, 0.95, 1.05, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, rgba(34, 211, 238, 0.3), transparent 70%)",
          top: "40%",
          left: "60%",
          filter: "blur(60px)",
        }}
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -20, 40, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

// ─── PAGE TRANSITION ────────────────────────────────────────────

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={transitions.smooth}
    >
      {children}
    </motion.div>
  );
}

// ─── LOADING SPINNER ────────────────────────────────────────────

export function LoadingSpinner({ size = 24 }: { size?: number }) {
  return (
    <motion.div
      style={{ width: size, height: size }}
      className="rounded-full border-2 border-white/15 border-t-white"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
    />
  );
}

// ─── SKELETON LOADER ────────────────────────────────────────────

export function SkeletonLoader({
  className = "",
  width = "100%",
  height = "20px",
}: {
  className?: string;
  width?: string;
  height?: string;
}) {
  return (
    <motion.div
      className={`rounded-lg ${className}`}
      style={{ width, height }}
      animate={{
        background: [
          "linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 75%)",
          "linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%)",
          "linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 75%)",
        ],
        backgroundPosition: ["200% 0", "-200% 0", "200% 0"],
      }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// ─── TEXT REVEAL ────────────────────────────────────────────────

export function TextReveal({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const words = text.split(" ");

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: delay },
    },
  };

  const child: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: transitions.smooth },
  };

  return (
    <motion.div className={className} variants={container} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      {words.map((word, i) => (
        <motion.span key={i} variants={child} className="inline-block mr-2">
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}

// ─── MAGNETIC BUTTON ────────────────────────────────────────────

export function MagneticButton({
  children,
  className,
  onClick,
  disabled,
  type = "button",
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <motion.button
      className={className}
      onClick={onClick}
      disabled={disabled}
      type={type}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={transitions.springBouncy}
    >
      {children}
    </motion.button>
  );
}

// ─── PARALLAX ───────────────────────────────────────────────────

export function Parallax({
  children,
  offset = 50,
  className,
}: {
  children: ReactNode;
  offset?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ y: 0 }}
      whileInView={{ y: [-offset / 2, 0] }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
