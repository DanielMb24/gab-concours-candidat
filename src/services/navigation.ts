
import { toast } from '@/hooks/use-toast';

export type RouteType = 
  | 'home'
  | 'concours'
  | 'candidature'
  | 'confirmation'
  | 'statut'
  | 'documents'
  | 'paiement'
  | 'succes'
  | 'connexion'
  | 'admin'
  | 'not-found';

interface NavigationRoute {
  path: string;
  title: string;
  requiresAuth?: boolean;
  requiresNupcan?: boolean;
}

const routes: Record<RouteType, NavigationRoute> = {
  home: { path: '/', title: 'Accueil' },
  concours: { path: '/concours', title: 'Concours disponibles' },
  candidature: { path: '/candidature/:concoursId', title: 'Candidature', requiresAuth: false },
  confirmation: { path: '/confirmation/:numeroCandidature', title: 'Confirmation', requiresNupcan: true },
  statut: { path: '/statut/:nupcan', title: 'Statut candidature', requiresNupcan: true },
  documents: { path: '/documents/:nupcan', title: 'Documents', requiresNupcan: true },
  paiement: { path: '/paiement/:nupcan', title: 'Paiement', requiresNupcan: true },
  succes: { path: '/succes/:nupcan', title: 'Succès', requiresNupcan: true },
  connexion: { path: '/connexion', title: 'Connexion' },
  admin: { path: '/admin', title: 'Administration', requiresAuth: true },
  'not-found': { path: '/404', title: 'Page non trouvée' }
};

class NavigationService {
  // Valider un NUPCAN
  validateNupcan(nupcan: string): boolean {
    if (!nupcan || typeof nupcan !== 'string') {
      return false;
    }
    
    // Le NUPCAN doit contenir au moins des caractères alphanumériques
    const nupcanRegex = /^[A-Za-z0-9_-]+$/;
    return nupcanRegex.test(nupcan) && nupcan.length >= 5;
  }

  // Construire une URL sécurisée
  buildUrl(routeType: RouteType, params?: Record<string, string>): string {
    let path = routes[routeType].path;
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (routeType === 'statut' || routeType === 'documents' || 
            routeType === 'paiement' || routeType === 'succes') {
          if (key === 'nupcan' && !this.validateNupcan(value)) {
            console.error('NUPCAN invalide:', value);
            throw new Error('Numéro de candidature invalide');
          }
        }
        path = path.replace(`:${key}`, encodeURIComponent(value));
      });
    }
    
    return path;
  }

  // Navigation sécurisée
  navigateTo(navigate: (path: string) => void, routeType: RouteType, params?: Record<string, string>): void {
    try {
      const url = this.buildUrl(routeType, params);
      navigate(url);
    } catch (error) {
      console.error('Erreur de navigation:', error);
      toast({
        title: "Erreur de navigation",
        description: "Impossible d'accéder à cette page. Vérifiez votre numéro de candidature.",
        variant: "destructive",
      });
      navigate('/');
    }
  }

  // Vérifier si une route existe
  routeExists(path: string): boolean {
    const routeValues = Object.values(routes);
    return routeValues.some(route => {
      // Convertir les paramètres en regex pour la vérification
      const regexPath = route.path.replace(/:[^/]+/g, '[^/]+');
      const regex = new RegExp(`^${regexPath}$`);
      return regex.test(path);
    });
  }

  // Obtenir le titre d'une route
  getRouteTitle(routeType: RouteType): string {
    return routes[routeType].title;
  }

  // Vérifier les permissions d'une route
  canAccess(routeType: RouteType, userContext?: { isAuthenticated: boolean; nupcan?: string }): boolean {
    const route = routes[routeType];
    
    if (route.requiresAuth && !userContext?.isAuthenticated) {
      return false;
    }
    
    if (route.requiresNupcan && !userContext?.nupcan) {
      return false;
    }
    
    return true;
  }
}

export const navigationService = new NavigationService();
