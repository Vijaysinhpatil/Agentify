"use client";

import { UserDetailContext } from "@/app/context/userDetailContext";
import { api } from "@/convex/_generated/api";
import { Agent } from "@/types/AgentTypes";
import { useConvex } from "convex/react";
import { GitBranchIcon, Clock } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

function MyAgents() {
  const { userDetails } = useContext(UserDetailContext);

  const [agentList, setAgentList] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  const convex = useConvex();

  useEffect(() => {
    if (userDetails?._id) {
      GetUserAgents();
    }
  }, [userDetails]);

  const GetUserAgents = async () => {
    setLoading(true);

    try {
      const result = await convex.query(api.agent.getUserAgents, {
        userId: userDetails._id,
      });

      setAgentList(result);
    } finally {
      setLoading(false);
    }
  };

  const AgentCardSkeleton = () => (
    <div className="relative flex min-h-[176px] flex-col overflow-hidden rounded-[22px] border border-zinc-200/80 bg-white/95 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03),0_10px_24px_rgba(15,23,42,0.04)] ring-1 ring-white/60">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-zinc-50/30 to-zinc-100/40" />

      <div className="relative flex items-start justify-between">
        <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50 p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
          <Skeleton className="h-5 w-5 rounded-md bg-zinc-200/90" />
        </div>

        <Skeleton className="mt-1 h-2 w-2 rounded-full bg-zinc-200" />
      </div>

      <div className="relative mt-5 space-y-3.5">
        <Skeleton className="h-4 w-[72%] rounded-full bg-zinc-200/95" />
        <Skeleton className="h-3.5 w-[48%] rounded-full bg-zinc-100" />

        <div className="flex items-center gap-2 pt-1">
          <Skeleton className="h-3.5 w-3.5 rounded-full bg-zinc-200/90" />
          <Skeleton className="h-3 w-24 rounded-full bg-zinc-200/80" />
        </div>
      </div>

      <div className="relative mt-auto pt-5">
        <div className="flex items-center justify-between border-t border-zinc-100 pt-4">
          <Skeleton className="h-2.5 w-28 rounded-full bg-zinc-200/80" />
          <Skeleton className="h-1.5 w-1.5 rounded-full bg-zinc-200" />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent animate-pulse" />
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 antialiased sm:px-5 md:px-6 md:py-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, index) => (
              <AgentCardSkeleton key={index} />
            ))
          : agentList.map((agent, index) => (
              <Link
                href={"/agent-builder/" + agent.agentId}
                key={agent._id || index}
                className="group relative flex min-h-[170px] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
              >
                <div className="flex items-start justify-between">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 transition-colors group-hover:border-yellow-100 group-hover:bg-yellow-50">
                    <GitBranchIcon className="h-5 w-5 text-slate-600 transition-colors group-hover:text-yellow-600" />
                  </div>

                  <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.45)]" />
                </div>

                <div className="mt-5">
                  <h2 className="truncate text-[15px] font-semibold tracking-tight text-slate-950">
                    {agent.name}
                  </h2>

                  <div className="mt-1.5 flex items-center gap-1.5 text-slate-400">
                    <Clock className="h-3.5 w-3.5" />

                    <span className="text-xs font-medium">
                      {moment(agent._creationTime).fromNow()}
                    </span>
                  </div>
                </div>

                <div className="mt-auto pt-5">
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Standard Instance
                    </span>

                    <span className="h-1.5 w-1.5 rounded-full bg-slate-200 transition-colors group-hover:bg-yellow-400" />
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
}

export default MyAgents;
