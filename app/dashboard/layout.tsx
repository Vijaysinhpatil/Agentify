import React, { ReactNode } from "react";
import DashboardProvider from "./Provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "./_components/AppSideBar";
import { Toaster } from "sonner";
import { getCurrentUserAdminState } from "@/lib/admin";

async function DashboardLayout({ children }: { children: ReactNode }) {
  const { isAdmin } = await getCurrentUserAdminState();

  return (
    <div>
      <SidebarProvider>
        <TooltipProvider>
          <AppSidebar isAdmin={isAdmin} />

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
