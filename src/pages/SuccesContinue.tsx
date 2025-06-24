
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, FileText, User } from 'lucide-react';
import Layout from '@/components/Layout';
import { candidatureStateManager } from '@/services/candidatureStateManager';
import { routeManager } from '@/services/routeManager';
import { toast } from '@/hooks/use-toast';

const SuccesContinue = () => {
  const { nupcan } = useParams<{ nupcan: string }>();
  const navigate = useNavigate();
  const [candidatureState, setCandidatureState] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const decodedNupcan = decodeURIComponent(nupcan || '');

  useEffect(() => {
    const initializePage = async () => {
      if (!decodedNupcan) {
        navigate('/connexion');
        return;
      }

      try {
        const state = await candidatureStateManager.initializeContinueCandidature(decodedNupcan);
        setCandidatureState(state);
        
        // Marquer comme terminé
        candidatureStateManager.updateProgression(decodedNupcan, 'termine');
        
        toast({
          title: "Candidature terminée !",
          description: "Votre candidature a été finalisée avec succès.",
        });
      } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        navigate('/connexion');
      } finally {
        setIsLoading(false);
      }
    };

    initializePage();
  }, [decodedNupcan, navigate]);

  const handleRetourStatut = () => {
    const statutUrl = routeManager.getStatutUrl(decodedNupcan);
    navigate(statutUrl);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Finalisation de votre candidature...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Candidature Finalisée !
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            Félicitations, votre candidature est maintenant complète
          </p>
          <p className="text-sm text-muted-foreground">
            Numéro de candidature: <span className="font-mono font-semibold">{decodedNupcan}</span>
          </p>
        </div>

        {/* Récapitulatif final */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Récapitulatif Final</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <User className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <h3 className="font-semibold text-green-700">Inscription</h3>
                <p className="text-sm text-green-600">Complétée</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <FileText className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <h3 className="font-semibold text-green-700">Documents</h3>
                <p className="text-sm text-green-600">Uploadés</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <h3 className="font-semibold text-green-700">Paiement</h3>
                <p className="text-sm text-green-600">Effectué</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informations candidat */}
        {candidatureState?.candidatData && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Vos Informations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nom complet</p>
                  <p className="font-semibold">
                    {candidatureState.candidatData.prncan} {candidatureState.candidatData.nomcan}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold">{candidatureState.candidatData.maican}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Prochaines étapes */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Prochaines Étapes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                <div>
                  <p className="font-semibold">Vérification des documents</p>
                  <p className="text-sm text-muted-foreground">
                    Nos équipes vont vérifier vos documents dans les 48h
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                <div>
                  <p className="font-semibold">Confirmation d'inscription</p>
                  <p className="text-sm text-muted-foreground">
                    Vous recevrez un email de confirmation
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                <div>
                  <p className="font-semibold">Informations sur le concours</p>
                  <p className="text-sm text-muted-foreground">
                    Détails sur les dates et modalités du concours
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="text-center space-x-4">
          <Button onClick={handleRetourStatut} size="lg" className="mb-4 mr-4">
            Voir le statut de ma candidature
          </Button>
          <Button variant="outline" onClick={() => navigate('/concours')} size="lg" className="mb-4">
            <Home className="h-4 w-4 mr-2" />
            Voir d'autres concours
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default SuccesContinue;
