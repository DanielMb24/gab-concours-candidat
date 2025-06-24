
export type RouteType = 'new-candidature' | 'continue-candidature';

export interface RouteParams {
  candidatureId?: string;
  nupcan?: string;
  concoursId?: string;
}

class RouteManagerService {
  // Détermine le type de route basé sur les paramètres
  getRouteType(params: RouteParams): RouteType {
    if (params.nupcan) {
      return 'continue-candidature';
    }
    return 'new-candidature';
  }

  // Génère les URLs pour les différentes étapes
  getDocumentsUrl(params: RouteParams): string {
    const routeType = this.getRouteType(params);
    if (routeType === 'continue-candidature') {
      return `/documents/continue/${encodeURIComponent(params.nupcan!)}`;
    }
    return `/documents/${encodeURIComponent(params.candidatureId!)}`;
  }

  getPaiementUrl(params: RouteParams): string {
    const routeType = this.getRouteType(params);
    if (routeType === 'continue-candidature') {
      return `/paiement/continue/${encodeURIComponent(params.nupcan!)}`;
    }
    return `/paiement/${encodeURIComponent(params.candidatureId!)}`;
  }

  getSuccesUrl(params: RouteParams): string {
    const routeType = this.getRouteType(params);
    if (routeType === 'continue-candidature') {
      return `/succes/continue/${encodeURIComponent(params.nupcan!)}`;
    }
    return `/succes/${encodeURIComponent(params.candidatureId!)}`;
  }

  getStatutUrl(nupcan: string): string {
    return `/statut/${encodeURIComponent(nupcan)}`;
  }

  // Extrait l'identifiant selon le type de route
  getIdentifier(params: RouteParams): string {
    const routeType = this.getRouteType(params);
    if (routeType === 'continue-candidature') {
      return params.nupcan!;
    }
    return params.candidatureId!;
  }
}

export const routeManager = new RouteManagerService();
