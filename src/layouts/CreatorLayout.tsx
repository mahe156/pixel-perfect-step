import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import CreatorSidebar from "@/components/creator/CreatorSidebar";
import DashboardHeader from "@/components/shared/DashboardHeader";

const CreatorLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <CreatorSidebar />
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

export default CreatorLayout;
