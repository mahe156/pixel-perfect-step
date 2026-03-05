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
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/30 safe-bottom bg-background/98 backdrop-blur-2xl">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {items.map((item) => {
          const isActive = location.pathname === item.url || location.pathname.startsWith(item.url + "/");
          return (
            <NavLink
              key={item.url}
              to={item.url}
              className="relative flex flex-col items-center justify-center gap-1 flex-1 h-full active:scale-90 transition-transform duration-150"
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -top-[1px] w-8 h-[3px] rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <item.icon
                className={`w-[22px] h-[22px] transition-colors duration-200 ${
                  isActive ? "text-primary" : "text-muted-foreground/60"
                }`}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <span
                className={`text-[10px] leading-none transition-colors duration-200 ${
                  isActive ? "text-primary font-semibold" : "text-muted-foreground/60 font-medium"
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
