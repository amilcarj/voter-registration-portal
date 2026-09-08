INSERT INTO storage.buckets (id, name, public) 
VALUES ('voter-confirmations', 'voter-confirmations', false)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.verification_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  email text NOT NULL,
  image_path text NOT NULL,
  status text NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  error_message text,
  claimed_coupon text
);

CREATE INDEX IF NOT EXISTS idx_verification_jobs_status ON public.verification_jobs (status);