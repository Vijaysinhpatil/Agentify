 "use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { toast } from "sonner";

type UserApprovalFormData = {
  name: string;
  message: string;
};

type UserApprovalProps = {
  selectedNode: {
    data?: {
      label?: string;
      message?: string;
      setting?: Partial<UserApprovalFormData>;
    };
  } | null;
  setupdateFormData: (value: UserApprovalFormData) => void;
};

function UserApproval({
  selectedNode,
  setupdateFormData,
}: UserApprovalProps) {
  const [formData, setFormData] = useState<UserApprovalFormData>({
    name: selectedNode?.data?.label ?? selectedNode?.data?.setting?.name ?? "",
    message:
      selectedNode?.data?.message ?? selectedNode?.data?.setting?.message ?? "",
  });

  const onSave = () => {
    setupdateFormData(formData);
    toast.success("User approval settings updated.");
  };

    return(
        <div className="w-full max-w-[340px] rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_20px_rgba(0,0,0,0.07)]">
               <div className="mb-3.5 border-b border-zinc-100 pb-3">
                     <h2 className="text-[15px] font-semibold tracking-tight text-zinc-950">
                        User Approval
                     </h2>
                     <p className="mt-0.5 text-[12px] leading-5 text-zinc-500">
                        Pause for a human to approve or reject a step
                     </p>
               </div>

               <div className="space-y-3">
                 <div className="space-y-1.5">
                   <Label className="text-xs font-bold text-zinc-700">
                     Name
                   </Label>
                   <Input
                     value={formData.name}
                     onChange={(event) =>
                       setFormData((prev) => ({
                         ...prev,
                         name: event.target.value,
                       }))
                     }
                     placeholder="Approval step name"
                     className="h-9 rounded-xl border-zinc-200 bg-zinc-50/70 px-3 text-xs shadow-none transition-all placeholder:text-zinc-400 hover:bg-white focus-visible:border-zinc-300 focus-visible:ring-4 focus-visible:ring-zinc-200/70"
                   />
                 </div>

                 <div className="space-y-1.5">
                   <Label className="text-xs font-bold text-zinc-700">
                     Approval Message
                   </Label>
                   <Textarea
                     value={formData.message}
                     onChange={(event) =>
                       setFormData((prev) => ({
                         ...prev,
                         message: event.target.value,
                       }))
                     }
                     placeholder="Explain what the user should review before approving."
                     className="min-h-24 resize-none rounded-xl border-zinc-200 bg-zinc-50/70 p-3 text-xs leading-5 shadow-none transition-all placeholder:text-zinc-400 hover:bg-white focus-visible:border-zinc-300 focus-visible:ring-4 focus-visible:ring-zinc-200/70"
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

export default UserApproval;
