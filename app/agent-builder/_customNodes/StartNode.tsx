import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { PlayIcon } from "lucide-react";

// Wrapped in memo to prevent unnecessary re-renders in the flow
const StartNode = memo(({ data }: any) => {
  return (
    <div className="group relative w-[200px] overflow-hidden rounded-[18px] border border-emerald-200/60 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-emerald-400 hover:shadow-[0_15px_40px_rgba(16,185,129,0.12)]">
      
      {/* Decorative background glow */}
      <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-emerald-50/50 blur-2xl transition-opacity group-hover:opacity-100" />

      <div className="relative flex items-center gap-3.5 p-4">
        
        {/* Icon Container with refined glass effect */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-[0_4px_12px_rgba(16,185,129,0.25)] transition-transform duration-500 group-hover:scale-110">
          <PlayIcon className="h-4.5 w-4.5 fill-white/10 stroke-[2.5px]" />
        </div>

        {/* Content Section */}
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-600/80">
            Trigger
          </span>

          <h2 className="truncate text-[14px] font-bold tracking-tight text-zinc-900">
            {data?.label || "Start Workflow"}
          </h2>
        </div>
      </div>

      {/* Output Handle with improved visibility */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-3 !w-3 !rounded-full !border-2 !border-white !bg-emerald-500 !shadow-[0_0_0_1px_rgba(16,185,129,0.2)] hover:!scale-150 !transition-all"
      />

      {/* Bottom accent bar */}
      <div className="absolute bottom-0 h-[3px] w-full bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-80" />
    </div>
  );
});

StartNode.displayName = "StartNode";

export default StartNode;