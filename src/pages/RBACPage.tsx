import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import useAppStore from '@/store/useAppStore';
import { Shield, Plus, Trash2, UserPlus, Users, ShieldCheck, ShieldAlert } from 'lucide-react';
import type { Permission } from '@/types';

const PERMISSION_GROUPS: { label: string; perms: Permission[] }[] = [
  { label: 'Karyawan', perms: ['karyawan:view','karyawan:create','karyawan:edit','karyawan:delete'] },
  { label: 'Absensi', perms: ['absensi:view','absensi:create','absensi:edit','absensi:delete'] },
  { label: 'Lembur', perms: ['lembur:view','lembur:create','lembur:approve','lembur:edit'] },
  { label: 'Gaji', perms: ['gaji:view','gaji:proses','gaji:slip'] },
  { label: 'Uang Makan', perms: ['um:view','um:bayar'] },
  { label: 'Kasbon', perms: ['kasbon:view','kasbon:create','kasbon:edit'] },
  { label: 'Cuti', perms: ['cuti:view','cuti:approve'] },
  { label: 'Laporan & Analitik', perms: ['laporan:view','analitik:view'] },
  { label: 'Pengaturan', perms: ['pengaturan:view','pengaturan:edit'] },
  { label: 'Sistem', perms: ['audit:view','backup:view','backup:manage','rbac:view','rbac:manage','dokumen:view','dokumen:manage'] },
];

const PERM_LABELS: Record<string, string> = {
  'karyawan:view': 'Lihat', 'karyawan:create': 'Tambah', 'karyawan:edit': 'Edit', 'karyawan:delete': 'Hapus',
  'absensi:view': 'Lihat', 'absensi:create': 'Tambah', 'absensi:edit': 'Edit', 'absensi:delete': 'Hapus',
  'lembur:view': 'Lihat', 'lembur:create': 'Tambah', 'lembur:approve': 'Approve', 'lembur:edit': 'Edit',
  'gaji:view': 'Lihat', 'gaji:proses': 'Proses', 'gaji:slip': 'Slip',
  'um:view': 'Lihat', 'um:bayar': 'Bayar',
  'kasbon:view': 'Lihat', 'kasbon:create': 'Tambah', 'kasbon:edit': 'Edit',
  'cuti:view': 'Lihat', 'cuti:approve': 'Approve',
  'laporan:view': 'Lihat', 'analitik:view': 'Analitik',
  'pengaturan:view': 'Lihat', 'pengaturan:edit': 'Edit',
  'audit:view': 'Audit', 'backup:view': 'Backup', 'backup:manage': 'Restore',
  'rbac:view': 'RBAC', 'rbac:manage': 'Kelola RBAC',
  'dokumen:view': 'Lihat', 'dokumen:manage': 'Kelola',
};

