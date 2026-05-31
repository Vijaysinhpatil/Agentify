import StartNode from "./StartNode";
import AgentNode from "./AgentNode";
import EndNode from "./EndNode";
import IfElseNode from "./IfElseNode";
import WhileNode from "./WhileNode";
import UserApprovalNode from "./UserApprovelNode";
import ApiNode from "./ApiNode";

export const nodeTypes = {
  StartNode,
  AgentNode,
  EndNode,
  IfElseNode,
  WhileNode,
  UserApprovalNode,
  ApprovalNode: UserApprovalNode,
  userApprovalNode: UserApprovalNode,
  UserApproval: UserApprovalNode,
  userApproval: UserApprovalNode,
  userApprovelNode: UserApprovalNode,
  UserApprovelNode: UserApprovalNode,
  ApiNode,
  apiNode: ApiNode,
};
