
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Users, Building, Trophy, FileText, Calendar, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { apiService } from '@/services/api';

const Dashboard = () => {
  const { data: concoursData } = useQuery({
    queryKey: ['admin-concours'],
    queryFn: () => apiService.getConcours(),
  });

  const stats = [
    {
      title: "Concours Actifs",
      value: concoursData?.data?.length || 0,
      icon: Trophy,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      link: "/admin/concours"
    },
    {
      title: "Candidats",
      value: "1,234", // À remplacer par une vraie API
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
      link: "/admin/candidats"
    },
    {
      title: "Établissements",
      value: "45", // À remplacer par une vraie API
      icon: Building,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      link: "/admin/etablissements"
    },
    {
      title: "Dossiers en attente",
      value: "89", // À remplacer par une vraie API
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      link: "/admin/dossiers"
    },
    {
      title: "Sessions actives",
      value: "156", // À remplacer par une vraie API
      icon: Calendar,
      color: "text-red-600",
      bgColor: "bg-red-100",
      link: "/admin/sessions"
    },
    {
      title: "Paiements validés",
      value: "2,340,000 FCFA", // À remplacer par une vraie API
      icon: DollarSign,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      link: "/admin/paiements"
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tableau de Bord</h1>
          <p className="text-muted-foreground">Vue d'ensemble de la plateforme GabConcours</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
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
              <CardTitle>Activité Récente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Nouveau concours créé</p>
                    <p className="text-xs text-muted-foreground">École Nationale d'Administration - il y a 2h</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">145 nouvelles candidatures</p>
                    <p className="text-xs text-muted-foreground">Concours ENS - il y a 4h</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Dossiers en attente de validation</p>
                    <p className="text-xs text-muted-foreground">89 dossiers - il y a 6h</p>
                  </div>
                </div>
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
                  <Link to="/admin/concours/nouveau">Créer un concours</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/admin/etablissements/nouveau">Ajouter établissement</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/admin/dossiers">Valider dossiers</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/admin/rapports">Générer rapport</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
