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
      className="glass rounded-xl p-3 sm:p-5"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${bgMap[color]} flex items-center justify-center`}>
          <div className={colorMap[color]}>{icon}</div>
        </div>
      </div>
      <div className={`text-lg sm:text-2xl font-bold font-mono ${colorMap[color]}`}>
        <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
      </div>
      <span className="text-[10px] sm:text-xs text-muted-foreground leading-tight">{label}</span>
      {change !== undefined && (
        <div className="mt-1.5 flex items-center gap-1">
          <span
            className={`text-[10px] font-medium ${
              change >= 0 ? "text-success" : "text-destructive"
            }`}
          >
            {change >= 0 ? "↑" : "↓"} {Math.abs(change)}%
          </span>
          {changeLabel && (
            <span className="text-[10px] text-muted-foreground">{changeLabel}</span>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default MetricCard;
