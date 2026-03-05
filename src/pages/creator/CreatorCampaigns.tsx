import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { formatINR, formatViews } from "@/lib/format";
import {
  Eye, Users, Youtube, Instagram, Search, Filter, ChevronRight, SlidersHorizontal, X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

const NICHES = ["Tech", "Fashion", "Food", "Travel", "Finance", "Fitness", "Entertainment", "Education", "Gaming"];
const LANGUAGES = ["Hindi", "English", "Tamil", "Telugu", "Bengali", "Marathi", "Kannada", "Gujarati"];

const platformIcon: Record<string, React.ReactNode> = {
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
  const navigate = useNavigate();
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [cpmRange, setCpmRange] = useState([5, 500]);
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
    setSelectedNiches((prev) => prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]);
  const toggleLang = (l: string) =>
    setSelectedLanguages((prev) => prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]);

  const activeFilterCount = (platformFilter !== "all" ? 1 : 0) + selectedNiches.length + selectedLanguages.length;

  const filtered = (campaigns || []).filter((c) => {
    if (platformFilter !== "all" && c.platform !== platformFilter) return false;
    if (selectedNiches.length > 0 && !selectedNiches.some((n) => (c.niche_tags || []).includes(n))) return false;
    if (selectedLanguages.length > 0 && !selectedLanguages.some((l) => (c.language_tags || []).includes(l))) return false;
    if (c.cpm_rate < cpmRange[0] || c.cpm_rate > cpmRange[1]) return false;
    if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div>
        <h1 className="font-display font-extrabold text-xl sm:text-2xl text-foreground">Browse Campaigns</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">Find campaigns that match your content</p>
      </div>

      {/* Search + Filter bar */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-muted/60 rounded-xl px-3 py-2.5">
            <Search className="w-4 h-4 text-muted-foreground/60 shrink-0" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground/50 flex-1 min-w-0"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`relative w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              showFilters ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Platform pills */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
          {["all", "youtube", "instagram"].map((p) => (
            <button
              key={p}
              onClick={() => setPlatformFilter(p)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap active:scale-95 ${
                platformFilter === p
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground"
              }`}
            >
              {p === "all" ? "All" : p === "youtube" ? "YouTube" : "Instagram"}
            </button>
          ))}
        </div>
      </div>

      {/* Filter sheet */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="glass rounded-xl overflow-hidden"
          >
            <div className="p-4 space-y-4">
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Niche</p>
                <div className="flex flex-wrap gap-1.5">
                  {NICHES.map((n) => (
                    <button
                      key={n}
                      onClick={() => toggleNiche(n)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all active:scale-95 ${
                        selectedNiches.includes(n)
                          ? "bg-primary/20 text-primary border border-primary/30"
                          : "bg-muted/50 text-muted-foreground border border-transparent"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Language</p>
                <div className="flex flex-wrap gap-1.5">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l}
                      onClick={() => toggleLang(l)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all active:scale-95 ${
                        selectedLanguages.includes(l)
                          ? "bg-primary/20 text-primary border border-primary/30"
                          : "bg-muted/50 text-muted-foreground border border-transparent"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  CPM Range: ₹{cpmRange[0]} — ₹{cpmRange[1]}
                </p>
                <Slider value={cpmRange} onValueChange={setCpmRange} min={5} max={500} step={5} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Campaign cards */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass rounded-xl p-5 h-40 shimmer" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-2.5 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-4 sm:space-y-0">
          {filtered.map((c, i) => (
            <motion.div
              key={c.id}
              className="glass rounded-xl overflow-hidden active:scale-[0.98] transition-transform cursor-pointer"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => navigate(`/creator/campaigns/${c.id}`)}
            >
              <div className="p-4">
                {/* Top row */}
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center text-xs font-bold text-foreground">
                      {c.title.charAt(0)}
                    </div>
                    <span className={`badge-pill border text-[10px] flex items-center gap-1 ${platformColor[c.platform]}`}>
                      {platformIcon[c.platform]}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-primary font-mono">₹{c.cpm_rate}</span>
                    <span className="text-[10px] text-muted-foreground block -mt-0.5">/1K views</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-display font-bold text-foreground text-sm mb-2.5 line-clamp-1">{c.title}</h3>

                {/* Budget bar */}
                <div className="mb-2.5">
                  <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                    <span>Budget</span>
                    <span>{Math.round(((Number(c.spent_amount) || 0) / Number(c.total_budget)) * 100)}%</span>
                  </div>
                  <Progress value={((Number(c.spent_amount) || 0) / Number(c.total_budget)) * 100} className="h-1.5 bg-muted" />
                </div>

                {/* Bottom row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{c.total_submissions || 0}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatViews(Number(c.total_verified_views) || 0)}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(c.niche_tags || []).slice(0, 2).map((tag: string) => (
                      <span key={tag} className="bg-muted text-muted-foreground text-[9px] px-2 py-0.5 rounded-md">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass rounded-xl p-10 text-center text-muted-foreground text-sm">
          No active campaigns available right now. Check back later!
        </div>
      )}
    </motion.div>
  );
};

export default CreatorCampaigns;
