
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, FileText, Calendar, User } from 'lucide-react';
import Layout from '@/components/Layout';
import { candidatureProgressService } from '@/services/candidatureProgress';

const Succes = () => {
  const { nupcan } = useParams<{ nupcan: string }>();
  const navigate = useNavigate();

  const decodedNupcan = decodeURIComponent(nupcan || '');

  // Marquer la candidature comme terminée
  React.useEffect(() => {
    if (decodedNupcan) {
      candidatureProgressService.markStepComplete(decodedNupcan, 'paiement');
    }
  }, [decodedNupcan]);

  const handleRetourAccueil = () => {
    navigate('/');
  };

  const handleVoirStatut = () => {
    navigate(`/statut/${nupcan}`);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Félicitations !</h1>
          <p className="text-muted-foreground">Votre candidature a été soumise avec succès.</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Détails de la candidature</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-semibold">Numéro de candidature</p>
                  <p className="text-sm text-muted-foreground font-mono">{decodedNupcan}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-semibold">Date de soumission</p>
                  <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString('fr-FR')}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-semibold">Statut</p>
                  <p className="text-sm text-green-600">Candidature complète</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Prochaines étapes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Confirmation par email</p>
                  <p className="text-sm text-muted-foreground">
                    Vous recevrez un email de confirmation dans les prochaines heures
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Validation des documents</p>
                  <p className="text-sm text-muted-foreground">
                    Nos équipes vérifieront vos documents sous 48-72h
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Information sur l'examen</p>
                  <p className="text-sm text-muted-foreground">
                    Les détails de l'examen vous seront communiqués par email
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleVoirStatut}
            className="bg-primary hover:bg-primary/90"
          >
            <User className="h-4 w-4 mr-2" />
            Voir mon statut
          </Button>
          <Button
            variant="outline"
            onClick={handleRetourAccueil}
          >
            Retour à l'accueil
          </Button>
        </div>

        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Besoin d'aide ?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Pour toute question concernant votre candidature, vous pouvez :
              </p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Consulter votre statut de candidature à tout moment</p>
                <p>• Nous contacter par email : concours@gabon.ga</p>
                <p>• Appeler notre service candidat : +241 XX XX XX XX</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Succes;
