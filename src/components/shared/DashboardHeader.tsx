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
    <header className="h-12 sm:h-14 flex items-center justify-between border-b border-border/50 px-3 sm:px-4 bg-background/80 backdrop-blur-md">
      {!isMobile ? (
        <SidebarTrigger className="text-muted-foreground" />
      ) : (
        <span className="font-display font-bold text-sm text-foreground">
          Clip<span className="text-primary">Rupee</span>
        </span>
      )}

      <div className="flex items-center gap-2 sm:gap-4">
        {walletBalance !== undefined && (
          <div className="flex items-center gap-1 sm:gap-1.5 glass rounded-lg px-2 sm:px-3 py-1 sm:py-1.5">
            <Wallet className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-success" />
            <span className="text-xs sm:text-sm font-mono font-medium text-success">
              {formatINR(walletBalance)}
            </span>
          </div>
        )}

        <NotificationBell />

        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] sm:text-xs font-bold">
            {profile?.full_name?.charAt(0) || "U"}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-foreground h-7 w-7 sm:h-8 sm:w-8 p-0"
          >
            <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
