
import { candidatureProgressService, ProgressionStatus } from './candidatureProgress';
import { apiService } from './api';

export interface CandidatureState {
  identifier: string;
  type: 'new' | 'continue';
  progression?: ProgressionStatus;
  candidatData?: any;
}

class CandidatureStateManagerService {
  // Initialise l'état pour une nouvelle candidature
  async initializeNewCandidature(candidatureId: string): Promise<CandidatureState> {
    try {
      // Pour une nouvelle candidature, on commence par créer la progression
      const progression = candidatureProgressService.createInitialProgress();
      candidatureProgressService.markStepComplete(candidatureId, 'inscription');
      
      return {
        identifier: candidatureId,
        type: 'new',
        progression: candidatureProgressService.getProgress(candidatureId)
      };
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la nouvelle candidature:', error);
      throw error;
    }
  }

  // Initialise l'état pour continuer une candidature existante
  async initializeContinueCandidature(nupcan: string): Promise<CandidatureState> {
    try {
      // Récupérer les données du candidat
      const candidatResponse = await apiService.getCandidatByNupcan(nupcan);
      
      if (!candidatResponse.data) {
        throw new Error('Candidature non trouvée');
      }

      // Récupérer ou créer la progression
      let progression = candidatureProgressService.getProgress(nupcan);
      if (!progression) {
        progression = candidatureProgressService.createInitialProgress();
        candidatureProgressService.markStepComplete(nupcan, 'inscription');
        progression = candidatureProgressService.getProgress(nupcan);
      }

      return {
        identifier: nupcan,
        type: 'continue',
        progression,
        candidatData: candidatResponse.data
      };
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la candidature continue:', error);
      throw error;
    }
  }

  // Met à jour la progression d'une candidature
  updateProgression(identifier: string, etape: 'documents' | 'paiement' | 'termine'): void {
    candidatureProgressService.markStepComplete(identifier, etape);
  }

  // Récupère l'état actuel d'une candidature
  getCurrentState(identifier: string, type: 'new' | 'continue'): CandidatureState {
    const progression = candidatureProgressService.getProgress(identifier);
    
    return {
      identifier,
      type,
      progression
    };
  }
}

export const candidatureStateManager = new CandidatureStateManagerService();
