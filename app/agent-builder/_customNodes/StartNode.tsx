import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { PlayIcon } from "lucide-react";

// Wrapped in memo to prevent unnecessary re-renders in the flow
const StartNode = memo(({ data }: any) => {
  return (
    <div className="group relative bg-white border-3 border-zinc-200 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:border-zinc-300 transition-all duration-300 ease-out w-[180px] overflow-hidden">
      
      {/* Visual Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-emerald-500/90" />

      <div className="p-4 flex flex-col gap-3">
        {/* Header Section */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center bg-emerald-50 p-2 rounded-xl border border-emerald-100/50 group-hover:scale-110 transition-transform duration-300">
            <PlayIcon className="h-4 w-4 text-emerald-600 fill-emerald-600/10 stroke-[2.5px]" />
          </div>
          
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] uppercase tracking-[0.08em] font-bold text-zinc-400">
              Trigger
            </span>
            <h2 className="text-sm font-semibold text-zinc-800 tracking-tight leading-none">
              {data?.label || "Start Workflow"}
            </h2>
          </div>
        </div>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        // Tailwind '!' is used to override default React Flow styles
        className="!w-3 !h-3 !bg-emerald-500 !border-2 !border-white !shadow-sm hover:!scale-125 !transition-transform"
      />
      
      {/* Subtle bottom highlight */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-100 to-transparent" />
    </div>
  );
});

StartNode.displayName = "StartNode";

export default StartNode;