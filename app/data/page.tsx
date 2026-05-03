import React from "react";
import { Database, ArrowUpRight } from "lucide-react";

function Data() {
  return (
    <div className="flex items-center justify-center min-h-[200px] p-6">
      <div className="group relative w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 ease-in-out hover:border-slate-300 hover:shadow-md hover:shadow-slate-200/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-600 transition-colors group-hover:bg-slate-900 group-hover:text-white">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-slate-900">
                System Data
              </h1>
              <p className="text-xs text-slate-500">View real-time analytics</p>
            </div>
          </div>
          <ArrowUpRight className="h-4 w-4 text-slate-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-slate-900" />
        </div>
        
        <div className="mt-6 flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tighter text-slate-900">2,840</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
            +12.5%
          </span>
        </div>
      </div>
    </div>
  );
}

export default Data;