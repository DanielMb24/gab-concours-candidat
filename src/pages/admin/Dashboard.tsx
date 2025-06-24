
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, Settings, Eye, Plus } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';
import DashboardStats from '@/components/DashboardStats';
import RecentActivity from '@/components/RecentActivity';

const Dashboard = () => {
  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">
                Tableau de Bord
              </h1>
              <p className="text-muted-foreground text-lg">
                Vue d'ensemble de la plateforme GabConcours
              </p>
            </div>
            <div className="flex space-x-3">
              <Button asChild size="sm" variant="outline">
                <Link to="/concours">
                  <Eye className="h-4 w-4 mr-2" />
                  Site Public
                </Link>
              </Button>
              <Button asChild size="sm" className="gradient-bg text-white">
                <Link to="/admin/concours">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau Concours
                </Link>
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <DashboardStats />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <RecentActivity />

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-primary" />
                  <span>Actions Rapides</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button asChild variant="outline" className="h-16 flex-col">
                    <Link to="/admin/concours">
                      <Calendar className="h-6 w-6 mb-2" />
                      Gérer Concours
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-16 flex-col">
                    <Link to="/admin/candidats">
                      <Calendar className="h-6 w-6 mb-2" />
                      Voir Candidats
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-16 flex-col">
                    <Link to="/admin/dossiers">
                      <Calendar className="h-6 w-6 mb-2" />
                      Valider Dossiers
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-16 flex-col">
                    <Link to="/admin/paiements">
                      <Calendar className="h-6 w-6 mb-2" />
                      Gérer Paiements
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle>État du Système</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-800">
                    Système opérationnel - Synchronisation en temps réel active
                  </span>
                </div>
                <span className="text-xs text-green-600">
                  Dernière sync: {new Date().toLocaleTimeString('fr-FR')}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                Toutes les données sont synchronisées automatiquement entre l'interface d'administration 
                et le site public. Les modifications sont répercutées en temps réel.
              </p>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
};

export default Dashboard;
