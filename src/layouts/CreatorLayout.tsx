import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import CreatorSidebar from "@/components/creator/CreatorSidebar";
import DashboardHeader from "@/components/shared/DashboardHeader";
import CreatorBottomNav from "@/components/creator/CreatorBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";

const CreatorLayout = () => {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="min-h-[100svh] flex w-full bg-background relative overflow-hidden">
        {/* Animated moving background orbs */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-primary/[0.04] blur-[120px] animate-float" />
          <div className="absolute bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-premium/[0.04] blur-[100px] animate-float" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-[40%] right-[20%] w-[30vw] h-[30vw] rounded-full bg-info/[0.03] blur-[80px] animate-float" style={{ animationDelay: '3s' }} />
        </div>

        {!isMobile && <CreatorSidebar />}
        <div className="flex-1 flex flex-col min-w-0 relative z-10">
          <DashboardHeader walletBalance={0} />
          <main className="flex-1 px-4 py-3 sm:p-6 overflow-auto pb-24 sm:pb-6">
            <Outlet />
          </main>
          {isMobile && <CreatorBottomNav />}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CreatorLayout;
