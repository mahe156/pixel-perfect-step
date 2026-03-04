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
      className="glass-hover rounded-xl p-5"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`${colorMap[color]} opacity-80`}>{icon}</div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className={`text-2xl font-bold ${colorMap[color]}`}>
        <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
      </div>
      {change !== undefined && (
        <div className="mt-2 flex items-center gap-1.5">
          <span
            className={`text-xs font-medium ${
              change >= 0 ? "text-success" : "text-destructive"
            }`}
          >
            {change >= 0 ? "↑" : "↓"} {Math.abs(change)}%
          </span>
          {changeLabel && (
            <span className="text-xs text-muted-foreground">{changeLabel}</span>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default MetricCard;
