import { Id } from "@/convex/_generated/dataModel"

export type Agent = {
    _id : Id<"agentTable"> ,
    agentId : string,
    config? : string | undefined,
    published : boolean ,
    name : string ,
    userId : string ,
    _creationTime : number
}