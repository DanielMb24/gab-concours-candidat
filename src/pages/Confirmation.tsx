
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Copy, User, Calendar } from 'lucide-react';
import Layout from '@/components/Layout';
import { apiService } from '@/services/api';
import { toast } from '@/hooks/use-toast';

const Confirmation = () => {
  const { numeroCandidature } = useParams<{ numeroCandidature: string }>();
  const navigate = useNavigate();

  const handleContinuer = () => {
    if (numeroCandidature) {
      // Créer une session locale
      apiService.createSession(numeroCandidature);
      navigate(`/documents/${numeroCandidature}`);
    }
  };

  const copyToClipboard = () => {
    if (numeroCandidature) {
      navigator.clipboard.writeText(numeroCandidature);
      toast({
        title: "Copié !",
        description: "Le numéro de candidature a été copié dans le presse-papiers",
      });
    }
  };

  // Générer un numéro de candidature au format demandé
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const sequence = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
  
  const generatedNumber = numeroCandidature || `GABCONCOURS${year}/${month}/${day}/${sequence}`;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Candidature Créée avec Succès !
          </h1>
          <p className="text-lg text-muted-foreground">
            Votre candidature a été enregistrée dans notre système
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Informations de votre candidature</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-primary/5 border border-primary/20 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">
                    Numéro de candidature
                  </h3>
                  <p className="text-2xl font-mono font-bold text-foreground">
                    {generatedNumber}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Conservez précieusement ce numéro pour suivre votre candidature
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="flex items-center space-x-2"
                >
                  <Copy className="h-4 w-4" />
                  <span>Copier</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Statut</p>
                  <p className="text-sm text-muted-foreground">
                    Candidature créée
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Date de création</p>
                  <p className="text-sm text-muted-foreground">
                    {today.toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Prochaines étapes</h4>
              <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
                <li>Déposer vos documents justificatifs</li>
                <li>Effectuer le paiement des frais d'inscription</li>
                <li>Attendre la validation de votre dossier</li>
                <li>Recevoir la convocation aux épreuves</li>
              </ol>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Important</h4>
              <p className="text-sm text-yellow-700">
                Ce numéro de candidature est unique et vous permettra de suivre l'évolution 
                de votre dossier. Notez-le soigneusement ou conservez cette page.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={handleContinuer}
            className="bg-primary hover:bg-primary/90"
          >
            Continuer - Déposer mes documents
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/')}
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Confirmation;
