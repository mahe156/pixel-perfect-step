import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search, Megaphone, Pause, Play, XCircle, Plus, RefreshCw, ImagePlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatINR, formatViews } from "@/lib/format";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const statusConfig: Record<string, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  pending_payment: { label: "Pending Pay", className: "bg-warning/20 text-warning" },
  active: { label: "Active", className: "bg-success/20 text-success" },
  paused: { label: "Paused", className: "bg-warning/20 text-warning" },
  completed: { label: "Completed", className: "bg-info/20 text-info" },
  cancelled: { label: "Cancelled", className: "bg-destructive/20 text-destructive" },
};

interface CampaignRow {
  id: string;
  title: string;
  platform: string;
  status: string;
  cpm_rate: number;
  total_budget: number;
  spent_amount: number;
  total_submissions: number;
  total_verified_views: number;
  created_at: string;
  brand_id: string | null;
}

const AdminCampaigns = () => {
  const { profile } = useAuth();
  const [campaigns, setCampaigns] = useState<CampaignRow[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", platform: "youtube" as "youtube" | "instagram" | "both",
    cpm_rate: "80", total_budget: "100000", max_creators: "100",
    min_followers: "1000", content_guidelines: "",
    start_date: "", end_date: "",
  });
  const [creating, setCreating] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleBannerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  useEffect(() => { fetchCampaigns(); }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("campaigns")
      .select("id, title, platform, status, cpm_rate, total_budget, spent_amount, total_submissions, total_verified_views, created_at, brand_id, banner_url")
      .order("created_at", { ascending: false });
    setCampaigns((data as CampaignRow[]) || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: "active" | "paused" | "cancelled" | "completed") => {
    const { error } = await supabase.from("campaigns").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success(`Campaign ${status}`);
    fetchCampaigns();
  };

  const uploadBanner = async (): Promise<string | null> => {
    if (!bannerFile) return null;
    const ext = bannerFile.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("campaign-banners").upload(path, bannerFile);
    if (error) { toast.error("Banner upload failed"); return null; }
    const { data } = supabase.storage.from("campaign-banners").getPublicUrl(path);
    return data.publicUrl;
  };

  const createCampaign = async () => {
    if (!form.title || !form.description) { toast.error("Title and description required"); return; }
    setCreating(true);
    const bannerUrl = await uploadBanner();
    const { error } = await supabase.from("campaigns").insert({
      title: form.title,
      description: form.description,
      platform: form.platform,
      cpm_rate: Number(form.cpm_rate),
      total_budget: Number(form.total_budget),
      max_creators: Number(form.max_creators),
      min_followers: Number(form.min_followers),
      content_guidelines: form.content_guidelines,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      brand_id: profile?.id || null,
      status: "active" as const,
      banner_url: bannerUrl,
    });
    setCreating(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Campaign created!");
    setCreateOpen(false);
    setForm({ title: "", description: "", platform: "youtube", cpm_rate: "80", total_budget: "100000", max_creators: "100", min_followers: "1000", content_guidelines: "", start_date: "", end_date: "" });
    setBannerFile(null);
    setBannerPreview(null);
    fetchCampaigns();
  };

  const filtered = campaigns.filter((c) => {
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    return true;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-foreground">All Campaigns</h1>
          <p className="text-sm text-muted-foreground">{campaigns.length} campaigns total.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchCampaigns} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-1" />Create Campaign
          </Button>
        </div>
      </div>

      <div className="glass rounded-xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by title…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
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
                <TableHead>Status</TableHead>
                <TableHead className="text-right">CPM</TableHead>
                <TableHead className="text-right">Budget</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Subs</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => {
                const sc = statusConfig[c.status || "draft"] || statusConfig.draft;
                const pct = c.total_budget > 0 ? (Number(c.spent_amount) / Number(c.total_budget)) * 100 : 0;
                return (
                  <TableRow key={c.id} className="border-border/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                          {(c as any).banner_url ? (
                            <img src={(c as any).banner_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-muted-foreground">{c.title.charAt(0)}</div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">{c.title}</p>
                          <p className="text-xs text-muted-foreground capitalize">{c.platform} · {new Date(c.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Badge className={`${sc.className} text-xs`}>{sc.label}</Badge></TableCell>
                    <TableCell className="text-right font-mono text-sm">₹{c.cpm_rate}</TableCell>
                    <TableCell className="text-right">
                      <div className="space-y-1">
                        <span className="text-xs font-mono">{formatINR(Number(c.spent_amount))} / {formatINR(Number(c.total_budget))}</span>
                        <Progress value={pct} className="h-1" />
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">{formatViews(Number(c.total_verified_views))}</TableCell>
                    <TableCell className="text-right font-mono text-sm">{c.total_submissions}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {c.status === "active" && (
                          <Button size="sm" variant="outline" className="h-7 text-xs text-warning border-warning/30" onClick={() => updateStatus(c.id, "paused")}>
                            <Pause className="w-3 h-3 mr-1" />Pause
                          </Button>
                        )}
                        {c.status === "paused" && (
                          <Button size="sm" variant="outline" className="h-7 text-xs text-success border-success/30" onClick={() => updateStatus(c.id, "active")}>
                            <Play className="w-3 h-3 mr-1" />Resume
                          </Button>
                        )}
                        {c.status !== "cancelled" && c.status !== "completed" && (
                          <Button size="sm" variant="outline" className="h-7 text-xs text-destructive border-destructive/30" onClick={() => updateStatus(c.id, "cancelled")}>
                            <XCircle className="w-3 h-3 mr-1" />Cancel
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No campaigns found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Campaign Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="glass border-border max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-display">Create New Campaign</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Banner Image</Label>
              <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={handleBannerSelect} />
              <button
                type="button"
                onClick={() => bannerInputRef.current?.click()}
                className="w-full h-28 rounded-lg border-2 border-dashed border-border/50 hover:border-primary/40 transition-colors flex items-center justify-center overflow-hidden bg-muted/30"
              >
                {bannerPreview ? (
                  <img src={bannerPreview} alt="Banner preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
                    <ImagePlus className="w-6 h-6" />
                    <span className="text-xs">Click to upload banner</span>
                  </div>
                )}
              </button>
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Campaign title" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Campaign description & brief" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select value={form.platform} onValueChange={(v: any) => setForm({ ...form, platform: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>CPM Rate (₹)</Label>
                <Input type="number" value={form.cpm_rate} onChange={(e) => setForm({ ...form, cpm_rate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Total Budget (₹)</Label>
                <Input type="number" value={form.total_budget} onChange={(e) => setForm({ ...form, total_budget: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Max Creators</Label>
                <Input type="number" value={form.max_creators} onChange={(e) => setForm({ ...form, max_creators: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Min Followers</Label>
                <Input type="number" value={form.min_followers} onChange={(e) => setForm({ ...form, min_followers: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Content Guidelines</Label>
              <Textarea value={form.content_guidelines} onChange={(e) => setForm({ ...form, content_guidelines: e.target.value })} placeholder="Guidelines for creators..." />
            </div>
            <Button onClick={createCampaign} disabled={creating} className="w-full">
              {creating ? "Creating..." : "Create Campaign"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default AdminCampaigns;
