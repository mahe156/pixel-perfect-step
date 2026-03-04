import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Search, Ban, CheckCircle2, ExternalLink, Shield, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import MetricCard from "@/components/shared/MetricCard";
import { formatViews } from "@/lib/format";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface FlaggedSubmission {
  id: string;
  content_url: string;
  platform: string;
  verified_views: number;
  is_flagged: boolean;
  flag_reason: string | null;
  status: string;
  view_velocity_score: number | null;
  created_at: string;
  creator_id: string | null;
  campaign_id: string | null;
}

const AdminFraud = () => {
  const [flags, setFlags] = useState<FlaggedSubmission[]>([]);
  const [search, setSearch] = useState("");
  const [resolveDialog, setResolveDialog] = useState<string | null>(null);
  const [resolution, setResolution] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchFlags(); }, []);

  const fetchFlags = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("submissions")
      .select("id, content_url, platform, verified_views, is_flagged, flag_reason, status, view_velocity_score, created_at, creator_id, campaign_id")
      .eq("is_flagged", true)
      .order("created_at", { ascending: false });
    setFlags((data as FlaggedSubmission[]) || []);
    setLoading(false);
  };

  const resolveFlag = async () => {
    if (!resolveDialog) return;
    const { error } = await supabase.from("submissions").update({
      is_flagged: false,
      flag_reason: null,
    }).eq("id", resolveDialog);
    if (error) { toast.error(error.message); return; }
    toast.success("Flag resolved");
    setResolveDialog(null);
    setResolution("");
    fetchFlags();
  };

  const suspendCreator = async (sub: FlaggedSubmission) => {
    if (!sub.creator_id) return;
    // Reject submission & flag creator
    await supabase.from("submissions").update({ status: "rejected", rejection_reason: "Flagged for fraud" }).eq("id", sub.id);
    // Find user by creator_id (which is the users.id)
    await supabase.from("users").update({ is_suspended: true, is_active: false, suspension_reason: sub.flag_reason || "Fraud detected" }).eq("id", sub.creator_id);
    toast.success("Creator suspended and submission rejected");
    fetchFlags();
  };

  const filtered = flags.filter((f) => {
    if (search && !f.content_url.toLowerCase().includes(search.toLowerCase()) && !f.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-foreground">Fraud Detection</h1>
          <p className="text-sm text-muted-foreground">{flags.length} flagged submissions.</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchFlags} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard icon={<AlertTriangle className="w-5 h-5" />} label="Flagged" value={flags.length} color="premium" />
        <MetricCard icon={<Shield className="w-5 h-5" />} label="Suspicious Views" value={flags.reduce((s, f) => s + Number(f.verified_views), 0)} color="warning" />
        <MetricCard icon={<Ban className="w-5 h-5" />} label="Pending Review" value={flags.filter(f => f.status === "pending_review").length} color="primary" />
      </div>

      <div className="glass rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search flagged submissions…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 && (
          <Card className="glass border-border/50">
            <CardContent className="py-8 text-center text-muted-foreground">
              <Shield className="w-8 h-8 mx-auto mb-2 text-success" />
              <p>No flagged submissions. All clear!</p>
            </CardContent>
          </Card>
        )}
        {filtered.map((flag) => (
          <Card key={flag.id} className="glass border-border/50 border-l-2 border-l-destructive">
            <CardContent className="p-5">
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    <span className="font-display font-bold text-foreground">{flag.id.slice(0, 8)}...</span>
                    <Badge className="bg-destructive/20 text-destructive text-xs">Flagged</Badge>
                    <Badge variant="outline" className="capitalize text-xs">{flag.platform}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{flag.flag_reason || "No reason specified"}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Views: <span className="text-foreground font-mono">{formatViews(Number(flag.verified_views))}</span></span>
                    <span>Velocity: <span className="text-foreground font-mono">{flag.view_velocity_score || "N/A"}</span></span>
                    <span>Date: {new Date(flag.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <a href={flag.content_url} target="_blank" rel="noreferrer"><ExternalLink className="w-3.5 h-3.5 mr-1" />View</a>
                  </Button>
                  <Button size="sm" variant="outline" className="text-success border-success/30" onClick={() => setResolveDialog(flag.id)}>
                    <CheckCircle2 className="w-3 h-3 mr-1" />Clear
                  </Button>
                  <Button size="sm" variant="outline" className="text-destructive border-destructive/30" onClick={() => suspendCreator(flag)}>
                    <Ban className="w-3 h-3 mr-1" />Suspend
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!resolveDialog} onOpenChange={(o) => !o && setResolveDialog(null)}>
        <DialogContent className="glass border-border">
          <DialogHeader><DialogTitle>Resolve Flag</DialogTitle></DialogHeader>
          <Textarea placeholder="Resolution notes…" value={resolution} onChange={(e) => setResolution(e.target.value)} />
          <Button onClick={resolveFlag}>Confirm Resolve</Button>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default AdminFraud;
