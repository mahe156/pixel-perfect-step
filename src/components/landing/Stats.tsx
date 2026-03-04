import { motion } from "framer-motion";
import AnimatedNumber from "@/components/shared/AnimatedNumber";
import { Users, Building2, IndianRupee, Eye } from "lucide-react";

const stats = [
  { icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" />, value: 100000, suffix: "+", label: "Creators", color: "text-primary" },
  { icon: <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />, value: 500, suffix: "+", label: "Brands", color: "text-info" },
  { icon: <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5" />, value: 20000000, prefix: "₹", label: "Paid Out", color: "text-success" },
  { icon: <Eye className="w-4 h-4 sm:w-5 sm:h-5" />, value: 50000000, suffix: "+", label: "Views Tracked", color: "text-premium" },
];

const Stats = () => {
  return (
    <section className="relative py-10 sm:py-16 border-y border-border/50 bg-card/40">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-4 sm:gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center py-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className={`flex justify-center mb-1.5 sm:mb-2 ${stat.color}`}>
                {stat.icon}
              </div>
              <div className={`text-lg sm:text-2xl md:text-3xl font-bold ${stat.color}`}>
                <AnimatedNumber
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
