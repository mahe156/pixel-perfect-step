-- Add banner_url column to campaigns
ALTER TABLE public.campaigns ADD COLUMN banner_url text NULL;

-- Create storage bucket for campaign banners
INSERT INTO storage.buckets (id, name, public) VALUES ('campaign-banners', 'campaign-banners', true);

-- Allow authenticated users to upload banners
CREATE POLICY "Authenticated users can upload banners"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'campaign-banners');

-- Allow public read access to banners
CREATE POLICY "Public read access to banners"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'campaign-banners');

-- Allow authenticated users to delete own banners
CREATE POLICY "Authenticated users can delete own banners"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'campaign-banners');