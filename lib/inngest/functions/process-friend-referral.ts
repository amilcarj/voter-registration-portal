import { inngest, referralSubmitted } from "@/lib/inngest/client";
import { sendReferEmail } from "@/services/send-email";

export default inngest.createFunction(
  {
    id: "process-friend-referral",
    retries: 3,
    triggers: {
      event: referralSubmitted,
    },
  },
  async ({ event, step }) => {
    const { jobId, email, firstName, lastName, referredEmail } = event.data;
    await step.run("send-referral-email", async () => {
      await sendReferEmail({
        email,
        firstName,
        lastName,
        referredEmail,
      });
    });

    return {
      jobId,
      success: true,
    };
  },
);
