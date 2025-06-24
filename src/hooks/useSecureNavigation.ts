
import { useNavigate } from 'react-router-dom';
import { navigationService } from '@/services/navigation';
import { candidatureProgressService } from '@/services/candidatureProgress';

export const useSecureNavigation = () => {
  const navigate = useNavigate();

  const navigateToStep = (nupcan: string, step: 'documents' | 'paiement' | 'succes') => {
    try {
      // Vérifier si le NUPCAN est valide
      if (!navigationService.validateNupcan(nupcan)) {
        throw new Error('Numéro de candidature invalide');
      }

      // Vérifier la progression
      const progress = candidatureProgressService.getProgress(nupcan);
      if (!progress) {
        throw new Error('Candidature non trouvée');
      }

      // Vérifier les prérequis pour l'étape
      const canAccess = candidatureProgressService.canAccessStep(nupcan, step);
      if (!canAccess) {
        throw new Error(`Accès refusé à l'étape ${step}`);
      }

      // Navigation sécurisée
      navigationService.navigateTo(navigate, step, { nupcan });
    } catch (error) {
      console.error('Erreur de navigation:', error);
      navigationService.navigateTo(navigate, 'statut', { nupcan });
    }
  };

  const navigateToStatus = (nupcan: string) => {
    if (navigationService.validateNupcan(nupcan)) {
      navigationService.navigateTo(navigate, 'statut', { nupcan });
    } else {
      navigationService.navigateTo(navigate, 'connexion');
    }
  };

  return {
    navigateToStep,
    navigateToStatus,
    navigateTo: (routeType: any, params?: Record<string, string>) => {
      navigationService.navigateTo(navigate, routeType, params);
    }
  };
};
