
-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE public.user_role AS ENUM ('creator', 'brand', 'admin');
CREATE TYPE public.kyc_status AS ENUM ('pending', 'submitted', 'verified', 'rejected');
CREATE TYPE public.campaign_status AS ENUM ('draft', 'pending_payment', 'active', 'paused', 'completed', 'cancelled');
CREATE TYPE public.platform_type AS ENUM ('youtube', 'instagram', 'both');
CREATE TYPE public.submission_status AS ENUM ('pending_review', 'approved', 'rejected', 'tracking');
CREATE TYPE public.payout_status AS ENUM ('pending', 'processing', 'paid', 'failed');
CREATE TYPE public.transaction_type AS ENUM ('deposit', 'spend', 'refund', 'payout', 'platform_fee');
CREATE TYPE public.notification_type AS ENUM ('campaign_live', 'views_milestone', 'payout_sent', 'campaign_ending', 'kyc_approved', 'kyc_rejected', 'submission_approved', 'submission_rejected');

-- ============================================
-- USERS & PROFILES
-- ============================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role public.user_role NOT NULL,
  avatar_url TEXT,
  phone VARCHAR(15),
  phone_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  is_suspended BOOLEAN DEFAULT FALSE,
  suspension_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.creator_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  yt_channel_id VARCHAR(50),
  yt_channel_name VARCHAR(255),
  yt_subscribers INTEGER DEFAULT 0,
  yt_connected BOOLEAN DEFAULT FALSE,
  ig_user_id VARCHAR(50),
  ig_username VARCHAR(100),
  ig_followers INTEGER DEFAULT 0,
  ig_connected BOOLEAN DEFAULT FALSE,
  niche VARCHAR(50)[] DEFAULT '{}',
  language VARCHAR(30)[] DEFAULT '{}',
  bio TEXT,
  location VARCHAR(100),
  total_earned DECIMAL(12,2) DEFAULT 0,
  pending_earnings DECIMAL(12,2) DEFAULT 0,
  wallet_balance DECIMAL(12,2) DEFAULT 0,
  total_views_generated BIGINT DEFAULT 0,
  campaigns_completed INTEGER DEFAULT 0,
  kyc_status public.kyc_status DEFAULT 'pending',
  pan_number VARCHAR(10),
  pan_verified BOOLEAN DEFAULT FALSE,
  bank_account_name VARCHAR(255),
  bank_account_number VARCHAR(20),
  bank_ifsc VARCHAR(11),
  bank_verified BOOLEAN DEFAULT FALSE,
  upi_id VARCHAR(100),
  upi_verified BOOLEAN DEFAULT FALSE,
  bio_verified BOOLEAN DEFAULT FALSE,
  bio_verification_code VARCHAR(20),
  bio_verified_at TIMESTAMPTZ,
  reliability_score DECIMAL(3,2) DEFAULT 5.00,
  total_submissions INTEGER DEFAULT 0,
  approved_submissions INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.brand_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  company_website VARCHAR(255),
  company_logo_url TEXT,
  industry VARCHAR(100),
  gst_number VARCHAR(15),
  gst_verified BOOLEAN DEFAULT FALSE,
  wallet_balance DECIMAL(12,2) DEFAULT 0,
  total_spent DECIMAL(12,2) DEFAULT 0,
  contact_name VARCHAR(255),
  contact_designation VARCHAR(100),
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CAMPAIGNS
-- ============================================
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  brief_url TEXT,
  platform public.platform_type NOT NULL,
  niche_tags VARCHAR(50)[] DEFAULT '{}',
  language_tags VARCHAR(30)[] DEFAULT '{}',
  cpm_rate DECIMAL(8,2) NOT NULL,
  total_budget DECIMAL(12,2) NOT NULL,
  escrowed_amount DECIMAL(12,2) DEFAULT 0,
  spent_amount DECIMAL(12,2) DEFAULT 0,
  platform_fee_percent DECIMAL(4,2) DEFAULT 20.00,
  min_followers INTEGER DEFAULT 1000,
  min_reliability_score DECIMAL(3,2) DEFAULT 3.00,
  max_creators INTEGER,
  content_guidelines TEXT,
  hashtags VARCHAR(100)[] DEFAULT '{}',
  do_list TEXT[],
  dont_list TEXT[],
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  status public.campaign_status DEFAULT 'draft',
  total_submissions INTEGER DEFAULT 0,
  approved_submissions INTEGER DEFAULT 0,
  total_verified_views BIGINT DEFAULT 0,
  razorpay_order_id VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SUBMISSIONS
