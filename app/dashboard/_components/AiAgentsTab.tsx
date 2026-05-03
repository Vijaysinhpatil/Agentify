import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyAgents from "./MyAgents";

function AiAgentsTab() {
  return (
    <div className="px-6 md:px-24 lg:px-32 mt-14 mb-10">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
          AI Workspace
        </h2>
        <p className="text-slate-500 mt-2">
          Create, manage, and deploy your intelligent agents.
        </p>
      </div>

      <Tabs defaultValue="myagents" className="w-full max-w-4xl flex flex-col">
        <TabsList>
          <TabsTrigger value="myagents">My Agents</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="myagents" className="mt-4 rounded-xl border-4 p-5">
          <MyAgents />
        </TabsContent>

        <TabsContent value="templates">
          <div className="rounded-xl border-4 bg-white p-5 shadow-sm">
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

