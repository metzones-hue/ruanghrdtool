import { useState, useRef } from 'react';
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
import { getStatusColor, cn, todayStr, currentBulan, getBulanOptions } from '@/lib/utils';
import { defaultPengaturan } from '@/data/seed';
import type { Absensi } from '@/types';
import { Plus, Upload, Trash2, ClipboardCheck } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function AbsensiPage() {
  const { karyawan, absensi, addAbsensi, deleteAbsensi, importAbsensi, pengaturan } = useAppStore();
  const [bulan, setBulan] = useState(currentBulan());
  const [openForm, setOpenForm] = useState(false);
  const [form, setForm] = useState({
    karyawanId: '', status: 'Hadir' as 'Hadir' | 'Cuti' | 'Sakit' | 'Izin' | 'Alpha',
    tanggal: todayStr(), masuk: '', keluar: '', keterangan: '',
  });
  const [filterCabang, setFilterCabang] = useState('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aktif = karyawan.filter(k => k.status === 'Aktif');
  const filteredAbsensi = absensi.filter(a => {
  if (!a.tanggal.startsWith(bulan)) return false;
  if (filterCabang === 'all') return true;
  const k = karyawan.find(k => k.id === a.karyawanId);
  return k?.divisi === filterCabang;
});
  const pg = pengaturan || defaultPengaturan;

  const handleSubmit = () => {
    if (!form.karyawanId || !form.tanggal) {
      toast.error('Pilih karyawan dan tanggal');
      return;
    }
    const k = karyawan.find(x => x.id === +form.karyawanId);
    if (!k) return;

    // Auto shift detection
    const isShift2 = form.masuk ?
      (parseInt(form.masuk.split(':')[0]) * 60 + parseInt(form.masuk.split(':')[1])) >=
      (parseInt(pg.thresholdShift2.split(':')[0]) * 60 + parseInt(pg.thresholdShift2.split(':')[1]))
      : k.shift === 2;

    // Auto telat calculation
    let menitTelat = 0;
    if (form.status === 'Hadir' && form.masuk) {
      const jamMasukMin = parseInt(form.masuk.split(':')[0]) * 60 + parseInt(form.masuk.split(':')[1]);
      const batasMin = isShift2
        ? parseInt(pg.batasTelatShift2.toString())
        : parseInt(pg.batasTelat.toString());
      // Compare with shift start + tolerance
      const jm1 = (pg.jamMasukShift1 || '08:30').split(':').map(Number); const jm2 = (pg.jamMasukShift2 || '12:00').split(':').map(Number);
      const shiftStartMin = isShift2 ? jm2[0]*60+jm2[1] : jm1[0]*60+jm1[1];
      const terlambat = jamMasukMin - shiftStartMin - batasMin;
      if (terlambat > 0) menitTelat = terlambat;
    }

    addAbsensi({
      karyawanId: k.id,
      nama: k.nama,
      tanggal: form.tanggal,
      status: form.status,
      masuk: form.masuk || undefined,
      keluar: form.keluar || undefined,
      menitTelat,
      shift: isShift2 ? 2 : 1,
      keterangan: form.keterangan || undefined,
    });
    toast.success(`Absensi ${k.nama} tercatat`);
    setOpenForm(false);
    setForm({ karyawanId: '', status: 'Hadir', tanggal: todayStr(), masuk: '', keluar: '', keterangan: '' });
  };

  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = new Uint8Array(ev.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<string, string>[];

        const imported: Parameters<typeof importAbsensi>[0] = [];
        let success = 0, failed = 0;

        jsonData.forEach((row) => {
          const nama = row['Nama'] || row['nama'] || '';
          const tgl = row['Tanggal'] || row['tanggal'] || '';
          const status = (row['Status'] || row['status'] || 'Hadir') as Absensi['status'];
          const masuk = row['Check In'] || row['masuk'] || row['Check_In'] || '';
          const keluar = row['Check Out'] || row['keluar'] || row['Check_Out'] || '';
          const keterangan = row['Keterangan'] || row['keterangan'] || '';

          const k = karyawan.find(x => x.nama.toLowerCase() === nama.toString().toLowerCase());
          if (!k || !tgl) {
            failed++;
            return;
          }

          // Auto shift
          const isShift2 = masuk ?
            (parseInt(masuk.split(':')[0]) * 60 + parseInt(masuk.split(':')[1])) >=
            (parseInt(pg.thresholdShift2.split(':')[0]) * 60 + parseInt(pg.thresholdShift2.split(':')[1]))
            : k.shift === 2;

          imported.push({
            karyawanId: k.id,
            nama: k.nama,
            tanggal: tgl.toString(),
            status,
            masuk: masuk || undefined,
            keluar: keluar || undefined,
            menitTelat: (() => {
  if (status !== 'Hadir' || !masuk) return 0;
  const jamMasukMin = parseInt(masuk.split(':')[0]) * 60 + parseInt(masuk.split(':')[1]);
  const jm1 = (pg.jamMasukShift1 || '08:30').split(':').map(Number);
  const jm2 = (pg.jamMasukShift2 || '12:00').split(':').map(Number);
  const shiftStartMin = isShift2 ? jm2[0]*60+jm2[1] : jm1[0]*60+jm1[1];
  const batasMin = isShift2 ? parseInt(pg.batasTelatShift2.toString()) : parseInt(pg.batasTelat.toString());
  const terlambat = jamMasukMin - shiftStartMin - batasMin;
  return Math.min(Math.max(terlambat, 0), 40);
})(),
            shift: isShift2 ? 2 : 1,
            keterangan: keterangan || undefined,
          });
          success++;
        });

        if (imported.length > 0) {
          importAbsensi(imported);
        }
        toast.success(`Import selesai: ${success} sukses, ${failed} gagal`);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch {
        toast.error('Gagal membaca file Excel');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const columns = [
    { key: 'tanggal', header: 'Tanggal', className: 'w-[100px]' },
    {
      key: 'nama',
      header: 'Nama',
      render: (a: Absensi) => (
        <div>
          <p className="font-medium text-gray-800 dark:text-neutral-200">{a.nama}</p>
          <p className="text-gray-400 dark:text-neutral-500 text-xs">Shift {a.shift}</p>
        </div>
      ),
    },
    {
      key: 'divisi',
      header: 'Cabang',
      render: (a: Absensi) => {
        const k = karyawan.find(x => x.id === a.karyawanId);
        return <span className="px-2 py-0.5 rounded-md bg-gray-200 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 text-xs">{k?.divisi || '-'}</span>;
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (a: Absensi) => (
        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium border", getStatusColor(a.status))}>
          {a.status}
        </span>
      ),
    },
    { key: 'masuk', header: 'Masuk', className: 'w-[70px]', render: (a: Absensi) => <span className="text-gray-600 dark:text-neutral-300">{a.masuk || '-'}</span> },
    { key: 'keluar', header: 'Keluar', className: 'w-[70px]', render: (a: Absensi) => <span className="text-gray-600 dark:text-neutral-300">{a.keluar || '-'}</span> },
    {
      key: 'menitTelat',
      header: 'Telat',
      render: (a: Absensi) => a.menitTelat > 0 ? (
        <span className="text-red-400 font-medium">{a.menitTelat} mnt</span>
      ) : null,
    },
  ];

  const summary = {
    hadir: filteredAbsensi.filter(a => a.status === 'Hadir').length,
    alpha: filteredAbsensi.filter(a => a.status === 'Alpha').length,
    cuti: filteredAbsensi.filter(a => a.status === 'Cuti').length,
    sakit: filteredAbsensi.filter(a => a.status === 'Sakit').length,
    izin: filteredAbsensi.filter(a => a.status === 'Izin').length,
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100">Absensi</h1>
          <p className="text-gray-500 dark:text-neutral-400 text-sm">Data absensi karyawan</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-600 dark:text-neutral-300 hover:bg-gray-200 dark:bg-neutral-800"
          >
            <Upload className="w-4 h-4 mr-1" /> Import Excel
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleImportExcel}
            className="hidden"
          />
          <Button onClick={() => setOpenForm(true)} className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold">
            <Plus className="w-4 h-4 mr-1" /> Input Absensi
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Hadir', value: summary.hadir, color: 'text-emerald-400' },
          { label: 'Alpha', value: summary.alpha, color: 'text-red-400' },
          { label: 'Cuti', value: summary.cuti, color: 'text-blue-400' },
          { label: 'Sakit', value: summary.sakit, color: 'text-amber-400' },
          { label: 'Izin', value: summary.izin, color: 'text-purple-400' },
        ].map(s => (
          <Card key={s.label} className="bg-white dark:bg-black border-gray-200 dark:border-neutral-800">
            <CardContent className="p-3">
              <p className="text-gray-400 dark:text-neutral-500 text-xs">{s.label}</p>
              <p className={cn("text-xl font-bold", s.color)}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter Bulan */}
      <div className="flex gap-2">
        <Select value={bulan} onValueChange={setBulan}>
          <SelectTrigger className="w-[200px] bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-neutral-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700">
            {getBulanOptions().map(b => (
              <SelectItem key={b.value} value={b.value} className="text-gray-800 dark:text-neutral-200">{b.label}</SelectItem>
            ))}
          </SelectContent>
       </Select>
        <Select value={filterCabang} onValueChange={setFilterCabang}>
          <SelectTrigger className="w-[150px] bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-neutral-200">
            <SelectValue placeholder="Semua Cabang" />
          </SelectTrigger>
          <SelectContent className="bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700">
            <SelectItem value="all" className="text-gray-800 dark:text-neutral-200">Semua Cabang</SelectItem>
            {[...new Set(karyawan.map(k => k.divisi).filter(Boolean))].map(c => (
              <SelectItem key={c} value={c} className="text-gray-800 dark:text-neutral-200">{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="bg-white dark:bg-black border-gray-200 dark:border-neutral-800">
        <CardContent className="p-4">
          <DataTable
            columns={columns}
            data={filteredAbsensi}
            searchPlaceholder="Cari nama..."
            searchFields={['nama']}
            pageSize={15}
            emptyMessage="Belum ada data absensi bulan ini"
            emptyIcon={<ClipboardCheck className="w-8 h-8 text-gray-400 dark:text-neutral-600 mx-auto" />}
            actions={(a: Absensi) => (
              <Button variant="ghost" size="sm" onClick={() => { deleteAbsensi(a.id); toast.success('Data dihapus'); }} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0">
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            )}
          />
        </CardContent>
      </Card>

      {/* Form Dialog */}
      {openForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <Card className="bg-white dark:bg-black border-gray-200 dark:border-neutral-800 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-amber-400 text-lg">Input Absensi</CardTitle>
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
                <Label className="text-gray-600 dark:text-neutral-300 text-xs">Tanggal</Label>
                <Input type="date" value={form.tanggal} onChange={e => setForm({ ...form, tanggal: e.target.value })} className="bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-neutral-200" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-600 dark:text-neutral-300 text-xs">Status</Label>
                <Select value={form.status} onValueChange={v => setForm({ ...form, status: v as Absensi['status'] })}>
                  <SelectTrigger className="bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-neutral-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700">
                    {['Hadir', 'Cuti', 'Sakit', 'Izin', 'Alpha'].map(s => (
                      <SelectItem key={s} value={s} className="text-gray-800 dark:text-neutral-200">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-gray-600 dark:text-neutral-300 text-xs">Jam Masuk</Label>
                  <Input type="time" value={form.masuk} onChange={e => setForm({ ...form, masuk: e.target.value })} className="bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-neutral-200" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-gray-600 dark:text-neutral-300 text-xs">Jam Keluar</Label>
                  <Input type="time" value={form.keluar} onChange={e => setForm({ ...form, keluar: e.target.value })} className="bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-neutral-200" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-600 dark:text-neutral-300 text-xs">Keterangan</Label>
                <Input value={form.keterangan} onChange={e => setForm({ ...form, keterangan: e.target.value })} placeholder="Opsional" className="bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-neutral-200" />
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
