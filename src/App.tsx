import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";

// Layouts
import CreatorLayout from "./layouts/CreatorLayout";
import BrandLayout from "./layouts/BrandLayout";
import AdminLayout from "./layouts/AdminLayout";

// Creator pages
import CreatorDashboard from "./pages/creator/CreatorDashboard";
import CreatorCampaigns from "./pages/creator/CreatorCampaigns";
import CampaignDetail from "./pages/creator/CampaignDetail";
import CreatorSubmissions from "./pages/creator/CreatorSubmissions";
import CreatorEarnings from "./pages/creator/CreatorEarnings";
import CreatorPayouts from "./pages/creator/CreatorPayouts";
import CreatorProfile from "./pages/creator/CreatorProfile";
import CreatorKYC from "./pages/creator/CreatorKYC";
import CreatorSettings from "./pages/creator/CreatorSettings";

// Brand pages
import BrandDashboard from "./pages/brand/BrandDashboard";
import BrandCampaigns from "./pages/brand/BrandCampaigns";
import BrandCampaignNew from "./pages/brand/BrandCampaignNew";
import BrandCampaignDetail from "./pages/brand/BrandCampaignDetail";
import BrandAnalytics from "./pages/brand/BrandAnalytics";
import BrandCreators from "./pages/brand/BrandCreators";
import BrandBilling from "./pages/brand/BrandBilling";
import BrandSettings from "./pages/brand/BrandSettings";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCampaigns from "./pages/admin/AdminCampaigns";
import AdminSubmissions from "./pages/admin/AdminSubmissions";
import AdminPayouts from "./pages/admin/AdminPayouts";
import AdminFraud from "./pages/admin/AdminFraud";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="space-y-4">
    <h1 className="font-display font-extrabold text-2xl text-foreground">{title}</h1>
    <div className="glass rounded-xl p-12 text-center text-muted-foreground">
      This page will be built in the next part.
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Creator routes */}
            <Route
              path="/creator"
              element={
                <ProtectedRoute allowedRoles={["creator"]}>
                  <CreatorLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<CreatorDashboard />} />
              <Route path="campaigns" element={<CreatorCampaigns />} />
              <Route path="campaigns/:id" element={<CampaignDetail />} />
              <Route path="submissions" element={<CreatorSubmissions />} />
              <Route path="earnings" element={<CreatorEarnings />} />
              <Route path="payouts" element={<CreatorPayouts />} />
              <Route path="profile" element={<CreatorProfile />} />
              <Route path="kyc" element={<CreatorKYC />} />
              <Route path="settings" element={<CreatorSettings />} />
            </Route>

            {/* Brand routes */}
            <Route
              path="/brand"
              element={
                <ProtectedRoute allowedRoles={["brand"]}>
                  <BrandLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<BrandDashboard />} />
              <Route path="campaigns" element={<BrandCampaigns />} />
              <Route path="campaigns/new" element={<BrandCampaignNew />} />
              <Route path="campaigns/:id" element={<BrandCampaignDetail />} />
              <Route path="analytics" element={<BrandAnalytics />} />
              <Route path="creators" element={<BrandCreators />} />
              <Route path="billing" element={<BrandBilling />} />
              <Route path="settings" element={<BrandSettings />} />
            </Route>

            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="campaigns" element={<AdminCampaigns />} />
              <Route path="submissions" element={<AdminSubmissions />} />
              <Route path="payouts" element={<AdminPayouts />} />
              <Route path="fraud" element={<AdminFraud />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
