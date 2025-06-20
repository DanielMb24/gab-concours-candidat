import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Edit, Trash, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { apiService } from '@/services/api';
import { toast } from '@/hooks/use-toast';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

import AddConcoursForm from './AddConcoursForm';

const Concours = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: concoursData, isLoading } = useQuery({
    queryKey: ['admin-concours'],
    queryFn: () => apiService.getConcours(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiService.deleteConcours(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-concours'] });
      toast({
        title: "Concours supprimé",
        description: "Le concours a été supprimé avec succès",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le concours",
        variant: "destructive",
      });
    }
  });

  const concours = concoursData?.data || [];
  const filteredConcours = concours.filter(c =>
      c.libcnc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.etablissement_nomets.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case '1':
        return <Badge className="bg-green-100 text-green-800">Ouvert</Badge>;
      case '2':
        return <Badge className="bg-orange-100 text-orange-800">Fermé</Badge>;
      case '3':
        return <Badge className="bg-gray-100 text-gray-800">Terminé</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce concours ?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Gestion des Concours</h1>
              <p className="text-muted-foreground">Gérez tous les concours de la plateforme</p>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau concours
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Ajouter un nouveau concours</DialogTitle>
                  <DialogDescription>
                    Remplissez les champs ci-dessous pour créer un nouveau concours.
                  </DialogDescription>
                </DialogHeader>
                <AddConcoursForm
                    onSuccess={() => {
                      queryClient.invalidateQueries({ queryKey: ['admin-concours'] });
                    }}
                />
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Liste des Concours</CardTitle>
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Rechercher un concours..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                  <div className="text-center py-8">Chargement...</div>
              ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Concours</TableHead>
                        <TableHead>Établissement</TableHead>
                        <TableHead>Session</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Frais</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredConcours.map((concours) => (
                          <TableRow key={concours.id}>
                            <TableCell className="font-medium">{concours.libcnc}</TableCell>
                            <TableCell>{concours.etablissement_nomets}</TableCell>
                            <TableCell>{concours.sescnc}</TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>Du: {new Date(concours.debcnc).toLocaleDateString()}</div>
                                <div>Au: {new Date(concours.fincnc).toLocaleDateString()}</div>
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(concours.stacnc)}</TableCell>
                            <TableCell>{concours.fracnc} FCFA</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm" asChild>
                                  <Link to={`/admin/concours/${concours.id}`}>
                                    <Eye className="h-4 w-4" />
                                  </Link>
                                </Button>
                                <Button variant="ghost" size="sm" asChild>
                                  <Link to={`/admin/concours/${concours.id}/edit`}>
                                    <Edit className="h-4 w-4" />
                                  </Link>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(concours.id)}
                                    disabled={deleteMutation.isPending}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                      ))}
                    </TableBody>
                  </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
  );
};

export default Concours;
