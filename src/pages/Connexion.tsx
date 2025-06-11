
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, LogIn } from 'lucide-react';
import Layout from '@/components/Layout';

const Connexion = () => {
  const navigate = useNavigate();
  const [numeroCandidature, setNumeroCandidature] = useState('');

  const handleConnexion = (e: React.FormEvent) => {
    e.preventDefault();
    if (numeroCandidature.trim()) {
      // Simuler la connexion - rediriger vers les documents
      navigate(`/documents/${numeroCandidature}`);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
            <LogIn className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Continuer ma Candidature
          </h1>
          <p className="text-muted-foreground">
            Saisissez votre numéro de candidature pour reprendre là où vous vous êtes arrêté
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleConnexion} className="space-y-6">
              <div>
                <Label htmlFor="numeroCandidature">
                  Numéro de candidature
                </Label>
                <Input
                  id="numeroCandidature"
                  type="text"
                  value={numeroCandidature}
                  onChange={(e) => setNumeroCandidature(e.target.value)}
                  placeholder="Ex: gabconcours2024/01/25/001"
                  className="mt-1"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={!numeroCandidature.trim()}
              >
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4" />
                  <span>Continuer ma candidature</span>
                </div>
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Connexion;
