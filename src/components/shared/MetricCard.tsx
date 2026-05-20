import { motion } from "framer-motion";
import AnimatedNumber from "./AnimatedNumber";
import { ReactNode } from "react";

interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  change?: number;
  changeLabel?: string;
  // Kept for API compatibility — visually ignored in the editorial monochrome system.
  color?: "primary" | "success" | "info" | "premium" | "warning";
}

const MetricCard = ({
  icon,
  label,
  value,
  prefix,
  suffix,
  change,
}: MetricCardProps) => {
  return (
    <motion.div
      className="relative bg-card border border-foreground/10 p-5 flex items-center justify-between"
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.15 }}
    >
      <div className="space-y-1.5">
        <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-foreground/50">
          {label}
        </p>
        <div className="text-3xl sm:text-4xl font-display italic leading-none text-foreground">
          <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
        </div>
        {change !== undefined && (
          <span className="text-[10px] font-semibold uppercase tracking-widest text-foreground/60">
            {change >= 0 ? "↑" : "↓"} {Math.abs(change)}%
          </span>
        )}
      </div>
      <div className="text-foreground/40">{icon}</div>
    </motion.div>
  );
};

export default MetricCard;
