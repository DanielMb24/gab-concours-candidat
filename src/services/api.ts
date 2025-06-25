import { useQuery } from "@tanstack/react-query";

class ApiService {
  constructor(baseURL = 'http://localhost:3002/api') {
    this.baseURL = baseURL;
  }

  async getNiveaux() {
    const response = await fetch(`${this.baseURL}/niveaux`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des niveaux');
    }
    return response.json();
  }

  async getEtablissements() {
    const response = await fetch(`${this.baseURL}/etablissements`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des établissements');
    }
    return response.json();
  }

  async getConcours() {
    const response = await fetch(`${this.baseURL}/concours`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des concours');
    }
    return response.json();
  }

  async createEtudiant(data: any) {
    const response = await fetch(`${this.baseURL}/etudiants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la création de l\'étudiant');
    }
    return response.json();
  }

  async updateEtudiant(id: string, data: any) {
    const response = await fetch(`${this.baseURL}/etudiants/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la mise à jour de l\'étudiant');
    }
    return response.json();
  }

  async getEtudiant(id: string) {
        const response = await fetch(`${this.baseURL}/etudiants/${id}`);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération de l\'étudiant');
        }
        return response.json();
    }

    async findEtudiantByNupcan(nupcan: string) {
      const response = await fetch(`${this.baseURL}/candidats/nupcan/${nupcan}`);
      if (!response.ok) {
          throw new Error('Erreur lors de la récupération du candidat par NUPCAN');
      }
      return response.json();
  }

  async createCandidat(data: any) {
    const response = await fetch(`${this.baseURL}/candidats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la création du candidat');
    }
    return response.json();
  }

  async updateCandidat(id: string, data: any) {
    const response = await fetch(`${this.baseURL}/candidats/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la mise à jour du candidat');
    }
    return response.json();
  }

  async getCandidat(id: string) {
    const response = await fetch(`${this.baseURL}/candidats/${id}`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération du candidat');
    }
    return response.json();
  }

  async createParticipation(data: any) {
    const response = await fetch(`${this.baseURL}/participations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la création de la participation');
    }
    return response.json();
  }

   // Méthodes pour les dossiers/documents
   async createDossier(formData: FormData) {
    const response = await fetch(`${this.baseURL}/dossiers`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de l\'upload des documents');
    }
    
    return response.json();
  }

  async getDossiers() {
    const response = await fetch(`${this.baseURL}/dossiers`);
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des dossiers');
    }
    
    return response.json();
  }

  async updateDocumentStatus(id: number, statut: string) {
    const response = await fetch(`${this.baseURL}/dossiers/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ statut }),
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour du statut');
    }
    
    return response.json();
  }
}

export const apiService = new ApiService();

export const useEtablissements = () => {
  return useQuery(['etablissements'], () => apiService.getEtablissements());
};

export const useConcours = () => {
  return useQuery(['concours'], () => apiService.getConcours());
};
