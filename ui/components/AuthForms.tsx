"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, Github, Chrome } from "lucide-react";

interface AuthFormsProps {
  mode?: "login" | "register" | "toggle";
  onSubmit?: (data: { email: string; password: string; name?: string }) => void;
  onSocialAuth?: (provider: "github" | "google") => void;
}

export function AuthForms({
  mode: initialMode = "toggle",
  onSubmit,
  onSocialAuth,
}: AuthFormsProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode === "toggle" ? "login" : initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (mode === "register" && !form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 8) errs.password = "Minimum 8 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit?.(form);
  };

  const switchMode = () => {
    setMode((m) => (m === "login" ? "register" : "login"));
    setErrors({});
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {mode === "login" ? "Welcome back" : "Create account"}
          </h1>
          <p className="text-gray-500">
            {mode === "login"
              ? "Sign in to your account to continue"
              : "Get started with your free account"}
          </p>
        </div>

        {/* Social auth */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => onSocialAuth?.("github")}
            className="flex items-center justify-center gap-2 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-all"
          >
            <Github className="w-4 h-4" />
            GitHub
          </button>
          <button
            onClick={() => onSocialAuth?.("google")}
            className="flex items-center justify-center gap-2 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-all"
          >
            <Chrome className="w-4 h-4" />
            Google
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-gray-600 uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {mode === "register" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <label className="block text-sm text-gray-400 mb-1.5">Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none transition-colors ${
                      errors.name ? "border-red-500/50" : "border-white/10 focus:border-indigo-500/50"
                    }`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none transition-colors ${
                  errors.email ? "border-red-500/50" : "border-white/10 focus:border-indigo-500/50"
                }`}
                placeholder="you@example.com"
              />
            </div>
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={`w-full pl-10 pr-10 py-2.5 bg-white/5 border rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none transition-colors ${
                  errors.password ? "border-red-500/50" : "border-white/10 focus:border-indigo-500/50"
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
          </div>

          {mode === "login" && (
            <div className="flex justify-end">
              <button type="button" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5"
          >
            {mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        {/* Switch mode */}
        <p className="text-center text-sm text-gray-500 mt-6">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={switchMode}
            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
