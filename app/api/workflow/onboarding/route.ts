/*
 * Welcome email workflow - sends a pending approval email to new users.
 * Uses Upstash Workflow.
 */
import { serve } from "@upstash/workflow/nextjs";
import { sendEmail } from "@/lib/workflow";

type InitialData = {
  email: string;
  fullName: string;
};

// Define the POST handler for sending pending approval email
export const { POST } = serve<InitialData>(async (context) => {
  const { email, fullName } = context.requestPayload;

  // Send newly signed up user a pending approval email
  await context.run("new-signup-pending", async () => {
    await sendEmail({
      email: email,
      subject: "Thank You for Creating Your ʻĀina Bucks Account",
      message: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Thank You, ${fullName}!</h2>
          <p>Thank you for creating your ʻĀina Bucks account.</p>
          <p>Your account is currently pending approval from our administrator team. We will notify you via email once your account has been reviewed.</p>
          <p style="margin-top: 20px; color: #666;">
            This usually takes 1-2 business days. We appreciate your patience!
          </p>
          <p style="margin-top: 20px; color: #666;">
            If you have any questions, please don't hesitate to reach out to our support team.
          </p>
        </div>
      `,
    });
  });
});
