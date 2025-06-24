
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowLeft, Upload, FileText } from 'lucide-react';
import Layout from '@/components/Layout';
import { candidatureStateManager } from '@/services/candidatureStateManager';
import { routeManager } from '@/services/routeManager';
import { toast } from '@/hooks/use-toast';

const DocumentsContinue = () => {
  const { nupcan } = useParams<{ nupcan: string }>();
  const navigate = useNavigate();
  const [documentsUploaded, setDocumentsUploaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [candidatureState, setCandidatureState] = useState<any>(null);

  const decodedNupcan = decodeURIComponent(nupcan || '');

  useEffect(() => {
    const initializePage = async () => {
      if (!decodedNupcan) {
        navigate('/connexion');
        return;
      }

      try {
        const state = await candidatureStateManager.initializeContinueCandidature(decodedNupcan);
        setCandidatureState(state);
        
        // Vérifier si les documents sont déjà uploadés
        const isDocumentsComplete = state.progression?.etapesCompletes.includes('documents');
        setDocumentsUploaded(isDocumentsComplete || false);
      } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger votre candidature",
          variant: "destructive",
        });
        navigate('/connexion');
      } finally {
        setIsLoading(false);
      }
    };

    initializePage();
  }, [decodedNupcan, navigate]);

  const handleUploadComplete = () => {
    setDocumentsUploaded(true);
    candidatureStateManager.updateProgression(decodedNupcan, 'documents');
    
    toast({
      title: "Documents uploadés !",
      description: "Vos documents ont été uploadés avec succès.",
    });

    // Rediriger vers le paiement après un délai
    setTimeout(() => {
      const paiementUrl = routeManager.getPaiementUrl({ nupcan: decodedNupcan });
      navigate(paiementUrl);
    }, 2000);
  };

  const handleRetourStatut = () => {
    const statutUrl = routeManager.getStatutUrl(decodedNupcan);
    navigate(statutUrl);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Chargement de votre candidature...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (documentsUploaded) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Documents Uploadés !</h1>
            <p className="text-muted-foreground mb-4">
              Vos documents ont été uploadés avec succès.
            </p>
            <p className="text-sm text-muted-foreground">
              Redirection vers le paiement...
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
            Upload de vos Documents
          </h1>
          <p className="text-muted-foreground">
            Candidature: {decodedNupcan}
          </p>
          {candidatureState?.candidatData && (
            <p className="text-sm text-muted-foreground">
              {candidatureState.candidatData.prncan} {candidatureState.candidatData.nomcan}
            </p>
          )}
        </div>

        {/* Documents requis */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Documents Requis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                'Carte d\'identité (recto-verso)',
                'Diplôme de baccalauréat',
                'Relevé de notes du baccalauréat',
                'Certificat de naissance',
                'Photos d\'identité (4x4)'
              ].map((doc, index) => (
                <div key={index} className="p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg text-center hover:border-primary/50 transition-colors">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">{doc}</p>
                  <Button size="sm" className="mt-2" onClick={handleUploadComplete}>
                    Uploader
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleRetourStatut} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Retour au statut</span>
          </Button>
          <Button onClick={handleUploadComplete} size="lg">
            Finaliser l'upload
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default DocumentsContinue;
