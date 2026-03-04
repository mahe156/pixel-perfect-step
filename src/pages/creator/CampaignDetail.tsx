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
  ArrowLeft, Eye, Users, Youtube, Instagram, CheckCircle, AlertTriangle,
  Send, Loader2, Shield,
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ConnectedAccount {
  id: string;
  platform: string;
  handle: string;
  bio_verified: boolean;
}

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
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    setLoading(true);
    const { data } = await supabase.from("campaigns").select("*").eq("id", id).single();
    setCampaign(data);
    setLoading(false);
  };

  useEffect(() => {
    if (dialogOpen && profile?.id) fetchConnectedAccounts();
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
      const campaignPlatform = campaign?.platform as string;
      const platformAccounts = data.filter((a) =>
        campaignPlatform === "both" || a.platform === campaignPlatform
      ) as ConnectedAccount[];
      setConnectedAccounts(platformAccounts);
      if (platformAccounts.length === 1) setSelectedAccountId(platformAccounts[0].id);
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
      toast.error("Invalid campaign. Cannot submit.");
      return;
    }

    const platform = detectPlatform(submitUrl);
    if (!platform) { toast.error("Please enter a valid YouTube or Instagram URL"); return; }

    const selectedAccount = connectedAccounts.find((a) => a.id === selectedAccountId);
    if (!selectedAccount) { toast.error("Please select a verified account"); return; }
    if (selectedAccount.platform !== platform) {
      toast.error(`URL is for ${platform} but selected account is ${selectedAccount.platform}`);
      return;
    }

    setSubmitting(true);
    try {
      let ytVideoId: string | null = null;
      if (platform === "youtube") {
        const match = submitUrl.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        ytVideoId = match ? match[1] : null;
      }

      const { data: submission, error } = await supabase
        .from("submissions")
        .insert({
          campaign_id: id,
          creator_id: profile!.id,
          content_url: submitUrl,
          platform,
          yt_video_id: ytVideoId,
          ig_media_id: null,
          status: "pending_review" as const,
        })
        .select("id")
        .single();

      if (error) throw error;

      if (submission?.id) {
        supabase.functions.invoke("sync-views", { body: { submission_id: submission.id } });
      }

      setDialogOpen(false);
      setSubmitUrl("");
      setSelectedAccountId("");
      toast.success("Link submitted! Views are being tracked.");
    } catch (err: any) {
      if (err.code === "23505" || err.message?.includes("duplicate")) {
        toast.error("This link has already been submitted.");
      } else {
        toast.error(err.message || "Failed to submit.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="glass rounded-xl p-12 text-center text-muted-foreground">
        Campaign not found.
        <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const daysLeft = campaign.end_date ? Math.max(0, Math.ceil((new Date(campaign.end_date).getTime() - Date.now()) / 86400000)) : "—";
  const budgetUsed = (Number(campaign.spent_amount) / Number(campaign.total_budget)) * 100;

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
              <span className="badge-pill bg-info/10 text-info border border-info/30 text-xs flex items-center gap-1 capitalize">
                {campaign.platform === "youtube" ? <Youtube className="w-3 h-3" /> : <Instagram className="w-3 h-3" />} {campaign.platform}
              </span>
              <span className="badge-pill bg-success/10 text-success border border-success/30 text-xs capitalize">{campaign.status}</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl text-foreground mb-2">{campaign.title}</h1>
            <p className="text-sm text-muted-foreground mb-4">{campaign.description}</p>
            <div className="flex flex-wrap gap-2">
              {(campaign.niche_tags || []).map((t: string) => (
                <span key={t} className="badge-pill bg-muted text-muted-foreground text-xs">{t}</span>
              ))}
              {(campaign.language_tags || []).map((t: string) => (
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
                  {loadingAccounts ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" /> Loading verified accounts...
                    </div>
                  ) : connectedAccounts.length === 0 ? (
                    <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 text-center space-y-2">
                      <Shield className="w-6 h-6 text-warning mx-auto" />
                      <p className="text-sm font-medium text-foreground">No verified accounts found</p>
                      <p className="text-xs text-muted-foreground">Connect & verify an account on your Profile page first.</p>
                      <Button size="sm" variant="outline" onClick={() => { setDialogOpen(false); navigate("/creator/profile"); }}>Go to Profile</Button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-foreground">Submit from verified account</label>
                        <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                          <SelectTrigger className="bg-muted border-border"><SelectValue placeholder="Select account..." /></SelectTrigger>
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
                        <Input value={submitUrl} onChange={(e) => setSubmitUrl(e.target.value)}
                          placeholder="https://youtube.com/watch?v=... or https://instagram.com/reel/..."
                          className="bg-muted border-border" />
                      </div>
                      {submitUrl && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {detectPlatform(submitUrl) === "youtube" ? (<><Youtube className="w-3 h-3 text-info" /> YouTube detected</>) :
                           detectPlatform(submitUrl) === "instagram" ? (<><Instagram className="w-3 h-3 text-premium" /> Instagram detected</>) :
                           (<><AlertTriangle className="w-3 h-3 text-destructive" /> Not a valid platform URL</>)}
                        </div>
                      )}
                      <Button onClick={handleSubmit} disabled={submitting || !submitUrl || !selectedAccountId} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
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
          <p className="text-lg font-bold font-mono text-foreground">{formatINR(Number(campaign.total_budget) - Number(campaign.spent_amount))}</p>
          <Progress value={budgetUsed} className="h-1 mt-2 bg-muted" />
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Creators Joined</p>
          <p className="text-lg font-bold font-mono text-foreground">{campaign.total_submissions || 0}/{campaign.max_creators || "∞"}</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Views Tracked</p>
          <p className="text-lg font-bold font-mono text-info">{formatViews(Number(campaign.total_verified_views) || 0)}</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Days Left</p>
          <p className="text-lg font-bold font-mono text-warning">{daysLeft}</p>
        </div>
      </div>

      {/* Eligibility + Guidelines */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-6 space-y-4">
          <h3 className="font-display font-bold text-foreground">Eligibility</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="text-foreground">Min {(campaign.min_followers || 0).toLocaleString("en-IN")} followers</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="text-foreground">Min {campaign.min_reliability_score || 3} reliability score</span>
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-6 space-y-4">
          <h3 className="font-display font-bold text-foreground">Content Guidelines</h3>
          <p className="text-sm text-muted-foreground">{campaign.content_guidelines || "No specific guidelines provided."}</p>
          <div className="flex flex-wrap gap-1.5">
            {(campaign.hashtags || []).map((h: string) => (
              <span key={h} className="badge-pill bg-primary/10 text-primary border border-primary/30 text-xs">{h}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Do/Don't */}
      {((campaign.do_list && campaign.do_list.length > 0) || (campaign.dont_list && campaign.dont_list.length > 0)) && (
        <div className="grid lg:grid-cols-2 gap-6">
          {campaign.do_list && campaign.do_list.length > 0 && (
            <div className="glass rounded-xl p-6">
              <h3 className="font-display font-bold text-success mb-3">✓ Do's</h3>
              <ul className="space-y-2">
                {campaign.do_list.map((item: string) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />{item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {campaign.dont_list && campaign.dont_list.length > 0 && (
            <div className="glass rounded-xl p-6">
              <h3 className="font-display font-bold text-destructive mb-3">✕ Don'ts</h3>
              <ul className="space-y-2">
                {campaign.dont_list.map((item: string) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                    <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />{item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default CampaignDetail;
