import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatINR, formatViews } from "@/lib/format";
import { Eye, ExternalLink, Clock, CheckCircle, XCircle, Radio, X, Loader2, IndianRupee } from "lucide-react";

type TabKey = "active" | "pending" | "rejected";

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  tracking: { label: "Tracking", color: "text-success bg-success/10 border-success/30", icon: <Radio className="w-3 h-3 animate-pulse" /> },
  pending_review: { label: "Pending", color: "text-warning bg-warning/10 border-warning/30", icon: <Clock className="w-3 h-3" /> },
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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div>
        <h1 className="font-display font-extrabold text-xl sm:text-2xl text-foreground">My Submissions</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">Track your submitted content and earnings</p>
      </div>

      {/* Tabs - full width on mobile */}
      <div className="flex bg-muted/50 p-1 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 px-3 py-2.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              activeTab === tab.key
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`min-w-[18px] h-[18px] rounded-full text-[10px] flex items-center justify-center ${
                activeTab === tab.key ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Card list for mobile */}
      <div className="space-y-2.5">
        {filteredSubmissions.map((sub, i) => {
          const sc = statusConfig[sub.status] || statusConfig.pending_review;
          return (
            <motion.div
              key={sub.id}
              className="glass rounded-xl p-3.5 active:scale-[0.98] transition-transform cursor-pointer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => setSelectedSubmission(sub)}
            >
              <div className="flex items-start justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="badge-pill bg-muted text-muted-foreground text-[10px] capitalize">{sub.platform}</span>
                  <span className={`badge-pill border text-[10px] flex items-center gap-1 ${sc.color}`}>
                    {sc.icon} {sc.label}
                  </span>
                </div>
                <a
                  href={sub.content_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-muted-foreground/60 hover:text-foreground p-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-info/70" />
                    <span className="text-sm font-mono font-semibold text-foreground">
                      {formatViews(Number(sub.verified_views))}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <IndianRupee className="w-3.5 h-3.5 text-success/70" />
                    <span className="text-sm font-mono font-semibold text-success">
                      {formatINR(Number(sub.earned_amount))}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground/60">
                  {new Date(sub.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredSubmissions.length === 0 && (
        <div className="glass rounded-xl p-10 text-center text-muted-foreground text-sm">
          No submissions in this category.
        </div>
      )}

      {/* Full-screen bottom sheet on mobile */}
      <AnimatePresence>
        {selectedSubmission && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background z-40"
              onClick={() => setSelectedSubmission(null)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 right-0 bottom-0 max-h-[85vh] glass border-t border-border/50 z-50 rounded-t-2xl overflow-y-auto safe-bottom"
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
              </div>

              <div className="px-5 pb-8 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-bold text-lg text-foreground">Submission Details</h2>
                  <button
                    onClick={() => setSelectedSubmission(null)}
                    className="text-muted-foreground hover:text-foreground w-8 h-8 flex items-center justify-center rounded-full bg-muted/50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="glass rounded-xl p-4 text-center">
                    <Eye className="w-4 h-4 text-info/70 mx-auto mb-1.5" />
                    <p className="text-lg font-bold font-mono text-info">{formatViews(Number(selectedSubmission.verified_views))}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Verified Views</p>
                  </div>
                  <div className="glass rounded-xl p-4 text-center">
                    <IndianRupee className="w-4 h-4 text-success/70 mx-auto mb-1.5" />
                    <p className="text-lg font-bold font-mono text-success">{formatINR(Number(selectedSubmission.earned_amount))}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Earned</p>
                  </div>
                </div>

                <div className="glass rounded-xl p-3.5">
                  <p className="text-[10px] text-muted-foreground mb-1.5">Content URL</p>
                  <a
                    href={selectedSubmission.content_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary break-all flex items-center gap-1"
                  >
                    {selectedSubmission.content_url}
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>

                {selectedSubmission.status === "rejected" && selectedSubmission.rejection_reason && (
                  <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4">
                    <p className="text-xs font-medium text-destructive mb-1">Rejection Reason</p>
                    <p className="text-sm text-foreground">{selectedSubmission.rejection_reason}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CreatorSubmissions;
