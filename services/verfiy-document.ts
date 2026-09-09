import { ai, getPrompt, PROMOTION_START_DATE } from "@/lib/gemini";
import {
  ReferredRegistrationPayload,
  SelfRegistrationPayload,
} from "@/types/inngest";

const VALID_DOCUMENT_TYPES = new Set([
  "CONFIRMATION_PAGE",
  "CONFIRMATION_EMAIL",
]);

export const verifyDocument = async (
  data: Omit<SelfRegistrationPayload | ReferredRegistrationPayload, "jobId">,
  file?: File,
) => {
  if (!file) {
    return {
      buffer: null,
      fileName: "",
      isValid: false,
      reason: "Missing image file",
    };
  }
  const fileName = file.name || "screenshot.png";

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64Image = buffer.toString("base64");

  const prompt = getPrompt(data.email, data.firstName, data.lastName);

  const result = await ai.models.generateContent({
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        properties: {
          documentType: { type: "STRING" },
          extractedData: {
            properties: {
              confirmationCode: { type: "STRING" },
              registrantEmail: { type: "STRING" },
              registrantFirstName: { type: "STRING" },
              registrantLastName: { type: "STRING" },
              successPhrases: {
                items: {
                  type: "STRING",
                },
                type: "ARRAY",
              },
              visibleDate: { type: "STRING" },
            },
            required: ["successPhrases"],
            type: "OBJECT",
          },
          isValid: { type: "BOOLEAN" },
          rejectionReason: { type: "STRING" },
        },
        required: [
          "documentType",
          "extractedData",
          "isValid",
          "rejectionReason",
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
        documentType: "INVALID",
        extractedData: {},
        isValid: false,
        rejectionReason: "No response from AI",
      };

  const {
    isValid,
    documentType,
    extractedData: {
      confirmationCode,
      registrantEmail,
      registrantFirstName,
      registrantLastName,
      successPhrases,
      visibleDate,
    },
    rejectionReason,
  } = response;

  if (
    !isValid ||
    !VALID_DOCUMENT_TYPES.has(documentType) ||
    ((!successPhrases || !successPhrases.length) && !confirmationCode)
  ) {
    return {
      buffer,
      fileName,
      isValid: false,
      reason: rejectionReason || "Updated image failed validation checks.",
    };
  }

  if (documentType === "CONFIRMATION_EMAIL") {
    const receivedDate = new Date(visibleDate);
    const inValidEmailReason = validateEmail(
      registrantEmail?.toLowerCase() === data.email.toLowerCase(),
      `${registrantFirstName} ${registrantLastName}`.toLowerCase() ===
        `${data.firstName} ${data.lastName}`.toLowerCase(),
      !isNaN(receivedDate.getTime()) && receivedDate >= PROMOTION_START_DATE,
    );

    if (!!inValidEmailReason) {
      return {
        buffer,
        fileName,
        isValid: false,
        reason: inValidEmailReason,
      };
    }
  }

  return { buffer, fileName, isValid: true, reason: "" };
};

const validateEmail = (
  validEmail: boolean,
  validName: boolean,
  validDate: boolean,
) => {
  if (!validEmail) {
    return "Email address is missing or does not match the registrant's email";
  }
  if (!validName) {
    return "Name is missing or does not match the registrant's full name";
  }
  if (!validDate) {
    return "Email date is missing or is before the promotion period";
  }
};
