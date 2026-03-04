import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCircle, Youtube, Instagram, MapPin, Save } from "lucide-react";
import { toast } from "sonner";

const NICHES = ["Tech", "Fashion", "Food", "Travel", "Finance", "Fitness", "Entertainment", "Education", "Gaming", "Beauty", "Lifestyle"];
const LANGUAGES = ["Hindi", "English", "Tamil", "Telugu", "Bengali", "Marathi", "Kannada", "Gujarati", "Malayalam", "Punjabi"];

const CreatorProfile = () => {
  const { profile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  const toggleItem = (arr: string[], setArr: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    setArr(arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]);
  };

  const handleSave = () => {
    toast.success("Profile updated successfully!");
  };

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
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell brands about yourself..."
            className="w-full bg-muted border border-border rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground min-h-[80px] resize-none focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      {/* Niche selection */}
      <div className="glass rounded-xl p-6 space-y-3">
        <h3 className="font-display font-bold text-foreground">Your Niches</h3>
        <p className="text-xs text-muted-foreground">Select niches that match your content (max 5)</p>
        <div className="flex flex-wrap gap-2">
          {NICHES.map((n) => (
            <button
              key={n}
              onClick={() => selectedNiches.length < 5 || selectedNiches.includes(n) ? toggleItem(selectedNiches, setSelectedNiches, n) : null}
              className={`badge-pill text-xs border transition-all ${
                selectedNiches.includes(n)
                  ? "bg-primary/20 text-primary border-primary/30"
                  : "bg-muted text-muted-foreground border-border hover:text-foreground"
              }`}
            >
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
            <button
              key={l}
              onClick={() => toggleItem(selectedLanguages, setSelectedLanguages, l)}
              className={`badge-pill text-xs border transition-all ${
                selectedLanguages.includes(l)
                  ? "bg-primary/20 text-primary border-primary/30"
                  : "bg-muted text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Platform connections */}
      <div className="glass rounded-xl p-6 space-y-4">
        <h3 className="font-display font-bold text-foreground">Platform Connections</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border/50">
            <div className="flex items-center gap-3">
              <Youtube className="w-5 h-5 text-info" />
              <div>
                <p className="text-sm font-medium text-foreground">YouTube</p>
                <p className="text-xs text-muted-foreground">Connect your YouTube channel</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="border-info text-info hover:bg-info/10">
              Connect
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border/50">
            <div className="flex items-center gap-3">
              <Instagram className="w-5 h-5 text-premium" />
              <div>
                <p className="text-sm font-medium text-foreground">Instagram</p>
                <p className="text-xs text-muted-foreground">Connect your Instagram account</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="border-premium text-premium hover:bg-premium/10">
              Connect
            </Button>
          </div>
        </div>
      </div>

      <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90">
        <Save className="w-4 h-4 mr-2" /> Save Profile
      </Button>
    </motion.div>
  );
};

export default CreatorProfile;
