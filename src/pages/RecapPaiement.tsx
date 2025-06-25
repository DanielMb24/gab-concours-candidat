
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Download, Printer, ArrowLeft, Calendar, User, CreditCard, FileText } from 'lucide-react';
import Layout from '@/components/Layout';
import { candidatureStateManager } from '@/services/candidatureStateManager';
import { apiService } from '@/services/api';
import { toast } from '@/hooks/use-toast';

const RecapPaiement = () => {
  const { nupcan } = useParams<{ nupcan: string }>();
  const navigate = useNavigate();
  const [candidatureData, setCandidatureData] = useState<any>(null);
  const [paiementData, setPaiementData] = useState<any>(null);
  const [documentsData, setDocumentsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const decodedNupcan = decodeURIComponent(nupcan || '');

  useEffect(() => {
    const loadRecapData = async () => {
      if (!decodedNupcan) {
        navigate('/');
        return;
      }

      try {
        // Charger les données du candidat
        const candidatResponse = await apiService.getCandidatByNupcan(decodedNupcan);
        if (!candidatResponse.data) {
          throw new Error('Candidat introuvable');
        }

        setCandidatureData(candidatResponse.data);

        // Charger les documents
        const documentsResponse = await apiService.getDocumentsByCandidat(candidatResponse.data.id);
        setDocumentsData(documentsResponse.data || []);

        // Simuler la récupération du paiement (à adapter selon votre API)
        setPaiementData({
          montant: 50000,
          reference: `PAY_${Date.now()}`,
          statut: 'valide',
          date: new Date().toISOString(),
          methode: 'airtel'
        });

      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données de la candidature",
          variant: "destructive",
        });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    loadRecapData();
  }, [decodedNupcan, navigate]);

  const handleRetourAccueil = () => {
    navigate('/');
  };

  const handleTelechargerRecap = () => {
    toast({
      title: "Téléchargement",
      description: "Le récapitulatif va être téléchargé",
    });
  };

  const handleImprimerRecap = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Chargement du récapitulatif...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* En-tête de succès */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Candidature Complétée !</h1>
          <p className="text-muted-foreground">
            Votre candidature a été soumise avec succès
          </p>
          <Badge className="mt-4 bg-green-100 text-green-800 border-green-200">
            Candidature: {decodedNupcan}
          </Badge>
        </div>

        {/* Récapitulatif des informations */}
        <div className="space-y-6">
          {/* Informations personnelles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-primary" />
                <span>Informations du candidat</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nom complet</p>
                <p className="font-medium">{candidatureData?.prncan} {candidatureData?.nomcan}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{candidatureData?.maican}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Téléphone</p>
                <p className="font-medium">{candidatureData?.telcan}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date de naissance</p>
                <p className="font-medium">{candidatureData?.dtncan}</p>
              </div>
            </CardContent>
          </Card>

          {/* Documents soumis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary" />
                <span>Documents soumis ({documentsData.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documentsData.length > 0 ? documentsData.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{doc.nomdoc}</p>
                        <p className="text-sm text-muted-foreground">Type: {doc.type}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      {doc.statut}
                    </Badge>
                  </div>
                )) : (
                  <p className="text-muted-foreground text-center py-4">Aucun document trouvé</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Détails du paiement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <span>Détails du paiement</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Montant payé</p>
                <p className="text-2xl font-bold text-green-600">{paiementData?.montant?.toLocaleString()} FCFA</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Référence</p>
                <p className="font-mono text-sm">{paiementData?.reference}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Statut</p>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  Paiement validé
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">{new Date(paiementData?.date).toLocaleDateString('fr-FR')}</p>
              </div>
            </CardContent>
          </Card>

          {/* Prochaines étapes */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-700">
                <Calendar className="h-5 w-5" />
                <span>Prochaines étapes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-blue-700">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p>Vos documents seront examinés par notre équipe dans les 48h</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p>Vous recevrez une notification par email concernant le statut de votre candidature</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p>Les résultats d'admission seront communiqués selon le calendrier du concours</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <Button variant="outline" onClick={handleTelechargerRecap} className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Télécharger le récapitulatif</span>
          </Button>
          <Button variant="outline" onClick={handleImprimerRecap} className="flex items-center space-x-2">
            <Printer className="h-4 w-4" />
            <span>Imprimer</span>
          </Button>
          <Button onClick={handleRetourAccueil} className="bg-primary hover:bg-primary/90 flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Retour à l'accueil</span>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default RecapPaiement;
