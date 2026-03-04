import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatINR, formatViews } from "@/lib/format";
import { Eye, ExternalLink, Clock, CheckCircle, XCircle, Radio, X, Loader2 } from "lucide-react";

type TabKey = "active" | "pending" | "rejected";

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  tracking: { label: "Tracking", color: "text-success bg-success/10 border-success/30", icon: <Radio className="w-3 h-3 animate-pulse" /> },
  pending_review: { label: "Pending Review", color: "text-warning bg-warning/10 border-warning/30", icon: <Clock className="w-3 h-3" /> },
  approved: { label: "Approved", color: "text-success bg-success/10 border-success/30", icon: <CheckCircle className="w-3 h-3" /> },
  rejected: { label: "Rejected", color: "text-destructive bg-destructive/10 border-destructive/30", icon: <XCircle className="w-3 h-3" /> },
};

const tabFilters: Record<TabKey, string[]> = {
  active: ["tracking", "approved"],
  pending: ["pending_review"],
  rejected: ["rejected"],
};

const CreatorSubmissions = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>("active");
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

  useEffect(() => {
    if (profile?.id) fetchSubmissions();
  }, [profile?.id]);

  const fetchSubmissions = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("submissions")
      .select("id, content_url, platform, status, verified_views, earned_amount, last_synced_at, created_at, rejection_reason, campaign_id")
      .eq("creator_id", profile!.id)
      .order("created_at", { ascending: false });
    setSubmissions(data || []);
    setLoading(false);
  };

  const filteredSubmissions = submissions.filter((s) => tabFilters[activeTab].includes(s.status));

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: "active", label: "Active", count: submissions.filter((s) => ["tracking", "approved"].includes(s.status)).length },
    { key: "pending", label: "Pending", count: submissions.filter((s) => s.status === "pending_review").length },
    { key: "rejected", label: "Rejected", count: submissions.filter((s) => s.status === "rejected").length },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl text-foreground">My Submissions</h1>
        <p className="text-sm text-muted-foreground">Track your submitted content and earnings</p>
      </div>

      <div className="flex gap-1 bg-muted/50 p-1 rounded-lg w-fit">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${activeTab === tab.key ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            {tab.label}
            {tab.count > 0 && <span className="badge-pill bg-primary/20 text-primary text-[10px] px-1.5 py-0">{tab.count}</span>}
          </button>
        ))}
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left text-xs font-medium text-muted-foreground p-4">Submission</th>
                <th className="text-left text-xs font-medium text-muted-foreground p-4">Platform</th>
                <th className="text-left text-xs font-medium text-muted-foreground p-4">Status</th>
                <th className="text-right text-xs font-medium text-muted-foreground p-4">Views</th>
                <th className="text-right text-xs font-medium text-muted-foreground p-4">Earned</th>
                <th className="text-right text-xs font-medium text-muted-foreground p-4">Submitted</th>
                <th className="text-right text-xs font-medium text-muted-foreground p-4">Link</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.map((sub, i) => {
                const sc = statusConfig[sub.status] || statusConfig.pending_review;
                return (
                  <motion.tr key={sub.id} className="border-b border-border/30 hover:bg-muted/30 cursor-pointer transition-colors"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedSubmission(sub)}>
                    <td className="p-4 text-sm font-medium text-foreground">{sub.id.slice(0, 8)}...</td>
                    <td className="p-4"><span className="badge-pill bg-muted text-muted-foreground text-[10px] capitalize">{sub.platform}</span></td>
                    <td className="p-4"><span className={`badge-pill border text-[10px] flex items-center gap-1 w-fit ${sc.color}`}>{sc.icon} {sc.label}</span></td>
                    <td className="p-4 text-right text-sm font-mono text-foreground">{formatViews(Number(sub.verified_views))}</td>
                    <td className="p-4 text-right text-sm font-mono text-success">{formatINR(Number(sub.earned_amount))}</td>
                    <td className="p-4 text-right text-xs text-muted-foreground">{new Date(sub.created_at).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <a href={sub.content_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-muted-foreground hover:text-foreground">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredSubmissions.length === 0 && (
          <div className="p-12 text-center text-muted-foreground text-sm">No submissions in this category.</div>
        )}
      </div>

      <AnimatePresence>
        {selectedSubmission && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-background z-40" onClick={() => setSelectedSubmission(null)} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed right-0 top-0 bottom-0 w-full max-w-md glass border-l border-border z-50 overflow-y-auto">
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-bold text-lg text-foreground">Submission Details</h2>
                  <button onClick={() => setSelectedSubmission(null)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass rounded-lg p-4 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Verified Views</p>
                      <p className="text-lg font-bold font-mono text-info">{formatViews(Number(selectedSubmission.verified_views))}</p>
                    </div>
                    <div className="glass rounded-lg p-4 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Earned</p>
                      <p className="text-lg font-bold font-mono text-success">{formatINR(Number(selectedSubmission.earned_amount))}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Content URL</p>
                    <a href={selectedSubmission.content_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                      {selectedSubmission.content_url} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  {selectedSubmission.status === "rejected" && selectedSubmission.rejection_reason && (
                    <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3">
                      <p className="text-xs font-medium text-destructive mb-1">Rejection Reason</p>
                      <p className="text-sm text-foreground">{selectedSubmission.rejection_reason}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CreatorSubmissions;
