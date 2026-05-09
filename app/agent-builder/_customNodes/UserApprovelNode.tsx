"use client";

import React, { memo, useCallback } from "react";
import { Handle, Position } from "@xyflow/react";
import { UserCheck, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const UserApprovalNode = memo(({ data, id }: any) => {
  const onAction = useCallback(
    (actionType: "approve" | "reject") => {
      if (data?.onAction) {
        data.onAction(id, actionType);
      }
    },
    [id, data]
  );

  return (
    <div className="group relative w-[260px] overflow-visible rounded-[22px] border border-fuchsia-200/60 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:border-fuchsia-400 hover:shadow-[0_15px_40px_rgba(217,70,239,0.1)]">
      <Handle
        type="target"
        position={Position.Top}
        id="input"
        className="!z-50 !h-3.5 !w-3.5 !rounded-full !border-2 !border-white !bg-zinc-400 !shadow-sm !transition-all hover:!scale-150"
      />

      <div className="relative flex items-center gap-3 rounded-t-[22px] border-b border-zinc-100 bg-fuchsia-50/40 p-4">
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-200/50 transition-transform duration-300 group-hover:scale-110">
          <div className="absolute inset-0 animate-ping rounded-xl bg-fuchsia-400 opacity-20" />
          <UserCheck className="relative z-10 h-[18px] w-[18px] stroke-[2.5px]" />
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-fuchsia-600">
            Human-in-the-loop
          </span>
          <h2 className="text-[14px] font-bold tracking-tight text-zinc-900">
            User Approval
          </h2>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4">
        <p className="px-2 text-center text-xs font-medium leading-relaxed text-zinc-500">
          {data?.message ||
            "Execution paused. Waiting for user to approve or reject the payload."}
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAction("reject")}
            className="h-9 flex-1 rounded-xl border-rose-200 bg-rose-50/50 text-rose-600 shadow-none hover:bg-rose-100 hover:text-rose-700"
          >
            <XCircle className="mr-1.5 h-4 w-4" />
            Reject
          </Button>

          <Button
            size="sm"
            onClick={() => onAction("approve")}
            className="h-9 flex-1 rounded-xl bg-emerald-500 text-white shadow-[0_2px_10px_rgba(16,185,129,0.2)] hover:bg-emerald-600"
          >
            <CheckCircle className="mr-1.5 h-4 w-4" />
            Approve
          </Button>
        </div>
      </div>

      <div className="relative flex rounded-b-[22px] border-t border-zinc-100 bg-zinc-50/30">
        <div className="relative flex flex-1 flex-col items-center justify-center border-r border-zinc-100 py-4">
          <span className="mb-1 rounded-full bg-emerald-50 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-600 ring-1 ring-emerald-100/50">
            Approved
          </span>

          <Handle
            type="source"
            position={Position.Bottom}
            id="approved"
            className="!z-50 !h-2.5 !w-8 !rounded-full !border-2 !border-white !bg-emerald-500 !shadow-[0_2px_10px_rgba(16,185,129,0.22)] !transition-all hover:!scale-110"
            style={{ bottom: "-6px" }}
          />
        </div>

        <div className="relative flex flex-1 flex-col items-center justify-center py-4">
          <span className="mb-1 rounded-full bg-rose-50 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-rose-600 ring-1 ring-rose-100/50">
            Rejected
          </span>

          <Handle
            type="source"
            position={Position.Bottom}
            id="rejected"
            className="!z-50 !h-2.5 !w-8 !rounded-full !border-2 !border-white !bg-rose-500 !shadow-[0_2px_10px_rgba(244,63,94,0.22)] !transition-all hover:!scale-110"
            style={{ bottom: "-6px" }}
          />
        </div>
      </div>
    </div>
  );
});

UserApprovalNode.displayName = "UserApprovalNode";

export default UserApprovalNode;
