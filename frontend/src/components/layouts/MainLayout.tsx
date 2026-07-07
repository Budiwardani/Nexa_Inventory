import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { useGetSettings } from '@/features/phase3/api/phase3Api';
import {
  LogOut, Home, Users, Settings, Package, Factory, BarChart, ShieldCheck,
  FlaskConical, Wrench, Cpu, ClipboardList, DollarSign, Bell, Paintbrush,
} from 'lucide-react';

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
      title: 'Main',
      items: [
        { icon: <Home size={18} />, label: 'Dashboard', to: '/' },
      ],
    },
    {
      title: 'Production',
      items: [
        {
          icon: <Factory size={18} />,
          label: 'Production',
          to: '/production',
          children: [
            { icon: <ClipboardList size={16} />, label: 'BOM', to: '/bom' },
            { icon: <ClipboardList size={16} />, label: 'Routing', to: '/routing' },
            { icon: <Factory size={16} />, label: 'Production Order', to: '/production-order' },
            { icon: <Factory size={16} />, label: 'Work Order', to: '/work-order' },
          ],
        },
        {
          icon: <Package size={18} />,
          label: 'Inventory',
          to: '/inventory',
          children: [
            { icon: <Package size={16} />, label: 'Material Issue', to: '/material-issue' },
            { icon: <Package size={16} />, label: 'Material Return', to: '/material-return' },
            { icon: <Package size={16} />, label: 'Finished Goods', to: '/finished-goods' },
          ],
        },
      ],
    },
    {
      title: 'Quality & Machines',
      items: [
        { icon: <FlaskConical size={18} />, label: 'Quality Control', to: '/quality-control' },
        { icon: <FlaskConical size={18} />, label: 'Scrap Management', to: '/scrap-management' },
        { icon: <FlaskConical size={18} />, label: 'Rework', to: '/rework' },
        { icon: <Cpu size={18} />, label: 'Machines', to: '/machines' },
        { icon: <Wrench size={18} />, label: 'Maintenance', to: '/maintenance' },
        { icon: <Wrench size={18} />, label: 'Downtime', to: '/downtime' },
      ],
    },
    {
      title: 'Planning & Finance',
      items: [
        { icon: <BarChart size={18} />, label: 'Capacity Planning', to: '/capacity-planning' },
        { icon: <DollarSign size={18} />, label: 'Costing', to: '/costing' },
        { icon: <DollarSign size={18} />, label: 'Accounting', to: '/accounting' },
        { icon: <BarChart size={18} />, label: 'Analytics', to: '/analytics' },
        { icon: <Bell size={18} />, label: 'Notifications', to: '/notifications' },
      ],
    },
    {
      title: 'Administration',
      items: [
        { icon: <Users size={18} />, label: 'Users', to: '/users' },
        { icon: <ShieldCheck size={18} />, label: 'Roles & Permissions', to: '/roles' },
        { icon: <Paintbrush size={18} />, label: 'Client Branding', to: '/branding' },
        { icon: <Settings size={18} />, label: 'Settings', to: '/settings' },
      ],
    },
  ];

  const { data: settings } = useGetSettings();
  const appName = (settings?.find((s: any) => s.key === 'app_name') as any)?.value || 'Nexa-MFG';
  const appLogo = (settings?.find((s: any) => s.key === 'app_logo_url') as any)?.value;
  const clientName = (settings?.find((s: any) => s.key === 'client_name') as any)?.value;

  return (
    <div className="flex h-screen bg-zinc-100 dark:bg-zinc-950">
      {/* Sidebar */}
      <aside className="w-80 bg-card border-r border-border/50 flex flex-col hidden md:flex">
        <div className="h-auto min-h-16 flex items-center px-6 border-b border-border/50 gap-3 py-3">
          {appLogo ? (
            <img src={appLogo} alt="Logo" className="h-9 w-9 object-contain rounded-md flex-shrink-0" />
          ) : (
            <div className="h-9 w-9 rounded-md bg-primary/15 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0">
              {appName.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-base font-bold tracking-tight text-primary leading-tight truncate">{appName}</h1>
            {clientName && <p className="text-xs text-muted-foreground truncate">{clientName}</p>}
          </div>
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
          <div className="flex items-center gap-2">
            {appLogo && <img src={appLogo} alt="Logo" className="h-8 w-8 object-contain" />}
            <h1 className="text-xl font-bold text-primary">{appName}</h1>
          </div>
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
