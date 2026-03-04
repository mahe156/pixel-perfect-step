import {
  LayoutDashboard, Users, Megaphone, FileText, Wallet, AlertTriangle, Settings, Zap
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Link } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Campaigns", url: "/admin/campaigns", icon: Megaphone },
  { title: "Submissions", url: "/admin/submissions", icon: FileText },
  { title: "Payouts", url: "/admin/payouts", icon: Wallet },
  { title: "Fraud Flags", url: "/admin/fraud", icon: AlertTriangle },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

const AdminSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50 bg-sidebar">
      <div className="p-4 border-b border-border/50">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-destructive flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-destructive-foreground" />
          </div>
          {!collapsed && (
            <span className="font-display font-bold text-foreground">
              Admin<span className="text-destructive">Panel</span>
            </span>
          )}
        </Link>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-muted/50"
                      activeClassName="bg-destructive/10 text-destructive font-medium"
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

export default AdminSidebar;
