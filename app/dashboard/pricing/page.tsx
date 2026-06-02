import { PricingTable } from "@clerk/nextjs";
import React from "react";

function Pricing() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-12">
        
        {/* Header Section */}
        <section className="flex flex-col gap-8 border-b border-gray-200 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
              Pricing Plans
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Choose the setup that fits your agent workflow.
            </h1>
            <p className="text-base text-gray-600">
              Compare plans, unlock higher usage limits, and scale from
              experiments to production without leaving your dashboard.
            </p>
          </div>

          {/* Quick Info Grid */}
          <div className="grid gap-4 sm:grid-cols-3 lg:min-w-[360px]">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Billing
              </p>
              <p className="mt-1 font-medium text-gray-900">Self-serve plans</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Access
              </p>
              <p className="mt-1 font-medium text-gray-900">Instant upgrades</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Support
              </p>
              <p className="mt-1 font-medium text-gray-900">Managed in Clerk</p>
            </div>
          </div>
        </section>

        {/* Pricing Table Section */}
        <section className="mx-auto max-w-5xl">
          <PricingTable />
        </section>

      </div>
    </main>
  );
}

export default Pricing;