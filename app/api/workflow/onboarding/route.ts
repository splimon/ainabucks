/*
 * Onboarding workflow to send welcome email and periodic follow-ups based on user activity.
 * Uses Upstash Workflow.
 * Referenced: https://upstash.com/docs/workflow/examples/customerOnboarding
 */

import { serve } from "@upstash/workflow/nextjs";

type InitialData = {
  email: string;
};

export const { POST } = serve<InitialData>(async (context) => {
  const { email } = context.requestPayload;

  // Send newly signed up user a welcome email
  await context.run("new-signup", async () => {
    await sendEmail("Welcome to the platform", email);
  });

  // Wait for 3 days before checking user state
  await context.sleep("wait-for-3-days", 60 * 60 * 24 * 3);

  // Periodically check user state and send relevant emails
  while (true) {
    // Check user state
    const state = await context.run("check-user-state", async () => {
      return await getUserState();
    });

    // If user is non-active, send re-engagement email
    if (state === "non-active") {
      await context.run("send-email-non-active", async () => {
        await sendEmail("Email to non-active users", email);
      });

      // If user is active, send newsletter email
    } else if (state === "active") {
      await context.run("send-email-active", async () => {
        await sendEmail("Send newsletter to active users", email);
      });
    }

    // Wait for 1 month before next check
    await context.sleep("wait-for-1-month", 60 * 60 * 24 * 30);
  }
});

async function sendEmail(message: string, email: string) {
  // Implement email sending logic here
  console.log(`Sending ${message} email to ${email}`);
}

type UserState = "non-active" | "active";

const getUserState = async (): Promise<UserState> => {
  // Implement user state logic here
  return "non-active";
};
