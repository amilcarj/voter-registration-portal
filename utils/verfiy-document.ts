import { GoogleGenAI } from "@google/genai";

import { RegistrationFormData } from "@/schemas/register";

const PROMOTION_START_DATE = new Date("2026-08-28T00:00:00Z");
const VALID_DOCUMENT_TYPES = new Set([
  "CONFIRMATION_PAGE",
  "CONFIRMATION_EMAIL",
]);

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const getPrompt = (data: RegistrationFormData) => `
    You are an automated verification engine for a voter registration reward program. 
    Analyze the provided image (which may be a browser screenshot of a confirmation page or an email client screenshot of a confirmation email).

    ### TASK
    Verify if the image represents an authentic, newly completed voter registration submission, and extract all verifiable data.

    ### Step 1: Document Classification
    Identify the document type:
    - "CONFIRMATION_PAGE": Web browser screenshot of an official state/city voter registration completion screen.
    - "CONFIRMATION_EMAIL": Screenshot or render of a registration confirmation email.
    - "INVALID": Unrelated image, incomplete form, error screen, or non-voter document.

    ### Step 2: Key Information Extraction
    Extract the following fields if present (return null if missing):
    1. confirmationCode: (e.g., "10A8A0", reference number, or transaction ID if one is provided)
    2. registrantFirstName: First name if explicitly shown.
    3. registrantLastName: Last name if explicitly shown.
    4. registrantEmail: Email address if explicitly shown.
    5. visibleDate: Any date displayed on the page/email header to indicate the date of registration (e.g. the confirmation email delivery date).
    6. successPhrases: List any clear phrases indicating completion (e.g., "Registration Request Successful", "Application Submitted", "Thank you for registering").

    ### Step 3: FRAUD & QUALITY AUDIT
    Check for red flags:
    1. Is this a photo of a physical screen taken with a camera (moiré patterns, screen glare)?
    2. Is there evidence of digital editing (mismatched fonts, misaligned text, suspicious blurring around codes)?
    3. Is the image heavily cropped to obscure the source or context?

    ### Step 4: Authenticity & Quality Rules
    Set "isValid" to true ONLY IF:
    1. Document type is "CONFIRMATION_PAGE" or "CONFIRMATION_EMAIL".
    2. At least ONE of the following is present:
      - Visible success phrase(s) matching official state language.
      - An explicit registration confirmation code / reference number.
    3. The image shows a COMPLETED action, not an in-progress input form or error state.
    4. In addition to the above:
      - If the document is a CONFIRMATION_EMAIL:
        - The email must be sent to ${data.email}
        - The email must be sent to ${data.firstName} ${data.lastName}
        - The email must be sent on or after ${PROMOTION_START_DATE.toISOString()}
      - If the document is a CONFIRMATION_PAGE:
        - Try to test for those same 3 email conditions but they are not required.
    5. Shows no evidence of digital tampering or invalid document type.

    ### Output Format
    Return ONLY a JSON object:
    {
      "documentType": "CONFIRMATION_PAGE" | "CONFIRMATION_EMAIL" | "INVALID",
      "isValid": boolean,
      "extracted_data": {
        "confirmationCode": string | null,
        "registrantFirstName": string | null,
        "registrantLastName": string | null,
        "registrantEmail": string | null,
        "visibleDate": string | null,
        "successPhrases": string[]
      },
      "rejectionReason": string | null
    }
`;

export const verifyDocument = async (data: RegistrationFormData) => {
  const file = data.verificationImage;
  if (!file) {
    return {
      buffer: null,
      fileName: "",
      isValid: false,
      reason: "Missing image file",
    };
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64Image = buffer.toString("base64");

  const prompt = getPrompt(data);

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

  const fileName = file.name || "screenshot.png";

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
      registrantEmail === data.email,
      `${registrantFirstName} ${registrantLastName}` ===
        `${data.firstName} ${data.lastName}`,
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

  return { buffer, fileName: file.name, isValid: true, reason: "" };
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
