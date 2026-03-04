import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import MetricCard from "@/components/shared/MetricCard";
import { Users, Megaphone, Wallet, AlertTriangle, FileText, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatINR } from "@/lib/format";
import { Link } from "react-router-dom";
import { useRealtimeAdminFeed } from "@/hooks/useRealtime";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0, activeCampaigns: 0, pendingPayouts: 0, platformRevenue: 0, flaggedSubmissions: 0,
    creators: 0, brands: 0, admins: 0, pendingKYC: 0,
  });
  const [feed, setFeed] = useState<{ id: string; text: string; time: string; type: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    const [usersRes, campaignsRes, submissionsRes, payoutsRes, creatorsRes] = await Promise.all([
      supabase.from("users").select("id, role", { count: "exact" }),
      supabase.from("campaigns").select("id, status, spent_amount, total_budget", { count: "exact" }),
      supabase.from("submissions").select("id, is_flagged, status, created_at").order("created_at", { ascending: false }).limit(20),
      supabase.from("payouts").select("id, status, net_amount"),
      supabase.from("creator_profiles").select("id, kyc_status"),
    ]);

    const users = usersRes.data || [];
    const campaigns = campaignsRes.data || [];
    const submissions = submissionsRes.data || [];
    const payouts = payoutsRes.data || [];
    const creators = creatorsRes.data || [];

    const pendingPayoutTotal = payouts.filter(p => p.status === "pending").reduce((s, p) => s + Number(p.net_amount), 0);
    const platformRevenue = campaigns.reduce((s, c) => s + Number(c.spent_amount || 0) * 0.2, 0);

    setStats({
      totalUsers: users.length,
      activeCampaigns: campaigns.filter(c => c.status === "active").length,
      pendingPayouts: pendingPayoutTotal,
      platformRevenue: Math.round(platformRevenue),
      flaggedSubmissions: submissions.filter(s => s.is_flagged).length,
      creators: users.filter(u => u.role === "creator").length,
      brands: users.filter(u => u.role === "brand").length,
      admins: users.filter(u => u.role === "admin").length,
      pendingKYC: creators.filter(c => c.kyc_status === "pending" || c.kyc_status === "submitted").length,
    });

    // Build feed from recent submissions
    const feedItems = submissions.slice(0, 10).map((s) => ({
      id: s.id,
      text: `Submission ${s.id.slice(0, 8)}... — ${s.status}${s.is_flagged ? " 🚨 FLAGGED" : ""}`,
      time: new Date(s.created_at!).toLocaleString(),
      type: s.is_flagged ? "fraud" : "submission",
    }));
    setFeed(feedItems);
    setLoading(false);
  };

  const handleNewSubmission = useCallback((payload: any) => {
    setFeed((prev) => [
      { id: Date.now().toString(), text: `New submission received (ID: ${payload.id?.slice(0, 8)}...)`, time: "Just now", type: "submission" },
      ...prev,
    ].slice(0, 20));
  }, []);

  useRealtimeAdminFeed(handleNewSubmission);

  const feedIcon: Record<string, string> = {
    submission: "📤", payout: "💸", user: "👤", milestone: "🏆", fraud: "🚨", kyc: "✅", deposit: "💰",
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl text-foreground">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Platform overview and management.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard icon={<Users className="w-5 h-5" />} label="Total Users" value={stats.totalUsers} color="info" />
        <MetricCard icon={<Megaphone className="w-5 h-5" />} label="Active Campaigns" value={stats.activeCampaigns} color="success" />
        <MetricCard icon={<Wallet className="w-5 h-5" />} label="Pending Payouts" value={stats.pendingPayouts} prefix="₹" color="warning" />
        <MetricCard icon={<FileText className="w-5 h-5" />} label="Platform Revenue" value={stats.platformRevenue} prefix="₹" color="primary" />
        <MetricCard icon={<AlertTriangle className="w-5 h-5" />} label="Flagged" value={stats.flaggedSubmissions} color="premium" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* User breakdown */}
        <Card className="glass border-border/50 lg:col-span-1">
          <CardHeader><CardTitle className="font-display text-base">User Breakdown</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "Creators", count: stats.creators },
              { name: "Brands", count: stats.brands },
              { name: "Admins", count: stats.admins },
            ].map((r) => (
              <div key={r.name} className="glass rounded-lg p-3 flex items-center justify-between">
                <span className="text-sm text-foreground">{r.name}</span>
                <span className="text-lg font-display font-bold text-foreground">{r.count.toLocaleString()}</span>
              </div>
            ))}
            <div className="glass rounded-lg p-3 flex items-center justify-between border border-warning/20">
              <span className="text-sm text-warning">Pending KYC</span>
              <span className="text-lg font-display font-bold text-warning">{stats.pendingKYC}</span>
            </div>
            <Button variant="outline" size="sm" asChild className="w-full text-xs">
              <Link to="/admin/users">Manage Users</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="glass border-border/50 lg:col-span-1">
          <CardHeader><CardTitle className="font-display text-base">Quick Actions</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-auto flex-col gap-1 py-4" asChild>
              <Link to="/admin/campaigns">
                <Megaphone className="w-5 h-5 text-info" />
                <span className="text-xs">All Campaigns</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-1 py-4" asChild>
              <Link to="/admin/submissions">
                <FileText className="w-5 h-5 text-warning" />
                <span className="text-xs">Review Submissions</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-1 py-4" asChild>
              <Link to="/admin/payouts">
                <Wallet className="w-5 h-5 text-success" />
                <span className="text-xs">Process Payouts</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-1 py-4" asChild>
              <Link to="/admin/fraud">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <span className="text-xs">Fraud Flags</span>
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="glass border-border/50 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-success animate-pulse" />Activity Feed
            </CardTitle>
            <Badge className="bg-success/20 text-success text-xs animate-pulse">Live</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-64">
              {feed.length === 0 && (
                <p className="text-center text-muted-foreground text-sm py-8">No recent activity</p>
              )}
              {feed.map((item) => (
                <div key={item.id} className="px-4 py-3 border-b border-border/30 hover:bg-muted/20 transition-colors">
                  <div className="flex items-start gap-2">
                    <span className="text-base shrink-0">{feedIcon[item.type] || "📝"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground leading-tight">{item.text}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
