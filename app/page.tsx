"use client";

import * as React from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Cpu,
  Layers,
  ShieldCheck,
  Sparkles,
  Zap,
  Workflow,
  Code2,
  Play,
  Plug,
  Lock,
  Gauge,
} from "lucide-react";

/**
 * Agentify Landing Page (Home)
 * - App Router: place in app/page.tsx
 * - Assumes Tailwind + shadcn/ui Button + Clerk UserButton are configured
 *
 * Notes:
 * - Kept UI minimal, confident, product-led.
 * - Copy is aligned with your agent builder: drag/drop, preview, publish SDK.
 */

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-indigo-100 selection:text-indigo-900">
      <BackgroundDecor />

      {/* Nav */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-zinc-100 bg-white/75 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-lg bg-zinc-950 p-1.5 shadow-sm">
              <Zap className="size-5 text-white fill-white" />
            </div>
            <span className="text-xl font-black tracking-tight">Agentify</span>
          </Link>

          <div className="flex items-center gap-3">
            <NavLink href="/dashboard">Dashboard</NavLink>
            <NavLink href="/dashboard/agents">Agents</NavLink>
            <NavLink href="/dashboard/pricing">Pricing</NavLink>

            <div className="ml-2 flex items-center">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox:
                      "size-8 rounded-lg border border-zinc-200 shadow-sm",
                  },
                }}
              />
            </div>
          </div>
        </nav>
      </header>

      {/* Main */}
      <main className="px-6 pt-32 pb-20">
        <div className="mx-auto max-w-6xl">
          {/* Hero */}
          <section className="relative">
            <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
                </span>
                Drag • Build • Preview • Publish
              </div>

              <h1 className="mt-8 text-5xl font-black tracking-tighter text-zinc-900 md:text-7xl md:leading-[0.92]">
                Build AI agents like workflows.
                <br />
                <span className="text-indigo-600">Ship them like products.</span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-zinc-500 md:text-xl">
                Agentify is a full-stack agent builder where you can design
                flows with nodes, test in streaming preview, and publish an SDK
                snippet to embed your agent anywhere.
              </p>

              <div className="mt-10 flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center">
                <Button
                  asChild
                  className="h-12 rounded-2xl bg-zinc-900 px-7 text-base font-bold text-white shadow-xl shadow-zinc-200 transition-transform hover:bg-zinc-800 hover:scale-[1.01] active:scale-[0.98] border-t border-white/10"
                >
                  <Link href="/dashboard">
                    Go to Console <ArrowRight className="ml-2 size-5" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-2xl border-zinc-200 px-7 text-base font-semibold hover:bg-zinc-50"
                >
                  <Link href="/dashboard/agents">
                    Explore Agents <Workflow className="ml-2 size-5" />
                  </Link>
                </Button>
              </div>

              {/* "Product proof" strip */}
              <div className="mt-14 grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
                <ProofPill
                  icon={<Play className="size-4" />}
                  title="Streaming preview"
                  desc="Test the flow before publishing."
                />
                <ProofPill
                  icon={<Code2 className="size-4" />}
                  title="Publishable SDK"
                  desc="Copy snippet, embed anywhere."
                />
                <ProofPill
                  icon={<Gauge className="size-4" />}
                  title="Saved workflows"
                  desc="Nodes + edges persisted to DB."
                />
              </div>
            </div>
          </section>

          {/* How it works */}
          <section className="mt-20">
            <SectionHeader
              kicker="How it works"
              title="A simple loop: design → test → deploy"
              subtitle="Agentify keeps the workflow visual, the runtime reliable, and the integration developer-friendly."
            />

            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
              <HowCard
                step="01"
                icon={<Layers className="size-5 text-indigo-600" />}
                title="Design"
                desc="Drag nodes like Start, Agent, API and End. Connect edges and set per-node configs."
                bullets={[
                  "Custom nodes + settings panel",
                  "Reusable patterns (templates later)",
                  "Clear, visual flow",
                ]}
              />
              <HowCard
                step="02"
                icon={<Sparkles className="size-5 text-indigo-600" />}
                title="Preview"
                desc="Reboot the agent to generate runtime config and chat in streaming mode."
                bullets={[
                  "Read-only flow preview",
                  "Streaming responses",
                  "Tool execution (API node)",
                ]}
              />
              <HowCard
                step="03"
                icon={<Plug className="size-5 text-indigo-600" />}
                title="Publish"
                desc="Generate a ready-to-use snippet that calls your hosted agent endpoint."
                bullets={[
                  "Agent ID based execution",
                  "Conversation continuity",
                  "Embed in any app",
                ]}
              />
            </div>

            {/* Node chips (tiny detail that makes it feel “product”, not “demo”) */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              <NodeChip label="Start" tone="zinc" />
              <NodeChip label="Agent (LLM)" tone="indigo" />
              <NodeChip label="API Tool" tone="emerald" />
              <NodeChip label="End" tone="zinc" />
              <span className="mx-2 hidden text-sm font-semibold text-zinc-300 md:inline">
                →
              </span>
              <NodeChip label="If / Else" tone="amber" />
              <NodeChip label="While" tone="amber" />
              <NodeChip label="User Approval" tone="amber" />
            </div>
          </section>

          {/* Features */}
          <section className="mt-24">
            <SectionHeader
              kicker="Built for shipping"
              title="Everything you need for real agents"
              subtitle="A clean builder is only the start—execution, safety and deployability are what matter."
            />

            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
              <FeatureCard
                icon={<Cpu className="size-6 text-indigo-600" />}
                title="LLM orchestration"
                desc="Per-node instructions, model selection, optional JSON output contracts, and streaming responses."
              />
              <FeatureCard
                icon={<ShieldCheck className="size-6 text-indigo-600" />}
                title="Secure execution"
                desc="Rate limit and protect costly endpoints. Keep agent runtime isolated and controlled."
              />
              <FeatureCard
                icon={<Lock className="size-6 text-indigo-600" />}
                title="Auth + billing ready"
                desc="Clerk-based auth, profiles, and upgrade paths built for SaaS from day one."
              />
            </div>
          </section>

          {/* CTA */}
          <section className="mt-24">
            <div className="rounded-[2.25rem] border border-zinc-200 bg-white p-8 shadow-[0_25px_80px_-35px_rgba(79,70,229,0.22)] md:p-12">
              <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-indigo-700">
                    <Sparkles className="size-3.5" />
                    Build your first agent today
                  </div>
                  <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">
                    Turn workflows into agents, fast.
                  </h2>
                  <p className="mt-3 max-w-xl text-sm font-medium leading-relaxed text-zinc-500 md:text-base">
                    Start from scratch, test in preview, then publish a snippet
                    to integrate your agent in your product—without rewriting
                    the logic.
                  </p>
                </div>

                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                  <Button
                    asChild
                    className="h-12 rounded-2xl bg-zinc-900 px-7 text-base font-bold text-white hover:bg-zinc-800"
                  >
                    <Link href="/dashboard">
                      Open Console <ArrowRight className="ml-2 size-5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-12 rounded-2xl border-zinc-200 px-7 text-base font-semibold hover:bg-zinc-50"
                  >
                    <Link href="/dashboard/pricing">See Pricing</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-20 border-t border-zinc-100 py-10">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-zinc-950 p-1.5 shadow-sm">
                  <Zap className="size-4 text-white fill-white" />
                </div>
                <span className="text-sm font-black tracking-tight">
                  Agentify
                </span>
                <span className="text-xs font-semibold text-zinc-400">
                  &copy; {new Date().getFullYear()}
                </span>
              </div>

              <div className="flex items-center gap-5 text-sm font-semibold text-zinc-500">
                <Link
                  href="/dashboard"
                  className="hover:text-zinc-900 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/agents"
                  className="hover:text-zinc-900 transition-colors"
                >
                  Agents
                </Link>
                <Link
                  href="/dashboard/pricing"
                  className="hover:text-zinc-900 transition-colors"
                >
                  Pricing
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}

