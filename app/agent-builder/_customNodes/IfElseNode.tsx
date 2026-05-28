"use client";

import React, { memo, useCallback } from "react";
import { Handle, Position } from "@xyflow/react";
import { GitBranch } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type IfElseNodeData = {
  ifValue?: string;
  elseLabel?: string;
  onChange?: (id: string, name: string, value: string) => void;
};

type IfElseNodeProps = {
  data?: IfElseNodeData;
  id: string;
};

const IfElseNode = memo(({ data, id }: IfElseNodeProps) => {
  const nodeData = data ?? {};

  const onChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = evt.target;
      if (data?.onChange) {
        data.onChange(id, name, value);
      }
    },
    [id, data]
  );

  return (
    <div className="group relative w-[260px] overflow-visible rounded-[22px] border border-amber-200/60 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:border-amber-400 hover:shadow-[0_15px_40px_rgba(245,158,11,0.1)]">
      
      {/* TOP INPUT CONNECTOR */}
      <Handle
        type="target"
        position={Position.Top}
        id="input"
        className="!z-50 !h-3.5 !w-3.5 !rounded-full !border-2 !border-white !bg-zinc-500 !shadow-sm hover:!scale-150 !transition-all"
      />

      {/* Header */}
      <div className="relative flex items-center gap-3 rounded-t-[22px] border-b border-zinc-100 bg-amber-50/40 p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-lg shadow-amber-200/50 transition-transform duration-300 group-hover:scale-110">
          <GitBranch className="h-4 w-4 stroke-[2.5px]" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-amber-600">
            Logic
          </span>
          <h2 className="text-[14px] font-bold tracking-tight text-zinc-900">
            If / Else Branch
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 p-4">
        <div className="space-y-1.5">
          <Label htmlFor={`if-${id}`} className="ml-1 text-[11px] font-semibold uppercase text-zinc-500">
            If Value
          </Label>
          <Input
            id={`if-${id}`}
            name="ifValue"
            placeholder="e.g. status === 'success'"
            className="nodrag h-9 rounded-xl border-zinc-200 bg-zinc-50/50 text-xs focus-visible:ring-amber-500"
            defaultValue={nodeData.ifValue ?? ""}
            onChange={onChange}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`else-${id}`} className="ml-1 text-[11px] font-semibold uppercase text-zinc-500">
            Else Label
          </Label>
          <Input
            id={`else-${id}`}
            name="elseLabel"
            placeholder="Go to default..."
            className="nodrag h-9 rounded-xl border-zinc-200 bg-zinc-50/50 text-xs focus-visible:ring-amber-500"
            defaultValue={nodeData.elseLabel ?? ""}
            onChange={onChange}
          />
        </div>
      </div>

      {/* OUTPUT SECTION - FIXED HANDLES */}
      <div className="relative flex rounded-b-[22px] border-t border-zinc-100 bg-zinc-50/30">
        
        {/* TRUE SECTION */}
        <div className="relative flex flex-1 flex-col items-center justify-center py-4 border-r border-zinc-100">
          <span className="mb-1 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-600">
            True
          </span>
          <Handle
            type="source"
            position={Position.Bottom}
            id="true"
            className="!z-50 !h-2.5 !w-8 !rounded-full !border-2 !border-white !bg-emerald-500 !shadow-[0_2px_10px_rgba(16,185,129,0.22)] !transition-all hover:!scale-110"
            style={{ bottom: "-6px" }}
          />
        </div>

        {/* FALSE SECTION */}
        <div className="relative flex flex-1 flex-col items-center justify-center py-4">
          <span className="mb-1 rounded-full bg-rose-50 px-3 py-1 text-[10px] font-bold text-rose-600">
            False
          </span>
          <Handle
            type="source"
            position={Position.Bottom}
            id="false"
            className="!z-50 !h-2.5 !w-8 !rounded-full !border-2 !border-white !bg-rose-500 !shadow-[0_2px_10px_rgba(244,63,94,0.22)] !transition-all hover:!scale-110"
            style={{ bottom: "-6px" }}
          />
        </div>
      </div>
    </div>
  );
});

IfElseNode.displayName = "IfElseNode";

export default IfElseNode;
