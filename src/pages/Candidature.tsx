
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Layout from '@/components/Layout';

const Candidature = () => {
  const { concoursId } = useParams<{ concoursId: string }>();
  const navigate = useNavigate();
  
  const [candidat, setCandidatForm] = useState({
    nom: '',
    prenom: '',
    date_naissance: '',
    telephone: '',
    email: '',
    province: '',
    nip: ''
  });

  const provinces = [
    'Estuaire', 'Haut-Ogooué', 'Moyen-Ogooué', 'Ngounié', 
    'Nyanga', 'Ogooué-Ivindo', 'Ogooué-Lolo', 'Ogooué-Maritime', 'Woleu-Ntem'
  ];

  const handleInputChange = (field: string, value: string) => {
    setCandidatForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Générer un numéro de candidature fictif
    const numeroCandidature = `gabconcours2024/01/25/${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    navigate(`/confirmation/${numeroCandidature}`);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Formulaire de Candidature
          </h1>
          <p className="text-muted-foreground">
            Remplissez le formulaire pour créer votre candidature
          </p>
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
                  <Button type="button" variant="outline">
                    Rechercher
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
                  <Select value={candidat.province} onValueChange={(value) => handleInputChange('province', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir votre province" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map(province => (
                        <SelectItem key={province} value={province}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit">
                  Créer ma candidature
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
