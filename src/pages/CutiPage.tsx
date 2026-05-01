import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import useAppStore from '@/store/useAppStore';
import { SortableTable } from '@/components/shared/SortableTable';
import { getStatusColor, cn, todayStr } from '@/lib/utils';
import type { Cuti } from '@/types';
import { Plus, Umbrella, Check, X, Trash2 } from 'lucide-react';

export default function CutiPage() {
  const { karyawan, cuti, addCuti, approveCuti, deleteCuti, getSisaCuti, userRole } = useAppStore();
  const [openForm, setOpenForm] = useState(false);
  const [form, setForm] = useState({
    karyawanId: '', jenis: 'Cuti Tahunan' as Cuti['jenis'], mulai: '', selesai: '', hari: '1', ket: '',
  });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const aktif = karyawan.filter(k => k.status === 'Aktif');
  const totalPending = cuti.filter(c => c.status === 'Pending').length;
  const totalDisetujui = cuti.filter(c => c.status === 'Disetujui').length;

  const handleSubmit = () => {
    if (!form.karyawanId || !form.mulai || !form.selesai) { toast.error('Lengkapi semua field'); return; }
    const k = karyawan.find(x => x.id === +form.karyawanId);
    if (!k) return;
    const hari = +form.hari || Math.max(1, Math.round((new Date(form.selesai).getTime() - new Date(form.mulai).getTime()) / 86400000) + 1);
    addCuti({ ajuan: todayStr(), karyawanId: k.id, nama: k.nama, jenis: form.jenis, mulai: form.mulai, selesai: form.selesai, hari, ket: form.ket, status: 'Pending' });
    toast.success(`Pengajuan cuti ${k.nama} tercatat`);
    setOpenForm(false);
    setForm({ karyawanId: '', jenis: 'Cuti Tahunan', mulai: '', selesai: '', hari: '1', ket: '' });
  };

  const handleBulkApprove = (ids: number[]) => {
    ids.forEach(id => approveCuti(id, 'Disetujui'));
    toast.success(`${ids.length} cuti disetujui`);
    setSelectedIds([]);
  };

  const handleBulkReject = (ids: number[]) => {
    ids.forEach(id => approveCuti(id, 'Ditolak'));
    toast.success(`${ids.length} cuti ditolak`);
    setSelectedIds([]);
  };

  const columns = [
    { key: 'ajuan', header: 'Tanggal Ajuan', sortable: true, className: 'w-[110px]' },
    { key: 'nama', header: 'Nama', sortable: true, render: (c: Cuti) => (<div><p className="font-medium text-gray-800 dark:text-neutral-200">{c.nama}</p><p className="text-gray-400 dark:text-neutral-600 text-xs">{c.jenis}</p></div>) },
    { key: 'mulai', header: 'Mulai', sortable: true, className: 'w-[100px]', render: (c: Cuti) => <span className="text-gray-600 dark:text-neutral-400">{c.mulai}</span> },
    { key: 'selesai', header: 'Selesai', className: 'w-[100px]', render: (c: Cuti) => <span className="text-gray-600 dark:text-neutral-400">{c.selesai}</span> },
    { key: 'hari', header: 'Hari', sortable: true, className: 'w-[60px]', render: (c: Cuti) => <span className="text-gray-600 dark:text-neutral-400 font-medium">{c.hari}</span> },
    { key: 'status', header: 'Status', sortable: true, render: (c: Cuti) => (<span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium border", getStatusColor(c.status))}>{c.status}</span>) },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100">Cuti</h1>
          <p className="text-gray-500 dark:text-neutral-400 text-sm">{totalPending} pending &middot; {totalDisetujui} disetujui</p>
        </div>
        <Button onClick={() => setOpenForm(true)} className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"><Plus className="w-4 h-4 mr-1" /> Ajukan Cuti</Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {aktif.slice(0, 4).map(k => {
          const sisa = getSisaCuti(k.id);
          return (
            <Card key={k.id} className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
              <CardContent className="p-3">
                <p className="text-gray-400 dark:text-neutral-600 text-xs truncate">{k.nama}</p>
                <p className={cn("text-lg font-bold", sisa > 3 ? 'text-emerald-500' : sisa > 0 ? 'text-amber-500' : 'text-red-500')}>{sisa} hari</p>
                <p className="text-gray-400 dark:text-neutral-600 text-[10px]">sisa cuti</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
        <CardContent className="p-4">
          <SortableTable
            columns={columns} data={[...cuti].reverse()}
            searchPlaceholder="Cari nama..." searchFields={['nama']} pageSize={10}
            emptyMessage="Belum ada pengajuan cuti" emptyIcon={<Umbrella className="w-8 h-8 text-gray-300 dark:text-neutral-700 mx-auto" />}
            onSelectionChange={setSelectedIds}
            bulkActions={userRole === 'kepala' && selectedIds.length > 0 ? [
              { label: `Approve (${selectedIds.length})`, onClick: handleBulkApprove },
              { label: `Tolak (${selectedIds.length})`, onClick: handleBulkReject, variant: 'destructive' },
            ] : undefined}
            actions={(c: Cuti) => (
              <>
                {c.status === 'Pending' && userRole === 'kepala' && (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => { approveCuti(c.id, 'Disetujui'); toast.success('Cuti disetujui'); }} className="text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 h-8 w-8 p-0"><Check className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => { approveCuti(c.id, 'Ditolak'); toast.success('Cuti ditolak'); }} className="text-red-500 hover:text-red-400 hover:bg-red-500/10 h-8 w-8 p-0"><X className="w-3.5 h-3.5" /></Button>
                  </>
                )}
                <Button variant="ghost" size="sm" onClick={() => { deleteCuti(c.id); toast.success('Data dihapus'); }} className="text-red-500 hover:text-red-400 hover:bg-red-500/10 h-8 w-8 p-0"><Trash2 className="w-3.5 h-3.5" /></Button>
              </>
            )}
          />
        </CardContent>
      </Card>

      {openForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 w-full max-w-md">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-amber-500 text-lg font-bold">Ajukan Cuti</h2>
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-600 dark:text-neutral-400">Karyawan</Label>
                <Select value={form.karyawanId} onValueChange={v => setForm({ ...form, karyawanId: v })}>
                  <SelectTrigger className="bg-gray-100 dark:bg-neutral-800 border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-neutral-200"><SelectValue placeholder="Pilih karyawan" /></SelectTrigger>
                  <SelectContent className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 max-h-[200px]">
                    {aktif.map(k => <SelectItem key={k.id} value={String(k.id)} className="text-gray-900 dark:text-neutral-200">{k.nama} ({k.divisi}) &mdash; Sisa: {getSisaCuti(k.id)} hari</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-600 dark:text-neutral-400">Jenis Cuti</Label>
                <Select value={form.jenis} onValueChange={v => setForm({ ...form, jenis: v as Cuti['jenis'] })}>
                  <SelectTrigger className="bg-gray-100 dark:bg-neutral-800 border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-neutral-200"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
                    {['Cuti Tahunan', 'Cuti Melahirkan', 'Cuti Sakit', 'Izin Pribadi', 'Dinas Luar'].map(j => <SelectItem key={j} value={j} className="text-gray-900 dark:text-neutral-200">{j}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label className="text-xs text-gray-600 dark:text-neutral-400">Mulai</Label><Input type="date" value={form.mulai} onChange={e => setForm({ ...form, mulai: e.target.value })} className="bg-gray-100 dark:bg-neutral-800 border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-neutral-200" /></div>
                <div className="space-y-1.5"><Label className="text-xs text-gray-600 dark:text-neutral-400">Selesai</Label><Input type="date" value={form.selesai} onChange={e => setForm({ ...form, selesai: e.target.value })} className="bg-gray-100 dark:bg-neutral-800 border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-neutral-200" /></div>
              </div>
              <div className="space-y-1.5"><Label className="text-xs text-gray-600 dark:text-neutral-400">Jumlah Hari</Label><Input type="number" value={form.hari} onChange={e => setForm({ ...form, hari: e.target.value })} className="bg-gray-100 dark:bg-neutral-800 border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-neutral-200" /></div>
              <div className="space-y-1.5"><Label className="text-xs text-gray-600 dark:text-neutral-400">Keterangan</Label><Input value={form.ket} onChange={e => setForm({ ...form, ket: e.target.value })} placeholder="Opsional" className="bg-gray-100 dark:bg-neutral-800 border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-neutral-200" /></div>
              <div className="flex gap-2 pt-2">
                <Button onClick={handleSubmit} className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-semibold">Ajukan</Button>
                <Button variant="outline" onClick={() => setOpenForm(false)} className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 text-gray-600 dark:text-neutral-300">Batal</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
