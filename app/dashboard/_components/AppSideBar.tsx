"use client"

import * as React from "react"
import { useCallback, useContext, useEffect } from "react"
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
import { useAuth, UserButton } from "@clerk/nextjs"
import {
  BarChart3,
  Database,
  Gem,
  Headphones,
  LayoutDashboard,
  User,
  WalletCards,
  Zap,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"
import { UserDetailContext } from "@/app/context/userDetailContext"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { useConvex } from "convex/react"
import { api } from "@/convex/_generated/api"

type Props = {
  isAdmin?: boolean;
};

export function AppSidebar({ isAdmin = false }: Props) {
  const { state } = useSidebar()
  const isOpen = state === "expanded"
  const { userDetails , setUserDetails } = useContext(UserDetailContext)
  const path = usePathname()
  const { has } =  useAuth();
  const isPaidUser = has({plan : "unlimited_plan"})

  const convex = useConvex();
  const [ totalRemainingTokens , setTotalRemainingTokens ] = React.useState(0)

  const GetUserAgent = useCallback(async () => {
    if (!userDetails?._id) {
      return;
    }

    const result = await convex.query(api.agent.getUserAgents, {
          userId : userDetails?._id
    })

    const nextRemainingCredits = 2 - Number(result?.length || 0);
    setTotalRemainingTokens(nextRemainingCredits)
    setUserDetails((prev : any) => {
      if (!prev || prev.remainingCredits === nextRemainingCredits) {
        return prev;
      }

      return { ...prev, remainingCredits: nextRemainingCredits };
    })
  }, [convex, setUserDetails, userDetails?._id])

  useEffect(() => {
    if (!userDetails?._id) {
      return;
    }

    if (isPaidUser) {
      setTotalRemainingTokens(0);
      return;
    }

    void GetUserAgent();
  }, [GetUserAgent, isPaidUser, userDetails?._id])



  const MenuOptions = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "AI Agent", url: "/dashboard/my-agents", icon: Headphones },
    { title: "Pricing", url: "/dashboard/pricing", icon: WalletCards },
    { title: "Data", url: "/dashboard/data", icon: Database },
    { title: "Profile", url: "/dashboard/profile", icon: User }
  ]

  if (isAdmin) {
    MenuOptions.splice(1, 0, {
      title: "Admin",
      url: "/dashboard/admin",
      icon: BarChart3,
    })
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-zinc-200 bg-white">

      {/* HEADER */}
      <SidebarHeader
        className={`
          py-8 transition-all duration-300
          ${isOpen ? "px-3" : "px-0 flex justify-center"}
        `}
      >
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className={`hover:bg-transparent ${!isOpen && "justify-center"}`}
            >
              <Link href="/dashboard" className="flex items-center gap-3 ml-1.5">
                <div className="flex size-10 items-center justify-center rounded-full bg-zinc-950 shadow shrink-0 ">
                  <Zap className="size-5 text-white fill-white" />
                </div>

                {isOpen && (
                  <div className="grid text-left leading-tight">
                    <span className="font-bold text-xl text-zinc-900">
                      Agentify
                    </span>
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
                      Enterprise
                    </span>
                  </div>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent
        className={`transition-all duration-300 ${isOpen ? "px-3" : "px-0"}`}
      >
        {/* BACK TO HOME SECTION */}
        <SidebarGroup className="pb-0">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Back to Home"
                className={`
                  text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/50 transition-all
                  ${!isOpen && "justify-center px-0 w-full"}
                `}
              >
                <Link href="/" className={`flex items-center ${isOpen ? "gap-4" : "justify-center w-full"}`}>
                  <ArrowLeft className="size-4 shrink-0" />
                  {isOpen && (
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Back to Home
                    </span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          {isOpen && (
            <SidebarGroupLabel className="text-zinc-400 font-bold px-4 mb-6 text-[10px] uppercase tracking-widest">
              System Console
            </SidebarGroupLabel>
          )}

          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {MenuOptions.map((menu, index) => {
                const isActive = path === menu.url

                return (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton
                      asChild
                      tooltip={menu.title}
                      className={`
                        py-6 rounded-xl transition-all duration-300 group
                        ${isActive
                          ? "bg-indigo-50/50 text-indigo-700"
                          : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"}
                        ${!isOpen && "justify-center px-0 w-full"}
                      `}
                    >
                      <Link
                        href={menu.url}
                        className={`
                          flex items-center
                          ${isOpen ? "gap-4" : "justify-center w-full"}
                        `}
                      >
                        {/* ICON */}
                        <div
                          className={`
                            flex size-9 items-center justify-center rounded-lg border transition-all shrink-0
                            ${isActive
                              ? "bg-white border-indigo-200 shadow-sm"
                              : "bg-transparent border-transparent group-hover:border-zinc-200 group-hover:bg-white"}
                          `}
                        >
                          <menu.icon
                            className={`size-4 ${
                              isActive
                                ? "text-indigo-600"
                                : "text-zinc-400 group-hover:text-zinc-600"
                            }`}
                          />
                        </div>

                        {/* TEXT */}
                        {isOpen && (
                          <>
                            <span className="font-semibold text-sm">
                              {menu.title}
                            </span>
                            {isActive && (
                              <div className="ml-auto size-1.5 rounded-full bg-indigo-600" />
                            )}
                          </>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter
        className={`
          py-4 border-t border-zinc-100 transition-all duration-300
          ${isOpen ? "px-4" : "px-0 flex flex-col items-center"}
        `}
      >
        <SidebarMenu className="gap-5 w-full">

          {/* BALANCE */}
          <SidebarMenuItem>
            <div
              className={`
                flex items-center gap-3 p-3 rounded-2xl transition-all
                ${isOpen
                  ? "bg-zinc-50 border border-zinc-200 justify-between"
                  : "justify-center w-full bg-transparent border-transparent"}
              `}
            >
              <div className="flex items-center gap-3">
                <div className="size-8 flex items-center justify-center bg-white rounded-lg border shadow-sm">
                  <Gem className="size-4 text-zinc-700" />
                </div>

                {isOpen && (
                  <div className="flex flex-col">
                    <p className="text-[9px] font-black text-zinc-400 uppercase">
                      Balance
                    </p>
                    <p className="text-sm font-bold text-zinc-900">
                      {totalRemainingTokens ?? 0}/2
                      <span className="text-[10px] text-zinc-400 ml-1">
                        USD
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </SidebarMenuItem>

          {/* UPGRADE */}
          <SidebarMenuItem>
            {isOpen && isPaidUser? (
             <div className="ml-0.5 flex items-center justify-center font-bold text-sm bg-zinc-950 text-white px-4 py-3 rounded-xl  ">
                {/* <Plus className="text-white size-5" /> */}
                <h2>You can create unlimited agents</h2>
              </div>
            ) : (
               <Link
                href="/dashboard/pricing"
                className="ml-0.5 flex items-center justify-center font-bold text-sm bg-zinc-950 text-white px-4 py-3 rounded-xl  "
              >
                Upgrade Pro
              </Link>
            )}
          </SidebarMenuItem>

          {/* USER */}
          <SidebarMenuItem className="flex justify-center py-2">
            <div className="p-1 rounded-full border bg-zinc-50">
              <UserButton
                appearance={{ elements: { avatarBox: "size-8 rounded-full" } }}
              />
            </div>
          </SidebarMenuItem>

        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
