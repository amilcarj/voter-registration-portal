import { NextResponse } from "next/server";

import { registerSchema, RegistrationFormData } from "@/schemas/register";
import { handleFriendReferral } from "@/services/queue/refer-friend";
import {
  handleReferredRegistration,
  handleSelfRegistration,
} from "@/services/queue/register";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const rawData = {
      email: formData.get("email"),
      firstName: formData.get("firstName"),
      isReferring: formData.get("isReferring") === "true",
      lastName: formData.get("lastName"),
      referredEmail: formData.get("referredEmail") || undefined,
      verificationImage: formData.get("verificationImage") || undefined,
    };

    const data: RegistrationFormData = registerSchema.parse(rawData);
    const referrerEmail = formData.get("referrerEmail") as string | null;

    if (data.isReferring) {
      const result = await handleFriendReferral(data);
      return NextResponse.json(result, { status: 202 });
    }

    if (referrerEmail) {
      const result = await handleReferredRegistration(data, referrerEmail);
      return NextResponse.json(result, { status: 202 });
    }

    const result = await handleSelfRegistration(data);
    return NextResponse.json(result, { status: 202 });
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
