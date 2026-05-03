import React from "react";
import { Handle, Position } from "@xyflow/react";
import { Bot } from "lucide-react";

function AgentNode({ data }: any) {
  return (
    <div className="group relative bg-white border-3 border-zinc-200 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:border-zinc-300 transition-all duration-300 ease-out w-52 overflow-hidden">
      
      {/* Refined Accent Bar - Uses a softer blue gradient for a premium feel */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 to-indigo-500 opacity-90" />

      <div className="p-4 flex flex-col gap-3">
        {/* Header Section */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center bg-blue-50 p-2 rounded-xl border border-blue-100/50 group-hover:scale-110 transition-transform duration-300">
            <Bot className="h-4 w-4 text-blue-600 stroke-[2.5px]" />
          </div>
          
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] uppercase tracking-[0.08em] font-bold text-zinc-400">
              AI Agent
            </span>
            <h2 className="text-sm font-semibold text-zinc-800 tracking-tight leading-none">
              {data?.label || "Neural Task"}
            </h2>
          </div>
        </div>
      </div>

      {/* Input Handle (Left) - Uses neutral zinc for targets */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2.5 !h-2.5 !bg-zinc-200 !border-[3px] !border-white !shadow-sm hover:!scale-150 !transition-transform !duration-200"
      />

      {/* Output Handle (Right) - Blue primary color for sources */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2.5 !h-2.5 !bg-blue-500 !border-[3px] !border-white !shadow-sm hover:!scale-150 !transition-transform !duration-200"
      />
      
      {/* Subtle bottom highlight for depth */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-100 to-transparent" />
    </div>
  );
}

export default AgentNode;