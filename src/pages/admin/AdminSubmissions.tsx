import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, CheckCircle2, XCircle, ExternalLink, AlertTriangle, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { formatINR, formatViews } from "@/lib/format";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface SubmissionRow {
  id: string;
  content_url: string;
  platform: string;
  status: string;
  verified_views: number;
  earned_amount: number;
  is_flagged: boolean;
  flag_reason: string | null;
  created_at: string;
  creator_id: string | null;
  campaign_id: string | null;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending_review: { label: "Pending", className: "bg-warning/20 text-warning" },
  approved: { label: "Approved", className: "bg-success/20 text-success" },
  rejected: { label: "Rejected", className: "bg-destructive/20 text-destructive" },
  tracking: { label: "Tracking", className: "bg-info/20 text-info" },
};

const AdminSubmissions = () => {
  const { profile } = useAuth();
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("pending_review");
  const [selected, setSelected] = useState<string[]>([]);
  const [rejectDialog, setRejectDialog] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchSubmissions(); }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("submissions")
      .select("id, content_url, platform, status, verified_views, earned_amount, is_flagged, flag_reason, created_at, creator_id, campaign_id")
      .order("created_at", { ascending: false });
    setSubmissions((data as SubmissionRow[]) || []);
    setLoading(false);
  };

  const approveSubmission = async (id: string) => {
    const { error } = await supabase.from("submissions").update({
      status: "approved",
      approved_by: profile?.id,
      approved_at: new Date().toISOString(),
    }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Submission approved");
    fetchSubmissions();
  };

  const rejectSubmission = async () => {
    if (!rejectDialog) return;
    const { error } = await supabase.from("submissions").update({
      status: "rejected",
      rejection_reason: rejectionReason,
    }).eq("id", rejectDialog);
    if (error) { toast.error(error.message); return; }
    toast.success("Submission rejected");
    setRejectDialog(null);
    setRejectionReason("");
    fetchSubmissions();
  };

  const bulkApprove = async () => {
    for (const id of selected) {
      await supabase.from("submissions").update({
        status: "approved",
        approved_by: profile?.id,
        approved_at: new Date().toISOString(),
      }).eq("id", id);
    }
    toast.success(`${selected.length} submissions approved`);
    setSelected([]);
    fetchSubmissions();
  };

  const filtered = submissions.filter((s) => {
    if (tab !== "all" && s.status !== tab) return false;
    if (search && !s.content_url.toLowerCase().includes(search.toLowerCase()) && !s.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggleSelect = (id: string) => setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  const toggleAll = () => {
    const ids = filtered.filter((s) => s.status === "pending_review").map((s) => s.id);
    setSelected(selected.length === ids.length ? [] : ids);
  };

  const pendingCount = submissions.filter((s) => s.status === "pending_review").length;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-foreground">Submission Review</h1>
          <p className="text-sm text-muted-foreground">{pendingCount} submissions awaiting review.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchSubmissions} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />
          </Button>
          {selected.length > 0 && (
            <Button size="sm" className="gap-1" onClick={bulkApprove}>
              <CheckCircle2 className="w-3.5 h-3.5" />Bulk Approve ({selected.length})
            </Button>
          )}
        </div>
      </div>

      <div className="glass rounded-xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by URL or ID…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-muted/50">
            <TabsTrigger value="pending_review" className="text-xs">Pending ({pendingCount})</TabsTrigger>
            <TabsTrigger value="approved" className="text-xs">Approved</TabsTrigger>
            <TabsTrigger value="tracking" className="text-xs">Tracking</TabsTrigger>
            <TabsTrigger value="rejected" className="text-xs">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card className="glass border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                {tab === "pending_review" && (
                  <TableHead className="w-10">
                    <Checkbox checked={selected.length > 0 && selected.length === filtered.filter((s) => s.status === "pending_review").length} onCheckedChange={toggleAll} />
                  </TableHead>
                )}
                <TableHead>Submission</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Earned</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((sub) => {
                const sc = statusConfig[sub.status || "pending_review"] || statusConfig.pending_review;
                return (
                  <TableRow key={sub.id} className={`border-border/50 ${sub.is_flagged ? "bg-destructive/5" : ""}`}>
                    {tab === "pending_review" && (
                      <TableCell>
                        {sub.status === "pending_review" && <Checkbox checked={selected.includes(sub.id)} onCheckedChange={() => toggleSelect(sub.id)} />}
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="font-medium text-foreground text-sm truncate max-w-[200px]">{sub.id.slice(0, 8)}...</p>
                          <p className="text-xs text-muted-foreground">{new Date(sub.created_at).toLocaleDateString()}</p>
                        </div>
                        {sub.is_flagged && <AlertTriangle className="w-4 h-4 text-destructive" />}
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline" className="capitalize text-xs">{sub.platform}</Badge></TableCell>
                    <TableCell><Badge className={`${sc.className} text-xs`}>{sc.label}</Badge></TableCell>
                    <TableCell className="text-right font-mono text-sm">{formatViews(Number(sub.verified_views))}</TableCell>
                    <TableCell className="text-right font-mono text-sm">{formatINR(Number(sub.earned_amount))}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                          <a href={sub.content_url} target="_blank" rel="noreferrer"><ExternalLink className="w-3.5 h-3.5" /></a>
                        </Button>
                        {sub.status === "pending_review" && (
                          <>
                            <Button size="sm" variant="outline" className="h-7 text-xs text-success border-success/30" onClick={() => approveSubmission(sub.id)}>
                              <CheckCircle2 className="w-3 h-3 mr-1" />Approve
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 text-xs text-destructive border-destructive/30" onClick={() => setRejectDialog(sub.id)}>
                              <XCircle className="w-3 h-3 mr-1" />Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No submissions match your filters.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={!!rejectDialog} onOpenChange={(o) => !o && setRejectDialog(null)}>
        <DialogContent className="glass border-border">
          <DialogHeader><DialogTitle>Reject Submission</DialogTitle></DialogHeader>
          <Textarea placeholder="Reason for rejection…" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} />
          <Button variant="destructive" onClick={rejectSubmission}>Confirm Reject</Button>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default AdminSubmissions;
