"use client";

import React, { useContext } from "react";
import Link from "next/link";
import { UserDetailContext } from "@/app/context/userDetailContext";
import {
  ArrowRight,
  BarChart3,
  Code2,
  Gauge,
  Lock,
  Play,
  Shield,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";

const highlightStats = [
  {
    label: "Product Loop",
    value: "Design -> Preview -> Publish",
    note: "Aligned with the main website experience",
  },
  {
    label: "Runtime Focus",
    value: "Streaming + SDK-ready",
    note: "Built for testing and embedding agents fast",
  },
  {
    label: "Platform Readiness",
    value: "Auth + Billing Ready",
    note: "Matches the SaaS messaging used across the site",
  },
];

const workflowSteps = [
  {
    icon: Workflow,
    title: "Design Visual Flows",
    description:
      "Build agents with connected nodes so workflow logic stays understandable and editable.",
  },
  {
    icon: Play,
    title: "Preview in Real Time",
    description:
      "Test responses in streaming mode before publishing changes into production experiences.",
  },
  {
    icon: Code2,
    title: "Publish Anywhere",
    description:
      "Generate embed-friendly output so your hosted agent can be used across products quickly.",
  },
];

const platformCards = [
  {
    icon: Gauge,
    title: "Saved Workflows",
    description:
      "Keep workflow structure persistent so teams can iterate without rebuilding logic from scratch.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Execution",
    description:
      "Protect costly tools and keep runtime behavior controlled as agents become more capable.",
  },
  {
    icon: Lock,
    title: "Upgrade Path",
    description:
      "Support authenticated users, billing flows, and plan-based expansion from one dashboard.",
  },
];

const analyticsCards = [
  {
    icon: BarChart3,
    label: "Workflow Throughput",
    value: "128 runs",
    change: "+14%",
    tone: "text-emerald-600",
    description: "Recent flow executions across design, preview, and publish steps.",
  },
  {
    icon: Gauge,
    label: "Preview Success",
    value: "96.4%",
    change: "+3.2%",
    tone: "text-indigo-600",
    description: "Strong preview completion indicates stable configuration quality.",
  },
  {
    icon: Users,
    label: "Active Builders",
    value: "24 users",
    change: "+6",
    tone: "text-amber-600",
    description: "Collaboration momentum is growing around workflow-based agent creation.",
  },
  {
    icon: Shield,
    label: "Protected Actions",
    value: "91 checks",
    change: "Secure",
    tone: "text-zinc-700",
    description: "Sensitive actions are staying behind gated execution and plan controls.",
  },
];

function Data() {
  const { userDetails } = useContext(UserDetailContext);
  const userName = userDetails?.name || "Agentify User";
  const userEmail = userDetails?.email || "No email available";
  const userPlan = userDetails?.subscription || "Free";
  const userTokens =
    typeof userDetails?.token === "number" ? userDetails.token : 5000;
  const remainingCredits =
    typeof userDetails?.remainingCredits === "number"
      ? userDetails.remainingCredits
      : 0;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_30%),linear-gradient(180deg,_rgba(255,255,255,1)_0%,_rgba(244,244,245,1)_100%)] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-[0_24px_80px_-32px_rgba(79,70,229,0.28)]">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.5fr_1fr] lg:p-10">
            <div className="space-y-5">
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-indigo-700">
                <Sparkles className="h-3.5 w-3.5" />
                Website-aligned overview
              </span>

              <div className="space-y-3">
                <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl lg:text-5xl">
                  Agentify turns workflows into production-ready agents.
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base">
                  This page now reflects the website story: design flows with
                  nodes, preview them in streaming mode, and publish an
                  integration-ready agent experience from one dashboard.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-2xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
                >
                  Open Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/dashboard/pricing"
                  className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                >
                  View Pricing
                </Link>
              </div>
            </div>

            <div className="grid gap-3">
              {highlightStats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4"
                >
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-500">
                    {item.label}
                  </p>
                  <p className="mt-2 text-lg font-semibold tracking-tight text-zinc-950">
                    {item.value}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-zinc-600">
                    {item.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {workflowSteps.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="rounded-[1.75rem] border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 text-indigo-600">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-xl font-semibold tracking-tight text-zinc-950">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-zinc-600">
                {description}
              </p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
          <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-zinc-500">
                  Analytics Overview
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
                  Product analytics for agent usage and workflow health.
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-zinc-600">
                A quick snapshot of how the platform is performing across runs,
                previews, collaboration, and protected execution.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {analyticsCards.map(
                ({ icon: Icon, label, value, change, tone, description }) => (
                  <div
                    key={label}
                    className="rounded-[1.5rem] border border-zinc-200 bg-zinc-50 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-zinc-900 shadow-sm">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span
                        className={`rounded-full bg-white px-3 py-1 text-xs font-semibold ${tone}`}
                      >
                        {change}
                      </span>
                    </div>
                    <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-500">
                      {label}
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
                      {value}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                      {description}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-zinc-500">
              User Snapshot
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
              Current account details at a glance.
            </h2>

            <div className="mt-6 rounded-[1.75rem] border border-indigo-100 bg-[linear-gradient(180deg,_rgba(238,242,255,1)_0%,_rgba(255,255,255,1)_100%)] p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-950 text-lg font-semibold text-white">
                  {userName
                    .split(" ")
                    .map((part: string) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-zinc-950">
                    {userName}
                  </h3>
                  <p className="text-sm text-zinc-600">{userEmail}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white bg-white/80 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-500">
                    Plan
                  </p>
                  <p className="mt-2 text-lg font-semibold text-zinc-950">
                    {userPlan}
                  </p>
                </div>
                <div className="rounded-2xl border border-white bg-white/80 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-500">
                    Token Balance
                  </p>
                  <p className="mt-2 text-lg font-semibold text-zinc-950">
                    {userTokens.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-2xl border border-white bg-white/80 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-500">
                    Remaining Credits
                  </p>
                  <p className="mt-2 text-lg font-semibold text-zinc-950">
                    {remainingCredits}
                  </p>
                </div>
                <div className="rounded-2xl border border-white bg-white/80 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-500">
                    Workspace Status
                  </p>
                  <p className="mt-2 text-lg font-semibold text-zinc-950">
                    Active
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-sm leading-6 text-zinc-600">
                This panel uses the existing dashboard user context, so it can
                reflect the signed-in account without adding a new data-fetching
                layer to this page.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-zinc-500">
                Platform Signals
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
                The product data here should reinforce how Agentify works.
              </h2>
              <p className="mt-4 text-sm leading-7 text-zinc-600 sm:text-base">
                Instead of generic system metrics, this section highlights the
                same product strengths the website already communicates:
                workflow persistence, safe execution, and a clear path to
                customer-facing deployment.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {platformCards.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-[1.5rem] border border-zinc-200 bg-zinc-50 p-5"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-zinc-900 shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold tracking-tight text-zinc-950">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default Data;
