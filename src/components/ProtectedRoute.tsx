
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { navigationService } from '@/services/navigation';
import { candidatureProgressService } from '@/services/candidatureProgress';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresNupcan?: boolean;
  routeType?: 'documents' | 'paiement' | 'succes' | 'statut';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiresNupcan = false,
  routeType 
}) => {
  const { nupcan } = useParams<{ nupcan: string }>();
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const validateAccess = async () => {
      try {
        if (requiresNupcan) {
          if (!nupcan) {
            throw new Error('Numéro de candidature manquant');
          }

          if (!navigationService.validateNupcan(nupcan)) {
            throw new Error('Numéro de candidature invalide');
          }

          // Vérifier si la progression existe
          const progress = candidatureProgressService.getProgress(nupcan);
          if (!progress) {
            throw new Error('Candidature non trouvée. Veuillez vous reconnecter.');
          }

          // Vérifier l'accès à l'étape spécifique
          if (routeType && routeType !== 'statut') {
            if (routeType === 'documents' && !progress.etapesCompletes.includes('inscription')) {
              throw new Error('Vous devez d\'abord terminer votre inscription');
            }
            
            if (routeType === 'paiement' && !progress.etapesCompletes.includes('documents')) {
              throw new Error('Vous devez d\'abord uploader vos documents');
            }
            
            if (routeType === 'succes' && !progress.etapesCompletes.includes('paiement')) {
              throw new Error('Vous devez d\'abord effectuer le paiement');
            }
          }
        }
        
        setIsValidating(false);
      } catch (err) {
        console.error('Erreur de validation:', err);
        setError(err instanceof Error ? err.message : 'Erreur d\'accès');
        setIsValidating(false);
      }
    };

    validateAccess();
  }, [nupcan, requiresNupcan, routeType]);

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p>Vérification de l'accès...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center py-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Accès refusé</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <div className="flex gap-2">
              <Button onClick={() => navigate('/connexion')}>
                Se reconnecter
              </Button>
              <Button variant="outline" onClick={() => navigate('/')}>
                Accueil
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
