import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Megaphone, PlusCircle, Search, Filter, Eye, Users, IndianRupee, Clock, CheckCircle2, Pause, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { formatINR, formatViews } from "@/lib/format";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type CampaignStatus = "all" | "draft" | "active" | "paused" | "completed" | "cancelled";

const statusConfig: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
  draft: { label: "Draft", icon: <Clock className="w-3 h-3" />, className: "bg-muted text-muted-foreground" },
  pending_payment: { label: "Pending Payment", icon: <Clock className="w-3 h-3" />, className: "bg-warning/20 text-warning" },
  active: { label: "Active", icon: <CheckCircle2 className="w-3 h-3" />, className: "bg-success/20 text-success" },
  paused: { label: "Paused", icon: <Pause className="w-3 h-3" />, className: "bg-warning/20 text-warning" },
  completed: { label: "Completed", icon: <CheckCircle2 className="w-3 h-3" />, className: "bg-info/20 text-info" },
  cancelled: { label: "Cancelled", icon: <XCircle className="w-3 h-3" />, className: "bg-destructive/20 text-destructive" },
};

const mockCampaigns = [
  {
    id: "1", title: "Summer Fashion Haul 2026", platform: "youtube" as const,
    status: "active", cpm_rate: 120, total_budget: 500000, spent_amount: 234000,
    total_submissions: 45, approved_submissions: 32, total_verified_views: 1950000,
    start_date: "2026-02-01", end_date: "2026-03-31", max_creators: 100,
  },
  {
    id: "2", title: "Instagram Reel Challenge", platform: "instagram" as const,
    status: "active", cpm_rate: 80, total_budget: 200000, spent_amount: 89000,
    total_submissions: 28, approved_submissions: 20, total_verified_views: 1112500,
    start_date: "2026-02-15", end_date: "2026-04-15", max_creators: 50,
  },
  {
    id: "3", title: "Product Launch Buzz", platform: "both" as const,
    status: "draft", cpm_rate: 150, total_budget: 1000000, spent_amount: 0,
    total_submissions: 0, approved_submissions: 0, total_verified_views: 0,
    start_date: null, end_date: null, max_creators: 200,
  },
  {
    id: "4", title: "Diwali Special Campaign", platform: "youtube" as const,
    status: "completed", cpm_rate: 100, total_budget: 300000, spent_amount: 298000,
    total_submissions: 60, approved_submissions: 55, total_verified_views: 2980000,
    start_date: "2025-10-01", end_date: "2025-11-15", max_creators: 75,
  },
];

const BrandCampaigns = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CampaignStatus>("all");
  const [platformFilter, setPlatformFilter] = useState("all");

  const filtered = mockCampaigns.filter((c) => {
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (platformFilter !== "all" && c.platform !== platformFilter) return false;
    return true;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-foreground">My Campaigns</h1>
          <p className="text-sm text-muted-foreground">Manage and track all your campaigns.</p>
        </div>
        <Button asChild className="gap-2">
          <Link to="/brand/campaigns/new">
            <PlusCircle className="w-4 h-4" /> New Campaign
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="glass rounded-xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search campaigns…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as CampaignStatus)}>
          <TabsList className="bg-muted/50">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="active" className="text-xs">Active</TabsTrigger>
            <TabsTrigger value="draft" className="text-xs">Draft</TabsTrigger>
            <TabsTrigger value="completed" className="text-xs">Done</TabsTrigger>
          </TabsList>
        </Tabs>
        <Select value={platformFilter} onValueChange={setPlatformFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="youtube">YouTube</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="both">Both</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Campaign Cards */}
      <div className="grid gap-4">
        {filtered.map((campaign) => {
          const budgetUsed = campaign.total_budget > 0 ? (campaign.spent_amount / campaign.total_budget) * 100 : 0;
          const sc = statusConfig[campaign.status] || statusConfig.draft;
          return (
            <Card key={campaign.id} className="glass border-border/50 hover:border-primary/30 transition-all">
              <CardContent className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-display font-bold text-foreground text-lg">{campaign.title}</h3>
                      <Badge className={`${sc.className} gap-1 text-xs`}>{sc.icon}{sc.label}</Badge>
                      <Badge variant="outline" className="text-xs capitalize">{campaign.platform}</Badge>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><IndianRupee className="w-3.5 h-3.5" />{formatINR(campaign.cpm_rate)} CPM</span>
                      <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{formatViews(campaign.total_verified_views)} views</span>
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{campaign.approved_submissions}/{campaign.total_submissions} approved</span>
                    </div>
                  </div>
                  <div className="lg:w-64 space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Budget: {formatINR(campaign.spent_amount)} / {formatINR(campaign.total_budget)}</span>
                      <span>{budgetUsed.toFixed(0)}%</span>
                    </div>
                    <Progress value={budgetUsed} className="h-2" />
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/brand/campaigns/${campaign.id}`}>View Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <div className="glass rounded-xl p-12 text-center text-muted-foreground">
            No campaigns match your filters.
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BrandCampaigns;
