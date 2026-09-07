import { NextResponse } from "next/server";

import { RegistrationFormData } from "@/schemas/register";
import { sendReferEmail } from "@/utils/send-email";

export async function handleFriendReferral(data: RegistrationFormData) {
  await sendReferEmail(data);
  return NextResponse.json({ message: "Referral invite sent!", success: true });
}
