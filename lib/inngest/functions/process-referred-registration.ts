import { inngest, referredRegistrationSubmitted } from "@/lib/inngest/client";

import { executeProcessRegistration } from "./process-registration";

export default inngest.createFunction(
  {
    id: "process-referred-registration",
    retries: 3,
    triggers: {
      event: referredRegistrationSubmitted,
    },
  },
  async ({ event, step }) => {
    return await executeProcessRegistration({
      event,
      mainRegistrantEmail: event.data.referrerEmail,
      referredPersonEmail: event.data.email,
      step,
    });
  },
);
