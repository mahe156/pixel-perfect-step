import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

const AuthRedirect = () => {
  const { session, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session || !profile) return null;

  const dashboardMap = {
    creator: "/creator/dashboard",
    brand: "/brand/dashboard",
    admin: "/admin/dashboard",
  };

  return <Navigate to={dashboardMap[profile.role]} replace />;
};

export default AuthRedirect;