-- ============================================
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  content_url TEXT NOT NULL,
  platform public.platform_type NOT NULL,
  yt_video_id VARCHAR(20),
  ig_media_id VARCHAR(50),
  initial_views BIGINT DEFAULT 0,
  verified_views BIGINT DEFAULT 0,
  last_synced_views BIGINT DEFAULT 0,
  last_synced_at TIMESTAMPTZ,
  view_sync_count INTEGER DEFAULT 0,
  earned_amount DECIMAL(10,2) DEFAULT 0,
  apify_run_id VARCHAR(100),
  apify_last_verified TIMESTAMPTZ,
  status public.submission_status DEFAULT 'pending_review',
  rejection_reason TEXT,
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES public.users(id),
  is_flagged BOOLEAN DEFAULT FALSE,
  flag_reason TEXT,
  view_velocity_score DECIMAL(5,2),
  UNIQUE(campaign_id, creator_id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- VIEW TRACKING LOG
-- ============================================
CREATE TABLE public.view_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES public.submissions(id) ON DELETE CASCADE,
  views_at_snapshot BIGINT NOT NULL,
  delta_views INTEGER NOT NULL,
  earned_this_snapshot DECIMAL(8,2) DEFAULT 0,
  source VARCHAR(20) DEFAULT 'apify',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PAYOUTS
-- ============================================
CREATE TABLE public.payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  gross_amount DECIMAL(10,2) NOT NULL,
  tds_percent DECIMAL(4,2) DEFAULT 10.00,
  tds_amount DECIMAL(10,2) DEFAULT 0,
  net_amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(20) NOT NULL,
  upi_id VARCHAR(100),
  bank_account_number VARCHAR(20),
  bank_ifsc VARCHAR(11),
  razorpay_payout_id VARCHAR(100),
  razorpay_fund_account_id VARCHAR(100),
  status public.payout_status DEFAULT 'pending',
  failure_reason TEXT,
  initiated_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  period_start TIMESTAMPTZ,
  period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- WALLET TRANSACTIONS
-- ============================================
CREATE TABLE public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  type public.transaction_type NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  balance_before DECIMAL(12,2) NOT NULL,
  balance_after DECIMAL(12,2) NOT NULL,
  description TEXT,
  reference_id UUID,
  razorpay_payment_id VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NOTIFICATIONS
-- ============================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  type public.notification_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PLATFORM SETTINGS
-- ============================================
CREATE TABLE public.platform_settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.platform_settings (key, value, description) VALUES
  ('platform_fee_percent', '20', 'Platform cut from brand payments'),
  ('tds_percent', '10', 'TDS deduction on creator payouts'),
  ('min_payout_amount', '500', 'Minimum INR for creator payout'),
  ('view_sync_interval_hours', '6', 'How often to sync views'),
  ('fraud_velocity_threshold', '10000', 'Max views/hour before flagging');

-- ============================================
-- USER ROLES TABLE (separate for security)
-- ============================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.user_role NOT NULL,
  UNIQUE(user_id, role)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_users_auth_id ON public.users(auth_id);
CREATE INDEX idx_submissions_campaign ON public.submissions(campaign_id);
CREATE INDEX idx_submissions_creator ON public.submissions(creator_id);
CREATE INDEX idx_submissions_status ON public.submissions(status);
CREATE INDEX idx_submissions_flagged ON public.submissions(is_flagged) WHERE is_flagged = TRUE;
CREATE INDEX idx_campaigns_status ON public.campaigns(status);
CREATE INDEX idx_campaigns_brand ON public.campaigns(brand_id);
CREATE INDEX idx_view_snapshots_submission ON public.view_snapshots(submission_id);
CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_wallet_transactions_user ON public.wallet_transactions(user_id, created_at DESC);
CREATE INDEX idx_payouts_creator_status ON public.payouts(creator_id, status);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.view_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.user_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Get user role from users table
CREATE OR REPLACE FUNCTION public.get_user_role(_auth_id uuid)
RETURNS public.user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.users WHERE auth_id = _auth_id LIMIT 1
$$;

-- Users: own profile
CREATE POLICY "users_read_own" ON public.users FOR SELECT USING (auth.uid() = auth_id);
CREATE POLICY "users_update_own" ON public.users FOR UPDATE USING (auth.uid() = auth_id);
CREATE POLICY "users_insert_own" ON public.users FOR INSERT WITH CHECK (auth.uid() = auth_id);

-- Creator profiles: own
CREATE POLICY "creator_read_own" ON public.creator_profiles FOR SELECT
  USING (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));
