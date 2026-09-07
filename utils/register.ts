import { NextResponse } from "next/server";

import { RegistrationFormData } from "@/schemas/register";
import { claimCouponAtomic } from "@/utils/claim-coupon";
import { sendManualReviewEmail, sendSuccessEmail } from "@/utils/send-email";
import { verifyDocument } from "@/utils/verfiy-document";

export async function handleSelfRegistration(data: RegistrationFormData) {
  const verification = await verifyDocument(data);

  if (!verification.isValid) {
    await sendManualReviewEmail({
      buffer: verification.buffer,
      filename: verification.filename,
      mainRegistrantEmail: data.email,
      reason: verification.reason,
      referredPersonEmail: null,
      submittedData: data,
    });
    return NextResponse.json(
      { error: `Verification failed: ${verification.reason}` },
      { status: 400 },
    );
  }

  const couponCode = await claimCouponAtomic(data.email);
  if (!couponCode) {
    await sendManualReviewEmail({
      buffer: verification.buffer,
      filename: verification.filename,
      mainRegistrantEmail: data.email,
      reason: "No coupons remaining.",
      referredPersonEmail: null,
      submittedData: data,
    });
    return NextResponse.json({ error: "Out of coupons" }, { status: 400 });
  }

  await sendSuccessEmail({ couponCode, data, recipient: data.email });

  return NextResponse.json({ couponCode, success: true });
}

export async function handleReferredRegistration(
  data: RegistrationFormData,
  referrerEmail: string,
) {
  const verification = await verifyDocument(data);

  if (!verification.isValid) {
    await sendManualReviewEmail({
      buffer: verification.buffer,
      filename: verification.filename,
      mainRegistrantEmail: referrerEmail,
      reason: verification.reason,
      referredPersonEmail: data.email,
      submittedData: data,
    });
    return NextResponse.json(
      { error: `Verification failed: ${verification.reason}` },
      { status: 400 },
    );
  }

  const couponCode = await claimCouponAtomic(referrerEmail);
  if (!couponCode) {
    await sendManualReviewEmail({
      buffer: verification.buffer,
      filename: verification.filename,
      mainRegistrantEmail: referrerEmail,
      reason: "No coupons remaining for referrer.",
      referredPersonEmail: data.email,
      submittedData: data,
    });
    return NextResponse.json({ error: "Out of coupons" }, { status: 400 });
  }

  await sendSuccessEmail({ couponCode, data, recipient: referrerEmail });

  return NextResponse.json({
    message: "Verification complete! Coupon sent to referrer.",
    success: true,
  });
}
