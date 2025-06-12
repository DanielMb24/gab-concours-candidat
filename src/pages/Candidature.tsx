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
    nomcan: '',
    prncan: '',
    dtncan: '',
    ldncan: '',
    telcan: '',
    maican: '',
    proorg: '',
    proact: '',
    proaff: '',
    nipcan: '',
    niveau_id: '',
    phtcan: ''
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
        nomcan: candidatData.nomcan,
        prncan: candidatData.prncan,
        dtncan: candidatData.dtncan.split(' ')[0], // Format date
        ldncan: candidatData.ldncan,
        telcan: candidatData.telcan,
        maican: candidatData.maican,
        proorg: candidatData.proorg.toString(),
        proact: candidatData.proact.toString(),
        proaff: candidatData.proaff.toString(),
        niveau_id: candidatData.niveau_id.toString(),
        phtcan: candidatData.phtcan || '',
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

  // Création de candidature avec étudiant endpoint
  const createCandidatureMutation = useMutation({
    mutationFn: async (candidatData: typeof candidat) => {
      console.log('Creating candidature with data:', candidatData);
      
      // Préparer les données pour l'endpoint /etudiants
      const formData = new FormData();
      formData.append('niveau_id', concours?.niveau_id || '');
      formData.append('filiere_id', '1'); // À adapter selon vos besoins
      formData.append('nipcan', candidatData.nipcan);
      formData.append('nomcan', candidatData.nomcan);
      formData.append('prncan', candidatData.prncan);
      formData.append('maican', candidatData.maican);
      formData.append('dtncan', candidatData.dtncan);
      formData.append('telcan', candidatData.telcan);
      formData.append('phtcan', candidatData.phtcan);
      formData.append('proorg', candidatData.proorg);
      formData.append('proact', candidatData.proact);
      formData.append('proaff', candidatData.proaff);
      formData.append('ldncan', candidatData.ldncan);
      formData.append('concours_id', concoursId || '');

      return apiService.createEtudiant(formData);
    },
    onSuccess: async (response) => {
      console.log('Candidature created successfully:', response);
      
      const candidatCreated = response.data;
      
      // Créer une session locale si participation existe
      if (candidatCreated.participation?.id) {
        await apiService.createSession(candidatCreated.participation.id);
      }
      
      toast({
        title: "Candidature créée !",
        description: `Votre candidature a été enregistrée avec succès`,
      });
      
      // Utiliser le nupcan ou l'id pour la redirection
      const numeroRedirection = candidatCreated.nupcan || candidatCreated.id;
      navigate(`/confirmation/${numeroRedirection}`);
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
    if (candidat.nipcan.trim()) {
      setSearchingNip(true);
      nipSearchMutation.mutate(candidat.nipcan);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation basique
    if (!candidat.nomcan || !candidat.prncan || !candidat.maican || !candidat.telcan || 
        !candidat.dtncan || !candidat.proorg) {
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
                <Label htmlFor="nipcan" className="text-sm font-medium">
                  NIP (Numéro d'Identification Personnel)
                </Label>
                <p className="text-xs text-muted-foreground mb-3">
                  Si vous avez déjà un NIP gabonais, saisissez-le pour auto-remplir vos informations
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

                <div>
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

                <div>
                  <Label htmlFor="phtcan">Photo (URL)</Label>
                  <Input
                    id="phtcan"
                    value={candidat.phtcan}
                    onChange={(e) => handleInputChange('phtcan', e.target.value)}
                    placeholder="URL de votre photo"
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
