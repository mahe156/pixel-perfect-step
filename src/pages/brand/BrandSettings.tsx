import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Building2, User, Globe, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const BrandSettings = () => {
  const [companyName, setCompanyName] = useState("Acme Fashion Pvt Ltd");
  const [contactName, setContactName] = useState("Rajesh Kumar");
  const [designation, setDesignation] = useState("Marketing Head");
  const [website, setWebsite] = useState("https://acmefashion.in");
  const [gst, setGst] = useState("27AABCU9603R1ZM");
  const [industry, setIndustry] = useState("Fashion & Apparel");

  const handleSave = () => toast.success("Settings saved successfully");

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display font-extrabold text-2xl text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your brand profile and preferences.</p>
      </div>

      <Tabs defaultValue="company" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="company"><Building2 className="w-3.5 h-3.5 mr-1.5" />Company</TabsTrigger>
          <TabsTrigger value="contact"><User className="w-3.5 h-3.5 mr-1.5" />Contact</TabsTrigger>
          <TabsTrigger value="verification"><Shield className="w-3.5 h-3.5 mr-1.5" />Verification</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card className="glass border-border/50">
            <CardHeader><CardTitle className="font-display text-base">Company Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Industry</Label>
                <Input value={industry} onChange={(e) => setIndustry(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Website</Label>
                <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://" />
              </div>
              <Button onClick={handleSave} className="gap-2"><Save className="w-4 h-4" />Save</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card className="glass border-border/50">
            <CardHeader><CardTitle className="font-display text-base">Contact Person</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={contactName} onChange={(e) => setContactName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Designation</Label>
                  <Input value={designation} onChange={(e) => setDesignation(e.target.value)} />
                </div>
              </div>
              <Button onClick={handleSave} className="gap-2"><Save className="w-4 h-4" />Save</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification">
          <Card className="glass border-border/50">
            <CardHeader><CardTitle className="font-display text-base">GST Verification</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>GST Number</Label>
                <Input value={gst} onChange={(e) => setGst(e.target.value)} placeholder="e.g. 27AABCU9603R1ZM" />
              </div>
              <div className="glass rounded-lg p-3 text-sm text-muted-foreground">
                GST verification will be processed within 24 hours of submission.
              </div>
              <Button onClick={handleSave} className="gap-2"><Shield className="w-4 h-4" />Submit for Verification</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default BrandSettings;
