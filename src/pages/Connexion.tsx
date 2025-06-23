import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, LogIn } from 'lucide-react';
import Layout from '@/components/Layout';
import { toast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';

const Connexion = () => {
  const navigate = useNavigate();
  const [numeroCandidature, setNumeroCandidature] = useState('');
  const [searching, setSearching] = useState(false);

  const handleConnexion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!numeroCandidature.trim()) {
      toast({
        title: "Numéro requis",
        description: "Veuillez saisir votre numéro de candidature",
        variant: "destructive",
      });
      return;
    }

    setSearching(true);

    try {
      // Vérifier si le numéro de candidature existe via l'API
      const response = await apiService.getCandidatByNupcan(numeroCandidature.trim());
      if (!response.data) {
        throw new Error('Candidature non trouvée');
      }

      // Créer une session locale
      await apiService.createSession(numeroCandidature.trim());

      toast({
        title: "Candidature trouvée !",
        description: "Connexion à votre espace candidature",
      });

      // Rediriger vers la page de statut de candidature
      navigate(`/statut/${encodeURIComponent(numeroCandidature.trim())}`);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Candidature non trouvée",
        description: "Aucune candidature trouvée avec ce numéro. Vérifiez le format: GABCONCOURS2024/01/25/001",
        variant: "destructive",
      });
      setSearching(false);
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
                      placeholder="GABCONCOURS2024/01/25/001"
                      className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Format: GABCONCOURS suivi de la date et d'un numéro de séquence
                  </p>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={!numeroCandidature.trim() || searching}
                >
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4" />
                    <span>
                    {searching ? 'Recherche...' : 'Continuer ma candidature'}
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

          {/* Aide */}
          <Card className="mt-6">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Besoin d'aide ?</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Votre numéro de candidature vous a été fourni après votre inscription</p>
                <p>• Il suit le format: GABCONCOURS2024/01/25/001</p>
                <p>• Contactez-nous si vous avez perdu votre numéro</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
  );
};

export default Connexion;
