import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import BrandSidebar from "@/components/brand/BrandSidebar";
import DashboardHeader from "@/components/shared/DashboardHeader";
import BrandBottomNav from "@/components/brand/BrandBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";

const BrandLayout = () => {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="min-h-[100svh] flex w-full bg-background">
        {!isMobile && <BrandSidebar />}
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader walletBalance={0} />
          <main className="flex-1 p-3 sm:p-6 overflow-auto pb-20 sm:pb-6">
            <Outlet />
          </main>
          {isMobile && <BrandBottomNav />}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default BrandLayout;
