-- Drop the unique constraint that limits one submission per creator per campaign
ALTER TABLE public.submissions DROP CONSTRAINT IF EXISTS submissions_campaign_id_creator_id_key;

-- Add a unique constraint on content_url to prevent duplicate links instead
ALTER TABLE public.submissions ADD CONSTRAINT submissions_content_url_key UNIQUE (content_url);