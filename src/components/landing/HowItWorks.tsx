import { motion } from "framer-motion";
import { Link2, Search, IndianRupee, FileText, Wallet, BarChart3, Shield } from "lucide-react";

const creatorSteps = [
  {
    icon: <Link2 className="w-6 h-6" />,
    title: "Connect Your Channels",
    description: "Link your YouTube or Instagram account securely. Verify your identity with a simple bio code.",
  },
  {
    icon: <Search className="w-6 h-6" />,
    title: "Pick a Campaign",
    description: "Browse campaigns that match your niche. Filter by CPM rate, platform, and language.",
  },
  {
    icon: <IndianRupee className="w-6 h-6" />,
    title: "Earn Per View",
    description: "Submit your content link, and earn money for every 1,000 verified views. Payouts via UPI.",
  },
];

const brandSteps = [
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Create Your Brief",
    description: "Set your campaign goals, target audience, CPM rate, and content guidelines.",
  },
  {
    icon: <Wallet className="w-6 h-6" />,
    title: "Deposit Escrow",
    description: "Secure your budget in escrow. Funds are only released when views are verified.",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Views Verified",
    description: "Our system tracks views via official APIs. Real-time dashboard shows performance.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Pay for Results Only",
    description: "Only pay for verified views. Anti-fraud detection ensures authentic engagement.",
  },
];

const StepCard = ({ icon, title, description, index }: { icon: React.ReactNode; title: string; description: string; index: number }) => (
  <motion.div
    className="glass-hover rounded-xl p-6 relative"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.15 }}
  >
    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
      {icon}
    </div>
    <div className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center font-mono">
      {index + 1}
    </div>
    <h3 className="font-display font-bold text-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
  </motion.div>
);

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Creator flow */}
        <div id="creators" className="mb-24">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="badge-pill bg-primary/10 text-primary border border-primary/30 mb-4 inline-block">
              For Creators
            </span>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-foreground">
              Start Earning in 3 Simple Steps
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {creatorSteps.map((step, i) => (
              <StepCard key={step.title} {...step} index={i} />
            ))}
          </div>
        </div>

        {/* Brand flow */}
        <div id="brands">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="badge-pill bg-info/10 text-info border border-info/30 mb-4 inline-block">
              For Brands
            </span>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-foreground">
              Performance Marketing That Works
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {brandSteps.map((step, i) => (
              <StepCard key={step.title} {...step} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
