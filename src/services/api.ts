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
  Dossier,
  PaginatedResponse
} from '@/types/entities';

// Utiliser le backend local
const API_BASE_URL = 'http://localhost:3002/api';

interface ConcoursFormData {
  libcnc: string;
  sescnc: string;
  debcnc: string;
  fincnc: string;
  fracnc: string;
  etablissement_id: string;
  stacnc: string;
  niveau_id?: string;
  agecnc?: string;
  etddos?: string;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Accept': 'application/json',
        ...options?.headers,
      },
      ...options,
    };

    // Ne pas ajouter Content-Type pour FormData
    if (!(options?.body instanceof FormData) && !config.headers?.['Content-Type']) {
      config.headers = {
        ...config.headers,
        'Content-Type': 'application/json',
      };
    }

    console.log(`API Request: ${config.method || 'GET'} ${url}`);

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error: ${response.status} ${response.statusText}`, errorText);
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

  async createConcours(data: ConcoursFormData): Promise<ApiResponse<Concours>> {
    return this.request('/concours', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteConcours(id: number): Promise<ApiResponse<any>> {
    return this.request(`/concours/${id}`, {
      method: 'DELETE',
    });
  }

  // Candidat endpoints
  async getCandidats(): Promise<ApiResponse<Candidat[]>> {
    return this.request('/candidats');
  }

  async createCandidat(data: {
    niveau_id: number;
    nipcan?: string;
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

  async getCandidatByNip(nip: string): Promise<ApiResponse<Candidat>> {
    return this.request(`/candidats/nip/${nip}`);
  }

  async getCandidatByNupcan(nupcan: string): Promise<ApiResponse<Candidat>> {
    return this.request(`/candidats/nupcan/${encodeURIComponent(nupcan)}`);
  }

  // Etudiant endpoints (pour l'inscription complète avec concours)
  async createEtudiant(data: FormData): Promise<ApiResponse<Candidat>> {
    console.log('Envoi des données FormData pour création étudiant');
    return this.request('/etudiants', {
      method: 'POST',
      body: data,
    });
  }

  // Document endpoints
  async createDocument(data: { nomdoc: string }): Promise<ApiResponse<Document>> {
    return this.request('/documents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Dossier endpoints (upload de fichiers)
  async createDossier(data: FormData): Promise<ApiResponse<Dossier[]>> {
    return this.request('/dossiers', {
      method: 'POST',
      body: data,
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

  async getPaiementsByCandidat(candidatId: number): Promise<ApiResponse<Paiement[]>> {
    return this.request(`/paiements/candidat/${candidatId}`);
  }

  async getPaiements(): Promise<ApiResponse<Paiement[]>> {
    return this.request('/paiements');
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

  async createEtablissement(data: {
    nom: string;
    adresse: string;
    telephone: string;
    email: string;
    province_id: number;
  }): Promise<ApiResponse<Etablissement>> {
    return this.request('/etablissements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteEtablissement(id: number): Promise<ApiResponse<any>> {
    return this.request(`/etablissements/${id}`, {
      method: 'DELETE',
    });
  }

  // Statistics endpoints
  async getStatistics(): Promise<ApiResponse<{
    candidats: number;
    concours: number;
    etablissements: number;
    participations: number;
    paiements: number;
  }>> {
    return this.request('/statistics');
  }

  // Session simulation locale
  async createSession(candidatureId: string): Promise<{ sessionId: string; candidatureId: string }> {
    const sessionId = `session_${Date.now()}_${candidatureId}`;
    localStorage.setItem('gabconcours_session', JSON.stringify({
      sessionId,
      candidatureId,
      createdAt: new Date().toISOString()
    }));
    return { sessionId, candidatureId };
  }

  getSession(): { sessionId: string; candidatureId: string } | null {
    const session = localStorage.getItem('gabconcours_session');
    return session ? JSON.parse(session) : null;
  }

  clearSession(): void {
    localStorage.removeItem('gabconcours_session');
  }
}

export const apiService = new ApiService();
export default apiService;