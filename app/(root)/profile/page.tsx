/*
 * app/(root)/profile/page.tsx
 * User profile page displaying upcoming events and ʻĀina Bucks info
 */

import React from "react";
import { auth } from "../auth";
import { redirect } from "next/navigation";
import { getUserUpcomingEvents } from "@/lib/actions/registrations";
import {
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  Award,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { db } from "@/database/drizzle";
import {
  usersTable,
  ainaBucksTransactionsTable,
  eventsTable,
} from "@/database/schema";
import { eq, desc } from "drizzle-orm";

const ProfilePage = async () => {
  // Check if user is authenticated
  const session = await auth();

  // Redirect to home page if not authenticated
  if (!session || !session.user?.id) redirect("/");

  // Fetch user data with ʻĀina Bucks info
  const [userData] = await db
    .select({
      totalAinaBucksEarned: usersTable.totalAinaBucksEarned,
      totalAinaBucksRedeemed: usersTable.totalAinaBucksRedeemed,
      currentAinaBucks: usersTable.currentAinaBucks,
      totalHoursVolunteered: usersTable.totalHoursVolunteered,
    })
    .from(usersTable)
    .where(eq(usersTable.id, session.user.id))
    .limit(1);

  // Fetch user's upcoming events
  const upcomingEvents = await getUserUpcomingEvents(session.user.id);

  // Fetch recent transactions
  const recentTransactions = await db
    .select({
      id: ainaBucksTransactionsTable.id,
      type: ainaBucksTransactionsTable.type,
      amount: ainaBucksTransactionsTable.amount,
      description: ainaBucksTransactionsTable.description,
      hoursWorked: ainaBucksTransactionsTable.hoursWorked,
      createdAt: ainaBucksTransactionsTable.createdAt,
      eventTitle: eventsTable.title,
    })
    .from(ainaBucksTransactionsTable)
    .leftJoin(
      eventsTable,
      eq(ainaBucksTransactionsTable.eventId, eventsTable.id),
    )
    .where(eq(ainaBucksTransactionsTable.userId, session.user.id))
    .orderBy(desc(ainaBucksTransactionsTable.createdAt))
    .limit(10);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Helper function to format time
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Helper function to format transaction date
  const formatTransactionDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const totalHours = userData?.totalHoursVolunteered
    ? parseFloat(userData.totalHoursVolunteered.toString())
    : 0;

  return (
    <div className="background-gradient">
      <div className="mb-8 max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <h1 className="text-4xl font-bold leading-tight mb-3 mt-3">
          Welcome back, {session.user.name}! 🤗
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-8">
          View your upcoming volunteer events and track your ʻĀina Bucks.
        </p>

        {/* User Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Profile Information
          </h2>
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-semibold">Name:</span> {session.user.name}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Email:</span> {session.user.email}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Current Balance */}
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 group">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-linear-to-br from-orange-100 to-orange-200 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-2">
              Current Balance
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {userData?.currentAinaBucks || 0}
            </p>
            <p className="text-gray-500 text-xs mt-1">ʻĀina Bucks</p>
          </div>

          {/* Total Earned */}
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 group">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-linear-to-br from-green-100 to-emerald-100 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-2">
              Total Earned
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {userData?.totalAinaBucksEarned || 0}
            </p>
            <p className="text-gray-500 text-xs mt-1">ʻĀina Bucks</p>
          </div>

          {/* Total Redeemed */}
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 group">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-linear-to-br from-blue-100 to-blue-200 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-2">
              Total Redeemed
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {userData?.totalAinaBucksRedeemed || 0}
            </p>
            <p className="text-gray-500 text-xs mt-1">ʻĀina Bucks</p>
          </div>

          {/* Total Hours */}
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 group">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-linear-to-br from-purple-100 to-purple-200 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-2">
              Total Hours
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {totalHours.toFixed(1)}
            </p>
            <p className="text-gray-500 text-xs mt-1">Hours Volunteered</p>
          </div>
        </div>

        {/* Upcoming Events Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-linear-to-br">
              <Calendar className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Upcoming Events ({upcomingEvents.length})
            </h2>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-4 text-lg font-medium">
                No upcoming events scheduled.
              </p>
              <Link href="/volunteer">
                <Button className="bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-300">
                  Browse Volunteer Opportunities
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingEvents.map((event: any) => {
                const duration =
                  typeof event.duration === "string"
                    ? parseFloat(event.duration)
                    : event.duration;

                return (
                  <Link
                    key={event.id}
                    href={`/volunteer/${event.id}`}
                    className="block"
                  >
                    <div className="border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-green-300 transition-all duration-300 bg-linear-to-br from-white to-gray-50">
                      <div className="flex gap-4">
                        {/* Event Image */}
                        {event.imageUrl && (
                          <div className="w-28 h-28 rounded-xl overflow-hidden shrink-0 shadow-md">
                            <img
                              src={event.imageUrl}
                              alt={event.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}

                        {/* Event Details */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <span className="inline-block px-3 py-1 bg-linear-to-r from-green-100 to-emerald-100 text-green-700 text-xs font-semibold rounded-full mb-2">
                                {event.category}
                              </span>
                              <h3 className="text-lg font-bold text-gray-900 hover:text-green-600 transition-colors">
                                {event.title}
                              </h3>
                            </div>
                            <div className="text-right bg-linear-to-br from-green-50 to-emerald-50 px-4 py-2 rounded-xl">
                              <div className="flex items-center gap-1 text-green-600">
                                <DollarSign className="w-5 h-5" />
                                <span className="font-bold text-lg">
                                  {event.ainaBucks}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600">
                                ʻĀina Bucks
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg">
                              <div className="bg-green-50 p-1.5 rounded-lg">
                                <Calendar className="w-4 h-4 text-green-600" />
                              </div>
                              <span>{formatDate(event.date)}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg">
                              <div className="bg-green-50 p-1.5 rounded-lg">
                                <Clock className="w-4 h-4 text-green-600" />
                              </div>
                              <span>
                                {formatTime(event.startTime)} -{" "}
                                {formatTime(event.endTime)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg">
                              <div className="bg-green-50 p-1.5 rounded-lg">
                                <MapPin className="w-4 h-4 text-green-600" />
                              </div>
                              <span>{event.locationName}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-linear-to-br">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Recent Transactions
            </h2>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-2 text-lg font-medium">
                No transactions yet
              </p>
              <p className="text-sm text-gray-500">
                Earn ʻĀina Bucks by attending volunteer events!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="border border-gray-200 rounded-xl p-5 hover:bg-linear-to-br hover:from-gray-50 hover:to-white hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {transaction.type === "EARNED" && (
                          <span className="px-3 py-1 bg-linear-to-r from-green-100 to-emerald-100 text-green-700 text-xs font-semibold rounded-full">
                            Earned
                          </span>
                        )}
                        {transaction.type === "REDEEMED" && (
                          <span className="px-3 py-1 bg-linear-to-r from-blue-100 to-blue-200 text-blue-700 text-xs font-semibold rounded-full">
                            Redeemed
                          </span>
                        )}
                        {transaction.type === "ADJUSTED" && (
                          <span className="px-3 py-1 bg-linear-to-r from-purple-100 to-purple-200 text-purple-700 text-xs font-semibold rounded-full">
                            Adjusted
                          </span>
                        )}
                        <span className="text-xs text-gray-500 font-medium">
                          {formatTransactionDate(transaction.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-900 font-semibold mb-1">
                        {transaction.description}
                      </p>
                      {transaction.hoursWorked && (
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {parseFloat(
                            transaction.hoursWorked.toString(),
                          ).toFixed(1)}{" "}
                          hours worked
                        </p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <div
                        className={`px-4 py-2 rounded-xl ${
                          transaction.amount > 0
                            ? "bg-linear-to-br from-green-50 to-emerald-50"
                            : "bg-linear-to-br from-red-50 to-orange-50"
                        }`}
                      >
                        <p
                          className={`text-2xl font-bold ${
                            transaction.amount > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.amount > 0 ? "+" : ""}
                          {transaction.amount}
                        </p>
                        <p className="text-xs text-gray-600 font-medium">
                          ʻĀina Bucks
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
