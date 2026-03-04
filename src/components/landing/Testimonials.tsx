import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    niche: "Beauty & Skincare",
    avatar: "PS",
    earned: "₹45,000",
    quote: "ClipRupee changed the game for me. I earn consistently from my Instagram Reels now.",
    followers: "125K",
    platform: "Instagram",
  },
  {
    name: "Rahul Verma",
    niche: "Tech Reviews",
    avatar: "RV",
    earned: "₹1,20,000",
    quote: "The transparency is unmatched. I can see exactly how many views converted to earnings.",
    followers: "450K",
    platform: "YouTube",
  },
  {
    name: "Ananya Patel",
    niche: "Food & Travel",
    avatar: "AP",
    earned: "₹68,000",
    quote: "Finally a platform that pays Indian creators fairly. UPI payouts are super fast!",
    followers: "89K",
    platform: "YouTube",
  },
  {
    name: "Vikram Singh",
    niche: "Gaming",
    avatar: "VS",
    earned: "₹92,000",
    quote: "I was skeptical at first, but the escrow system gave me confidence. Never missed a payment.",
    followers: "320K",
    platform: "YouTube",
  },
  {
    name: "Sneha Reddy",
    niche: "Fashion",
    avatar: "SR",
    earned: "₹55,000",
    quote: "Love how easy it is to browse campaigns and submit links. The earnings calculator was spot on.",
    followers: "200K",
    platform: "Instagram",
  },
  {
    name: "Arjun Mehta",
    niche: "Finance",
    avatar: "AM",
    earned: "₹1,50,000",
    quote: "As a finance creator, I appreciate the TDS compliance and proper documentation.",
    followers: "680K",
    platform: "YouTube",
  },
];

const Testimonials = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-foreground mb-3">
            Trusted by India's Top Creators
          </h2>
        </motion.div>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto pb-4 md:pb-0 snap-x snap-mandatory md:snap-none">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="glass rounded-xl p-6 min-w-[300px] md:min-w-0 snap-start"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 text-warning fill-warning" />
                ))}
              </div>

              <p className="text-sm text-foreground/90 mb-4 italic leading-relaxed">
                "{t.quote}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.niche} · {t.followers} · {t.platform}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-border/50">
                <span className="text-xs text-muted-foreground">Earned </span>
                <span className="text-sm font-bold text-success font-mono">{t.earned}</span>
                <span className="text-xs text-muted-foreground"> this month</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
