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
  color?: "primary" | "success" | "info" | "premium" | "warning";
}

const colorMap = {
  primary: "text-primary",
  success: "text-success",
  info: "text-info",
  premium: "text-premium",
  warning: "text-warning",
};

const bgMap = {
  primary: "bg-primary/10",
  success: "bg-success/10",
  info: "bg-info/10",
  premium: "bg-premium/10",
  warning: "bg-warning/10",
};

const glowMap = {
  primary: "shadow-[0_0_20px_hsl(24_100%_50%/0.08)]",
  success: "shadow-[0_0_20px_hsl(160_100%_42%/0.08)]",
  info: "shadow-[0_0_20px_hsl(216_100%_65%/0.08)]",
  premium: "shadow-[0_0_20px_hsl(260_100%_72%/0.08)]",
  warning: "shadow-[0_0_20px_hsl(43_100%_70%/0.08)]",
};

const borderGlowMap = {
  primary: "border-primary/15",
  success: "border-success/15",
  info: "border-info/15",
  premium: "border-premium/15",
  warning: "border-warning/15",
};

const MetricCard = ({
  icon,
  label,
  value,
  prefix,
  suffix,
  change,
  changeLabel,
  color = "primary",
}: MetricCardProps) => {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl p-3.5 sm:p-5 bg-card/80 backdrop-blur-xl border ${borderGlowMap[color]} ${glowMap[color]}`}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
    >
      {/* Subtle gradient accent */}
      <div className={`absolute top-0 right-0 w-20 h-20 rounded-full ${bgMap[color]} blur-2xl opacity-60 -translate-y-1/2 translate-x-1/2`} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2.5">
          <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl ${bgMap[color]} flex items-center justify-center`}>
            <div className={colorMap[color]}>{icon}</div>
          </div>
          {change !== undefined && (
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                change >= 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
              }`}
            >
              {change >= 0 ? "↑" : "↓"}{Math.abs(change)}%
            </span>
          )}
        </div>
        <div className={`text-xl sm:text-2xl font-bold font-mono ${colorMap[color]} leading-none`}>
          <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
        </div>
        <span className="text-[10px] sm:text-xs text-muted-foreground mt-1 block">{label}</span>
      </div>
    </motion.div>
  );
};

export default MetricCard;
