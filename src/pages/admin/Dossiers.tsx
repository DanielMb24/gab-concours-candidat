
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';
import { toast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';

const Dossiers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  // Récupérer les dossiers depuis l'API
  const { data: dossiersData, isLoading } = useQuery({
    queryKey: ['dossiers'],
    queryFn: () => apiService.getDossiers(),
  });

  const dossiers = dossiersData?.data || [];

  const filteredDossiers = dossiers.filter((d: any) => 
    d.nomcan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.nupcan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.libcnc?.toLowerCase().includes(searchTerm.toLowerCase())
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

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, statut }: { id: number; statut: string }) => 
      apiService.updateDocumentStatus(id, statut),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dossiers'] });
      toast({
        title: "Statut mis à jour",
        description: "Le statut du document a été modifié avec succès",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    },
  });

  const handleValidate = (id: number) => {
    updateStatusMutation.mutate({ id, statut: 'valide' });
  };

  const handleReject = (id: number) => {
    updateStatusMutation.mutate({ id, statut: 'rejete' });
  };

  if (isLoading) {
    return (
      <AdminProtectedRoute>
        <AdminLayout>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </AdminLayout>
      </AdminProtectedRoute>
    );
  }

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
                {dossiers.filter((d: any) => d.statut === 'en_attente').length} En attente
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
                      {dossiers.filter((d: any) => d.statut === 'en_attente').length}
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
                      {dossiers.filter((d: any) => d.statut === 'valide').length}
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
                      {dossiers.filter((d: any) => d.statut === 'rejete').length}
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
                    <TableHead>Type Document</TableHead>
                    <TableHead>Nom Document</TableHead>
                    <TableHead>Concours</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDossiers.map((dossier: any) => (
                    <TableRow key={dossier.id}>
                      <TableCell className="font-medium">
                        {dossier.prncan} {dossier.nomcan}
                      </TableCell>
                      <TableCell>{dossier.nupcan}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{dossier.type}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{dossier.nomdoc}</TableCell>
                      <TableCell>{dossier.libcnc}</TableCell>
                      <TableCell>
                        {new Date(dossier.created_at).toLocaleDateString()}
                      </TableCell>
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
                                disabled={updateStatusMutation.isPending}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleReject(dossier.id)}
                                className="text-red-600 hover:text-red-700"
                                disabled={updateStatusMutation.isPending}
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
              {filteredDossiers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun dossier trouvé
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
};

export default Dossiers;
