import { motion } from "framer-motion";
import MetricCard from "@/components/shared/MetricCard";
import { IndianRupee, Eye, FileText, Clock } from "lucide-react";

const CreatorDashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="font-display font-extrabold text-2xl text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome back! Here's your overview.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<IndianRupee className="w-5 h-5" />}
          label="Total Earned"
          value={0}
          prefix="₹"
          color="success"
          change={0}
          changeLabel="vs last month"
        />
        <MetricCard
          icon={<Clock className="w-5 h-5" />}
          label="Pending Earnings"
          value={0}
          prefix="₹"
          color="warning"
        />
        <MetricCard
          icon={<Eye className="w-5 h-5" />}
          label="Total Views"
          value={0}
          color="info"
        />
        <MetricCard
          icon={<FileText className="w-5 h-5" />}
          label="Active Submissions"
          value={0}
          color="premium"
        />
      </div>

      {/* Placeholder sections */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-6">
          <h3 className="font-display font-bold text-foreground mb-4">Earnings (Last 30 Days)</h3>
          <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
            No earnings data yet. Start by joining a campaign!
          </div>
        </div>
        <div className="glass rounded-xl p-6">
          <h3 className="font-display font-bold text-foreground mb-4">Platform Connections</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm text-foreground">YouTube</span>
              <span className="badge-pill bg-destructive/10 text-destructive border border-destructive/30 text-xs">Disconnected</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm text-foreground">Instagram</span>
              <span className="badge-pill bg-destructive/10 text-destructive border border-destructive/30 text-xs">Disconnected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Campaigns */}
      <div className="glass rounded-xl p-6">
        <h3 className="font-display font-bold text-foreground mb-4">Recommended Campaigns</h3>
        <div className="text-center py-8 text-muted-foreground text-sm">
          Complete your profile and KYC to see recommended campaigns.
        </div>
      </div>
    </motion.div>
  );
};

export default CreatorDashboard;
