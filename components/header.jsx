"use client";

import React from "react";
import { Button } from "./ui/button";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useStoreUser } from "@/hooks/use-store-user";
import { BarLoader } from "react-spinners";
import { Authenticated, Unauthenticated } from "convex/react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const { isLoading } = useStoreUser();
  const path = usePathname();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md shadow-sm shadow-slate-900/5 supports-[backdrop-filter]:bg-white/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition">
          <Image
            src={"/logos/logo.png"}
            alt="Vehiql Logo"
            width={200}
            height={60}
            className="h-9 w-auto object-contain md:h-11"
          />
        </Link>

        {path === "/" && (
          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
            >
              How It Works
            </Link>
          </div>
        )}

        <div className="flex items-center gap-3 md:gap-4">
          <Authenticated>
            <Link href="/dashboard" className="flex items-center">
              <Button
                variant="outline"
                className="hidden md:inline-flex items-center gap-2 rounded-full border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm hover:border-emerald-500 hover:text-emerald-600 hover:shadow-md transition"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white p-0 text-slate-700 shadow-sm hover:border-emerald-500 hover:text-emerald-600 md:hidden"
              >
                <LayoutDashboard className="h-4 w-4" />
              </Button>
            </Link>

            <UserButton
              appearance={{
                elements: {
                  avatarBox:
                    "w-9 h-9 md:w-10 md:h-10 border border-slate-200 shadow-sm hover:shadow-md transition-shadow",
                  userButtonPopoverCard: "shadow-xl border border-slate-200",
                  userPreviewMainIdentifier: "font-semibold text-slate-800",
                },
              }}
              afterSignOutUrl="/"
            />
          </Authenticated>

          <Unauthenticated>
            <SignInButton>
              <Button
                variant="ghost"
                className="hidden text-sm font-medium text-slate-700 hover:text-emerald-600 md:inline-flex"
              >
                Sign In
              </Button>
            </SignInButton>

            <SignUpButton>
              <Button className="rounded-full bg-emerald-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-emerald-500 hover:shadow-md border-none">
                Get Started
              </Button>
            </SignUpButton>
          </Unauthenticated>
        </div>
      </nav>
      {isLoading && (
        <BarLoader
          width={"100%"}
          color="#10b981"
          className="!h-[2px] !bg-transparent"
        />
      )}
    </header>
  );
}
