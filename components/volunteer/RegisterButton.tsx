"use client";

import { Button } from "@/components/ui/button";
import {
  registerForEvent,
  cancelRegistration,
} from "@/lib/actions/registrations";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface RegisterButtonProps {
  eventId: string;
  isRegistered: boolean;
  spotsRemaining: number;
  isLoggedIn: boolean;
}

export default function RegisterButton({
  eventId,
  isRegistered,
  spotsRemaining,
  isLoggedIn,
}: RegisterButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    // Redirect to sign-in if not logged in
    if (!isLoggedIn) {
      toast.error("Please sign in to register for events");
      router.push("/sign-in");
      return;
    }

    setIsLoading(true);

    const result = await registerForEvent(eventId);

    if (result.success) {
      toast.success("Successfully registered for event!");
    } else {
      toast.error(result.error || "Failed to register");
    }

    setIsLoading(false);
  };

  const handleCancel = async () => {
    setIsLoading(true);

    const result = await cancelRegistration(eventId);

    if (result.success) {
      toast.success("Registration cancelled successfully");
    } else {
      toast.error(result.error || "Failed to cancel registration");
    }

    setIsLoading(false);
  };

  // If user is already registered, show cancel button
  if (isRegistered) {
    return (
      <Button
        onClick={handleCancel}
        disabled={isLoading}
        variant="outline"
        className="w-full py-6 text-lg font-semibold border-red-300 text-red-600 hover:bg-red-50"
      >
        {isLoading ? "Cancelling..." : "Cancel Registration"}
      </Button>
    );
  }

  // If event is full, show disabled button
  if (spotsRemaining === 0) {
    return (
      <Button disabled className="w-full py-6 text-lg font-semibold">
        Event Full
      </Button>
    );
  }

  // Show register button
  return (
    <Button
      onClick={handleRegister}
      disabled={isLoading}
      className="w-full bg-green-700 hover:bg-green-800 text-white py-6 text-lg font-semibold"
    >
      {isLoading ? "Registering..." : "Register Now"}
    </Button>
  );
}