export default function RBACPage() {
  const { roles, users, addRole, deleteRole, addUser, updateUser, deleteUser, hasPermission } = useAppStore();
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [newRolePerms, setNewRolePerms] = useState<Permission[]>([]);
  const [newUserOpen, setNewUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('');

  if (!hasPermission('rbac:view')) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Shield className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-neutral-100">Akses Ditolak</h2>
          <p className="text-gray-500 dark:text-neutral-400 text-sm">Anda tidak memiliki izin untuk mengakses RBAC</p>
        </div>
      </div>
    );
  }

  const togglePerm = (p: Permission) => {
    setNewRolePerms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100">Akses Pengguna</h1>
        <p className="text-gray-500 dark:text-neutral-400 text-sm">Kelola role, permission, dan akun pengguna</p>
      </div>

      {/* Users */}
      <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2"><Users className="w-4 h-4 text-blue-500" /> Pengguna ({users.length})</CardTitle>
          {hasPermission('rbac:manage') && (
            <Dialog open={newUserOpen} onOpenChange={setNewUserOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-amber-500 text-black hover:bg-amber-400"><UserPlus className="w-3.5 h-3.5 mr-1" /> Tambah</Button>
              </DialogTrigger>
              <DialogContent className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 max-w-md">
                <DialogHeader><DialogTitle>Tambah Pengguna</DialogTitle></DialogHeader>
                <div className="space-y-3 mt-2">
                  <Input placeholder="Nama Lengkap" value={newUserName} onChange={e => setNewUserName(e.target.value)} />
                  <Input placeholder="Username" value={newUserUsername} onChange={e => setNewUserUsername(e.target.value)} />
                  <Input placeholder="Email" type="email" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} />
                  <select value={newUserRole} onChange={e => setNewUserRole(e.target.value)} className="w-full p-2 rounded-md border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-gray-900 dark:text-neutral-200 text-sm">
                    <option value="">Pilih Role</option>
                    {roles.map(r => <option key={r.id} value={r.id}>{r.nama}</option>)}
                  </select>
                  <Button onClick={() => {
                    if (!newUserName || !newUserUsername || !newUserRole) { toast.error('Lengkapi semua field'); return; }
                    addUser({ username: newUserUsername, nama: newUserName, email: newUserEmail, roleId: newUserRole, aktif: true });
                    toast.success('Pengguna ditambahkan');
                    setNewUserName(''); setNewUserUsername(''); setNewUserEmail(''); setNewUserRole('');
                    setNewUserOpen(false);
                  }} className="w-full bg-amber-500 text-black">Simpan</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {users.map(u => {
              const role = roles.find(r => r.id === u.roleId);
              return (
                <div key={u.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-neutral-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 text-xs font-bold">{u.nama.charAt(0).toUpperCase()}</div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-neutral-200">{u.nama}</p>
                      <p className="text-xs text-gray-400 dark:text-neutral-600">@{u.username} · {role?.nama || u.roleId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={u.aktif ? 'text-emerald-500 text-xs' : 'text-gray-400 text-xs'}>{u.aktif ? 'Aktif' : 'Nonaktif'}</span>
                    {hasPermission('rbac:manage') && (
                      <Button variant="ghost" size="sm" onClick={() => { updateUser(u.id, { aktif: !u.aktif }); toast.success('Status diperbarui'); }} className="h-7 px-2 text-xs">
                        {u.aktif ? <ShieldAlert className="w-3.5 h-3.5 text-amber-500" /> : <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />}
                      </Button>
                    )}
                    {hasPermission('rbac:manage') && !role?.isSystem && (
                      <Button variant="ghost" size="sm" onClick={() => { deleteUser(u.id); toast.success('Pengguna dihapus'); }} className="h-7 w-7 p-0 text-red-500"><Trash2 className="w-3.5 h-3.5" /></Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Roles */}
      <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2"><Shield className="w-4 h-4 text-amber-500" /> Roles ({roles.length})</CardTitle>
          {hasPermission('rbac:manage') && (
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="border-amber-200 dark:border-amber-900 text-amber-500"><Plus className="w-3.5 h-3.5 mr-1" /> Role Baru</Button>
              </DialogTrigger>
              <DialogContent className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 max-w-lg max-h-[80vh] overflow-y-auto">
                <DialogHeader><DialogTitle>Buat Role Baru</DialogTitle></DialogHeader>
                <div className="space-y-3 mt-2">
                  <Input placeholder="Nama Role" value={newRoleName} onChange={e => setNewRoleName(e.target.value)} />
                  <Input placeholder="Deskripsi" value={newRoleDesc} onChange={e => setNewRoleDesc(e.target.value)} />
                  <div className="space-y-3">
                    {PERMISSION_GROUPS.map(g => (
                      <div key={g.label}>
                        <p className="text-xs font-medium text-gray-500 dark:text-neutral-500 mb-1.5">{g.label}</p>
                        <div className="flex flex-wrap gap-2">
                          {g.perms.map(p => (
                            <label key={p} className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-gray-200 dark:border-neutral-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-900/50">
                              <Switch checked={newRolePerms.includes(p)} onCheckedChange={() => togglePerm(p)} className="scale-75" />
                              <span className="text-xs text-gray-600 dark:text-neutral-400">{PERM_LABELS[p] || p}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button onClick={() => {
                    if (!newRoleName || newRolePerms.length === 0) { toast.error('Isi nama dan pilih minimal 1 permission'); return; }
                    addRole({ nama: newRoleName, deskripsi: newRoleDesc, permissions: newRolePerms });
                    toast.success('Role dibuat');
                    setNewRoleName(''); setNewRoleDesc(''); setNewRolePerms([]);
                  }} className="w-full bg-amber-500 text-black">Simpan Role</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {roles.map(r => (
              <div key={r.id} className="p-3 rounded-lg border border-gray-100 dark:border-neutral-800">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-neutral-200">{r.nama} {r.isSystem && <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">System</span>}</p>
                    <p className="text-xs text-gray-400 dark:text-neutral-600">{r.deskripsi} · {r.permissions.length} permission</p>
                  </div>
                  {hasPermission('rbac:manage') && !r.isSystem && (
                    <Button variant="ghost" size="sm" onClick={() => { deleteRole(r.id); toast.success('Role dihapus'); }} className="h-7 w-7 p-0 text-red-500"><Trash2 className="w-3.5 h-3.5" /></Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {r.permissions.slice(0, 8).map(p => (
                    <span key={p} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-neutral-500">{PERM_LABELS[p] || p}</span>
                  ))}
                  {r.permissions.length > 8 && <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-neutral-800 text-gray-400 dark:text-neutral-600">+{r.permissions.length - 8}</span>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