/* ------------------------------ Components ------------------------------ */

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl px-3 py-2 text-sm font-semibold text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
    >
      {children}
    </Link>
  );
}

function SectionHeader({
  kicker,
  title,
  subtitle,
}: {
  kicker: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-400">
        {kicker}
      </p>
      <h2 className="mt-3 text-3xl font-black tracking-tight text-zinc-900 md:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-sm font-medium leading-relaxed text-zinc-500 md:text-base">
        {subtitle}
      </p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="group rounded-[2rem] border border-zinc-200/60 bg-white p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.04)] transition-all hover:shadow-xl hover:shadow-indigo-500/5">
      <div className="mb-6 flex size-12 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-bold tracking-tight text-zinc-900">
        {title}
      </h3>
      <p className="text-sm font-medium leading-relaxed text-zinc-500">
        {desc}
      </p>
    </div>
  );
}

function ProofPill({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex size-8 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900">
          {icon}
        </div>
        <div className="text-left">
          <p className="text-sm font-bold text-zinc-900">{title}</p>
          <p className="text-xs font-medium leading-relaxed text-zinc-500">
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
}

function HowCard({
  step,
  icon,
  title,
  desc,
  bullets,
}: {
  step: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  bullets: string[];
}) {
  return (
    <div className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-black text-zinc-700">
          <span className="text-zinc-400">{step}</span>
          <span className="h-4 w-px bg-zinc-200" />
          <span className="inline-flex items-center gap-2">
            {icon}
            {title}
          </span>
        </div>
      </div>

      <p className="mt-4 text-sm font-medium leading-relaxed text-zinc-500">
        {desc}
      </p>

      <ul className="mt-5 space-y-2 text-sm font-semibold text-zinc-700">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <span className="mt-1.5 size-1.5 rounded-full bg-indigo-600" />
            <span className="leading-relaxed">{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NodeChip({
  label,
  tone,
}: {
  label: string;
  tone: "zinc" | "indigo" | "emerald" | "amber";
}) {
  const toneClass =
    tone === "zinc"
      ? "border-zinc-200 bg-zinc-50 text-zinc-700"
      : tone === "indigo"
      ? "border-indigo-200 bg-indigo-50 text-indigo-800"
      : tone === "emerald"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-amber-200 bg-amber-50 text-amber-800";

  const dotClass =
    tone === "zinc"
      ? "bg-zinc-400"
      : tone === "indigo"
      ? "bg-indigo-500"
      : tone === "emerald"
      ? "bg-emerald-500"
      : "bg-amber-500";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-1 text-xs font-black tracking-tight ${toneClass}`}
    >
      <span className={`size-2 rounded-full ${dotClass}`} />
      {label}
    </span>
  );
}

function BackgroundDecor() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      {/* Soft radial blobs */}
      <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-indigo-200/35 blur-3xl" />
      <div className="absolute top-40 right-[-120px] h-[420px] w-[420px] rounded-full bg-zinc-200/40 blur-3xl" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(24,24,27,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(24,24,27,0.06) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse at top, black 45%, transparent 72%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at top, black 45%, transparent 72%)",
        }}
      />
    </div>
  );
}