
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Users, FileText, Shield } from 'lucide-react';
import Layout from '@/components/Layout';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: GraduationCap,
      title: "Concours Publics",
      description: "Accédez à tous les concours de la fonction publique gabonaise"
    },
    {
      icon: FileText,
      title: "Candidature Simplifiée",
      description: "Processus de candidature en ligne sécurisé et simplifié"
    },
    {
      icon: Users,
      title: "Suivi en Temps Réel",
      description: "Suivez l'avancement de votre candidature à tout moment"
    },
    {
      icon: Shield,
      title: "Sécurisé",
      description: "Vos données personnelles sont protégées et sécurisées"
    }
  ];

  return (
    <Layout>
      <div className="bg-gradient-to-br from-primary/5 via-background to-accent/5">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center fade-in">
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                <GraduationCap className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Votre Avenir Commence
              <span className="text-primary"> Ici</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Plateforme officielle de candidature aux concours de la fonction publique gabonaise. 
              Postulez en ligne en quelques clics et suivez votre candidature en temps réel.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/concours')}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Voir les Concours
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/connexion')}
                className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 text-lg font-semibold transition-all duration-300"
              >
                Continuer ma Candidature
              </Button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Pourquoi Choisir GabConcours ?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Une plateforme moderne, sécurisée et simple d'utilisation pour tous vos concours publics
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 slide-up border-0 shadow-md">
                <CardContent className="pt-8 pb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Section explicative : étapes clés du processus de candidature */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Comment ça fonctionne</h2>

            {/* Grille pour décomposer le processus en 4 étapes simples */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {/* Étape 1 : Choix du concours */}
              <div className="text-center">
                <div className="relative">
                  {/* Numéro d'étape dans un cercle coloré */}
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                  {/* Ligne horizontale pour la connexion visuelle entre étapes sur desktop */}
                  <div className="hidden md:block absolute top-8 w-full h-0.5 bg-gray-200 -right-1/2"></div>
                </div>
                <h3 className="font-medium mb-2">Choisir un concours</h3>
                <p className="text-sm text-muted-foreground">Consultez la liste des concours disponibles et sélectionnez celui qui vous intéresse.</p>
              </div>

              {/* Étape 2 : Remplissage du formulaire */}
              <div className="text-center">
                <div className="relative">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                  <div className="hidden md:block absolute top-8 w-full h-0.5 bg-gray-200 -right-1/2"></div>
                </div>
                <h3 className="font-medium mb-2">Remplir le formulaire</h3>
                <p className="text-sm text-muted-foreground">Saisissez vos informations personnelles et recevez votre NIP unique.</p>
              </div>

              {/* Étape 3 : Soumission des documents */}
              <div className="text-center">
                <div className="relative">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                  <div className="hidden md:block absolute top-8 w-full h-0.5 bg-gray-200 -right-1/2"></div>
                </div>
                <h3 className="font-medium mb-2">Soumettre les documents</h3>
                <p className="text-sm text-muted-foreground">Téléchargez les pièces justificatives requises pour votre dossier.</p>
              </div>

              {/* Étape 4 : Paiement des frais */}
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
                <h3 className="font-medium mb-2">Payer les frais</h3>
                <p className="text-sm text-muted-foreground">Effectuez le paiement des frais de dossier pour finaliser votre candidature.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="bg-primary/5 border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Prêt à Commencer ?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Découvrez dès maintenant les concours disponibles et démarrez votre candidature
              </p>
              <Button
                size="lg"
                onClick={() => navigate('/concours')}
                className="bg-primary hover:bg-primary/90 text-white px-12 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Explorer les Concours
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
