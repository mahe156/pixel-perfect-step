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
      <div className="min-h-[100svh] flex w-full bg-background relative">


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
