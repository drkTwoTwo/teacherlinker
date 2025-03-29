
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import MainLayout from "@/components/Layout/MainLayout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import AttendanceMarking from "@/pages/AttendanceMarking";
import AttendanceReports from "@/pages/AttendanceReports";
import NcDcList from "@/pages/NcDcList";
import PreviousSemesterReports from "@/pages/PreviousSemesterReports";
import ExamSeatRandomization from "@/pages/ExamSeatRandomization";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/attendance-marking" element={<AttendanceMarking />} />
              <Route path="/attendance-reports" element={<AttendanceReports />} />
              <Route path="/nc-dc-list" element={<NcDcList />} />
              <Route path="/previous-reports" element={<PreviousSemesterReports />} />
              <Route path="/exam-seating" element={<ExamSeatRandomization />} />
            </Route>
            
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
