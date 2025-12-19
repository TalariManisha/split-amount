import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { FEATURES, STEPS, TESTIMONIALS } from "@/lib/landing";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      {/* ───── Hero ───── */}
      <section className="mt-20 pb-16 pt-10 px-5">
        <div className="container mx-auto max-w-6xl px-4 md:px-6 text-center space-y-8">
          <Badge
            variant="outline"
            className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300 backdrop-blur"
          >
            Split expenses. Simplify life.
          </Badge>

          <h1 className="mx-auto max-w-5xl text-balance bg-gradient-to-br from-emerald-400 via-emerald-300 to-cyan-400 bg-clip-text text-4xl font-semibold tracking-tight text-transparent md:text-6xl lg:text-7xl">
            The smartest way to split expenses with friends
          </h1>

          <p className="mx-auto max-w-2xl text-balance text-sm text-slate-300 md:text-base lg:text-lg">
            Track shared expenses, split bills effortlessly, and settle up
            quickly. Never worry about who owes who again.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row justify-center">
            <Button
              asChild
              size="lg"
              className="h-11 rounded-full bg-emerald-500 px-6 text-sm font-medium text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:bg-emerald-400"
            >
              <Link href="/dashboard">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-11 rounded-full border-emerald-400/60 bg-transparent px-6 text-sm font-medium text-emerald-200 hover:bg-emerald-500/10"
            >
              <Link href="#how-it-works">See How It Works</Link>
            </Button>
          </div>
        </div>

        <div className="container mx-auto mt-12 max-w-5xl px-4 md:px-6">
          <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-slate-900 via-slate-900/80 to-emerald-950/60 shadow-2xl shadow-emerald-500/25">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(52,211,153,0.22),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(45,212,191,0.18),_transparent_55%)]" />
            <div className="relative aspect-[16/9]">
              <Image
                src="/hero.png"
                width={1280}
                height={720}
                alt="Banner"
                className="h-full w-full rounded-2xl object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ───── Features ───── */}
      <section id="features" className="bg-slate-950/40 py-20">
        <div className="container mx-auto max-w-6xl px-4 md:px-6 text-center">
          <Badge
            variant="outline"
            className="border-emerald-500/30 bg-emerald-500/5 text-emerald-300"
          >
            Features
          </Badge>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
            Everything you need to split expenses
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-300 md:text-base">
            Our platform provides all the tools you need to handle shared
            expenses with ease.
          </p>

          <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ title, Icon, bg, color, description }) => (
              <Card
                key={title}
                className="flex h-full flex-col items-center space-y-4 border-slate-800 bg-slate-900/60 p-6 text-center shadow-md shadow-slate-950/40 backdrop-blur"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${bg} shadow-inner shadow-slate-900/60`}
                >
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>

                <h3 className="text-base font-semibold md:text-lg">{title}</h3>
                <p className="text-sm text-slate-300">{description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ───── How it works ───── */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto max-w-6xl px-4 md:px-6 text-center">
          <Badge
            variant="outline"
            className="border-emerald-500/30 bg-emerald-500/5 text-emerald-300"
          >
            How It Works
          </Badge>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
            Splitting expenses has never been easier
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-300 md:text-base">
            Follow these simple steps to start tracking and splitting expenses
            with friends.
          </p>

          <div className="mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-3">
            {STEPS.map(({ label, title, description }) => (
              <div
                key={label}
                className="flex flex-col items-center space-y-4 rounded-2xl border border-slate-800 bg-slate-900/50 px-6 py-8 shadow-sm shadow-slate-900/40"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-base font-semibold text-emerald-300 shadow-inner shadow-slate-900/70">
                  {label}
                </div>
                <h3 className="text-base font-semibold md:text-lg">{title}</h3>
                <p className="text-sm text-slate-300 text-center">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Testimonials ───── */}
      <section className="bg-slate-950/40 py-20">
        <div className="container mx-auto max-w-6xl px-4 md:px-6 text-center">
          <Badge
            variant="outline"
            className="border-emerald-500/30 bg-emerald-500/5 text-emerald-300"
          >
            Testimonials
          </Badge>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
            What our users are saying
          </h2>

          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map(({ quote, name, role, image }) => (
              <Card
                key={name}
                className="flex h-full flex-col justify-between border-slate-800 bg-slate-900/60 shadow-md shadow-slate-950/40 backdrop-blur"
              >
                <CardContent className="space-y-4 p-6">
                  <p className="text-sm text-slate-200 italic leading-relaxed">
                    “{quote}”
                  </p>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-9 w-9 border border-slate-700">
                      <AvatarImage src={image} alt={name} />
                      <AvatarFallback className="bg-slate-800 text-xs font-semibold uppercase text-slate-100">
                        {name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="text-sm font-medium text-slate-50">
                        {name}
                      </p>
                      <p className="text-xs text-slate-400">{role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Call‑to‑Action ───── */}
      <section className="py-20">
        <div className="container mx-auto max-w-4xl px-4 md:px-6 text-center space-y-6 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-600 via-emerald-500 to-cyan-500 py-14 shadow-2xl shadow-emerald-500/40">
          <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl lg:text-4xl text-slate-950">
            Ready to simplify expense sharing?
          </h2>
          <p className="mx-auto max-w-xl text-sm text-emerald-950/80 md:text-base">
            Join thousands of users who have made splitting expenses
            stress‑free.
          </p>
          <Button
            asChild
            size="lg"
            className="h-11 rounded-full bg-slate-950 px-6 text-sm font-medium text-emerald-300 shadow-lg shadow-slate-950/50 transition hover:-translate-y-0.5 hover:bg-slate-900"
          >
            <Link href="/dashboard">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ───── Footer ───── */}
      <footer className="border-t border-slate-800 bg-slate-950/80 py-8 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Splitr. All rights reserved.
      </footer>
    </div>
  );
}
