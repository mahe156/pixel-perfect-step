import { motion } from "framer-motion";
import MetricCard from "@/components/shared/MetricCard";
import { IndianRupee, Eye, Megaphone, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { formatINR, formatViews } from "@/lib/format";
import { Link } from "react-router-dom";

const dailyData = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`, views: Math.floor(30000 + Math.random() * 100000), spend: Math.floor(3000 + Math.random() * 12000),
}));

const budgetPie = [
  { name: "Summer Fashion Haul", value: 234000 },
  { name: "Reel Challenge", value: 89000 },
  { name: "Unused Budget", value: 177000 },
];
const COLORS = ["hsl(24 100% 50%)", "hsl(216 100% 65%)", "hsl(240 12% 16%)"];

const activeCampaigns = [
  { id: "1", title: "Summer Fashion Haul", platform: "youtube", budget: 500000, spent: 234000, views: 1950000, creators: 32, endDate: "2026-03-31" },
  { id: "2", title: "Reel Challenge", platform: "instagram", budget: 200000, spent: 89000, views: 1112500, creators: 20, endDate: "2026-04-15" },
];

const BrandDashboard = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-foreground">Brand Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage your campaigns and track performance.</p>
        </div>
        <Button asChild>
          <Link to="/brand/campaigns/new">+ New Campaign</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={<IndianRupee className="w-5 h-5" />} label="Total Budget Deployed" value={700000} prefix="₹" color="primary" />
        <MetricCard icon={<Eye className="w-5 h-5" />} label="Total Views Bought" value={3062500} color="info" />
        <MetricCard icon={<Megaphone className="w-5 h-5" />} label="Active Campaigns" value={2} color="success" />
        <MetricCard icon={<TrendingUp className="w-5 h-5" />} label="Avg CPM Delivered" value={98} prefix="₹" color="warning" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="glass border-border/50 lg:col-span-2">
          <CardHeader><CardTitle className="font-display text-base">Campaign Performance — Last 30 Days</CardTitle></CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyData}>
                  <defs>
                    <linearGradient id="bvGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(24 100% 50%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(24 100% 50%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 12% 16%)" />
                  <XAxis dataKey="day" stroke="hsl(240 12% 52%)" tick={{ fontSize: 10 }} />
                  <YAxis stroke="hsl(240 12% 52%)" tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: "hsl(240 15% 7%)", border: "1px solid hsl(240 12% 16%)", borderRadius: 8, color: "hsl(240 10% 96%)" }} />
                  <Area type="monotone" dataKey="views" stroke="hsl(24 100% 50%)" fill="url(#bvGrad)" strokeWidth={2} name="Views" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader><CardTitle className="font-display text-base">Budget Allocation</CardTitle></CardHeader>
          <CardContent>
            <div className="h-56 flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={budgetPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} strokeWidth={0}>
                    {budgetPie.map((_, i) => (<Cell key={i} fill={COLORS[i]} />))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(240 15% 7%)", border: "1px solid hsl(240 12% 16%)", borderRadius: 8, color: "hsl(240 10% 96%)" }} formatter={(v: number) => formatINR(v)} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Campaigns Table */}
      <Card className="glass border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-display text-base">Active Campaigns</CardTitle>
          <Button variant="ghost" size="sm" asChild className="text-xs text-primary">
            <Link to="/brand/campaigns">View All</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {activeCampaigns.map((c) => {
            const pct = (c.spent / c.budget) * 100;
            return (
              <div key={c.id} className="glass rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-foreground">{c.title}</h3>
                    <Badge variant="outline" className="text-xs capitalize">{c.platform}</Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                    <span>{formatViews(c.views)} views</span>
                    <span>{c.creators} creators</span>
                    <span>Ends {c.endDate}</span>
                  </div>
                </div>
                <div className="sm:w-48 space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatINR(c.spent)}</span>
                    <span>{pct.toFixed(0)}%</span>
                  </div>
                  <Progress value={pct} className="h-1.5" />
                </div>
                <Button variant="outline" size="sm" asChild className="text-xs">
                  <Link to={`/brand/campaigns/${c.id}`}>Details</Link>
                </Button>
              </div>
            );
          })}
          {activeCampaigns.length === 0 && (
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
