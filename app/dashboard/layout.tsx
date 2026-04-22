import React from "react";
import DashboardProvider from "./Provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "./_components/AppSideBar";

function DashboardLayout({ children } : any ){
      return (
           <div>
               <SidebarProvider>
                   <TooltipProvider>
                       <AppSidebar/>
                   </TooltipProvider>
                <DashboardProvider>
                    { children }
                </DashboardProvider>
               </SidebarProvider>
           </div>
      )
}
export default DashboardLayout;