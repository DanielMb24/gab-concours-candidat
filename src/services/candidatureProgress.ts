
export type EtapeType = 'inscription' | 'documents' | 'paiement' | 'termine';

export interface ProgressionStatus {
  etapeActuelle: EtapeType;
  etapesCompletes: EtapeType[];
  documentsUploads: boolean;
  paiementEffectue: boolean;
  dateInscription: string;
  dernierAcces: string;
  candidatId?: number;
  concoursId?: number;
  version: string; // Pour gérer les migrations
}

class CandidatureProgressService {
  private readonly CURRENT_VERSION = '1.1';
  
  private getStorageKey(nupcan: string): string {
    return `candidature_progress_${nupcan}`;
  }

  // Sauvegarder la progression avec validation
  saveProgress(nupcan: string, status: ProgressionStatus): void {
    try {
      if (!nupcan || typeof nupcan !== 'string') {
        throw new Error('NUPCAN invalide');
      }

      const data: ProgressionStatus = {
        ...status,
        dernierAcces: new Date().toISOString(),
        version: this.CURRENT_VERSION
      };

      localStorage.setItem(this.getStorageKey(nupcan), JSON.stringify(data));
      console.log('Progress saved for', nupcan, data);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  }

  // Récupérer la progression avec migration si nécessaire
  getProgress(nupcan: string): ProgressionStatus | null {
    try {
      if (!nupcan || typeof nupcan !== 'string') {
        return null;
      }

      const stored = localStorage.getItem(this.getStorageKey(nupcan));
      if (!stored) {
        console.log('No progress found for', nupcan);
        return null;
      }
      
      const progress = JSON.parse(stored) as ProgressionStatus;
      
      // Migration si nécessaire
      if (!progress.version || progress.version !== this.CURRENT_VERSION) {
        const migratedProgress = this.migrateProgress(progress);
        this.saveProgress(nupcan, migratedProgress);
        return migratedProgress;
      }
      
      console.log('Progress retrieved for', nupcan, progress);
      return progress;
    } catch (error) {
      console.error('Error parsing progress for', nupcan, error);
      // En cas d'erreur, nettoyer les données corrompues
      localStorage.removeItem(this.getStorageKey(nupcan));
      return null;
    }
  }

  // Migration des anciennes versions
  private migrateProgress(oldProgress: any): ProgressionStatus {
    return {
      etapeActuelle: oldProgress.etapeActuelle || 'inscription',
      etapesCompletes: oldProgress.etapesCompletes || [],
      documentsUploads: oldProgress.documentsUploads || false,
      paiementEffectue: oldProgress.paiementEffectue || false,
      dateInscription: oldProgress.dateInscription || new Date().toISOString(),
      dernierAcces: new Date().toISOString(),
      candidatId: oldProgress.candidatId,
      concoursId: oldProgress.concoursId,
      version: this.CURRENT_VERSION
    };
  }

  // Marquer une étape comme complète avec validation
  markStepComplete(nupcan: string, etape: EtapeType): boolean {
    try {
      let current = this.getProgress(nupcan);
      if (!current) {
        current = this.createInitialProgress();
      }
      
      // Valider la séquence des étapes
      if (!this.canCompleteStep(current, etape)) {
        console.warn(`Cannot complete step ${etape} - prerequisites not met`);
        return false;
      }
      
      if (!current.etapesCompletes.includes(etape)) {
        current.etapesCompletes.push(etape);
      }
      
      // Mettre à jour les flags spécifiques
      if (etape === 'documents') {
        current.documentsUploads = true;
      }
      if (etape === 'paiement') {
        current.paiementEffectue = true;
      }
      
      // Déterminer la prochaine étape
      current.etapeActuelle = this.getNextStep(current.etapesCompletes);
      
      this.saveProgress(nupcan, current);
      return true;
    } catch (error) {
      console.error('Error marking step complete:', error);
      return false;
    }
  }

  // Valider si une étape peut être complétée
  private canCompleteStep(progress: ProgressionStatus, etape: EtapeType): boolean {
    switch (etape) {
      case 'inscription':
        return true; // Toujours possible
      case 'documents':
        return progress.etapesCompletes.includes('inscription');
      case 'paiement':
        return progress.etapesCompletes.includes('documents');
      default:
        return false;
    }
  }

  // Créer une progression initiale
  createInitialProgress(): ProgressionStatus {
    return {
      etapeActuelle: 'inscription',
      etapesCompletes: [],
      documentsUploads: false,
      paiementEffectue: false,
      dateInscription: new Date().toISOString(),
      dernierAcces: new Date().toISOString(),
      version: this.CURRENT_VERSION
    };
  }

  // Déterminer la prochaine étape
  private getNextStep(etapesCompletes: EtapeType[]): EtapeType {
    if (!etapesCompletes.includes('inscription')) {
      return 'inscription';
    }
    if (!etapesCompletes.includes('documents')) {
      return 'documents';
    }
    if (!etapesCompletes.includes('paiement')) {
      return 'paiement';
    }
    return 'termine';
  }

  // Vérifier si une étape est complète
  isStepComplete(nupcan: string, etape: EtapeType): boolean {
    const progress = this.getProgress(nupcan);
    return progress?.etapesCompletes.includes(etape) || false;
  }

  // Obtenir le pourcentage de completion
  getCompletionPercentage(nupcan: string): number {
    const progress = this.getProgress(nupcan);
    if (!progress) return 0;
    
    const totalSteps = 3; // inscription, documents, paiement
    const completedSteps = progress.etapesCompletes.length;
    return Math.round((completedSteps / totalSteps) * 100);
  }

  // Initialiser la progression après inscription
  initializeProgressAfterInscription(nupcan: string, candidatId?: number, concoursId?: number): void {
    const progress = this.createInitialProgress();
    progress.etapesCompletes = ['inscription'];
    progress.etapeActuelle = 'documents';
    if (candidatId) progress.candidatId = candidatId;
    if (concoursId) progress.concoursId = concoursId;
    this.saveProgress(nupcan, progress);
  }

  // Nettoyer les progressions expirées (plus de 30 jours)
  cleanupExpiredProgress(): void {
    try {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith('candidature_progress_')
      );
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      keys.forEach(key => {
        try {
          const stored = localStorage.getItem(key);
          if (stored) {
            const progress = JSON.parse(stored) as ProgressionStatus;
            const lastAccess = new Date(progress.dernierAcces);
            
            if (lastAccess < thirtyDaysAgo) {
              localStorage.removeItem(key);
              console.log('Cleaned up expired progress:', key);
            }
          }
        } catch (error) {
          // Nettoyer les données corrompues
          localStorage.removeItem(key);
          console.log('Cleaned up corrupted progress:', key);
        }
      });
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }

  // Réinitialiser complètement une progression
  resetProgress(nupcan: string): void {
    localStorage.removeItem(this.getStorageKey(nupcan));
    console.log('Progress reset for', nupcan);
  }
}

export const candidatureProgressService = new CandidatureProgressService();

// Nettoyer automatiquement au démarrage
candidatureProgressService.cleanupExpiredProgress();
