
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';
import { toast } from '@/hooks/use-toast';

const Dossiers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  // Mock data - à remplacer par une vraie API
  const dossiers = [
    {
      id: 1,
      candidat_nom: 'MBOMA Jean Pierre',
      candidat_nip: 'CONC2024001',
      concours: 'École Nationale d\'Administration',
      statut: 'en_attente',
      documents_count: 5,
      date_soumission: '2024-01-15',
      derniere_modification: '2024-01-15'
    },
    {
      id: 2,
      candidat_nom: 'NGOMO Marie Claire',
      candidat_nip: 'CONC2024002',
      concours: 'École Normale Supérieure',
      statut: 'valide',
      documents_count: 6,
      date_soumission: '2024-01-14',
      derniere_modification: '2024-01-16'
    }
  ];

  const filteredDossiers = dossiers.filter(d => 
    d.candidat_nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.candidat_nip.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.concours.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'valide':
        return <Badge className="bg-green-100 text-green-800">Validé</Badge>;
      case 'rejete':
        return <Badge className="bg-red-100 text-red-800">Rejeté</Badge>;
      case 'en_attente':
        return <Badge className="bg-orange-100 text-orange-800">En attente</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  const handleValidate = (id: number) => {
    toast({
      title: "Dossier validé",
      description: "Le dossier a été validé avec succès",
    });
  };

  const handleReject = (id: number) => {
    toast({
      title: "Dossier rejeté",
      description: "Le dossier a été rejeté",
      variant: "destructive",
    });
  };

  return (
    <AdminProtectedRoute>
      <AdminLayout>
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
                      <TableCell className="font-medium">{dossier.candidat_nom}</TableCell>
                      <TableCell>{dossier.candidat_nip}</TableCell>
                      <TableCell>{dossier.concours}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{dossier.documents_count} docs</Badge>
                      </TableCell>
                      <TableCell>{new Date(dossier.date_soumission).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(dossier.statut)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {dossier.statut === 'en_attente' && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleValidate(dossier.id)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleReject(dossier.id)}
                                className="text-red-600 hover:text-red-700"
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
      </AdminLayout>
    </AdminProtectedRoute>
  );
};

export default Dossiers;
