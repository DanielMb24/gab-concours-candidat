
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Smartphone, CreditCard, CheckCircle } from 'lucide-react';
import Layout from '@/components/Layout';
import { apiService } from '@/services/api';
import { toast } from '@/hooks/use-toast';

const Paiement = () => {
  const { candidatureId } = useParams<{ candidatureId: string }>();
  const navigate = useNavigate();
  
  const [methodePaiement, setMethodePaiement] = useState<'airtel' | 'moov' | 'virement'>('airtel');
  const [numeroTelephone, setNumeroTelephone] = useState('');
  const [processing, setProcessing] = useState(false);

  // Simulation de participation et paiement
  const simulatedParticipation = {
    id: Number(candidatureId) || 1,
    candidat_id: 1,
    concours_id: 1,
    stspar: 1,
    numero_candidature: `CONC2024${candidatureId}`,
    statut: 'inscrit' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const participation = simulatedParticipation;
  const paiementExistant = null; // Pas de paiement existant pour l'instant

  // Mutation pour créer un paiement
  const createPaiementMutation = useMutation({
    mutationFn: async (paiementData: {
      methode: string;
      numeroTelephone: string;
      montant: number;
    }) => {
      return apiService.createPaiement({
        candidat_id: participation.candidat_id,
        mntfrai: paiementData.montant.toString(),
        datfrai: new Date().toISOString(),
      });
    },
    onSuccess: (response) => {
      toast({
        title: "Paiement initié !",
        description: "Votre paiement a été enregistré et est en cours de traitement",
      });
      
      // Simuler la validation automatique après quelques secondes
      setTimeout(() => {
        navigate(`/succes/${candidatureId}`);
      }, 2000);
    },
    onError: (error) => {
      console.error('Payment error:', error);
      toast({
        title: "Erreur de paiement",
        description: "Une erreur est survenue lors du traitement du paiement",
        variant: "destructive",
      });
      setProcessing(false);
    }
  });

  const handlePaiement = () => {
    if (!numeroTelephone && methodePaiement !== 'virement') {
      toast({
        title: "Numéro requis",
        description: "Veuillez saisir votre numéro de téléphone",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    
    // Simuler le processus de paiement
    setTimeout(() => {
      createPaiementMutation.mutate({
        methode: methodePaiement === 'virement' ? 'virement' : 'mobile_money',
        numeroTelephone,
        montant: 50000, // Montant fixe pour l'exemple
      });
    }, 1500);
  };

  // Si un paiement est déjà validé, rediriger vers succès
  if (paiementExistant && paiementExistant.statut === 'valide') {
    navigate(`/succes/${candidatureId}`);
    return null;
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Paiement des Frais d'Inscription
          </h1>
          <p className="text-muted-foreground">
            Candidature: {candidatureId}
          </p>
        </div>

        {/* Récapitulatif */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Récapitulatif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {participation && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Détails de la candidature</h4>
                  <p className="text-sm text-muted-foreground">
                    Numéro: {participation.numero_candidature}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Statut: {participation.statut}
                  </p>
                </div>
              )}
              
              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                <span className="font-semibold">Frais d'inscription:</span>
                <span className="text-2xl font-bold text-primary">50 000 FCFA</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statut du paiement existant */}
        {paiementExistant && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Paiement en cours</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <p className="text-yellow-800">
                  Un paiement de {(paiementExistant.montant || 50000).toLocaleString()} FCFA est déjà en cours de traitement.
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Référence: {paiementExistant.reference || 'REF_' + Date.now()}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Méthodes de paiement */}
        {!paiementExistant && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Méthode de paiement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setMethodePaiement('airtel')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    methodePaiement === 'airtel'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-6 w-6 text-red-500" />
                    <div className="text-left">
                      <p className="font-semibold">Airtel Money</p>
                      <p className="text-sm text-muted-foreground">Paiement mobile</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setMethodePaiement('moov')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    methodePaiement === 'moov'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-6 w-6 text-blue-500" />
                    <div className="text-left">
                      <p className="font-semibold">Moov Money</p>
                      <p className="text-sm text-muted-foreground">Paiement mobile</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setMethodePaiement('virement')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    methodePaiement === 'virement'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-6 w-6 text-green-500" />
                    <div className="text-left">
                      <p className="font-semibold">Virement</p>
                      <p className="text-sm text-muted-foreground">Bancaire</p>
                    </div>
                  </div>
                </button>
              </div>

              {methodePaiement !== 'virement' && (
                <div>
                  <Label htmlFor="numeroTelephone">
                    Numéro de téléphone {methodePaiement === 'airtel' ? 'Airtel' : 'Moov'} *
                  </Label>
                  <Input
                    id="numeroTelephone"
                    type="tel"
                    value={numeroTelephone}
                    onChange={(e) => setNumeroTelephone(e.target.value)}
                    placeholder="XX XX XX XX"
                  />
                </div>
              )}

              {methodePaiement === 'virement' && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Informations bancaires</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>Banque: UGB (Union Gabonaise de Banque)</p>
                    <p>RIB: 10002 00001 00000000123 35</p>
                    <p>Bénéficiaire: République Gabonaise - Concours Publics</p>
                    <p className="font-medium mt-2">
                      Montant: 50 000 FCFA
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate(`/documents/${candidatureId}`)}>
            Retour aux documents
          </Button>
          
          {!paiementExistant && (
            <Button 
              onClick={handlePaiement}
              disabled={(!numeroTelephone && methodePaiement !== 'virement') || processing}
              className="bg-primary hover:bg-primary/90"
            >
              {processing ? 'Traitement...' : 'Payer 50 000 FCFA'}
            </Button>
          )}
          
          {paiementExistant && (
            <Button 
              onClick={() => navigate(`/succes/${candidatureId}`)}
              className="bg-primary hover:bg-primary/90"
            >
              Voir le statut
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Paiement;
