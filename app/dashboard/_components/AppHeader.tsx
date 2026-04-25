import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import React from "react";

function AppHeader() {
    return (
        <div className="flex justify-between items-center w-full 
                        px-6 py-3 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors" />
                <div className="h-4 w-[1px] bg-slate-200 hidden md:block" />
                <span className="text-xs font-medium text-slate-400 hidden md:block uppercase tracking-wider">Workspace</span>
            </div>
            <div className="flex items-center gap-4">
                {/* Optional: Add a 'New' button or Search here for better layout balance */}
                <UserButton 
                    appearance={{
                        elements: {
                            avatarBox: "size-8 rounded-lg border border-slate-200 shadow-sm"
                        }
                    }}
                />
            </div>
        </div>
    )
}

export default AppHeader;