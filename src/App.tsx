
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/hooks/use-language";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import HotelImport from "./pages/admin/HotelImport";
import CustomerSupport from "./pages/customer/CustomerSupport";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Authentication */}
            <Route path="/login" element={<Login />} />
            
            {/* Customer-facing pages */}
            <Route path="/customer" element={<CustomerSupport />} />
            
            {/* Admin pages */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/import" element={<HotelImport />} />
            
            {/* Redirect root to customer by default */}
            <Route path="/" element={<Navigate to="/customer" replace />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
