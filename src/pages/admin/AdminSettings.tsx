import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Settings, IndianRupee, Shield, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const AdminSettings = () => {
  const [platformFee, setPlatformFee] = useState("20");
  const [tdsPercent, setTdsPercent] = useState("10");
  const [minPayout, setMinPayout] = useState("500");
  const [maxPayoutPerDay, setMaxPayoutPerDay] = useState("100000");
  const [autoApprove, setAutoApprove] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [fraudDetection, setFraudDetection] = useState(true);
  const [viewVelocityThreshold, setViewVelocityThreshold] = useState("3.0");

  const handleSave = () => toast.success("Platform settings saved");

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display font-extrabold text-2xl text-foreground">Platform Settings</h1>
        <p className="text-sm text-muted-foreground">Configure platform-wide settings and policies.</p>
      </div>

      <Tabs defaultValue="financial" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="financial"><IndianRupee className="w-3.5 h-3.5 mr-1.5" />Financial</TabsTrigger>
          <TabsTrigger value="fraud"><Shield className="w-3.5 h-3.5 mr-1.5" />Fraud</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="w-3.5 h-3.5 mr-1.5" />Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="financial">
          <Card className="glass border-border/50">
            <CardHeader><CardTitle className="font-display text-base">Financial Settings</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Platform Fee (%)</Label>
                  <Input type="number" value={platformFee} onChange={(e) => setPlatformFee(e.target.value)} />
                  <p className="text-xs text-muted-foreground">Commission charged on each campaign budget.</p>
                </div>
                <div className="space-y-2">
                  <Label>TDS Rate (%)</Label>
                  <Input type="number" value={tdsPercent} onChange={(e) => setTdsPercent(e.target.value)} />
                  <p className="text-xs text-muted-foreground">Tax deducted at source on creator payouts.</p>
                </div>
                <div className="space-y-2">
                  <Label>Minimum Payout (₹)</Label>
                  <Input type="number" value={minPayout} onChange={(e) => setMinPayout(e.target.value)} />
                  <p className="text-xs text-muted-foreground">Minimum balance required to request payout.</p>
                </div>
                <div className="space-y-2">
                  <Label>Max Payout Per Day (₹)</Label>
                  <Input type="number" value={maxPayoutPerDay} onChange={(e) => setMaxPayoutPerDay(e.target.value)} />
                  <p className="text-xs text-muted-foreground">Daily payout limit per creator.</p>
                </div>
              </div>
              <div className="flex items-center justify-between glass rounded-lg p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Auto-approve submissions</p>
                  <p className="text-xs text-muted-foreground">Skip manual review for trusted creators (score ≥ 4.5)</p>
                </div>
                <Switch checked={autoApprove} onCheckedChange={setAutoApprove} />
              </div>
              <Button onClick={handleSave} className="gap-2"><Save className="w-4 h-4" />Save Financial Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fraud">
          <Card className="glass border-border/50">
            <CardHeader><CardTitle className="font-display text-base">Fraud Detection</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between glass rounded-lg p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Enable Fraud Detection</p>
                  <p className="text-xs text-muted-foreground">Automatically flag suspicious submissions</p>
                </div>
                <Switch checked={fraudDetection} onCheckedChange={setFraudDetection} />
              </div>
              <div className="space-y-2">
                <Label>View Velocity Threshold (x multiplier)</Label>
                <Input type="number" step="0.1" value={viewVelocityThreshold} onChange={(e) => setViewVelocityThreshold(e.target.value)} />
                <p className="text-xs text-muted-foreground">Flag submissions with view velocity above this threshold compared to average.</p>
              </div>
              <Button onClick={handleSave} className="gap-2"><Save className="w-4 h-4" />Save Fraud Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="glass border-border/50">
            <CardHeader><CardTitle className="font-display text-base">Notification Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Email notifications for new submissions", checked: emailNotifs, onChange: setEmailNotifs },
                { label: "Email alerts for fraud flags", checked: true, onChange: () => {} },
                { label: "Daily payout summary email", checked: true, onChange: () => {} },
                { label: "Weekly platform analytics report", checked: false, onChange: () => {} },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between glass rounded-lg p-3">
                  <p className="text-sm text-foreground">{item.label}</p>
                  <Switch checked={item.checked} onCheckedChange={item.onChange} />
                </div>
              ))}
              <Button onClick={handleSave} className="gap-2"><Save className="w-4 h-4" />Save Notification Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default AdminSettings;
