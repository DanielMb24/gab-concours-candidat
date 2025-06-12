
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Concours from "./pages/Concours";
import Candidature from "./pages/Candidature";
import Confirmation from "./pages/Confirmation";
import Documents from "./pages/Documents";
import Paiement from "./pages/Paiement";
import Succes from "./pages/Succes";
import Connexion from "./pages/Connexion";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminConcours from "./pages/admin/Concours";
import AdminCandidats from "./pages/admin/Candidats";
import AdminEtablissements from "./pages/admin/Etablissements";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/concours" element={<Concours />} />
          <Route path="/candidature/:concoursId" element={<Candidature />} />
          <Route path="/confirmation/:numeroCandidature" element={<Confirmation />} />
          <Route path="/documents/:candidatureId" element={<Documents />} />
          <Route path="/paiement/:candidatureId" element={<Paiement />} />
          <Route path="/succes/:candidatureId" element={<Succes />} />
          <Route path="/connexion" element={<Connexion />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/concours" element={<AdminConcours />} />
          <Route path="/admin/candidats" element={<AdminCandidats />} />
          <Route path="/admin/etablissements" element={<AdminEtablissements />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
