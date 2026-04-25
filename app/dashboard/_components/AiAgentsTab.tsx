import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyAgents from "./MyAgents";

function AiAgentsTab() {
  return (
    <div className="px-6 md:px-24 lg:px-32 mt-14 mb-10">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">AI Workspace</h2>
        <p className="text-slate-500 mt-2">Create, manage, and deploy your intelligent agents.</p>
      </div>

      <Tabs defaultValue="myagents" className="w-full max-w-4xl">
        {/* FIXED BORDERS: Simplified background and removed internal divider conflicts */}
        <TabsList className="flex w-full max-w-[400px] items-center justify-start gap-1 p-1 bg-slate-200/50 rounded-xl border border-transparent">
          <TabsTrigger 
            value="myagents" 
            className="flex-1 rounded-lg py-2 text-sm font-medium transition-all 
              data-[state=active]:bg-white 
              data-[state=active]:text-emerald-700 
              data-[state=active]:shadow-md 
              data-[state=inactive]:text-slate-500 
              data-[state=inactive]:hover:bg-slate-200/50"
          >
            My Agents
          </TabsTrigger>
          <TabsTrigger 
            value="templets" 
            className="flex-1 rounded-lg py-2 text-sm font-medium transition-all 
              data-[state=active]:bg-white 
              data-[state=active]:text-emerald-700 
              data-[state=active]:shadow-md 
              data-[state=inactive]:text-slate-500 
              data-[state=inactive]:hover:bg-slate-200/50"
          >
            Templates
          </TabsTrigger>
        </TabsList>

        <div className="mt-8">
          <TabsContent value="myagents" className="outline-none">
           <div className="flex flex-col">
              <MyAgents/>
           </div>
          </TabsContent>

          <TabsContent value="templets" className="outline-none">
                 <h1>Templates</h1>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

export default AiAgentsTab;