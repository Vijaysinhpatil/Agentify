"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { FileJson } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

type AgentSettingsFormData = {
  name: string;
  instructions: string;
  includeChatHistory: boolean;
  model: string;
  output: string;
  schema: string;
};

type AgentSettingsProps = {
  selectedNode: {
    data?: {
      label?: string;
      setting?: Partial<AgentSettingsFormData>;
    };
  } | null;
  setupdateFormData: (value: AgentSettingsFormData) => void;
};

const defaultFormData: AgentSettingsFormData = {
  name: "",
  instructions: "",
  includeChatHistory: false,
  model: "gemini-flash-1.5",
  output: "text",
  schema: "",
};

function AgentSettings({
  selectedNode,
  setupdateFormData,
}: AgentSettingsProps) {
  const [formData, setFormData] = useState<AgentSettingsFormData>(() => ({
    ...defaultFormData,
    name: selectedNode?.data?.label || "",
    ...selectedNode?.data?.setting,
  }));

  const handleChange = (
    key: keyof AgentSettingsFormData,
    value: AgentSettingsFormData[keyof AgentSettingsFormData]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const onSave = () => {
    if (!formData.name.trim()) {
      toast.error("Agent name is required.");
      return;
    }

    if (!formData.instructions.trim()) {
      toast.error("Instructions are required.");
      return;
    }

    if (formData.output === "advanced" && !formData.schema.trim()) {
      toast.error("JSON schema is required.");
      return;
    }

    try {
      console.log("FormData -> ", formData);
      setupdateFormData(formData);
      toast.success(" settings updated..!");
    } catch (error) {
      console.error("Agent settings save failed:", error);
      toast.error("Failed to save agent settings.");
    }
  };

  return (
    <div className="w-full max-w-[340px] rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_20px_rgba(0,0,0,0.07)]">
      <div className="mb-3.5 border-b border-zinc-100 pb-3">
        <h2 className="text-[15px] font-semibold tracking-tight text-zinc-950">
          Agent
        </h2>
        <p className="mt-0.5 text-[12px] leading-5 text-zinc-500">
          Call the AI model with specified parameters.
        </p>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-zinc-700 font-bold">Agent Name</Label>
          <Input
            placeholder="Agent Name"
            value={formData.name || ""}
            onChange={(event) => handleChange("name", event.target.value)}
            className="h-9 rounded-xl border-zinc-200 bg-zinc-50/70 px-3 text-xs shadow-none transition-all placeholder:text-zinc-400 hover:bg-white focus-visible:border-zinc-300 focus-visible:ring-4 focus-visible:ring-zinc-200/70"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-zinc-700">
            Instructions
          </Label>
          <Textarea
            placeholder="Instructions"
            value={formData?.instructions || ""}
            onChange={(event) =>
              handleChange("instructions", event.target.value)
            }
            className="min-h-20 resize-none rounded-xl border-zinc-200 bg-zinc-50/70 p-3 text-xs leading-5 shadow-none transition-all placeholder:text-zinc-400 hover:bg-white focus-visible:border-zinc-300 focus-visible:ring-4 focus-visible:ring-zinc-200/70"
          />

          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-2 py-1 text-xs font-bold text-zinc-500 transition-all hover:bg-zinc-100 hover:text-zinc-900 border-none bg-transparent"
          >
            Add context <FileJson className="h-3.5 w-3.5 font-bold" />
          </button>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-zinc-50/70 p-3 transition-all hover:bg-white hover:shadow-sm">
          <div>
            <Label className="text-xs font-bold text-zinc-800">
              Include Chat History
            </Label>
            <p className="mt-0.5 text-[11px] text-zinc-500">
              Use previous messages as context.
            </p>
          </div>

          <Switch
            checked={formData?.includeChatHistory}
            onCheckedChange={(checked) =>
              handleChange("includeChatHistory", checked)
            }
          />
        </div>

        <div className="space-y-2 rounded-xl border border-zinc-200 bg-zinc-50/70 p-3 transition-all hover:bg-white hover:shadow-sm">
          <Label className="text-xs font-bold text-zinc-800">Model</Label>

          <Select
            value={formData?.model}
            onValueChange={(value) => handleChange("model", value)}
          >
            <SelectTrigger className="h-9 rounded-lg border-zinc-200 bg-white px-3 text-xs shadow-none focus:ring-4 focus:ring-zinc-200/70">
              <SelectValue placeholder="Gemini Flash 1.5" />
            </SelectTrigger>

            <SelectContent className="rounded-xl border-zinc-200 shadow-xl">
              <SelectItem value="gemini-flash-1.5">
                Gemini Flash 1.5
              </SelectItem>
              <SelectItem value="gemini-pro-1.5">Gemini Pro 1.5</SelectItem>
              <SelectItem value="gemini-pro-2.0">Gemini Pro 2.0</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Label className="font-bold text-zinc-700">Output Format</Label>

        <Tabs
          value={formData?.output}
          onValueChange={(value) => handleChange("output", value)}
          className="w-full"
        >
          <div className="rounded-xl border border-zinc-200 overflow-hidden w-full">
            <div className="bg-zinc-50/70 p-1">
              <TabsList className="grid h-auto w-full grid-cols-2 gap-1 bg-transparent p-0">
                <TabsTrigger
                  value="text"
                  className="h-8 rounded-lg text-xs font-medium text-zinc-600 transition-all data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-sm"
                >
                  Text
                </TabsTrigger>

                <TabsTrigger
                  value="advanced"
                  className="h-8 rounded-lg text-xs font-medium text-zinc-600 transition-all data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-sm"
                >
                  TextArea
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="text" className="m-0 p-3 outline-none">
              <h2 className="text-xs text-zinc-600">Output will be Text</h2>
            </TabsContent>

            <TabsContent value="advanced" className="m-0 p-3 outline-none">
              <Label className="text-xs font-medium text-zinc-800">
                Enter JSON Schema
              </Label>

              <Textarea
                placeholder="{ title: String }"
                value={formData?.schema || ""}
                onChange={(event) => handleChange("schema", event.target.value)}
                className="mt-2 min-h-20 rounded-lg border-zinc-200 bg-white text-xs"
              />
            </TabsContent>
          </div>
        </Tabs>

        <Button
          onClick={onSave}
          className="w-full h-9 rounded-xl bg-zinc-950 text-white text-xs font-medium tracking-wide shadow-none border-none transition-all hover:bg-zinc-800 active:scale-[0.98] active:bg-zinc-900 focus-visible:ring-4 focus-visible:ring-zinc-300"
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
}

export default AgentSettings;
