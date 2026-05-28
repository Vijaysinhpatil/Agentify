"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { toast } from "sonner";

type WhileLoopFormData = {
  condition: string;
};

type WhileLoopSettingsProps = {
  selectedNode: {
    data?: {
      condition?: string;
      setting?: Partial<WhileLoopFormData>;
    };
  } | null;
  setupdateFormData: (value: WhileLoopFormData) => void;
};

function WhileLoopSettings({
  selectedNode,
  setupdateFormData,
}: WhileLoopSettingsProps) {
  const [formData, setFormData] = useState<WhileLoopFormData>({
    condition:
      selectedNode?.data?.condition ??
      selectedNode?.data?.setting?.condition ??
      "",
  });

  const onSave = () => {
    setupdateFormData(formData);
    toast.success("While loop settings updated.");
  };

  return(
        <div className="w-full max-w-[340px] rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_20px_rgba(0,0,0,0.07)]">
              <div className="mb-3.5 border-b border-zinc-100 pb-3">
                   <h2 className="text-[15px] font-semibold tracking-tight text-zinc-950">While</h2>
                   <p className="mt-0.5 text-[12px] leading-5 text-zinc-500">
                      Loop your logic until a condition is met.
                   </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-zinc-700">Loop Condition</Label>
                  <Input
                    value={formData.condition}
                    onChange={(event) =>
                      setFormData({
                        condition: event.target.value,
                      })
                    }
                    placeholder="Enter condition e.g. i < 10"
                    className="h-9 rounded-xl border-zinc-200 bg-zinc-50/70 px-3 text-xs shadow-none transition-all placeholder:text-zinc-400 hover:bg-white focus-visible:border-zinc-300 focus-visible:ring-4 focus-visible:ring-zinc-200/70"
                  />
                </div>

                <Button
                  onClick={onSave}
                  className="h-9 w-full rounded-xl border-none bg-zinc-950 text-xs font-medium tracking-wide text-white shadow-none transition-all hover:bg-zinc-800 active:scale-[0.98] active:bg-zinc-900 focus-visible:ring-4 focus-visible:ring-zinc-300"
                >
                  Save Settings
                </Button>
              </div>
        </div>
    )
}

export default WhileLoopSettings;
