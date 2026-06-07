"use client";

import { useAuth } from "@clerk/nextjs";

export function SignUpButton() {
  const { isLoaded, signUp } = useAuth();

  if (!isLoaded) return <button className="btn">Loading...</button>;

  return (
    <button
      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      onClick={() => signUp.open()}
    >
      Sign Up
    </button>
  );
}
