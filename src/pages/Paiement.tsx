
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import Layout from '@/components/Layout';
import PaymentProcessor from '@/components/PaymentProcessor';
import { candidatureProgressService } from '@/services/candidatureProgress';

const Paiement = () => {
  const { nupcan } = useParams<{ nupcan: string }>();
  const navigate = useNavigate();
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const decodedNupcan = decodeURIComponent(nupcan || '');

  const handlePaymentSuccess = () => {
    setPaymentCompleted(true);
    
    // Marquer l'étape paiement comme complète
    if (decodedNupcan) {
      candidatureProgressService.markStepComplete(decodedNupcan, 'paiement');
    }

    // Rediriger vers la page de succès après un délai
    setTimeout(() => {
      navigate(`/succes/${encodeURIComponent(decodedNupcan)}`);
    }, 2000);
  };

  const handleRetourDocuments = () => {
    navigate(`/documents/${encodeURIComponent(decodedNupcan)}`);
  };

  if (paymentCompleted) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Paiement Réussi !</h1>
            <p className="text-muted-foreground mb-4">
              Votre paiement a été traité avec succès.
            </p>
            <p className="text-sm text-muted-foreground">
              Redirection en cours...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Paiement des Frais d'Inscription
          </h1>
          <p className="text-muted-foreground">
            Candidature: {decodedNupcan}
          </p>
        </div>

        {/* Récapitulatif */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Récapitulatif du Paiement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Détails de la candidature</h4>
                <p className="text-sm text-muted-foreground">
                  Numéro: {decodedNupcan}
                </p>
                <p className="text-sm text-muted-foreground">
                  Statut: En cours de traitement
                </p>
              </div>
              
              <div className="flex items-center justify-between p-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/20">
                <span className="font-semibold text-lg">Frais d'inscription:</span>
                <span className="text-3xl font-bold gradient-text">50 000 FCFA</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Processor */}
        <div className="flex justify-center mb-8">
          <PaymentProcessor
            montant={50000}
            candidatureId={decodedNupcan}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleRetourDocuments} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Retour aux documents</span>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Paiement;
