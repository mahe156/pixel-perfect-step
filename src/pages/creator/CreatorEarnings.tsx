import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MetricCard from "@/components/shared/MetricCard";
import { IndianRupee, Eye, TrendingUp, Calendar } from "lucide-react";
import { formatINR, formatViews } from "@/lib/format";
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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div>
        <h1 className="font-display font-extrabold text-xl sm:text-2xl text-foreground">Earnings</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">Track your earnings across campaigns</p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-4">
        <MetricCard icon={<IndianRupee className="w-4 h-4 sm:w-5 sm:h-5" />} label="Total Earned" value={stats.totalEarned} prefix="₹" color="success" />
        <MetricCard icon={<Eye className="w-4 h-4 sm:w-5 sm:h-5" />} label="Total Views" value={stats.totalViews} color="info" />
        <MetricCard icon={<TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />} label="Avg CPM" value={Math.round(avgCPM)} prefix="₹" color="primary" />
        <MetricCard icon={<Calendar className="w-4 h-4 sm:w-5 sm:h-5" />} label="Pending" value={stats.pendingEarnings} prefix="₹" color="warning" />
      </div>

      {/* Summary card */}
      {submissions.length > 0 && (
        <div className="glass rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-muted-foreground">Total from {submissions.length} submissions</p>
            <p className="text-xl font-bold font-mono text-success">{formatINR(stats.totalEarned)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground">Total Views</p>
            <p className="text-lg font-bold font-mono text-foreground">{formatViews(stats.totalViews)}</p>
          </div>
        </div>
      )}

      {/* Card list */}
      <div>
        <h3 className="font-display font-bold text-sm text-foreground mb-2.5">Earnings by Submission</h3>
        <div className="space-y-2">
          {submissions.map((s, i) => (
            <motion.div
              key={s.id}
              className="glass rounded-xl p-3.5"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    s.platform === "youtube" ? "bg-info/10 text-info" : "bg-premium/10 text-premium"
                  }`}>
                    {s.platform === "youtube" ? "YT" : "IG"}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Eye className="w-3 h-3" />
                      {formatViews(Number(s.verified_views))} views
                    </p>
                  </div>
                </div>
                <p className="text-sm font-mono font-bold text-success">{formatINR(Number(s.earned_amount))}</p>
              </div>
            </motion.div>
          ))}
          {submissions.length === 0 && (
            <div className="glass rounded-xl p-10 text-center text-muted-foreground text-sm">
              No earnings yet. Submit content to campaigns to start earning!
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CreatorEarnings;
