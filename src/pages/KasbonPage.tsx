import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import useAppStore from '@/store/useAppStore';
import { DataTable } from '@/components/shared/DataTable';
import { fRp, getStatusColor, cn, todayStr } from '@/lib/utils';
import type { Kasbon } from '@/types';
import { Plus, CreditCard, Trash2, Check, DollarSign } from 'lucide-react';

export default function KasbonPage() {
  const { karyawan, kasbon, addKasbon, bayarKasbon, lunasKasbon, deleteKasbon } = useAppStore();
  const [openForm, setOpenForm] = useState(false);
  const [form, setForm] = useState({
    karyawanId: '', jumlah: '', via: 'Gaji' as 'UM' | 'Gaji' | 'Keduanya',
    cicilanUM: '', cicilanGaji: '', ket: '',
  });

  const aktif = karyawan.filter(k => k.status === 'Aktif');
  const totalAktif = kasbon.filter(k => k.status === 'Aktif').reduce((s, k) => s + k.sisaHutang, 0);
  const totalLunas = kasbon.filter(k => k.status === 'Lunas').length;

  const handleSubmit = () => {
    if (!form.karyawanId || !form.jumlah) {
      toast.error('Pilih karyawan dan isi jumlah');
      return;
    }
    const k = karyawan.find(x => x.id === +form.karyawanId);
    if (!k) return;

    const jumlah = +form.jumlah;
    const cicilanUM = form.via !== 'Gaji' ? (+form.cicilanUM || 0) : 0;
    const cicilanGaji = form.via !== 'UM' ? (+form.cicilanGaji || 0) : 0;
    const cicilan = cicilanUM + cicilanGaji;

    addKasbon({
      tanggal: todayStr(),
      karyawanId: k.id,
      nama: k.nama,
      jumlah,
      via: form.via,
      cicilan,
      cicilanUM,
      cicilanGaji,
      sisaHutang: jumlah,
      ket: form.ket,
      status: 'Aktif',
      riwayatBayar: [],
    });

    toast.success(`Kas bon ${k.nama} ${fRp(jumlah)} dicatat`);
    setOpenForm(false);
    setForm({ karyawanId: '', jumlah: '', via: 'Gaji', cicilanUM: '', cicilanGaji: '', ket: '' });
  };

  const columns = [
    { key: 'tanggal', header: 'Tanggal', className: 'w-[100px]' },
    {
      key: 'nama',
      header: 'Nama',
      render: (k: Kasbon) => <span className="text-gray-800 dark:text-neutral-200 font-medium">{k.nama}</span>,
    },
    {
      key: 'jumlah',
      header: 'Jumlah',
      render: (k: Kasbon) => <span className="text-gray-600 dark:text-neutral-300">{fRp(k.jumlah)}</span>,
    },
    {
      key: 'via',
      header: 'Via',
      render: (k: Kasbon) => (
        <span className={cn("px-2 py-0.5 rounded-md text-xs",
          k.via === 'UM' ? 'bg-blue-500/10 text-blue-400' :
          k.via === 'Gaji' ? 'bg-purple-500/10 text-purple-400' :
          'bg-amber-500/10 text-amber-400'
        )}>
          {k.via}
        </span>
      ),
    },
    {
      key: 'cicilan',
      header: 'Cicilan',
      render: (k: Kasbon) => <span className="text-gray-600 dark:text-neutral-300 text-sm">{fRp(k.cicilanUM || k.cicilanGaji || k.cicilan)}/{k.via === 'UM' ? 'mgg' : 'bln'}</span>,
    },
    {
      key: 'sisa',
      header: 'Sisa',
      render: (k: Kasbon) => (
        <div className="flex items-center gap-2">
          <span className={k.sisaHutang > 0 ? 'text-red-400' : 'text-emerald-400'}>{fRp(k.sisaHutang)}</span>
          <div className="w-16 h-1.5 bg-gray-200 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full", k.status === 'Lunas' ? 'bg-emerald-500' : 'bg-amber-500')}
              style={{ width: `${Math.min(100, ((k.jumlah - k.sisaHutang) / k.jumlah) * 100)}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (k: Kasbon) => (
        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium border", getStatusColor(k.status))}>
          {k.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100">Kas Bon</h1>
          <p className="text-gray-500 dark:text-neutral-400 text-sm">{fRp(totalAktif)} sisa aktif · {totalLunas} lunas</p>
        </div>
        <Button onClick={() => setOpenForm(true)} className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold">
          <Plus className="w-4 h-4 mr-1" /> Tambah Kas Bon
        </Button>
      </div>

      <Card className="bg-white dark:bg-black border-gray-200 dark:border-neutral-800">
        <CardContent className="p-4">
          <DataTable
            columns={columns}
            data={[...kasbon].reverse()}
            searchPlaceholder="Cari nama..."
            searchFields={['nama']}
            pageSize={10}
            emptyMessage="Belum ada data kas bon"
            emptyIcon={<CreditCard className="w-8 h-8 text-gray-400 dark:text-neutral-600 mx-auto" />}
            actions={(k: Kasbon) => (
              <>
                {k.status === 'Aktif' && (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => {
                      const nominal = Math.min(k.cicilan || 0, k.sisaHutang);
                      bayarKasbon(k.id, nominal);
                      toast.success(`Pembayaran ${fRp(nominal)}`);
                    }} className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 h-8 w-8 p-0">
                      <DollarSign className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => { lunasKasbon(k.id); toast.success('Ditandai lunas'); }} className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 h-8 w-8 p-0">
                      <Check className="w-3.5 h-3.5" />
                    </Button>
                  </>
                )}
                <Button variant="ghost" size="sm" onClick={() => { deleteKasbon(k.id); toast.success('Data dihapus'); }} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </>
            )}
          />
        </CardContent>
      </Card>

      {/* Form Dialog */}
      {openForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <Card className="bg-white dark:bg-black border-gray-200 dark:border-neutral-800 w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-amber-400 text-lg">Tambah Kas Bon</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-gray-600 dark:text-neutral-300 text-xs">Karyawan</Label>
                <Select value={form.karyawanId} onValueChange={v => setForm({ ...form, karyawanId: v })}>
                  <SelectTrigger className="bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-neutral-200">
                    <SelectValue placeholder="Pilih karyawan" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 max-h-[200px]">
                    {aktif.map(k => (
                      <SelectItem key={k.id} value={String(k.id)} className="text-gray-800 dark:text-neutral-200">{k.nama} ({k.divisi})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-600 dark:text-neutral-300 text-xs">Jumlah (Rp)</Label>
                <Input type="number" value={form.jumlah} onChange={e => setForm({ ...form, jumlah: e.target.value })} className="bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-neutral-200" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-600 dark:text-neutral-300 text-xs">Cicilan Via</Label>
                <Select value={form.via} onValueChange={v => setForm({ ...form, via: v as 'UM' | 'Gaji' | 'Keduanya' })}>
                  <SelectTrigger className="bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-neutral-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700">
                    <SelectItem value="UM" className="text-gray-800 dark:text-neutral-200">UM Mingguan</SelectItem>
                    <SelectItem value="Gaji" className="text-gray-800 dark:text-neutral-200">Gaji Bulanan</SelectItem>
                    <SelectItem value="Keduanya" className="text-gray-800 dark:text-neutral-200">Keduanya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {(form.via === 'UM' || form.via === 'Keduanya') && (
                <div className="space-y-1.5">
                  <Label className="text-gray-600 dark:text-neutral-300 text-xs">Cicilan per Minggu (Rp)</Label>
                  <Input type="number" value={form.cicilanUM} onChange={e => setForm({ ...form, cicilanUM: e.target.value })} className="bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-neutral-200" />
                </div>
              )}
              {(form.via === 'Gaji' || form.via === 'Keduanya') && (
                <div className="space-y-1.5">
                  <Label className="text-gray-600 dark:text-neutral-300 text-xs">Cicilan per Bulan (Rp)</Label>
                  <Input type="number" value={form.cicilanGaji} onChange={e => setForm({ ...form, cicilanGaji: e.target.value })} className="bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-neutral-200" />
                </div>
              )}
              <div className="space-y-1.5">
                <Label className="text-gray-600 dark:text-neutral-300 text-xs">Keterangan</Label>
                <Input value={form.ket} onChange={e => setForm({ ...form, ket: e.target.value })} placeholder="Opsional" className="bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-neutral-200" />
              </div>
              <div className="flex gap-2 pt-2">
                <Button onClick={handleSubmit} className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold">
                  Simpan
                </Button>
                <Button variant="outline" onClick={() => setOpenForm(false)} className="bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-600 dark:text-neutral-300 hover:bg-gray-200 dark:bg-neutral-800">
                  Batal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
