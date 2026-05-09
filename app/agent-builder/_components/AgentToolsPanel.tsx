import { WorkflowContext } from "@/app/context/WorkflowContext";
import { Merge, MousePointer, Repeat, Square, ThumbsUp, Webhook } from "lucide-react";
import React, { useContext } from "react";

const AgentTools = [
  {
    name: 'Agent',
    icon: MousePointer,
    bgColor: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    id: 'agent',
    type: 'AgentNode',
  },
  {
    name: 'End',
    icon: Square,
    bgColor: 'bg-red-50 text-red-600 border-red-100',
    id: 'end',
    type: 'EndNode',
  },
  {
    name: 'If/Else',
    icon: Merge,
    bgColor: 'bg-amber-50 text-amber-600 border-amber-100',
    type: 'IfElseNode',
    id: 'ifElse',
  },
  {
    name: 'While',
    icon: Repeat,
    bgColor: 'bg-blue-50 text-blue-600 border-blue-100',
    id: 'while',
    type: 'WhileNode',
  },
  {
    name: 'User Approval',
    icon: ThumbsUp,
    bgColor: 'bg-purple-50 text-purple-600 border-purple-100',
    id: 'approval',
    type: 'UserApprovalNode',
  },
  {
    name: 'API',
    icon: Webhook,
    bgColor: 'bg-cyan-50 text-cyan-600 border-cyan-100',
    id: 'api',
    type: 'ApiNode',
  },
];

function AgentToolsPanel() {
  const { setAddedNodes } = useContext(WorkflowContext);

  const onAgentToolClick = (tool: any) => {
    const newNode = {
      id: `${tool.id}-${Date.now()}`,
      position: { x: 0, y: 100 },
      // FIXED: Only store plain data strings, not the Icon component
      data: { 
        label: tool.name,
        bgColor: tool.bgColor,
        id: tool.id
      },
      type: tool.type 
    };
    setAddedNodes((prev: any) => [...prev, newNode]);
  };

  return (
    <div className="w-64 bg-white border-4 border-zinc-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.02),0_8px_24px_-12px_rgba(0,0,0,0.03)] overflow-hidden">
      <div className="p-4 border-b border-zinc-100 bg-[#fcfcfc]">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.08em] text-zinc-400">
          Node Library
        </h2>
      </div>

      <div className="p-2 flex flex-col gap-1">
        {AgentTools.map((tool, index) => (
          <div
            key={index}
            className="group flex items-center gap-3 p-2.5 cursor-grab rounded-xl border border-transparent transition-all duration-200 hover:bg-zinc-50 hover:border-zinc-200/60 active:scale-[0.98]"
            onClick={() => onAgentToolClick(tool)}
          >
            <div className={`flex items-center justify-center h-9 w-9 rounded-lg border shadow-sm transition-transform duration-200 group-hover:scale-105 ${tool.bgColor}`}>
              <tool.icon className="h-4 w-4 stroke-[2.5px]" />
            </div>

            <div className="flex flex-col">
              <h3 className="text-sm font-semibold text-zinc-700 tracking-tight group-hover:text-zinc-900 transition-colors">
                {tool.name}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-zinc-50/50 border-t border-zinc-100">
        <p className="text-[10px] text-zinc-400 leading-relaxed text-center font-medium">
          Click nodes to add them to the canvas.
        </p>
      </div>
    </div>
  );
}

export default AgentToolsPanel;
