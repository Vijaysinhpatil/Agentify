"use client"
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import React, { useEffect, useState } from "react";
import { UserDetailContext } from "./context/userDetailContext";

export default function Provider ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>){
    const { user } = useUser();
    const [userDetails , setUserDetails] = useState<any>()
    const createUser = useMutation(api.user.CreateNewUser);


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
                  {children}
            </UserDetailContext.Provider>
    )
}