import { Button } from "@/components/ui/button";
import { ChevronLeft, Code2, Play, Globe } from "lucide-react";
import React from "react";

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-5 border-zinc-200/60 bg-[#fcfcfc]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4 sm:px-8">
        
        {/* Left Section: Contextual Navigation */}
        <div className="flex items-center gap-5">
          <button className="group flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-50 active:scale-95">
            <ChevronLeft className="h-4 w-4 text-zinc-500 transition-transform group-hover:-translate-x-0.5" />
          </button>
          
          <div className="flex flex-col gap-0.5">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-800">
              Agent Name
            </h2>
            <div className="flex items-center gap-2">
              <span className="flex h-1.5 w-1.5 rounded-full bg-amber-400 ring-2 ring-amber-100" />
              <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-zinc-400">
                Draft Mode
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Core Actions */}
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            className="hidden h-8 items-center gap-2 rounded-lg px-2.5 text-xs font-medium text-zinc-500 transition-all hover:bg-zinc-100 hover:text-zinc-900 md:flex"
          >
            <Code2 className="h-3.5 w-3.5 text-zinc-400" />
            Code
          </Button>

          <div className="hidden h-3 w-px bg-zinc-200 md:block" />

          {/* Preview Button with Refined Light Aesthetics */}
          <Button 
            variant="outline" 
            className="group/btn h-8 gap-2 rounded-lg border-zinc-200 bg-white px-4 text-xs font-medium text-zinc-600 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all hover:bg-zinc-50 hover:border-zinc-300 hover:text-zinc-900 active:scale-[0.98]"
          >
            <Play className="h-3 w-3 fill-zinc-300 text-zinc-300 transition-colors group-hover/btn:fill-zinc-600 group-hover/btn:text-zinc-600" />
            Preview
          </Button>

          {/* Publish Button: Zinc-900 for high-contrast primary action */}
          <Button 
            className="h-8 gap-2 rounded-lg bg-zinc-900 px-4 text-xs font-medium text-zinc-50 shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all hover:bg-zinc-800 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] active:scale-[0.98]"
          >
            <Globe className="h-3 w-3" />
            Publish
          </Button>
        </div>

      </div>
    </header>
  );
}

export default Header;