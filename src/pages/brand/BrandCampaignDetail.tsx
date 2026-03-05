import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, Users, IndianRupee, CheckCircle2, XCircle, Clock, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { formatINR, formatViews } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const subStatusConfig: Record<string, { label: string; className: string }> = {
  pending_review: { label: "Pending", className: "bg-warning/20 text-warning" },
  approved: { label: "Approved", className: "bg-success/20 text-success" },
  rejected: { label: "Rejected", className: "bg-destructive/20 text-destructive" },
  tracking: { label: "Tracking", className: "bg-info/20 text-info" },
};

const BrandCampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const fetchData = async () => {
    const [campRes, subsRes] = await Promise.all([
      supabase.from("campaigns").select("*").eq("id", id!).single(),
      supabase.from("submissions").select("*, creator:creator_id(id, full_name)").eq("campaign_id", id!).order("created_at", { ascending: false }),
    ]);

    if (campRes.data) setCampaign(campRes.data);
    setSubmissions((subsRes.data || []).map(s => ({
      ...s,
      creator_name: (s.creator as any)?.full_name || "Unknown",
    })));
    setLoading(false);
  };

  const handleApprove = async (subId: string) => {
    await supabase.from("submissions").update({ status: "approved", approved_at: new Date().toISOString() }).eq("id", subId);
    toast.success("Submission approved");
    fetchData();
  };

  const handleReject = async (subId: string) => {
    await supabase.from("submissions").update({ status: "rejected", rejection_reason: rejectionReason }).eq("id", subId);
    toast.success("Submission rejected");
    setRejectionReason("");
    fetchData();
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;
  }

  if (!campaign) {
    return <div className="text-center py-12 text-muted-foreground">Campaign not found.</div>;
  }

  const budgetUsed = campaign.total_budget > 0 ? (Number(campaign.spent_amount) / Number(campaign.total_budget)) * 100 : 0;
  const statusLabel = campaign.status === "active" ? "Active" : campaign.status?.charAt(0).toUpperCase() + campaign.status?.slice(1);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/brand/campaigns")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="font-display font-extrabold text-2xl text-foreground">{campaign.title}</h1>
          <p className="text-sm text-muted-foreground">{campaign.description}</p>
        </div>
        <Badge className={campaign.status === "active" ? "bg-success/20 text-success gap-1" : "bg-muted text-muted-foreground"}>
          <CheckCircle2 className="w-3 h-3" />{statusLabel}
        </Badge>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Budget Used", value: formatINR(Number(campaign.spent_amount)), sub: `of ${formatINR(Number(campaign.total_budget))}`, pct: budgetUsed },
          { label: "Verified Views", value: formatViews(Number(campaign.total_verified_views) || 0), sub: `@ ${formatINR(Number(campaign.cpm_rate))} CPM` },
          { label: "Submissions", value: `${campaign.approved_submissions || 0}/${campaign.total_submissions || 0}`, sub: "approved" },
          { label: "Escrowed", value: formatINR(Number(campaign.escrowed_amount) || 0), sub: "locked" },
        ].map((m) => (
          <Card key={m.label} className="glass border-border/50">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{m.label}</p>
              <p className="text-xl font-display font-bold text-foreground mt-1">{m.value}</p>
              <p className="text-xs text-muted-foreground">{m.sub}</p>
              {m.pct !== undefined && <Progress value={m.pct} className="h-1.5 mt-2" />}
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="submissions" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="submissions">Submissions ({submissions.length})</TabsTrigger>
          <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
        </TabsList>

        <TabsContent value="submissions">
          <Card className="glass border-border/50">
            <CardContent className="p-0">
              {submissions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">No submissions yet.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead>Creator</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Views</TableHead>
                      <TableHead className="text-right">Earned</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((sub) => {
                      const sc = subStatusConfig[sub.status] || subStatusConfig.pending_review;
                      return (
                        <TableRow key={sub.id} className="border-border/50">
                          <TableCell>
                            <div>
                              <p className="font-medium text-foreground">{sub.creator_name}</p>
                              <p className="text-xs text-muted-foreground">{new Date(sub.created_at).toLocaleDateString("en-IN")}</p>
                            </div>
                          </TableCell>
                          <TableCell><Badge className={`${sc.className} text-xs`}>{sc.label}</Badge></TableCell>
                          <TableCell className="text-right font-mono text-sm">{formatViews(Number(sub.verified_views) || 0)}</TableCell>
                          <TableCell className="text-right font-mono text-sm">{formatINR(Number(sub.earned_amount) || 0)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="icon" asChild>
                                <a href={sub.content_url} target="_blank" rel="noreferrer"><ExternalLink className="w-3.5 h-3.5" /></a>
                              </Button>
                              {sub.status === "pending_review" && (
                                <>
                                  <Button size="sm" variant="outline" className="text-success border-success/30 h-7 text-xs" onClick={() => handleApprove(sub.id)}>
                                    <CheckCircle2 className="w-3 h-3 mr-1" />Approve
                                  </Button>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button size="sm" variant="outline" className="text-destructive border-destructive/30 h-7 text-xs">
                                        <XCircle className="w-3 h-3 mr-1" />Reject
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader><DialogTitle>Reject Submission</DialogTitle></DialogHeader>
                                      <Textarea placeholder="Reason for rejection…" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} />
                                      <Button variant="destructive" onClick={() => handleReject(sub.id)}>Confirm Reject</Button>
                                    </DialogContent>
                                  </Dialog>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guidelines">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="glass border-border/50">
              <CardHeader><CardTitle className="font-display text-base text-success">✅ Do&apos;s</CardTitle></CardHeader>
              <CardContent>
                {campaign.do_list?.length > 0 ? (
                  <ul className="space-y-2">
                    {campaign.do_list.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                        <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-sm text-muted-foreground">No guidelines set.</p>}
              </CardContent>
            </Card>
            <Card className="glass border-border/50">
              <CardHeader><CardTitle className="font-display text-base text-destructive">❌ Don&apos;ts</CardTitle></CardHeader>
              <CardContent>
                {campaign.dont_list?.length > 0 ? (
                  <ul className="space-y-2">
                    {campaign.dont_list.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                        <XCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-sm text-muted-foreground">No restrictions set.</p>}
              </CardContent>
            </Card>
          </div>
          <Card className="glass border-border/50 mt-4">
            <CardHeader><CardTitle className="font-display text-base">Campaign Info</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div><span className="text-muted-foreground">Platform:</span> <span className="text-foreground capitalize">{campaign.platform}</span></div>
              <div><span className="text-muted-foreground">CPM Rate:</span> <span className="text-foreground">{formatINR(Number(campaign.cpm_rate))}</span></div>
              <div><span className="text-muted-foreground">Min Followers:</span> <span className="text-foreground">{(campaign.min_followers || 0).toLocaleString()}</span></div>
              <div><span className="text-muted-foreground">Max Creators:</span> <span className="text-foreground">{campaign.max_creators || "Unlimited"}</span></div>
              <div><span className="text-muted-foreground">Start:</span> <span className="text-foreground">{campaign.start_date ? new Date(campaign.start_date).toLocaleDateString("en-IN") : "TBD"}</span></div>
              <div><span className="text-muted-foreground">End:</span> <span className="text-foreground">{campaign.end_date ? new Date(campaign.end_date).toLocaleDateString("en-IN") : "TBD"}</span></div>
              {campaign.hashtags?.length > 0 && (
                <div className="col-span-full"><span className="text-muted-foreground">Hashtags:</span> {campaign.hashtags.map((h: string) => <Badge key={h} variant="outline" className="ml-1 text-xs">{h}</Badge>)}</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default BrandCampaignDetail;
