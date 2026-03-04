import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { formatINR, formatViews } from "@/lib/format";
import {
  ArrowLeft, Eye, Users, Youtube, Instagram, Calendar, CheckCircle, AlertTriangle,
  ExternalLink, Send, Clock, Loader2, Shield,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface ConnectedAccount {
  id: string;
  platform: string;
  handle: string;
  bio_verified: boolean;
}

// Demo campaign detail
const demoCampaign = {
  id: "demo-1",
  title: "boAt Airdopes X Review",
  description: "Create an honest, engaging review of the boAt Airdopes X wireless earbuds. Show the unboxing, test audio quality, and share your genuine experience. The video should be at least 3 minutes long.",
  platform: "both" as const,
  cpm_rate: 80,
  total_budget: 500000,
  spent_amount: 325000,
  total_submissions: 142,
  total_verified_views: 4062500,
  min_followers: 5000,
  min_reliability_score: 3.5,
  max_creators: 300,
  niche_tags: ["Tech", "Gadgets"],
  language_tags: ["Hindi", "English"],
  hashtags: ["#boAtAirdopesX", "#boAtLifestyle", "#WirelessFreedom"],
  do_list: ["Show the full unboxing process", "Test audio quality with music", "Compare with at least one competitor", "Include the product link in description"],
  dont_list: ["Don't bash competitor products directly", "Don't use misleading thumbnails", "Don't include any other brand promotions"],
  content_guidelines: "Keep the review authentic and balanced. Mention both pros and cons. The video must be at least 3 minutes and the earbuds must be the main focus.",
  start_date: "2026-02-15T00:00:00Z",
  end_date: "2026-03-25T00:00:00Z",
  status: "active",
};

const leaderboard = [
  { rank: 1, name: "Rahul Verma", followers: "450K", views: 128400, earned: 10272 },
  { rank: 2, name: "Vikram Singh", followers: "320K", views: 98200, earned: 7856 },
  { rank: 3, name: "Priya Sharma", followers: "125K", views: 67500, earned: 5400 },
  { rank: 4, name: "Arjun Mehta", followers: "680K", views: 52100, earned: 4168 },
  { rank: 5, name: "Sneha Reddy", followers: "200K", views: 45200, earned: 3616 },
];

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [submitUrl, setSubmitUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [loadingAccounts, setLoadingAccounts] = useState(false);

  const campaign = demoCampaign;
  const daysLeft = Math.max(0, Math.ceil((new Date(campaign.end_date).getTime() - Date.now()) / 86400000));
  const budgetUsed = (campaign.spent_amount / campaign.total_budget) * 100;

  // Fetch connected accounts when dialog opens
  useEffect(() => {
    if (dialogOpen && profile?.id) {
      fetchConnectedAccounts();
    }
  }, [dialogOpen, profile?.id]);

  const fetchConnectedAccounts = async () => {
    setLoadingAccounts(true);
    const { data } = await supabase
      .from("connected_accounts")
      .select("id, platform, handle, bio_verified")
      .eq("user_id", profile!.id)
      .eq("is_active", true)
      .eq("bio_verified", true);

    if (data) {
      // Filter by campaign platform
      const campaignPlatform = campaign.platform as string;
      const platformAccounts = data.filter((a) =>
        campaignPlatform === "both" || a.platform === campaignPlatform
      ) as ConnectedAccount[];
      setConnectedAccounts(platformAccounts);
      if (platformAccounts.length === 1) {
        setSelectedAccountId(platformAccounts[0].id);
      }
    }
    setLoadingAccounts(false);
  };

  const detectPlatform = (url: string): "youtube" | "instagram" | null => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
    if (url.includes("instagram.com")) return "instagram";
    return null;
  };

  const isValidUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

  const handleSubmit = async () => {
    if (!submitUrl || !selectedAccountId) return;

    if (!id || !isValidUUID(id)) {
      toast.error("This is a demo campaign. Submissions require a real campaign.");
      return;
    }

    const platform = detectPlatform(submitUrl);
    if (!platform) {
      toast.error("Please enter a valid YouTube or Instagram URL");
      return;
    }

    // Validate URL matches selected account platform
    const selectedAccount = connectedAccounts.find((a) => a.id === selectedAccountId);
    if (!selectedAccount) {
      toast.error("Please select a verified account");
      return;
    }

    if (selectedAccount.platform !== platform) {
      toast.error(`URL is for ${platform} but selected account is ${selectedAccount.platform}`);
      return;
    }

    setSubmitting(true);
    try {
      // Extract video/reel ID
      let ytVideoId: string | null = null;
      let igMediaId: string | null = null;

      if (platform === "youtube") {
        const match = submitUrl.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        ytVideoId = match ? match[1] : null;
      }

      // Insert submission into DB
      const { data: submission, error } = await supabase
        .from("submissions")
        .insert({
          campaign_id: id, // Use route param; in production this would be a real campaign ID
          creator_id: profile!.id,
          content_url: submitUrl,
          platform,
          yt_video_id: ytVideoId,
          ig_media_id: igMediaId,
          status: "pending_review" as const,
        })
        .select("id")
        .single();

      if (error) throw error;

      // Immediately trigger view sync for this submission
      if (submission?.id) {
        supabase.functions.invoke("sync-views", {
          body: { submission_id: submission.id },
        }).then(({ data, error }) => {
          if (error) {
            console.error("Initial view sync failed:", error);
          } else {
            console.log("Initial view sync completed:", data);
          }
        });
      }

      setDialogOpen(false);
      setSubmitUrl("");
      setSelectedAccountId("");
      toast.success("Link submitted! Initial view count is being tracked. It will be reviewed shortly.");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back to Campaigns
      </button>

      {/* Hero */}
      <div className="glass rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="badge-pill bg-info/10 text-info border border-info/30 text-xs flex items-center gap-1">
                <Youtube className="w-3 h-3" /> YouTube
              </span>
              <span className="badge-pill bg-success/10 text-success border border-success/30 text-xs">Active</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl text-foreground mb-2">{campaign.title}</h1>
            <p className="text-sm text-muted-foreground mb-4">{campaign.description}</p>
            <div className="flex flex-wrap gap-2">
              {campaign.niche_tags.map((t) => (
                <span key={t} className="badge-pill bg-muted text-muted-foreground text-xs">{t}</span>
              ))}
              {campaign.language_tags.map((t) => (
                <span key={t} className="badge-pill bg-muted text-muted-foreground text-xs">{t}</span>
              ))}
            </div>
          </div>
          <div className="lg:text-right space-y-2">
            <p className="text-3xl font-bold font-mono text-primary">₹{campaign.cpm_rate}</p>
            <p className="text-xs text-muted-foreground">per 1,000 views</p>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full lg:w-auto mt-2">
                  <Send className="w-4 h-4 mr-2" /> Submit Your Link
                </Button>
              </DialogTrigger>
              <DialogContent className="glass border-border">
                <DialogHeader>
                  <DialogTitle className="font-display text-foreground">Submit Your Content Link</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  {/* Account selector */}
                  {loadingAccounts ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" /> Loading your verified accounts...
                    </div>
                  ) : connectedAccounts.length === 0 ? (
                    <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 text-center space-y-2">
                      <Shield className="w-6 h-6 text-warning mx-auto" />
                      <p className="text-sm font-medium text-foreground">No verified accounts found</p>
                      <p className="text-xs text-muted-foreground">You need to connect & verify at least one {campaign.platform} account on your Profile page before submitting.</p>
                      <Button size="sm" variant="outline" onClick={() => { setDialogOpen(false); navigate("/creator/profile"); }}>
                        Go to Profile
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-foreground">Submit from verified account</label>
                        <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                          <SelectTrigger className="bg-muted border-border">
                            <SelectValue placeholder="Select account..." />
                          </SelectTrigger>
                          <SelectContent>
                            {connectedAccounts.map((acc) => (
                              <SelectItem key={acc.id} value={acc.id}>
                                <div className="flex items-center gap-2">
                                  {acc.platform === "youtube" ? <Youtube className="w-3 h-3 text-info" /> : <Instagram className="w-3 h-3 text-premium" />}
                                  @{acc.handle}
                                  <CheckCircle className="w-3 h-3 text-success" />
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-medium text-foreground">Content URL</label>
                        <Input
                          value={submitUrl}
                          onChange={(e) => setSubmitUrl(e.target.value)}
                          placeholder="https://youtube.com/watch?v=... or https://instagram.com/reel/..."
                          className="bg-muted border-border"
                        />
                      </div>

                      {submitUrl && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {detectPlatform(submitUrl) === "youtube" ? (
                            <><Youtube className="w-3 h-3 text-info" /> YouTube detected</>
                          ) : detectPlatform(submitUrl) === "instagram" ? (
                            <><Instagram className="w-3 h-3 text-premium" /> Instagram detected</>
                          ) : (
                            <><AlertTriangle className="w-3 h-3 text-destructive" /> Not a valid platform URL</>
                          )}
                        </div>
                      )}

                      <Button
                        onClick={handleSubmit}
                        disabled={submitting || !submitUrl || !selectedAccountId}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</> : "Submit Link"}
                      </Button>
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Budget Remaining</p>
          <p className="text-lg font-bold font-mono text-foreground">{formatINR(campaign.total_budget - campaign.spent_amount)}</p>
          <Progress value={budgetUsed} className="h-1 mt-2 bg-muted" />
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Creators Joined</p>
          <p className="text-lg font-bold font-mono text-foreground">{campaign.total_submissions}/{campaign.max_creators}</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Views Tracked</p>
          <p className="text-lg font-bold font-mono text-info">{formatViews(campaign.total_verified_views)}</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Days Left</p>
          <p className="text-lg font-bold font-mono text-warning">{daysLeft}</p>
        </div>
      </div>

      {/* Eligibility + Requirements */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-6 space-y-4">
          <h3 className="font-display font-bold text-foreground">Eligibility</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="text-foreground">Min {campaign.min_followers.toLocaleString("en-IN")} followers</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="text-foreground">Min {campaign.min_reliability_score} reliability score</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="text-foreground">YouTube content creators</span>
            </div>
          </div>
          <div className="bg-success/10 border border-success/30 rounded-lg p-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-success" />
            <span className="text-sm text-success font-medium">You qualify for this campaign!</span>
          </div>
        </div>

        <div className="glass rounded-xl p-6 space-y-4">
          <h3 className="font-display font-bold text-foreground">Content Guidelines</h3>
          <p className="text-sm text-muted-foreground">{campaign.content_guidelines}</p>
          <div className="flex flex-wrap gap-1.5">
            {campaign.hashtags.map((h) => (
              <span key={h} className="badge-pill bg-primary/10 text-primary border border-primary/30 text-xs">{h}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Do/Don't */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-6">
          <h3 className="font-display font-bold text-success mb-3">✓ Do's</h3>
          <ul className="space-y-2">
            {campaign.do_list.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="glass rounded-xl p-6">
          <h3 className="font-display font-bold text-destructive mb-3">✕ Don'ts</h3>
          <ul className="space-y-2">
            {campaign.dont_list.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="p-5 border-b border-border/50">
          <h3 className="font-display font-bold text-foreground">Creator Leaderboard</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Rank</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Creator</th>
              <th className="text-right text-xs font-medium text-muted-foreground p-4">Followers</th>
              <th className="text-right text-xs font-medium text-muted-foreground p-4">Views</th>
              <th className="text-right text-xs font-medium text-muted-foreground p-4">Earned</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((l) => (
              <tr key={l.rank} className="border-b border-border/30 hover:bg-muted/30">
                <td className="p-4">
                  <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-bold ${
                    l.rank <= 3 ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                  }`}>
                    {l.rank}
                  </span>
                </td>
                <td className="p-4 text-sm font-medium text-foreground">{l.name}</td>
                <td className="p-4 text-right text-sm text-muted-foreground">{l.followers}</td>
                <td className="p-4 text-right text-sm font-mono text-info">{formatViews(l.views)}</td>
                <td className="p-4 text-right text-sm font-mono font-medium text-success">{formatINR(l.earned)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default CampaignDetail;
