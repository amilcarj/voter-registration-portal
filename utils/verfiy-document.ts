import { GoogleGenAI } from "@google/genai";

import { RegistrationFormData } from "@/schemas/register";

const PROMOTION_START_DATE = new Date("2026-08-28T00:00:00Z");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function verifyDocument(data: RegistrationFormData) {
  const file = data.verificationImage;
  if (!file) {
    return {
      buffer: null,
      filename: "",
      isValid: false,
      reason: "Missing image file",
    };
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64Image = buffer.toString("base64");

  const prompt = `
    Analyze this screenshot of a voter registration confirmation email.
    Verify:
    1. Is it a valid voter registration confirmation email?
    2. Does the name of the registrant match "${data.firstName} ${data.lastName}"?
    3. Does the email of the registrant match "${data.email}"?
    4. Was it received on or after ${PROMOTION_START_DATE.toISOString()}?
  `;

  const result = await ai.models.generateContent({
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        properties: {
          isConfirmationEmail: { type: "BOOLEAN" },
          isValid: { type: "BOOLEAN" },
          receivedDate: { type: "STRING" },
          rejectionReason: { type: "STRING" },
        },
        required: [
          "isConfirmationEmail",
          "isValid",
          "rejectionReason",
          "receivedDate",
        ],
        type: "OBJECT",
      },
    },
    contents: [
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: file.type,
        },
      },
    ],
    model: "gemini-3.6-flash",
  });

  const response = result?.text
    ? JSON.parse(result.text)
    : {
        isConfirmationEmail: false,
        isValid: false,
        receivedDate: "",
        rejectionReason: "No response from AI",
      };
  const receivedDate = new Date(response.receivedDate);
  const isDateValid =
    !isNaN(receivedDate.getTime()) && receivedDate >= PROMOTION_START_DATE;

  if (!response.isValid || !isDateValid) {
    return {
      buffer,
      filename: file.name || "screenshot.png",
      isValid: false,
      reason:
        response.rejectionReason ||
        "Email date is before promotion start date.",
    };
  }

  return { buffer, filename: file.name, isValid: true, reason: "" };
}
