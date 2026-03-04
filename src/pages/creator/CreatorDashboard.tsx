import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MetricCard from "@/components/shared/MetricCard";
import { IndianRupee, Eye, FileText, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl text-foreground">Creator Dashboard</h1>
        <p className="text-sm text-muted-foreground">Your performance at a glance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={<IndianRupee className="w-5 h-5" />} label="Total Earned" value={stats.totalEarned} prefix="₹" color="success" />
        <MetricCard icon={<TrendingUp className="w-5 h-5" />} label="Pending Earnings" value={stats.pendingEarnings} prefix="₹" color="warning" />
        <MetricCard icon={<Eye className="w-5 h-5" />} label="Total Views" value={stats.totalViews} color="info" />
        <MetricCard icon={<FileText className="w-5 h-5" />} label="Total Submissions" value={stats.activeSubmissions} color="premium" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="glass border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-base">Recent Submissions</CardTitle>
            <Button variant="ghost" size="sm" asChild className="text-xs text-primary">
              <Link to="/creator/submissions">View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentSubmissions.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No submissions yet. <Link to="/creator/campaigns" className="text-primary underline">Browse campaigns</Link></p>
            )}
            {recentSubmissions.map((sub) => (
              <div key={sub.id} className="glass rounded-lg p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground truncate max-w-[200px]">{sub.id.slice(0, 8)}...</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatViews(Number(sub.verified_views))}</span>
                    <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" />{formatINR(Number(sub.earned_amount))}</span>
                  </div>
                </div>
                <Badge className={sub.status === "tracking" ? "bg-success/20 text-success text-xs" : sub.status === "approved" ? "bg-success/20 text-success text-xs" : "bg-warning/20 text-warning text-xs"}>
                  {sub.status === "tracking" ? "Tracking" : sub.status === "approved" ? "Approved" : sub.status === "rejected" ? "Rejected" : "Pending"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-base">Active Campaigns</CardTitle>
            <Button variant="ghost" size="sm" asChild className="text-xs text-primary">
              <Link to="/creator/campaigns">Browse All</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentCampaigns.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No active campaigns right now.</p>
            )}
            {recentCampaigns.map((c) => (
              <div key={c.id} className="glass rounded-lg p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{c.title}</p>
                  <p className="text-xs text-muted-foreground capitalize">{c.platform} · Ends {c.end_date ? new Date(c.end_date).toLocaleDateString() : "TBD"}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono font-bold text-primary">₹{c.cpm_rate}</p>
                  <p className="text-xs text-muted-foreground">per 1K</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default CreatorDashboard;
