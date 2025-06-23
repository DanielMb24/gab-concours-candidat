import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Eye, CheckCircle, XCircle, DollarSign, TrendingUp } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';
import { apiService } from '@/services/api';
import { toast } from '@/hooks/use-toast';

const Paiements = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: paiementsResponse, isLoading } = useQuery({
    queryKey: ['admin-paiements'],
    queryFn: () => apiService.getPaiements(),
  });

  const paiements = paiementsResponse?.data || [];

  const validatePaiementMutation = useMutation({
    mutationFn: (paiementId: number) => apiService.validatePaiement(paiementId),
    onSuccess: () => {
      toast({
        title: "Paiement validé",
        description: "Le paiement a été validé avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-paiements'] });
    },
    onError: (error) => {
      console.error('Validation error:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la validation du paiement",
        variant: "destructive",
      });
    }
  });

  const filteredPaiements = paiements.filter((p: any) =>
      p.nomcan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.prncan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nupcan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.reference?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPaiements = paiements.reduce((sum: number, p: any) => sum + (parseInt(p.montant) || 0), 0);
  const paiementsValides = paiements.filter((p: any) => p.statut === 'valide');
  const totalValide = paiementsValides.reduce((sum: number, p: any) => sum + (parseInt(p.montant) || 0), 0);

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

  if (isLoading) {
    return (
        <AdminProtectedRoute>
          <AdminLayout>
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Chargement des paiements...</p>
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
                <h1 className="text-3xl font-bold text-foreground">Gestion des Paiements</h1>
                <p className="text-muted-foreground">Suivi et validation des paiements</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">{totalValide.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">FCFA Validé</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">{totalPaiements.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">FCFA Total</p>
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
                        {paiements.filter((p: any) => p.statut === 'valide').length}
                      </p>
                      <p className="text-sm text-muted-foreground">Validés</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <XCircle className="h-8 w-8 text-orange-500" />
                    <div>
                      <p className="text-2xl font-bold">
                        {paiements.filter((p: any) => p.statut === 'en_attente').length}
                      </p>
                      <p className="text-sm text-muted-foreground">En attente</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Liste des Paiements</CardTitle>
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                      placeholder="Rechercher un paiement..."
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
                      <TableHead>Référence</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPaiements.map((paiement: any) => (
                        <TableRow key={paiement.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{paiement.prncan} {paiement.nomcan}</div>
                              <div className="text-sm text-muted-foreground">{paiement.nupcan}</div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono">{paiement.reference}</TableCell>
                          <TableCell className="font-medium">
                            {parseInt(paiement.montant || paiement.mntfrai || '0').toLocaleString()} FCFA
                          </TableCell>
                          <TableCell>{new Date(paiement.created_at).toLocaleDateString('fr-FR')}</TableCell>
                          <TableCell>{getStatusBadge(paiement.statut)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              {paiement.statut === 'en_attente' && (
                                  <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-green-600 hover:text-green-700"
                                      onClick={() => validatePaiementMutation.mutate(paiement.id)}
                                      disabled={validatePaiementMutation.isPending}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
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

export default Paiements;
