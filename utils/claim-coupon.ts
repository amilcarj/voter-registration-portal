import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
);

export async function claimCouponAtomic(emailToAssign: string) {
  const { data, error } = await supabase.rpc("claim_available_coupon", {
    email_to_assign: emailToAssign,
  });
  console.log({ error, data });
  if (error || !data || data.length === 0) return null;
  return data[0].claimed_code;
}
