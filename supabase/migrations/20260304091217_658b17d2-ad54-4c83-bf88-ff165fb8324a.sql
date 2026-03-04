-- Add admin full-access RLS policies for tables that don't have them yet

-- creator_profiles: admin read all
CREATE POLICY "admin_read_all_creator_profiles" ON public.creator_profiles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::user_role));

-- creator_profiles: admin update all
CREATE POLICY "admin_update_all_creator_profiles" ON public.creator_profiles
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::user_role));

-- brand_profiles: admin read all
CREATE POLICY "admin_read_all_brand_profiles" ON public.brand_profiles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::user_role));

-- brand_profiles: admin update all
CREATE POLICY "admin_update_all_brand_profiles" ON public.brand_profiles
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::user_role));

-- bio_verifications: admin all
CREATE POLICY "admin_all_bio_verifications" ON public.bio_verifications
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::user_role));

-- notifications: admin all
CREATE POLICY "admin_all_notifications" ON public.notifications
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::user_role));

-- view_snapshots: admin read all
CREATE POLICY "admin_read_all_view_snapshots" ON public.view_snapshots
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::user_role));

-- wallet_transactions: admin read all
CREATE POLICY "admin_read_all_wallet_transactions" ON public.wallet_transactions
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::user_role));

-- payouts: admin insert (to create payouts)
CREATE POLICY "admin_insert_payouts" ON public.payouts
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::user_role));

-- campaigns: admin insert (to create campaigns)
CREATE POLICY "admin_insert_campaigns" ON public.campaigns
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::user_role));

-- platform_settings: admin update
CREATE POLICY "admin_update_settings" ON public.platform_settings
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::user_role));

-- platform_settings: admin insert
CREATE POLICY "admin_insert_settings" ON public.platform_settings
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::user_role));