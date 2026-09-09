import { eventType, Inngest, staticSchema } from "inngest";

import {
  ReferFriendPayload,
  ReferredRegistrationPayload,
  SelfRegistrationPayload,
} from "@/types/inngest";

export const selfRegistrationSubmitted = eventType(
  "voter/self-registration.submitted",
  {
    schema: staticSchema<SelfRegistrationPayload>(),
  },
);

export const referredRegistrationSubmitted = eventType(
  "voter/referred-registration.submitted",
  {
    schema: staticSchema<ReferredRegistrationPayload>(),
  },
);

export const referralSubmitted = eventType(
  "voter/referral.submitted",
  {
    schema: staticSchema<ReferFriendPayload>(),
  },
);

export const inngest = new Inngest({
  id: "voter-registration-portal",
});
