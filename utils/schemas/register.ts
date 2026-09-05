import { z } from "zod";

const REQUIRED_FIELD_ERROR = "This field is required";
const EMAIL_FIELD_ERROR = "Please enter a valid email";
const IMAGE_SIZE_ERROR = "Image size must be less than 1MB";
const IMAGE_TYPE_ERROR = "Image type must be .jpg, .jpeg, .png, or .webp";

const MAX_FILE_SIZE = 1024 * 1024; // 1MB
const ACCEPTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

export const registerSchema = z
  .object({
    firstName: z.string().min(1, REQUIRED_FIELD_ERROR),
    lastName: z.string().min(1, REQUIRED_FIELD_ERROR),
    isReferring: z.boolean(),
    email: z.email(EMAIL_FIELD_ERROR),
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

export type FormData = z.infer<typeof registerSchema>;
