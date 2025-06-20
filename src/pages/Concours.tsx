
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/services/api';
import { Concours } from '@/types/entities';
import { Calendar, MapPin, GraduationCap, Users, Euro } from 'lucide-react';

const ConcoursPage: React.FC = () => {
  const navigate = useNavigate();
  
  const { data: concoursResponse, isLoading, error } = useQuery({
    queryKey: ['concours'],
    queryFn: () => apiService.getConcours(),
  });

  console.log('Concours API Response:', concoursResponse);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Concours Disponibles</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg p-6 shadow-md animate-pulse">
                <div className="h-6 bg-muted rounded mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded mb-4"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Concours Disponibles</h1>
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
            Erreur lors du chargement des concours: {error.message}
          </div>
        </div>
      </Layout>
    );
  }

  const concours: Concours[] = concoursResponse?.data || [];

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case '1':
        return <Badge className="bg-green-500 hover:bg-green-600">Ouvert</Badge>;
      case '2':
        return <Badge variant="secondary">Fermé</Badge>;
      case '3':
        return <Badge variant="outline">Terminé</Badge>;
      default:
        return <Badge variant="outline">Statut inconnu</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch {
      return dateString;
    }
  };

  const isConcoursOuvert = (statut: string) => statut === '1';

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Concours Disponibles</h1>
          <p className="text-muted-foreground">
            Découvrez tous les concours ouverts et postulez dès maintenant
          </p>
        </div>

        {concours.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">Aucun concours disponible</h2>
            <p className="text-muted-foreground">
              Il n'y a actuellement aucun concours ouvert. Revenez bientôt !
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {concours.map((concours) => (
              <Card key={concours.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg leading-tight">
                      {concours.libcnc}
                    </CardTitle>
                    {getStatusBadge(concours.stacnc)}
                  </div>
                  
                  <div className="flex items-center text-muted-foreground text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{concours.etablissement_nomets}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      <span>
                        <strong>Session:</strong> {concours.sescnc}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      <span>
                        <strong>Période:</strong> {formatDate(concours.debcnc)} - {formatDate(concours.fincnc)}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <GraduationCap className="h-4 w-4 mr-2 text-primary" />
                      <span>
                        <strong>Niveau:</strong> {concours.niveau_nomniv}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2 text-primary" />
                      <span>
                        <strong>Âge limite:</strong> {concours.agecnc} ans
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Euro className="h-4 w-4 mr-2 text-primary" />
                      <span>
                        <strong>Frais:</strong> {concours.fracnc} FCFA
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button 
                      onClick={() => navigate(`/candidature/${concours.id}`)}
                      disabled={!isConcoursOuvert(concours.stacnc)}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      {isConcoursOuvert(concours.stacnc) 
                        ? 'Postuler à ce concours' 
                        : 'Concours fermé'
                      }
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ConcoursPage;
