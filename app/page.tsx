"use client";

import Link from "next/link";
import { useConvexAuth } from "convex/react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { SignInButton } from "@clerk/clerk-react";
import { LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";


export default function Home() {

  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <section className="container max-w-6xl mx-auto py-24 flex items-center space-x-10">
      <h1 className="text-3xl font-bold antialiased tracking-tight">
        Please, sign in:
      </h1>
      <div className="flex items-center space-x-2">
      {/* if the app is in a loading state */}

      {isLoading && (
        <>
          <Button size={"sm"} disabled>
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            Please, wait...
          </Button>
        </>
      )}

      {/* user not authenticated yet */}

      {!isAuthenticated && !isLoading && (
        <>
          <SignInButton mode="modal">
            <Button variant={"default"} size={"sm"} className={cn("px-8")}>
              <p className="text-sm">Get Started</p>
            </Button>
          </SignInButton>
        </>
      )}

      {/* if user is authenticated and not loading, enter dashboard */}

      {isAuthenticated && !isLoading && (
        <>
          <Button
            asChild
            size={"sm"}
            className="bg-[#0000ff] dark:bg-[#ebfb6b]"
          >
            <Link href="/navigation">
              <p className="text-sm">
                Enter Members Area
              </p>
              <LogIn className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </>
      )}
    </div>
    </section>
  );
}
