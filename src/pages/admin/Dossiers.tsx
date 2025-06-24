
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Eye, CheckCircle, XCircle, Clock, FileText, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Dossier {
  id: number;
  candidat_nom: string;
  candidat_prenom: string;
  candidat_nip: string;
  concours: string;
  statut: 'en_attente' | 'valide' | 'rejete';
  documents_count: number;
  date_soumission: string;
  derniere_modification: string;
  documents?: Array<{
    id: number;
    nom: string;
    type: string;
    url: string;
  }>;
}

const Dossiers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDossier, setSelectedDossier] = useState<Dossier | null>(null);
  const queryClient = useQueryClient();

  // Simuler des données réelles
  const mockDossiers: Dossier[] = [
    {
      id: 1,
      candidat_nom: 'MBOMA',
      candidat_prenom: 'Jean Pierre',
      candidat_nip: 'CONC2024001',
      concours: 'École Nationale d\'Administration',
      statut: 'en_attente',
      documents_count: 5,
      date_soumission: '2024-01-15',
      derniere_modification: '2024-01-15',
      documents: [
        { id: 1, nom: 'CV.pdf', type: 'CV', url: '/documents/cv1.pdf' },
        { id: 2, nom: 'Diplome.pdf', type: 'Diplome', url: '/documents/diplome1.pdf' },
        { id: 3, nom: 'Lettre_motivation.pdf', type: 'Lettre', url: '/documents/lettre1.pdf' },
      ]
    },
    {
      id: 2,
      candidat_nom: 'NGOMO',
      candidat_prenom: 'Marie Claire',
      candidat_nip: 'CONC2024002',
      concours: 'École Normale Supérieure',
      statut: 'valide',
      documents_count: 6,
      date_soumission: '2024-01-14',
      derniere_modification: '2024-01-16',
      documents: [
        { id: 4, nom: 'CV.pdf', type: 'CV', url: '/documents/cv2.pdf' },
        { id: 5, nom: 'Diplome.pdf', type: 'Diplome', url: '/documents/diplome2.pdf' },
      ]
    },
    {
      id: 3,
      candidat_nom: 'OWONO',
      candidat_prenom: 'Paul André',
      candidat_nip: 'CONC2024003',
      concours: 'École Polytechnique',
      statut: 'rejete',
      documents_count: 3,
      date_soumission: '2024-01-13',
      derniere_modification: '2024-01-17'
    }
  ];

  const { data: dossiers = mockDossiers, isLoading } = useQuery({
    queryKey: ['admin-dossiers'],
    queryFn: async () => {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockDossiers;
    },
  });

  const validateMutation = useMutation({
    mutationFn: async (dossierId: number) => {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 500));
      return { id: dossierId, statut: 'valide' };
    },
    onSuccess: () => {
      toast({
        title: "Dossier validé",
        description: "Le dossier a été validé avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-dossiers'] });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de valider le dossier",
        variant: "destructive",
      });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: async (dossierId: number) => {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 500));
      return { id: dossierId, statut: 'rejete' };
    },
    onSuccess: () => {
      toast({
        title: "Dossier rejeté",
        description: "Le dossier a été rejeté",
        variant: "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-dossiers'] });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de rejeter le dossier",
        variant: "destructive",
      });
    }
  });

  const filteredDossiers = dossiers.filter(d => 
    `${d.candidat_prenom} ${d.candidat_nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.candidat_nip.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.concours.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'valide':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Validé</Badge>;
      case 'rejete':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejeté</Badge>;
      case 'en_attente':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">En attente</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  const handleValidate = (id: number) => {
    validateMutation.mutate(id);
  };

  const handleReject = (id: number) => {
    rejectMutation.mutate(id);
  };

  const handleViewDossier = (dossier: Dossier) => {
    setSelectedDossier(dossier);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Dossiers</h1>
          <p className="text-muted-foreground">Validation et suivi des dossiers de candidature</p>
        </div>
        <div className="flex space-x-2">
          <Badge variant="outline" className="bg-orange-50">
            {dossiers.filter(d => d.statut === 'en_attente').length} En attente
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">
                  {dossiers.filter(d => d.statut === 'en_attente').length}
                </p>
                <p className="text-sm text-muted-foreground">En attente</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {dossiers.filter(d => d.statut === 'valide').length}
                </p>
                <p className="text-sm text-muted-foreground">Validés</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <XCircle className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">
                  {dossiers.filter(d => d.statut === 'rejete').length}
                </p>
                <p className="text-sm text-muted-foreground">Rejetés</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Dossiers</CardTitle>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un dossier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidat</TableHead>
                <TableHead>N° Candidature</TableHead>
                <TableHead>Concours</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Date soumission</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDossiers.map((dossier) => (
                <TableRow key={dossier.id}>
                  <TableCell className="font-medium">
                    {dossier.candidat_prenom} {dossier.candidat_nom}
                  </TableCell>
                  <TableCell>{dossier.candidat_nip}</TableCell>
                  <TableCell>{dossier.concours}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{dossier.documents_count} docs</Badge>
                  </TableCell>
                  <TableCell>{new Date(dossier.date_soumission).toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusBadge(dossier.statut)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewDossier(dossier)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              Dossier de {dossier.candidat_prenom} {dossier.candidat_nom}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium">N° Candidature</p>
                                <p className="text-sm text-muted-foreground">{dossier.candidat_nip}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Concours</p>
                                <p className="text-sm text-muted-foreground">{dossier.concours}</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-2">Documents soumis</p>
                              <div className="space-y-2">
                                {dossier.documents?.map((doc) => (
                                  <div key={doc.id} className="flex items-center justify-between p-2 border rounded">
                                    <div className="flex items-center space-x-2">
                                      <FileText className="h-4 w-4" />
                                      <span className="text-sm">{doc.nom}</span>
                                      <Badge variant="outline" className="text-xs">{doc.type}</Badge>
                                    </div>
                                    <Button variant="ghost" size="sm">
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )) || <p className="text-sm text-muted-foreground">Aucun document disponible</p>}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      {dossier.statut === 'en_attente' && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleValidate(dossier.id)}
                            className="text-green-600 hover:text-green-700"
                            disabled={validateMutation.isPending}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleReject(dossier.id)}
                            className="text-red-600 hover:text-red-700"
                            disabled={rejectMutation.isPending}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dossiers;
