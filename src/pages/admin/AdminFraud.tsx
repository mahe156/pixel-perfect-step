import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Search, Eye, Ban, CheckCircle2, ExternalLink, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import MetricCard from "@/components/shared/MetricCard";
import { formatViews, formatINR } from "@/lib/format";
import { toast } from "sonner";

const mockFlags = [
  { id: "f1", creator: "Rahul Verma", submission_id: "s2", campaign: "Summer Fashion Haul", type: "view_velocity", reason: "View velocity 4.2x above average in first 2 hours", views: 85000, content_url: "https://youtube.com/watch?v=def", detected_at: "2026-03-02", status: "open" },
  { id: "f2", creator: "Unknown Bot Farm", submission_id: "s9", campaign: "Tech Review Collab", type: "bot_traffic", reason: "92% of views from non-Indian IPs with identical watch patterns", views: 120000, content_url: "https://youtube.com/watch?v=mno", detected_at: "2026-03-01", status: "open" },
  { id: "f3", creator: "Vikash Mehta", submission_id: "s10", campaign: "Reel Challenge", type: "duplicate_content", reason: "Content URL matches another submission from different campaign", views: 0, content_url: "https://instagram.com/reel/dup", detected_at: "2026-02-28", status: "resolved", resolution: "Submission rejected, creator warned" },
  { id: "f4", creator: "Fake Account", submission_id: "s11", campaign: "Summer Fashion Haul", type: "fake_account", reason: "Account created 2 days ago, no prior content, purchased followers suspected", views: 0, content_url: "https://youtube.com/watch?v=pqr", detected_at: "2026-02-27", status: "escalated" },
];

const typeConfig: Record<string, { label: string; className: string }> = {
  view_velocity: { label: "View Velocity", className: "bg-warning/20 text-warning" },
  bot_traffic: { label: "Bot Traffic", className: "bg-destructive/20 text-destructive" },
  duplicate_content: { label: "Duplicate", className: "bg-info/20 text-info" },
  fake_account: { label: "Fake Account", className: "bg-premium/20 text-premium" },
};

const statusBadge: Record<string, string> = {
  open: "bg-destructive/20 text-destructive",
  resolved: "bg-success/20 text-success",
  escalated: "bg-warning/20 text-warning",
  dismissed: "bg-muted text-muted-foreground",
};

const AdminFraud = () => {
  const [search, setSearch] = useState("");
  const [resolution, setResolution] = useState("");

  const openCount = mockFlags.filter((f) => f.status === "open").length;
  const filtered = mockFlags.filter((f) => {
    if (search && !f.creator.toLowerCase().includes(search.toLowerCase()) && !f.campaign.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl text-foreground">Fraud Detection</h1>
        <p className="text-sm text-muted-foreground">{openCount} open flags requiring attention.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <MetricCard icon={<AlertTriangle className="w-5 h-5" />} label="Open Flags" value={openCount} color="premium" />
        <MetricCard icon={<Eye className="w-5 h-5" />} label="Suspicious Views" value={205000} color="warning" />
        <MetricCard icon={<Ban className="w-5 h-5" />} label="Accounts Suspended" value={2} color="primary" />
        <MetricCard icon={<Shield className="w-5 h-5" />} label="Resolved This Month" value={1} color="success" />
      </div>

      <div className="glass rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search creator or campaign…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((flag) => {
          const tc = typeConfig[flag.type] || typeConfig.view_velocity;
          return (
            <Card key={flag.id} className={`glass border-border/50 ${flag.status === "open" ? "border-l-2 border-l-destructive" : flag.status === "escalated" ? "border-l-2 border-l-warning" : ""}`}>
              <CardContent className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                      <span className="font-display font-bold text-foreground">{flag.creator}</span>
                      <Badge className={`${tc.className} text-xs`}>{tc.label}</Badge>
                      <Badge className={`${statusBadge[flag.status]} text-xs capitalize`}>{flag.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{flag.reason}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Campaign: <span className="text-foreground">{flag.campaign}</span></span>
                      <span>Views: <span className="text-foreground font-mono">{formatViews(flag.views)}</span></span>
                      <span>Detected: {flag.detected_at}</span>
                    </div>
                    {flag.resolution && (
                      <div className="glass rounded-lg p-2 text-xs text-success">
                        <CheckCircle2 className="w-3 h-3 inline mr-1" />Resolution: {flag.resolution}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <a href={flag.content_url} target="_blank" rel="noreferrer"><ExternalLink className="w-3.5 h-3.5 mr-1" />View</a>
                    </Button>
                    {flag.status === "open" && (
                      <>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="text-success border-success/30">
                              <CheckCircle2 className="w-3 h-3 mr-1" />Resolve
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader><DialogTitle>Resolve Flag</DialogTitle></DialogHeader>
                            <Textarea placeholder="Resolution notes…" value={resolution} onChange={(e) => setResolution(e.target.value)} />
                            <Button onClick={() => { toast.success("Flag resolved"); setResolution(""); }}>Confirm Resolve</Button>
                          </DialogContent>
                        </Dialog>
                        <Button size="sm" variant="outline" className="text-destructive border-destructive/30" onClick={() => toast.success(`${flag.creator} suspended and submission rejected`)}>
                          <Ban className="w-3 h-3 mr-1" />Suspend
                        </Button>
                        <Button size="sm" variant="outline" className="text-warning border-warning/30" onClick={() => toast.success("Flag escalated")}>
                          Escalate
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
};

export default AdminFraud;
