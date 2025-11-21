/**
 * app/admin/rewards/new/page.tsx
 * Page for creating a new reward
 */

import React from "react";
import { RewardCreationForm } from "@/components/admin/rewards/RewardCreationForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const NewRewardPage = () => {
  return (
    <>
      <Button
        asChild
        className="bg-white text-black border border-gray-200 hover:bg-gray-300"
      >
        <Link href="/admin/rewards">
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </Link>
      </Button>

      <section className="w-full max-w">
        <RewardCreationForm />
      </section>
    </>
  );
};

export default NewRewardPage;
