
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Smartphone } from 'lucide-react';
import Layout from '@/components/Layout';

const Paiement = () => {
  const { candidatureId } = useParams<{ candidatureId: string }>();
  const navigate = useNavigate();
  
  const [methodePaiement, setMethodePaiement] = useState<'airtel' | 'moov'>('airtel');
  const [numeroTelephone, setNumeroTelephone] = useState('');

  const handlePaiement = () => {
    // Simuler le paiement
    navigate(`/succes/${candidatureId}`);
  };

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

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Récapitulatif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
              <span className="font-semibold">Frais d'inscription:</span>
              <span className="text-2xl font-bold text-primary">50 000 FCFA</span>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Méthode de paiement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <p className="text-sm text-muted-foreground">Paiement mobile sécurisé</p>
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
                    <p className="text-sm text-muted-foreground">Paiement mobile sécurisé</p>
                  </div>
                </div>
              </button>
            </div>

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
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate(`/documents/${candidatureId}`)}>
            Retour aux documents
          </Button>
          <Button 
            onClick={handlePaiement}
            disabled={!numeroTelephone}
            className="bg-primary hover:bg-primary/90"
          >
            Payer 50 000 FCFA
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Paiement;
