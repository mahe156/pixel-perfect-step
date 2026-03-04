import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, PlusCircle, ArrowUpRight, ArrowDownLeft, IndianRupee, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatINR } from "@/lib/format";
import { toast } from "sonner";

const mockTransactions = [
  { id: "1", type: "deposit", amount: 500000, balance_after: 500000, description: "Wallet top-up via Razorpay", created_at: "2026-02-01", razorpay_payment_id: "pay_abc123" },
  { id: "2", type: "spend", amount: -234000, balance_after: 266000, description: "Escrow: Summer Fashion Haul 2026", created_at: "2026-02-02" },
  { id: "3", type: "deposit", amount: 200000, balance_after: 466000, description: "Wallet top-up via Razorpay", created_at: "2026-02-15", razorpay_payment_id: "pay_def456" },
  { id: "4", type: "spend", amount: -89000, balance_after: 377000, description: "Escrow: Instagram Reel Challenge", created_at: "2026-02-16" },
  { id: "5", type: "refund", amount: 15000, balance_after: 392000, description: "Refund: Diwali Special unused budget", created_at: "2026-02-20" },
  { id: "6", type: "platform_fee", amount: -46800, balance_after: 345200, description: "Platform fee (20%)", created_at: "2026-02-28" },
];

const typeConfig: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  deposit: { label: "Deposit", className: "text-success", icon: <ArrowDownLeft className="w-3.5 h-3.5" /> },
  spend: { label: "Spend", className: "text-primary", icon: <ArrowUpRight className="w-3.5 h-3.5" /> },
  refund: { label: "Refund", className: "text-info", icon: <ArrowDownLeft className="w-3.5 h-3.5" /> },
  platform_fee: { label: "Platform Fee", className: "text-warning", icon: <ArrowUpRight className="w-3.5 h-3.5" /> },
};

const BrandBilling = () => {
  const [addAmount, setAddAmount] = useState("");
  const walletBalance = 345200;
  const totalDeposited = 700000;
  const totalSpent = 369800;

  const handleAddFunds = () => {
    const amt = parseFloat(addAmount);
    if (!amt || amt < 1000) { toast.error("Minimum top-up is ₹1,000"); return; }
    toast.success(`Payment gateway will open for ${formatINR(amt)} (mock)`);
    setAddAmount("");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl text-foreground">Billing & Wallet</h1>
        <p className="text-sm text-muted-foreground">Manage your wallet balance and view transactions.</p>
      </div>

      {/* Wallet Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass border-primary/20">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <Wallet className="w-4 h-4" /> Wallet Balance
            </div>
            <p className="text-3xl font-display font-extrabold text-primary">{formatINR(walletBalance)}</p>
          </CardContent>
        </Card>
        <Card className="glass border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <ArrowDownLeft className="w-4 h-4 text-success" /> Total Deposited
            </div>
            <p className="text-2xl font-display font-bold text-foreground">{formatINR(totalDeposited)}</p>
          </CardContent>
        </Card>
        <Card className="glass border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <ArrowUpRight className="w-4 h-4 text-primary" /> Total Spent
            </div>
            <p className="text-2xl font-display font-bold text-foreground">{formatINR(totalSpent)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Funds */}
      <Card className="glass border-border/50">
        <CardHeader><CardTitle className="font-display text-base">Add Funds</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 space-y-2">
              <Label>Amount (₹)</Label>
              <Input type="number" placeholder="e.g. 50000" value={addAmount} onChange={(e) => setAddAmount(e.target.value)} />
            </div>
            <div className="flex gap-2">
              {[10000, 50000, 100000].map((a) => (
                <Button key={a} variant="outline" size="sm" onClick={() => setAddAmount(String(a))}>
                  {formatINR(a)}
                </Button>
              ))}
            </div>
            <Button onClick={handleAddFunds} className="gap-2">
              <PlusCircle className="w-4 h-4" /> Add Funds
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card className="glass border-border/50">
        <CardHeader><CardTitle className="font-display text-base">Transaction History</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Balance After</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTransactions.map((tx) => {
                const tc = typeConfig[tx.type] || typeConfig.spend;
                return (
                  <TableRow key={tx.id} className="border-border/50">
                    <TableCell>
                      <div className={`flex items-center gap-1.5 ${tc.className}`}>
                        {tc.icon} <span className="text-xs font-medium">{tc.label}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-foreground">{tx.description}</TableCell>
                    <TableCell className={`text-right font-mono text-sm ${tx.amount >= 0 ? "text-success" : "text-foreground"}`}>
                      {tx.amount >= 0 ? "+" : ""}{formatINR(Math.abs(tx.amount))}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm text-muted-foreground">{formatINR(tx.balance_after)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{tx.created_at}</TableCell>
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

export default BrandBilling;
