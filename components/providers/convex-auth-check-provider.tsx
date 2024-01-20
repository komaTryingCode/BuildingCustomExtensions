"use client";

import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";

interface AuthCheckProviderProps {
  children: React.ReactNode;
}

export const AuthCheckProvider = ({ children }: AuthCheckProviderProps) => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    redirect("/");
  }

  return children;
};
