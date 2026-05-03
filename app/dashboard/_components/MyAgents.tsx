"use client";

import { UserDetailContext } from "@/app/context/userDetailContext";
import { api } from "@/convex/_generated/api";
import { Agent } from "@/types/AgentTypes";
import { useConvex } from "convex/react";
import { GitBranchIcon, Plus, Clock } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import Link from "next/link";

function MyAgents() {
  const { userDetails } = useContext(UserDetailContext);
  const [agentList, setAgentList] = useState<Agent[]>([]);
  const convex = useConvex();

  useEffect(() => {
    if (userDetails?._id) {
      GetUserAgents();
    }
  }, [userDetails]);

  const GetUserAgents = async () => {
    const result = await convex.query(api.agent.getUserAgents, {
      userId: userDetails._id,
    });
    setAgentList(result);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 antialiased">
      

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {agentList.map((agent, index) => (
          <Link href={'/agent-builder/' + agent.agentId }
            key={agent._id || index}
            className="group relative flex flex-col p-5 bg-white border border-slate-200 rounded-xl transition-all duration-200 ease-in-out hover:border-slate-300 hover:shadow-sm hover:-translate-y-0.5 cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 group-hover:bg-yellow-50 group-hover:border-yellow-100 transition-colors">
                <GitBranchIcon className="h-5 w-5 text-slate-600 group-hover:text-yellow-600 transition-colors" />
              </div>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
            </div>

            <div className="mt-4">
              <h2 className="text-[15px] font-semibold text-slate-900 truncate">
                {agent.name}
              </h2>
              <div className="flex items-center gap-1.5 mt-1.5 text-slate-400">
                <Clock className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">
                  {moment(agent._creationTime).fromNow()}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Standard Instance
              </span>
              <div className="h-1.5 w-1.5 rounded-full bg-slate-200 group-hover:bg-yellow-400 transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default MyAgents;