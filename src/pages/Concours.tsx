
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, GraduationCap } from 'lucide-react';
import Layout from '@/components/Layout';

const Concours = () => {
  const navigate = useNavigate();

  // Données fictives pour le moment
  const concours = [
    {
      id: '1',
      nom: 'Concours d\'entrée à l\'École Nationale d\'Administration',
      etablissement: 'École Nationale d\'Administration',
      filiere: 'Administration Publique',
      niveau: 'Bac+3',
      date_fin_inscription: '2024-12-31',
      date_epreuve: '2025-02-15',
      frais_inscription: 50000,
      statut: 'ouvert'
    },
    {
      id: '2', 
      nom: 'Concours de Professeurs des Écoles',
      etablissement: 'Ministère de l\'Éducation Nationale',
      filiere: 'Enseignement',
      niveau: 'Bac+3',
      date_fin_inscription: '2024-11-30',
      date_epreuve: '2025-01-20',
      frais_inscription: 35000,
      statut: 'ouvert'
    }
  ];

  const handlePostuler = (concoursId: string) => {
    navigate(`/candidature/${concoursId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Concours Disponibles
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez tous les concours publics ouverts et postulez en quelques clics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {concours.map((concours) => (
            <Card key={concours.id} className="h-full hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-bold text-foreground leading-tight">
                    {concours.nom}
                  </CardTitle>
                  <Badge variant="default" className="bg-green-500">
                    Ouvert
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{concours.etablissement}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    <span>{concours.filiere} - {concours.niveau}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>Inscription jusqu'au {formatDate(concours.date_fin_inscription)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>Épreuve: {formatDate(concours.date_epreuve)}</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold text-primary">
                      {concours.frais_inscription.toLocaleString()} FCFA
                    </div>
                    <Button
                      onClick={() => handlePostuler(concours.id)}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Postuler
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Concours;
