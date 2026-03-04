import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { formatIndianNumber } from "@/lib/format";

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  format?: "indian" | "default";
  className?: string;
}

const AnimatedNumber = ({
  value,
  prefix = "",
  suffix = "",
  duration = 1500,
  format = "indian",
  className = "",
}: AnimatedNumberProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(eased * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  const formatted =
    format === "indian"
      ? formatIndianNumber(displayValue)
      : displayValue.toLocaleString();

  return (
    <motion.span ref={ref} className={`font-mono ${className}`}>
      {prefix}
      {formatted}
      {suffix}
    </motion.span>
  );
};

export default AnimatedNumber;
