import { LayoutDashboard, Megaphone, BarChart3, Users, Settings } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const items = [
  { title: "Home", url: "/brand/dashboard", icon: LayoutDashboard },
  { title: "Campaigns", url: "/brand/campaigns", icon: Megaphone },
  { title: "Analytics", url: "/brand/analytics", icon: BarChart3 },
  { title: "Creators", url: "/brand/creators", icon: Users },
  { title: "Settings", url: "/brand/settings", icon: Settings },
];

const BrandBottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50 safe-bottom bg-background/95 backdrop-blur-xl">
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto px-1">
        {items.map((item) => {
          const isActive = location.pathname === item.url || location.pathname.startsWith(item.url + "/");
          return (
            <NavLink
              key={item.url}
              to={item.url}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 py-1.5 transition-colors"
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-[10px] font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                {item.title}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BrandBottomNav;
