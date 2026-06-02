import React from "react"
import MyAgents from "../_components/MyAgents";

function MyAgentsPage() {
     return (
         <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(254,240,138,0.18),_transparent_28%),linear-gradient(180deg,_#fffdf7_0%,_#ffffff_42%,_#f8fafc_100%)] px-4 py-8 sm:px-6 lg:px-10">
              <div className="mx-auto max-w-7xl">
                   <section className="overflow-hidden rounded-[32px] border border-amber-100/70 bg-white/80 p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-8">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                             <div className="max-w-2xl">
                                  <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
                                       Dashboard
                                  </span>

                                  <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                       My Agents
                                  </h1>

                                  <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
                                       View, organize, and jump back into the AI agents you have already created.
                                  </p>
                             </div>

                             <div className="rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-sm text-slate-600 shadow-sm">
                                  Your workspace stays synced with the latest agent activity.
                             </div>
                        </div>
                   </section>

                   <section className="mt-8 overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/90 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_20px_50px_rgba(15,23,42,0.08)] ring-1 ring-white/70">
                        <MyAgents />
                   </section>
              </div>
         </main>
     )
}
export default MyAgentsPage;
