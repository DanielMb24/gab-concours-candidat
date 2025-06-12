// Types pour toutes les entités du système
export interface AuthentifieSession {
  id: number;
  candidat_id: number;
  token: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface Candidat {
  id: number;
  niveau_id: number;
  niveau_nomniv?: string;
  nipcan: string;
  nomcan: string;
  prncan: string;
  maican: string;
  dtncan: string;
  nupcan?: string;
  telcan: string;
  phtcan?: string;
  proorg: number;
  proact: number;
  proaff: number;
  ldncan: string;
  created_at: string;
  updated_at: string;
}

export interface Composer {
  id: number;
  concours_id: number;
  matiere_id: number;
  coefficient: number;
  duree: number;
  created_at: string;
  updated_at: string;
}

export interface Composition {
  id: number;
  participation_id: number;
  matiere_id: number;
  note: number;
  copie_url?: string;
  created_at: string;
  updated_at: string;
}

// Interface mise à jour pour correspondre à la structure de l'API
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
  type?: string; // Type de document pour les pages
  nom_fichier?: string; // Nom du fichier pour les pages
  statut?: 'en_attente' | 'valide' | 'rejete'; // Statut pour les pages
  created_at: string;
  updated_at: string;
}

export interface Dossier {
  id: number;
  concour_id: string;
  docdsr: string;
  document_id: number;
  nipcan: string;
  created_at: string;
  updated_at: string;
}

export interface MessagerieElectronique {
  id: number;
  expediteur_id: number;
  destinataire_id: number;
  sujet: string;
  message: string;
  lu: boolean;
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

export interface EtsFiliere {
  id: number;
  etablissement_id: number;
  filiere_id: number;
  created_at: string;
  updated_at: string;
}

export interface Filiere {
  id: number;
  nom: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Liste {
  id: number;
  concours_id: number;
  candidat_id: number;
  rang: number;
  statut: 'admis' | 'liste_attente' | 'elimine';
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

export interface Niveau {
  id: number;
  nom: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Participation {
  id: number;
  candidat_id: number;
  concours_id: number;
  stspar: number;
  numero_candidature?: string; // Pour les pages qui en ont besoin
  statut?: 'inscrit' | 'paye' | 'valide' | 'en_attente'; // Types étendus pour couvrir tous les cas
  created_at: string;
  updated_at: string;
}

export interface Paiement {
  id: number;
  candidat_id: number;
  mntfrai: string;
  datfrai: string;
  montant?: number; // Pour les pages qui en ont besoin
  reference?: string; // Pour les pages qui en ont besoin
  statut?: 'en_attente' | 'valide' | 'rejete'; // Pour les pages qui en ont besoin
  created_at: string;
  updated_at: string;
}

export interface Photo {
  id: number;
  candidat_id: number;
  url: string;
  statut: 'en_attente' | 'valide' | 'rejete';
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

export interface Jeton {
  id: number;
  candidat_id: number;
  token: string;
  type: 'reset_password' | 'email_verification';
  expires_at: string;
  used: boolean;
  created_at: string;
  updated_at: string;
}

export interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: 'admin' | 'gestionnaire' | 'candidat';
  statut: 'actif' | 'inactif';
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

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// Interface pour la réponse directe de l'API concours
export interface ConcoursApiResponse {
  data: Concours[];
}
