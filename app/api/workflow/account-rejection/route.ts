/**
 * app/api/workflow/account-rejection/route.ts
 * Workflow endpoint for sending account rejection emails
 */

import { serve } from "@upstash/workflow/nextjs";
import { sendEmail } from "@/lib/workflow";

type InitialData = {
  email: string;
  fullName: string;
};

export const { POST } = serve<InitialData>(async (context) => {
  const { email, fullName } = context.requestPayload;

  await context.run("send-rejection-email", async () => {
    await sendEmail({
      email: email,
      subject: "ʻĀina Bucks Account Request Update",
      message: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Account Creation Request Denied</h2>
          <p>Dear ${fullName},</p>
          <p>We regret to inform you that your account creation request for ʻĀina Bucks has not been approved at this time.</p>
          <p style="margin-top: 20px; color: #666;">
            If you believe this decision was made in error or have questions, please contact our support team for assistance.
          </p>
          <p style="margin-top: 20px; color: #666;">
            Thank you for your interest in ʻĀina Bucks.
          </p>
        </div>
      `,
    });
  });
});
