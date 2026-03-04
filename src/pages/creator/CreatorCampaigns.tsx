import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { formatINR, formatViews } from "@/lib/format";
import {
  Eye, Users, Youtube, Instagram, Search, Filter, ArrowUpDown, ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const NICHES = ["Tech", "Fashion", "Food", "Travel", "Finance", "Fitness", "Entertainment", "Education", "Gaming"];
const LANGUAGES = ["Hindi", "English", "Tamil", "Telugu", "Bengali", "Marathi", "Kannada", "Gujarati"];
const SORT_OPTIONS = ["Highest CPM", "Newest", "Ending Soon"];

const platformIcon = {
  youtube: <Youtube className="w-3.5 h-3.5" />,
  instagram: <Instagram className="w-3.5 h-3.5" />,
  both: <><Youtube className="w-3 h-3" /><Instagram className="w-3 h-3" /></>,
};
const platformColor: Record<string, string> = {
  youtube: "text-info bg-info/10 border-info/30",
  instagram: "text-premium bg-premium/10 border-premium/30",
  both: "text-warning bg-warning/10 border-warning/30",
};

const CreatorCampaigns = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [cpmRange, setCpmRange] = useState([5, 500]);
  const [sortBy, setSortBy] = useState("Newest");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["campaigns", "active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const toggleNiche = (n: string) =>
    setSelectedNiches((prev) =>
      prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]
    );
  const toggleLang = (l: string) =>
    setSelectedLanguages((prev) =>
      prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]
    );

  const filtered = (campaigns || []).filter((c) => {
    if (platformFilter !== "all" && c.platform !== platformFilter) return false;
    if (selectedNiches.length > 0 && !selectedNiches.some((n) => (c.niche_tags || []).includes(n))) return false;
    if (selectedLanguages.length > 0 && !selectedLanguages.some((l) => (c.language_tags || []).includes(l))) return false;
    if (c.cpm_rate < cpmRange[0] || c.cpm_rate > cpmRange[1]) return false;
    if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Demo campaigns when DB is empty
  const demoCampaigns = [
    { id: "demo-1", title: "boAt Airdopes X Review", platform: "youtube" as const, cpm_rate: 80, total_budget: 500000, spent_amount: 325000, total_submissions: 142, total_verified_views: 4062500, niche_tags: ["Tech", "Gadgets"], language_tags: ["Hindi", "English"], end_date: "2026-03-25T00:00:00Z", status: "active" as const, brand_id: null, description: "Review the new boAt Airdopes X" },
    { id: "demo-2", title: "Mamaearth Onion Hair Oil", platform: "instagram" as const, cpm_rate: 45, total_budget: 300000, spent_amount: 180000, total_submissions: 89, total_verified_views: 4000000, niche_tags: ["Beauty", "Skincare"], language_tags: ["Hindi"], end_date: "2026-04-02T00:00:00Z", status: "active" as const, brand_id: null, description: "Show real results with Onion Hair Oil" },
    { id: "demo-3", title: "Noise ColorFit Pro 5", platform: "both" as const, cpm_rate: 60, total_budget: 200000, spent_amount: 75000, total_submissions: 56, total_verified_views: 1250000, niche_tags: ["Tech", "Fitness"], language_tags: ["English"], end_date: "2026-03-30T00:00:00Z", status: "active" as const, brand_id: null, description: "Unbox and review the new smartwatch" },
    { id: "demo-4", title: "Lenskart Sunglasses Try-On", platform: "instagram" as const, cpm_rate: 35, total_budget: 150000, spent_amount: 45000, total_submissions: 34, total_verified_views: 1285714, niche_tags: ["Fashion", "Lifestyle"], language_tags: ["Hindi", "English"], end_date: "2026-04-10T00:00:00Z", status: "active" as const, brand_id: null, description: "Try on and review Lenskart sunglasses" },
    { id: "demo-5", title: "Meesho Diwali Collection", platform: "youtube" as const, cpm_rate: 50, total_budget: 400000, spent_amount: 200000, total_submissions: 110, total_verified_views: 4000000, niche_tags: ["Fashion", "Shopping"], language_tags: ["Hindi", "Tamil", "Telugu"], end_date: "2026-04-15T00:00:00Z", status: "active" as const, brand_id: null, description: "Showcase the best Diwali deals" },
    { id: "demo-6", title: "Sugar Cosmetics GRWM", platform: "instagram" as const, cpm_rate: 55, total_budget: 250000, spent_amount: 120000, total_submissions: 67, total_verified_views: 2181818, niche_tags: ["Beauty", "Fashion"], language_tags: ["English", "Hindi"], end_date: "2026-04-08T00:00:00Z", status: "active" as const, brand_id: null, description: "Get Ready With Me using Sugar products" },
  ];

  const displayCampaigns = filtered.length > 0 ? filtered : demoCampaigns;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-foreground">Browse Campaigns</h1>
          <p className="text-sm text-muted-foreground">Find campaigns that match your content</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="border-border text-muted-foreground"
        >
          <Filter className="w-4 h-4 mr-1" />
          Filters
        </Button>
      </div>

      {/* Search bar */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground flex-1"
            />
          </div>
          {/* Platform toggle */}
          <div className="flex gap-1">
            {["all", "youtube", "instagram"].map((p) => (
              <button
                key={p}
                onClick={() => setPlatformFilter(p)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  platformFilter === p
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {p === "all" ? "All" : p === "youtube" ? "YouTube" : "Instagram"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="glass rounded-xl p-5 space-y-4"
        >
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Niche</p>
            <div className="flex flex-wrap gap-2">
              {NICHES.map((n) => (
                <button
                  key={n}
                  onClick={() => toggleNiche(n)}
                  className={`badge-pill text-xs border transition-all ${
                    selectedNiches.includes(n)
                      ? "bg-primary/20 text-primary border-primary/30"
                      : "bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Language</p>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((l) => (
                <button
                  key={l}
                  onClick={() => toggleLang(l)}
                  className={`badge-pill text-xs border transition-all ${
                    selectedLanguages.includes(l)
                      ? "bg-primary/20 text-primary border-primary/30"
                      : "bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">
              CPM Range: ₹{cpmRange[0]} — ₹{cpmRange[1]}
            </p>
            <Slider value={cpmRange} onValueChange={setCpmRange} min={5} max={500} step={5} className="max-w-sm" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Sort By</p>
            <div className="flex gap-2">
              {SORT_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`badge-pill text-xs border transition-all ${
                    sortBy === s
                      ? "bg-primary/20 text-primary border-primary/30"
                      : "bg-muted text-muted-foreground border-border"
                  }`}
                >
                  <ArrowUpDown className="w-3 h-3 mr-1" />
                  {s}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Campaign grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass rounded-xl p-6 h-64 shimmer" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayCampaigns.map((c, i) => (
            <motion.div
              key={c.id}
              className="glass-hover rounded-xl overflow-hidden cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/creator/campaigns/${c.id}`)}
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-foreground">
                    {c.title.charAt(0)}
                  </div>
                  <span className={`badge-pill border text-xs flex items-center gap-1 ${platformColor[c.platform]}`}>
                    {platformIcon[c.platform]}
                  </span>
                </div>
                <h3 className="font-display font-bold text-foreground text-sm mb-2 line-clamp-2">{c.title}</h3>
                <div className="text-xl font-bold text-primary font-mono mb-3">
                  ₹{c.cpm_rate}<span className="text-xs font-normal text-muted-foreground"> /1K views</span>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                    <span>Budget</span>
                    <span>{Math.round(((c.spent_amount || 0) / c.total_budget) * 100)}%</span>
                  </div>
                  <Progress value={((c.spent_amount || 0) / c.total_budget) * 100} className="h-1 bg-muted" />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{c.total_submissions || 0}</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatViews(Number(c.total_verified_views) || 0)}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {(c.niche_tags || []).slice(0, 3).map((tag: string) => (
                    <span key={tag} className="badge-pill bg-muted text-muted-foreground text-[10px]">{tag}</span>
                  ))}
                </div>
                <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  View Campaign <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {displayCampaigns.length === 0 && !isLoading && (
        <div className="glass rounded-xl p-12 text-center text-muted-foreground">
          No campaigns match your filters. Try adjusting your criteria.
        </div>
      )}
    </motion.div>
  );
};

export default CreatorCampaigns;
