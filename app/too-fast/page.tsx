/*
 * /app/too-fast/page.tsx
 * Displays a message to users who are making requests too quickly.
 * Used in conjunction with rate limiting to inform users to slow down.
 */

import React from "react";

const TooFast = () => {
  return (
    <div className="flex flex-col justify-center items-center px-6 min-h-screen bg-linear-to-b from-green-50 to-green-100 py-6">
      <h1 className="text-4xl font-bold leading-tight mb-3">
        Whoa, too fast! Please slow down.
      </h1>
      <p>
        You&apos;ve made too many requests too quickly. We&apos;ve put a
        temporary pause on your excitement.
      </p>
      <p>🚦 Chill for a bit, and try again shortly</p>
    </div>
  );
};

export default TooFast;
