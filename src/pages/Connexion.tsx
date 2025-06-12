
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, LogIn } from 'lucide-react';
import Layout from '@/components/Layout';
import { apiService } from '@/services/api';
import { toast } from '@/hooks/use-toast';

const Connexion = () => {
  const navigate = useNavigate();
  const [numeroCandidature, setNumeroCandidature] = useState('');

  // Mutation pour rechercher une participation (simulation)
  const searchMutation = useMutation({
    mutationFn: async (numero: string) => {
      // Simulation d'une participation trouvée
      return {
        data: {
          id: Number(numero.slice(-6)) || Date.now(),
          candidat_id: 1,
          concours_id: 1,
          stspar: 1,
          numero_candidature: numero,
          statut: 'inscrit' as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      };
    },
    onSuccess: (response) => {
      const participation = response.data;
      
      // Créer une session pour cette participation
      apiService.createSession(participation.id);
      
      toast({
        title: "Candidature trouvée !",
        description: `Bienvenue dans votre espace candidature`,
      });
      
      // Rediriger selon le statut
      switch (participation.statut) {
        case 'inscrit':
          navigate(`/documents/${participation.id}`);
          break;
        case 'paye':
          navigate(`/succes/${participation.id}`);
          break;
        default:
          navigate(`/confirmation/${participation.numero_candidature}`);
      }
    },
    onError: (error) => {
      console.error('Search error:', error);
      toast({
        title: "Candidature non trouvée",
        description: "Aucune candidature trouvée avec ce numéro",
        variant: "destructive",
      });
    }
  });

  const handleConnexion = (e: React.FormEvent) => {
    e.preventDefault();
    if (numeroCandidature.trim()) {
      searchMutation.mutate(numeroCandidature.trim());
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
            <LogIn className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Continuer ma Candidature
          </h1>
          <p className="text-muted-foreground">
            Saisissez votre numéro de candidature pour reprendre là où vous vous êtes arrêté
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleConnexion} className="space-y-6">
              <div>
                <Label htmlFor="numeroCandidature">
                  Numéro de candidature
                </Label>
                <Input
                  id="numeroCandidature"
                  type="text"
                  value={numeroCandidature}
                  onChange={(e) => setNumeroCandidature(e.target.value)}
                  placeholder="Ex: CONC2024001"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Ce numéro vous a été fourni lors de votre inscription
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={!numeroCandidature.trim() || searchMutation.isPending}
              >
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4" />
                  <span>
                    {searchMutation.isPending ? 'Recherche...' : 'Continuer ma candidature'}
                  </span>
                </div>
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Vous n'avez pas encore de candidature ?
                </p>
                <Button
                  variant="outline"
                  onClick={() => navigate('/concours')}
                  className="w-full"
                >
                  Voir les concours disponibles
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Connexion;
