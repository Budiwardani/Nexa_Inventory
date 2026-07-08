import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { useGetSettings } from '@/features/phase3/api/phase3Api';
import { useState } from 'react';
import {
  LogOut, Home, Users, Settings, Package, Factory, BarChart, ShieldCheck,
  FlaskConical, Wrench, Cpu, ClipboardList, DollarSign, Bell, Paintbrush,
  ChevronRight, Menu, X, ShoppingCart,
} from 'lucide-react';

type NavItemDef = {
  icon: React.ReactNode;
  label: string;
  to: string;
  children?: NavItemDef[];
};

type SectionDef = {
  title: string;
  items: NavItemDef[];
};

export const MainLayout = () => {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  // Track collapsed state per section title — default all expanded
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  // Mobile sidebar open state
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSection = (title: string) => {
    setCollapsed((prev) => ({ ...prev, [title]: !prev[title] }));
  };

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

  const sections: SectionDef[] = [
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
      title: 'Purchasing',
      items: [
        { icon: <ShoppingCart size={18} />, label: 'Suppliers', to: '/suppliers' },
        { icon: <ShoppingCart size={18} />, label: 'Purchase Orders', to: '/purchase-orders' },
        { icon: <Package size={18} />, label: 'Goods Receipt', to: '/goods-receipt' },
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
        {
          icon: <DollarSign size={18} />,
          label: 'Accounting',
          to: '/chart-of-accounts',
          children: [
            { icon: <ClipboardList size={16} />, label: 'Chart of Accounts', to: '/chart-of-accounts' },
            { icon: <ClipboardList size={16} />, label: 'Journals', to: '/journals' },
          ],
        },
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

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo / App header */}
      <div className="h-auto min-h-16 flex items-center px-5 border-b border-border/50 gap-3 py-3">
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
        {/* Close button for mobile */}
        <button
          onClick={() => setMobileOpen(false)}
          className="ml-auto md:hidden text-muted-foreground hover:text-foreground"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-3">
        <nav className="space-y-0.5 px-2">
          {sections.map((section) => {
            const isCollapsed = collapsed[section.title] ?? false;
            return (
              <div key={section.title} className="mb-1">
                {/* Section header — clickable to toggle */}
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors rounded-md hover:bg-secondary/50 group"
                >
                  <span>{section.title}</span>
                  <span className="transition-transform duration-200" style={{ transform: isCollapsed ? 'rotate(0deg)' : 'rotate(90deg)' }}>
                    <ChevronRight size={12} />
                  </span>
                </button>

                {/* Items — animate show/hide */}
                <div
                  className="overflow-hidden transition-all duration-200"
                  style={{ maxHeight: isCollapsed ? '0px' : '1000px', opacity: isCollapsed ? 0 : 1 }}
                >
                  <div className="py-0.5 space-y-0.5">
                    {section.items.map((item) => (
                      <div key={item.label}>
                        <NavItem
                          icon={item.icon}
                          label={item.label}
                          to={item.to}
                          onNavigate={() => setMobileOpen(false)}
                        />
                        {item.children?.map((child) => (
                          <NavSubItem
                            key={child.label}
                            icon={child.icon}
                            label={child.label}
                            to={child.to}
                            onNavigate={() => setMobileOpen(false)}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      {/* User footer */}
      <div className="p-4 border-t border-border/50 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-zinc-100 dark:bg-zinc-950">
      {/* Desktop Sidebar */}
      <aside className="w-72 bg-card border-r border-border/50 hidden md:flex flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border/50 flex flex-col md:hidden transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Top Bar */}
        <header className="h-14 bg-card border-b border-border/50 flex items-center justify-between px-4 md:hidden">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            {appLogo && <img src={appLogo} alt="Logo" className="h-7 w-7 object-contain" />}
            <h1 className="text-base font-bold text-primary">{appName}</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto p-5 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const NavItem = ({
  icon, label, to = '#', onNavigate,
}: {
  icon: React.ReactNode;
  label: string;
  to?: string;
  onNavigate?: () => void;
}) => {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm ${
          isActive
            ? 'bg-primary/10 text-primary font-medium'
            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
        }`
      }
      end={to === '/'}
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};

const NavSubItem = ({
  icon, label, to = '#', onNavigate,
}: {
  icon: React.ReactNode;
  label: string;
  to?: string;
  onNavigate?: () => void;
}) => {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center gap-3 pl-8 pr-3 py-1.5 rounded-md transition-colors text-sm ${
          isActive
            ? 'bg-primary/10 text-primary font-medium'
            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};
