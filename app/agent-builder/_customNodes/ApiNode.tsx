"use client";

import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Webhook } from "lucide-react";

const ApiNode = memo(({ data }: any) => {
  return (
    <div className="group relative w-[220px] overflow-hidden rounded-[20px] border border-cyan-200/60 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-cyan-400 hover:shadow-[0_15px_40px_rgba(6,182,212,0.12)]">
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2.5 !w-8 !rounded-full !border-2 !border-white !bg-zinc-400 !shadow-sm !transition-all hover:!scale-110"
      />

      <div className="relative flex items-center gap-3.5 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500 text-white shadow-[0_4px_12px_rgba(6,182,212,0.25)] transition-transform duration-500 group-hover:scale-110">
          <Webhook className="h-5 w-5 stroke-[2.5px]" />
        </div>

        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-cyan-600/80">
            API
          </span>

          <h2 className="truncate text-[14px] font-bold tracking-tight text-zinc-900">
            {data?.label || "API Request"}
          </h2>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!h-2.5 !w-8 !rounded-full !border-2 !border-white !bg-cyan-500 !shadow-[0_2px_10px_rgba(6,182,212,0.22)] !transition-all hover:!scale-110"
      />

      <div className="absolute bottom-0 h-[3px] w-full bg-gradient-to-r from-cyan-400 to-cyan-600 opacity-80" />
    </div>
  );
});

ApiNode.displayName = "ApiNode";

export default ApiNode;
