import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Layout from '@/components/Layout';
import { toast } from '@/hooks/use-toast';

const Succes = () => {
  const { candidatureId } = useParams<{ candidatureId: string }>();
  const navigate = useNavigate();

  const decodedCandidatureId = decodeURIComponent(candidatureId || '');

  const handleRetourAccueil = () => {
    navigate('/');
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
          <Card>
            <CardHeader>
              <CardTitle>Détails de la candidature</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">Numéro de candidature: {decodedCandidatureId}</p>
              <p className="text-sm text-muted-foreground mt-2">Vous recevrez prochainement une confirmation par email ou sur votre tableau de bord.</p>
              <Button
                  onClick={handleRetourAccueil}
                  className="mt-6 bg-primary hover:bg-primary/90 w-full sm:w-auto"
              >
                Retour à l'accueil
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
  );
};

export default Succes;