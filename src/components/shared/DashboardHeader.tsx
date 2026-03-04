import { Bell, LogOut, Wallet } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { formatINR } from "@/lib/format";

interface DashboardHeaderProps {
  walletBalance?: number;
}

const DashboardHeader = ({ walletBalance }: DashboardHeaderProps) => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="h-14 flex items-center justify-between border-b border-border/50 px-4 bg-background/80 backdrop-blur-md">
      <SidebarTrigger className="text-muted-foreground" />

      <div className="flex items-center gap-4">
        {walletBalance !== undefined && (
          <div className="flex items-center gap-1.5 glass rounded-lg px-3 py-1.5">
            <Wallet className="w-3.5 h-3.5 text-success" />
            <span className="text-sm font-mono font-medium text-success">
              {formatINR(walletBalance)}
            </span>
          </div>
        )}

        <button className="relative text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-[10px] font-bold text-primary-foreground flex items-center justify-center">
            3
          </span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
            {profile?.full_name?.charAt(0) || "U"}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
