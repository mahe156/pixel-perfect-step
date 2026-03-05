import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MetricCard from "@/components/shared/MetricCard";
import { IndianRupee, Eye, FileText, TrendingUp, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatINR, formatViews } from "@/lib/format";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      {/* Greeting */}
      <div>
        <h1 className="font-display font-extrabold text-xl text-foreground">
          Hi, {profile?.full_name?.split(" ")[0] || "Creator"} 👋
        </h1>
        <p className="text-xs text-muted-foreground">Your performance at a glance</p>
      </div>

      {/* Metrics - 2x2 grid on mobile */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-4">
        <MetricCard icon={<IndianRupee className="w-4 h-4 sm:w-5 sm:h-5" />} label="Total Earned" value={stats.totalEarned} prefix="₹" color="success" />
        <MetricCard icon={<TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />} label="Pending" value={stats.pendingEarnings} prefix="₹" color="warning" />
        <MetricCard icon={<Eye className="w-4 h-4 sm:w-5 sm:h-5" />} label="Total Views" value={stats.totalViews} color="info" />
        <MetricCard icon={<FileText className="w-4 h-4 sm:w-5 sm:h-5" />} label="Submissions" value={stats.activeSubmissions} color="premium" />
      </div>

      {/* Recent Submissions */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="font-display font-bold text-sm text-foreground">Recent Submissions</h2>
          <Link to="/creator/submissions" className="text-[11px] text-primary font-medium flex items-center gap-0.5">
            View All <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        {recentSubmissions.length === 0 ? (
          <div className="glass rounded-xl p-6 text-center">
            <p className="text-sm text-muted-foreground">No submissions yet.</p>
            <Link to="/creator/campaigns" className="text-xs text-primary underline mt-1 inline-block">Browse campaigns</Link>
          </div>
        ) : (
          <div className="space-y-2">
            {recentSubmissions.map((sub, i) => (
              <motion.div
                key={sub.id}
                className="glass rounded-xl p-3 flex items-center justify-between"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                    sub.platform === "youtube" ? "bg-info/10 text-info" : "bg-premium/10 text-premium"
                  }`}>
                    {sub.platform === "youtube" ? "YT" : "IG"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatViews(Number(sub.verified_views))}</span>
                      <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" />{formatINR(Number(sub.earned_amount))}</span>
                    </div>
                  </div>
                </div>
                <Badge className={`text-[10px] px-2 py-0.5 ${
                  sub.status === "tracking" || sub.status === "approved"
                    ? "bg-success/15 text-success border-success/20"
                    : sub.status === "rejected"
                    ? "bg-destructive/15 text-destructive border-destructive/20"
                    : "bg-warning/15 text-warning border-warning/20"
                }`}>
                  {sub.status === "tracking" ? "Tracking" : sub.status === "approved" ? "Approved" : sub.status === "rejected" ? "Rejected" : "Pending"}
                </Badge>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Active Campaigns */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="font-display font-bold text-sm text-foreground">Active Campaigns</h2>
          <Link to="/creator/campaigns" className="text-[11px] text-primary font-medium flex items-center gap-0.5">
            Browse All <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        {recentCampaigns.length === 0 ? (
          <div className="glass rounded-xl p-6 text-center text-sm text-muted-foreground">No active campaigns right now.</div>
        ) : (
          <div className="space-y-2">
            {recentCampaigns.map((c, i) => (
              <Link key={c.id} to={`/creator/campaigns/${c.id}`}>
                <motion.div
                  className="glass rounded-xl p-3.5 flex items-center justify-between active:scale-[0.98] transition-transform"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {c.title.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground line-clamp-1">{c.title}</p>
                      <p className="text-[10px] text-muted-foreground capitalize">
                        {c.platform} · Ends {c.end_date ? new Date(c.end_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "TBD"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-mono font-bold text-primary">₹{c.cpm_rate}</p>
                    <p className="text-[10px] text-muted-foreground">per 1K</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CreatorDashboard;
