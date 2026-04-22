"use client"

import * as React from "react"
import { useContext } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { UserButton } from "@clerk/nextjs"
import { Database, Gem, Headphones, LayoutDashboard, User, WalletCards } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { UserDetailContext } from "@/app/context/userDetailContext"



export function AppSidebar() {
  const { state } = useSidebar();
  const isOpen = state === "expanded";
  const { userDetails , setUserDetails } = useContext(UserDetailContext)

  const MenuOptions = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "AI Agent", url: "#", icon: Headphones },
    { title: "Pricing", url: "#", icon: WalletCards },
    { title: "Data", url: "#", icon: Database },
    { title: "Profile", url: "#", icon: User }
  ]

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard" className="flex items-center gap-3">
                <div className="flex aspect-square size-8 items-center justify-center">
                  <Image src="/logo.svg" alt="Logo" width={32} height={32} className="shrink-0" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-base">Agentify</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-4"> {/* Adjusted gap for better spacing */}
              {MenuOptions.map((menu, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild tooltip={menu.title}>
                    <Link href={menu.url}>
                      <menu.icon />
                      <span>{menu.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className={`flex items-center gap-2 px-2 py-1.5 ${!isOpen && "justify-center"}`}>
              <Gem className="size-5 text-primary" />
              {isOpen && (
                <div className="flex flex-row items-center gap-2">
                  <p className="text-xs text-muted-foreground">Credits : </p>
                  <p className="text-sm font-bold">{userDetails?.token}</p>
                </div>
              )}
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem className="mt-2">
             <div className={`flex items-center gap-2 px-2 ${!isOpen && "justify-center"}`}>
                <UserButton />
                {isOpen && <span className="text-sm font-medium">Account</span>}
             </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}