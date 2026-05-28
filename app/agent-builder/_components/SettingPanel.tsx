import React from "react";
import { Node } from "@xyflow/react";
import AgentSettings from "../_nodeSetting/AgentSettings";
import ApiSettings from "../_nodeSetting/ApiSettings";
import EndSetting from "../_nodeSetting/EndSetting";
import IfElseSettings from "../_nodeSetting/IfElseSettings";
import UserApproval from "../_nodeSetting/UserApproval";
import WhileLoopSettings from "../_nodeSetting/WhileLoopSettings";

type SettingPanelProps = {
  selectedNode: Node | null;
  setSelectedNode: (node: Node) => void;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
};

function SettingPanel({
  selectedNode,
  setSelectedNode,
  setNodes,
}: SettingPanelProps) {
  const onUpdateNodeData = (formData: {
    name: string;
    instructions: string;
    includeChatHistory: boolean;
    model: string;
    output: string;
    schema: string;
  }) => {
    if (!selectedNode) return;

    console.log("Updated Node Data -> ", formData);

    const updatedNode: Node = {
      ...selectedNode,
      data: {
        ...selectedNode.data,
        label: formData.name,
        setting: formData,
      },
    };

    console.log("Updated Node -> ", updatedNode);

    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === selectedNode.id ? updatedNode : node
      )
    );
    setSelectedNode(updatedNode);
  };

  const onUpdateEndData = (formData: { schema: string }) => {
    if (!selectedNode) return;

    const updatedNode: Node = {
      ...selectedNode,
      data: {
        ...selectedNode.data,
        setting: formData,
      },
    };

    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === selectedNode.id ? updatedNode : node
      )
    );
    setSelectedNode(updatedNode);
  };

  const onUpdateIfElseData = (formData: {
    ifValue: string;
    elseLabel: string;
  }) => {
    if (!selectedNode) return;

    const updatedNode: Node = {
      ...selectedNode,
      data: {
        ...selectedNode.data,
        ifValue: formData.ifValue,
        elseLabel: formData.elseLabel,
        setting: formData,
      },
    };

    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === selectedNode.id ? updatedNode : node
      )
    );
    setSelectedNode(updatedNode);
  };

  const onUpdateWhileData = (formData: { condition: string }) => {
    if (!selectedNode) return;

    const updatedNode: Node = {
      ...selectedNode,
      data: {
        ...selectedNode.data,
        condition: formData.condition,
        setting: formData,
      },
    };

    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === selectedNode.id ? updatedNode : node
      )
    );
    setSelectedNode(updatedNode);
  };

  const onUpdateUserApprovalData = (formData: {
    name: string;
    message: string;
  }) => {
    if (!selectedNode) return;

    const updatedNode: Node = {
      ...selectedNode,
      data: {
        ...selectedNode.data,
        label: formData.name,
        message: formData.message,
        setting: formData,
      },
    };

    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === selectedNode.id ? updatedNode : node
      )
    );
    setSelectedNode(updatedNode);
  };

  const onUpdateApiData = (formData: {
    name: string;
    url: string;
    method: string;
    authType: string;
    useHeaders: boolean;
    headers: string;
    body: string;
  }) => {
    if (!selectedNode) return;

    const updatedNode: Node = {
      ...selectedNode,
      data: {
        ...selectedNode.data,
        label: formData.name,
        url: formData.url,
        method: formData.method,
        authType: formData.authType,
        useHeaders: formData.useHeaders,
        headers: formData.headers,
        body: formData.body,
        setting: formData,
      },
    };

    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === selectedNode.id ? updatedNode : node
      )
    );
    setSelectedNode(updatedNode);
  };

  return (
    selectedNode && (
      <div className="p-5 bg-white rounded-2xl w-[350px] shadow">
        {selectedNode?.type === "AgentNode" && (
          <AgentSettings
            key={selectedNode.id}
            selectedNode={selectedNode}
            setupdateFormData={onUpdateNodeData}
          />
        )}
        {
          selectedNode?.type === "EndNode" &&
           <EndSetting 
              key={selectedNode.id}
              selectedNode={selectedNode}
              setupdateFormData={onUpdateEndData}
           />
        }
        {
          selectedNode?.type === "IfElseNode" && (
            <IfElseSettings
              key={selectedNode.id}
              selectedNode={selectedNode}
              setupdateFormData={onUpdateIfElseData}
            />
          )
        }
        {selectedNode?.type === "WhileNode" && (
          <WhileLoopSettings
            key={selectedNode.id}
            selectedNode={selectedNode}
            setupdateFormData={onUpdateWhileData}
          />
        )}
        {selectedNode?.type === "UserApprovalNode" && (
          <UserApproval
            key={selectedNode.id}
            selectedNode={selectedNode}
            setupdateFormData={onUpdateUserApprovalData}
          />
        )}
        {selectedNode?.type === "ApiNode" && (
          <ApiSettings
            key={selectedNode.id}
            selectedNode={selectedNode}
            setupdateFormData={onUpdateApiData}
          />
        )}
      </div>
    )
  );
}

export default SettingPanel;
