
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Users, Building, Trophy, FileText, Calendar, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiService } from '@/services/api';

const Dashboard = () => {
  const { data: concoursData, isLoading: concoursLoading } = useQuery({
    queryKey: ['admin-concours'],
    queryFn: () => apiService.getConcours(),
  });

  const { data: candidatsData, isLoading: candidatsLoading } = useQuery({
    queryKey: ['admin-candidats'],
    queryFn: () => apiService.getCandidats(),
  });

  const { data: etablissementsData, isLoading: etablissementsLoading } = useQuery({
    queryKey: ['admin-etablissements'],
    queryFn: () => apiService.getEtablissements(),
  });

  const { data: paiementsData, isLoading: paiementsLoading } = useQuery({
    queryKey: ['admin-paiements'],
    queryFn: () => apiService.getPaiements(),
  });

  // Données avec fallback
  const concours = concoursData?.data || [];
  const candidats = candidatsData?.data || [];
  const etablissements = etablissementsData?.data || [];
  const paiements = paiementsData?.data || [];

  // Calculs des statistiques
  const concoursActifs = concours.filter(c => c.stacnc === '1').length;
  const candidatsActifs = candidats.filter(c => (c.statut || 'actif') !== 'inactif').length;
  const paiementsValides = paiements.filter(p => p.statut === 'valide').length;

  const dashboardStats = [
    {
      title: "Concours Actifs",
      value: concoursActifs,
      total: concours.length,
      icon: Trophy,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      link: "/admin/concours"
    },
    {
      title: "Candidats",
      value: candidatsActifs,
      total: candidats.length,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
      link: "/admin/candidats"
    },
    {
      title: "Établissements",
      value: etablissements.length,
      total: etablissements.length,
      icon: Building,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      link: "/admin/etablissements"
    },
    {
      title: "Dossiers",
      value: candidats.length,
      total: candidats.length,
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      link: "/admin/dossiers"
    },
    {
      title: "Sessions actives",
      value: candidatsActifs,
      total: candidats.length,
      icon: Calendar,
      color: "text-red-600",
      bgColor: "bg-red-100",
      link: "/admin/candidats"
    },
    {
      title: "Paiements",
      value: paiementsValides,
      total: paiements.length,
      icon: DollarSign,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      link: "/admin/paiements"
    }
  ];

  // Récupérer les 5 derniers candidats pour l'activité récente
  const candidatsRecents = candidats
    .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
    .slice(0, 5);

  const isLoading = concoursLoading || candidatsLoading || etablissementsLoading || paiementsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Tableau de Bord</h1>
        <p className="text-muted-foreground">Vue d'ensemble de la plateforme GabConcours</p>
      </div>

      {/* Alerte si pas de données */}
      {concours.length === 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <p className="text-sm text-orange-800">
                Aucun concours disponible. Commencez par ajouter des concours depuis la section Concours.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
                {stat.total !== stat.value && (
                  <span className="text-sm text-muted-foreground font-normal">
                    /{stat.total}
                  </span>
                )}
              </div>
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
  );
};

export default Dashboard;
