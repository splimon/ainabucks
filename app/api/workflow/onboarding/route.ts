/*
 * Welcome email workflow - sends a one-time welcome email to new users.
 * Uses Upstash Workflow.
 */
import { serve } from "@upstash/workflow/nextjs";
import { sendEmail } from "@/lib/workflow";

type InitialData = {
  email: string;
  fullName: string;
};

// Define the POST handler for sending welcome email
export const { POST } = serve<InitialData>(async (context) => {
  const { email, fullName } = context.requestPayload;

  // Send newly signed up user a welcome email
  await context.run("new-signup", async () => {
    await sendEmail({
      email: email,
      subject: "Welcome to 'Āina Bucks!",
      message: `Welcome ${fullName}!`,
    });
  });
});
