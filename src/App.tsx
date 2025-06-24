
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';

// Pages publiques
import Index from '@/pages/Index';
import Concours from '@/pages/Concours';
import Candidature from '@/pages/Candidature';
import Confirmation from '@/pages/Confirmation';
import Documents from '@/pages/Documents';
import DocumentsContinue from '@/pages/DocumentsContinue';
import Paiement from '@/pages/Paiement';
import PaiementContinue from '@/pages/PaiementContinue';
import Succes from '@/pages/Succes';
import SuccesContinue from '@/pages/SuccesContinue';
import Connexion from '@/pages/Connexion';
import NotFound from '@/pages/NotFound';
import StatutCandidature from '@/pages/StatutCandidature';

// Pages admin
import AdminLayout from '@/components/admin/AdminLayout';
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';
import AdminLogin from '@/pages/admin/Login';
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminConcours from '@/pages/admin/Concours';
import AdminCandidats from '@/pages/admin/Candidats';
import AdminEtablissements from '@/pages/admin/Etablissements';
import AdminDossiers from '@/pages/admin/Dossiers';
import AdminPaiements from '@/pages/admin/Paiements';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
      <QueryClientProvider client={queryClient}>
        <AdminAuthProvider>
          <Router>
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<Index />} />
              <Route path="/concours" element={<Concours />} />
              
              {/* Routes pour nouvelles candidatures (avec candidatureId) */}
              <Route path="/candidature/:concoursId" element={<Candidature />} />
              <Route path="/confirmation/:numeroCandidature" element={<Confirmation />} />
              <Route path="/documents/:candidatureId" element={<Documents />} />
              <Route path="/paiement/:candidatureId" element={<Paiement />} />
              <Route path="/succes/:candidatureId" element={<Succes />} />
              
              {/* Routes pour continuer candidatures existantes (avec nupcan) */}
              <Route path="/documents/continue/:nupcan" element={<DocumentsContinue />} />
              <Route path="/paiement/continue/:nupcan" element={<PaiementContinue />} />
              <Route path="/succes/continue/:nupcan" element={<SuccesContinue />} />
              
              {/* Routes pour statut et connexion */}
              <Route path="/statut/:nupcan" element={<StatutCandidature />} />
              <Route path="/connexion" element={<Connexion />} />

              {/* Routes admin */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                  path="/admin"
                  element={
                    <AdminProtectedRoute>
                      <AdminLayout />
                    </AdminProtectedRoute>
                  }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="concours" element={<AdminConcours />} />
                <Route path="candidats" element={<AdminCandidats />} />
                <Route path="etablissements" element={<AdminEtablissements />} />
                <Route path="dossiers" element={<AdminDossiers />} />
                <Route path="paiements" element={<AdminPaiements />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </Router>
        </AdminAuthProvider>
      </QueryClientProvider>
  );
}

export default App;
