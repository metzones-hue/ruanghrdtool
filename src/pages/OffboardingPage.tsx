import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import useAppStore from '@/store/useAppStore';
import { SortableTable } from '@/components/shared/SortableTable';
import { cn, todayStr } from '@/lib/utils';
import { Plus, UserMinus, Check, Undo2 } from 'lucide-react';

interface OffboardingRecord {
  id: number;
  karyawanId: number;
  nama: string;
  npk: string;
  divisi: string;
  jabatan: string;
  tanggalPengajuan: string;
  tanggalResign: string;
  alasan: string;
  status: 'Diproses' | 'Selesai' | 'Dibatalkan';
  checklist: {
    serahTerimaTugas: boolean;
    pengembalianAset: boolean;
    clearanceIT: boolean;
    clearanceHRD: boolean;
    clearanceKeuangan: boolean;
    finalPayroll: boolean;
  };
  catatan?: string;
}

const alasanList = [
  'Mengundurkan diri',
  'Kontrak habis',
  'Efisiensi',
  'Pensiun',
  'Mutasi ke cabang lain',
  'Alasan pribadi',
  'Kesehatan',
  'Melanggar peraturan',
];

export default function OffboardingPage() {
  const { karyawan, updateKaryawan } = useAppStore();
  const [records, setRecords] = useState<OffboardingRecord[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [form, setForm] = useState({ karyawanId: '', tanggalResign: todayStr(), alasan: '', catatan: '' });

  const aktif = karyawan.filter(k => k.status === 'Aktif');

  const handleSubmit = () => {
    if (!form.karyawanId || !form.tanggalResign || !form.alasan) { toast.error('Lengkapi semua field'); return; }
    const k = karyawan.find(x => x.id === +form.karyawanId);
    if (!k) return;

    const newRecord: OffboardingRecord = {
      id: records.length > 0 ? Math.max(...records.map(r => r.id)) + 1 : 1,
      karyawanId: k.id, nama: k.nama, npk: k.npk, divisi: k.divisi, jabatan: k.jabatan,
      tanggalPengajuan: todayStr(), tanggalResign: form.tanggalResign, alasan: form.alasan,
      status: 'Diproses',
      checklist: { serahTerimaTugas: false, pengembalianAset: false, clearanceIT: false, clearanceHRD: false, clearanceKeuangan: false, finalPayroll: false },
      catatan: form.catatan,
    };
    setRecords(prev => [newRecord, ...prev]);
    updateKaryawan(k.id, { status: 'Nonaktif' });
    toast.success(`Offboarding ${k.nama} dicatat`);
    setOpenForm(false);
    setForm({ karyawanId: '', tanggalResign: todayStr(), alasan: '', catatan: '' });
  };

  const toggleChecklist = (id: number, key: keyof OffboardingRecord['checklist']) => {
    setRecords(prev => prev.map(r => {
      if (r.id !== id) return r;
      const updated = { ...r, checklist: { ...r.checklist, [key]: !r.checklist[key] } };
      const allDone = Object.values(updated.checklist).every(Boolean);
      return { ...updated, status: allDone ? 'Selesai' as const : updated.status === 'Selesai' ? 'Diproses' as const : updated.status };
    }));
  };

  const handleComplete = (id: number) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: 'Selesai' as const, checklist: { serahTerimaTugas: true, pengembalianAset: true, clearanceIT: true, clearanceHRD: true, clearanceKeuangan: true, finalPayroll: true } } : r));
    toast.success('Offboarding ditandai selesai');
  };

  const handleCancel = (id: number) => {
    const rec = records.find(r => r.id === id);
    if (rec) {
      updateKaryawan(rec.karyawanId, { status: 'Aktif' });
      setRecords(prev => prev.map(r => r.id === id ? { ...r, status: 'Dibatalkan' as const } : r));
      toast.success('Offboarding dibatalkan, karyawan dikembalikan ke aktif');
    }
  };

  const checklistItems: { key: keyof OffboardingRecord['checklist']; label: string }[] = [
    { key: 'serahTerimaTugas', label: 'Serah Terima Tugas' },
    { key: 'pengembalianAset', label: 'Pengembalian Aset' },
    { key: 'clearanceIT', label: 'Clearance IT' },
    { key: 'clearanceHRD', label: 'Clearance HRD' },
    { key: 'clearanceKeuangan', label: 'Clearance Keuangan' },
    { key: 'finalPayroll', label: 'Final Payroll' },
  ];

  const columns = [
    { key: 'tanggalPengajuan', header: 'Tgl Pengajuan', sortable: true, className: 'w-[110px]' },
    { key: 'nama', header: 'Nama', sortable: true, render: (r: OffboardingRecord) => (<div><p className="font-medium text-gray-800 dark:text-neutral-200">{r.nama}</p><p className="text-gray-400 dark:text-neutral-600 text-xs">{r.npk} &middot; {r.divisi}</p></div>) },
    { key: 'jabatan', header: 'Jabatan', sortable: true, render: (r: OffboardingRecord) => <span className="text-gray-600 dark:text-neutral-400 text-sm">{r.jabatan}</span> },
    { key: 'tanggalResign', header: 'Tgl Resign', sortable: true, className: 'w-[110px]', render: (r: OffboardingRecord) => <span className="text-gray-600 dark:text-neutral-400">{r.tanggalResign}</span> },
    { key: 'alasan', header: 'Alasan', render: (r: OffboardingRecord) => <span className="text-gray-600 dark:text-neutral-400 text-sm">{r.alasan}</span> },
    { key: 'progress', header: 'Progress', render: (r: OffboardingRecord) => {
      const done = Object.values(r.checklist).filter(Boolean).length;
      const total = Object.values(r.checklist).length;
      return (
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-gray-200 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div className={cn("h-full rounded-full", r.status === 'Selesai' ? 'bg-emerald-500' : 'bg-amber-500')} style={{ width: `${(done / total) * 100}%` }} />
          </div>
          <span className="text-xs text-gray-500 dark:text-neutral-500">{done}/{total}</span>
        </div>
      );
    }},
    { key: 'status', header: 'Status', sortable: true, render: (r: OffboardingRecord) => (<span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium border", r.status === 'Selesai' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : r.status === 'Diproses' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20')}>{r.status}</span>) },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100">Offboarding</h1>
          <p className="text-gray-500 dark:text-neutral-400 text-sm">{records.filter(r => r.status === 'Diproses').length} diproses &middot; {records.filter(r => r.status === 'Selesai').length} selesai</p>
        </div>
        <Button onClick={() => setOpenForm(true)} className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"><Plus className="w-4 h-4 mr-1" /> Resign Karyawan</Button>
      </div>

      <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
        <CardContent className="p-4">
          <SortableTable
            columns={columns} data={[...records]}
            searchPlaceholder="Cari nama atau NPK..." searchFields={['nama', 'npk']} pageSize={10}
            emptyMessage="Belum ada data offboarding" emptyIcon={<UserMinus className="w-8 h-8 text-gray-300 dark:text-neutral-700 mx-auto" />}
            actions={(r: OffboardingRecord) => (
              <>
                {r.status === 'Diproses' && (
                  <Button variant="ghost" size="sm" onClick={() => handleComplete(r.id)} className="text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 h-8 w-8 p-0" title="Selesai"><Check className="w-3.5 h-3.5" /></Button>
                )}
                {r.status === 'Diproses' && (
                  <Button variant="ghost" size="sm" onClick={() => handleCancel(r.id)} className="text-red-500 hover:text-red-400 hover:bg-red-500/10 h-8 w-8 p-0" title="Batalkan"><Undo2 className="w-3.5 h-3.5" /></Button>
                )}
              </>
            )}
          />
        </CardContent>
      </Card>

      {/* Checklist Detail */}
      {records.filter(r => r.status === 'Diproses').length > 0 && (
        <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
          <CardContent className="p-4">
            <p className="text-gray-600 dark:text-neutral-400 text-sm font-medium mb-3">Checklist Clearance</p>
            <div className="space-y-3">
              {records.filter(r => r.status === 'Diproses').map(r => (
                <div key={r.id} className="p-3 rounded-lg bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-800">
                  <p className="text-sm font-medium text-gray-800 dark:text-neutral-200 mb-2">{r.nama} ({r.npk})</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {checklistItems.map(item => (
                      <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox checked={r.checklist[item.key]} onCheckedChange={() => toggleChecklist(r.id, item.key)} />
                        <span className={cn("text-xs", r.checklist[item.key] ? 'text-emerald-500 line-through' : 'text-gray-600 dark:text-neutral-400')}>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {openForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 w-full max-w-md">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-amber-500 text-lg font-bold">Resign Karyawan</h2>
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-600 dark:text-neutral-400">Karyawan</Label>
                <Select value={form.karyawanId} onValueChange={v => setForm({ ...form, karyawanId: v })}>
                  <SelectTrigger className="bg-gray-100 dark:bg-neutral-800 border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-neutral-200"><SelectValue placeholder="Pilih karyawan" /></SelectTrigger>
                  <SelectContent className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 max-h-[200px]">
                    {aktif.map(k => <SelectItem key={k.id} value={String(k.id)} className="text-gray-900 dark:text-neutral-200">{k.nama} ({k.divisi})</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label className="text-xs text-gray-600 dark:text-neutral-400">Tanggal Resign</Label><Input type="date" value={form.tanggalResign} onChange={e => setForm({ ...form, tanggalResign: e.target.value })} className="bg-gray-100 dark:bg-neutral-800 border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-neutral-200" /></div>
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-600 dark:text-neutral-400">Alasan</Label>
                <Select value={form.alasan} onValueChange={v => setForm({ ...form, alasan: v })}>
                  <SelectTrigger className="bg-gray-100 dark:bg-neutral-800 border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-neutral-200"><SelectValue placeholder="Pilih alasan" /></SelectTrigger>
                  <SelectContent className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">{alasanList.map(a => <SelectItem key={a} value={a} className="text-gray-900 dark:text-neutral-200">{a}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label className="text-xs text-gray-600 dark:text-neutral-400">Catatan</Label><Input value={form.catatan} onChange={e => setForm({ ...form, catatan: e.target.value })} placeholder="Opsional" className="bg-gray-100 dark:bg-neutral-800 border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-neutral-200" /></div>
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
