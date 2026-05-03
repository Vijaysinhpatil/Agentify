import { Button } from "@/components/ui/button";
import { ChevronLeft, Code2, Play, Globe } from "lucide-react";
import React from "react";

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white/70 backdrop-blur-xl dark:border-zinc-900 dark:bg-zinc-950/70">
      <div className="mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4 sm:px-8">
        
        {/* Left Section: Contextual Navigation */}
        <div className="flex items-center gap-5">
          <button className="group flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white transition-all duration-200 hover:border-zinc-300 hover:shadow-sm active:scale-95 dark:border-zinc-800 dark:bg-zinc-900">
            <ChevronLeft className="h-4 w-4 text-zinc-500 transition-transform group-hover:-translate-x-0.5 dark:text-zinc-400" />
          </button>
          
          <div className="flex flex-col gap-0.5">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Agent Name
            </h2>
            <div className="flex items-center gap-2">
              <span className="flex h-1.5 w-1.5 rounded-full bg-amber-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                Draft Mode
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Core Actions */}
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            className="hidden h-8 items-center gap-2 rounded-lg px-2.5 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 md:flex dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
          >
            <Code2 className="h-3.5 w-3.5" />
            Code
          </Button>

          <div className="hidden h-3 w-px bg-zinc-200 md:block dark:bg-zinc-800" />

          {/* Preview Button with Hover Text Color Change */}
          <Button 
            variant="outline" 
            className="group/btn h-8 gap-2 rounded-lg border-zinc-200 bg-white px-4 text-xs font-medium text-zinc-500 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all hover:bg-zinc-50 hover:border-zinc-300 hover:text-zinc-900 active:scale-[0.98] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <Play className="h-3 w-3 fill-zinc-400 text-zinc-400 transition-colors group-hover/btn:fill-zinc-900 group-hover/btn:text-zinc-900 dark:fill-zinc-500 dark:group-hover/btn:fill-zinc-100 dark:group-hover/btn:text-zinc-100" />
            Preview
          </Button>

          <Button 
            className="h-8 gap-2 rounded-lg bg-zinc-900 px-4 text-xs font-medium text-white shadow-sm transition-all hover:bg-zinc-800 active:scale-[0.98] dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
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