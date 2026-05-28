"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { toast } from "sonner";

type EndSettingProps = {
  selectedNode: {
    data?: {
      setting?: {
        schema?: string;
      };
    };
  } | null;
  setupdateFormData: (value: { schema: string }) => void;
};

function EndSetting({ selectedNode, setupdateFormData }: EndSettingProps) {
    const [formData, setFormData] = useState({
        schema : selectedNode?.data?.setting?.schema || ''
    })

    const onSave = () => {
      setupdateFormData(formData);
      toast.success("End settings updated..!");
    };

  return (
    <div className="w-full max-w-[340px] rounded-2xl border-4 border-zinc-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_20px_rgba(0,0,0,0.07)]">
      <div className="mb-3.5 border-b border-zinc-100 pb-3">
        <h2 className="text-[15px] font-semibold tracking-tight text-zinc-950">
          End
        </h2>
        <p className="mt-0.5 text-[12px] leading-5 text-zinc-500">
          Configure the final output returned by this workflow.
        </p>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5 rounded-xl border-3 border-zinc-200 bg-zinc-50/70 p-3 transition-all hover:bg-white hover:shadow-sm">
          <Label className="text-xs font-bold text-zinc-800">Output</Label>
          <p className="text-[11px] text-zinc-500">
            Define the shape or summary of the workflow result.
          </p>

          <Textarea
            placeholder='{ "name": "string" }'
            value={formData?.schema}
            onChange={(e) => setFormData({ schema : e.target.value })}
            className="min-h-24 resize-none rounded-lg border-zinc-200 bg-white p-3 text-xs leading-5 shadow-none transition-all placeholder:text-zinc-400 focus-visible:border-zinc-300 focus-visible:ring-4 focus-visible:ring-zinc-200/70"
          />
        </div>

        <Button
         onClick={onSave}
        className="h-9 w-full rounded-xl border-none bg-zinc-950 text-xs font-medium tracking-wide text-white shadow-none transition-all hover:bg-zinc-800 active:scale-[0.98] active:bg-zinc-900 focus-visible:ring-4 focus-visible:ring-zinc-300">
          Save Output
        </Button>
      </div>
    </div>
  );
}

export default EndSetting;
