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
import { fRp, getStatusColor, cn, hitungJam, cekMingguOrMerah, cekAfter2230, currentBulan, getBulanOptions, todayStr } from '@/lib/utils';
import { defaultPengaturan } from '@/data/seed';
import type { Lembur } from '@/types';
import { Plus, Check, X, Calculator } from 'lucide-react';

export default function LemburPage() {
  const { karyawan, lembur, absensi, addLembur, approveLembur, pengaturan, userRole } = useAppStore();
  const pg = pengaturan || defaultPengaturan;
  const [bulan, setBulan] = useState(currentBulan());
  const [openForm, setOpenForm] = useState(false);
  const [form, setForm] = useState({
    karyawanId: '', tanggal: todayStr(), mulai: '', selesai: '', alasan: '',
  });
  const [filterCabang, setFilterCabang] = useState('all');
  const aktif = karyawan.filter(k => k.status === 'Aktif');
  const filtered = lembur.filter(l => l.tanggal.startsWith(bulan) && (filterCabang === 'all' || l.divisi === filterCabang));

  const toMin = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  const handleSubmit = () => {
    if (!form.karyawanId || !form.tanggal || !form.mulai || !form.selesai) {
      toast.error('Lengkapi semua field');
      return;
    }
    const k = karyawan.find(x => x.id === +form.karyawanId);
    if (!k) return;

    const jamTotal = hitungJam(form.mulai, form.selesai);
    const isMinggu = cekMingguOrMerah(form.tanggal);
    const melebihi = cekAfter2230(form.selesai);
    const bonusMalam = (melebihi && k.lemburMalamAktif !== 'tidak') ? pg.bonusMalam : 0;
    const bonusUM = jamTotal > 8 ? (k.divisi === 'HO' ? pg.umPerHariHO : pg.umPerHari) * 2 : 0;
    let upah = jamTotal * (k.upahLembur || pg.upahLembur);
    if (isMinggu) upah *= 2;
    const totalUpah = upah + bonusMalam + bonusUM;

    addLembur({
      tanggal: form.tanggal,
      karyawanId: k.id,
      nama: k.nama,
      divisi: k.divisi,
      mulai: form.mulai,
      selesai: form.selesai,
      jamTotal,
      upahPerJam: k.upahLembur || pg.upahLembur,
      isMinggu,
      melebihi2230: melebihi,
      bonusMalam,
      bonusUM,
      totalUpah,
      alasan: form.alasan || '-',
      status: 'Pending',
    });
    toast.success(`Lembur ${k.nama} diajukan`);
    setOpenForm(false);
    setForm({ karyawanId: '', tanggal: todayStr(), mulai: '', selesai: '', alasan: '' });
  };

  const recalculateFromAbsensi = () => {
    let created = 0;
    absensi.forEach(a => {
      if (a.status !== 'Hadir' || !a.masuk || !a.keluar) return;
      const k = karyawan.find(x => x.id === a.karyawanId);
      if (!k || k.status !== 'Aktif') return;

      const isShift2 = (parseInt(a.masuk.split(':')[0]) * 60 + parseInt(a.masuk.split(':')[1])) >=
        (parseInt(pg.thresholdShift2.split(':')[0]) * 60 + parseInt(pg.thresholdShift2.split(':')[1]));
      const jamKeluar = isShift2 ? pg.jamKeluarShift2 : pg.jamKeluarShift1;
      if (toMin(a.keluar) <= toMin(jamKeluar)) return;

      const jamTotal = hitungJam(jamKeluar, a.keluar);
      if (jamTotal < 1) return;

      const melebihi = toMin(a.keluar!) >= toMin(pg.batasMalam);
      const bonusMalam = (melebihi && k.lemburMalamAktif !== 'tidak') ? pg.bonusMalam : 0;
      const isMingguAuto = cekMingguOrMerah(a.tanggal);
      const bonusUM = jamTotal > 8 ? (k.divisi === 'HO' ? pg.umPerHariHO : pg.umPerHari) * 2 : 0;
      let upah = jamTotal * (k.upahLembur || pg.upahLembur);
      if (isMingguAuto) upah *= 2;
      const totalUpah = upah + bonusMalam + bonusUM;

      const ex = lembur.find(l => l.karyawanId === a.karyawanId && l.tanggal === a.tanggal && l.mulai === jamKeluar);
      if (!ex) {
        addLembur({
          tanggal: a.tanggal, karyawanId: k.id, nama: k.nama, divisi: k.divisi,
          mulai: jamKeluar, selesai: a.keluar!, jamTotal,
          upahPerJam: k.upahLembur || pg.upahLembur,
          isMinggu: isMingguAuto, melebihi2230: melebihi,
          bonusMalam, bonusUM, totalUpah,
          alasan: 'Auto-detect dari absensi', status: 'Pending', autoDetect: true,
        });
        created++;
      }
    });
    toast.success(`${created} lembur auto-detect berhasil dibuat`);
  };

  const totalPending = filtered.filter(l => l.status === 'Pending').length;
  const totalDisetujui = filtered.filter(l => l.status === 'Disetujui').length;
  const totalUpah = filtered.filter(l => l.status === 'Disetujui').reduce((s, l) => s + l.totalUpah, 0);

  const bulkApprove = (status: 'Disetujui' | 'Ditolak') => {
    selectedIds.forEach(id => approveLembur(id, status));
    toast.success(`${selectedIds.length} lembur ${status.toLowerCase()}`);
    setSelectedIds([]);
  };

  const columns = [
    { key: 'nama' as keyof Lembur, label: 'Nama', header: 'Nama' },
    { key: 'tanggal' as keyof Lembur, label: 'Tanggal', header: 'Tanggal' },
    { key: 'divisi' as keyof Lembur, label: 'Cabang', header: 'Cabang' },
    { key: 'jamTotal' as keyof Lembur, label: 'Jam', header: 'Jam', format: (v: number) => `${v.toFixed(1)} jam` },
   { key: 'totalUpah' as keyof Lembur, label: 'Upah', header: 'Upah', format: (v: number) => fRp(Math.ceil(v / 100) * 100) },
    {
      key: 'status' as keyof Lembur,
      label: 'Status',
      header: 'Status',
      render: (l: Lembur) => (
        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium border", getStatusColor(l.status))}>{l.status}</span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100">Lembur</h1>
          <p className="text-gray-500 dark:text-neutral-400 text-sm">{totalPending} pending &middot; {totalDisetujui} disetujui</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={recalculateFromAbsensi} className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 text-gray-600 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800">
            <Calculator className="w-4 h-4 mr-1" /> Auto-Detect
          </Button>
          <Button onClick={() => setOpenForm(true)} className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">
            <Plus className="w-4 h-4 mr-1" /> Input Lembur
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800"><CardContent className="p-3"><p className="text-gray-400 dark:text-neutral-600 text-xs">Pending</p><p className="text-amber-500 text-xl font-bold">{totalPending}</p></CardContent></Card>
        <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800"><CardContent className="p-3"><p className="text-gray-400 dark:text-neutral-600 text-xs">Disetujui</p><p className="text-emerald-500 text-xl font-bold">{totalDisetujui}</p></CardContent></Card>
        <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800"><CardContent className="p-3"><p className="text-gray-400 dark:text-neutral-600 text-xs">Total Upah</p><p className="text-amber-500 text-xl font-bold">{fRp(totalUpah)}</p></CardContent></Card>
      </div>

      <Select value={bulan} onValueChange={setBulan}>
        <SelectTrigger className="w-[220px] bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-neutral-200">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
          {getBulanOptions().map(b => <SelectItem key={b.value} value={b.value} className="text-gray-900 dark:text-neutral-200">{b.label}</SelectItem>)}
        </SelectContent>
      <Select value={filterCabang} onValueChange={setFilterCabang}>
  <SelectTrigger className="w-[150px] bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-neutral-200">
    <SelectValue placeholder="Semua Cabang" />
  </SelectTrigger>
  <SelectContent className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
    <SelectItem value="all" className="text-gray-900 dark:text-neutral-200">Semua Cabang</SelectItem>
    {[...new Set(lembur.map(l => l.divisi).filter(Boolean))].map(c => (
      <SelectItem key={c} value={c!} className="text-gray-900 dark:text-neutral-200">{c}</SelectItem>
    ))}
  </SelectContent>
</Select>

      {userRole === 'kepala' && selectedIds.length > 0 && (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => bulkApprove('Disetujui')} className="bg-emerald-500 text-white"><Check className="w-3.5 h-3.5 mr-1" /> Setuju ({selectedIds.length})</Button>
          <Button size="sm" variant="outline" onClick={() => bulkApprove('Ditolak')} className="text-red-500 border-red-200"><X className="w-3.5 h-3.5 mr-1" /> Tolak</Button>
        </div>
      )}

      <SortableTable
        data={filtered}
        columns={columns}
        actions={(l: Lembur) => (
          l.status === 'Pending' && userRole === 'kepala' ? (
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => { approveLembur(l.id, 'Disetujui'); toast.success('Disetujui'); }} className="text-emerald-500 hover:text-emerald-400 h-7 px-2"><Check className="w-3.5 h-3.5 mr-1" /></Button>
              <Button variant="ghost" size="sm" onClick={() => { approveLembur(l.id, 'Ditolak'); toast.success('Ditolak'); }} className="text-red-500 hover:text-red-400 h-7 px-2"><X className="w-3.5 h-3.5 mr-1" /></Button>
            </div>
          ) : null
        )}
        onSelectionChange={setSelectedIds}
      />

      {openForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 w-full max-w-md">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-amber-500 text-lg font-bold">Input Lembur</h2>
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-600 dark:text-neutral-400">Karyawan</Label>
                <Select value={form.karyawanId} onValueChange={v => setForm({ ...form, karyawanId: v })}>
                  <SelectTrigger className="bg-gray-100 dark:bg-neutral-800 border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-neutral-200">
                    <SelectValue placeholder="Pilih karyawan" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 max-h-[200px]">
                    {aktif.map(k => <SelectItem key={k.id} value={String(k.id)} className="text-gray-900 dark:text-neutral-200">{k.nama} ({k.divisi})</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label className="text-xs text-gray-600 dark:text-neutral-400">Tanggal</Label><Input type="date" value={form.tanggal} onChange={e => setForm({ ...form, tanggal: e.target.value })} className="bg-gray-100 dark:bg-neutral-800 border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-neutral-200" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label className="text-xs text-gray-600 dark:text-neutral-400">Mulai</Label><Input type="time" value={form.mulai} onChange={e => setForm({ ...form, mulai: e.target.value })} className="bg-gray-100 dark:bg-neutral-800 border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-neutral-200" /></div>
                <div className="space-y-1.5"><Label className="text-xs text-gray-600 dark:text-neutral-400">Selesai</Label><Input type="time" value={form.selesai} onChange={e => setForm({ ...form, selesai: e.target.value })} className="bg-gray-100 dark:bg-neutral-800 border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-neutral-200" /></div>
              </div>
              <div className="space-y-1.5"><Label className="text-xs text-gray-600 dark:text-neutral-400">Alasan</Label><Input value={form.alasan} onChange={e => setForm({ ...form, alasan: e.target.value })} placeholder="Opsional" className="bg-gray-100 dark:bg-neutral-800 border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-neutral-200" /></div>
              <div className="flex gap-2 pt-2">
                <Button onClick={handleSubmit} className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-semibold">Simpan</Button>
                <Button variant="outline" onClick={() => setOpenForm(false)} className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 text-gray-600 dark:text-neutral-300">Batal</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
