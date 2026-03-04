import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MetricCard from "@/components/shared/MetricCard";
import { IndianRupee, Eye, Megaphone, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatINR, formatViews } from "@/lib/format";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const BrandDashboard = () => {
  const { profile } = useAuth();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalBudget: 0, totalViews: 0, activeCampaigns: 0, avgCPM: 0 });

  useEffect(() => {
    if (profile?.id) fetchData();
  }, [profile?.id]);

  const fetchData = async () => {
    const { data } = await supabase
      .from("campaigns")
      .select("*")
      .eq("brand_id", profile!.id)
      .order("created_at", { ascending: false });

    const all = data || [];
    setCampaigns(all.filter(c => c.status === "active"));

    const totalBudget = all.reduce((s, c) => s + Number(c.total_budget), 0);
    const totalViews = all.reduce((s, c) => s + Number(c.total_verified_views || 0), 0);
    const totalSpent = all.reduce((s, c) => s + Number(c.spent_amount || 0), 0);
    setStats({
      totalBudget,
      totalViews,
      activeCampaigns: all.filter(c => c.status === "active").length,
      avgCPM: totalViews > 0 ? Math.round((totalSpent / totalViews) * 1000) : 0,
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-foreground">Brand Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage your campaigns and track performance.</p>
        </div>
        <Button asChild><Link to="/brand/campaigns/new">+ New Campaign</Link></Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={<IndianRupee className="w-5 h-5" />} label="Total Budget" value={stats.totalBudget} prefix="₹" color="primary" />
        <MetricCard icon={<Eye className="w-5 h-5" />} label="Total Views" value={stats.totalViews} color="info" />
        <MetricCard icon={<Megaphone className="w-5 h-5" />} label="Active Campaigns" value={stats.activeCampaigns} color="success" />
        <MetricCard icon={<TrendingUp className="w-5 h-5" />} label="Avg CPM" value={stats.avgCPM} prefix="₹" color="warning" />
      </div>

      <Card className="glass border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-display text-base">Active Campaigns</CardTitle>
          <Button variant="ghost" size="sm" asChild className="text-xs text-primary"><Link to="/brand/campaigns">View All</Link></Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {campaigns.map((c) => {
            const pct = Number(c.total_budget) > 0 ? (Number(c.spent_amount) / Number(c.total_budget)) * 100 : 0;
            return (
              <div key={c.id} className="glass rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-foreground">{c.title}</h3>
                    <Badge variant="outline" className="text-xs capitalize">{c.platform}</Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                    <span>{formatViews(Number(c.total_verified_views || 0))} views</span>
                    <span>{c.total_submissions || 0} creators</span>
                  </div>
                </div>
                <div className="sm:w-48 space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatINR(Number(c.spent_amount))}</span><span>{pct.toFixed(0)}%</span>
                  </div>
                  <Progress value={pct} className="h-1.5" />
                </div>
                <Button variant="outline" size="sm" asChild className="text-xs"><Link to={`/brand/campaigns/${c.id}`}>Details</Link></Button>
              </div>
            );
          })}
          {campaigns.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No active campaigns. <Link to="/brand/campaigns/new" className="text-primary underline">Create one!</Link>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BrandDashboard;
