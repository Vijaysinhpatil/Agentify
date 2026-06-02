"use client";

import React, { useContext } from "react";
import Link from "next/link";
import { UserDetailContext } from "@/app/context/userDetailContext";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import {
  BadgeCheck,
  CreditCard,
  Mail,
  Settings,
  Shield,
  Sparkles,
  UserCircle2,
} from "lucide-react";

const quickActions = [
  {
    title: "Manage plan",
    description: "Review pricing and upgrade options for more agent capacity.",
    href: "/dashboard/pricing",
    icon: CreditCard,
  },
  {
    title: "Open workspace",
    description: "Jump back into your dashboard and continue building agents.",
    href: "/dashboard",
    icon: Sparkles,
  },
  {
    title: "View agents",
    description: "See the agents you have already created and keep them organized.",
    href: "/dashboard/my-agents",
    icon: Settings,
  },
];

function ProfilePage() {
  const { userDetails } = useContext(UserDetailContext);
  const liveUser = useQuery(
    api.user.getUserById,
    userDetails?._id ? { userId: userDetails._id } : "skip"
  );
  const profile = liveUser ?? userDetails;

  const userName = profile?.name || "Agentify User";
  const userEmail = profile?.email || "No email available";
  const userPlan = profile?.subscription || "Free";
  const userTokens =
    typeof profile?.token === "number" ? profile.token : 5000;
  const remainingCredits =
    typeof profile?.remainingCredits === "number"
      ? profile.remainingCredits
      : 0;
  const initials = userName
    .split(" ")
    .map((part: string) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.16),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.14),_transparent_26%),linear-gradient(180deg,_#fffef8_0%,_#ffffff_46%,_#f8fafc_100%)] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="overflow-hidden rounded-[2rem] border border-amber-100/70 bg-white/90 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.18)] backdrop-blur-sm">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.4fr_0.9fr] lg:p-10">
            <div className="space-y-5">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-amber-700">
                <UserCircle2 className="h-3.5 w-3.5" />
                Profile overview
              </span>

              <div className="space-y-3">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                  Your Agentify profile, account status, and workspace details.
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                  Keep a quick view of your plan, credits, and signed-in
                  account details while staying one click away from your agents
                  and billing settings.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/dashboard/my-agents"
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  View My Agents
                </Link>
                <Link
                  href="/dashboard/pricing"
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Manage Subscription
                </Link>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(180deg,_rgba(248,250,252,1)_0%,_rgba(255,255,255,1)_100%)] p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-[1.4rem] bg-slate-950 text-xl font-semibold text-white shadow-sm">
                  {initials}
                </div>
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                    {userName}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">{userEmail}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
                    Current plan
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">
                    {userPlan}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
                    Remaining credits
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">
                    {remainingCredits}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                <BadgeCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
                  Account details
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                  Personal and workspace summary
                </h2>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-sm">
                  <UserCircle2 className="h-5 w-5" />
                </div>
                <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
                  Full name
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-950">
                  {userName}
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-sm">
                  <Mail className="h-5 w-5" />
                </div>
                <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
                  Email address
                </p>
                <p className="mt-2 break-all text-lg font-semibold text-slate-950">
                  {userEmail}
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-sm">
                  <CreditCard className="h-5 w-5" />
                </div>
                <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
                  Token balance
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-950">
                  {userTokens.toLocaleString()}
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-sm">
                  <Shield className="h-5 w-5" />
                </div>
                <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
                  Workspace status
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-950">
                  Active
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
              Quick actions
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Useful next steps from your profile
            </h2>

            <div className="mt-6 space-y-4">
              {quickActions.map(({ title, description, href, icon: Icon }) => (
                <Link
                  key={title}
                  href={href}
                  className="group block rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:border-amber-200 hover:bg-amber-50/60"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-sm transition group-hover:text-amber-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-950">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {description}
                  </p>
                </Link>
              ))}
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-amber-100 bg-amber-50/70 p-4">
              <p className="text-sm leading-6 text-amber-900">
                Token balance now subscribes to the live Convex user record, so
                profile values update as backend data changes.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default ProfilePage;
