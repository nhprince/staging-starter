"use client";

import { useUser } from "@clerk/nextjs";
import { UserButton as ClerkUserButton } from "@clerk/nextjs";

export function UserButton() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse" />;

  if (!isSignedIn) return null;

  return (
    <ClerkUserButton
      appearance={{
        elements: {
          avatarBox: "w-8 h-8",
        },
      }}
    />
  );
}
