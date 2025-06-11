
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, Download, Calendar, User } from 'lucide-react';
import Layout from '@/components/Layout';
import { apiService } from '@/services/api';

const Succes = () => {
  const { candidatureId } = useParams<{ candidatureId: string }>();
  const navigate = useNavigate();

  // Récupération des informations de participation
  const { data: participationResponse } = useQuery({
    queryKey: ['participation', candidatureId],
    queryFn: () => apiService.getParticipationById(Number(candidatureId)),
    enabled: !!candidatureId,
  });

  // Récupération des informations de paiement
  const { data: paiementResponse } = useQuery({
    queryKey: ['paiement', candidatureId],
    queryFn: () => apiService.getPaiementByParticipation(Number(candidatureId)),
    enabled: !!candidatureId,
  });

  const participation = participationResponse?.data;
  const paiement = paiementResponse?.data;

  const handleDownloadAttestation = () => {
    // Simulation du téléchargement d'une attestation
    const blob = new Blob(['Attestation de candidature...'], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attestation_candidature_${participation?.numero_candidature}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!participation) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-destructive mb-4">
              Candidature non trouvée
            </h1>
            <Button onClick={() => navigate('/')}>
              Retour à l'accueil
            </Button>
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
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Candidature Finalisée !
          </h1>
          <p className="text-lg text-muted-foreground">
            Votre candidature a été soumise avec succès et le paiement a été confirmé
          </p>
        </div>

        {/* Récapitulatif de la candidature */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Récapitulatif de votre candidature</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-primary/5 border border-primary/20 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-primary mb-2">
                Numéro de candidature
              </h3>
              <p className="text-3xl font-mono font-bold text-foreground">
                {participation.numero_candidature}
              </p>
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
                  <p className="font-medium">Date d'inscription</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(participation.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>

            {paiement && (
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <div>
                    <h3 className="font-semibold text-green-800">Paiement confirmé</h3>
                    <p className="text-sm text-green-700">
                      Montant: {paiement.montant.toLocaleString()} FCFA
                    </p>
                    <p className="text-xs text-green-600">
                      Référence: {paiement.reference}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Prochaines étapes */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Prochaines étapes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Validation du dossier</p>
                  <p className="text-sm text-muted-foreground">
                    Vos documents seront examinés dans les 48h ouvrables
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Convocation</p>
                  <p className="text-sm text-muted-foreground">
                    Vous recevrez votre convocation par email et SMS
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Composition</p>
                  <p className="text-sm text-muted-foreground">
                    Présentez-vous au centre d'examen avec vos pièces d'identité
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleDownloadAttestation}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Download className="h-5 w-5" />
            <span>Télécharger l'attestation</span>
          </Button>
          
          <Button
            size="lg"
            onClick={() => navigate('/')}
            className="bg-primary hover:bg-primary/90 flex items-center space-x-2"
          >
            <Home className="h-5 w-5" />
            <span>Retour à l'accueil</span>
          </Button>
        </div>

        {/* Informations de contact */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Besoin d'aide ?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>📧 Email: support@gabconcours.ga</p>
              <p>📞 Téléphone: +241 01 XX XX XX</p>
              <p>🕒 Horaires: Lundi - Vendredi, 8h - 17h</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Succes;
