"use client";

import { useAuth } from "@clerk/nextjs";

export function SignInButton() {
  const { isLoaded, signIn } = useAuth();

  if (!isLoaded) return <button className="btn">Loading...</button>;

  return (
    <button
      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      onClick={() => signIn.open()}
    >
      Sign In
    </button>
  );
}
