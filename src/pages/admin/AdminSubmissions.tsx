import { useState } from "react";
import { motion } from "framer-motion";
import { Search, CheckCircle2, XCircle, ExternalLink, Eye, Clock, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { formatINR, formatViews } from "@/lib/format";
import { toast } from "sonner";

const mockSubmissions = [
  { id: "s1", creator: "Priya Sharma", campaign: "Summer Fashion Haul", platform: "youtube", status: "pending_review", content_url: "https://youtube.com/watch?v=abc", views: 0, earned: 0, submitted_at: "2026-03-01", is_flagged: false },
  { id: "s2", creator: "Rahul Verma", campaign: "Summer Fashion Haul", platform: "youtube", status: "pending_review", content_url: "https://youtube.com/watch?v=def", views: 0, earned: 0, submitted_at: "2026-03-02", is_flagged: true, flag_reason: "Suspicious view velocity" },
  { id: "s3", creator: "Anita K", campaign: "Reel Challenge", platform: "instagram", status: "approved", content_url: "https://instagram.com/reel/xyz", views: 189000, earned: 15120, submitted_at: "2026-02-20", is_flagged: false },
  { id: "s4", creator: "Sneha Patel", campaign: "Reel Challenge", platform: "instagram", status: "pending_review", content_url: "https://instagram.com/reel/abc", views: 0, earned: 0, submitted_at: "2026-03-03", is_flagged: false },
  { id: "s5", creator: "Vikash M", campaign: "Summer Fashion Haul", platform: "youtube", status: "rejected", content_url: "https://youtube.com/watch?v=ghi", views: 0, earned: 0, submitted_at: "2026-02-25", is_flagged: false, rejection_reason: "Content doesn't match guidelines" },
  { id: "s6", creator: "Arjun Das", campaign: "Tech Review Collab", platform: "youtube", status: "tracking", content_url: "https://youtube.com/watch?v=jkl", views: 45000, earned: 9000, submitted_at: "2026-02-28", is_flagged: false },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  pending_review: { label: "Pending", className: "bg-warning/20 text-warning" },
  approved: { label: "Approved", className: "bg-success/20 text-success" },
  rejected: { label: "Rejected", className: "bg-destructive/20 text-destructive" },
  tracking: { label: "Tracking", className: "bg-info/20 text-info" },
};

const AdminSubmissions = () => {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("pending_review");
  const [selected, setSelected] = useState<string[]>([]);
  const [rejectionReason, setRejectionReason] = useState("");

  const filtered = mockSubmissions.filter((s) => {
    if (tab !== "all" && s.status !== tab) return false;
    if (search && !s.creator.toLowerCase().includes(search.toLowerCase()) && !s.campaign.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggleSelect = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    const pendingIds = filtered.filter((s) => s.status === "pending_review").map((s) => s.id);
    setSelected(selected.length === pendingIds.length ? [] : pendingIds);
  };

  const bulkApprove = () => {
    toast.success(`${selected.length} submissions approved`);
    setSelected([]);
  };

  const pendingCount = mockSubmissions.filter((s) => s.status === "pending_review").length;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-foreground">Submission Review</h1>
          <p className="text-sm text-muted-foreground">{pendingCount} submissions awaiting review.</p>
        </div>
        {selected.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{selected.length} selected</span>
            <Button size="sm" className="gap-1" onClick={bulkApprove}>
              <CheckCircle2 className="w-3.5 h-3.5" />Bulk Approve
            </Button>
          </div>
        )}
      </div>

      <div className="glass rounded-xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search creator or campaign…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
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
                    <Checkbox checked={selected.length === filtered.filter((s) => s.status === "pending_review").length && selected.length > 0} onCheckedChange={toggleAll} />
                  </TableHead>
                )}
                <TableHead>Creator</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Earned</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((sub) => {
                const sc = statusConfig[sub.status] || statusConfig.pending_review;
                return (
                  <TableRow key={sub.id} className={`border-border/50 ${sub.is_flagged ? "bg-destructive/5" : ""}`}>
                    {tab === "pending_review" && (
                      <TableCell>
                        {sub.status === "pending_review" && (
                          <Checkbox checked={selected.includes(sub.id)} onCheckedChange={() => toggleSelect(sub.id)} />
                        )}
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="font-medium text-foreground text-sm">{sub.creator}</p>
                          <p className="text-xs text-muted-foreground capitalize">{sub.platform} · {sub.submitted_at}</p>
                        </div>
                        {sub.is_flagged && <AlertTriangle className="w-4 h-4 text-destructive" />}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-foreground">{sub.campaign}</TableCell>
                    <TableCell><Badge className={`${sc.className} text-xs`}>{sc.label}</Badge></TableCell>
                    <TableCell className="text-right font-mono text-sm">{formatViews(sub.views)}</TableCell>
                    <TableCell className="text-right font-mono text-sm">{formatINR(sub.earned)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                          <a href={sub.content_url} target="_blank" rel="noreferrer"><ExternalLink className="w-3.5 h-3.5" /></a>
                        </Button>
                        {sub.status === "pending_review" && (
                          <>
                            <Button size="sm" variant="outline" className="h-7 text-xs text-success border-success/30" onClick={() => toast.success(`${sub.creator}'s submission approved`)}>
                              <CheckCircle2 className="w-3 h-3 mr-1" />Approve
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline" className="h-7 text-xs text-destructive border-destructive/30">
                                  <XCircle className="w-3 h-3 mr-1" />Reject
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader><DialogTitle>Reject {sub.creator}&apos;s Submission</DialogTitle></DialogHeader>
                                <Textarea placeholder="Reason for rejection…" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} />
                                <Button variant="destructive" onClick={() => { toast.success("Submission rejected"); setRejectionReason(""); }}>Confirm Reject</Button>
                              </DialogContent>
                            </Dialog>
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
    </motion.div>
  );
};

export default AdminSubmissions;
