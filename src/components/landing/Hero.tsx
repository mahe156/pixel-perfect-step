import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown, Play, Users } from "lucide-react";
import AnimatedNumber from "@/components/shared/AnimatedNumber";
import { useNavigate } from "react-router-dom";

const PARTICLE_COUNT = 35;

const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.3 + 0.1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(24, 100%, 50%, ${p.alpha})`;
        ctx.fill();
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const brands = ["Mamaearth", "boAt", "Noise", "Sugar", "Lenskart", "Meesho"];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grain-texture">
      {/* Animated gradient mesh background */}
      <div
        className="absolute inset-0 animate-gradient-shift"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, hsl(24 100% 50% / 0.12) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, hsl(280 60% 40% / 0.08) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, hsl(240 20% 2%) 0%, hsl(240 20% 2%) 100%)",
          backgroundSize: "200% 200%",
        }}
      />

      {/* Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <div className="relative z-10 container mx-auto px-4 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 badge-pill border border-primary/30 bg-primary/10 text-primary mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Play className="w-3 h-3" />
            India's #1 Creator Marketing Platform
          </motion.div>

          {/* Headline */}
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.1] mb-4">
            India ka Creator Economy,
            <br />
            <span className="text-gradient">Ab Aapke Haath Mein</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Post. Submit. Earn. — Performance-based creator marketing powered by
            verified views. Brands pay per result, creators earn per view.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              onClick={() => navigate("/signup")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8 py-6 rounded-xl font-semibold animate-pulse-glow"
            >
              <Users className="w-5 h-5 mr-2" />
              Join as Creator
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/signup")}
              className="border-border text-foreground hover:bg-muted text-base px-8 py-6 rounded-xl font-semibold"
            >
              List a Campaign
            </Button>
          </div>

          {/* Live counter */}
          <motion.div
            className="inline-flex items-center gap-2 glass rounded-full px-6 py-3 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm text-muted-foreground">
              <AnimatedNumber
                value={247500}
                prefix="₹"
                className="text-success font-semibold"
              />{" "}
              paid to creators today
            </span>
          </motion.div>

          {/* Brand logos */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-8 opacity-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 0.8 }}
          >
            {brands.map((brand) => (
              <span
                key={brand}
                className="text-sm font-display font-semibold text-muted-foreground tracking-wider uppercase"
              >
                {brand}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="w-6 h-6 text-muted-foreground" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
