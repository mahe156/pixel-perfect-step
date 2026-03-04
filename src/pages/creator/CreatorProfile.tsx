import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Youtube, Instagram, Save, CheckCircle, Loader2, X, Copy, RefreshCw, ArrowRight, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const NICHES = ["Tech", "Fashion", "Food", "Travel", "Finance", "Fitness", "Entertainment", "Education", "Gaming", "Beauty", "Lifestyle"];
const LANGUAGES = ["Hindi", "English", "Tamil", "Telugu", "Bengali", "Marathi", "Kannada", "Gujarati", "Malayalam", "Punjabi"];

const generateCode = () => String(Math.floor(100000 + Math.random() * 900000));

type ConnectStep = "handle" | "verify";

interface ConnectedAccount {
  id: string;
  platform: string;
  handle: string;
  bio_verified: boolean;
  followers: number;
  subscribers: number;
  created_at: string;
}

const CreatorProfile = () => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  // Connected accounts
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);

  // Dialog state
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [connectPlatform, setConnectPlatform] = useState<"youtube" | "instagram">("youtube");
  const [handleInput, setHandleInput] = useState("");
  const [connectStep, setConnectStep] = useState<ConnectStep>("handle");
  const [verificationCode, setVerificationCode] = useState(generateCode);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (profile?.id) fetchData();
  }, [profile?.id]);

  const fetchData = async () => {
    const [profileRes, accountsRes] = await Promise.all([
      supabase.from("creator_profiles").select("*").eq("user_id", profile!.id).single(),
      supabase.from("connected_accounts").select("*").eq("user_id", profile!.id).eq("is_active", true).order("created_at", { ascending: false }),
    ]);

    if (profileRes.data) {
      setBio(profileRes.data.bio || "");
      setLocation(profileRes.data.location || "");
      setSelectedNiches(profileRes.data.niche || []);
      setSelectedLanguages(profileRes.data.language || []);
    }

    if (accountsRes.data) {
      setAccounts(accountsRes.data as ConnectedAccount[]);
    }

    setLoading(false);
  };

  const toggleItem = (arr: string[], setArr: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    setArr(arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]);
  };

  const resetDialog = () => {
    setConnectStep("handle");
    setHandleInput("");
    setVerificationCode(generateCode());
  };

  const openConnect = (platform: "youtube" | "instagram") => {
    setConnectPlatform(platform);
    resetDialog();
    setConnectDialogOpen(true);
  };

  const verifyAndConnect = async () => {
    const handle = connectPlatform === "youtube"
      ? handleInput.trim().replace("@", "").replace(/https?:\/\/(www\.)?youtube\.com\/@?/, "").replace(/\/.*/, "")
      : handleInput.trim().replace("@", "").replace(/https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/.*/, "");

    setVerifying(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-bio", {
        body: { platform: connectPlatform, handle, verification_code: verificationCode },
      });

      if (error) throw error;

      if (data?.verified) {
        toast.success(`${connectPlatform === "youtube" ? "YouTube" : "Instagram"} @${handle} verified & connected!`);
        setConnectDialogOpen(false);
        resetDialog();
        fetchData(); // Refresh accounts list
      } else {
        toast.error("Code not found in your bio. Make sure you've added it and try again.");
      }
    } catch (err: any) {
      toast.error(err.message || "Verification failed. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const removeAccount = async (account: ConnectedAccount) => {
    const { error } = await supabase
      .from("connected_accounts")
      .update({ is_active: false })
      .eq("id", account.id);

    if (error) {
      toast.error("Failed to remove account");
      return;
    }

    setAccounts((prev) => prev.filter((a) => a.id !== account.id));
    toast.success(`@${account.handle} removed`);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error: userError } = await supabase
        .from("users")
        .update({ full_name: fullName })
        .eq("id", profile!.id);

      const { error: profileError } = await supabase
        .from("creator_profiles")
        .update({ bio, location, niche: selectedNiches, language: selectedLanguages })
        .eq("user_id", profile!.id);

      if (userError || profileError) throw userError || profileError;
      toast.success("Profile saved!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const ytAccounts = accounts.filter((a) => a.platform === "youtube");
  const igAccounts = accounts.filter((a) => a.platform === "instagram");

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display font-extrabold text-2xl text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your creator profile</p>
      </div>

      {/* Avatar and basic info */}
      <div className="glass rounded-xl p-6 space-y-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xl font-bold">
            {fullName.charAt(0) || "U"}
          </div>
          <div>
            <p className="font-display font-bold text-foreground">{fullName || "Your Name"}</p>
            <p className="text-xs text-muted-foreground">{profile?.email}</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-muted border-border" />
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Mumbai, India" className="bg-muted border-border" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Bio</Label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell brands about yourself..."
            className="w-full bg-muted border border-border rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground min-h-[80px] resize-none focus:outline-none focus:ring-1 focus:ring-ring" />
        </div>
      </div>

      {/* Niche selection */}
      <div className="glass rounded-xl p-6 space-y-3">
        <h3 className="font-display font-bold text-foreground">Your Niches</h3>
        <p className="text-xs text-muted-foreground">Select niches that match your content (max 5)</p>
        <div className="flex flex-wrap gap-2">
          {NICHES.map((n) => (
            <button key={n}
              onClick={() => selectedNiches.length < 5 || selectedNiches.includes(n) ? toggleItem(selectedNiches, setSelectedNiches, n) : null}
              className={`badge-pill text-xs border transition-all ${selectedNiches.includes(n) ? "bg-primary/20 text-primary border-primary/30" : "bg-muted text-muted-foreground border-border hover:text-foreground"}`}>
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Language selection */}
      <div className="glass rounded-xl p-6 space-y-3">
        <h3 className="font-display font-bold text-foreground">Content Languages</h3>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((l) => (
            <button key={l} onClick={() => toggleItem(selectedLanguages, setSelectedLanguages, l)}
              className={`badge-pill text-xs border transition-all ${selectedLanguages.includes(l) ? "bg-primary/20 text-primary border-primary/30" : "bg-muted text-muted-foreground border-border hover:text-foreground"}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="glass rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-foreground">Connected Accounts</h3>
            <p className="text-xs text-muted-foreground">Add unlimited YouTube & Instagram accounts via bio code verification</p>
          </div>
        </div>

        {/* YouTube Accounts */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Youtube className="w-4 h-4 text-info" />
              <span className="text-sm font-medium text-foreground">YouTube ({ytAccounts.length})</span>
            </div>
            <Button size="sm" variant="outline" onClick={() => openConnect("youtube")} className="border-info text-info hover:bg-info/10">
              <Plus className="w-3 h-3 mr-1" /> Add Channel
            </Button>
          </div>
          {ytAccounts.map((acc) => (
            <div key={acc.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-success" />
                <span className="text-sm text-foreground">@{acc.handle}</span>
                {acc.subscribers > 0 && (
                  <span className="text-xs text-muted-foreground">• {acc.subscribers.toLocaleString()} subs</span>
                )}
              </div>
              <Button size="icon" variant="ghost" onClick={() => removeAccount(acc)} className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10">
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>

        {/* Instagram Accounts */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Instagram className="w-4 h-4 text-premium" />
              <span className="text-sm font-medium text-foreground">Instagram ({igAccounts.length})</span>
            </div>
            <Button size="sm" variant="outline" onClick={() => openConnect("instagram")} className="border-premium text-premium hover:bg-premium/10">
              <Plus className="w-3 h-3 mr-1" /> Add Account
            </Button>
          </div>
          {igAccounts.map((acc) => (
            <div key={acc.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-success" />
                <span className="text-sm text-foreground">@{acc.handle}</span>
                {acc.followers > 0 && (
                  <span className="text-xs text-muted-foreground">• {acc.followers.toLocaleString()} followers</span>
                )}
              </div>
              <Button size="icon" variant="ghost" onClick={() => removeAccount(acc)} className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10">
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>

        {accounts.length === 0 && (
          <div className="text-center py-6 text-muted-foreground text-sm">
            No accounts connected yet. Add your YouTube or Instagram accounts to start submitting content.
          </div>
        )}
      </div>

      <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/90">
        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Save Profile
      </Button>

      {/* Bio Verification Dialog */}
      <Dialog open={connectDialogOpen} onOpenChange={(open) => { setConnectDialogOpen(open); if (!open) resetDialog(); }}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              {connectPlatform === "youtube" ? <Youtube className="w-5 h-5 text-info" /> : <Instagram className="w-5 h-5 text-premium" />}
              Connect {connectPlatform === "youtube" ? "YouTube Channel" : "Instagram Account"}
            </DialogTitle>
            <DialogDescription>
              {connectStep === "handle" ? `Enter your ${connectPlatform === "youtube" ? "channel handle" : "username"}` : "Verify ownership via bio code"}
            </DialogDescription>
          </DialogHeader>

          {connectStep === "handle" ? (
            <div className="space-y-4">
              <Input
                value={handleInput}
                onChange={(e) => setHandleInput(e.target.value)}
                placeholder={connectPlatform === "youtube" ? "@yourchannel or channel URL" : "@yourusername or profile URL"}
                className="bg-muted border-border"
              />
              <p className="text-xs text-muted-foreground">
                {connectPlatform === "youtube" ? "Example: @MrBeast or https://youtube.com/@MrBeast" : "Example: @virat.kohli or https://instagram.com/virat.kohli"}
              </p>
              <Button onClick={() => { if (handleInput.trim()) setConnectStep("verify"); }} disabled={!handleInput.trim()} className="w-full bg-primary text-primary-foreground">
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-muted rounded-lg p-4 text-center space-y-2">
                <p className="text-xs text-muted-foreground">Add this code to your {connectPlatform === "youtube" ? "channel description" : "Instagram bio"}:</p>
                <div className="flex items-center justify-center gap-3">
                  <code className="font-mono text-2xl font-bold tracking-widest text-primary">{verificationCode}</code>
                  <Button size="icon" variant="ghost" onClick={() => { navigator.clipboard.writeText(verificationCode); toast.success("Code copied!"); }}>
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 space-y-1 text-xs text-muted-foreground">
                <p>1. Copy the 6-digit code above</p>
                <p>2. Go to your {connectPlatform === "youtube" ? "YouTube channel → Edit → Add code to description" : "Instagram → Edit Profile → Add code to bio"}</p>
                <p>3. Save changes, then click "Verify & Connect" below</p>
                <p>4. You can remove the code after verification</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setConnectStep("handle")} className="border-border">Back</Button>
                <Button onClick={verifyAndConnect} disabled={verifying} className="flex-1 bg-primary text-primary-foreground">
                  {verifying ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Verifying (~60s)...</> : <>Verify & Connect</>}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default CreatorProfile;
