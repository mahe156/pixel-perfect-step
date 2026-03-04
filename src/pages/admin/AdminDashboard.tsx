import { motion } from "framer-motion";
import MetricCard from "@/components/shared/MetricCard";
import { Users, Megaphone, Wallet, AlertTriangle, FileText } from "lucide-react";

const AdminDashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="font-display font-extrabold text-2xl text-foreground">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Platform overview and management.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard icon={<Users className="w-5 h-5" />} label="Total Users" value={0} color="info" />
        <MetricCard icon={<Megaphone className="w-5 h-5" />} label="Active Campaigns" value={0} color="success" />
        <MetricCard icon={<Wallet className="w-5 h-5" />} label="Pending Payouts" value={0} prefix="₹" color="warning" />
        <MetricCard icon={<FileText className="w-5 h-5" />} label="Platform Revenue" value={0} prefix="₹" color="primary" />
        <MetricCard icon={<AlertTriangle className="w-5 h-5" />} label="Flagged" value={0} color="premium" />
      </div>

      <div className="glass rounded-xl p-6">
        <h3 className="font-display font-bold text-foreground mb-4">Real-time Activity Feed</h3>
        <div className="text-center py-8 text-muted-foreground text-sm">
          No recent activity. Activity will appear here in real-time.
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
