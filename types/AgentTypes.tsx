import { Id } from "@/convex/_generated/dataModel"

export type Agent = {
   _id: Id<"agentTable">;
    _creationTime: number;
    config?: string | undefined
    nodes?: any;
    edges?: any;
    name: string;
    agentId: string;
    published: boolean;
    userId: Id<"users">;
    agentToolConfig?: any;
}