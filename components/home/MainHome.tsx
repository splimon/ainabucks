import React from "react";

const MainHome = () => {
  return (
    <main className="min-h-[calc(100vh-73px)] bg-linear-to-b from-green-50 to-green-100 flex items-center">
      <div className="max-w-6xl mx-auto px-6 w-full">
        {/* Hero Content */}
        <div className="text-center space-y-8">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            <span className="text-gray-900">Earn Rewards for </span>
            <span className="text-green-700">Helping Your Community</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Join ʻĀina Bucks and transform your volunteer hours into meaningful
            rewards. Contribute to community projects, earn bucks, and redeem
            them for local goods and services.
          </p>

          {/* CTA Button */}
          <div className="pt-6">
            <button className="px-10 py-4 bg-green-700 text-white text-sm font-semibold rounded-lg hover:bg-green-800 transition-all hover:scale-105 shadow-lg">
              Browse Opportunities
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainHome;
