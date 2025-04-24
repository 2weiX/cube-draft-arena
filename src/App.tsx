import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AppProvider } from "@/contexts/AppContext";
import { useDataRefresh } from "@/hooks/queries/useDataRefresh";

import Navbar from "@/components/layout/Navbar";
import Index from "./pages/Index";
import Players from "./pages/Players";
import Draft from "./pages/Draft";
import DraftDetail from "./pages/DraftDetail";
import Rankings from "./pages/Rankings";
import Matches from "./pages/Matches";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
  },
});

const AppContent = () => {
  useDataRefresh();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/players" element={<Players />} />
          <Route path="/draft" element={<Draft />} />
          <Route path="/draft/:id" element={<DraftDetail />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <AppProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
          <Toaster />
          <Sonner />
        </AppProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
