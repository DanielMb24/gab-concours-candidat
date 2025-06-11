
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import ConcoursCard from '@/components/ConcoursCard';
import { apiService } from '@/services/api';
import { Concours } from '@/types/entities';

const ConcoursPage: React.FC = () => {
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

  // Récupération directe du tableau de concours depuis la réponse
  const concours: Concours[] = concoursResponse?.data || [];

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
              <ConcoursCard key={concours.id} concours={concours} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ConcoursPage;
