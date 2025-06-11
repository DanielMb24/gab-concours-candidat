
const API_BASE_URL = 'https://gabcnc.labodev.link/api';

export interface Concours {
  id: string;
  nom: string;
  etablissement: string;
  filiere: string;
  niveau: string;
  date_debut_inscription: string;
  date_fin_inscription: string;
  date_epreuve: string;
  matiere?: string[];
  session: string;
  description?: string;
  frais_inscription?: number;
  documents_requis?: string[];
}

export interface Candidat {
  nom: string;
  prenom: string;
  date_naissance: string;
  telephone: string;
  email: string;
  province: string;
  nip?: string;
}

export interface Candidature {
  id: string;
  candidat: Candidat;
  concours_id: string;
  statut: string;
  documents_soumis: string[];
  date_soumission: string;
  numero_candidature: string;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error ${response.status}:`, errorText);
        throw new Error(`Erreur API: ${response.status} - ${errorText}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      } else {
        throw new Error('Réponse API invalide');
      }
    } catch (error) {
      console.error('Erreur de connexion à l\'API:', error);
      throw error;
    }
  }

  // Récupérer tous les concours
  async getConcours(): Promise<Concours[]> {
    try {
      return await this.request<Concours[]>('/concours');
    } catch (error) {
      console.error('Erreur lors de la récupération des concours:', error);
      // Retourner des données de test en cas d'erreur
      return [];
    }
  }

  // Récupérer un concours par ID
  async getConcoursById(id: string): Promise<Concours> {
    try {
      return await this.request<Concours>(`/concours/${id}`);
    } catch (error) {
      console.error('Erreur lors de la récupération du concours:', error);
      throw error;
    }
  }

  // Récupérer les informations du candidat via NIP
  async getCandidatByNip(nip: string): Promise<Candidat> {
    try {
      return await this.request<Candidat>(`/candidat/nip/${nip}`);
    } catch (error) {
      console.error('Erreur lors de la récupération du candidat:', error);
      throw error;
    }
  }

  // Créer une candidature
  async createCandidature(candidature: Omit<Candidature, 'id' | 'date_soumission' | 'numero_candidature'>): Promise<Candidature> {
    try {
      return await this.request<Candidature>('/candidature', {
        method: 'POST',
        body: JSON.stringify(candidature),
      });
    } catch (error) {
      console.error('Erreur lors de la création de la candidature:', error);
      throw error;
    }
  }

  // Récupérer une candidature par numéro
  async getCandidatureByNumero(numero: string): Promise<Candidature> {
    try {
      return await this.request<Candidature>(`/candidature/${numero}`);
    } catch (error) {
      console.error('Erreur lors de la récupération de la candidature:', error);
      throw error;
    }
  }

  // Upload de documents
  async uploadDocument(candidatureId: string, document: File, type: string): Promise<{ url: string }> {
    try {
      const formData = new FormData();
      formData.append('document', document);
      formData.append('type', type);

      const response = await fetch(`${API_BASE_URL}/candidature/${candidatureId}/documents`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erreur upload: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Erreur lors de l\'upload du document:', error);
      throw error;
    }
  }

  // Initier le paiement
  async initierPaiement(candidatureId: string, methode: 'airtel' | 'moov', numero: string): Promise<{ transaction_id: string; instructions: string }> {
    try {
      return await this.request(`/paiement/initier`, {
        method: 'POST',
        body: JSON.stringify({
          candidature_id: candidatureId,
          methode_paiement: methode,
          numero_telephone: numero,
        }),
      });
    } catch (error) {
      console.error('Erreur lors de l\'initiation du paiement:', error);
      throw error;
    }
  }

  // Vérifier le statut du paiement
  async verifierPaiement(transactionId: string): Promise<{ statut: 'en_cours' | 'success' | 'echec' }> {
    try {
      return await this.request(`/paiement/status/${transactionId}`);
    } catch (error) {
      console.error('Erreur lors de la vérification du paiement:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
