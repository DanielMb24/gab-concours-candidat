import { 
  Concours, 
  ConcoursApiResponse,
  Candidat, 
  Participation, 
  Document, 
  Paiement, 
  Etablissement, 
  Filiere, 
  Niveau, 
  Province,
  Matiere,
  ApiResponse,
  PaginatedResponse,
  Dossier
} from '@/types/entities';

// Utiliser le backend local au lieu de l'API externe
const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer 123', // Token de développement
        ...options?.headers,
      },
      ...options,
    };

    console.log(`API Request: ${config.method || 'GET'} ${url}`);
    
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`API Response:`, data);
    return data;
  }

  // Concours endpoints
  async getConcours(): Promise<ConcoursApiResponse> {
    return this.request('/concours');
  }

  async getConcoursById(id: number): Promise<ApiResponse<Concours>> {
    return this.request(`/concours/${id}`);
  }

  async createConcours(data: Partial<Concours>): Promise<ApiResponse<Concours>> {
    return this.request('/concours', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateConcours(id: number, data: Partial<Concours>): Promise<ApiResponse<Concours>> {
    return this.request(`/concours/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteConcours(id: number): Promise<ApiResponse<void>> {
    return this.request(`/concours/${id}`, {
      method: 'DELETE',
    });
  }

  // Candidat endpoints
  async createCandidat(data: {
    niveau_id: number;
    nipcan: string;
    nomcan: string;
    prncan: string;
    maican: string;
    dtncan: string;
    telcan: string;
    phtcan?: string;
    proorg: number;
    proact: number;
    proaff: number;
    ldncan: string;
  }): Promise<ApiResponse<Candidat>> {
    return this.request('/candidats', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCandidatById(id: number): Promise<ApiResponse<Candidat>> {
    return this.request(`/candidats/${id}`);
  }

  async getCandidatByNip(nip: string): Promise<ApiResponse<Candidat>> {
    return this.request(`/candidats/nip/${nip}`);
  }

  async updateCandidat(id: number, data: Partial<Candidat>): Promise<ApiResponse<Candidat>> {
    return this.request(`/candidats/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Etudiant endpoints (pour l'inscription complète)
  async createEtudiant(data: FormData): Promise<ApiResponse<Candidat>> {
    return this.request('/etudiants', {
      method: 'POST',
      body: data,
      headers: {
        'Authorization': 'Bearer 123',
      }, // Remove Content-Type for FormData
    });
  }

  // Participation endpoints
  async createParticipation(data: {
    concours_id: number;
    candidat_id: number;
    stspar: number;
  }): Promise<ApiResponse<Participation>> {
    return this.request('/participations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getParticipationById(id: number): Promise<ApiResponse<Participation>> {
    return this.request(`/participations/${id}`);
  }

  async getParticipationByNumero(numero: string): Promise<ApiResponse<Participation>> {
    return this.request(`/participations/numero/${numero}`);
  }

  async getParticipationsByCandidatId(candidatId: number): Promise<ApiResponse<Participation[]>> {
    return this.request(`/candidats/${candidatId}/participations`);
  }

  // Document endpoints
  async createDocument(data: { nomdoc: string }): Promise<ApiResponse<Document>> {
    return this.request('/documents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getDocumentsByParticipation(participationId: number): Promise<ApiResponse<Document[]>> {
    return this.request(`/participations/${participationId}/documents`);
  }

  // Méthode d'upload de documents
  async uploadDocument(participationId: number, file: File, type: string): Promise<ApiResponse<Document>> {
    const formData = new FormData();
    formData.append('concours_id', '1'); // À adapter
    formData.append('nipcan', 'temp'); // À adapter avec les vraies données
    formData.append('documents', file);
    formData.append('type', type);

    return this.request('/dossiers', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': 'Bearer 123',
      },
    }).then(response => {
      // Transformer la réponse pour correspondre au format attendu
      return {
        data: {
          id: Date.now(),
          nomdoc: file.name,
          type: type,
          nom_fichier: file.name,
          statut: 'en_attente' as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      };
    });
  }

  // Dossier endpoints
  async createDossier(data: FormData): Promise<ApiResponse<Dossier[]>> {
    return this.request('/dossiers', {
      method: 'POST',
      body: data,
      headers: {
        'Authorization': 'Bearer 123',
      },
    });
  }

  // Paiement endpoints
  async createPaiement(data: {
    candidat_id: number;
    mntfrai: string;
    datfrai: string;
  }): Promise<ApiResponse<Paiement>> {
    return this.request('/payements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPaiementByParticipation(participationId: number): Promise<ApiResponse<Paiement>> {
    return this.request(`/participations/${participationId}/paiement`);
  }

  async validatePaiement(paiementId: number): Promise<ApiResponse<Paiement>> {
    return this.request(`/paiements/${paiementId}/validate`, {
      method: 'POST',
    });
  }

  // Province endpoints
  async getProvinces(): Promise<ApiResponse<Province[]>> {
    return this.request('/provinces');
  }

  // Niveau endpoints
  async getNiveaux(): Promise<ApiResponse<Niveau[]>> {
    return this.request('/niveaux');
  }

  // Etablissement endpoints
  async getEtablissements(): Promise<ApiResponse<Etablissement[]>> {
    return this.request('/etablissements');
  }

  // Authentication/Session simulation
  async createSession(participationId: number): Promise<{ sessionId: string; participationId: number }> {
    // Simulation d'une session locale
    const sessionId = `session_${Date.now()}_${participationId}`;
    localStorage.setItem('gabconcours_session', JSON.stringify({
      sessionId,
      participationId,
      createdAt: new Date().toISOString()
    }));
    return { sessionId, participationId };
  }

  getSession(): { sessionId: string; participationId: number } | null {
    const session = localStorage.getItem('gabconcours_session');
    return session ? JSON.parse(session) : null;
  }

  clearSession(): void {
    localStorage.removeItem('gabconcours_session');
  }
}

export const apiService = new ApiService();
export default apiService;