CREATE POLICY "creator_update_own" ON public.creator_profiles FOR UPDATE
  USING (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));
CREATE POLICY "creator_insert_own" ON public.creator_profiles FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

-- Brand profiles: own
CREATE POLICY "brand_read_own" ON public.brand_profiles FOR SELECT
  USING (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));
CREATE POLICY "brand_update_own" ON public.brand_profiles FOR UPDATE
  USING (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));
CREATE POLICY "brand_insert_own" ON public.brand_profiles FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

-- Campaigns: active ones public, brands manage own
CREATE POLICY "campaigns_public_read" ON public.campaigns FOR SELECT
  USING (status = 'active' AND auth.uid() IS NOT NULL);
CREATE POLICY "campaigns_brand_read_own" ON public.campaigns FOR SELECT
  USING (brand_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));
CREATE POLICY "campaigns_brand_insert" ON public.campaigns FOR INSERT
  WITH CHECK (brand_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));
CREATE POLICY "campaigns_brand_update" ON public.campaigns FOR UPDATE
  USING (brand_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

-- Submissions: creator own + brand can see for their campaigns
CREATE POLICY "submissions_creator_own" ON public.submissions FOR ALL
  USING (creator_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));
CREATE POLICY "submissions_brand_read" ON public.submissions FOR SELECT
  USING (campaign_id IN (SELECT id FROM public.campaigns WHERE brand_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid())));

-- Payouts: creator own
CREATE POLICY "payouts_creator_own" ON public.payouts FOR SELECT
  USING (creator_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

-- Notifications: own only
CREATE POLICY "notifications_own" ON public.notifications FOR ALL
  USING (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

-- Wallet: own only
CREATE POLICY "wallet_own" ON public.wallet_transactions FOR SELECT
  USING (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

-- View snapshots: via submission ownership
CREATE POLICY "snapshots_via_submission" ON public.view_snapshots FOR SELECT
  USING (submission_id IN (
    SELECT id FROM public.submissions WHERE creator_id IN (
      SELECT id FROM public.users WHERE auth_id = auth.uid()
    )
  ));

-- Platform settings: read by authenticated
CREATE POLICY "settings_read" ON public.platform_settings FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- User roles: own only
CREATE POLICY "roles_read_own" ON public.user_roles FOR SELECT
  USING (user_id = auth.uid());

-- Admin policies (using has_role)
CREATE POLICY "admin_read_all_users" ON public.users FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_update_all_users" ON public.users FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_read_all_submissions" ON public.submissions FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_update_all_submissions" ON public.submissions FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_read_all_payouts" ON public.payouts FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_update_all_payouts" ON public.payouts FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_read_all_campaigns" ON public.campaigns FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_update_all_campaigns" ON public.campaigns FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_creator_updated_at BEFORE UPDATE ON public.creator_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_brand_updated_at BEFORE UPDATE ON public.brand_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON public.campaigns FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON public.submissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Auto-create user profile on signup via trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role_val public.user_role;
  new_user_id UUID;
BEGIN
  user_role_val := COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'creator');
  
  INSERT INTO public.users (auth_id, email, full_name, role)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), user_role_val)
  RETURNING id INTO new_user_id;

  -- Insert into user_roles table
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role_val);

  -- Create role-specific profile
  IF user_role_val = 'creator' THEN
    INSERT INTO public.creator_profiles (user_id) VALUES (new_user_id);
  ELSIF user_role_val = 'brand' THEN
    INSERT INTO public.brand_profiles (user_id, company_name)
    VALUES (new_user_id, COALESCE(NEW.raw_user_meta_data->>'company_name', 'My Company'));
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
