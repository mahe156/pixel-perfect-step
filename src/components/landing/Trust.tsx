import { motion } from "framer-motion";
import { Shield, Eye, Zap, FileCheck, Globe, Ban } from "lucide-react";

const trustPoints = [
  { icon: <Shield className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Escrow Payments", desc: "Brand funds held securely until views verified" },
  { icon: <Eye className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Verified Views", desc: "Views tracked via official platform APIs" },
  { icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Instant UPI Payouts", desc: "Get paid directly to your UPI in minutes" },
  { icon: <FileCheck className="w-4 h-4 sm:w-5 sm:h-5" />, title: "TDS Compliant", desc: "Automatic TDS deduction with Form 16A" },
  { icon: <Globe className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Official APIs Only", desc: "No shady third-party data sources" },
  { icon: <Ban className="w-4 h-4 sm:w-5 sm:h-5" />, title: "No Fake Views", desc: "AI-powered fraud detection system" },
];

const Trust = () => {
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
            Why ClipRupee is Safe
          </h2>
          <p className="text-sm text-muted-foreground">Built for trust, designed for scale</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 max-w-4xl mx-auto">
          {trustPoints.map((point, i) => (
            <motion.div
              key={point.title}
              className="glass rounded-xl p-4 sm:p-5 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-success/10 text-success flex items-center justify-center mx-auto mb-2 sm:mb-3">
                {point.icon}
              </div>
              <h3 className="font-display font-bold text-xs sm:text-sm text-foreground mb-0.5 sm:mb-1">{point.title}</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">{point.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Trust;
