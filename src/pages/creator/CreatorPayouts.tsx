import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatINR } from "@/lib/format";
import { Wallet, ArrowRight, Download, AlertTriangle, CheckCircle, Clock, XCircle, Info, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  pending: { color: "text-warning bg-warning/10 border-warning/30", icon: <Clock className="w-3 h-3" /> },
  processing: { color: "text-info bg-info/10 border-info/30", icon: <Clock className="w-3 h-3 animate-spin" /> },
  paid: { color: "text-success bg-success/10 border-success/30", icon: <CheckCircle className="w-3 h-3" /> },
  failed: { color: "text-destructive bg-destructive/10 border-destructive/30", icon: <XCircle className="w-3 h-3" /> },
};

const CreatorPayouts = () => {
  const { profile } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "bank">("upi");
  const [upiId, setUpiId] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bankIfsc, setBankIfsc] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const minPayout = 500;
  const canPayout = walletBalance >= minPayout;

  useEffect(() => {
    if (profile?.id) fetchData();
  }, [profile?.id]);

  const fetchData = async () => {
    setLoading(true);
    const [profileRes, payoutsRes] = await Promise.all([
      supabase.from("creator_profiles").select("wallet_balance, upi_id, bank_account_number, bank_ifsc").eq("user_id", profile!.id).single(),
      supabase.from("payouts").select("*").eq("creator_id", profile!.id).order("created_at", { ascending: false }),
    ]);
    if (profileRes.data) {
      setWalletBalance(Number(profileRes.data.wallet_balance) || 0);
      if (profileRes.data.upi_id) setUpiId(profileRes.data.upi_id);
      if (profileRes.data.bank_account_number) setBankAccount(profileRes.data.bank_account_number);
      if (profileRes.data.bank_ifsc) setBankIfsc(profileRes.data.bank_ifsc);
    }
    setPayouts(payoutsRes.data || []);
    setLoading(false);
  };

  const handleRequestPayout = () => {
    if (!canPayout) return;
    if (paymentMethod === "upi" && !upiId) { toast.error("Please enter your UPI ID"); return; }
    if (paymentMethod === "bank" && (!bankAccount || !bankIfsc)) { toast.error("Please enter bank details"); return; }
    toast.success("Payout request submitted! You'll receive it within 24-48 hours.");
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl text-foreground">Payouts</h1>
        <p className="text-sm text-muted-foreground">Request withdrawals and view payout history</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 text-success flex items-center justify-center"><Wallet className="w-5 h-5" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Available Balance</p>
              <p className="text-2xl font-bold font-mono text-success">{formatINR(walletBalance)}</p>
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 flex items-start gap-2">
            <Info className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">Minimum payout amount is {formatINR(minPayout)}.</p>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Payment Method</p>
            <div className="flex gap-2">
              <button onClick={() => setPaymentMethod("upi")}
                className={`flex-1 p-3 rounded-lg text-sm font-medium transition-all border ${paymentMethod === "upi" ? "bg-primary/10 text-primary border-primary/30" : "bg-muted text-muted-foreground border-border"}`}>UPI</button>
              <button onClick={() => setPaymentMethod("bank")}
                className={`flex-1 p-3 rounded-lg text-sm font-medium transition-all border ${paymentMethod === "bank" ? "bg-primary/10 text-primary border-primary/30" : "bg-muted text-muted-foreground border-border"}`}>Bank Transfer</button>
            </div>
          </div>
          {paymentMethod === "upi" ? (
            <div className="space-y-2">
              <Label>UPI ID</Label>
              <Input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="yourname@paytm" className="bg-muted border-border" />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-2"><Label>Account Number</Label><Input value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} placeholder="Enter account number" className="bg-muted border-border" /></div>
              <div className="space-y-2"><Label>IFSC Code</Label><Input value={bankIfsc} onChange={(e) => setBankIfsc(e.target.value.toUpperCase())} placeholder="SBIN0001234" className="bg-muted border-border" /></div>
            </div>
          )}
          <div className="bg-muted/50 rounded-lg p-3 space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground"><span>Gross Amount</span><span className="font-mono">{formatINR(walletBalance)}</span></div>
            <div className="flex justify-between text-xs text-muted-foreground"><span>TDS (10%)</span><span className="font-mono text-destructive">-{formatINR(Math.round(walletBalance * 0.1))}</span></div>
            <div className="border-t border-border/50 pt-1 flex justify-between text-sm font-medium text-foreground"><span>Net Payout</span><span className="font-mono text-success">{formatINR(Math.round(walletBalance * 0.9))}</span></div>
          </div>
          <Button onClick={handleRequestPayout} disabled={!canPayout} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            Request Payout <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="glass rounded-xl p-5 border-l-4 border-warning">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div>
                <h4 className="font-display font-bold text-sm text-foreground mb-1">TDS Information</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">10% TDS is deducted on all creator payouts as per Indian tax law.</p>
              </div>
            </div>
          </div>
          <div className="glass rounded-xl p-5">
            <h4 className="font-display font-bold text-sm text-foreground mb-3">Payout Schedule</h4>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" />UPI payouts: instant to 4 hours</div>
              <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" />Bank transfers: 1-3 business days</div>
              <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" />Minimum withdrawal: {formatINR(500)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <div className="p-5 border-b border-border/50"><h3 className="font-display font-bold text-foreground">Payout History</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left text-xs font-medium text-muted-foreground p-4">Date</th>
                <th className="text-right text-xs font-medium text-muted-foreground p-4">Gross</th>
                <th className="text-right text-xs font-medium text-muted-foreground p-4">TDS</th>
                <th className="text-right text-xs font-medium text-muted-foreground p-4">Net</th>
                <th className="text-left text-xs font-medium text-muted-foreground p-4">Method</th>
                <th className="text-left text-xs font-medium text-muted-foreground p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((p, i) => {
                const sc = statusConfig[p.status] || statusConfig.pending;
                return (
                  <motion.tr key={p.id} className="border-b border-border/30 hover:bg-muted/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                    <td className="p-4 text-sm text-foreground">{new Date(p.created_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}</td>
                    <td className="p-4 text-right text-sm font-mono text-foreground">{formatINR(Number(p.gross_amount))}</td>
                    <td className="p-4 text-right text-sm font-mono text-destructive">-{formatINR(Number(p.tds_amount))}</td>
                    <td className="p-4 text-right text-sm font-mono font-medium text-success">{formatINR(Number(p.net_amount))}</td>
                    <td className="p-4 text-sm text-foreground uppercase">{p.payment_method}</td>
                    <td className="p-4"><span className={`badge-pill border text-[10px] flex items-center gap-1 w-fit ${sc.color}`}>{sc.icon} {p.status}</span></td>
                  </motion.tr>
                );
              })}
              {payouts.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground text-sm">No payout history yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default CreatorPayouts;
