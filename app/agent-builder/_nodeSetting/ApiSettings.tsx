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
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { toast } from "sonner";

type ApiSettingsFormData = {
  name: string;
  url: string;
  method: string;
  authType: string;
  useHeaders: boolean;
  headers: string;
  body: string;
};

type ApiSettingsProps = {
  selectedNode: {
    data?: {
      label?: string;
      url?: string;
      method?: string;
      authType?: string;
      useHeaders?: boolean;
      headers?: string;
      body?: string;
      setting?: Partial<ApiSettingsFormData>;
    };
  } | null;
  setupdateFormData: (value: ApiSettingsFormData) => void;
};

const defaultFormData: ApiSettingsFormData = {
  name: "",
  url: "",
  method: "GET",
  authType: "none",
  useHeaders: true,
  headers: "",
  body: "",
};

function ApiSettings({
  selectedNode,
  setupdateFormData,
}: ApiSettingsProps) {
  const [formData, setFormData] = useState<ApiSettingsFormData>(() => ({
    ...defaultFormData,
    name: selectedNode?.data?.label ?? "",
    ...selectedNode?.data?.setting,
  }));

  const handleChange = (
    key: keyof ApiSettingsFormData,
    value: ApiSettingsFormData[keyof ApiSettingsFormData]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const onSave = () => {
    if (!formData.name.trim()) {
      toast.error("API node name is required.");
      return;
    }

    if (!formData.url.trim()) {
      toast.error("API URL is required.");
      return;
    }

    setupdateFormData(formData);
    toast.success("API Request Settings Updated!");
  };

  return (
    <div className="w-full max-w-[340px] rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_20px_rgba(0,0,0,0.07)]">
      <div className="mb-3.5 border-b border-zinc-100 pb-3">
        <h2 className="text-[15px] font-semibold tracking-tight text-zinc-950">
          API Request
        </h2>
        <p className="mt-0.5 text-[12px] leading-5 text-zinc-500">
          Configure an outbound HTTP request for this workflow step.
        </p>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-zinc-700">Name</Label>
          <Input
            value={formData.name}
            onChange={(event) => handleChange("name", event.target.value)}
            placeholder="API Request"
            className="h-9 rounded-xl border-zinc-200 bg-zinc-50/70 px-3 text-xs shadow-none transition-all placeholder:text-zinc-400 hover:bg-white focus-visible:border-zinc-300 focus-visible:ring-4 focus-visible:ring-zinc-200/70"
          />
        </div>

        <div className="space-y-2 rounded-xl border border-zinc-200 bg-zinc-50/70 p-3 transition-all hover:bg-white hover:shadow-sm">
          <Label className="text-xs font-bold text-zinc-800">Method</Label>
          <Select
            value={formData.method}
            onValueChange={(value) => handleChange("method", value)}
          >
            <SelectTrigger className="h-9 rounded-lg border-zinc-200 bg-white px-3 text-xs shadow-none focus:ring-4 focus:ring-zinc-200/70">
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-zinc-200 shadow-xl">
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="POST">POST</SelectItem>
              <SelectItem value="PUT">PUT</SelectItem>
              <SelectItem value="PATCH">PATCH</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-zinc-700">URL</Label>
          <Input
            value={formData.url}
            onChange={(event) => handleChange("url", event.target.value)}
            placeholder="https://api.example.com/data"
            className="h-9 rounded-xl border-zinc-200 bg-zinc-50/70 px-3 text-xs shadow-none transition-all placeholder:text-zinc-400 hover:bg-white focus-visible:border-zinc-300 focus-visible:ring-4 focus-visible:ring-zinc-200/70"
          />
        </div>

        <div className="space-y-2 rounded-xl border border-zinc-200 bg-zinc-50/70 p-3 transition-all hover:bg-white hover:shadow-sm">
          <Label className="text-xs font-bold text-zinc-800">Auth Type</Label>
          <Select
            value={formData.authType}
            onValueChange={(value) => handleChange("authType", value)}
          >
            <SelectTrigger className="h-9 rounded-lg border-zinc-200 bg-white px-3 text-xs shadow-none focus:ring-4 focus:ring-zinc-200/70">
              <SelectValue placeholder="Select auth type" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-zinc-200 shadow-xl">
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="bearer">Bearer Token</SelectItem>
              <SelectItem value="basic">Basic Auth</SelectItem>
              <SelectItem value="apiKey">API Key</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50/70 p-3 transition-all hover:bg-white hover:shadow-sm">
          <div>
            <Label className="text-xs font-bold text-zinc-800">
              Include Headers
            </Label>
            <p className="mt-0.5 text-[11px] text-zinc-500">
              Add custom headers to the API request.
            </p>
          </div>
          <Switch
            checked={formData.useHeaders}
            onCheckedChange={(checked) =>
              handleChange("useHeaders", checked)
            }
          />
        </div>

        {formData.useHeaders && (
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-zinc-700">
              Headers
            </Label>
            <Textarea
              value={formData.headers}
              onChange={(event) => handleChange("headers", event.target.value)}
              placeholder='{ "Authorization": "Bearer token" }'
              className="min-h-20 resize-none rounded-xl border-zinc-200 bg-zinc-50/70 p-3 text-xs leading-5 shadow-none transition-all placeholder:text-zinc-400 hover:bg-white focus-visible:border-zinc-300 focus-visible:ring-4 focus-visible:ring-zinc-200/70"
            />
          </div>
        )}

        {formData.method !== "GET" && (
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-zinc-700">Body</Label>
            <Textarea
              value={formData.body}
              onChange={(event) => handleChange("body", event.target.value)}
              placeholder='{ "key": "value" }'
              className="min-h-24 resize-none rounded-xl border-zinc-200 bg-zinc-50/70 p-3 text-xs leading-5 shadow-none transition-all placeholder:text-zinc-400 hover:bg-white focus-visible:border-zinc-300 focus-visible:ring-4 focus-visible:ring-zinc-200/70"
            />
          </div>
        )}

        <Button
          onClick={onSave}
          className="h-9 w-full rounded-xl border-none bg-zinc-950 text-xs font-medium tracking-wide text-white shadow-none transition-all hover:bg-zinc-800 active:scale-[0.98] active:bg-zinc-900 focus-visible:ring-4 focus-visible:ring-zinc-300"
        >
          Save API Settings
        </Button>
      </div>
    </div>
  );
}

export default ApiSettings;
