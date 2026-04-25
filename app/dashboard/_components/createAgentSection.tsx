"use client";
import { Button } from "@/components/ui/button";
import { Plus, Bot, Sparkles, Wand2 } from "lucide-react";
import React, { useState } from "react";

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

function CreateAgentSection() {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    /* 1. Updated main container: Added border-zinc-200/60, rounded-3xl, and an inset shadow */
    <div className="flex flex-col justify-center items-center text-center space-y-8 p-16 bg-white border border-zinc-200/60 rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.04),inset_0_1px_0_0_rgba(255,255,255,0.6)] mt-10 relative overflow-hidden">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent" />

      <div className="relative">
        {/* 2. Updated Icon Container: Used a zinc-950 background with a hairline ring */}
        <div className="bg-zinc-950 p-6 rounded-2xl shadow-[0_0_0_1px_rgba(0,0,0,0.1),0_8px_16px_-4px_rgba(0,0,0,0.1)]">
          <Bot className="w-12 h-12 text-white" />
        </div>
        <div className="absolute -top-3 -right-3 bg-white p-2 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-zinc-100">
          <Wand2 className="w-4 h-4 text-indigo-600" />
        </div>
      </div>

      <div className="max-w-md space-y-3">
        <h1 className="font-bold text-4xl text-zinc-900 tracking-tight leading-tight">
          Create AI Agent
        </h1>
        <p className="text-zinc-500 text-lg font-medium leading-relaxed">
          Configure a high-performance workflow with our logic builder. 
          Start by defining your agent's identity.
        </p>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          {/* 3. Primary Button: Added a subtle top border to give it a 3D effect */}
          <Button 
            className="bg-zinc-900 hover:bg-zinc-800 text-white px-10 py-7 rounded-2xl text-lg font-bold shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] transition-all hover:scale-[1.02] active:scale-[0.98] border-t border-white/10"
            onClick={() => setOpenDialog(true)}
          >
            <Plus className="mr-2 h-5 w-5" /> Initialize Agent
          </Button>
        </DialogTrigger>
        
        {/* 4. Dialog Content: Refined the border color to zinc-200/80 */}
        <DialogContent className="sm:max-w-[450px] rounded-[2rem] border-zinc-200/80 shadow-2xl p-8">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-100/50">
                <Sparkles className="w-5 h-5 text-indigo-600" />
              </div>
              <DialogTitle className="text-2xl font-bold text-zinc-900">Agent Configuration</DialogTitle>
            </div>
            <DialogDescription className="text-zinc-500 text-base">
              Set a unique identifier for your agent. This name will be used across your workspace and API endpoints.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-8">
            <label className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-3 block">
              System Identifier / Name
            </label>
            <Input 
              placeholder="e.g. DATA_RESEARCH_BOT" 
              className="rounded-xl border-zinc-200 focus:border-indigo-600 focus:ring-indigo-600/10 py-7 px-5 text-lg bg-zinc-50/50"
            />
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
            <DialogClose asChild>
              <Button variant="outline" className="rounded-xl border-zinc-200 text-zinc-600 order-2 sm:order-1 py-6 px-6 font-semibold hover:bg-zinc-50">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl order-1 sm:order-2 px-10 py-6 font-bold shadow-lg shadow-indigo-200 transition-all">
              Create Agent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateAgentSection;