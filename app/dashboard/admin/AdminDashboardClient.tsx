"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import type { ComponentType } from "react";
import {
  ArrowUpRight,
  Bot,
  CreditCard,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function AdminDashboardClient() {
  const overview = useQuery(api.admin.getAdminOverview, {});

  if (overview === undefined) {
    return <AdminPageSkeleton />;
  }

  const { stats, recentUsers, recentAgents, recentPayments, recentConversations } =
    overview;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(253,224,71,0.2),_transparent_22%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_45%,#ffffff_100%)] px-6 py-8 md:px-8 xl:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="overflow-hidden rounded-[32px] border border-white/70 bg-[linear-gradient(135deg,rgba(17,24,39,0.98),rgba(37,99,235,0.9),rgba(245,158,11,0.85))] p-8 text-white shadow-[0_20px_70px_rgba(15,23,42,0.18)]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <Badge className="w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-white hover:bg-white/10">
                <ShieldCheck className="mr-2 h-3.5 w-3.5" />
                Admin Console
              </Badge>
              <div className="space-y-3">
                <h1 className="font-serif text-4xl tracking-tight md:text-5xl">
                  Operate your full Agentify system from one surface.
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-white/78 md:text-base">
                  Track customer growth, monitor agent publishing, and review
                  payment activity without jumping between tools.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <HeroMetric
                label="Revenue tracked"
                value={currencyFormatter.format(stats.totalRevenue)}
              />
              <HeroMetric
                label="Published agents"
                value={`${stats.publishedAgents} / ${stats.totalAgents}`}
              />
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Users"
            value={stats.totalUsers.toString()}
            caption={`${stats.activeSubscribers} active subscriptions`}
            icon={Users}
            tone="sky"
          />
          <StatCard
            title="Agents"
            value={stats.totalAgents.toString()}
            caption={`${stats.publishedAgents} published live`}
            icon={Bot}
            tone="amber"
          />
          <StatCard
            title="Payments"
            value={stats.totalPayments.toString()}
            caption={currencyFormatter.format(stats.totalRevenue)}
            icon={CreditCard}
            tone="emerald"
          />
          <StatCard
            title="Conversations"
            value={stats.totalConversations.toString()}
            caption="Recent activity tracked"
            icon={MessageSquareText}
            tone="violet"
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <Card className="rounded-[28px] border border-zinc-200/70 bg-white/90 py-0 shadow-[0_20px_45px_rgba(15,23,42,0.06)]">
            <CardHeader className="border-b border-zinc-100 px-6 py-5">
              <CardTitle className="text-xl text-zinc-900">
                Recent Users
              </CardTitle>
              <CardDescription>
                The newest customers and their current balances.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-100">
                    <TableHead className="px-6">User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Tokens</TableHead>
                    <TableHead className="pr-6 text-right">Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.length === 0 ? (
                    <EmptyTableRow
                      colSpan={4}
                      message="No users yet. New signups will appear here."
                    />
                  ) : (
                    recentUsers.map((user) => (
                      <TableRow key={user._id} className="border-zinc-100">
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar size="lg" className="border border-zinc-200">
                              <AvatarImage src={user.imageUrl} alt={user.name} />
                              <AvatarFallback>
                                {getInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-zinc-900">
                                {user.name}
                              </p>
                              <p className="truncate text-sm text-zinc-500">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge
                            value={user.subscription ?? "free"}
                            variant={user.subscription ? "success" : "neutral"}
                          />
                        </TableCell>
                        <TableCell className="font-medium text-zinc-700">
                          {user.token.toLocaleString()}
                        </TableCell>
                        <TableCell className="pr-6 text-right text-sm text-zinc-500">
                          {formatDate(user._creationTime)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid gap-6">
            <Card className="rounded-[28px] border border-zinc-200/70 bg-white/90 py-0 shadow-[0_20px_45px_rgba(15,23,42,0.06)]">
              <CardHeader className="border-b border-zinc-100 px-6 py-5">
                <CardTitle className="text-xl text-zinc-900">
                  Recent Agents
                </CardTitle>
                <CardDescription>
                  Monitor who owns what and what is already live.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-6 py-5">
                {recentAgents.length === 0 ? (
                  <EmptyPanel message="No agents created yet." />
                ) : (
                  recentAgents.slice(0, 5).map((agent) => (
                    <div
                      key={agent._id}
                      className="flex items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50/80 px-4 py-3"
                    >
                      <div className="space-y-1">
                        <p className="font-semibold text-zinc-900">{agent.name}</p>
                        <p className="text-sm text-zinc-500">
                          {agent.ownerName} · {agent.ownerEmail}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <StatusBadge
                          value={agent.published ? "published" : "draft"}
                          variant={agent.published ? "success" : "warning"}
                        />
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                        >
                          <Link href={`/agent-builder/${agent.agentId}`}>
                            Open
                            <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="rounded-[28px] border border-zinc-200/70 bg-white/90 py-0 shadow-[0_20px_45px_rgba(15,23,42,0.06)]">
              <CardHeader className="border-b border-zinc-100 px-6 py-5">
                <CardTitle className="text-xl text-zinc-900">
                  Conversation Feed
                </CardTitle>
                <CardDescription>
                  Recent user-to-agent sessions across the workspace.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-6 py-5">
                {recentConversations.length === 0 ? (
                  <EmptyPanel message="No conversations have been created yet." />
                ) : (
                  recentConversations.slice(0, 5).map((conversation) => (
                    <div
                      key={conversation._id}
                      className="rounded-2xl border border-zinc-100 bg-white px-4 py-3 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-medium text-zinc-900">
                            {conversation.userName}
                          </p>
                          <p className="text-sm text-zinc-500">
                            chatted with {conversation.agentName}
                          </p>
                        </div>
                        <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
                          {formatDate(conversation._creationTime)}
                        </p>
                      </div>
                      <p className="mt-2 truncate text-xs text-zinc-400">
                        {conversation.conversationId}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        <Card className="rounded-[28px] border border-zinc-200/70 bg-white/90 py-0 shadow-[0_20px_45px_rgba(15,23,42,0.06)]">
          <CardHeader className="border-b border-zinc-100 px-6 py-5">
            <CardTitle className="text-xl text-zinc-900">
              Payment History
            </CardTitle>
            <CardDescription>
              Review billing records and identify failed or pending payments
              fast.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-100">
                  <TableHead className="px-6">Customer</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="pr-6 text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPayments.length === 0 ? (
                  <EmptyTableRow
                    colSpan={7}
                    message="No payment records yet. Use api.admin.recordPaymentHistory to start populating this table."
                  />
                ) : (
                  recentPayments.map((payment) => (
                    <TableRow key={payment._id} className="border-zinc-100">
                      <TableCell className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="font-semibold text-zinc-900">
                            {payment.userName}
                          </p>
                          <p className="text-sm text-zinc-500">
                            {payment.userEmail}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium text-zinc-800">
                            {payment.planName}
                          </p>
                          <p className="text-xs text-zinc-400">
                            {payment.agentName ?? "General account billing"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          value={payment.status}
                          variant={getPaymentVariant(payment.status)}
                        />
                      </TableCell>
                      <TableCell className="font-medium capitalize text-zinc-700">
                        {payment.provider}
                      </TableCell>
                      <TableCell className="max-w-[170px] truncate text-zinc-500">
                        {payment.referenceId}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-zinc-900">
                        {formatCurrency(payment.amount, payment.currency)}
                      </TableCell>
                      <TableCell className="pr-6 text-right text-sm text-zinc-500">
                        {formatDate(payment._creationTime)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  caption,
  icon: Icon,
  tone,
}: {
  title: string;
  value: string;
  caption: string;
  icon: ComponentType<{ className?: string }>;
  tone: "sky" | "amber" | "emerald" | "violet";
}) {
  const tones = {
    sky: "from-sky-100 via-white to-sky-50 text-sky-700 ring-sky-100",
    amber: "from-amber-100 via-white to-orange-50 text-amber-700 ring-amber-100",
    emerald:
      "from-emerald-100 via-white to-emerald-50 text-emerald-700 ring-emerald-100",
    violet:
      "from-violet-100 via-white to-fuchsia-50 text-violet-700 ring-violet-100",
  } as const;

  return (
    <Card
      className={`rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.92))] py-0 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ${tones[tone]}`}
    >
      <CardContent className="flex items-start justify-between px-6 py-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-zinc-500">{title}</p>
          <p className="text-3xl font-semibold tracking-tight text-zinc-950">
            {value}
          </p>
          <p className="text-sm text-zinc-500">{caption}</p>
        </div>

        <div className="rounded-2xl border border-white/80 bg-white/90 p-3 shadow-sm">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

function HeroMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-md">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function StatusBadge({
  value,
  variant,
}: {
  value: string;
  variant: "success" | "warning" | "neutral" | "danger";
}) {
  const styles = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    neutral: "bg-zinc-100 text-zinc-700 border-zinc-200",
    danger: "bg-rose-50 text-rose-700 border-rose-200",
  } as const;

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${styles[variant]}`}
    >
      {value}
    </span>
  );
}

function EmptyPanel({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/70 px-4 py-6 text-center">
      <Sparkles className="mx-auto h-5 w-5 text-zinc-400" />
      <p className="mt-3 text-sm text-zinc-500">{message}</p>
    </div>
  );
}

function EmptyTableRow({
  colSpan,
  message,
}: {
  colSpan: number;
  message: string;
}) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="px-6 py-10 text-center">
        <div className="mx-auto flex max-w-md flex-col items-center gap-3 text-zinc-500">
          <Sparkles className="h-5 w-5 text-zinc-400" />
          <p className="text-sm">{message}</p>
        </div>
      </TableCell>
    </TableRow>
  );
}

function AdminPageSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8 md:px-8 xl:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="h-56 animate-pulse rounded-[32px] bg-slate-200" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-36 animate-pulse rounded-[28px] bg-slate-200"
            />
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="h-[420px] animate-pulse rounded-[28px] bg-slate-200" />
          <div className="grid gap-6">
            <div className="h-[220px] animate-pulse rounded-[28px] bg-slate-200" />
            <div className="h-[220px] animate-pulse rounded-[28px] bg-slate-200" />
          </div>
        </div>
        <div className="h-[360px] animate-pulse rounded-[28px] bg-slate-200" />
      </div>
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(timestamp));
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(amount);
}

function getPaymentVariant(status: string): "success" | "warning" | "neutral" | "danger" {
  const normalized = status.toLowerCase();

  if (normalized === "paid" || normalized === "succeeded") {
    return "success";
  }

  if (normalized === "pending" || normalized === "processing") {
    return "warning";
  }

  if (normalized === "failed" || normalized === "refunded") {
    return "danger";
  }

  return "neutral";
}
