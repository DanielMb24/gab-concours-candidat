
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Users, DollarSign } from 'lucide-react';
import { Concours } from '@/types/entities';

interface ConcoursCardProps {
  concours: Concours;
}

const ConcoursCard: React.FC<ConcoursCardProps> = ({ concours }) => {
  const navigate = useNavigate();

  const handlePostuler = () => {
    navigate(`/candidature/${concours.id}`);
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'ouvert':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'ferme':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'termine':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-2">{concours.nom}</CardTitle>
          <Badge className={getStatutColor(concours.statut)}>
            {concours.statut.charAt(0).toUpperCase() + concours.statut.slice(1)}
          </Badge>
        </div>
        <CardDescription className="line-clamp-3">
          {concours.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarDays className="w-4 h-4 mr-2" />
            <span>Du {formatDate(concours.date_debut)} au {formatDate(concours.date_fin)}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="w-4 h-4 mr-2" />
            <span>{concours.nombre_places} places disponibles</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <DollarSign className="w-4 h-4 mr-2" />
            <span className="font-medium">{formatPrice(concours.frais_inscription)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button 
          onClick={handlePostuler}
          className="w-full"
          disabled={concours.statut !== 'ouvert'}
        >
          {concours.statut === 'ouvert' ? 'Postuler' : 'Concours fermé'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ConcoursCard;
