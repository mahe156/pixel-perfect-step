
-- Table for storing multiple verified social accounts per user
CREATE TABLE public.connected_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  platform public.platform_type NOT NULL,
  handle varchar NOT NULL,
  platform_username varchar,
  platform_id varchar,
  followers integer DEFAULT 0,
  subscribers integer DEFAULT 0,
  bio_verified boolean DEFAULT false,
  bio_verified_at timestamptz,
  bio_verification_code varchar,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, platform, handle)
);

ALTER TABLE public.connected_accounts ENABLE ROW LEVEL SECURITY;

-- Users can manage their own connected accounts
CREATE POLICY "connected_accounts_select_own" ON public.connected_accounts
  FOR SELECT USING (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

CREATE POLICY "connected_accounts_insert_own" ON public.connected_accounts
  FOR INSERT WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

CREATE POLICY "connected_accounts_update_own" ON public.connected_accounts
  FOR UPDATE USING (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

CREATE POLICY "connected_accounts_delete_own" ON public.connected_accounts
  FOR DELETE USING (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

-- Admin access
CREATE POLICY "connected_accounts_admin_all" ON public.connected_accounts
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::user_role));

-- Updated_at trigger
CREATE TRIGGER update_connected_accounts_updated_at
  BEFORE UPDATE ON public.connected_accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
