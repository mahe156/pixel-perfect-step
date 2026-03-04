import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatINR } from "@/lib/format";
import { Wallet, ArrowRight, Download, AlertTriangle, CheckCircle, Clock, XCircle, Info } from "lucide-react";
import { toast } from "sonner";

const demoPayouts = [
  { id: "p1", date: "2026-02-28", gross: 12000, tds: 1200, net: 10800, method: "UPI", status: "paid" },
  { id: "p2", date: "2026-02-15", gross: 8500, tds: 850, net: 7650, method: "Bank", status: "paid" },
  { id: "p3", date: "2026-01-31", gross: 15000, tds: 1500, net: 13500, method: "UPI", status: "paid" },
  { id: "p4", date: "2026-01-15", gross: 6200, tds: 620, net: 5580, method: "UPI", status: "paid" },
];

const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  pending: { color: "text-warning bg-warning/10 border-warning/30", icon: <Clock className="w-3 h-3" /> },
  processing: { color: "text-info bg-info/10 border-info/30", icon: <Clock className="w-3 h-3 animate-spin" /> },
  paid: { color: "text-success bg-success/10 border-success/30", icon: <CheckCircle className="w-3 h-3" /> },
  failed: { color: "text-destructive bg-destructive/10 border-destructive/30", icon: <XCircle className="w-3 h-3" /> },
};

const CreatorPayouts = () => {
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "bank">("upi");
  const [upiId, setUpiId] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bankIfsc, setBankIfsc] = useState("");

  const walletBalance = 14746;
  const minPayout = 500;
  const canPayout = walletBalance >= minPayout;

  const handleRequestPayout = () => {
    if (!canPayout) return;
    if (paymentMethod === "upi" && !upiId) {
      toast.error("Please enter your UPI ID");
      return;
    }
    if (paymentMethod === "bank" && (!bankAccount || !bankIfsc)) {
      toast.error("Please enter bank details");
      return;
    }
    toast.success("Payout request submitted! You'll receive it within 24-48 hours.");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl text-foreground">Payouts</h1>
        <p className="text-sm text-muted-foreground">Request withdrawals and view payout history</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Payout Request Card */}
        <div className="glass rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 text-success flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Available Balance</p>
              <p className="text-2xl font-bold font-mono text-success">{formatINR(walletBalance)}</p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-3 flex items-start gap-2">
            <Info className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">Minimum payout amount is {formatINR(minPayout)}. Payouts are processed within 24-48 hours.</p>
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Payment Method</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPaymentMethod("upi")}
                className={`flex-1 p-3 rounded-lg text-sm font-medium transition-all border ${
                  paymentMethod === "upi"
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "bg-muted text-muted-foreground border-border"
                }`}
              >
                UPI
              </button>
              <button
                onClick={() => setPaymentMethod("bank")}
                className={`flex-1 p-3 rounded-lg text-sm font-medium transition-all border ${
                  paymentMethod === "bank"
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "bg-muted text-muted-foreground border-border"
                }`}
              >
                Bank Transfer
              </button>
            </div>
          </div>

          {paymentMethod === "upi" ? (
            <div className="space-y-2">
              <Label htmlFor="upiId" className="text-sm">UPI ID</Label>
              <Input
                id="upiId"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@paytm"
                className="bg-muted border-border"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="bankAcc" className="text-sm">Account Number</Label>
                <Input id="bankAcc" value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} placeholder="Enter account number" className="bg-muted border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ifsc" className="text-sm">IFSC Code</Label>
                <Input id="ifsc" value={bankIfsc} onChange={(e) => setBankIfsc(e.target.value.toUpperCase())} placeholder="SBIN0001234" className="bg-muted border-border" />
              </div>
            </div>
          )}

          <div className="bg-muted/50 rounded-lg p-3 space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Gross Amount</span>
              <span className="font-mono">{formatINR(walletBalance)}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>TDS (10%)</span>
              <span className="font-mono text-destructive">-{formatINR(Math.round(walletBalance * 0.1))}</span>
            </div>
            <div className="border-t border-border/50 pt-1 flex justify-between text-sm font-medium text-foreground">
              <span>Net Payout</span>
              <span className="font-mono text-success">{formatINR(Math.round(walletBalance * 0.9))}</span>
            </div>
          </div>

          <Button
            onClick={handleRequestPayout}
            disabled={!canPayout}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Request Payout <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* TDS Info */}
        <div className="space-y-4">
          <div className="glass rounded-xl p-5 border-l-4 border-warning">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div>
                <h4 className="font-display font-bold text-sm text-foreground mb-1">TDS Information</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  10% TDS is deducted on all creator payouts as per Indian tax law. If your total annual earnings 
                  exceed ₹30,000, you will receive Form 16A for tax filing. Ensure your PAN is verified in the KYC section.
                </p>
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-5">
            <h4 className="font-display font-bold text-sm text-foreground mb-3">Payout Schedule</h4>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Payouts processed on 15th and 30th of each month
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                UPI payouts: instant to 4 hours
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Bank transfers: 1-3 business days
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Minimum withdrawal: {formatINR(500)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payout History */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="p-5 border-b border-border/50">
          <h3 className="font-display font-bold text-foreground">Payout History</h3>
        </div>
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
                <th className="text-right text-xs font-medium text-muted-foreground p-4">Slip</th>
              </tr>
            </thead>
            <tbody>
              {demoPayouts.map((p, i) => {
                const sc = statusConfig[p.status];
                return (
                  <motion.tr
                    key={p.id}
                    className="border-b border-border/30 hover:bg-muted/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <td className="p-4 text-sm text-foreground">{new Date(p.date).toLocaleDateString("en-IN", { dateStyle: "medium" })}</td>
                    <td className="p-4 text-right text-sm font-mono text-foreground">{formatINR(p.gross)}</td>
                    <td className="p-4 text-right text-sm font-mono text-destructive">-{formatINR(p.tds)}</td>
                    <td className="p-4 text-right text-sm font-mono font-medium text-success">{formatINR(p.net)}</td>
                    <td className="p-4 text-sm text-foreground">{p.method}</td>
                    <td className="p-4">
                      <span className={`badge-pill border text-[10px] flex items-center gap-1 w-fit ${sc.color}`}>
                        {sc.icon} {p.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-muted-foreground hover:text-foreground">
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default CreatorPayouts;
