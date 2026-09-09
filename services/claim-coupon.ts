import { supabaseClient } from "@/lib/supabase";


export async function claimCouponAtomic(emailToAssign: string) {
  const { data, error } = await supabaseClient.rpc("claim_available_coupon", {
    email_to_assign: emailToAssign,
  });

  if (error || !data || data.length === 0) return null;
  return data[0].claimed_code;
}
