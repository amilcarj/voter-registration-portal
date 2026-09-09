import { serve } from "inngest/next";

import { inngest } from "@/lib/inngest/client";
import processFriendReferral from "@/lib/inngest/functions/process-friend-referral";
import processReferredRegistration from "@/lib/inngest/functions/process-referred-registration";
import processSelfRegistration from "@/lib/inngest/functions/process-self-registration";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    processSelfRegistration,
    processReferredRegistration,
    processFriendReferral,
  ],
});
