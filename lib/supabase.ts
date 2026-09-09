import { createClient } from "@supabase/supabase-js";

import { Database } from "@/types/supabase";

export const supabaseClient = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
);
