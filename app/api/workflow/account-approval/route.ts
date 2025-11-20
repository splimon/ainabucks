/**
 * app/api/workflow/account-approval/route.ts
 * Workflow endpoint for sending account approval emails
 */

import { serve } from "@upstash/workflow/nextjs";
import { sendEmail } from "@/lib/workflow";
import config from "@/lib/config";

type InitialData = {
  email: string;
  fullName: string;
};

export const { POST } = serve<InitialData>(async (context) => {
  const { email, fullName } = context.requestPayload;

  await context.run("send-approval-email", async () => {
    const profileUrl = `${config.env.prodApiEndpoint}/profile`;

    await sendEmail({
      email: email,
      subject: "Welcome to ʻĀina Bucks! Your Account Has Been Approved",
      message: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Welcome to ʻĀina Bucks, ${fullName}!</h2>
          <p>Great news! Your account has been approved by our team.</p>
          <p>You can now:</p>
          <ul>
            <li>Browse and register for volunteer opportunities</li>
            <li>Earn ʻĀina Bucks by attending events</li>
            <li>Redeem rewards with your earned bucks</li>
          </ul>
          <p style="margin-top: 20px;">
            <a href="${profileUrl}" style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Go to Your Profile
            </a>
          </p>
          <p style="margin-top: 20px; color: #666;">
            Thank you for joining our community and making a difference!
          </p>
        </div>
      `,
    });
  });
});
