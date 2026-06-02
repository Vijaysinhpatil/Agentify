"use client"
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
    const initializedEmailRef = useRef<string | null>(null);

    const CreateAndGetUser = useCallback(async() => {
          const email = user?.primaryEmailAddress?.emailAddress ?? "";

          if(user && email){
              const result = await createUser({
                name : user?.fullName ?? "",
                email,
              })

            initializedEmailRef.current = email;
            setUserDetails(result);
          }
    }, [createUser, user])

    useEffect(() => {
        const email = user?.primaryEmailAddress?.emailAddress ?? "";

        if (email && initializedEmailRef.current !== email) {
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
