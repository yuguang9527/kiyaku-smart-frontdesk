
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/hooks/use-language";
import { ReservationProvider } from "@/hooks/use-reservation";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import HotelImport from "./pages/admin/HotelImport";
import CustomerSupport from "./pages/customer/CustomerSupport";
import TwilioSetup from "./pages/admin/TwilioSetup";
import ReservationList from "./pages/admin/ReservationList";

// QueryClientを定数ではなく関数内で生成するように修正
const App = () => {
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <ReservationProvider>
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
                <Route path="/admin/twilio" element={<TwilioSetup />} />
                <Route path="/admin/reservations" element={<ReservationList />} />
                
                {/* Redirect root to customer by default */}
                <Route path="/" element={<Navigate to="/customer" replace />} />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ReservationProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
