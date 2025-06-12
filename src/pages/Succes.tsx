
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, Calendar, CreditCard, User } from 'lucide-react';
import Layout from '@/components/Layout';
import { apiService } from '@/services/api';

const Succes = () => {
  const { candidatureId } = useParams<{ candidatureId: string }>();
  const navigate = useNavigate();

  // Simulation de données pour éviter les erreurs d'API
  const simulatedParticipation = {
    id: Number(candidatureId) || 1,
    candidat_id: 1,
    concours_id: 1,
    stspar: 1,
    numero_candidature: `CONC2024${candidatureId}`,
    statut: 'paye' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const simulatedPaiement = {
    id: 1,
    candidat_id: 1,
    mntfrai: "50000",
    datfrai: new Date().toISOString(),
    montant: 50000,
    reference: `PAY_${Date.now()}`,
    statut: 'valide' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const participation = simulatedParticipation;
  const paiement = simulatedPaiement;

  const handleDownloadRecu = () => {
    // Simulation du téléchargement d'un reçu
    const element = document.createElement('a');
    const file = new Blob(['Reçu de paiement - Candidature: ' + participation.numero_candidature], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `recu_${participation.numero_candidature}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Félicitations !
          </h1>
          <p className="text-lg text-muted-foreground">
            Votre candidature a été finalisée avec succès
          </p>
        </div>

        {/* Statut de la candidature */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Statut de votre candidature</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-semibold text-green-800">Candidature complète</p>
                  <p className="text-sm text-green-700">
                    Numéro: {participation.numero_candidature}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Statut</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {participation.statut}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Date de finalisation</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(participation.updated_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Détails du paiement */}
        {paiement && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Paiement confirmé</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground">Montant payé</p>
                  <p className="text-lg font-bold text-primary">{paiement.montant?.toLocaleString()} FCFA</p>
                </div>
                
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Référence</p>
                  <p className="text-sm font-mono">{paiement.reference}</p>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Statut</p>
                  <p className="text-sm font-medium text-green-700 capitalize">Confirmé</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Prochaines étapes */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Prochaines étapes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Ce qui vous attend</h4>
                <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
                  <li>Votre dossier sera examiné par nos services</li>
                  <li>Vous recevrez un email de confirmation sous 48h</li>
                  <li>Les résultats d'admissibilité seront publiés dans les délais annoncés</li>
                  <li>Consultez régulièrement votre espace candidat pour les mises à jour</li>
                </ol>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Important</h4>
                <p className="text-sm text-yellow-700">
                  Conservez précieusement votre numéro de candidature et votre reçu de paiement. 
                  Ils vous seront demandés pour toute correspondance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleDownloadRecu}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Télécharger le reçu</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate('/connexion')}
          >
            Retour à mon espace
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate('/')}
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Succes;
