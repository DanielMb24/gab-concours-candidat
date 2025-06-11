
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Copy } from 'lucide-react';
import Layout from '@/components/Layout';

const Confirmation = () => {
  const { numeroCandidature } = useParams<{ numeroCandidature: string }>();
  const navigate = useNavigate();

  const handleContinuer = () => {
    navigate(`/documents/${numeroCandidature}`);
  };

  const copyToClipboard = () => {
    if (numeroCandidature) {
      navigator.clipboard.writeText(numeroCandidature);
    }
  };

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
                    {numeroCandidature}
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
