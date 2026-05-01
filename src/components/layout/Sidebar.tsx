import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import useAppStore from '@/store/useAppStore';
import {
  LayoutDashboard, Users, ClipboardCheck, Clock, UtensilsCrossed,
  Banknote, CreditCard, Umbrella, FileBarChart, Settings,
  LogOut, ChevronLeft, ChevronRight, Bot, Menu, Sun, Moon,
  UserMinus, Shield, BarChart3, FolderOpen, Database, UserCog,
  GitBranch, Globe
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/', roles: ['staff', 'kepala', 'admin'], permission: undefined },
  { icon: Users, label: 'Data Karyawan', path: '/karyawan', roles: ['staff', 'kepala', 'admin'], permission: 'karyawan:view' as const },
  { icon: ClipboardCheck, label: 'Absensi', path: '/absensi', roles: ['staff', 'kepala', 'admin'], permission: 'absensi:view' as const },
  { icon: Clock, label: 'Lembur', path: '/lembur', roles: ['staff', 'kepala', 'admin'], permission: 'lembur:view' as const },
  { icon: UtensilsCrossed, label: 'Uang Makan', path: '/um', roles: ['staff', 'kepala', 'admin'], permission: 'um:view' as const },
  { icon: Banknote, label: 'Penggajian', path: '/gaji', roles: ['kepala', 'admin'], permission: 'gaji:view' as const },
  { icon: CreditCard, label: 'Kas Bon', path: '/kasbon', roles: ['staff', 'kepala', 'admin'], permission: 'kasbon:view' as const },
  { icon: Umbrella, label: 'Cuti', path: '/cuti', roles: ['staff', 'kepala', 'admin'], permission: 'cuti:view' as const },
  { icon: UserMinus, label: 'Offboarding', path: '/offboarding', roles: ['kepala', 'admin'], permission: undefined },
  { icon: FileBarChart, label: 'Laporan', path: '/laporan', roles: ['kepala', 'admin'], permission: 'laporan:view' as const },
  { icon: Bot, label: 'Asisten', path: '/asisten', roles: ['staff', 'kepala', 'admin'], permission: undefined },
  // D Class menus
  { icon: Shield, label: 'Audit Trail', path: '/audit', roles: ['kepala', 'admin'], permission: 'audit:view' as const },
  { icon: BarChart3, label: 'Analitik', path: '/analitik', roles: ['kepala', 'admin'], permission: 'analitik:view' as const },
  { icon: FolderOpen, label: 'Dokumen', path: '/dokumen', roles: ['staff', 'kepala', 'admin'], permission: 'dokumen:view' as const },
  { icon: GitBranch, label: 'Workflow', path: '/workflow', roles: ['kepala', 'admin'], permission: 'pengaturan:view' as const },
  { icon: UserCog, label: 'Akses', path: '/rbac', roles: ['kepala', 'admin'], permission: 'rbac:view' as const },
  { icon: Database, label: 'Backup', path: '/backup', roles: ['kepala', 'admin'], permission: 'backup:view' as const },
  { icon: Settings, label: 'Pengaturan', path: '/pengaturan', roles: ['kepala', 'admin'], permission: 'pengaturan:view' as const },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, userRole, userName, language, setLanguage, hasPermission } = useAppStore();
  const { resolvedTheme, toggleTheme } = useTheme();

  const toggleSidebar = () => setCollapsed(!collapsed);

  const handleNav = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredMenu = menuItems.filter(item => {
    if (!userRole || !item.roles.includes(userRole)) return false;
    if (item.permission) return hasPermission(item.permission);
    return true;
  });

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-100 dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 text-amber-400 lg:hidden hover:bg-gray-200 dark:bg-neutral-800 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full bg-white dark:bg-black border-r border-gray-200 dark:border-neutral-800 z-40 transition-all duration-300 flex flex-col',
          collapsed ? 'w-[72px]' : 'w-[260px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-neutral-800">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                <span className="text-slate-900 font-black text-sm">R</span>
              </div>
              <div>
                <div className="text-amber-400 font-bold text-sm leading-tight">RuangHRD</div>
                <div className="text-gray-400 dark:text-neutral-500 text-[10px] leading-tight">v6.0</div>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center mx-auto">
              <span className="text-slate-900 font-black text-sm">R</span>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex p-1 rounded-md hover:bg-gray-100 dark:bg-neutral-900 text-gray-500 dark:text-neutral-400 hover:text-amber-400 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* User Info */}
        {!collapsed && (
          <div className="px-4 py-3 border-b border-gray-200 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center text-amber-400 font-bold text-xs">
                {(userName || 'U').charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="text-gray-800 dark:text-neutral-200 text-xs font-medium truncate">{userName || 'User'}</div>
                <div className="text-gray-400 dark:text-neutral-500 text-[10px] capitalize">{userRole || 'Guest'}</div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
          {filteredMenu.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group',
                  isActive
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:bg-neutral-900 hover:text-gray-800 dark:text-neutral-200 border border-transparent',
                  collapsed && 'justify-center px-2'
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={cn(
                  'w-[18px] h-[18px] shrink-0',
                  isActive ? 'text-amber-400' : 'text-gray-500 dark:text-neutral-400 group-hover:text-gray-800 dark:text-neutral-200'
                )} />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Language + Theme + Logout */}
        <div className="p-2 border-t border-gray-200 dark:border-neutral-800 space-y-1">
          <button
            onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-800 dark:hover:text-neutral-200 transition-all',
              collapsed && 'justify-center px-2'
            )}
            title={collapsed ? (language === 'id' ? 'English' : 'Indonesia') : undefined}
          >
            <Globe className="w-[18px] h-[18px] shrink-0" />
            {!collapsed && <span className="font-medium">{language === 'id' ? 'ID' : 'EN'}</span>}
          </button>
          <button
            onClick={toggleTheme}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:bg-neutral-900 hover:text-gray-800 dark:text-neutral-200 transition-all',
              collapsed && 'justify-center px-2'
            )}
            title={collapsed ? (resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode') : undefined}
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="w-[18px] h-[18px] shrink-0" />
            ) : (
              <Moon className="w-[18px] h-[18px] shrink-0" />
            )}
            {!collapsed && <span className="font-medium">{resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
          <button
            onClick={handleLogout}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all',
              collapsed && 'justify-center px-2'
            )}
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut className="w-[18px] h-[18px] shrink-0" />
            {!collapsed && <span className="font-medium">Keluar</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
