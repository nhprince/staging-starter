import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <div className="absolute inset-0 bg-mesh" />
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black gradient-text mb-2">Welcome Back</h1>
          <p className="text-[var(--text-secondary)]">Sign in to your account</p>
        </div>
        <div className="glass-card p-6">
          <SignIn
            appearance={{
              elements: {
                formButtonPrimary: "btn-primary w-full",
                card: "bg-transparent shadow-none",
                headerTitle: "text-[var(--text-primary)]",
                headerSubtitle: "text-[var(--text-secondary)]",
                socialButtonsBlockButton: "border-[var(--border-subtle)] text-[var(--text-primary)]",
                formFieldInput: "bg-white/5 border-[var(--border-subtle)] text-[var(--text-primary)]",
                footerActionLink: "text-[var(--accent-indigo)]",
              },
            }}
            redirectUrl="/dashboard"
            signUpUrl="/signup"
          />
        </div>
      </div>
    </div>
  );
}
