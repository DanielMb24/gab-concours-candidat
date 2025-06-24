
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Settings, 
  Eye, 
  Plus, 
  Users, 
  Trophy, 
  Building, 
  FileText,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useRealtimeData } from '@/hooks/useRealtimeData';

const Dashboard = () => {
  const { statistics, concours, candidats, paiements, isLoading } = useRealtimeData();

  // Métriques calculées
  const metriques = {
    candidatsNouveaux: candidats.filter(c => {
      const dateCreation = new Date(c.created_at);
      const maintenant = new Date();
      const diffJours = (maintenant.getTime() - dateCreation.getTime()) / (1000 * 3600 * 24);
      return diffJours <= 7;
    }).length,
    concoursActifs: concours.filter(c => c.stacnc === '1').length,
    paiementsEnAttente: paiements.filter(p => p.statut === 'en_attente').length,
    tauxCompletion: candidats.length > 0 ? Math.round((paiements.length / candidats.length) * 100) : 0
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
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
            <Link to="/">
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

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Candidats
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.candidats}</div>
            <div className="flex items-center space-x-1 text-xs">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+{metriques.candidatsNouveaux} cette semaine</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-1 bg-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Concours Actifs
            </CardTitle>
            <Trophy className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metriques.concoursActifs}</div>
            <div className="text-xs text-muted-foreground">
              sur {statistics.concours} total
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Établissements
            </CardTitle>
            <Building className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.etablissements}</div>
            <div className="text-xs text-muted-foreground">
              partenaires actifs
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-1 bg-orange-500"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taux Completion
            </CardTitle>
            <DollarSign className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metriques.tauxCompletion}%</div>
            <div className="text-xs text-muted-foreground">
              candidatures finalisées
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertes et notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <span>Alertes et Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metriques.paiementsEnAttente > 0 && (
                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="font-medium text-orange-800">Paiements en attente</p>
                      <p className="text-sm text-orange-600">
                        {metriques.paiementsEnAttente} paiements nécessitent une validation
                      </p>
                    </div>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/admin/paiements">Voir</Link>
                  </Button>
                </div>
              )}

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-blue-800">Nouveaux candidats</p>
                    <p className="text-sm text-blue-600">
                      {metriques.candidatsNouveaux} nouveaux candidats cette semaine
                    </p>
                  </div>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link to="/admin/candidats">Voir</Link>
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-green-800">Système opérationnel</p>
                    <p className="text-sm text-green-600">
                      Toutes les fonctionnalités sont actives
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-500">En ligne</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions rapides */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-primary" />
              <span>Actions Rapides</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button asChild className="w-full justify-start" variant="outline">
                <Link to="/admin/concours">
                  <Trophy className="h-4 w-4 mr-2" />
                  Gérer les Concours
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
                <Link to="/admin/candidats">
                  <Users className="h-4 w-4 mr-2" />
                  Voir les Candidats
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
                <Link to="/admin/dossiers">
                  <FileText className="h-4 w-4 mr-2" />
                  Valider les Dossiers
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
                <Link to="/admin/paiements">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Gérer les Paiements
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activité récente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Candidats Récents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {candidats.slice(0, 5).map((candidat) => (
                <div key={candidat.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{candidat.prncan} {candidat.nomcan}</p>
                    <p className="text-sm text-muted-foreground">{candidat.maican}</p>
                  </div>
                  <Badge variant="secondary">
                    {new Date(candidat.created_at).toLocaleDateString('fr-FR')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Concours Populaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {concours.slice(0, 5).map((concours_item) => (
                <div key={concours_item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{concours_item.libcnc}</p>
                    <p className="text-sm text-muted-foreground">{concours_item.sescnc}</p>
                  </div>
                  <Badge 
                    variant={concours_item.stacnc === '1' ? 'default' : 'secondary'}
                    className={concours_item.stacnc === '1' ? 'bg-green-500' : ''}
                  >
                    {concours_item.stacnc === '1' ? 'Actif' : 'Fermé'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* État du système */}
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
  );
};

export default Dashboard;
