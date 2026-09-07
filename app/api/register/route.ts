import { NextResponse } from "next/server";

import { registerSchema, RegistrationFormData } from "@/schemas/register";
import { handleFriendReferral } from "@/utils/refer-friend";
import {
  handleReferredRegistration,
  handleSelfRegistration,
} from "@/utils/register";
import { transporter } from "@/utils/send-email";

export async function POST(req: Request) {
  try {
    if (process.env.NODE_ENV !== "production") {
      await transporter.verify();
      console.log("SMTP Connection verified successfully");
    }
  } catch (error) {
    console.error("SMTP or Server Error:", error);
    return NextResponse.json({ error }, { status: 500 });
  }

  try {
    const formData = await req.formData();

    const rawData = {
      email: formData.get("email"),
      firstName: formData.get("firstName"),
      isReferring: formData.get("isReferring") === "true",
      lastName: formData.get("lastName"),
      referredEmail: formData.get("referredEmail") || undefined,
      verificationImage:
        formData.get("verificationImage") || undefined,
    };

    const data: RegistrationFormData = registerSchema.parse(rawData);
    const referrerEmail = formData.get("referrerEmail") as
      | string
      | null;

    if (data.isReferring) {
      return await handleFriendReferral(data);
    }
    if (referrerEmail) {
      return await handleReferredRegistration(data, referrerEmail);
    }
    return await handleSelfRegistration(data);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
