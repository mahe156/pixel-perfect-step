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

// Dashboard pages
import CreatorDashboard from "./pages/creator/CreatorDashboard";
import BrandDashboard from "./pages/brand/BrandDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

const queryClient = new QueryClient();

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
              <Route path="campaigns" element={<PlaceholderPage title="Browse Campaigns" />} />
              <Route path="submissions" element={<PlaceholderPage title="My Submissions" />} />
              <Route path="earnings" element={<PlaceholderPage title="Earnings" />} />
              <Route path="payouts" element={<PlaceholderPage title="Payouts" />} />
              <Route path="profile" element={<PlaceholderPage title="Profile" />} />
              <Route path="kyc" element={<PlaceholderPage title="KYC Verification" />} />
              <Route path="settings" element={<PlaceholderPage title="Settings" />} />
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
              <Route path="campaigns" element={<PlaceholderPage title="My Campaigns" />} />
              <Route path="campaigns/new" element={<PlaceholderPage title="Create Campaign" />} />
              <Route path="analytics" element={<PlaceholderPage title="Analytics" />} />
              <Route path="creators" element={<PlaceholderPage title="Creators" />} />
              <Route path="billing" element={<PlaceholderPage title="Billing" />} />
              <Route path="settings" element={<PlaceholderPage title="Settings" />} />
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
              <Route path="users" element={<PlaceholderPage title="User Management" />} />
              <Route path="campaigns" element={<PlaceholderPage title="All Campaigns" />} />
              <Route path="submissions" element={<PlaceholderPage title="Submission Review" />} />
              <Route path="payouts" element={<PlaceholderPage title="Payout Manager" />} />
              <Route path="fraud" element={<PlaceholderPage title="Fraud Flags" />} />
              <Route path="settings" element={<PlaceholderPage title="Platform Settings" />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Placeholder for pages not yet built
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="space-y-4">
    <h1 className="font-display font-extrabold text-2xl text-foreground">{title}</h1>
    <div className="glass rounded-xl p-12 text-center text-muted-foreground">
      This page will be built in the next part.
    </div>
  </div>
);

export default App;
