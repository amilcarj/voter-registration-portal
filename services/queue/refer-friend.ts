import { inngest, referralSubmitted } from "@/lib/inngest/client";
import { RegistrationFormData } from "@/schemas/register";

export async function handleFriendReferral(data: RegistrationFormData) {
  if (!data.referredEmail) {
    throw new Error("Referred email is required");
  }

  await inngest.send({
    data: {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      referredEmail: data.referredEmail,
    },
    name: referralSubmitted.name,
  });

  return {
    message: "Referral invite processing started",
    success: true,
  };
}
