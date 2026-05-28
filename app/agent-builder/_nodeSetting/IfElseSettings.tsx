"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { toast } from "sonner";

type IfElseFormData = {
  ifValue: string;
  elseLabel: string;
};

type IfElseSettingsProps = {
  selectedNode: {
    data?: {
      ifValue?: string;
      elseLabel?: string;
      setting?: Partial<IfElseFormData>;
    };
  } | null;
  setupdateFormData: (value: IfElseFormData) => void;
};

function IfElseSettings({
  selectedNode,
  setupdateFormData,
}: IfElseSettingsProps) {
  const [formData, setFormData] = useState<IfElseFormData>({
    ifValue:
      selectedNode?.data?.ifValue ?? selectedNode?.data?.setting?.ifValue ?? "",
    elseLabel:
      selectedNode?.data?.elseLabel ??
      selectedNode?.data?.setting?.elseLabel ??
      "",
  });

  const onSave = () => {
    setupdateFormData(formData);
    toast.success("If / Else settings updated.");
  };

  return(
        <div className="w-full max-w-[340px] rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_20px_rgba(0,0,0,0.07)]">
              <div className="mb-3.5 border-b border-zinc-100 pb-3">
                   <h2 className="text-[15px] font-semibold tracking-tight text-zinc-950">If / Else</h2>
                   <p className="mt-0.5 text-[12px] leading-5 text-zinc-500">
                     Create conditions to branch your workflow.
                   </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-zinc-700">If Value</Label>
                  <Input
                    value={formData.ifValue}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        ifValue: event.target.value,
                      }))
                    }
                    placeholder="Enter condition e.g. output === 'success'"
                    className="h-9 rounded-xl border-zinc-200 bg-zinc-50/70 px-3 text-xs shadow-none transition-all placeholder:text-zinc-400 hover:bg-white focus-visible:border-zinc-300 focus-visible:ring-4 focus-visible:ring-zinc-200/70"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-zinc-700">Else Label</Label>
                  <Input
                    value={formData.elseLabel}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        elseLabel: event.target.value,
                      }))
                    }
                    placeholder="Fallback branch label"
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

export default IfElseSettings;
