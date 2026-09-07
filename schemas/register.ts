import { z } from "zod";

import {
  EMAIL_FIELD_ERROR,
  IMAGE_SIZE_ERROR,
  IMAGE_TYPE_ERROR,
  REQUIRED_FIELD_ERROR,
} from "@/constants/validation";

const MAX_FILE_SIZE = 1024 * 1024; // 1MB
const ACCEPTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

export const registerSchema = z
  .object({
    email: z.email(EMAIL_FIELD_ERROR),
    firstName: z.string().min(1, REQUIRED_FIELD_ERROR),
    isReferring: z.boolean(),
    lastName: z.string().min(1, REQUIRED_FIELD_ERROR),
    referredEmail: z.string().optional(),
    verificationImage: z
      .instanceof(File, { message: REQUIRED_FIELD_ERROR })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isReferring) {
      if (!data.referredEmail || data.referredEmail.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: REQUIRED_FIELD_ERROR,
          path: ["referredEmail"],
        });
      } else if (!z.email().safeParse(data.referredEmail).success) {
        ctx.addIssue({
          code: "custom",
          message: EMAIL_FIELD_ERROR,
          path: ["referredEmail"],
        });
      }
    } else {
      const image = data.verificationImage;
      if (image) {
        if (!image) {
          ctx.addIssue({
            code: "custom",
            message: REQUIRED_FIELD_ERROR,
            path: ["verificationImage"],
          });
          return;
        }
        if (image.size > MAX_FILE_SIZE) {
          ctx.addIssue({
            code: "custom",
            message: IMAGE_SIZE_ERROR,
            path: ["verificationImage"],
          });
        }
        if (!ACCEPTED_IMAGE_TYPES.has(image.type)) {
          ctx.addIssue({
            code: "custom",
            message: IMAGE_TYPE_ERROR,
            path: ["verificationImage"],
          });
        }
      }
    }
  });

export type RegistrationFormData = z.infer<typeof registerSchema> & {
  referrerEmail?: string;
};
