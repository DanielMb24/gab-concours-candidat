
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, GraduationCap, BookOpen } from 'lucide-react';
import { Concours } from '@/services/api';

interface ConcoursCardProps {
  concours: Concours;
  onPostuler: (concoursId: string) => void;
}

const ConcoursCard: React.FC<ConcoursCardProps> = ({ concours, onPostuler }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const isInscriptionOuverte = () => {
    const now = new Date();
    const debut = new Date(concours.date_debut_inscription);
    const fin = new Date(concours.date_fin_inscription);
    return now >= debut && now <= fin;
  };

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold text-foreground leading-tight">
            {concours.nom}
          </CardTitle>
          <Badge 
            variant={isInscriptionOuverte() ? "default" : "secondary"}
            className={isInscriptionOuverte() ? "bg-green-500" : ""}
          >
            {isInscriptionOuverte() ? "Ouvert" : "Fermé"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{concours.etablissement}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span>{concours.filiere} - {concours.niveau}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 text-primary" />
            <span>Inscription jusqu'au {formatDate(concours.date_fin_inscription)}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 text-primary" />
            <span>Épreuve: {formatDate(concours.date_epreuve)}</span>
          </div>
          
          {concours.matiere && concours.matiere.length > 0 && (
            <div className="flex items-start space-x-2 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4 text-primary mt-0.5" />
              <div className="flex flex-wrap gap-1">
                {concours.matiere.map((matiere, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {matiere}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-primary">
              {concours.frais_inscription?.toLocaleString()} FCFA
            </div>
            <Button
              onClick={() => onPostuler(concours.id)}
              disabled={!isInscriptionOuverte()}
              className="bg-primary hover:bg-primary/90"
            >
              {isInscriptionOuverte() ? "Postuler" : "Inscriptions fermées"}
            </Button>
          </div>
        </div>
        
        {concours.session && (
          <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
            Session: {concours.session}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConcoursCard;
