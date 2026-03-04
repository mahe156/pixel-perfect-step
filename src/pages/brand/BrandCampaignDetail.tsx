import { useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, Users, IndianRupee, CheckCircle2, XCircle, Clock, Play, Pause, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { formatINR, formatViews } from "@/lib/format";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { toast } from "sonner";

const mockCampaign = {
  id: "1", title: "Summer Fashion Haul 2026", platform: "youtube", status: "active",
  cpm_rate: 120, total_budget: 500000, spent_amount: 234000, escrowed_amount: 500000,
  total_submissions: 45, approved_submissions: 32, total_verified_views: 1950000,
  start_date: "2026-02-01", end_date: "2026-03-31", max_creators: 100, min_followers: 5000,
  description: "Promote our new summer collection through honest try-on hauls and styling videos.",
  hashtags: ["#SummerFashion", "#HaulVideo"], do_list: ["Show at least 3 outfits", "Mention discount code"],
  dont_list: ["No competitor mentions", "No misleading claims"],
};

const viewsData = Array.from({ length: 14 }, (_, i) => ({
  date: `Feb ${i + 15}`, views: Math.floor(80000 + Math.random() * 120000), spend: Math.floor(10000 + Math.random() * 20000),
}));

const mockSubmissions = [
  { id: "s1", creator: "Priya Sharma", platform: "youtube", status: "approved", views: 245000, earned: 29400, url: "https://youtube.com/watch?v=abc", submitted_at: "2026-02-18" },
  { id: "s2", creator: "Rahul Verma", platform: "youtube", status: "pending_review", views: 0, earned: 0, url: "https://youtube.com/watch?v=def", submitted_at: "2026-03-01" },
  { id: "s3", creator: "Anita K", platform: "youtube", status: "approved", views: 189000, earned: 22680, url: "https://youtube.com/watch?v=ghi", submitted_at: "2026-02-20" },
  { id: "s4", creator: "Vikash M", platform: "youtube", status: "rejected", views: 0, earned: 0, url: "https://youtube.com/watch?v=jkl", submitted_at: "2026-02-25" },
];

const subStatusConfig: Record<string, { label: string; className: string }> = {
  pending_review: { label: "Pending", className: "bg-warning/20 text-warning" },
  approved: { label: "Approved", className: "bg-success/20 text-success" },
  rejected: { label: "Rejected", className: "bg-destructive/20 text-destructive" },
  tracking: { label: "Tracking", className: "bg-info/20 text-info" },
};

const BrandCampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rejectionReason, setRejectionReason] = useState("");
  const campaign = mockCampaign;
  const budgetUsed = (campaign.spent_amount / campaign.total_budget) * 100;

  const handleApprove = (subId: string) => { toast.success(`Submission ${subId} approved`); };
  const handleReject = (subId: string) => { toast.success(`Submission ${subId} rejected`); };

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
        <Badge className="bg-success/20 text-success gap-1"><CheckCircle2 className="w-3 h-3" />Active</Badge>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Budget Used", value: formatINR(campaign.spent_amount), sub: `of ${formatINR(campaign.total_budget)}`, pct: budgetUsed },
          { label: "Verified Views", value: formatViews(campaign.total_verified_views), sub: `@ ${formatINR(campaign.cpm_rate)} CPM` },
          { label: "Submissions", value: `${campaign.approved_submissions}/${campaign.total_submissions}`, sub: "approved" },
          { label: "Escrowed", value: formatINR(campaign.escrowed_amount), sub: "locked" },
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

      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="submissions">Submissions ({campaign.total_submissions})</TabsTrigger>
          <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
        </TabsList>

        {/* Analytics */}
        <TabsContent value="analytics">
          <Card className="glass border-border/50">
            <CardHeader><CardTitle className="font-display text-base">Views & Spend Over Time</CardTitle></CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={viewsData}>
                    <defs>
                      <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(24 100% 50%)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(24 100% 50%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 12% 16%)" />
                    <XAxis dataKey="date" stroke="hsl(240 12% 52%)" tick={{ fontSize: 11 }} />
                    <YAxis stroke="hsl(240 12% 52%)" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: "hsl(240 15% 7%)", border: "1px solid hsl(240 12% 16%)", borderRadius: 8, color: "hsl(240 10% 96%)" }} />
                    <Area type="monotone" dataKey="views" stroke="hsl(24 100% 50%)" fill="url(#viewsGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Submissions */}
        <TabsContent value="submissions">
          <Card className="glass border-border/50">
            <CardContent className="p-0">
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
                  {mockSubmissions.map((sub) => {
                    const sc = subStatusConfig[sub.status] || subStatusConfig.pending_review;
                    return (
                      <TableRow key={sub.id} className="border-border/50">
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{sub.creator}</p>
                            <p className="text-xs text-muted-foreground">{sub.submitted_at}</p>
                          </div>
                        </TableCell>
                        <TableCell><Badge className={`${sc.className} text-xs`}>{sc.label}</Badge></TableCell>
                        <TableCell className="text-right font-mono text-sm">{formatViews(sub.views)}</TableCell>
                        <TableCell className="text-right font-mono text-sm">{formatINR(sub.earned)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" asChild>
                              <a href={sub.url} target="_blank" rel="noreferrer"><ExternalLink className="w-3.5 h-3.5" /></a>
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Guidelines */}
        <TabsContent value="guidelines">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="glass border-border/50">
              <CardHeader><CardTitle className="font-display text-base text-success">✅ Do&apos;s</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {campaign.do_list.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="glass border-border/50">
              <CardHeader><CardTitle className="font-display text-base text-destructive">❌ Don&apos;ts</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {campaign.dont_list.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <XCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          <Card className="glass border-border/50 mt-4">
            <CardHeader><CardTitle className="font-display text-base">Campaign Info</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div><span className="text-muted-foreground">Platform:</span> <span className="text-foreground capitalize">{campaign.platform}</span></div>
              <div><span className="text-muted-foreground">CPM Rate:</span> <span className="text-foreground">{formatINR(campaign.cpm_rate)}</span></div>
              <div><span className="text-muted-foreground">Min Followers:</span> <span className="text-foreground">{campaign.min_followers.toLocaleString()}</span></div>
              <div><span className="text-muted-foreground">Max Creators:</span> <span className="text-foreground">{campaign.max_creators}</span></div>
              <div><span className="text-muted-foreground">Start:</span> <span className="text-foreground">{campaign.start_date}</span></div>
              <div><span className="text-muted-foreground">End:</span> <span className="text-foreground">{campaign.end_date}</span></div>
              <div className="col-span-full"><span className="text-muted-foreground">Hashtags:</span> {campaign.hashtags.map((h) => <Badge key={h} variant="outline" className="ml-1 text-xs">{h}</Badge>)}</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default BrandCampaignDetail;
