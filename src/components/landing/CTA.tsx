import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div
        className="absolute inset-0 animate-gradient-shift"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, hsl(24 100% 50% / 0.1) 0%, transparent 60%)",
          backgroundSize: "200% 200%",
        }}
      />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display font-extrabold text-3xl md:text-5xl text-foreground mb-4">
            Ready to Start <span className="text-gradient">Earning?</span>
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Join thousands of Indian creators who are already earning from their content.
            No minimum followers. No hidden fees.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8 py-6 rounded-xl font-semibold"
            >
              Join as Creator
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border text-foreground hover:bg-muted text-base px-8 py-6 rounded-xl font-semibold"
            >
              I'm a Brand
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
