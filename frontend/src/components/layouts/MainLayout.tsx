import { Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { LogOut, Home, Users, Settings, Package, Factory, BarChart, ShieldCheck } from 'lucide-react';

export const MainLayout = () => {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  return (
    <div className="flex h-screen bg-zinc-100 dark:bg-zinc-950">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border/50 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-border/50">
          <h1 className="text-xl font-bold tracking-tight text-primary">Nexa-MFG</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            <NavItem icon={<Home size={18} />} label="Dashboard" to="/" />
            <div className="pt-4 pb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Modules
            </div>
            <NavItem icon={<Factory size={18} />} label="Production" to="#" />
            <NavItem icon={<Package size={18} />} label="Inventory" to="#" />
            <NavItem icon={<BarChart size={18} />} label="Analytics" to="#" />
            
            <div className="pt-4 pb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Administration
            </div>
            <NavItem icon={<Users size={18} />} label="Users" to="/users" />
            <NavItem icon={<ShieldCheck size={18} />} label="Roles & Permissions" to="/roles" />
            <NavItem icon={<Settings size={18} />} label="Settings" to="#" />
          </nav>
        </div>

        <div className="p-4 border-t border-border/50 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full justify-start text-muted-foreground hover:text-foreground" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-card border-b border-border/50 flex items-center justify-between px-6 md:hidden">
          <h1 className="text-xl font-bold text-primary">Nexa-MFG</h1>
          <Button variant="ghost" size="icon">
            <LogOut className="h-5 w-5" onClick={handleLogout} />
          </Button>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, to = "#", active = false }: { icon: React.ReactNode, label: string, to?: string, active?: boolean }) => {
  return (
    <a
      href={to}
      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
        active 
          ? 'bg-primary/10 text-primary font-medium' 
          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </a>
  );
};
