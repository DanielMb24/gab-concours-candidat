
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

// Pages publiques
import Index from '@/pages/Index';
import Concours from '@/pages/Concours';
import Candidature from '@/pages/Candidature';
import Confirmation from '@/pages/Confirmation';
import Documents from '@/pages/Documents';
import Paiement from '@/pages/Paiement';
import Succes from '@/pages/Succes';
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
      staleTime: 5 * 60 * 1000, // 5 minutes
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
            <Route path="/candidature/:concoursId" element={<Candidature />} />
            <Route path="/confirmation/:numeroCandidature" element={<Confirmation />} />
            <Route path="/connexion" element={<Connexion />} />

            {/* Routes protégées par NUPCAN */}
            <Route 
              path="/statut/:nupcan" 
              element={
                <ProtectedRoute requiresNupcan routeType="statut">
                  <StatutCandidature />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/documents/:nupcan" 
              element={
                <ProtectedRoute requiresNupcan routeType="documents">
                  <Documents />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/paiement/:nupcan" 
              element={
                <ProtectedRoute requiresNupcan routeType="paiement">
                  <Paiement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/succes/:nupcan" 
              element={
                <ProtectedRoute requiresNupcan routeType="succes">
                  <Succes />
                </ProtectedRoute>
              } 
            />

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

            {/* Route 404 - doit être en dernier */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </AdminAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
