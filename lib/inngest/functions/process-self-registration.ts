import { inngest, selfRegistrationSubmitted } from "@/lib/inngest/client";

import { executeProcessRegistration } from "./process-registration";

export default inngest.createFunction(
  {
    id: "process-self-registration",
    retries: 3,
    triggers: {
      event: selfRegistrationSubmitted,
    },
  },
  async ({ event, step }) => {
    return await executeProcessRegistration({
      event,
      mainRegistrantEmail: event.data.email,
      referredPersonEmail: null,
      step,
    });
  },
);
