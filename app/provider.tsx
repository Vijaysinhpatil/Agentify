"use client"
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import React, { useEffect, useState } from "react";
import { UserDetailContext } from "./context/userDetailContext";
import { WorkflowContext } from "./context/WorkflowContext";
import { Position } from "@xyflow/react";

export default function Provider ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>){
    const { user } = useUser();
    const [userDetails , setUserDetails] = useState<any>()
    const createUser = useMutation(api.user.CreateNewUser);
    const [ addedNodes , setAddedNodes ] = useState([{
        id : 'start',
        position : { x : 0 , y : 0},
        data : { label : 'Start' } ,
        type : 'StartNode '
    }])

    const [ nodeEdge , setNodeedges ] = useState([]);

    useEffect(() => {
        user && CreateAndGetUser();
    } , [user])
    const CreateAndGetUser = async() => {
          if(user){
              const result = await createUser({
                name : user?.fullName ?? "",
                email : user.primaryEmailAddress?.emailAddress ?? "",
              })

               console.log(result);
            //   save to Context
            setUserDetails(result);
          }
    }
    return(
        
           <UserDetailContext.Provider value={{userDetails,setUserDetails}}>
               <WorkflowContext.Provider value={{ addedNodes , setAddedNodes , nodeEdge , setNodeedges }}>
                 {children}
               </WorkflowContext.Provider>
                 
            </UserDetailContext.Provider>
    )
}