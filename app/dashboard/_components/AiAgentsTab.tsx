import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyAgents from "./MyAgents";

function AiAgentsTab() {
  return (
    <div className="mt-14 mb-10 px-6 md:px-24 lg:px-32">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
          AI Workspace
        </h2>
        <p className="text-slate-500 mt-2">
          Create, manage, and deploy your intelligent agents.
        </p>
      </div>

      <Tabs defaultValue="myagents" className="flex w-full max-w-5xl flex-col">
        <TabsList>
          <TabsTrigger value="myagents">My Agents</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent
          value="myagents"
          className="mt-5 overflow-hidden rounded-[28px] border border-zinc-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,244,245,0.92))] shadow-[0_1px_2px_rgba(15,23,42,0.04),0_18px_40px_rgba(15,23,42,0.06)] ring-1 ring-white/70"
        >
          <MyAgents />
        </TabsContent>

        <TabsContent value="templates" className="mt-5">
          <div className="rounded-[28px] border border-zinc-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,244,245,0.92))] p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_18px_40px_rgba(15,23,42,0.06)] ring-1 ring-white/70">
            <h1 className="text-lg font-semibold text-slate-800">
              Templates
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Select a ready-made agent template to start quickly.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AiAgentsTab;

