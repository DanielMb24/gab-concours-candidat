import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, FileText, CreditCard, User, AlertCircle, RefreshCw } from 'lucide-react';
import Layout from '@/components/Layout';
import { apiService } from '@/services/api';
import { candidatureProgressService, EtapeType } from '@/services/candidatureProgress';
import { toast } from '@/hooks/use-toast';
import { Candidat } from '@/types/entities';

const StatutCandidature = () => {
  const { nupcan } = useParams<{ nupcan: string }>();
  const navigate = useNavigate();
  const [progression, setProgression] = useState(candidatureProgressService.getProgress(nupcan || ''));

  const { data: candidatResponse, isLoading, refetch } = useQuery({
    queryKey: ['candidat-nupcan', nupcan],
    queryFn: () => apiService.getCandidatByNupcan(nupcan!),
    enabled: !!nupcan,
  });

  const candidat = candidatResponse?.data as Candidat | undefined;

  // Fonction pour rafraîchir le statut
  const refreshStatus = () => {
    if (!nupcan) return;
    
    const updatedProgression = candidatureProgressService.getProgress(nupcan);
    setProgression(updatedProgression);
    refetch();
    
    toast({
      title: "Statut mis à jour",
      description: "Votre progression a été actualisée",
    });
  };

  // Initialiser la progression si elle n'existe pas
  useEffect(() => {
    if (!nupcan || !candidat) return;
    
    let currentProgression = candidatureProgressService.getProgress(nupcan);
    if (!currentProgression) {
      // Première visite - initialiser la progression avec inscription complète
      candidatureProgressService.initializeProgressAfterInscription(nupcan);
      currentProgression = candidatureProgressService.getProgress(nupcan);
      setProgression(currentProgression);
    }
  }, [nupcan, candidat]);

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Chargement de votre candidature...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!candidat) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-600 mb-4">Candidature non trouvée</h1>
            <p className="text-muted-foreground mb-6">
              Aucune candidature trouvée avec ce numéro : {nupcan}
            </p>
            <div className="space-x-4">
              <Button onClick={() => navigate('/connexion')}>
                Réessayer la connexion
              </Button>
              <Button variant="outline" onClick={() => navigate('/concours')}>
                Voir les concours
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const etapeActuelle = progression?.etapeActuelle || 'documents';
  const etapesCompletes = progression?.etapesCompletes || ['inscription'];
  const completionPercentage = candidatureProgressService.getCompletionPercentage(nupcan!);

  const etapes = [
    {
      id: 'inscription' as EtapeType,
      nom: 'Inscription',
      statut: etapesCompletes.includes('inscription') ? 'termine' : 
               etapeActuelle === 'inscription' ? 'en-cours' : 'attente',
      icone: User,
      description: 'Informations personnelles enregistrées'
    },
    {
      id: 'documents' as EtapeType,
      nom: 'Documents',
      statut: etapesCompletes.includes('documents') ? 'termine' : 
               etapeActuelle === 'documents' ? 'en-cours' : 'attente',
      icone: FileText,
      description: 'Upload des documents requis'
    },
    {
      id: 'paiement' as EtapeType,
      nom: 'Paiement',
      statut: etapesCompletes.includes('paiement') ? 'termine' : 
               etapeActuelle === 'paiement' ? 'en-cours' : 'attente',
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

  const getMessageBienvenue = () => {
    const isReturningUser = progression?.dernierAcces && 
      new Date(progression.dernierAcces).getTime() < Date.now() - (24 * 60 * 60 * 1000);
    
    if (isReturningUser) {
      return "Bon retour ! Vous pouvez reprendre votre candidature où vous vous étiez arrêté.";
    }
    return "Suivez votre progression et terminez votre candidature.";
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            État de votre candidature
          </h1>
          <p className="text-muted-foreground mb-4">
            Numéro de candidature : <span className="font-mono font-semibold">{nupcan}</span>
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            {getMessageBienvenue()}
          </p>
          <Button variant="outline" size="sm" onClick={refreshStatus}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser le statut
          </Button>
        </div>

        {/* Barre de progression globale */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progression de votre candidature</span>
                <span>{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="w-full" />
              <p className="text-xs text-muted-foreground">
                {etapesCompletes.length} sur 3 étapes terminées
              </p>
            </div>
          </CardContent>
        </Card>

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
        {candidat?.participations && candidat.participations.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Concours inscrits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {candidat.participations.map((participation) => (
                  <div key={participation.id} className="p-4 border rounded-lg">
                    <h3 className="font-semibold">{participation.libcnc}</h3>
                    <p className="text-sm text-muted-foreground">{participation.nomets}</p>
                    <Badge className="mt-2" variant={participation.statut === 'inscrit' ? 'default' : 'secondary'}>
                      {participation.statut || 'inscrit'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progression détaillée */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Étapes de votre candidature</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {etapes.map((etape, index) => {
                const Icone = etape.icone;
                return (
                  <div key={etape.id} className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatutColor(etape.statut)}`}>
                      {etape.statut === 'termine' ? (
                        <CheckCircle className="h-6 w-6 text-white" />
                      ) : etape.statut === 'en-cours' ? (
                        <Clock className="h-6 w-6 text-white" />
                      ) : (
                        <Icone className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{etape.nom}</h3>
                        {getStatutBadge(etape.statut)}
                      </div>
                      <p className="text-sm text-muted-foreground">{etape.description}</p>
                      {etape.statut === 'en-cours' && (
                        <p className="text-sm text-blue-600 font-medium mt-1">
                          Étape en cours - Cliquez sur "Continuer" ci-dessous
                        </p>
                      )}
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
            size="lg"
          >
            {etapeActuelle === 'documents' && 'Continuer - Upload documents'}
            {etapeActuelle === 'paiement' && 'Continuer - Effectuer le paiement'}
            {etapeActuelle === 'termine' && 'Candidature terminée'}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/concours')}
            size="lg"
          >
            Voir les autres concours
          </Button>
        </div>

        {/* Informations de session */}
        {progression && (
          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="text-center text-sm text-muted-foreground">
                <p>Dernière connexion : {new Date(progression.dernierAcces).toLocaleString('fr-FR')}</p>
                <p>Inscription : {new Date(progression.dateInscription).toLocaleString('fr-FR')}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default StatutCandidature;
