import React from 'react'
import { auth } from '../auth';
import { redirect } from 'next/navigation';

const ProfilePage = async () => {
  // Check if user is authenticated
  const session = await auth();

  if (!session || !session.user) redirect('/');

  return (
    <div className="min-h-[calc(100vh-73px)] bg-linear-to-b from-green-50 to-green-100 py-6">
      <div className="mb-8 max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold leading-tight mb-3">
          Welcome, {session.user.name}!
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-8">
          View your upcoming volunteer events and track your ʻĀina Bucks.
        </p>
        
        {/* User Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Information</h2>
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-semibold">Name:</span> {session.user.name}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Email:</span> {session.user.email}
            </p>
          </div>
        </div>

        {/* Upcoming Events Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
          <p className="text-gray-600">No upcoming events scheduled.</p>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage