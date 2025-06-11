
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { apiService } from '@/services/api';
import { Candidat, Concours } from '@/types/entities';

const Candidature = () => {
  const { concoursId } = useParams<{ concoursId: string }>();
  const navigate = useNavigate();
  
  const [candidat, setCandidatForm] = useState({
    nom: '',
    prenom: '',
    date_naissance: '',
    lieu_naissance: '',
    sexe: 'M' as 'M' | 'F',
    telephone: '',
    email: '',
    adresse: '',
    province_id: '',
    nip: ''
  });

  const [searchingNip, setSearchingNip] = useState(false);

  // Récupération des données de référence
  const { data: provincesResponse } = useQuery({
    queryKey: ['provinces'],
    queryFn: () => apiService.getProvinces(),
  });

  const { data: concoursResponse } = useQuery({
    queryKey: ['concours', concoursId],
    queryFn: () => apiService.getConcoursById(Number(concoursId)),
    enabled: !!concoursId,
  });

  const provinces = provincesResponse?.data || [];
  const concours = concoursResponse?.data;

  // Recherche par NIP
  const nipSearchMutation = useMutation({
    mutationFn: (nip: string) => apiService.getCandidatByNip(nip),
    onSuccess: (response) => {
      const candidatData = response.data;
      setCandidatForm(prev => ({
        ...prev,
        nom: candidatData.nom,
        prenom: candidatData.prenom,
        date_naissance: candidatData.date_naissance.split(' ')[0], // Format date
        lieu_naissance: candidatData.lieu_naissance,
        sexe: candidatData.sexe,
        telephone: candidatData.telephone,
        email: candidatData.email,
        adresse: candidatData.adresse,
        province_id: candidatData.province_id.toString(),
      }));
      toast({
        title: "Informations trouvées",
        description: "Vos informations ont été automatiquement remplies",
      });
    },
    onError: () => {
      toast({
        title: "NIP non trouvé",
        description: "Aucun candidat trouvé avec ce NIP",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setSearchingNip(false);
    }
  });

  // Création de candidature
  const createCandidatureMutation = useMutation({
    mutationFn: async (candidatData: typeof candidat) => {
      console.log('Creating candidat with data:', candidatData);
      
      // Créer ou récupérer le candidat
      const candidatResponse = await apiService.createCandidat({
        nom: candidatData.nom,
        prenom: candidatData.prenom,
        email: candidatData.email,
        telephone: candidatData.telephone,
        date_naissance: candidatData.date_naissance,
        lieu_naissance: candidatData.lieu_naissance,
        sexe: candidatData.sexe,
        adresse: candidatData.adresse,
        province_id: Number(candidatData.province_id),
      });

      console.log('Candidat created:', candidatResponse);

      // Créer la participation
      const participationResponse = await apiService.createParticipation({
        candidat_id: candidatResponse.data.id,
        concours_id: Number(concoursId),
        statut: 'inscrit',
      });

      console.log('Participation created:', participationResponse);

      return {
        candidat: candidatResponse.data,
        participation: participationResponse.data
      };
    },
    onSuccess: async (data) => {
      console.log('Candidature created successfully:', data);
      
      // Créer une session locale
      await apiService.createSession(data.participation.id);
      
      toast({
        title: "Candidature créée !",
        description: `Votre candidature a été enregistrée avec le numéro ${data.participation.numero_candidature}`,
      });
      
      navigate(`/confirmation/${data.participation.numero_candidature}`);
    },
    onError: (error) => {
      console.error('Error creating candidature:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de votre candidature",
        variant: "destructive",
      });
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setCandidatForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNipSearch = () => {
    if (candidat.nip.trim()) {
      setSearchingNip(true);
      nipSearchMutation.mutate(candidat.nip);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation basique
    if (!candidat.nom || !candidat.prenom || !candidat.email || !candidat.telephone || 
        !candidat.date_naissance || !candidat.province_id) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    createCandidatureMutation.mutate(candidat);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Formulaire de Candidature
          </h1>
          {concours && (
            <p className="text-muted-foreground">
              Concours: {concours.libcnc} - {concours.etablissement_nomets}
            </p>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informations Personnelles</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="p-4 bg-muted rounded-lg">
                <Label htmlFor="nip" className="text-sm font-medium">
                  NIP (Numéro d'Identification Personnel)
                </Label>
                <p className="text-xs text-muted-foreground mb-3">
                  Si vous avez déjà un NIP gabonais, saisissez-le pour auto-remplir vos informations
                </p>
                <div className="flex gap-2">
                  <Input
                    id="nip"
                    placeholder="Ex: 1234567890123"
                    value={candidat.nip}
                    onChange={(e) => handleInputChange('nip', e.target.value)}
                  />
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handleNipSearch}
                    disabled={searchingNip || !candidat.nip.trim()}
                  >
                    {searchingNip ? 'Recherche...' : 'Rechercher'}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="prenom">Prénom *</Label>
                  <Input
                    id="prenom"
                    value={candidat.prenom}
                    onChange={(e) => handleInputChange('prenom', e.target.value)}
                    placeholder="Votre prénom"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="nom">Nom *</Label>
                  <Input
                    id="nom"
                    value={candidat.nom}
                    onChange={(e) => handleInputChange('nom', e.target.value)}
                    placeholder="Votre nom"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="date_naissance">Date de naissance *</Label>
                  <Input
                    id="date_naissance"
                    type="date"
                    value={candidat.date_naissance}
                    onChange={(e) => handleInputChange('date_naissance', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="lieu_naissance">Lieu de naissance *</Label>
                  <Input
                    id="lieu_naissance"
                    value={candidat.lieu_naissance}
                    onChange={(e) => handleInputChange('lieu_naissance', e.target.value)}
                    placeholder="Votre lieu de naissance"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="sexe">Sexe *</Label>
                  <Select value={candidat.sexe} onValueChange={(value: 'M' | 'F') => handleInputChange('sexe', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir votre sexe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculin</SelectItem>
                      <SelectItem value="F">Féminin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="telephone">Téléphone *</Label>
                  <Input
                    id="telephone"
                    value={candidat.telephone}
                    onChange={(e) => handleInputChange('telephone', e.target.value)}
                    placeholder="+241 XX XX XX XX"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={candidat.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="votre@email.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="province">Province *</Label>
                  <Select value={candidat.province_id} onValueChange={(value) => handleInputChange('province_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir votre province" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map(province => (
                        <SelectItem key={province.id} value={province.id.toString()}>
                          {province.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="adresse">Adresse *</Label>
                  <Input
                    id="adresse"
                    value={candidat.adresse}
                    onChange={(e) => handleInputChange('adresse', e.target.value)}
                    placeholder="Votre adresse complète"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  type="submit"
                  disabled={createCandidatureMutation.isPending}
                >
                  {createCandidatureMutation.isPending ? 'Création...' : 'Créer ma candidature'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Candidature;
