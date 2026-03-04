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

    // Authenticate user
    const authHeader = req.headers.get("authorization");
    if (!authHeader) throw new Error("Missing authorization header");

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (authError || !user) throw new Error("Unauthorized");

    const { platform, handle, verification_code } = await req.json();
    if (!platform || !handle || !verification_code) {
      throw new Error("Missing platform, handle, or verification_code");
    }

    // Get the user's internal ID
    const { data: userData } = await supabase
      .from("users")
      .select("id")
      .eq("auth_id", user.id)
      .single();
    if (!userData) throw new Error("User not found");

    let actorId: string;
    let input: Record<string, unknown>;

    if (platform === "youtube") {
      // Use Apify YouTube Channel Scraper
      actorId = "streamers~youtube-channel-scraper";
      input = {
        channelUrls: [`https://www.youtube.com/@${handle}`],
        maxResults: 1,
      };
    } else if (platform === "instagram") {
      // Use Apify Instagram Profile Scraper
      actorId = "apify~instagram-profile-scraper";
      input = {
        usernames: [handle],
      };
    } else {
      throw new Error("Invalid platform. Use 'youtube' or 'instagram'");
    }

    // Start Apify actor run
    const runRes = await fetch(
      `https://api.apify.com/v2/acts/${actorId}/runs?token=${APIFY_API_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }
    );

    if (!runRes.ok) {
      const errBody = await runRes.text();
      throw new Error(`Apify actor start failed [${runRes.status}]: ${errBody}`);
    }

    const runData = await runRes.json();
    const runId = runData.data?.id;
    if (!runId) throw new Error("No run ID returned from Apify");

    // Insert bio_verification record
    await supabase.from("bio_verifications").insert({
      creator_id: userData.id,
      platform,
      verification_code,
      apify_run_id: runId,
      status: "checking",
    });

    // Poll for completion (max 60s)
    let verified = false;
    let attempts = 0;
    const maxAttempts = 12;

    while (attempts < maxAttempts) {
      await new Promise((r) => setTimeout(r, 5000));
      attempts++;

      const statusRes = await fetch(
        `https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_API_TOKEN}`
      );
      const statusData = await statusRes.json();
      await statusRes.text().catch(() => {});

      if (statusData.data?.status === "SUCCEEDED") {
        // Fetch dataset items
        const datasetId = statusData.data.defaultDatasetId;
        const itemsRes = await fetch(
          `https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_API_TOKEN}`
        );
        const items = await itemsRes.json();

        if (items && items.length > 0) {
          const profile = items[0];
          // Check bio/description for verification code
          const bioText = (
            profile.channelDescription ||
            profile.biography ||
            profile.description ||
            profile.bio ||
            ""
          ).toLowerCase();

          if (bioText.includes(verification_code.toLowerCase())) {
            verified = true;
          }
        }
        break;
      } else if (
        statusData.data?.status === "FAILED" ||
        statusData.data?.status === "ABORTED"
      ) {
        break;
      }
    }

    // Update bio_verification record
    await supabase
      .from("bio_verifications")
      .update({
        status: verified ? "verified" : "failed",
        verified_at: verified ? new Date().toISOString() : null,
      })
      .eq("apify_run_id", runId);

    // Update creator profile if verified
    if (verified) {
      await supabase
        .from("creator_profiles")
        .update({
          bio_verified: true,
          bio_verified_at: new Date().toISOString(),
          bio_verification_code: verification_code,
          kyc_status: "verified",
        })
        .eq("user_id", userData.id);
    }

    return new Response(
      JSON.stringify({ verified, run_id: runId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("verify-bio error:", message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
