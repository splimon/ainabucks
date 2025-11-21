/**
 * app/admin/rewards/[id]/edit/page.tsx
 * Page for editing an existing reward
 */

import React from "react";
import { getRewardById } from "@/lib/admin/actions/rewards";
import { EditRewardForm } from "@/components/admin/rewards/EditRewardForm";
import { notFound } from "next/navigation";
import { Reward } from "@/database/schema";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface EditRewardPageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditRewardPage = async ({ params }: EditRewardPageProps) => {
  // Await params before accessing properties
  const { id } = await params;

  // Fetch the reward data
  const result = await getRewardById(id);

  // Handle error or not found case
  if (!result.success || !result.data) {
    notFound();
  }

  const reward = result.data as Reward;

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
        <EditRewardForm reward={reward} />
      </section>
    </>
  );
};

export default EditRewardPage;
