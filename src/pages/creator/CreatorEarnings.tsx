import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MetricCard from "@/components/shared/MetricCard";
import { IndianRupee, Eye, TrendingUp, Calendar } from "lucide-react";
import { formatINR } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const CreatorEarnings = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState({ totalEarned: 0, totalViews: 0, pendingEarnings: 0 });
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    if (profile?.id) fetchData();
  }, [profile?.id]);

  const fetchData = async () => {
    const [profileRes, subsRes] = await Promise.all([
      supabase.from("creator_profiles").select("total_earned, total_views_generated, pending_earnings").eq("user_id", profile!.id).single(),
      supabase.from("submissions").select("id, content_url, platform, verified_views, earned_amount, status")
        .eq("creator_id", profile!.id)
        .in("status", ["tracking", "approved"])
        .order("earned_amount", { ascending: false }),
    ]);

    if (profileRes.data) {
      setStats({
        totalEarned: Number(profileRes.data.total_earned) || 0,
        totalViews: Number(profileRes.data.total_views_generated) || 0,
        pendingEarnings: Number(profileRes.data.pending_earnings) || 0,
      });
    }
    setSubmissions(subsRes.data || []);
  };

  const avgCPM = stats.totalViews > 0 ? (stats.totalEarned / stats.totalViews) * 1000 : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl text-foreground">Earnings</h1>
        <p className="text-sm text-muted-foreground">Track your earnings across campaigns</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={<IndianRupee className="w-5 h-5" />} label="Total Earned" value={stats.totalEarned} prefix="₹" color="success" />
        <MetricCard icon={<Eye className="w-5 h-5" />} label="Total Views" value={stats.totalViews} color="info" />
        <MetricCard icon={<TrendingUp className="w-5 h-5" />} label="Avg CPM Earned" value={Math.round(avgCPM)} prefix="₹" color="primary" />
        <MetricCard icon={<Calendar className="w-5 h-5" />} label="Pending Earnings" value={stats.pendingEarnings} prefix="₹" color="warning" />
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <div className="p-5 border-b border-border/50">
          <h3 className="font-display font-bold text-foreground">Earnings by Submission</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left text-xs font-medium text-muted-foreground p-4">Submission</th>
                <th className="text-left text-xs font-medium text-muted-foreground p-4">Platform</th>
                <th className="text-right text-xs font-medium text-muted-foreground p-4">Views</th>
                <th className="text-right text-xs font-medium text-muted-foreground p-4">Earned</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s, i) => (
                <motion.tr key={s.id} className="border-b border-border/30 hover:bg-muted/30"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                  <td className="p-4 text-sm font-medium text-foreground">{s.id.slice(0, 8)}...</td>
                  <td className="p-4"><span className="badge-pill bg-muted text-muted-foreground text-[10px] capitalize">{s.platform}</span></td>
                  <td className="p-4 text-right text-sm font-mono text-foreground">{Number(s.verified_views).toLocaleString("en-IN")}</td>
                  <td className="p-4 text-right text-sm font-mono font-medium text-success">{formatINR(Number(s.earned_amount))}</td>
                </motion.tr>
              ))}
              {submissions.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-muted-foreground text-sm">No earnings yet. Submit content to campaigns to start earning!</td></tr>
              )}
            </tbody>
            {submissions.length > 0 && (
              <tfoot>
                <tr className="bg-muted/30">
                  <td className="p-4 text-sm font-bold text-foreground" colSpan={2}>Total</td>
                  <td className="p-4 text-right text-sm font-mono font-bold text-foreground">{stats.totalViews.toLocaleString("en-IN")}</td>
                  <td className="p-4 text-right text-sm font-mono font-bold text-success">{formatINR(stats.totalEarned)}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default CreatorEarnings;
