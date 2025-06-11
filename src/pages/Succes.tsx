
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home } from 'lucide-react';
import Layout from '@/components/Layout';

const Succes = () => {
  const { candidatureId } = useParams<{ candidatureId: string }>();
  const navigate = useNavigate();

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
                {candidatureId}
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <div>
                  <h3 className="font-semibold text-green-800">Paiement confirmé</h3>
                  <p className="text-sm text-green-700">Montant: 50 000 FCFA</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={() => navigate('/')}
            className="bg-primary hover:bg-primary/90 flex items-center space-x-2"
          >
            <Home className="h-5 w-5" />
            <span>Retour à l'accueil</span>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Succes;
