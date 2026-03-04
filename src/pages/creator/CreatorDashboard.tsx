import { motion } from "framer-motion";
import MetricCard from "@/components/shared/MetricCard";
import { IndianRupee, Eye, FileText, TrendingUp, Youtube, Instagram, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatINR, formatViews } from "@/lib/format";
import { Link } from "react-router-dom";

const earningsData = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`, earnings: Math.floor(200 + Math.random() * 1500),
}));

const activeSubmissions = [
  { id: "1", campaign: "Summer Fashion Haul", views: 45200, earned: 5424, status: "tracking" },
  { id: "2", campaign: "Reel Challenge", views: 12800, earned: 1024, status: "tracking" },
  { id: "3", campaign: "Tech Review Collab", views: 0, earned: 0, status: "pending_review" },
];

const recommendedCampaigns = [
  { id: "r1", title: "Travel Vlog Contest", brand: "MakeMyTrip", cpm: 150, platform: "youtube", endDate: "Mar 20" },
  { id: "r2", title: "Food Reel Fest", brand: "Zomato", cpm: 80, platform: "instagram", endDate: "Mar 25" },
  { id: "r3", title: "Fitness Challenge", brand: "Cult.fit", cpm: 120, platform: "both", endDate: "Apr 5" },
];

const CreatorDashboard = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl text-foreground">Creator Dashboard</h1>
        <p className="text-sm text-muted-foreground">Your performance at a glance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={<IndianRupee className="w-5 h-5" />} label="Total Earned" value={24580} prefix="₹" color="success" />
        <MetricCard icon={<TrendingUp className="w-5 h-5" />} label="Pending Earnings" value={6448} prefix="₹" color="warning" />
        <MetricCard icon={<Eye className="w-5 h-5" />} label="Total Views" value={358000} color="info" />
        <MetricCard icon={<FileText className="w-5 h-5" />} label="Active Submissions" value={3} color="premium" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="glass border-border/50 lg:col-span-2">
          <CardHeader><CardTitle className="font-display text-base">Earnings — Last 30 Days</CardTitle></CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={earningsData}>
                  <defs>
                    <linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(24 100% 50%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(24 100% 50%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 12% 16%)" />
                  <XAxis dataKey="day" stroke="hsl(240 12% 52%)" tick={{ fontSize: 10 }} />
                  <YAxis stroke="hsl(240 12% 52%)" tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: "hsl(240 15% 7%)", border: "1px solid hsl(240 12% 16%)", borderRadius: 8, color: "hsl(240 10% 96%)" }} />
                  <Area type="monotone" dataKey="earnings" stroke="hsl(24 100% 50%)" fill="url(#earnGrad)" strokeWidth={2} name="Earnings (₹)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader><CardTitle className="font-display text-base">Platform Status</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="glass rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Youtube className="w-4 h-4 text-destructive" />
                  <span className="text-sm font-medium text-foreground">YouTube</span>
                </div>
                <Badge className="bg-success/20 text-success text-xs">Connected</Badge>
              </div>
              <p className="text-xs text-muted-foreground">12.5K subscribers</p>
            </div>
            <div className="glass rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-premium" />
                  <span className="text-sm font-medium text-foreground">Instagram</span>
                </div>
                <Badge className="bg-muted text-muted-foreground text-xs">Not Connected</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full text-xs mt-1" asChild>
                <Link to="/creator/profile">Connect Now</Link>
              </Button>
            </div>
            <div className="glass rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-info" />
                  <span className="text-sm font-medium text-foreground">Bio Verified</span>
                </div>
                <Badge className="bg-success/20 text-success text-xs">✓ Verified</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="glass border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-base">Active Submissions</CardTitle>
            <Button variant="ghost" size="sm" asChild className="text-xs text-primary">
              <Link to="/creator/submissions">View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeSubmissions.map((sub) => (
              <div key={sub.id} className="glass rounded-lg p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{sub.campaign}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatViews(sub.views)}</span>
                    <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" />{formatINR(sub.earned)}</span>
                  </div>
                </div>
                <Badge className={sub.status === "tracking" ? "bg-success/20 text-success text-xs" : "bg-warning/20 text-warning text-xs"}>
                  {sub.status === "tracking" ? "Tracking" : "Pending"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-base">Recommended Campaigns</CardTitle>
            <Button variant="ghost" size="sm" asChild className="text-xs text-primary">
              <Link to="/creator/campaigns">Browse All</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendedCampaigns.map((c) => (
              <div key={c.id} className="glass rounded-lg p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{c.title}</p>
                  <p className="text-xs text-muted-foreground">{c.brand} · Ends {c.endDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono font-bold text-primary">{formatINR(c.cpm)}</p>
                  <p className="text-xs text-muted-foreground">per 1K views</p>
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
