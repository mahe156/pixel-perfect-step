import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Youtube, Instagram, Save, CheckCircle, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const NICHES = ["Tech", "Fashion", "Food", "Travel", "Finance", "Fitness", "Entertainment", "Education", "Gaming", "Beauty", "Lifestyle"];
const LANGUAGES = ["Hindi", "English", "Tamil", "Telugu", "Bengali", "Marathi", "Kannada", "Gujarati", "Malayalam", "Punjabi"];

const CreatorProfile = () => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  // Platform connection state
  const [ytConnected, setYtConnected] = useState(false);
  const [ytChannelName, setYtChannelName] = useState("");
  const [ytChannelId, setYtChannelId] = useState("");
  const [ytSubscribers, setYtSubscribers] = useState(0);
  const [igConnected, setIgConnected] = useState(false);
  const [igUsername, setIgUsername] = useState("");
  const [igFollowers, setIgFollowers] = useState(0);

  // Dialog state
  const [ytDialogOpen, setYtDialogOpen] = useState(false);
  const [igDialogOpen, setIgDialogOpen] = useState(false);
  const [ytInput, setYtInput] = useState("");
  const [igInput, setIgInput] = useState("");
  const [connectingYt, setConnectingYt] = useState(false);
  const [connectingIg, setConnectingIg] = useState(false);

  useEffect(() => {
    if (profile?.id) fetchCreatorProfile();
  }, [profile?.id]);

  const fetchCreatorProfile = async () => {
    const { data } = await supabase
      .from("creator_profiles")
      .select("*")
      .eq("user_id", profile!.id)
      .single();

    if (data) {
      setBio(data.bio || "");
      setLocation(data.location || "");
      setSelectedNiches(data.niche || []);
      setSelectedLanguages(data.language || []);
      setYtConnected(data.yt_connected || false);
      setYtChannelName(data.yt_channel_name || "");
      setYtChannelId(data.yt_channel_id || "");
      setYtSubscribers(data.yt_subscribers || 0);
      setIgConnected(data.ig_connected || false);
      setIgUsername(data.ig_username || "");
      setIgFollowers(data.ig_followers || 0);
    }
    setLoading(false);
  };

  const toggleItem = (arr: string[], setArr: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    setArr(arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]);
  };

  const connectYouTube = async () => {
    if (!ytInput.trim()) return;
    setConnectingYt(true);
    try {
      const handle = ytInput.trim().replace("@", "").replace(/https?:\/\/(www\.)?youtube\.com\/@?/, "").replace(/\/.*/, "");
      
      const { error } = await supabase
        .from("creator_profiles")
        .update({
          yt_connected: true,
          yt_channel_name: handle,
          yt_channel_id: handle,
        })
        .eq("user_id", profile!.id);

      if (error) throw error;
      setYtConnected(true);
      setYtChannelName(handle);
      setYtChannelId(handle);
      setYtDialogOpen(false);
      setYtInput("");
      toast.success("YouTube channel connected!");
    } catch (err: any) {
      toast.error(err.message || "Failed to connect YouTube");
    } finally {
      setConnectingYt(false);
    }
  };

  const connectInstagram = async () => {
    if (!igInput.trim()) return;
    setConnectingIg(true);
    try {
      const username = igInput.trim().replace("@", "").replace(/https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/.*/, "");

      const { error } = await supabase
        .from("creator_profiles")
        .update({
          ig_connected: true,
          ig_username: username,
        })
        .eq("user_id", profile!.id);

      if (error) throw error;
      setIgConnected(true);
      setIgUsername(username);
      setIgDialogOpen(false);
      setIgInput("");
      toast.success("Instagram account connected!");
    } catch (err: any) {
      toast.error(err.message || "Failed to connect Instagram");
    } finally {
      setConnectingIg(false);
    }
  };

  const disconnectPlatform = async (platform: "youtube" | "instagram") => {
    const updates = platform === "youtube"
      ? { yt_connected: false, yt_channel_name: null, yt_channel_id: null, yt_subscribers: 0 }
      : { ig_connected: false, ig_username: null, ig_followers: 0 };

    const { error } = await supabase
      .from("creator_profiles")
      .update(updates)
      .eq("user_id", profile!.id);

    if (error) {
      toast.error("Failed to disconnect");
      return;
    }

    if (platform === "youtube") {
      setYtConnected(false); setYtChannelName(""); setYtChannelId(""); setYtSubscribers(0);
    } else {
      setIgConnected(false); setIgUsername(""); setIgFollowers(0);
    }
    toast.success(`${platform === "youtube" ? "YouTube" : "Instagram"} disconnected`);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update users table
      const { error: userError } = await supabase
        .from("users")
        .update({ full_name: fullName })
        .eq("id", profile!.id);

      // Update creator_profiles
      const { error: profileError } = await supabase
        .from("creator_profiles")
        .update({
          bio,
          location,
          niche: selectedNiches,
          language: selectedLanguages,
        })
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

      {/* Platform connections */}
      <div className="glass rounded-xl p-6 space-y-4">
        <h3 className="font-display font-bold text-foreground">Platform Connections</h3>
        <div className="space-y-3">
          {/* YouTube */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border/50">
            <div className="flex items-center gap-3">
              <Youtube className="w-5 h-5 text-info" />
              <div>
                <p className="text-sm font-medium text-foreground">YouTube</p>
                {ytConnected ? (
                  <p className="text-xs text-success flex items-center gap-1"><CheckCircle className="w-3 h-3" /> @{ytChannelName}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">Connect your YouTube channel</p>
                )}
              </div>
            </div>
            {ytConnected ? (
              <Button size="sm" variant="ghost" onClick={() => disconnectPlatform("youtube")} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                <X className="w-4 h-4 mr-1" /> Disconnect
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setYtDialogOpen(true)} className="border-info text-info hover:bg-info/10">
                Connect
              </Button>
            )}
          </div>

          {/* Instagram */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border/50">
            <div className="flex items-center gap-3">
              <Instagram className="w-5 h-5 text-premium" />
              <div>
                <p className="text-sm font-medium text-foreground">Instagram</p>
                {igConnected ? (
                  <p className="text-xs text-success flex items-center gap-1"><CheckCircle className="w-3 h-3" /> @{igUsername}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">Connect your Instagram account</p>
                )}
              </div>
            </div>
            {igConnected ? (
              <Button size="sm" variant="ghost" onClick={() => disconnectPlatform("instagram")} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                <X className="w-4 h-4 mr-1" /> Disconnect
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setIgDialogOpen(true)} className="border-premium text-premium hover:bg-premium/10">
                Connect
              </Button>
            )}
          </div>
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/90">
        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Save Profile
      </Button>

      {/* YouTube Connect Dialog */}
      <Dialog open={ytDialogOpen} onOpenChange={setYtDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground"><Youtube className="w-5 h-5 text-info" /> Connect YouTube</DialogTitle>
            <DialogDescription>Enter your YouTube channel handle or URL</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input value={ytInput} onChange={(e) => setYtInput(e.target.value)} placeholder="@yourchannel or channel URL" className="bg-muted border-border" />
            <p className="text-xs text-muted-foreground">Example: @MrBeast or https://youtube.com/@MrBeast</p>
            <Button onClick={connectYouTube} disabled={!ytInput.trim() || connectingYt} className="w-full bg-primary text-primary-foreground">
              {connectingYt ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Connecting...</> : "Connect Channel"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Instagram Connect Dialog */}
      <Dialog open={igDialogOpen} onOpenChange={setIgDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground"><Instagram className="w-5 h-5 text-premium" /> Connect Instagram</DialogTitle>
            <DialogDescription>Enter your Instagram username or profile URL</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input value={igInput} onChange={(e) => setIgInput(e.target.value)} placeholder="@yourusername or profile URL" className="bg-muted border-border" />
            <p className="text-xs text-muted-foreground">Example: @virat.kohli or https://instagram.com/virat.kohli</p>
            <Button onClick={connectInstagram} disabled={!igInput.trim() || connectingIg} className="w-full bg-primary text-primary-foreground">
              {connectingIg ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Connecting...</> : "Connect Account"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default CreatorProfile;
