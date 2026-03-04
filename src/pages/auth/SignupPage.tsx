import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, Youtube, Building2, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

type Role = "creator" | "brand";

const SignupPage = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!role) return;
    setIsLoading(true);
    try {
      await signUp(email, password, fullName, role, role === "brand" ? companyName : undefined);
      toast.success("Account created! Check your email to verify.");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, hsl(24 100% 50% / 0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, hsl(280 60% 40% / 0.05) 0%, transparent 50%)",
        }}
      />

      <div className="relative z-10 w-full max-w-lg mx-4">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl text-foreground">
            Clip<span className="text-primary">Rupee</span>
          </span>
        </Link>

        <AnimatePresence mode="wait">
          {/* Step 1: Choose Role */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h1 className="font-display font-extrabold text-2xl text-foreground mb-2">
                  Join ClipRupee
                </h1>
                <p className="text-muted-foreground">How do you want to use the platform?</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setRole("creator"); setStep(2); }}
                  className={`glass-hover rounded-xl p-6 text-left transition-all ${
                    role === "creator" ? "border-primary" : ""
                  }`}
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <Youtube className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-foreground mb-1">I'm a Creator</h3>
                  <p className="text-xs text-muted-foreground">
                    Earn money from your YouTube & Instagram content
                  </p>
                </motion.button>

                <motion.button
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setRole("brand"); setStep(2); }}
                  className={`glass-hover rounded-xl p-6 text-left transition-all ${
                    role === "brand" ? "border-info" : ""
                  }`}
                >
                  <div className="w-12 h-12 rounded-lg bg-info/10 text-info flex items-center justify-center mb-4">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-foreground mb-1">I'm a Brand</h3>
                  <p className="text-xs text-muted-foreground">
                    Run performance campaigns with real creators
                  </p>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <div className="glass rounded-xl p-6 space-y-4">
                <h2 className="font-display font-bold text-xl text-foreground mb-4">
                  Create your {role === "creator" ? "Creator" : "Brand"} account
                </h2>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    className="bg-muted border-border"
                  />
                </div>

                {role === "brand" && (
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Your company name"
                      className="bg-muted border-border"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="bg-muted border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="bg-muted border-border"
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={isLoading || !fullName || !email || !password || (role === "brand" && !companyName)}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Log in
                </Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SignupPage;
