import { useState } from "react";
import { motion } from "framer-motion";
import { Save, User, Bell, Shield, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const CreatorSettings = () => {
  const { profile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [email] = useState(profile?.email || "");
  const [phone, setPhone] = useState("");

  // Notification preferences
  const [emailSubmission, setEmailSubmission] = useState(true);
  const [emailPayout, setEmailPayout] = useState(true);
  const [emailCampaign, setEmailCampaign] = useState(true);
  const [emailMilestone, setEmailMilestone] = useState(false);

  const handleSave = () => toast.success("Settings saved successfully");

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display font-extrabold text-2xl text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account preferences.</p>
      </div>

      <Tabs defaultValue="account" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="account"><User className="w-3.5 h-3.5 mr-1.5" />Account</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="w-3.5 h-3.5 mr-1.5" />Notifications</TabsTrigger>
          <TabsTrigger value="privacy"><Shield className="w-3.5 h-3.5 mr-1.5" />Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card className="glass border-border/50">
            <CardHeader><CardTitle className="font-display text-base">Account Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={email} disabled className="opacity-60" />
                <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input placeholder="+91 9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <Button onClick={handleSave} className="gap-2"><Save className="w-4 h-4" />Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="glass border-border/50">
            <CardHeader><CardTitle className="font-display text-base">Email Notifications</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Submission approved/rejected", checked: emailSubmission, onChange: setEmailSubmission },
                { label: "Payout processed", checked: emailPayout, onChange: setEmailPayout },
                { label: "New campaigns matching your niche", checked: emailCampaign, onChange: setEmailCampaign },
                { label: "View milestones (10K, 50K, 1L)", checked: emailMilestone, onChange: setEmailMilestone },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between glass rounded-lg p-3">
                  <p className="text-sm text-foreground">{item.label}</p>
                  <Switch checked={item.checked} onCheckedChange={item.onChange} />
                </div>
              ))}
              <Button onClick={handleSave} className="gap-2"><Save className="w-4 h-4" />Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card className="glass border-border/50">
            <CardHeader><CardTitle className="font-display text-base">Privacy & Data</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between glass rounded-lg p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Show profile on leaderboard</p>
                  <p className="text-xs text-muted-foreground">Your name and stats will appear on public campaign leaderboards</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between glass rounded-lg p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Allow brands to see your profile</p>
                  <p className="text-xs text-muted-foreground">Brands can view your niche, followers, and reliability score</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="glass rounded-lg p-3 border border-destructive/20">
                <p className="text-sm font-medium text-destructive">Delete Account</p>
                <p className="text-xs text-muted-foreground mb-3">This action is permanent and cannot be undone.</p>
                <Button variant="destructive" size="sm">Request Account Deletion</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default CreatorSettings;
