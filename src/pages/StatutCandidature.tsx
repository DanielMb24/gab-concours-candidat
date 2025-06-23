
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, FileText, CreditCard, User } from 'lucide-react';
import Layout from '@/components/Layout';
import { apiService } from '@/services/api';

type EtapeType = 'inscription' | 'documents' | 'paiement' | 'termine';

interface CandidatWithParticipations {
  id: number;
  nupcan: string;
  nomcan: string;
  prncan: string;
  maican: string;
  telcan: string;
  dtncan: string;
  participations?: Array<{
    id: number;
    libcnc: string;
    nomets: string;
    statut: string;
  }>;
}

const StatutCandidature = () => {
  const { nupcan } = useParams<{ nupcan: string }>();
  const navigate = useNavigate();

  const { data: candidatResponse, isLoading } = useQuery({
    queryKey: ['candidat-nupcan', nupcan],
    queryFn: () => apiService.getCandidatByNupcan(nupcan!),
    enabled: !!nupcan,
  });

  const candidat = candidatResponse?.data as CandidatWithParticipations | undefined;

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">Chargement de votre candidature...</div>
        </div>
      </Layout>
    );
  }

  if (!candidat) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Candidature non trouvée</h1>
            <p className="text-muted-foreground mb-6">
              Aucune candidature trouvée avec ce numéro : {nupcan}
            </p>
            <Button onClick={() => navigate('/connexion')}>
              Réessayer la connexion
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Déterminer l'étape actuelle
  const getEtapeActuelle = (): EtapeType => {
    if (candidat) {
      // TODO: Vérifier s'il a des documents uploadés
      // TODO: Vérifier s'il a payé
      return 'documents'; // Pour l'instant, on considère qu'il doit upload ses documents
    }
    return 'inscription';
  };

  const etapeActuelle = getEtapeActuelle();

  const etapes = [
    {
      id: 'inscription' as const,
      nom: 'Inscription',
      statut: 'termine' as const,
      icone: User,
      description: 'Informations personnelles enregistrées'
    },
    {
      id: 'documents' as const,
      nom: 'Documents',
      statut: (etapeActuelle === 'documents' ? 'en-cours' : 
               (etapeActuelle === 'paiement' || etapeActuelle === 'termine' ? 'termine' : 'attente')) as const,
      icone: FileText,
      description: 'Upload des documents requis'
    },
    {
      id: 'paiement' as const,
      nom: 'Paiement',
      statut: (etapeActuelle === 'paiement' ? 'en-cours' : 
               (etapeActuelle === 'termine' ? 'termine' : 'attente')) as const,
      icone: CreditCard,
      description: 'Paiement des frais de candidature'
    }
  ];

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'termine': return 'bg-green-500';
      case 'en-cours': return 'bg-blue-500';
      default: return 'bg-gray-300';
    }
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'termine': return <Badge className="bg-green-500">Terminé</Badge>;
      case 'en-cours': return <Badge className="bg-blue-500">En cours</Badge>;
      default: return <Badge variant="secondary">En attente</Badge>;
    }
  };

  const continuerCandidature = () => {
    if (etapeActuelle === 'documents') {
      navigate(`/documents/${nupcan}`);
    } else if (etapeActuelle === 'paiement') {
      navigate(`/paiement/${nupcan}`);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            État de votre candidature
          </h1>
          <p className="text-muted-foreground">
            Numéro de candidature : <span className="font-mono font-semibold">{nupcan}</span>
          </p>
        </div>

        {/* Informations du candidat */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Vos informations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nom complet</p>
                <p className="font-semibold">{candidat.prncan} {candidat.nomcan}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold">{candidat.maican}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Téléphone</p>
                <p className="font-semibold">{candidat.telcan}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date de naissance</p>
                <p className="font-semibold">{new Date(candidat.dtncan).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Concours inscrits */}
        {candidat.participations && candidat.participations.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Concours inscrits</CardTitle>
            </CardHeader>
            <CardContent>
              {candidat.participations.map((participation) => (
                <div key={participation.id} className="p-4 border rounded-lg">
                  <h3 className="font-semibold">{participation.libcnc}</h3>
                  <p className="text-sm text-muted-foreground">{participation.nomets}</p>
                  <Badge className="mt-2" variant={participation.statut === 'inscrit' ? 'default' : 'secondary'}>
                    {participation.statut}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Progression */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Progression de votre candidature</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {etapes.map((etape, index) => {
                const Icone = etape.icone;
                return (
                  <div key={etape.id} className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatutColor(etape.statut)}`}>
                      {etape.statut === 'termine' ? (
                        <CheckCircle className="h-5 w-5 text-white" />
                      ) : (
                        <Icone className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{etape.nom}</h3>
                        {getStatutBadge(etape.statut)}
                      </div>
                      <p className="text-sm text-muted-foreground">{etape.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="text-center space-x-4">
          <Button
            onClick={continuerCandidature}
            className="bg-primary hover:bg-primary/90"
            disabled={etapeActuelle === 'termine'}
          >
            {etapeActuelle === 'documents' && 'Continuer - Upload documents'}
            {etapeActuelle === 'paiement' && 'Continuer - Effectuer le paiement'}
            {etapeActuelle === 'termine' && 'Candidature terminée'}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/concours')}
          >
            Voir les autres concours
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default StatutCandidature;
