
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Users, Building, Trophy, FileText, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';
import { apiService } from '@/services/api';

const Dashboard = () => {
  const { data: concoursData } = useQuery({
    queryKey: ['admin-concours'],
    queryFn: () => apiService.getConcours(),
  });

  const { data: candidatsData } = useQuery({
    queryKey: ['admin-candidats'],
    queryFn: () => apiService.getCandidats(),
  });

  const { data: etablissementsData } = useQuery({
    queryKey: ['admin-etablissements'],
    queryFn: () => apiService.getEtablissements(),
  });

  const { data: statisticsData } = useQuery({
    queryKey: ['admin-statistics'],
    queryFn: () => apiService.getStatistics(),
  });

  const concours = concoursData?.data || [];
  const candidats = candidatsData?.data || [];
  const etablissements = etablissementsData?.data || [];
  const stats = statisticsData?.data || {
    candidats: 0,
    concours: 0,
    etablissements: 0,
    participations: 0,
    paiements: 0
  };

  const concoursActifs = concours.filter(c => c.stacnc === '1').length;
  const candidatsActifs = candidats.filter(c => c.statut !== 'inactif').length;

  const dashboardStats = [
    {
      title: "Concours Actifs",
      value: concoursActifs,
      icon: Trophy,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      link: "/admin/concours"
    },
    {
      title: "Candidats",
      value: stats.candidats,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
      link: "/admin/candidats"
    },
    {
      title: "Établissements",
      value: stats.etablissements,
      icon: Building,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      link: "/admin/etablissements"
    },
    {
      title: "Participations",
      value: stats.participations,
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      link: "/admin/dossiers"
    },
    {
      title: "Sessions actives",
      value: candidatsActifs,
      icon: Calendar,
      color: "text-red-600",
      bgColor: "bg-red-100",
      link: "/admin/candidats"
    },
    {
      title: "Paiements",
      value: stats.paiements,
      icon: DollarSign,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      link: "/admin/paiements"
    }
  ];

  // Récupérer les 5 derniers candidats pour l'activité récente
  const candidatsRecents = candidats.slice(0, 5);

  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tableau de Bord</h1>
            <p className="text-muted-foreground">Vue d'ensemble de la plateforme GabConcours</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardStats.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <Button variant="ghost" size="sm" asChild className="mt-2 p-0 h-auto">
                    <Link to={stat.link} className="text-sm text-muted-foreground hover:text-foreground">
                      Voir détails →
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Candidats Récents</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {candidatsRecents.length > 0 ? candidatsRecents.map((candidat) => (
                    <div key={candidat.id} className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{candidat.prncan} {candidat.nomcan}</p>
                        <p className="text-xs text-muted-foreground">
                          {candidat.nupcan} - {new Date(candidat.created_at || Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">Aucun candidat récent</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button asChild>
                    <Link to="/admin/concours">Gérer concours</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/admin/etablissements">Gérer établissements</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/admin/dossiers">Valider dossiers</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/admin/candidats">Voir candidats</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/admin/paiements">Voir paiements</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/concours">Site public</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Système de Synchronisation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-800">
                    Synchronisation en temps réel active
                  </span>
                </div>
                <span className="text-xs text-green-600">
                  Dernière sync: {new Date().toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Les modifications apportées dans l'interface d'administration sont automatiquement 
                répercutées sur le site public en temps réel.
              </p>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
};

export default Dashboard;
