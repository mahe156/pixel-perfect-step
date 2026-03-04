import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Megaphone, Eye, IndianRupee, Pause, Play, XCircle, CheckCircle2, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { formatINR, formatViews } from "@/lib/format";
import { toast } from "sonner";

const statusConfig: Record<string, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  pending_payment: { label: "Pending Pay", className: "bg-warning/20 text-warning" },
  active: { label: "Active", className: "bg-success/20 text-success" },
  paused: { label: "Paused", className: "bg-warning/20 text-warning" },
  completed: { label: "Completed", className: "bg-info/20 text-info" },
  cancelled: { label: "Cancelled", className: "bg-destructive/20 text-destructive" },
};

const mockCampaigns = [
  { id: "1", title: "Summer Fashion Haul", brand: "Acme Fashion", platform: "youtube", status: "active", cpm_rate: 120, total_budget: 500000, spent_amount: 234000, total_submissions: 45, total_verified_views: 1950000, created_at: "2026-02-01" },
  { id: "2", title: "Reel Challenge", brand: "Acme Fashion", platform: "instagram", status: "active", cpm_rate: 80, total_budget: 200000, spent_amount: 89000, total_submissions: 28, total_verified_views: 1112500, created_at: "2026-02-15" },
  { id: "3", title: "Product Launch Buzz", brand: "TrendyWear Inc", platform: "both", status: "draft", cpm_rate: 150, total_budget: 1000000, spent_amount: 0, total_submissions: 0, total_verified_views: 0, created_at: "2026-02-20" },
  { id: "4", title: "Diwali Special", brand: "Acme Fashion", platform: "youtube", status: "completed", cpm_rate: 100, total_budget: 300000, spent_amount: 298000, total_submissions: 60, total_verified_views: 2980000, created_at: "2025-10-01" },
  { id: "5", title: "Tech Review Collab", brand: "GadgetZone", platform: "youtube", status: "paused", cpm_rate: 200, total_budget: 750000, spent_amount: 150000, total_submissions: 10, total_verified_views: 750000, created_at: "2026-01-15" },
];

const AdminCampaigns = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = mockCampaigns.filter((c) => {
    if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.brand.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    return true;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl text-foreground">All Campaigns</h1>
        <p className="text-sm text-muted-foreground">Manage and monitor all platform campaigns.</p>
      </div>

      <div className="glass rounded-xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by title or brand…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList className="bg-muted/50">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="active" className="text-xs">Active</TabsTrigger>
            <TabsTrigger value="paused" className="text-xs">Paused</TabsTrigger>
            <TabsTrigger value="completed" className="text-xs">Done</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card className="glass border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead>Campaign</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Budget</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Subs</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => {
                const sc = statusConfig[c.status] || statusConfig.draft;
                const pct = c.total_budget > 0 ? (c.spent_amount / c.total_budget) * 100 : 0;
                return (
                  <TableRow key={c.id} className="border-border/50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground text-sm">{c.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">{c.platform} · {c.created_at}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-foreground">{c.brand}</TableCell>
                    <TableCell><Badge className={`${sc.className} text-xs`}>{sc.label}</Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="space-y-1">
                        <span className="text-xs font-mono">{formatINR(c.spent_amount)} / {formatINR(c.total_budget)}</span>
                        <Progress value={pct} className="h-1" />
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">{formatViews(c.total_verified_views)}</TableCell>
                    <TableCell className="text-right font-mono text-sm">{c.total_submissions}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {c.status === "active" && (
                          <Button size="sm" variant="outline" className="h-7 text-xs text-warning border-warning/30" onClick={() => toast.success("Campaign paused")}>
                            <Pause className="w-3 h-3 mr-1" />Pause
                          </Button>
                        )}
                        {c.status === "paused" && (
                          <Button size="sm" variant="outline" className="h-7 text-xs text-success border-success/30" onClick={() => toast.success("Campaign resumed")}>
                            <Play className="w-3 h-3 mr-1" />Resume
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className="h-7 text-xs text-destructive border-destructive/30" onClick={() => toast.success("Campaign cancelled")}>
                          <XCircle className="w-3 h-3 mr-1" />Cancel
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminCampaigns;
