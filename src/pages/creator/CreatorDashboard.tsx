import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MetricCard from "@/components/shared/MetricCard";
import { IndianRupee, Eye, FileText, TrendingUp, ChevronRight, Sparkles, Megaphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatINR, formatViews } from "@/lib/format";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

const CreatorDashboard = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState({ totalEarned: 0, pendingEarnings: 0, totalViews: 0, activeSubmissions: 0 });
  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([]);
  const [recentCampaigns, setRecentCampaigns] = useState<any[]>([]);

  useEffect(() => {
    if (profile?.id) fetchData();
  }, [profile?.id]);

  const fetchData = async () => {
    const [profileRes, subsRes, campaignsRes] = await Promise.all([
      supabase.from("creator_profiles").select("total_earned, pending_earnings, total_views_generated, total_submissions").eq("user_id", profile!.id).single(),
      supabase.from("submissions").select("id, content_url, platform, status, verified_views, earned_amount, last_synced_at, created_at, campaign_id").eq("creator_id", profile!.id).order("created_at", { ascending: false }).limit(5),
      supabase.from("campaigns").select("id, title, cpm_rate, platform, end_date").eq("status", "active").order("created_at", { ascending: false }).limit(3),
    ]);

    if (profileRes.data) {
      const p = profileRes.data;
      setStats({
        totalEarned: Number(p.total_earned) || 0,
        pendingEarnings: Number(p.pending_earnings) || 0,
        totalViews: Number(p.total_views_generated) || 0,
        activeSubmissions: Number(p.total_submissions) || 0,
      });
    }
    setRecentSubmissions(subsRes.data || []);
    setRecentCampaigns(campaignsRes.data || []);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      {/* Greeting Card */}
      <motion.div variants={item} className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-primary/10 via-card/80 to-premium/5 border border-primary/10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-[10px] uppercase tracking-widest text-primary font-bold">Dashboard</span>
            </div>
            <h1 className="font-display font-extrabold text-xl text-foreground">
              Hi, {profile?.full_name?.split(" ")[0] || "Creator"} 👋
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">Your performance at a glance</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-premium/15 border border-primary/15 flex items-center justify-center">
            <span className="text-lg font-bold text-primary">{profile?.full_name?.charAt(0) || "C"}</span>
          </div>
        </div>
      </motion.div>

      {/* Metrics - 2x2 grid */}
      <motion.div variants={item} className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <MetricCard icon={<IndianRupee className="w-4 h-4 sm:w-5 sm:h-5" />} label="Total Earned" value={stats.totalEarned} prefix="₹" color="success" />
        <MetricCard icon={<TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />} label="Pending" value={stats.pendingEarnings} prefix="₹" color="warning" />
        <MetricCard icon={<Eye className="w-4 h-4 sm:w-5 sm:h-5" />} label="Total Views" value={stats.totalViews} color="info" />
        <MetricCard icon={<FileText className="w-4 h-4 sm:w-5 sm:h-5" />} label="Submissions" value={stats.activeSubmissions} color="premium" />
      </motion.div>

      {/* Recent Submissions */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-sm text-foreground">Recent Submissions</h2>
          <Link to="/creator/submissions" className="text-[11px] text-primary font-semibold flex items-center gap-0.5 hover:gap-1.5 transition-all">
            View All <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {recentSubmissions.length === 0 ? (
          <div className="rounded-2xl p-8 text-center bg-card/60 backdrop-blur-xl border border-border/30">
            <div className="w-12 h-12 rounded-2xl bg-muted mx-auto mb-3 flex items-center justify-center">
              <FileText className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No submissions yet.</p>
            <Link to="/creator/campaigns" className="text-xs text-primary font-semibold mt-2 inline-block">Browse campaigns →</Link>
          </div>
        ) : (
          <div className="space-y-2">
            {recentSubmissions.map((sub, i) => (
              <motion.div
                key={sub.id}
                className="rounded-2xl p-3.5 flex items-center justify-between bg-card/60 backdrop-blur-xl border border-border/20 active:scale-[0.98] transition-transform"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-bold ${
                    sub.platform === "youtube" ? "bg-info/10 text-info border border-info/15" : "bg-premium/10 text-premium border border-premium/15"
                  }`}>
                    {sub.platform === "youtube" ? "YT" : "IG"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatViews(Number(sub.verified_views))}</span>
                      <span className="flex items-center gap-1 font-mono font-semibold text-foreground"><IndianRupee className="w-3 h-3" />{formatINR(Number(sub.earned_amount))}</span>
                    </div>
                  </div>
                </div>
                <Badge className={`text-[10px] px-2.5 py-0.5 rounded-full border font-semibold ${
                  sub.status === "tracking" || sub.status === "approved"
                    ? "bg-success/10 text-success border-success/20"
                    : sub.status === "rejected"
                    ? "bg-destructive/10 text-destructive border-destructive/20"
                    : "bg-warning/10 text-warning border-warning/20"
                }`}>
                  {sub.status === "tracking" ? "Tracking" : sub.status === "approved" ? "Approved" : sub.status === "rejected" ? "Rejected" : "Pending"}
                </Badge>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Active Campaigns */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-sm text-foreground">Active Campaigns</h2>
          <Link to="/creator/campaigns" className="text-[11px] text-primary font-semibold flex items-center gap-0.5 hover:gap-1.5 transition-all">
            Browse All <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {recentCampaigns.length === 0 ? (
          <div className="rounded-2xl p-8 text-center bg-card/60 backdrop-blur-xl border border-border/30">
            <div className="w-12 h-12 rounded-2xl bg-muted mx-auto mb-3 flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No active campaigns right now.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {recentCampaigns.map((c, i) => (
              <Link key={c.id} to={`/creator/campaigns/${c.id}`}>
                <motion.div
                  className="rounded-2xl p-4 flex items-center justify-between bg-card/60 backdrop-blur-xl border border-border/20 active:scale-[0.98] transition-transform"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/15 flex items-center justify-center text-sm font-bold text-primary">
                      {c.title.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground line-clamp-1">{c.title}</p>
                      <p className="text-[10px] text-muted-foreground capitalize mt-0.5">
                        {c.platform} · Ends {c.end_date ? new Date(c.end_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "TBD"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 bg-primary/8 rounded-xl px-3 py-1.5 border border-primary/10">
                    <p className="text-sm font-mono font-bold text-primary">₹{c.cpm_rate}</p>
                    <p className="text-[9px] text-muted-foreground">per 1K</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default CreatorDashboard;
