import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import BrandSidebar from "@/components/brand/BrandSidebar";
import DashboardHeader from "@/components/shared/DashboardHeader";

const BrandLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <BrandSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader walletBalance={0} />
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default BrandLayout;
