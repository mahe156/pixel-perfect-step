import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, CheckCircle2, Clock, Send, AlertTriangle, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { formatINR } from "@/lib/format";
import MetricCard from "@/components/shared/MetricCard";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PayoutRow {
  id: string;
  creator_id: string | null;
  gross_amount: number;
  tds_amount: number;
  net_amount: number;
  payment_method: string;
  upi_id: string | null;
  bank_account_number: string | null;
  bank_ifsc: string | null;
  status: string;
  created_at: string;
  failure_reason: string | null;
  period_start: string | null;
  period_end: string | null;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-warning/20 text-warning" },
  processing: { label: "Processing", className: "bg-info/20 text-info" },
  paid: { label: "Paid", className: "bg-success/20 text-success" },
  failed: { label: "Failed", className: "bg-destructive/20 text-destructive" },
};

const AdminPayouts = () => {
  const [payouts, setPayouts] = useState<PayoutRow[]>([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("pending");
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPayouts(); }, []);

  const fetchPayouts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("payouts")
      .select("*")
      .order("created_at", { ascending: false });
    setPayouts((data as PayoutRow[]) || []);
    setLoading(false);
  };

  const processPayout = async (id: string) => {
    const { error } = await supabase.from("payouts").update({ status: "processing", initiated_at: new Date().toISOString() }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Payout processing initiated");
    fetchPayouts();
  };

  const bulkProcess = async () => {
    for (const id of selected) {
      await supabase.from("payouts").update({ status: "processing", initiated_at: new Date().toISOString() }).eq("id", id);
    }
    toast.success(`${selected.length} payouts sent for processing`);
    setSelected([]);
    fetchPayouts();
  };

  const filtered = payouts.filter((p) => {
    if (tab !== "all" && p.status !== tab) return false;
    if (search && !p.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggleSelect = (id: string) => setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  const toggleAll = () => {
    const ids = filtered.filter((p) => p.status === "pending").map((p) => p.id);
    setSelected(selected.length === ids.length ? [] : ids);
  };

  const pendingTotal = payouts.filter((p) => p.status === "pending").reduce((s, p) => s + Number(p.net_amount), 0);
  const processingTotal = payouts.filter((p) => p.status === "processing").reduce((s, p) => s + Number(p.net_amount), 0);
  const paidTotal = payouts.filter((p) => p.status === "paid").reduce((s, p) => s + Number(p.net_amount), 0);
  const failedTotal = payouts.filter((p) => p.status === "failed").reduce((s, p) => s + Number(p.net_amount), 0);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-foreground">Payout Manager</h1>
          <p className="text-sm text-muted-foreground">{payouts.length} total payouts.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchPayouts} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />
          </Button>
          {selected.length > 0 && (
            <Button className="gap-2" onClick={bulkProcess}>
              <Send className="w-4 h-4" />Process {selected.length}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <MetricCard icon={<Clock className="w-5 h-5" />} label="Pending" value={pendingTotal} prefix="₹" color="warning" />
        <MetricCard icon={<Send className="w-5 h-5" />} label="Processing" value={processingTotal} prefix="₹" color="info" />
        <MetricCard icon={<CheckCircle2 className="w-5 h-5" />} label="Paid" value={paidTotal} prefix="₹" color="success" />
        <MetricCard icon={<AlertTriangle className="w-5 h-5" />} label="Failed" value={failedTotal} prefix="₹" color="premium" />
      </div>

      <div className="glass rounded-xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by ID…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-muted/50">
            <TabsTrigger value="pending" className="text-xs">Pending</TabsTrigger>
            <TabsTrigger value="processing" className="text-xs">Processing</TabsTrigger>
            <TabsTrigger value="paid" className="text-xs">Paid</TabsTrigger>
            <TabsTrigger value="failed" className="text-xs">Failed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card className="glass border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                {tab === "pending" && <TableHead className="w-10"><Checkbox checked={selected.length > 0 && selected.length === filtered.filter((p) => p.status === "pending").length} onCheckedChange={toggleAll} /></TableHead>}
                <TableHead>Payout ID</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Gross</TableHead>
                <TableHead className="text-right">TDS</TableHead>
                <TableHead className="text-right">Net</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => {
                const sc = statusConfig[p.status || "pending"];
                return (
                  <TableRow key={p.id} className="border-border/50">
                    {tab === "pending" && (
                      <TableCell>{p.status === "pending" && <Checkbox checked={selected.includes(p.id)} onCheckedChange={() => toggleSelect(p.id)} />}</TableCell>
                    )}
                    <TableCell>
                      <p className="font-medium text-foreground text-sm">{p.id.slice(0, 8)}...</p>
                      <p className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs uppercase">{p.payment_method}</Badge>
                      <p className="text-xs text-muted-foreground mt-0.5">{p.payment_method === "upi" ? p.upi_id : p.bank_account_number ? `****${p.bank_account_number.slice(-4)}` : ""}</p>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">{formatINR(Number(p.gross_amount))}</TableCell>
                    <TableCell className="text-right font-mono text-sm text-destructive">-{formatINR(Number(p.tds_amount))}</TableCell>
                    <TableCell className="text-right font-mono text-sm font-medium">{formatINR(Number(p.net_amount))}</TableCell>
                    <TableCell><Badge className={`${sc?.className} text-xs`}>{sc?.label}</Badge></TableCell>
                    <TableCell className="text-right">
                      {p.status === "pending" && (
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => processPayout(p.id)}>
                          <Send className="w-3 h-3 mr-1" />Process
                        </Button>
                      )}
                      {p.status === "failed" && (
                        <Button size="sm" variant="outline" className="h-7 text-xs text-warning border-warning/30" onClick={() => processPayout(p.id)}>Retry</Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No payouts match your filters.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminPayouts;
