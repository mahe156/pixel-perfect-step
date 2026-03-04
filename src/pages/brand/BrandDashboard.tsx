import { motion } from "framer-motion";
import MetricCard from "@/components/shared/MetricCard";
import { IndianRupee, Eye, Megaphone, TrendingUp } from "lucide-react";

const BrandDashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="font-display font-extrabold text-2xl text-foreground">Brand Dashboard</h1>
        <p className="text-sm text-muted-foreground">Manage your campaigns and track performance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<IndianRupee className="w-5 h-5" />}
          label="Total Budget Deployed"
          value={0}
          prefix="₹"
          color="primary"
        />
        <MetricCard
          icon={<Eye className="w-5 h-5" />}
          label="Total Views Bought"
          value={0}
          color="info"
        />
        <MetricCard
          icon={<Megaphone className="w-5 h-5" />}
          label="Active Campaigns"
          value={0}
          color="success"
        />
        <MetricCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Avg CPM Delivered"
          value={0}
          prefix="₹"
          color="warning"
        />
      </div>

      <div className="glass rounded-xl p-6">
        <h3 className="font-display font-bold text-foreground mb-4">Active Campaigns</h3>
        <div className="text-center py-8 text-muted-foreground text-sm">
          No campaigns yet. Create your first campaign to get started!
        </div>
      </div>
    </motion.div>
  );
};

export default BrandDashboard;
