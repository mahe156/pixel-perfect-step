import {
  LayoutDashboard, Megaphone, BarChart3, Users, Wallet, Settings, Zap, PlusCircle
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, Link } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/brand/dashboard", icon: LayoutDashboard },
  { title: "My Campaigns", url: "/brand/campaigns", icon: Megaphone },
  { title: "New Campaign", url: "/brand/campaigns/new", icon: PlusCircle },
  { title: "Analytics", url: "/brand/analytics", icon: BarChart3 },
  { title: "Creators", url: "/brand/creators", icon: Users },
  { title: "Billing", url: "/brand/billing", icon: Wallet },
  { title: "Settings", url: "/brand/settings", icon: Settings },
];

const BrandSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

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
          <SidebarGroupLabel className="text-muted-foreground">Brand</SidebarGroupLabel>
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

export default BrandSidebar;
