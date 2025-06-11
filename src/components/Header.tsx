
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const showBackButton = location.pathname !== '/';

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Retour</span>
              </Button>
            )}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <div>
                <h1 className="font-bold text-lg text-foreground">GabConcours</h1>
                <p className="text-sm text-muted-foreground">Concours Publics Gabon</p>
              </div>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-foreground"
            >
              Accueil
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate('/concours')}
              className="text-muted-foreground hover:text-foreground"
            >
              Concours
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/connexion')}
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              Continuer ma candidature
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
