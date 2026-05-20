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
    <header className="h-14 flex items-center justify-between border-b border-foreground/10 px-5 bg-background sticky top-0 z-30">
      {!isMobile ? (
        <SidebarTrigger className="text-foreground/60" />
      ) : (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-foreground flex items-center justify-center">
            <span className="text-background font-semibold text-xs">C</span>
          </div>
          <span className="font-body font-semibold text-sm text-foreground tracking-tight">
            ClipRupee
          </span>
        </div>
      )}

      <div className="flex items-center gap-3">
        {walletBalance !== undefined && (
          <div className="flex items-center gap-1.5 border border-foreground/15 px-3 py-1">
            <Wallet className="w-3.5 h-3.5 text-foreground/60" />
            <span className="text-[11px] font-mono font-medium text-foreground">
              {formatINR(walletBalance)}
            </span>
          </div>
        )}

        <NotificationBell />

        <div className="flex items-center gap-1.5">
          <div className="w-8 h-8 rounded-full border border-foreground text-foreground flex items-center justify-center text-xs font-medium">
            {profile?.full_name?.charAt(0) || "U"}
          </div>
          {!isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-foreground/60 hover:text-foreground h-7 w-7 p-0"
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
