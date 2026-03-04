import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Star, Eye, Youtube, Instagram, Award, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatViews } from "@/lib/format";

const mockCreators = [
  { id: "1", name: "Priya Sharma", niche: ["Fashion", "Beauty"], language: ["Hindi", "English"], yt_subscribers: 250000, ig_followers: 180000, reliability_score: 4.8, total_views: 5200000, campaigns_completed: 12, avatar: "PS" },
  { id: "2", name: "Rahul Verma", niche: ["Tech", "Gaming"], language: ["Hindi"], yt_subscribers: 500000, ig_followers: 0, reliability_score: 4.5, total_views: 12000000, campaigns_completed: 8, avatar: "RV" },
  { id: "3", name: "Anita Krishnan", niche: ["Food", "Travel"], language: ["Tamil", "English"], yt_subscribers: 120000, ig_followers: 320000, reliability_score: 4.9, total_views: 3800000, campaigns_completed: 15, avatar: "AK" },
  { id: "4", name: "Vikash Mehta", niche: ["Finance", "Education"], language: ["Hindi", "English"], yt_subscribers: 800000, ig_followers: 95000, reliability_score: 4.2, total_views: 25000000, campaigns_completed: 6, avatar: "VM" },
  { id: "5", name: "Sneha Patel", niche: ["Beauty", "Health"], language: ["Gujarati", "Hindi"], yt_subscribers: 0, ig_followers: 450000, reliability_score: 4.7, total_views: 8900000, campaigns_completed: 20, avatar: "SP" },
  { id: "6", name: "Arjun Das", niche: ["Entertainment", "Gaming"], language: ["Bengali", "English"], yt_subscribers: 350000, ig_followers: 210000, reliability_score: 3.8, total_views: 7100000, campaigns_completed: 4, avatar: "AD" },
];

const BrandCreators = () => {
  const [search, setSearch] = useState("");
  const [nicheFilter, setNicheFilter] = useState("all");
  const [sortBy, setSortBy] = useState("reliability");

  const filtered = mockCreators
    .filter((c) => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (nicheFilter !== "all" && !c.niche.includes(nicheFilter)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "reliability") return b.reliability_score - a.reliability_score;
      if (sortBy === "views") return b.total_views - a.total_views;
      if (sortBy === "campaigns") return b.campaigns_completed - a.campaigns_completed;
      return 0;
    });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl text-foreground">Creator Leaderboard</h1>
        <p className="text-sm text-muted-foreground">Discover top-performing creators for your campaigns.</p>
      </div>

      <div className="glass rounded-xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search creators…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={nicheFilter} onValueChange={setNicheFilter}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Niche" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Niches</SelectItem>
            {["Tech", "Fashion", "Food", "Travel", "Beauty", "Gaming", "Finance", "Health", "Education", "Entertainment"].map((n) => (
              <SelectItem key={n} value={n}>{n}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="reliability">Reliability Score</SelectItem>
            <SelectItem value="views">Total Views</SelectItem>
            <SelectItem value="campaigns">Campaigns Done</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((creator, idx) => (
          <Card key={creator.id} className="glass border-border/50 hover:border-primary/30 transition-all">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="w-12 h-12 border-2 border-primary/30">
                    <AvatarFallback className="bg-primary/20 text-primary font-bold">{creator.avatar}</AvatarFallback>
                  </Avatar>
                  {idx < 3 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Award className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-display font-bold text-foreground">{creator.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-warning">
                    <Star className="w-3 h-3 fill-warning" /> {creator.reliability_score.toFixed(1)}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {creator.niche.map((n) => <Badge key={n} variant="outline" className="text-xs">{n}</Badge>)}
                {creator.language.map((l) => <Badge key={l} className="bg-muted text-muted-foreground text-xs">{l}</Badge>)}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                {creator.yt_subscribers > 0 && (
                  <div className="glass rounded-lg p-2">
                    <Youtube className="w-3.5 h-3.5 text-destructive mx-auto mb-1" />
                    <p className="text-xs font-mono font-medium text-foreground">{formatViews(creator.yt_subscribers)}</p>
                  </div>
                )}
                {creator.ig_followers > 0 && (
                  <div className="glass rounded-lg p-2">
                    <Instagram className="w-3.5 h-3.5 text-premium mx-auto mb-1" />
                    <p className="text-xs font-mono font-medium text-foreground">{formatViews(creator.ig_followers)}</p>
                  </div>
                )}
                <div className="glass rounded-lg p-2">
                  <Eye className="w-3.5 h-3.5 text-info mx-auto mb-1" />
                  <p className="text-xs font-mono font-medium text-foreground">{formatViews(creator.total_views)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {creator.campaigns_completed} campaigns</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};

export default BrandCreators;
