"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

interface PricingPlan {
  name: string;
  description: string;
  price: { monthly: number; yearly: number };
  features: string[];
  highlighted?: boolean;
  ctaText?: string;
}

interface PricingCardsProps {
  title?: string;
  subtitle?: string;
  plans?: PricingPlan[];
}

const defaultPlans: PricingPlan[] = [
  {
    name: "Starter",
    description: "Perfect for side projects and experiments.",
    price: { monthly: 0, yearly: 0 },
    features: [
      "Up to 3 projects",
      "Cloudflare free tier",
      "Community support",
      "Basic analytics",
      "1GB storage",
    ],
    ctaText: "Start Free",
  },
  {
    name: "Pro",
    description: "For serious developers and growing teams.",
    price: { monthly: 19, yearly: 190 },
    features: [
      "Unlimited projects",
      "Priority deployment",
      "Email support",
      "Advanced analytics",
      "10GB storage",
      "Custom domains",
      "Team collaboration",
    ],
    highlighted: true,
    ctaText: "Start Pro Trial",
  },
  {
    name: "Enterprise",
    description: "For organizations that need everything.",
    price: { monthly: 49, yearly: 490 },
    features: [
      "Everything in Pro",
      "Dedicated support",
      "SLA guarantee",
      "Unlimited storage",
      "SSO & SAML",
      "Audit logs",
      "Custom integrations",
    ],
    ctaText: "Contact Sales",
  },
];

export function PricingCards({
  title = "Simple, Transparent Pricing",
  subtitle = "No hidden fees. No surprises. Start free, scale when you&apos;re ready.",
  plans = defaultPlans,
}: PricingCardsProps) {
  const [yearly, setYearly] = useState(false);

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">{title}</h2>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">{subtitle}</p>

        {/* Toggle */}
        <div className="inline-flex items-center gap-3 p-1 bg-white/5 border border-white/10 rounded-full">
          <button
            onClick={() => setYearly(false)}
            className={`px-5 py-2 text-sm font-medium rounded-full transition-all ${
              !yearly ? "bg-white text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setYearly(true)}
            className={`px-5 py-2 text-sm font-medium rounded-full transition-all flex items-center gap-2 ${
              yearly ? "bg-white text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            Yearly
            <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full font-semibold">
              -17%
            </span>
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`relative p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
              plan.highlighted
                ? "bg-gradient-to-b from-indigo-500/10 to-purple-500/5 border-indigo-500/30 shadow-lg shadow-indigo-500/10"
                : "bg-white/[0.03] border-white/[0.06] hover:border-white/[0.12]"
            }`}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Most Popular
              </div>
            )}

            <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
            <p className="text-sm text-gray-500 mb-6">{plan.description}</p>

            <div className="mb-8">
              <span className="text-4xl font-black text-white">
                ${yearly ? plan.price.yearly : plan.price.monthly}
              </span>
              <span className="text-gray-500 text-sm">
                {plan.price.monthly > 0 ? (yearly ? "/year" : "/month") : " forever"}
              </span>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-gray-400">
                  <Check className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 ${
                plan.highlighted
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg hover:shadow-indigo-500/25"
                  : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
              }`}
            >
              {plan.ctaText}
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
