import React from "react";
import DashboardProvider from "./Provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "./_components/AppSideBar";
import { Toaster } from "sonner";

function DashboardLayout({ children }: any) {
  return (
    <div>
      <SidebarProvider>
        <TooltipProvider>
          <AppSidebar />

          <DashboardProvider>
            {children}

            <Toaster
              position="top-right"
              richColors
              closeButton
            />
          </DashboardProvider>
        </TooltipProvider>
      </SidebarProvider>
    </div>
  );
}

export default DashboardLayout;