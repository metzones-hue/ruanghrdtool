import { useState, useEffect, useCallback } from 'react';
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from '@/components/ui/command';
import {
  LayoutDashboard, Users, ClipboardCheck, Clock, UtensilsCrossed,
  Banknote, CreditCard, Umbrella, FileBarChart, Settings, Bot,
  Shield, BarChart3, FolderOpen, Database, UserCog, GitBranch,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/', keywords: 'home beranda' },
  { icon: Users, label: 'Data Karyawan', path: '/karyawan', keywords: 'pegawai staff employee' },
  { icon: ClipboardCheck, label: 'Absensi', path: '/absensi', keywords: 'kehadiran hadir alpha' },
  { icon: Clock, label: 'Lembur', path: '/lembur', keywords: 'overtime approve' },
  { icon: UtensilsCrossed, label: 'Uang Makan', path: '/um', keywords: 'um makan' },
  { icon: Banknote, label: 'Penggajian', path: '/gaji', keywords: 'gaji payroll slip' },
  { icon: CreditCard, label: 'Kas Bon', path: '/kasbon', keywords: 'kasbon pinjam hutang' },
  { icon: Umbrella, label: 'Cuti', path: '/cuti', keywords: 'leave izin' },
  { icon: FileBarChart, label: 'Laporan', path: '/laporan', keywords: 'report export excel' },
  { icon: Bot, label: 'Asisten HRD', path: '/asisten', keywords: 'ai chat bot' },
  // D Class
  { icon: Shield, label: 'Audit Trail', path: '/audit', keywords: 'log riwayat' },
  { icon: BarChart3, label: 'Analitik', path: '/analitik', keywords: 'analytics forecast' },
  { icon: FolderOpen, label: 'Dokumen', path: '/dokumen', keywords: 'file upload' },
  { icon: GitBranch, label: 'Workflow', path: '/workflow', keywords: 'approval chain' },
  { icon: UserCog, label: 'Akses Pengguna', path: '/rbac', keywords: 'role permission' },
  { icon: Database, label: 'Backup', path: '/backup', keywords: 'export import' },
  { icon: Settings, label: 'Pengaturan', path: '/pengaturan', keywords: 'setting config' },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handleSelect = useCallback((path: string) => {
    setOpen(false);
    navigate(path);
  }, [navigate]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Cari menu... (Ctrl+K)" className="text-gray-900 dark:text-neutral-200" />
      <CommandList>
        <CommandEmpty className="text-gray-500 dark:text-neutral-500 text-sm py-4 text-center">Menu tidak ditemukan</CommandEmpty>
        <CommandGroup heading="Navigasi">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <CommandItem
                key={item.path}
                onSelect={() => handleSelect(item.path)}
                className="flex items-center gap-3 cursor-pointer text-gray-800 dark:text-neutral-300"
              >
                <Icon className="w-4 h-4 text-gray-400 dark:text-neutral-500" />
                <span>{item.label}</span>
                <span className="ml-auto text-xs text-gray-300 dark:text-neutral-700">{item.path}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export default CommandPalette;
