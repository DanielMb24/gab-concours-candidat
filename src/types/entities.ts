// Types pour toutes les entités du système selon l'API gabcnc.labodev.link

export interface Candidat {
  id: number;
  niveau_id: number;
  niveau_nomniv?: string;
  nipcan: number | string;
  nomcan: string;
  prncan: string;
  maican: string;
  dtncan: string;
  nupcan?: string; // Numéro unique de candidature généré
  telcan: string;
  phtcan?: string;
  proorg: number;
  proact: number;
  proaff: number;
  ldncan: string;
  created_at: string;
  updated_at: string;
  // Propriétés additionnelles pour l'admin
  participations_count?: number;
  statut?: string;
}

export interface Concours {
  id: number;
  etablissement_id: string;
  etablissement_nomets: string;
  etablissement_photo: string;
  niveau_id: string;
  niveau_nomniv: string;
  libcnc: string; // nom du concours
  sescnc: string; // session
  debcnc: string; // date début
  fincnc: string; // date fin
  stacnc: string; // statut (1=ouvert, 2=fermé, 3=terminé)
  agecnc: string; // âge limite
  fracnc: string; // frais inscription
  etddos: string; // état dossier
}

export interface Document {
  id: number;
  nomdoc: string;
  created_at: string;
  updated_at: string;
}

export interface Dossier {
  id: number;
  concour_id: string;
  docdsr: string;
  document_id: number;
  nupcan: string;
  created_at: string;
  updated_at: string;
}

export interface Participation {
  id: number;
  candidat_id: number;
  concours_id: number;
  stspar: number;
  created_at: string;
  updated_at: string;
}

export interface Paiement {
  id: number;
  candidat_id: number;
  mntfrai: string;
  datfrai: string;
  montant?: number;
  reference?: string;
  statut?: 'en_attente' | 'valide' | 'rejete';
  methode?: 'mobile_money' | 'virement' | 'especes';
  candidat_nom?: string;
  candidat_nip?: string;
  concours?: string;
  date_paiement?: string;
  created_at: string;
  updated_at: string;
}

export interface Province {
  id: number;
  nompro: string;
  cdepro: string;
  created_at?: string;
  updated_at?: string;
}

export interface Niveau {
  id: number;
  nom: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Etablissement {
  id: number;
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  province_id: number;
  created_at: string;
  updated_at: string;
}

// Types pour les réponses API
export interface ApiResponse<T> {
  success?: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface ConcoursApiResponse {
  data: Concours[];
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// Types pour les autres entités qui peuvent être nécessaires
export interface Filiere {
  id: number;
  nom: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Matiere {
  id: number;
  nom: string;
  description: string;
  created_at: string;
  updated_at: string;
}

// Types additionnels pour l'interface utilisateur
export interface DocumentOption {
  value: string;
  label: string;
  required: boolean;
}
export interface DocumentOption {
  value: string;
  label: string;
  required: boolean;
}