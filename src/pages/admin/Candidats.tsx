
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Eye, Edit, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { apiService } from '@/services/api';

const Candidats = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: candidatsData, isLoading } = useQuery({
    queryKey: ['admin-candidats'],
    queryFn: () => apiService.getCandidats(),
  });

  const candidats = candidatsData?.data || [];

  const filteredCandidats = candidats.filter(c => 
    c.nomcan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.prncan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.nupcan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.maican?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (candidat: any) => {
    // Déterminer le statut basé sur les participations
    const hasParticipations = candidat.participations_count > 0;
    if (hasParticipations) {
      return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-800">En attente</Badge>;
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="text-center py-8">Chargement des candidats...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion des Candidats</h1>
            <p className="text-muted-foreground">Gérez tous les candidats inscrits ({candidats.length} candidats)</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des Candidats</CardTitle>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un candidat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            {filteredCandidats.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {candidats.length === 0 ? 'Aucun candidat trouvé' : 'Aucun résultat pour cette recherche'}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N° Candidature</TableHead>
                    <TableHead>Nom Complet</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Date de naissance</TableHead>
                    <TableHead>Niveau</TableHead>
                    <TableHead>Participations</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCandidats.map((candidat) => (
                    <TableRow key={candidat.id}>
                      <TableCell className="font-medium font-mono text-xs">{candidat.nupcan}</TableCell>
                      <TableCell>{candidat.prncan} {candidat.nomcan}</TableCell>
                      <TableCell className="text-sm">{candidat.maican}</TableCell>
                      <TableCell>{candidat.telcan}</TableCell>
                      <TableCell>{new Date(candidat.dtncan).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{candidat.niveau_nomniv || 'N/A'}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{candidat.participations_count || 0}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(candidat)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/admin/candidats/${candidat.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/admin/candidats/${candidat.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
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

export default Candidats;
