
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Trophy, 
  Users, 
  Building, 
  FileText, 
  Settings, 
  BarChart3,
  DollarSign,
  Calendar,
  LogOut
} from 'lucide-react';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const menuItems = [
    { icon: Home, label: 'Tableau de bord', path: '/admin' },
    { icon: Trophy, label: 'Concours', path: '/admin/concours' },
    { icon: Users, label: 'Candidats', path: '/admin/candidats' },
    { icon: Building, label: 'Établissements', path: '/admin/etablissements' },
    { icon: FileText, label: 'Dossiers', path: '/admin/dossiers' },
    { icon: DollarSign, label: 'Paiements', path: '/admin/paiements' },
    { icon: Calendar, label: 'Sessions', path: '/admin/sessions' },
    { icon: BarChart3, label: 'Rapports', path: '/admin/rapports' },
    { icon: Settings, label: 'Paramètres', path: '/admin/parametres' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border">
        <div className="p-6">
          <h2 className="text-xl font-bold text-foreground">GabConcours Admin</h2>
        </div>
        
        <nav className="px-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link to="/">
              <LogOut className="h-4 w-4 mr-2" />
              Retour au site
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-foreground">Administration</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Administrateur</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
