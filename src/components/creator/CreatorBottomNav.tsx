import { LayoutDashboard, Megaphone, FileText, IndianRupee, UserCircle } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const items = [
  { title: "Home", url: "/creator/dashboard", icon: LayoutDashboard },
  { title: "Campaigns", url: "/creator/campaigns", icon: Megaphone },
  { title: "Submit", url: "/creator/submissions", icon: FileText },
  { title: "Earnings", url: "/creator/earnings", icon: IndianRupee },
  { title: "Profile", url: "/creator/profile", icon: UserCircle },
];

const CreatorBottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      {/* Frosted glass background with top glow */}
      <div className="absolute inset-0 bg-background/90 backdrop-blur-3xl border-t border-border/15" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="relative flex items-center justify-around h-[68px] max-w-lg mx-auto px-2">
        {items.map((item) => {
          const isActive = location.pathname === item.url || location.pathname.startsWith(item.url + "/");
          return (
            <NavLink
              key={item.url}
              to={item.url}
              className="relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full active:scale-90 transition-transform duration-150"
            >
              {isActive && (
                <>
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute -top-px w-10 h-[2.5px] rounded-full bg-primary shadow-[0_0_8px_hsl(24_100%_50%/0.5)]"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                  <motion.div
                    layoutId="bottomNavGlow"
                    className="absolute top-1 w-10 h-6 rounded-full bg-primary/10 blur-md"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                </>
              )}
              <div className={`relative p-1.5 rounded-xl transition-all duration-200 ${isActive ? "bg-primary/10" : ""}`}>
                <item.icon
                  className={`w-[20px] h-[20px] transition-colors duration-200 ${
                    isActive ? "text-primary" : "text-muted-foreground/50"
                  }`}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
              </div>
              <span
                className={`text-[9px] leading-none transition-all duration-200 ${
                  isActive ? "text-primary font-bold" : "text-muted-foreground/50 font-medium"
                }`}
              >
                {item.title}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default CreatorBottomNav;
