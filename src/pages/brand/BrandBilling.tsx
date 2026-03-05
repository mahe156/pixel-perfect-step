import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Wallet, PlusCircle, ArrowUpRight, ArrowDownLeft, IndianRupee, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatINR } from "@/lib/format";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const typeConfig: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  deposit: { label: "Deposit", className: "text-success", icon: <ArrowDownLeft className="w-3.5 h-3.5" /> },
  spend: { label: "Spend", className: "text-primary", icon: <ArrowUpRight className="w-3.5 h-3.5" /> },
  refund: { label: "Refund", className: "text-info", icon: <ArrowDownLeft className="w-3.5 h-3.5" /> },
  platform_fee: { label: "Platform Fee", className: "text-warning", icon: <ArrowUpRight className="w-3.5 h-3.5" /> },
};

const BrandBilling = () => {
  const { profile } = useAuth();
  const [addAmount, setAddAmount] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [totalDeposited, setTotalDeposited] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) fetchData();
  }, [profile?.id]);

  const fetchData = async () => {
    const [brandRes, txRes] = await Promise.all([
      supabase.from("brand_profiles").select("wallet_balance, total_spent").eq("user_id", profile!.id).single(),
      supabase.from("wallet_transactions").select("*").eq("user_id", profile!.id).order("created_at", { ascending: false }).limit(50),
    ]);

    if (brandRes.data) {
      setWalletBalance(Number(brandRes.data.wallet_balance) || 0);
      setTotalSpent(Number(brandRes.data.total_spent) || 0);
    }

    const txs = txRes.data || [];
    setTransactions(txs);
    setTotalDeposited(txs.filter(t => t.type === "deposit").reduce((s, t) => s + Number(t.amount), 0));
    setLoading(false);
  };

  const handleAddFunds = () => {
    const amt = parseFloat(addAmount);
    if (!amt || amt < 1000) { toast.error("Minimum top-up is ₹1,000"); return; }
    toast.info("Payment gateway integration coming soon");
    setAddAmount("");
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl text-foreground">Billing & Wallet</h1>
        <p className="text-sm text-muted-foreground">Manage your wallet balance and view transactions.</p>
      </div>

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

      <Card className="glass border-border/50">
        <CardHeader><CardTitle className="font-display text-base">Transaction History</CardTitle></CardHeader>
        <CardContent className="p-0">
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">No transactions yet.</div>
          ) : (
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
                {transactions.map((tx) => {
                  const tc = typeConfig[tx.type] || typeConfig.spend;
                  return (
                    <TableRow key={tx.id} className="border-border/50">
                      <TableCell>
                        <div className={`flex items-center gap-1.5 ${tc.className}`}>
                          {tc.icon} <span className="text-xs font-medium">{tc.label}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-foreground">{tx.description || "-"}</TableCell>
                      <TableCell className={`text-right font-mono text-sm ${Number(tx.amount) >= 0 ? "text-success" : "text-foreground"}`}>
                        {Number(tx.amount) >= 0 ? "+" : ""}{formatINR(Math.abs(Number(tx.amount)))}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm text-muted-foreground">{formatINR(Number(tx.balance_after))}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{new Date(tx.created_at).toLocaleDateString("en-IN")}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BrandBilling;
