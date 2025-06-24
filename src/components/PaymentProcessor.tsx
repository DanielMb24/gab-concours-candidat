
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, CreditCard, Smartphone, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PaymentProcessorProps {
  montant: number;
  candidatureId: string;
  onPaymentSuccess: () => void;
}

const PaymentProcessor: React.FC<PaymentProcessorProps> = ({
  montant,
  candidatureId,
  onPaymentSuccess
}) => {
  const [processing, setProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'airtel' | 'moov' | 'virement'>('airtel');

  const handlePayment = async () => {
    setProcessing(true);
    
    try {
      // Simulation du processus de paiement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simuler un succès de paiement
      toast({
        title: "Paiement réussi !",
        description: `Votre paiement de ${montant.toLocaleString()} FCFA a été traité avec succès.`,
      });
      
      onPaymentSuccess();
    } catch (error) {
      toast({
        title: "Erreur de paiement",
        description: "Une erreur est survenue lors du traitement du paiement.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const paymentMethods = [
    {
      id: 'airtel' as const,
      name: 'Airtel Money',
      icon: Smartphone,
      color: 'text-red-500',
      bgColor: 'bg-red-50 border-red-200',
    },
    {
      id: 'moov' as const,
      name: 'Moov Money',
      icon: Smartphone,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 border-blue-200',
    },
    {
      id: 'virement' as const,
      name: 'Virement Bancaire',
      icon: CreditCard,
      color: 'text-green-500',
      bgColor: 'bg-green-50 border-green-200',
    },
  ];

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5 text-primary" />
          <span>Paiement sécurisé</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary gradient-text">
            {montant.toLocaleString()} FCFA
          </div>
          <p className="text-sm text-muted-foreground">Frais d'inscription</p>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">Choisir une méthode de paiement</h4>
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`w-full p-4 border-2 rounded-lg transition-all ${
                selectedMethod === method.id
                  ? 'border-primary bg-primary/5'
                  : method.bgColor
              }`}
            >
              <div className="flex items-center space-x-3">
                <method.icon className={`h-6 w-6 ${method.color}`} />
                <span className="font-medium">{method.name}</span>
                {selectedMethod === method.id && (
                  <CheckCircle className="h-5 w-5 text-primary ml-auto" />
                )}
              </div>
            </button>
          ))}
        </div>

        <Button
          onClick={handlePayment}
          disabled={processing}
          className="w-full gradient-bg text-white hover:opacity-90"
          size="lg"
        >
          {processing ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              Traitement en cours...
            </>
          ) : (
            `Payer ${montant.toLocaleString()} FCFA`
          )}
        </Button>

        <div className="text-center">
          <Badge variant="outline" className="text-green-600 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Paiement 100% sécurisé
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentProcessor;
