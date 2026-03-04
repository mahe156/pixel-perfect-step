import { motion } from "framer-motion";
import { Eye, Users, Youtube, Instagram } from "lucide-react";
import { formatINR, formatViews } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const campaigns = [
  {
    brand: "boAt Lifestyle",
    title: "boAt Airdopes X Review",
    platform: "youtube" as const,
    cpm: 80,
    budget: 500000,
    spent: 325000,
    creators: 142,
    views: 4062500,
    tags: ["Tech", "Gadgets"],
    endDate: "Mar 25, 2026",
  },
  {
    brand: "Mamaearth",
    title: "Onion Hair Oil - Real Results",
    platform: "instagram" as const,
    cpm: 45,
    budget: 300000,
    spent: 180000,
    creators: 89,
    views: 4000000,
    tags: ["Beauty", "Skincare"],
    endDate: "Apr 2, 2026",
  },
  {
    brand: "Noise",
    title: "ColorFit Pro 5 Unboxing",
    platform: "both" as const,
    cpm: 60,
    budget: 200000,
    spent: 75000,
    creators: 56,
    views: 1250000,
    tags: ["Tech", "Fitness"],
    endDate: "Mar 30, 2026",
  },
];

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

const platformColor = {
  youtube: "text-info bg-info/10 border-info/30",
  instagram: "text-premium bg-premium/10 border-premium/30",
  both: "text-warning bg-warning/10 border-warning/30",
};

const CampaignShowcase = () => {
  return (
    <section className="py-24 bg-card/30">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-foreground mb-3">
            Live Campaigns
          </h2>
          <p className="text-muted-foreground">
            Join active campaigns and start earning today
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {campaigns.map((campaign, i) => (
            <motion.div
              key={campaign.title}
              className="glass-hover rounded-xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="p-6">
                {/* Brand + Platform */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-foreground">
                      {campaign.brand.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-foreground">{campaign.brand}</span>
                  </div>
                  <span className={`badge-pill border text-xs ${platformColor[campaign.platform]}`}>
                    {platformIcon[campaign.platform]}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display font-bold text-foreground mb-3">
                  {campaign.title}
                </h3>

                {/* CPM */}
                <div className="text-2xl font-bold text-primary font-mono mb-4">
                  ₹{campaign.cpm}
                  <span className="text-sm font-normal text-muted-foreground"> /1,000 views</span>
                </div>

                {/* Budget bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Budget Used</span>
                    <span>{Math.round((campaign.spent / campaign.budget) * 100)}%</span>
                  </div>
                  <Progress
                    value={(campaign.spent / campaign.budget) * 100}
                    className="h-1.5 bg-muted"
                  />
                </div>

                {/* Stats row */}
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {campaign.creators} creators
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {formatViews(campaign.views)} views
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {campaign.tags.map((tag) => (
                    <span key={tag} className="badge-pill bg-muted text-muted-foreground text-[10px]">
                      {tag}
                    </span>
                  ))}
                  <span className="badge-pill bg-muted text-muted-foreground text-[10px]">
                    Ends {campaign.endDate}
                  </span>
                </div>

                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="sm">
                  View Campaign
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CampaignShowcase;
