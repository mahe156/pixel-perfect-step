import {
  LayoutDashboard, Megaphone, FileText, IndianRupee, Wallet, UserCircle, Shield, Settings, Zap
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, Link } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/creator/dashboard", icon: LayoutDashboard },
  { title: "Campaigns", url: "/creator/campaigns", icon: Megaphone },
  { title: "Submissions", url: "/creator/submissions", icon: FileText },
  { title: "Earnings", url: "/creator/earnings", icon: IndianRupee },
  { title: "Payouts", url: "/creator/payouts", icon: Wallet },
  { title: "Profile", url: "/creator/profile", icon: UserCircle },
  { title: "KYC", url: "/creator/kyc", icon: Shield },
  { title: "Settings", url: "/creator/settings", icon: Settings },
];

const CreatorSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50 bg-sidebar">
      <div className="p-4 border-b border-border/50">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-display font-bold text-foreground">
              Clip<span className="text-primary">Rupee</span>
            </span>
          )}
        </Link>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">Creator</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-muted/50"
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default CreatorSidebar;
