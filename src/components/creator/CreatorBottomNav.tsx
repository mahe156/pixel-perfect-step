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
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom bg-background border-t border-foreground/10">
      <div className="relative flex items-center justify-around h-[64px] max-w-lg mx-auto px-2">
        {items.map((item) => {
          const isActive = location.pathname === item.url || location.pathname.startsWith(item.url + "/");
          return (
            <NavLink
              key={item.url}
              to={item.url}
              className="relative flex flex-col items-center justify-center gap-1 flex-1 h-full active:scale-95 transition-transform duration-150"
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute top-0 w-8 h-px bg-foreground"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <item.icon
                className={`w-[20px] h-[20px] transition-colors duration-200 ${
                  isActive ? "text-foreground" : "text-foreground/40"
                }`}
                strokeWidth={isActive ? 1.75 : 1.5}
              />
              <span
                className={`text-[9px] leading-none uppercase tracking-wider transition-all duration-200 ${
                  isActive ? "text-foreground font-semibold" : "text-foreground/40 font-medium"
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
