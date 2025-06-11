
import { 
  Concours, 
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
  PaginatedResponse
} from '@/types/entities';

const API_BASE_URL = 'https://gabcnc.labodev.link/api';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options?.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }

  // Concours endpoints
  async getConcours(): Promise<ApiResponse<PaginatedResponse<Concours>>> {
    return this.request('/concours');
  }

  async getConcoursById(id: number): Promise<ApiResponse<Concours>> {
    return this.request(`/concours/${id}`);
  }

  async getConcoursActifs(): Promise<ApiResponse<Concours[]>> {
    return this.request('/concours?statut=ouvert');
  }

  // Candidat endpoints
  async createCandidat(data: Partial<Candidat>): Promise<ApiResponse<Candidat>> {
    return this.request('/candidats', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCandidatById(id: number): Promise<ApiResponse<Candidat>> {
    return this.request(`/candidats/${id}`);
  }

  async updateCandidat(id: number, data: Partial<Candidat>): Promise<ApiResponse<Candidat>> {
    return this.request(`/candidats/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Participation endpoints
  async createParticipation(data: Partial<Participation>): Promise<ApiResponse<Participation>> {
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

  // Document endpoints
  async uploadDocument(candidatId: number, file: File, type: string): Promise<ApiResponse<Document>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('candidat_id', candidatId.toString());
    formData.append('type', type);

    return this.request('/documents', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type for FormData
    });
  }

  async getDocumentsByCandidat(candidatId: number): Promise<ApiResponse<Document[]>> {
    return this.request(`/candidats/${candidatId}/documents`);
  }

  // Paiement endpoints
  async createPaiement(data: Partial<Paiement>): Promise<ApiResponse<Paiement>> {
    return this.request('/paiements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPaiementByParticipation(participationId: number): Promise<ApiResponse<Paiement>> {
    return this.request(`/participations/${participationId}/paiement`);
  }

  // Etablissement endpoints
  async getEtablissements(): Promise<ApiResponse<Etablissement[]>> {
    return this.request('/etablissements');
  }

  async getEtablissementById(id: number): Promise<ApiResponse<Etablissement>> {
    return this.request(`/etablissements/${id}`);
  }

  // Filiere endpoints
  async getFilieres(): Promise<ApiResponse<Filiere[]>> {
    return this.request('/filieres');
  }

  async getFiliereById(id: number): Promise<ApiResponse<Filiere>> {
    return this.request(`/filieres/${id}`);
  }

  // Niveau endpoints
  async getNiveaux(): Promise<ApiResponse<Niveau[]>> {
    return this.request('/niveaux');
  }

  async getNiveauById(id: number): Promise<ApiResponse<Niveau>> {
    return this.request(`/niveaux/${id}`);
  }

  // Province endpoints
  async getProvinces(): Promise<ApiResponse<Province[]>> {
    return this.request('/provinces');
  }

  async getProvinceById(id: number): Promise<ApiResponse<Province>> {
    return this.request(`/provinces/${id}`);
  }

  // Matiere endpoints
  async getMatieres(): Promise<ApiResponse<Matiere[]>> {
    return this.request('/matieres');
  }

  async getMatiereById(id: number): Promise<ApiResponse<Matiere>> {
    return this.request(`/matieres/${id}`);
  }

  async getMatieresByConcours(concoursId: number): Promise<ApiResponse<Matiere[]>> {
    return this.request(`/concours/${concoursId}/matieres`);
  }

  // Authentication endpoints
  async login(email: string, password: string): Promise<ApiResponse<{ token: string; candidat: Candidat }>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(data: Partial<Candidat> & { password: string }): Promise<ApiResponse<{ token: string; candidat: Candidat }>> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<ApiResponse<null>> {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // Photo endpoints
  async uploadPhoto(candidatId: number, file: File): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('candidat_id', candidatId.toString());

    return this.request('/photos', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type for FormData
    });
  }
}

export const apiService = new ApiService();
export default apiService;
