
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

const Candidature = () => {
  const { concoursId } = useParams<{ concoursId: string }>();
  const navigate = useNavigate();
  
  const [candidat, setCandidatForm] = useState({
    nipcan: '',
    nomcan: '',
    prncan: '',
    dtncan: '',
    ldncan: '',
    telcan: '',
    maican: '',
    proorg: '',
    proact: '',
    proaff: '',
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

  // Recherche par NIP gabonais
  const nipSearchMutation = useMutation({
    mutationFn: (nip: string) => apiService.getCandidatByNip(nip),
    onSuccess: (response) => {
      const candidatData = response.data;
      setCandidatForm(prev => ({
        ...prev,
        nomcan: candidatData.nomcan,
        prncan: candidatData.prncan,
        dtncan: candidatData.dtncan.split('T')[0], // Format date
        ldncan: candidatData.ldncan,
        telcan: candidatData.telcan,
        maican: candidatData.maican,
        proorg: candidatData.proorg.toString(),
        proact: candidatData.proact.toString(),
        proaff: candidatData.proaff.toString(),
      }));
      toast({
        title: "Informations trouvées",
        description: "Vos informations ont été automatiquement remplies",
      });
    },
    onError: () => {
      toast({
        title: "NIP non trouvé",
        description: "Aucun candidat trouvé avec ce NIP gabonais",
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
      console.log('Creating candidature with data:', candidatData);
      console.log('Concours data:', concours);
      
      // Validation des données requises
      if (!concours?.niveau_id) {
        throw new Error('Niveau du concours non trouvé');
      }
      
      // Préparer les données pour l'endpoint /etudiants
      const formData = new FormData();
      formData.append('niveau_id', concours.niveau_id.toString());
      
      // NIP optionnel
      if (candidatData.nipcan && candidatData.nipcan.trim()) {
        formData.append('nipcan', candidatData.nipcan.trim());
      }
      
      // Champs obligatoires
      formData.append('nomcan', candidatData.nomcan);
      formData.append('prncan', candidatData.prncan);
      formData.append('maican', candidatData.maican);
      formData.append('dtncan', candidatData.dtncan);
      formData.append('telcan', candidatData.telcan);
      formData.append('ldncan', candidatData.ldncan);
      
      // Provinces (convertir en nombres)
      formData.append('proorg', candidatData.proorg);
      formData.append('proact', candidatData.proact || candidatData.proorg);
      formData.append('proaff', candidatData.proaff || candidatData.proorg);
      
      // ID du concours
      formData.append('concours_id', concoursId || '');

      // Log des données FormData pour debug
      console.log('FormData entries:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      return apiService.createEtudiant(formData);
    },
    onSuccess: async (response) => {
      console.log('Candidature created successfully:', response);
      
      const candidatCreated = response.data;
      
      // Créer une session locale avec le nupcan généré
      if (candidatCreated.nupcan) {
        await apiService.createSession(candidatCreated.nupcan);
      }
      
      toast({
        title: "Candidature créée !",
        description: `Votre candidature a été enregistrée avec succès. Numéro: ${candidatCreated.nupcan}`,
      });
      
      // Rediriger vers la page de confirmation avec le nupcan
      navigate(`/confirmation/${candidatCreated.nupcan}`);
    },
    onError: (error) => {
      console.error('Error la creatio candidature:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la création de votre candidature",
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
    if (candidat.nipcan.trim()) {
      setSearchingNip(true);
      nipSearchMutation.mutate(candidat.nipcan);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation basique
    if (!candidat.nomcan || !candidat.prncan || !candidat.maican || !candidat.telcan || 
        !candidat.dtncan || !candidat.proorg || !candidat.ldncan) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(candidat.maican)) {
      toast({
        title: "Email invalide",
        description: "Veuillez saisir une adresse email valide",
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
              {/* Champ NIP gabonais en premier */}
              <div className="p-4 bg-muted rounded-lg">
                <Label htmlFor="nipcan" className="text-sm font-medium">
                  NIP Gabonais (Numéro d'Identification Personnel)
                </Label>
                <p className="text-xs text-muted-foreground mb-3">
                  Si vous avez un NIP gabonais, saisissez-le pour auto-remplir vos informations
                </p>
                <div className="flex gap-2">
                  <Input
                    id="nipcan"
                    placeholder="Ex: 1234567890123"
                    value={candidat.nipcan}
                    onChange={(e) => handleInputChange('nipcan', e.target.value)}
                  />
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handleNipSearch}
                    disabled={searchingNip || !candidat.nipcan.trim()}
                  >
                    {searchingNip ? 'Recherche...' : 'Rechercher'}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="prncan">Prénom *</Label>
                  <Input
                    id="prncan"
                    value={candidat.prncan}
                    onChange={(e) => handleInputChange('prncan', e.target.value)}
                    placeholder="Votre prénom"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="nomcan">Nom *</Label>
                  <Input
                    id="nomcan"
                    value={candidat.nomcan}
                    onChange={(e) => handleInputChange('nomcan', e.target.value)}
                    placeholder="Votre nom"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="dtncan">Date de naissance *</Label>
                  <Input
                    id="dtncan"
                    type="date"
                    value={candidat.dtncan}
                    onChange={(e) => handleInputChange('dtncan', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="ldncan">Lieu de naissance *</Label>
                  <Input
                    id="ldncan"
                    value={candidat.ldncan}
                    onChange={(e) => handleInputChange('ldncan', e.target.value)}
                    placeholder="Votre lieu de naissance"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="telcan">Téléphone *</Label>
                  <Input
                    id="telcan"
                    value={candidat.telcan}
                    onChange={(e) => handleInputChange('telcan', e.target.value)}
                    placeholder="+241 XX XX XX XX"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="maican">Email *</Label>
                  <Input
                    id="maican"
                    type="email"
                    value={candidat.maican}
                    onChange={(e) => handleInputChange('maican', e.target.value)}
                    placeholder="votre@email.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="proorg">Province d'origine *</Label>
                  <Select value={candidat.proorg} onValueChange={(value) => handleInputChange('proorg', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir votre province d'origine" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map(province => (
                        <SelectItem key={province.id} value={province.id.toString()}>
                          {province.nompro}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="proact">Province actuelle</Label>
                  <Select value={candidat.proact} onValueChange={(value) => handleInputChange('proact', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir votre province actuelle" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map(province => (
                        <SelectItem key={province.id} value={province.id.toString()}>
                          {province.nompro}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="proaff">Province d'affectation souhaitée</Label>
                  <Select value={candidat.proaff} onValueChange={(value) => handleInputChange('proaff', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir votre province d'affectation" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map(province => (
                        <SelectItem key={province.id} value={province.id.toString()}>
                          {province.nompro}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  type="submit"
                  disabled={createCandidatureMutation.isPending}
                  className="bg-primary hover:bg-primary/90"
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
