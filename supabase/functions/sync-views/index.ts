import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const APIFY_API_TOKEN = Deno.env.get("APIFY_API_TOKEN");
    if (!APIFY_API_TOKEN) throw new Error("APIFY_API_TOKEN not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { submission_id } = await req.json();

    // If specific submission_id, sync just that one. Otherwise sync all "tracking" submissions.
    let submissions: any[] = [];

    if (submission_id) {
      const { data } = await supabase
        .from("submissions")
        .select("*")
        .eq("id", submission_id)
        .single();
      if (data) submissions = [data];
    } else {
      const { data } = await supabase
        .from("submissions")
        .select("*")
        .in("status", ["approved", "tracking"]);
      if (data) submissions = data;
    }

    if (submissions.length === 0) {
      return new Response(
        JSON.stringify({ synced: 0, message: "No submissions to sync" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Group by platform
    const ytSubmissions = submissions.filter((s) => s.platform === "youtube");
    const igSubmissions = submissions.filter((s) => s.platform === "instagram");

    const results: { id: string; views: number; error?: string }[] = [];

    // Sync YouTube views
    if (ytSubmissions.length > 0) {
      const videoUrls = ytSubmissions.map((s) => s.content_url);

      const runRes = await fetch(
        `https://api.apify.com/v2/acts/bernardo~youtube-video-scraper/runs?token=${APIFY_API_TOKEN}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            startUrls: videoUrls.map((url: string) => ({ url })),
            maxResults: videoUrls.length,
          }),
        }
      );

      if (!runRes.ok) {
        const errBody = await runRes.text();
        throw new Error(`Apify YT scraper failed [${runRes.status}]: ${errBody}`);
      }

      const runData = await runRes.json();
      const runId = runData.data?.id;

      // Poll for completion
      let completed = false;
      for (let i = 0; i < 24; i++) {
        await new Promise((r) => setTimeout(r, 5000));
        const statusRes = await fetch(
          `https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_API_TOKEN}`
        );
        const statusData = await statusRes.json();

        if (statusData.data?.status === "SUCCEEDED") {
          const datasetId = statusData.data.defaultDatasetId;
          const itemsRes = await fetch(
            `https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_API_TOKEN}`
          );
          const items = await itemsRes.json();

          for (const item of items) {
            const videoUrl = item.url || item.videoUrl;
            const views = item.viewCount || item.views || 0;
            const sub = ytSubmissions.find(
              (s) => s.content_url === videoUrl || s.yt_video_id === item.videoId
            );
            if (sub) {
              results.push({ id: sub.id, views });
            }
          }
          completed = true;
          break;
        } else if (
          statusData.data?.status === "FAILED" ||
          statusData.data?.status === "ABORTED"
        ) {
          break;
        }
      }

      if (!completed) {
        ytSubmissions.forEach((s) =>
          results.push({ id: s.id, views: 0, error: "Scraper timed out" })
        );
      }
    }

    // Sync Instagram views
    if (igSubmissions.length > 0) {
      const postUrls = igSubmissions.map((s) => s.content_url);

      const runRes = await fetch(
        `https://api.apify.com/v2/acts/apify~instagram-post-scraper/runs?token=${APIFY_API_TOKEN}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            directUrls: postUrls,
            resultsLimit: postUrls.length,
          }),
        }
      );

      if (!runRes.ok) {
        const errBody = await runRes.text();
        throw new Error(`Apify IG scraper failed [${runRes.status}]: ${errBody}`);
      }

      const runData = await runRes.json();
      const runId = runData.data?.id;

      let completed = false;
      for (let i = 0; i < 24; i++) {
        await new Promise((r) => setTimeout(r, 5000));
        const statusRes = await fetch(
          `https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_API_TOKEN}`
        );
        const statusData = await statusRes.json();

        if (statusData.data?.status === "SUCCEEDED") {
          const datasetId = statusData.data.defaultDatasetId;
          const itemsRes = await fetch(
            `https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_API_TOKEN}`
          );
          const items = await itemsRes.json();

          for (const item of items) {
            const views = item.videoViewCount || item.likesCount || 0;
            const sub = igSubmissions.find(
              (s) => s.content_url === item.url || s.ig_media_id === item.id
            );
            if (sub) {
              results.push({ id: sub.id, views });
            }
          }
          completed = true;
          break;
        } else if (
          statusData.data?.status === "FAILED" ||
          statusData.data?.status === "ABORTED"
        ) {
          break;
        }
      }

      if (!completed) {
        igSubmissions.forEach((s) =>
          results.push({ id: s.id, views: 0, error: "Scraper timed out" })
        );
      }
    }

    // Update submissions and create view snapshots
    let synced = 0;
    for (const result of results) {
      if (result.error) continue;

      const sub = submissions.find((s) => s.id === result.id);
      if (!sub) continue;

      const previousViews = sub.verified_views || sub.initial_views || 0;
      const deltaViews = Math.max(0, result.views - previousViews);

      // Get campaign CPM for earnings calc
      const { data: campaign } = await supabase
        .from("campaigns")
        .select("cpm_rate")
        .eq("id", sub.campaign_id)
        .single();

      const cpmRate = campaign?.cpm_rate || 0;
      const earnedThisSnapshot = (deltaViews / 1000) * cpmRate;

      // Create view snapshot
      await supabase.from("view_snapshots").insert({
        submission_id: sub.id,
        views_at_snapshot: result.views,
        delta_views: deltaViews,
        earned_this_snapshot: earnedThisSnapshot,
        source: "apify",
      });

      // Update submission
      await supabase
        .from("submissions")
        .update({
          verified_views: result.views,
          last_synced_views: result.views,
          last_synced_at: new Date().toISOString(),
          view_sync_count: (sub.view_sync_count || 0) + 1,
          earned_amount: (sub.earned_amount || 0) + earnedThisSnapshot,
          status: "tracking",
        })
        .eq("id", sub.id);

      // Update creator earnings
      if (earnedThisSnapshot > 0) {
        const { data: creatorProfile } = await supabase
          .from("creator_profiles")
          .select("pending_earnings, total_views_generated")
          .eq("user_id", sub.creator_id)
          .single();

        if (creatorProfile) {
          await supabase
            .from("creator_profiles")
            .update({
              pending_earnings:
                (creatorProfile.pending_earnings || 0) + earnedThisSnapshot,
              total_views_generated:
                (creatorProfile.total_views_generated || 0) + deltaViews,
            })
            .eq("user_id", sub.creator_id);
        }
      }

      synced++;
    }

    return new Response(
      JSON.stringify({ synced, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("sync-views error:", message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
