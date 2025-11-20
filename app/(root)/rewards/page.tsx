/**
 * app/(root)/rewards/page.tsx
 * Rewards page component that displays a coming soon message.
 */

import React from "react";

const Rewards = () => {
  return (
    <div className="background-gradient">
      <div className="mb-8 max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold leading-tight mb-3 mt-3">Rewards</h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-8">
          Coming Soon!
        </p>
      </div>
    </div>
  );
};

export default Rewards;
