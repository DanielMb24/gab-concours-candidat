
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

  // Mock data - à remplacer par une vraie API
  const candidats = [
    {
      id: 1,
      nupcan: 'CONC2024001',
      nomcan: 'MBOMA',
      prncan: 'Jean Pierre',
      maican: 'jean.mboma@email.com',
      telcan: '+241 66 12 34 56',
      dtncan: '1995-03-15',
      statut: 'actif',
      participations: 2
    },
    {
      id: 2,
      nupcan: 'CONC2024002',
      nomcan: 'NGOMO',
      prncan: 'Marie Claire',
      maican: 'marie.ngomo@email.com',
      telcan: '+241 77 98 76 54',
      dtncan: '1993-07-22',
      statut: 'actif',
      participations: 1
    },
    {
      id: 3,
      nupcan: 'CONC2024003',
      nomcan: 'OBAME',
      prncan: 'Paul Michel',
      maican: 'paul.obame@email.com',
      telcan: '+241 65 43 21 98',
      dtncan: '1994-11-08',
      statut: 'suspendu',
      participations: 3
    }
  ];

  const filteredCandidats = candidats.filter(c => 
    c.nomcan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.prncan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.nupcan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.maican.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'actif':
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case 'suspendu':
        return <Badge className="bg-red-100 text-red-800">Suspendu</Badge>;
      case 'inactif':
        return <Badge className="bg-gray-100 text-gray-800">Inactif</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion des Candidats</h1>
            <p className="text-muted-foreground">Gérez tous les candidats inscrits</p>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N° Candidature</TableHead>
                  <TableHead>Nom Complet</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Date de naissance</TableHead>
                  <TableHead>Participations</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCandidats.map((candidat) => (
                  <TableRow key={candidat.id}>
                    <TableCell className="font-medium">{candidat.nupcan}</TableCell>
                    <TableCell>{candidat.prncan} {candidat.nomcan}</TableCell>
                    <TableCell>{candidat.maican}</TableCell>
                    <TableCell>{candidat.telcan}</TableCell>
                    <TableCell>{new Date(candidat.dtncan).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{candidat.participations}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(candidat.statut)}</TableCell>
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
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Candidats;
