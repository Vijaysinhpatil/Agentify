"use client"
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import React, { useCallback, useEffect, useState } from "react";
import { UserDetailContext } from "./context/userDetailContext";
import { WorkflowContext } from "./context/WorkflowContext";
import { Edge, Node, ReactFlowProvider } from "@xyflow/react";

export default function Provider ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>){
    const { user } = useUser();
    const [userDetails , setUserDetails] = useState<unknown>()
    const createUser = useMutation(api.user.CreateNewUser);
    const [selectedNode , setSelectedNode] = useState<Node | null>(null);
    const [ addedNodes , setAddedNodes ] = useState<Node[]>([])

    const [ nodeEdge , setNodeedges ] = useState<Edge[]>([]);

    const CreateAndGetUser = useCallback(async() => {
          if(user){
              const result = await createUser({
                name : user?.fullName ?? "",
                email : user.primaryEmailAddress?.emailAddress ?? "",
              })

               console.log(result);
            //   save to Context
            setUserDetails(result);
          }
    }, [createUser, user])

    useEffect(() => {
        if (user) {
          void CreateAndGetUser();
        }
    } , [CreateAndGetUser, user])
    return(
        
           <UserDetailContext.Provider value={{userDetails,setUserDetails}}>

               <ReactFlowProvider>
                    
                      <WorkflowContext.Provider value={{ addedNodes , setAddedNodes , nodeEdge , setNodeedges , selectedNode , setSelectedNode }}>
                        {children}
                      </WorkflowContext.Provider>
 
               </ReactFlowProvider>
               
                 
            </UserDetailContext.Provider>
    )
}
