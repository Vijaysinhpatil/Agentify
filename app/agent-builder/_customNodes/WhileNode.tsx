"use client";

import React, { memo, useCallback } from "react";
import { Handle, Position } from "@xyflow/react";
import { Repeat, Play, Square } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const WhileNode = memo(({ data, id }: any) => {
  const onChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = evt.target;
      if (data.onChange) {
        data.onChange(id, name, value);
      }
    },
    [id, data]
  );

  return (
    <div className="group relative w-[260px] overflow-visible rounded-[22px] border border-indigo-200/60 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:border-indigo-400 hover:shadow-[0_15px_40px_rgba(99,102,241,0.1)]">
      
      {/* TOP INPUT CONNECTOR */}
      <Handle
        type="target"
        position={Position.Top}
        id="input"
        className="!z-50 !h-3.5 !w-3.5 !rounded-full !border-2 !border-white !bg-zinc-400 !shadow-sm hover:!scale-150 !transition-all"
      />

      {/* Header */}
      <div className="relative flex items-center gap-3 rounded-t-[22px] border-b border-zinc-100 bg-indigo-50/40 p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-lg shadow-indigo-200/50 transition-transform duration-500 group-hover:rotate-180">
          <Repeat className="h-4 w-4 stroke-[2.5px]" />
        </div>
        
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-indigo-600">
            Control Flow
          </span>
          <h2 className="text-[14px] font-bold tracking-tight text-zinc-900">
            While Loop
          </h2>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col gap-4 p-4">
        <div className="space-y-1.5">
          <Label htmlFor={`condition-${id}`} className="ml-1 text-[11px] font-semibold uppercase text-zinc-500">
            Loop Condition
          </Label>
          <Input
            id={`condition-${id}`}
            name="condition"
            placeholder="e.g. i < 10"
            className="nodrag h-9 rounded-xl border-zinc-200 bg-zinc-50/50 text-xs focus-visible:ring-indigo-500 transition-all focus:bg-white"
            defaultValue={data.condition}
            onChange={onChange}
          />
        </div>
      </div>

      {/* OUTPUT SECTION - ALIGNMENT FIXED */}
      <div className="relative flex rounded-b-[22px] border-t border-zinc-100 bg-zinc-50/30">
        
        {/* LOOP BODY SECTION */}
        <div className="relative flex flex-1 flex-col items-center justify-center py-4 border-r border-zinc-100">
          <div className="mb-1 flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 ring-1 ring-indigo-100/50">
            <Play className="h-2 w-2 fill-indigo-600 text-indigo-600" />
            <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-wider">Body</span>
          </div>
          <Handle
            type="source"
            position={Position.Bottom}
            id="body"
            className="!z-50 !h-2.5 !w-8 !rounded-full !border-2 !border-white !bg-indigo-500 !shadow-[0_2px_10px_rgba(99,102,241,0.22)] !transition-all hover:!scale-110"
            style={{ bottom: "-6px" }}
          />
        </div>

        {/* ON FINISH SECTION */}
        <div className="relative flex flex-1 flex-col items-center justify-center py-4">
          <div className="mb-1 flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 ring-1 ring-zinc-200/50">
            <Square className="h-2 w-2 fill-zinc-500 text-zinc-500" />
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Exit</span>
          </div>
          <Handle
            type="source"
            position={Position.Bottom}
            id="exit"
            className="!z-50 !h-2.5 !w-8 !rounded-full !border-2 !border-white !bg-zinc-600 !shadow-[0_2px_10px_rgba(0,0,0,0.1)] !transition-all hover:!scale-110"
            style={{ bottom: "-6px" }}
          />
        </div>
      </div>
    </div>
  );
});

WhileNode.displayName = "WhileNode";

export default WhileNode;
