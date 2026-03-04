import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import MetricCard from "@/components/shared/MetricCard";
import { Users, Megaphone, Wallet, AlertTriangle, FileText, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { formatINR } from "@/lib/format";
import { Link } from "react-router-dom";
import { useRealtimeAdminFeed } from "@/hooks/useRealtime";

const revenueData = Array.from({ length: 14 }, (_, i) => ({
  day: `Mar ${i + 1}`, revenue: Math.floor(5000 + Math.random() * 25000), payouts: Math.floor(3000 + Math.random() * 15000),
}));

const roleBreakdown = [
  { name: "Creators", count: 1247 },
  { name: "Brands", count: 89 },
  { name: "Admins", count: 3 },
];

const initialFeed = [
  { id: "1", text: "Priya Sharma submitted to Summer Fashion Haul", time: "2m ago", type: "submission" },
  { id: "2", text: "Payout ₹26,460 processed to Anita K via UPI", time: "15m ago", type: "payout" },
  { id: "3", text: "New brand registered: TrendyWear Inc", time: "1h ago", type: "user" },
  { id: "4", text: "Campaign 'Reel Challenge' reached 1M views", time: "2h ago", type: "milestone" },
  { id: "5", text: "Flagged submission: Rahul Verma — suspicious view velocity", time: "3h ago", type: "fraud" },
  { id: "6", text: "Creator Sneha Patel completed KYC verification", time: "4h ago", type: "kyc" },
  { id: "7", text: "Brand Acme Fashion deposited ₹2,00,000 to wallet", time: "5h ago", type: "deposit" },
];

const feedIcon: Record<string, string> = {
  submission: "📤", payout: "💸", user: "👤", milestone: "🏆", fraud: "🚨", kyc: "✅", deposit: "💰",
};

const AdminDashboard = () => {
  const [feed, setFeed] = useState(initialFeed);

  const handleNewSubmission = useCallback((payload: any) => {
    setFeed((prev) => [
      { id: Date.now().toString(), text: `New submission received (ID: ${payload.id?.slice(0, 8)}...)`, time: "Just now", type: "submission" },
      ...prev,
    ].slice(0, 20));
  }, []);

  useRealtimeAdminFeed(handleNewSubmission);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl text-foreground">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Platform overview and management.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard icon={<Users className="w-5 h-5" />} label="Total Users" value={1339} color="info" />
        <MetricCard icon={<Megaphone className="w-5 h-5" />} label="Active Campaigns" value={5} color="success" />
        <MetricCard icon={<Wallet className="w-5 h-5" />} label="Pending Payouts" value={46872} prefix="₹" color="warning" />
        <MetricCard icon={<FileText className="w-5 h-5" />} label="Platform Revenue" value={124600} prefix="₹" color="primary" />
        <MetricCard icon={<AlertTriangle className="w-5 h-5" />} label="Flagged" value={2} color="premium" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <Card className="glass border-border/50 lg:col-span-2">
          <CardHeader><CardTitle className="font-display text-base">Revenue vs Payouts — Last 14 Days</CardTitle></CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 12% 16%)" />
                  <XAxis dataKey="day" stroke="hsl(240 12% 52%)" tick={{ fontSize: 10 }} />
                  <YAxis stroke="hsl(240 12% 52%)" tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: "hsl(240 15% 7%)", border: "1px solid hsl(240 12% 16%)", borderRadius: 8, color: "hsl(240 10% 96%)" }} />
                  <Bar dataKey="revenue" fill="hsl(24 100% 50%)" name="Revenue (₹)" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="payouts" fill="hsl(160 100% 42%)" name="Payouts (₹)" radius={[3, 3, 0, 0]} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* User breakdown */}
        <Card className="glass border-border/50">
          <CardHeader><CardTitle className="font-display text-base">User Breakdown</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {roleBreakdown.map((r) => (
              <div key={r.name} className="glass rounded-lg p-3 flex items-center justify-between">
                <span className="text-sm text-foreground">{r.name}</span>
                <span className="text-lg font-display font-bold text-foreground">{r.count.toLocaleString()}</span>
              </div>
            ))}
            <div className="glass rounded-lg p-3 flex items-center justify-between border border-warning/20">
              <span className="text-sm text-warning">Pending KYC</span>
              <span className="text-lg font-display font-bold text-warning">23</span>
            </div>
            <Button variant="outline" size="sm" asChild className="w-full text-xs">
              <Link to="/admin/users">Manage Users</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Quick Actions */}
        <Card className="glass border-border/50">
          <CardHeader><CardTitle className="font-display text-base">Quick Actions</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-auto flex-col gap-1 py-4" asChild>
              <Link to="/admin/submissions">
                <FileText className="w-5 h-5 text-warning" />
                <span className="text-xs">Review Submissions</span>
                <Badge className="bg-warning/20 text-warning text-xs">3 pending</Badge>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-1 py-4" asChild>
              <Link to="/admin/payouts">
                <Wallet className="w-5 h-5 text-success" />
                <span className="text-xs">Process Payouts</span>
                <Badge className="bg-success/20 text-success text-xs">2 pending</Badge>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-1 py-4" asChild>
              <Link to="/admin/fraud">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <span className="text-xs">Fraud Flags</span>
                <Badge className="bg-destructive/20 text-destructive text-xs">2 open</Badge>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-1 py-4" asChild>
              <Link to="/admin/campaigns">
                <Megaphone className="w-5 h-5 text-info" />
                <span className="text-xs">All Campaigns</span>
                <Badge className="bg-info/20 text-info text-xs">5 total</Badge>
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Real-time Activity Feed */}
        <Card className="glass border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-success animate-pulse" />Activity Feed
            </CardTitle>
            <Badge className="bg-success/20 text-success text-xs animate-pulse">Live</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-64">
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
