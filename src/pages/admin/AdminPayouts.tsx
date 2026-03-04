import { useState } from "react";
import { motion } from "framer-motion";
import { Search, CheckCircle2, Clock, XCircle, IndianRupee, Send, AlertTriangle } from "lucide-react";
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

const mockPayouts = [
  { id: "p1", creator: "Priya Sharma", gross: 29400, tds: 2940, net: 26460, method: "upi", upi_id: "priya@paytm", status: "pending", period: "Feb 2026", created_at: "2026-03-01" },
  { id: "p2", creator: "Anita K", gross: 22680, tds: 2268, net: 20412, method: "bank", bank: "HDFC ****1234", status: "pending", period: "Feb 2026", created_at: "2026-03-01" },
  { id: "p3", creator: "Sneha Patel", gross: 45000, tds: 4500, net: 40500, method: "upi", upi_id: "sneha@upi", status: "processing", period: "Jan 2026", created_at: "2026-02-01" },
  { id: "p4", creator: "Rahul Verma", gross: 18000, tds: 1800, net: 16200, method: "bank", bank: "SBI ****5678", status: "paid", period: "Jan 2026", created_at: "2026-02-01", processed_at: "2026-02-03" },
  { id: "p5", creator: "Arjun Das", gross: 9000, tds: 900, net: 8100, method: "upi", upi_id: "arjun@gpay", status: "failed", period: "Jan 2026", created_at: "2026-02-01", failure_reason: "Invalid UPI ID" },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-warning/20 text-warning" },
  processing: { label: "Processing", className: "bg-info/20 text-info" },
  paid: { label: "Paid", className: "bg-success/20 text-success" },
  failed: { label: "Failed", className: "bg-destructive/20 text-destructive" },
};

const AdminPayouts = () => {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("pending");
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = mockPayouts.filter((p) => {
    if (tab !== "all" && p.status !== tab) return false;
    if (search && !p.creator.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggleSelect = (id: string) => setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  const toggleAll = () => {
    const ids = filtered.filter((p) => p.status === "pending").map((p) => p.id);
    setSelected(selected.length === ids.length ? [] : ids);
  };

  const bulkProcess = () => {
    toast.success(`${selected.length} payouts sent for processing`);
    setSelected([]);
  };

  const pendingTotal = mockPayouts.filter((p) => p.status === "pending").reduce((s, p) => s + p.net, 0);
  const paidTotal = mockPayouts.filter((p) => p.status === "paid").reduce((s, p) => s + p.net, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-foreground">Payout Manager</h1>
          <p className="text-sm text-muted-foreground">Process and track creator payouts.</p>
        </div>
        {selected.length > 0 && (
          <Button className="gap-2" onClick={bulkProcess}>
            <Send className="w-4 h-4" />Process {selected.length} Payouts
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <MetricCard icon={<Clock className="w-5 h-5" />} label="Pending" value={pendingTotal} prefix="₹" color="warning" />
        <MetricCard icon={<Send className="w-5 h-5" />} label="Processing" value={40500} prefix="₹" color="info" />
        <MetricCard icon={<CheckCircle2 className="w-5 h-5" />} label="Paid (Total)" value={paidTotal} prefix="₹" color="success" />
        <MetricCard icon={<AlertTriangle className="w-5 h-5" />} label="Failed" value={8100} prefix="₹" color="premium" />
      </div>

      <div className="glass rounded-xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search creator…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
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
                <TableHead>Creator</TableHead>
                <TableHead>Period</TableHead>
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
                const sc = statusConfig[p.status];
                return (
                  <TableRow key={p.id} className="border-border/50">
                    {tab === "pending" && (
                      <TableCell>{p.status === "pending" && <Checkbox checked={selected.includes(p.id)} onCheckedChange={() => toggleSelect(p.id)} />}</TableCell>
                    )}
                    <TableCell className="font-medium text-foreground text-sm">{p.creator}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.period}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs uppercase">{p.method}</Badge>
                      <p className="text-xs text-muted-foreground mt-0.5">{p.method === "upi" ? p.upi_id : p.bank}</p>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">{formatINR(p.gross)}</TableCell>
                    <TableCell className="text-right font-mono text-sm text-destructive">-{formatINR(p.tds)}</TableCell>
                    <TableCell className="text-right font-mono text-sm font-medium">{formatINR(p.net)}</TableCell>
                    <TableCell><Badge className={`${sc.className} text-xs`}>{sc.label}</Badge></TableCell>
                    <TableCell className="text-right">
                      {p.status === "pending" && (
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.success(`Processing payout to ${p.creator}`)}>
                          <Send className="w-3 h-3 mr-1" />Process
                        </Button>
                      )}
                      {p.status === "failed" && (
                        <Button size="sm" variant="outline" className="h-7 text-xs text-warning border-warning/30" onClick={() => toast.success(`Retrying payout to ${p.creator}`)}>
                          Retry
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">No payouts match your filters.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminPayouts;
