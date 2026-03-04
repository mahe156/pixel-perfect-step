import { useState } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import MetricCard from "@/components/shared/MetricCard";
import { IndianRupee, Eye, TrendingUp, Calendar } from "lucide-react";
import { formatINR } from "@/lib/format";

// Demo data
const generateEarningsData = (days: number) => {
  const data = [];
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      earnings: Math.floor(Math.random() * 800 + 100),
      views: Math.floor(Math.random() * 15000 + 2000),
    });
  }
  return data;
};

const campaignBreakdown = [
  { campaign: "boAt Airdopes X Review", platform: "YouTube", views: 45200, earned: 3616, cpm: 80 },
  { campaign: "Noise ColorFit Pro 5", platform: "YouTube", views: 128400, earned: 7704, cpm: 60 },
  { campaign: "Lenskart Try-On", platform: "Instagram", views: 67800, earned: 2373, cpm: 35 },
  { campaign: "Mamaearth Hair Oil", platform: "Instagram", views: 23400, earned: 1053, cpm: 45 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-lg p-3 border border-border/50">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-sm font-mono font-medium" style={{ color: p.color }}>
            {p.name === "earnings" ? formatINR(p.value) : `${p.value.toLocaleString("en-IN")} views`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CreatorEarnings = () => {
  const [period, setPeriod] = useState<30 | 60 | 90>(30);
  const earningsData = generateEarningsData(period);
  const totalEarned = campaignBreakdown.reduce((s, c) => s + c.earned, 0);
  const totalViews = campaignBreakdown.reduce((s, c) => s + c.views, 0);
  const avgCPM = totalViews > 0 ? (totalEarned / totalViews) * 1000 : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl text-foreground">Earnings</h1>
        <p className="text-sm text-muted-foreground">Track your earnings over time</p>
      </div>

      {/* Lifetime stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={<IndianRupee className="w-5 h-5" />} label="Total Earned" value={totalEarned} prefix="₹" color="success" />
        <MetricCard icon={<Eye className="w-5 h-5" />} label="Total Views" value={totalViews} color="info" />
        <MetricCard icon={<TrendingUp className="w-5 h-5" />} label="Avg CPM Earned" value={Math.round(avgCPM)} prefix="₹" color="primary" />
        <MetricCard icon={<Calendar className="w-5 h-5" />} label="Current Period" value={3616} prefix="₹" color="warning" changeLabel="since last payout" />
      </div>

      {/* Earnings Chart */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-bold text-foreground">Daily Earnings</h3>
          <div className="flex gap-1">
            {([30, 60, 90] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  period === p
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {p}D
              </button>
            ))}
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={earningsData}>
              <defs>
                <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(24, 100%, 50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(24, 100%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 12%, 16%)" />
              <XAxis dataKey="date" tick={{ fill: "hsl(240, 12%, 52%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(240, 12%, 52%)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="earnings" stroke="hsl(24, 100%, 50%)" fill="url(#earningsGradient)" strokeWidth={2} name="earnings" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Campaign Breakdown */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="p-5 border-b border-border/50">
          <h3 className="font-display font-bold text-foreground">Campaign Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left text-xs font-medium text-muted-foreground p-4">Campaign</th>
                <th className="text-left text-xs font-medium text-muted-foreground p-4">Platform</th>
                <th className="text-right text-xs font-medium text-muted-foreground p-4">Views</th>
                <th className="text-right text-xs font-medium text-muted-foreground p-4">CPM</th>
                <th className="text-right text-xs font-medium text-muted-foreground p-4">Earned</th>
              </tr>
            </thead>
            <tbody>
              {campaignBreakdown.map((c, i) => (
                <motion.tr
                  key={c.campaign}
                  className="border-b border-border/30 hover:bg-muted/30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <td className="p-4 text-sm font-medium text-foreground">{c.campaign}</td>
                  <td className="p-4">
                    <span className="badge-pill bg-muted text-muted-foreground text-[10px]">{c.platform}</span>
                  </td>
                  <td className="p-4 text-right text-sm font-mono text-foreground">{c.views.toLocaleString("en-IN")}</td>
                  <td className="p-4 text-right text-sm font-mono text-primary">₹{c.cpm}</td>
                  <td className="p-4 text-right text-sm font-mono font-medium text-success">{formatINR(c.earned)}</td>
                </motion.tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-muted/30">
                <td className="p-4 text-sm font-bold text-foreground" colSpan={2}>Total</td>
                <td className="p-4 text-right text-sm font-mono font-bold text-foreground">{totalViews.toLocaleString("en-IN")}</td>
                <td className="p-4 text-right text-sm font-mono font-bold text-primary">₹{Math.round(avgCPM)}</td>
                <td className="p-4 text-right text-sm font-mono font-bold text-success">{formatINR(totalEarned)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default CreatorEarnings;
