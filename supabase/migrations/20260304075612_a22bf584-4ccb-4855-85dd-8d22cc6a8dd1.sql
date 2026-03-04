
-- Bio verifications table
CREATE TABLE IF NOT EXISTS public.bio_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  platform platform_type NOT NULL,
  verification_code VARCHAR(20) NOT NULL UNIQUE,
  apify_run_id VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending',
  verified_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bio_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bio_verifications_creator_own" ON public.bio_verifications
  FOR ALL TO authenticated
  USING (creator_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

-- Admin logs table
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES public.users(id),
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(50),
  target_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_logs_admin_only" ON public.admin_logs
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::user_role));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bio_verifications_creator ON public.bio_verifications(creator_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin ON public.admin_logs(admin_id, created_at DESC);

-- Enable realtime for submissions and notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.submissions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.campaigns;
