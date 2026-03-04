import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Megaphone, Settings2, IndianRupee, FileText, Youtube, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { formatINR } from "@/lib/format";
import { toast } from "sonner";

const STEPS = [
  { id: 1, title: "Campaign Info", icon: <Megaphone className="w-4 h-4" /> },
  { id: 2, title: "Requirements", icon: <Settings2 className="w-4 h-4" /> },
  { id: 3, title: "Guidelines", icon: <FileText className="w-4 h-4" /> },
  { id: 4, title: "Budget & Review", icon: <IndianRupee className="w-4 h-4" /> },
];

const NICHES = ["Tech", "Fashion", "Food", "Travel", "Beauty", "Gaming", "Finance", "Health", "Education", "Entertainment"];
const LANGUAGES = ["Hindi", "English", "Tamil", "Telugu", "Marathi", "Bengali", "Kannada", "Malayalam", "Gujarati", "Punjabi"];

const BrandCampaignNew = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Step 1
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [platform, setPlatform] = useState<"youtube" | "instagram" | "both">("youtube");

  // Step 2
  const [minFollowers, setMinFollowers] = useState(1000);
  const [minReliability, setMinReliability] = useState(3);
  const [maxCreators, setMaxCreators] = useState(50);
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  // Step 3
  const [hashtags, setHashtags] = useState("");
  const [doList, setDoList] = useState<string[]>([""]);
  const [dontList, setDontList] = useState<string[]>([""]);
  const [contentGuidelines, setContentGuidelines] = useState("");

  // Step 4
  const [cpmRate, setCpmRate] = useState(100);
  const [totalBudget, setTotalBudget] = useState(100000);
  const platformFee = 20;

  const estimatedViews = totalBudget > 0 ? Math.floor(totalBudget / (cpmRate / 1000)) : 0;
  const escrowAmount = totalBudget;
  const platformFeeAmount = (totalBudget * platformFee) / 100;

  const toggleTag = (tag: string, list: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(list.includes(tag) ? list.filter((t) => t !== tag) : [...list, tag]);
  };

  const updateListItem = (index: number, value: string, list: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    const updated = [...list];
    updated[index] = value;
    setter(updated);
  };

  const addListItem = (list: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter([...list, ""]);
  };

  const handleSubmit = () => {
    if (!title || !description) {
      toast.error("Please fill in campaign title and description");
      return;
    }
    toast.success("Campaign created as draft! You can fund it from the campaign detail page.");
    navigate("/brand/campaigns");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/brand/campaigns")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="font-display font-extrabold text-2xl text-foreground">Create Campaign</h1>
          <p className="text-sm text-muted-foreground">Step {step} of {STEPS.length}</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex gap-2">
        {STEPS.map((s) => (
          <button
            key={s.id}
            onClick={() => s.id < step && setStep(s.id)}
            className={`flex-1 flex items-center gap-2 p-3 rounded-lg text-xs font-medium transition-all ${
              s.id === step ? "glass border border-primary/30 text-primary" :
              s.id < step ? "glass text-success" : "glass text-muted-foreground"
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
              s.id === step ? "bg-primary text-primary-foreground" :
              s.id < step ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"
            }`}>
              {s.id < step ? <Check className="w-3 h-3" /> : s.id}
            </div>
            <span className="hidden sm:inline">{s.title}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
          {/* Step 1: Campaign Info */}
          {step === 1 && (
            <Card className="glass border-border/50">
              <CardHeader><CardTitle className="font-display">Campaign Information</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label>Campaign Title</Label>
                  <Input placeholder="e.g. Summer Fashion Haul 2026" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Describe what creators should promote…" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
                </div>
                <div className="space-y-2">
                  <Label>Platform</Label>
                  <div className="flex gap-3">
                    {[
                      { value: "youtube", label: "YouTube", icon: <Youtube className="w-4 h-4" /> },
                      { value: "instagram", label: "Instagram", icon: <Instagram className="w-4 h-4" /> },
                      { value: "both", label: "Both", icon: <Megaphone className="w-4 h-4" /> },
                    ].map((p) => (
                      <button
                        key={p.value}
                        onClick={() => setPlatform(p.value as typeof platform)}
                        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                          platform === p.value ? "border-primary bg-primary/10 text-primary" : "border-border/50 text-muted-foreground hover:border-primary/30"
                        }`}
                      >
                        {p.icon} <span className="text-sm font-medium">{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Requirements */}
          {step === 2 && (
            <Card className="glass border-border/50">
              <CardHeader><CardTitle className="font-display">Creator Requirements</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Min Followers</Label>
                    <Input type="number" value={minFollowers} onChange={(e) => setMinFollowers(+e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Min Reliability Score</Label>
                    <Input type="number" min={1} max={5} step={0.5} value={minReliability} onChange={(e) => setMinReliability(+e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Creators</Label>
                    <Input type="number" value={maxCreators} onChange={(e) => setMaxCreators(+e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Niche Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {NICHES.map((n) => (
                      <Badge
                        key={n}
                        variant={selectedNiches.includes(n) ? "default" : "outline"}
                        className="cursor-pointer transition-all"
                        onClick={() => toggleTag(n, selectedNiches, setSelectedNiches)}
                      >{n}</Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Language Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGES.map((l) => (
                      <Badge
                        key={l}
                        variant={selectedLanguages.includes(l) ? "default" : "outline"}
                        className="cursor-pointer transition-all"
                        onClick={() => toggleTag(l, selectedLanguages, setSelectedLanguages)}
                      >{l}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Guidelines */}
          {step === 3 && (
            <Card className="glass border-border/50">
              <CardHeader><CardTitle className="font-display">Content Guidelines</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label>Hashtags (comma separated)</Label>
                  <Input placeholder="#BrandName, #SummerSale" value={hashtags} onChange={(e) => setHashtags(e.target.value)} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-success">✅ Do&apos;s</Label>
                    {doList.map((item, i) => (
                      <Input key={i} placeholder={`Do item ${i + 1}`} value={item} onChange={(e) => updateListItem(i, e.target.value, doList, setDoList)} />
                    ))}
                    <Button variant="outline" size="sm" onClick={() => addListItem(doList, setDoList)}>+ Add</Button>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-destructive">❌ Don&apos;ts</Label>
                    {dontList.map((item, i) => (
                      <Input key={i} placeholder={`Don't item ${i + 1}`} value={item} onChange={(e) => updateListItem(i, e.target.value, dontList, setDontList)} />
                    ))}
                    <Button variant="outline" size="sm" onClick={() => addListItem(dontList, setDontList)}>+ Add</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Additional Guidelines</Label>
                  <Textarea placeholder="Any specific instructions for creators…" value={contentGuidelines} onChange={(e) => setContentGuidelines(e.target.value)} rows={3} />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Budget & Review */}
          {step === 4 && (
            <div className="space-y-4">
              <Card className="glass border-border/50">
                <CardHeader><CardTitle className="font-display">Budget & Pricing</CardTitle></CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label>CPM Rate</Label>
                      <span className="text-sm font-mono text-primary">{formatINR(cpmRate)}</span>
                    </div>
                    <Slider value={[cpmRate]} onValueChange={([v]) => setCpmRate(v)} min={20} max={500} step={10} />
                  </div>
                  <div className="space-y-2">
                    <Label>Total Budget</Label>
                    <Input type="number" value={totalBudget} onChange={(e) => setTotalBudget(+e.target.value)} />
                  </div>
                  <div className="glass rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Estimated Views</span><span className="font-mono text-foreground">{estimatedViews.toLocaleString("en-IN")}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Platform Fee ({platformFee}%)</span><span className="font-mono text-foreground">{formatINR(platformFeeAmount)}</span></div>
                    <div className="flex justify-between border-t border-border/50 pt-2"><span className="font-medium text-foreground">Escrow Amount</span><span className="font-mono font-bold text-primary">{formatINR(escrowAmount)}</span></div>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass border-border/50">
                <CardHeader><CardTitle className="font-display">Review Summary</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-3">
                    <div><span className="text-muted-foreground">Title:</span> <span className="text-foreground font-medium">{title || "—"}</span></div>
                    <div><span className="text-muted-foreground">Platform:</span> <span className="text-foreground font-medium capitalize">{platform}</span></div>
                    <div><span className="text-muted-foreground">Min Followers:</span> <span className="text-foreground font-medium">{minFollowers.toLocaleString()}</span></div>
                    <div><span className="text-muted-foreground">Max Creators:</span> <span className="text-foreground font-medium">{maxCreators}</span></div>
                    <div><span className="text-muted-foreground">Niches:</span> <span className="text-foreground font-medium">{selectedNiches.join(", ") || "Any"}</span></div>
                    <div><span className="text-muted-foreground">Languages:</span> <span className="text-foreground font-medium">{selectedLanguages.join(", ") || "Any"}</span></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        {step < STEPS.length ? (
          <Button onClick={() => setStep(step + 1)}>
            Next <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="gap-2">
            <Check className="w-4 h-4" /> Create Campaign
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default BrandCampaignNew;
