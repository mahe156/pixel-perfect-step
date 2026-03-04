import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, IndianRupee, Shield, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AdminSettings = () => {
  const [platformFee, setPlatformFee] = useState("20");
  const [tdsPercent, setTdsPercent] = useState("10");
  const [minPayout, setMinPayout] = useState("500");
  const [maxPayoutPerDay, setMaxPayoutPerDay] = useState("100000");
  const [autoApprove, setAutoApprove] = useState(false);
  const [fraudDetection, setFraudDetection] = useState(true);
  const [viewVelocityThreshold, setViewVelocityThreshold] = useState("3.0");
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    const { data } = await supabase.from("platform_settings").select("key, value");
    if (data) {
      const map = Object.fromEntries(data.map(d => [d.key, d.value]));
      if (map.platform_fee) setPlatformFee(map.platform_fee);
      if (map.tds_percent) setTdsPercent(map.tds_percent);
      if (map.min_payout) setMinPayout(map.min_payout);
      if (map.max_payout_per_day) setMaxPayoutPerDay(map.max_payout_per_day);
      if (map.auto_approve) setAutoApprove(map.auto_approve === "true");
      if (map.fraud_detection) setFraudDetection(map.fraud_detection === "true");
      if (map.view_velocity_threshold) setViewVelocityThreshold(map.view_velocity_threshold);
    }
  };

  const saveSetting = async (key: string, value: string) => {
    const { error } = await supabase.from("platform_settings").upsert({ key, value }, { onConflict: "key" });
    if (error) throw error;
  };

  const handleSave = async (section: string) => {
    setSaving(true);
    try {
      if (section === "financial") {
        await Promise.all([
          saveSetting("platform_fee", platformFee),
          saveSetting("tds_percent", tdsPercent),
          saveSetting("min_payout", minPayout),
          saveSetting("max_payout_per_day", maxPayoutPerDay),
          saveSetting("auto_approve", autoApprove.toString()),
        ]);
      } else if (section === "fraud") {
        await Promise.all([
          saveSetting("fraud_detection", fraudDetection.toString()),
          saveSetting("view_velocity_threshold", viewVelocityThreshold),
        ]);
      }
      toast.success(`${section} settings saved`);
    } catch (err: any) {
      toast.error(err.message);
    }
    setSaving(false);
  };

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
        </TabsList>

        <TabsContent value="financial">
          <Card className="glass border-border/50">
            <CardHeader><CardTitle className="font-display text-base">Financial Settings</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Platform Fee (%)</Label>
                  <Input type="number" value={platformFee} onChange={(e) => setPlatformFee(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>TDS Rate (%)</Label>
                  <Input type="number" value={tdsPercent} onChange={(e) => setTdsPercent(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Minimum Payout (₹)</Label>
                  <Input type="number" value={minPayout} onChange={(e) => setMinPayout(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Max Payout Per Day (₹)</Label>
                  <Input type="number" value={maxPayoutPerDay} onChange={(e) => setMaxPayoutPerDay(e.target.value)} />
                </div>
              </div>
              <div className="flex items-center justify-between glass rounded-lg p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Auto-approve submissions</p>
                  <p className="text-xs text-muted-foreground">Skip manual review for trusted creators (score ≥ 4.5)</p>
                </div>
                <Switch checked={autoApprove} onCheckedChange={setAutoApprove} />
              </div>
              <Button onClick={() => handleSave("financial")} disabled={saving} className="gap-2"><Save className="w-4 h-4" />Save Financial Settings</Button>
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
              </div>
              <Button onClick={() => handleSave("fraud")} disabled={saving} className="gap-2"><Save className="w-4 h-4" />Save Fraud Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default AdminSettings;
