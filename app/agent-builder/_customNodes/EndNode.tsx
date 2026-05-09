import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { CheckCircle2 } from "lucide-react";

const EndNode = memo(({ data }: any) => {
  return (
    <div className="group relative w-[200px] overflow-hidden rounded-[18px] border border-rose-200/60 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-rose-400 hover:shadow-[0_15px_40px_rgba(244,63,94,0.12)]">
      
      {/* Input Handle - Fixed positioning for better connectivity */}
      <Handle
        type="target"
        position={Position.Top}
        className="!z-50 !h-3.5 !w-3.5 !rounded-full !border-2 !border-white !bg-rose-500 !shadow-[0_0_0_1px_rgba(244,63,94,0.2)] hover:!scale-150 !transition-all"
      />

      {/* Decorative background glow */}
      <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-rose-50/50 blur-2xl transition-opacity group-hover:opacity-100" />

      <div className="relative flex items-center gap-3.5 p-4">
        
        {/* Icon Container */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500 text-white shadow-[0_4px_12px_rgba(244,63,94,0.25)] transition-transform duration-500 group-hover:scale-110">
          <CheckCircle2 className="h-5 w-5 stroke-[2.5px]" />
        </div>

        {/* Content Section */}
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-rose-600/80">
            End
          </span>

          <h2 className="truncate text-[14px] font-bold tracking-tight text-zinc-900">
            {data?.label || "Workflow Complete"}
          </h2>
        </div>
      </div>

      {/* Bottom accent bar */}
      <div className="absolute bottom-0 h-[3px] w-full bg-gradient-to-r from-rose-400 to-rose-600 opacity-80" />
    </div>
  );
});

EndNode.displayName = "EndNode";

export default EndNode;