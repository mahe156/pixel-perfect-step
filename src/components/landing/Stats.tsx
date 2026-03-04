import { motion } from "framer-motion";
import AnimatedNumber from "@/components/shared/AnimatedNumber";
import { Users, Building2, IndianRupee, Eye } from "lucide-react";

const stats = [
  { icon: <Users className="w-5 h-5" />, value: 100000, suffix: "+", label: "Creators", color: "text-primary" },
  { icon: <Building2 className="w-5 h-5" />, value: 500, suffix: "+", label: "Brands", color: "text-info" },
  { icon: <IndianRupee className="w-5 h-5" />, value: 20000000, prefix: "₹", label: "Paid Out", color: "text-success" },
  { icon: <Eye className="w-5 h-5" />, value: 50000000, suffix: "+", label: "Views Tracked", color: "text-premium" },
];

const Stats = () => {
  return (
    <section className="relative py-16 border-y border-border/50 bg-card/40">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className={`flex justify-center mb-2 ${stat.color}`}>
                {stat.icon}
              </div>
              <div className={`text-2xl md:text-3xl font-bold ${stat.color}`}>
                <AnimatedNumber
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
