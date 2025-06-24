
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Eye, CheckCircle, XCircle, DollarSign, TrendingUp } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';
import { toast } from '@/hooks/use-toast';

const Paiements = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - à remplacer par une vraie API
  const paiements = [
    {
      id: 1,
      candidat_nom: 'MBOMA Jean Pierre',
      candidat_nip: 'CONC2024001',
      concours: 'École Nationale d\'Administration',
      montant: 25000,
      reference: 'PAY2024001',
      statut: 'valide',
      date_paiement: '2024-01-15',
      methode: 'mobile_money'
    },
    {
      id: 2,
      candidat_nom: 'NGOMO Marie Claire',
      candidat_nip: 'CONC2024002',
      concours: 'École Normale Supérieure',
      montant: 30000,
      reference: 'PAY2024002',
      statut: 'en_attente',
      date_paiement: '2024-01-16',
      methode: 'virement'
    }
  ];

  const filteredPaiements = paiements.filter(p => 
    p.candidat_nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.candidat_nip.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPaiements = paiements.reduce((sum, p) => sum + p.montant, 0);
  const paiementsValides = paiements.filter(p => p.statut === 'valide');
  const totalValide = paiementsValides.reduce((sum, p) => sum + p.montant, 0);

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

  const getMethodeBadge = (methode: string) => {
    switch (methode) {
      case 'mobile_money':
        return <Badge variant="outline">Mobile Money</Badge>;
      case 'virement':
        return <Badge variant="outline">Virement</Badge>;
      case 'especes':
        return <Badge variant="outline">Espèces</Badge>;
      default:
        return <Badge variant="outline">Autre</Badge>;
    }
  };

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
                      {paiements.filter(p => p.statut === 'valide').length}
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
                      {paiements.filter(p => p.statut === 'en_attente').length}
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
                    <TableHead>Concours</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Méthode</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPaiements.map((paiement) => (
                    <TableRow key={paiement.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{paiement.candidat_nom}</div>
                          <div className="text-sm text-muted-foreground">{paiement.candidat_nip}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{paiement.reference}</TableCell>
                      <TableCell>{paiement.concours}</TableCell>
                      <TableCell className="font-medium">
                        {paiement.montant.toLocaleString()} FCFA
                      </TableCell>
                      <TableCell>{getMethodeBadge(paiement.methode)}</TableCell>
                      <TableCell>{new Date(paiement.date_paiement).toLocaleDateString()}</TableCell>
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
