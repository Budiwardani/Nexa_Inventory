import { NavLink, Outlet, useNavigate } from 'react-router-dom';
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

  const sections = [
    {
      title: 'Modules',
      items: [
        { icon: <Home size={18} />, label: 'Dashboard', to: '/' },
        {
          icon: <Factory size={18} />,
          label: 'Production',
          to: '/production',
          children: [
            { icon: <Factory size={18} />, label: 'BOM', to: '/bom' },
            { icon: <Factory size={18} />, label: 'Routing', to: '/routing' },
            { icon: <Factory size={18} />, label: 'Production Order', to: '/production-order' },
            { icon: <Factory size={18} />, label: 'Work Order', to: '/work-order' },
          ],
        },
        { icon: <Package size={18} />, label: 'Inventory', to: '/inventory' },
        {
          icon: <Package size={18} />,
          label: 'Transactions',
          to: '/material-issue',
          children: [
            { icon: <Package size={18} />, label: 'Material Issue', to: '/material-issue' },
            { icon: <Package size={18} />, label: 'Material Return', to: '/material-return' },
            { icon: <Package size={18} />, label: 'Finished Goods', to: '/finished-goods' },
          ],
        },
        { icon: <BarChart size={18} />, label: 'Analytics', to: '/analytics' },
        { icon: <BarChart size={18} />, label: 'Quality Control', to: '/quality-control' },
        { icon: <BarChart size={18} />, label: 'Scrap Management', to: '/scrap-management' },
        { icon: <BarChart size={18} />, label: 'Rework', to: '/rework' },
        { icon: <BarChart size={18} />, label: 'Machine Maintenance', to: '/maintenance' },
        { icon: <BarChart size={18} />, label: 'Machine Downtime', to: '/downtime' },
        { icon: <BarChart size={18} />, label: 'Capacity Planning', to: '/capacity-planning' },
        { icon: <BarChart size={18} />, label: 'Costing', to: '/costing' },
        { icon: <BarChart size={18} />, label: 'Accounting', to: '/accounting' },
        { icon: <BarChart size={18} />, label: 'Notifications', to: '/notifications' },
      ],
    },
    {
      title: 'Administration',
      items: [
        { icon: <Users size={18} />, label: 'Users', to: '/users' },
        { icon: <ShieldCheck size={18} />, label: 'Roles & Permissions', to: '/roles' },
        { icon: <Settings size={18} />, label: 'Settings', to: '/settings' },
      ],
    },
  ];

  return (
    <div className="flex h-screen bg-zinc-100 dark:bg-zinc-950">
      {/* Sidebar */}
      <aside className="w-80 bg-card border-r border-border/50 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-border/50">
          <h1 className="text-xl font-bold tracking-tight text-primary">Nexa-MFG</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {sections.map((section) => (
              <div key={section.title}>
                <div className="pt-4 pb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {section.title}
                </div>
                {section.items.map((item) => (
                  <div key={item.label}>
                    <NavItem icon={item.icon} label={item.label} to={item.to} />
                    {item.children?.map((child) => (
                      <NavSubItem key={child.label} icon={child.icon} label={child.label} to={child.to} />
                    ))}
                  </div>
                ))}
              </div>
            ))}
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

const NavItem = ({ icon, label, to = '#', }: { icon: React.ReactNode, label: string, to?: string }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
          isActive
            ? 'bg-primary/10 text-primary font-medium'
            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
        }`
      }
      end={to === '/' }
    >
      {icon}
      <span className="text-sm">{label}</span>
    </NavLink>
  );
};

const NavSubItem = ({ icon, label, to = '#', }: { icon: React.ReactNode, label: string, to?: string }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-6 py-2 rounded-md transition-colors ${
          isActive
            ? 'bg-primary/10 text-primary font-medium'
            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
        }`
      }
    >
      {icon}
      <span className="text-sm">{label}</span>
    </NavLink>
  );
};
