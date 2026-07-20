import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="w-full rounded-[24px] bg-white/4 border border-white/8 backdrop-blur-xl p-7 relative flex flex-col justify-between h-[360px] animate-pulse overflow-hidden select-none">
      {/* Top Accent Line Shimmer */}
      <div className="absolute top-0 left-0 w-full h-1 bg-white/5" />

      {/* Shimmer Effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />

      <div className="flex flex-col gap-5">
        {/* Top bar: logo + category */}
        <div className="flex justify-between items-start">
          <div className="w-12 h-12 rounded-xl bg-white/10" />
          <div className="w-20 h-6 rounded-full bg-white/10" />
        </div>

        {/* Title / Subtitle */}
        <div className="flex flex-col gap-2.5">
          <div className="w-3/4 h-6 rounded bg-white/10" />
          <div className="w-1/2 h-4 rounded bg-white/10" />
        </div>

        {/* Stats Row */}
        <div className="flex gap-4 border-y border-white/5 py-3.5 mt-2">
          <div className="w-20 h-4 rounded bg-white/10" />
          <div className="w-24 h-4 rounded bg-white/10" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mt-6">
        <div className="flex-1 h-12 rounded-xl bg-white/10" />
        <div className="w-14 h-12 rounded-xl bg-white/10" />
      </div>
    </div>
  );
};

const Skeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-full">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
};

export default Skeleton;
