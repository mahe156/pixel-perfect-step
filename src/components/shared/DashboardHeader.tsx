import { LogOut, Wallet } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { formatINR } from "@/lib/format";
import NotificationBell from "@/components/shared/NotificationBell";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardHeaderProps {
  walletBalance?: number;
}

const DashboardHeader = ({ walletBalance }: DashboardHeaderProps) => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="h-12 flex items-center justify-between border-b border-border/30 px-4 bg-background/95 backdrop-blur-xl sticky top-0 z-30">
      {!isMobile ? (
        <SidebarTrigger className="text-muted-foreground" />
      ) : (
        <span className="font-display font-bold text-base text-foreground tracking-tight">
          Clip<span className="text-primary">Rupee</span>
        </span>
      )}

      <div className="flex items-center gap-2">
        {walletBalance !== undefined && (
          <div className="flex items-center gap-1.5 bg-success/10 border border-success/20 rounded-full px-2.5 py-1">
            <Wallet className="w-3 h-3 text-success" />
            <span className="text-[11px] font-mono font-semibold text-success">
              {formatINR(walletBalance)}
            </span>
          </div>
        )}

        <NotificationBell />

        <div className="flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[11px] font-bold">
            {profile?.full_name?.charAt(0) || "U"}
          </div>
          {!isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-muted-foreground hover:text-foreground h-7 w-7 p-0"
            >
              <LogOut className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
