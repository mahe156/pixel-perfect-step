import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, Users, Youtube, Instagram, Loader2 } from "lucide-react";
import { formatINR, formatViews } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const platformIcon = {
  youtube: <Youtube className="w-4 h-4" />,
  instagram: <Instagram className="w-4 h-4" />,
  both: (
    <div className="flex gap-1">
      <Youtube className="w-3.5 h-3.5" />
      <Instagram className="w-3.5 h-3.5" />
    </div>
  ),
};

const platformColor: Record<string, string> = {
  youtube: "text-info bg-info/10 border-info/30",
  instagram: "text-premium bg-premium/10 border-premium/30",
  both: "text-warning bg-warning/10 border-warning/30",
};

const CampaignShowcase = () => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      const { data } = await supabase
        .from("campaigns")
        .select("id, title, platform, cpm_rate, total_budget, spent_amount, total_submissions, total_verified_views, niche_tags, end_date")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(6);
      setCampaigns(data || []);
      setLoading(false);
    };
    fetchCampaigns();
  }, []);

  if (loading) {
    return (
      <section className="py-16 sm:py-24 bg-card/30">
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </section>
    );
  }

  if (campaigns.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 bg-card/30">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-foreground mb-2 sm:mb-3">
            Live Campaigns
          </h2>
          <p className="text-sm text-muted-foreground">
            Join active campaigns and start earning today
          </p>
        </motion.div>

        <div className="flex md:grid md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto overflow-x-auto pb-4 md:pb-0 snap-x snap-mandatory md:snap-none -mx-4 px-4 md:mx-auto md:px-0 scrollbar-hide">
          {campaigns.map((campaign, i) => {
            const budgetPct = campaign.total_budget > 0 ? (Number(campaign.spent_amount) / Number(campaign.total_budget)) * 100 : 0;
            return (
              <motion.div
                key={campaign.id}
                className="glass-hover rounded-xl overflow-hidden min-w-[280px] sm:min-w-[300px] md:min-w-0 snap-start flex-shrink-0 md:flex-shrink"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="font-display font-bold text-sm sm:text-base text-foreground line-clamp-1">
                      {campaign.title}
                    </h3>
                    <span className={`badge-pill border text-xs ${platformColor[campaign.platform] || platformColor.both}`}>
                      {platformIcon[campaign.platform as keyof typeof platformIcon] || platformIcon.both}
                    </span>
                  </div>

                  <div className="text-xl sm:text-2xl font-bold text-primary font-mono mb-3 sm:mb-4">
                    ₹{Number(campaign.cpm_rate)}
                    <span className="text-xs sm:text-sm font-normal text-muted-foreground"> /1,000 views</span>
                  </div>

                  <div className="mb-3 sm:mb-4">
                    <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground mb-1">
                      <span>Budget Used</span>
                      <span>{Math.round(budgetPct)}%</span>
                    </div>
                    <Progress value={budgetPct} className="h-1.5 bg-muted" />
                  </div>

                  <div className="flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground mb-3 sm:mb-4">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {campaign.total_submissions || 0} submissions
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {formatViews(Number(campaign.total_verified_views) || 0)} views
                    </span>
                  </div>

                  {campaign.niche_tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3 sm:mb-4">
                      {campaign.niche_tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="badge-pill bg-muted text-muted-foreground text-[9px] sm:text-[10px]">
                          {tag}
                        </span>
                      ))}
                      {campaign.end_date && (
                        <span className="badge-pill bg-muted text-muted-foreground text-[9px] sm:text-[10px]">
                          Ends {new Date(campaign.end_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </span>
                      )}
                    </div>
                  )}

                  <Link to="/auth/login">
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-9 sm:h-10 text-xs sm:text-sm" size="sm">
                      View Campaign
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CampaignShowcase;
