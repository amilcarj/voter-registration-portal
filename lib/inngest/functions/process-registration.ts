import { type GetStepTools } from "inngest";

import {
  ERROR_MESSAGES,
  JOB_STATUS,
  VOTER_CONFIRMATIONS_STORAGE_KEY,
} from "@/constants/worker-processing";
import { inngest } from "@/lib/inngest/client";
import { supabaseClient } from "@/lib/supabase";
import { claimCouponAtomic } from "@/services/claim-coupon";
import { sendManualReviewEmail, sendSuccessEmail } from "@/services/send-email";
import { verifyDocument } from "@/services/verfiy-document";
import {
  ReferredRegistrationPayload,
  SelfRegistrationPayload,
} from "@/types/inngest";

type StepTools = GetStepTools<typeof inngest>;

export const executeProcessRegistration = async ({
  event,
  mainRegistrantEmail,
  referredPersonEmail,
  step,
}: {
  event: { data: SelfRegistrationPayload | ReferredRegistrationPayload };
  mainRegistrantEmail: string;
  referredPersonEmail: string | null;
  step: StepTools;
}) => {
  const { jobId, firstName, lastName, imagePath } = event.data;

  const verification = await step.run("validate-registration", async () => {
    const { data: blob, error } = await supabaseClient.storage
      .from(VOTER_CONFIRMATIONS_STORAGE_KEY)
      .download(imagePath);

    if (error || !blob) {
      throw new Error(`Failed to download image: ${error?.message}`);
    }

    const fileName = imagePath.split("/").pop() || "screenshot.png";
    const file = new File([blob], fileName, { type: blob.type });

    return await verifyDocument(event.data, file);
  });

  let failureReason: string | null = null;

  if (!verification.isValid) {
    failureReason = verification.reason;
  } else {
    const couponCode = await step.run("claim-coupon", async () => {
      return await claimCouponAtomic(mainRegistrantEmail);
    });

    if (!couponCode) {
      failureReason = ERROR_MESSAGES.NO_COUPONS;
    } else {
      await step.run("send-success-email", async () => {
        await sendSuccessEmail({
          couponCode,
          email: mainRegistrantEmail,
          firstName,
          isReferred: !!referredPersonEmail,
          lastName,
        });
      });

      await step.run("update-job-status-success", async () => {
        await supabaseClient
          .from("verification_jobs")
          .update({ claimed_coupon: couponCode, status: JOB_STATUS.SUCCESS })
          .eq("id", jobId);
      });

      return {
        jobId,
        success: true,
      };
    }
  }

  await step.run("update-job-status-failed", async () => {
    await supabaseClient
      .from("verification_jobs")
      .update({ error_message: failureReason, status: JOB_STATUS.FAILED })
      .eq("id", jobId);
  });

  await step.run("send-failure-email", async () => {
    await sendManualReviewEmail({
      buffer: verification.buffer
        ? Buffer.from(verification.buffer.data)
        : null,
      fileName: verification.fileName,
      firstName,
      lastName,
      mainRegistrantEmail: mainRegistrantEmail,
      reason: failureReason!,
      referredPersonEmail,
    });
  });

  return {
    jobId,
    reason: failureReason,
    success: false,
  };
};
