import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatINR, formatViews } from "@/lib/format";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";
import MetricCard from "@/components/shared/MetricCard";
import { Eye, IndianRupee, TrendingUp, Megaphone } from "lucide-react";
import { useState } from "react";

const dailyData = Array.from({ length: 30 }, (_, i) => ({
  date: `Mar ${i + 1}`, views: Math.floor(50000 + Math.random() * 200000), spend: Math.floor(5000 + Math.random() * 25000),
}));

const campaignPie = [
  { name: "Summer Fashion Haul", value: 234000 },
  { name: "Reel Challenge", value: 89000 },
  { name: "Diwali Special", value: 298000 },
];
const COLORS = ["hsl(24 100% 50%)", "hsl(216 100% 65%)", "hsl(160 100% 42%)"];

const platformBar = [
  { name: "YouTube", views: 2400000, spend: 280000 },
  { name: "Instagram", views: 1100000, spend: 89000 },
];

const BrandAnalytics = () => {
  const [period, setPeriod] = useState("30d");

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground">Track your campaign performance across platforms.</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={<Eye className="w-5 h-5" />} label="Total Views" value={3500000} color="info" />
        <MetricCard icon={<IndianRupee className="w-5 h-5" />} label="Total Spent" value={621000} prefix="₹" color="primary" />
        <MetricCard icon={<TrendingUp className="w-5 h-5" />} label="Avg CPM" value={98} prefix="₹" color="success" />
        <MetricCard icon={<Megaphone className="w-5 h-5" />} label="Active Campaigns" value={2} color="warning" />
      </div>

      {/* Daily views chart */}
      <Card className="glass border-border/50">
        <CardHeader><CardTitle className="font-display text-base">Daily Views & Spend</CardTitle></CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="aViewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(24 100% 50%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(24 100% 50%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="aSpendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(160 100% 42%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(160 100% 42%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 12% 16%)" />
                <XAxis dataKey="date" stroke="hsl(240 12% 52%)" tick={{ fontSize: 11 }} />
                <YAxis stroke="hsl(240 12% 52%)" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "hsl(240 15% 7%)", border: "1px solid hsl(240 12% 16%)", borderRadius: 8, color: "hsl(240 10% 96%)" }} />
                <Area type="monotone" dataKey="views" stroke="hsl(24 100% 50%)" fill="url(#aViewsGrad)" strokeWidth={2} name="Views" />
                <Area type="monotone" dataKey="spend" stroke="hsl(160 100% 42%)" fill="url(#aSpendGrad)" strokeWidth={2} name="Spend (₹)" />
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Campaign spend breakdown */}
        <Card className="glass border-border/50">
          <CardHeader><CardTitle className="font-display text-base">Spend by Campaign</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64 flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={campaignPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} strokeWidth={0}>
                    {campaignPie.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(240 15% 7%)", border: "1px solid hsl(240 12% 16%)", borderRadius: 8, color: "hsl(240 10% 96%)" }} formatter={(value: number) => formatINR(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Platform comparison */}
        <Card className="glass border-border/50">
          <CardHeader><CardTitle className="font-display text-base">Platform Comparison</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformBar}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 12% 16%)" />
                  <XAxis dataKey="name" stroke="hsl(240 12% 52%)" tick={{ fontSize: 11 }} />
                  <YAxis stroke="hsl(240 12% 52%)" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "hsl(240 15% 7%)", border: "1px solid hsl(240 12% 16%)", borderRadius: 8, color: "hsl(240 10% 96%)" }} />
                  <Bar dataKey="views" fill="hsl(24 100% 50%)" name="Views" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="spend" fill="hsl(160 100% 42%)" name="Spend (₹)" radius={[4, 4, 0, 0]} />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default BrandAnalytics;
