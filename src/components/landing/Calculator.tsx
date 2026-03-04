import { useState } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { formatINR, formatIndianNumber } from "@/lib/format";

const Calculator = () => {
  const [views, setViews] = useState([500000]);
  const [platform, setPlatform] = useState<"youtube" | "instagram">("youtube");

  const avgCPM = platform === "youtube" ? 60 : 40;
  const monthlyEarnings = (views[0] / 1000) * avgCPM;

  return (
    <section id="calculator" className="py-16 sm:py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-foreground mb-2 sm:mb-3">
            Earnings Calculator
          </h2>
          <p className="text-sm text-muted-foreground">See how much you could earn with your views</p>
        </motion.div>

        <motion.div
          className="glass rounded-2xl p-5 sm:p-8 gradient-border"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Platform toggle */}
          <div className="flex justify-center gap-2 mb-6 sm:mb-8">
            {(["youtube", "instagram"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={`px-5 sm:px-6 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all active:scale-95 ${
                  platform === p
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {p === "youtube" ? "YouTube" : "Instagram"}
              </button>
            ))}
          </div>

          {/* Views slider */}
          <div className="mb-6 sm:mb-8">
            <div className="flex justify-between items-baseline mb-3 sm:mb-4">
              <span className="text-xs sm:text-sm text-muted-foreground">Monthly Views</span>
              <span className="text-lg sm:text-xl font-bold font-mono text-foreground">
                {formatIndianNumber(views[0])}
              </span>
            </div>
            <Slider
              value={views}
              onValueChange={setViews}
              min={10000}
              max={10000000}
              step={10000}
              className="mb-2"
            />
            <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground">
              <span>10K</span>
              <span>1 Cr</span>
            </div>
          </div>

          {/* Result */}
          <div className="text-center p-5 sm:p-6 rounded-xl bg-muted/50">
            <p className="text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2">Estimated Monthly Earnings</p>
            <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-success font-mono">
              {formatINR(monthlyEarnings)}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1.5 sm:mt-2">
              Based on avg CPM of ₹{avgCPM} for {platform === "youtube" ? "YouTube" : "Instagram"}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Calculator;
