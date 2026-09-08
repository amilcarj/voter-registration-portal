create or replace function public.claim_available_coupon (email_to_assign text) RETURNS table (claimed_code text) LANGUAGE plpgsql SECURITY DEFINER as $$
DECLARE
  code_to_claim_id bigint;
  code_to_claim text;
BEGIN
  SELECT id, coupons.code INTO code_to_claim_id, code_to_claim
  FROM coupons
  WHERE is_claimed = FALSE
  LIMIT 1
  FOR UPDATE SKIP LOCKED;

  IF code_to_claim_id IS NOT NULL THEN
    UPDATE coupons
    SET is_claimed = TRUE,
        claimed_at = NOW(),
        claimed_by = email_to_assign
    WHERE id = code_to_claim_id;

    RETURN QUERY SELECT code_to_claim;
  END IF;
END;
$$;