import nodemailer, { Transporter, SendMailOptions } from "nodemailer";

import { BASE_APP_URL } from "@/constants/urls";
import { RegistrationFormData } from "@/schemas/register";

const globalForNodemailer = globalThis as unknown as {
  transporter: Transporter | undefined;
};

export const transporter =
  globalForNodemailer.transporter ??
  nodemailer.createTransport({
    auth: {
      pass: process.env.GMAIL_APP_PASSWORD,
      user: process.env.GMAIL_USER,
    },
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
  });

if (process.env.NODE_ENV !== "production") {
  globalForNodemailer.transporter = transporter;
}

export async function sendSuccessEmail({
  data,
  couponCode,
  recipient,
}: {
  data: RegistrationFormData;
  couponCode: string;
  recipient: string;
}) {
  const name = `${data.firstName} ${data.lastName}'s`;

  await sendEmail(
    [recipient],
    "Your Event Coupon Code!",
    `
      <p>Great news!</p>
      <p>${data.email === recipient ? "Your" : name} voter registration was successfully verified!</p>
      <p>Here is your event coupon code: <strong>${couponCode}</strong></p>
    `,
  );
}

export async function sendManualReviewEmail({
  mainRegistrantEmail,
  referredPersonEmail,
  reason,
  buffer,
  fileName,
  submittedData,
}: {
  mainRegistrantEmail: string;
  referredPersonEmail: string | null;
  reason: string;
  buffer: Buffer | null;
  fileName: string;
  submittedData: RegistrationFormData;
}) {
  const attachments = buffer ? [{ content: buffer, filename: fileName }] : [];

  const htmlBody = `
    <h3>Voter Registration Action Required / Manual Review</h3>
    <p>A submitted voter registration requires manual review.</p>
    <p><strong>Reason:</strong> ${reason}</p>
    <hr />
    <p><strong>Main Registrant Email:</strong> ${mainRegistrantEmail}</p>
    ${referredPersonEmail ? `<p><strong>Referred Person Email:</strong> ${referredPersonEmail}</p>` : ""}
    <p><strong>Submitted Name:</strong> ${submittedData.firstName} ${submittedData.lastName}</p>
    <p><em>The uploaded screenshot is attached to this email.</em></p>
  `;

  await sendEmail(
    [process.env.GMAIL_USER!, mainRegistrantEmail],
    `[Manual Review Needed] Voter Verification Issue`,
    htmlBody,
    attachments,
  );
}

export async function sendReferEmail(data: RegistrationFormData) {
  const referralLink = `${BASE_APP_URL}?referrer-name=${encodeURIComponent(
    `${data.firstName} ${data.lastName}`,
  )}&referrer-email=${encodeURIComponent(data.email)}`;

  await sendEmail(
    [data.referredEmail!],
    `${data.firstName} invited you to register to vote!`,
    `
      <p>Hi there!</p>
      <p>${data.firstName} ${data.lastName} invited you to register to vote.</p>
      <p>Complete your registration using this link, and ${data.firstName} will receive an event coupon:</p>
      <a href="${referralLink}">${referralLink}</a>
    `,
  );
}

const sendEmail = async (
  recipients: string[],
  subject: string,
  html: string,
  attachments?: SendMailOptions["attachments"],
) =>
  await transporter.sendMail({
    attachments,
    from: `"Gamma Alpha Voter Registration Portal" <${process.env.GMAIL_USER}>`,
    html,
    subject,
    to: recipients,
  });
