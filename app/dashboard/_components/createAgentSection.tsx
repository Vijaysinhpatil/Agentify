"use client";
import { Button } from "@/components/ui/button";
import { Plus, Bot, Sparkles, Wand2, Loader2Icon } from "lucide-react";
import React, { useContext, useState } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/navigation";
import { UserDetailContext } from "@/app/context/userDetailContext";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";

function CreateAgentSection() {
  const [openDialog, setOpenDialog] = useState(false);
  const CreateAgentMutation = useMutation(api.agent.CrateAgent);
  const [agentName, setAgentName] = useState<string>();
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const { userDetails } = useContext(UserDetailContext);
  const { has }  = useAuth();
  const isPaidUser = has && has({plan : "unlimited_plan"})
  const createAgent = async () => {

    if(!isPaidUser && userDetails?.remainingCredits <= 0){
      toast.error("You have reached the maximum limit of agents for free users. Please upgrade to create more agents.")
      return;
    }
    setLoader(true);
    const agentId = uuidv4();
    const result = await CreateAgentMutation({
      agentId: agentId,
      name: agentName ?? '',
      userId: userDetails?._id
    });
    setOpenDialog(false);
    setLoader(false);
    router.push('/agent-builder/' + agentId);
  };

  return (
    <div className="relative group max-w-4xl mx-auto mt-12 overflow-hidden border-4 border-slate-200 bg-white p-12 text-center rounded-2xl transition-all duration-300">
      {/* Subtle Background Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--tw-gradient-stops))] from-slate-50 via-transparent to-transparent opacity-50" />
      
      <div className="relative flex flex-col items-center space-y-6">
        {/* Icon Cluster */}
        <div className="relative flex items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-900 shadow-xl shadow-slate-200 ring-1 ring-slate-900 transition-transform duration-300 group-hover:scale-105">
            <Bot className="h-10 w-10 text-white" />
          </div>
          <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm ring-4 ring-white">
            <Wand2 className="h-4 w-4 text-slate-900" />
          </div>
        </div>

        {/* Typography */}
        <div className="max-w-md space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Create AI Agent
          </h1>
          <p className="text-slate-500 leading-relaxed">
            Architect a custom workflow tailored to your business logic. 
            Define your agent's identity to get started.
          </p>
        </div>

        {/* Action Trigger */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button 
              className="h-12 px-8 rounded-lg bg-slate-900 text-white shadow-sm hover:bg-slate-800 transition-all active:scale-95"
              onClick={() => setOpenDialog(true)}
            >
              <Plus className="mr-2 h-4 w-4" /> Initialize Agent
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-md gap-0 p-0 overflow-hidden rounded-xl border-slate-200 shadow-2xl">
            <div className="p-8 pb-0">
              <DialogHeader className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 border border-slate-100">
                    <Sparkles className="h-5 w-5 text-slate-900" />
                  </div>
                  <DialogTitle className="text-xl font-semibold text-slate-900">New Agent Identity</DialogTitle>
                </div>
                <DialogDescription className="text-slate-500 text-[15px]">
                  Provide a clear system identifier. This identity will be used for API routing and internal tracking.
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-8 space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Agent Name
                </label>
                <Input 
                  placeholder="e.g. CUSTOMER_SUPPORT_L1" 
                  className="h-12 rounded-lg border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all"
                  onChange={(e) => setAgentName(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="mt-8 flex items-center gap-2 border-t border-slate-100 bg-slate-50/50 p-6 px-8">
              <DialogClose asChild>
                <Button variant="ghost" className="h-10 px-4 text-slate-600 hover:bg-slate-100 font-medium rounded-lg">
                  Cancel
                </Button>
              </DialogClose>
              <Button 
                className="h-10 px-6 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 disabled:opacity-50"
                onClick={() => createAgent()}
                disabled={loader || !agentName}
              >
                {loader ? <Loader2Icon className="h-4 w-4 animate-spin" /> : "Confirm Creation"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default CreateAgentSection;