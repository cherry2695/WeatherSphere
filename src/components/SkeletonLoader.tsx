/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

export function SkeletonPulse() {
  return (
    <div className="animate-pulse bg-slate-300 dark:bg-slate-800 rounded-md h-full w-full" />
  );
}

export function WeatherSphereSkeleton() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full px-4 py-8">
      {/* Search & Hero Shimmer */}
      <div className="flex flex-col items-center justify-center space-y-6 py-12">
        <div className="h-10 w-64 bg-slate-200 dark:bg-[#1e293b]/50 rounded-full animate-pulse" />
        <div className="h-8 w-48 bg-slate-200 dark:bg-[#1e293b]/50 rounded-md animate-pulse" />
        <div className="h-28 w-40 bg-slate-300 dark:bg-[#1e293b]/60 rounded-xl animate-pulse" />
        <div className="h-6 w-36 bg-slate-200 dark:bg-[#1e293b]/50 rounded-md animate-pulse" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main 10-Day Panel Shimmer */}
        <div className="md:col-span-1 p-6 rounded-[28px] bg-slate-100/60 dark:bg-[#141e30]/40 border border-white/5 animate-pulse space-y-4">
          <div className="h-5 w-32 bg-slate-300 dark:bg-[#1e293b]/60 rounded" />
          <hr className="border-slate-200 dark:border-slate-800" />
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex justify-between items-center h-10">
              <div className="h-4 w-12 bg-slate-200 dark:bg-[#1e293b]/40 rounded" />
              <div className="h-6 w-6 bg-slate-300 dark:bg-[#1e293b]/50 rounded-full" />
              <div className="h-4 w-32 bg-slate-200 dark:bg-[#1e293b]/40 rounded" />
            </div>
          ))}
        </div>

        {/* Highlight Widgets Shimmer */}
        <div className="md:col-span-2 space-y-6">
          <div className="h-48 rounded-[28px] bg-slate-100/60 dark:bg-[#141e30]/40 border border-white/5 animate-pulse p-6">
            <div className="h-5 w-36 bg-slate-300 dark:bg-[#1e293b]/60 rounded mb-4" />
            <div className="flex space-x-4 overflow-x-auto h-28 items-center">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="min-w-[80px] h-full bg-slate-200 dark:bg-[#1e293b]/40 rounded-xl" />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 rounded-2xl bg-slate-100/60 dark:bg-[#141e30]/40 border border-white/5 animate-pulse p-4 flex flex-col justify-between">
                <div className="h-3 w-16 bg-slate-300 dark:bg-[#1e293b]/60 rounded" />
                <div className="h-8 w-20 bg-slate-300 dark:bg-[#1e293b]/65 rounded" />
                <div className="h-3 w-24 bg-slate-200 dark:bg-[#1e293b]/45 rounded" />
              </div>
            ))}
          </div>

          {/* Map area outline placeholder */}
          <div className="h-[400px] rounded-[28px] bg-slate-100/60 dark:bg-[#141e30]/40 border border-white/5 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
