import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import useAppStore from '@/store/useAppStore';
import { DataTable } from '@/components/shared/DataTable';
import { fRp, getStatusColor, cn } from '@/lib/utils';
import { getCabangList, getCabangKodeList, addCabang, jabatanList } from '@/data/seed';
import type { Karyawan } from '@/types';
import { Plus, Pencil, Trash2, Users } from 'lucide-react';

export default function KaryawanPage() {
  const { karyawan, addKaryawan, updateKaryawan, deleteKaryawan, userRole } = useAppStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Karyawan | null>(null);
  const [cabangFilter, setCabangFilter] = useState('');

  const initialForm = {
    npk: '', nama: '', jabatan: '', divisi: 'HO', cabang: '', tanggalMasuk: '',
    jenisKelamin: 'L' as 'L' | 'P', noHP: '', email: '', alamat: '',
    gajiPokok: 0, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 5000,
    lemburMalamAktif: 'ya' as 'ya' | 'tidak', shift: 1 as 1 | 2,
    status: 'Aktif' as 'Aktif' | 'Nonaktif', umMode: 'minggu' as 'minggu' | 'bulanan', punyaCuti: 'ya' as 'ya' | 'tidak',
  };

  const [form, setForm] = useState(initialForm);

  const filtered = cabangFilter
    ? karyawan.filter(k => k.divisi === cabangFilter)
    : karyawan;

  const openAdd = () => {
    setEditing(null);
    setForm(initialForm);
    setOpen(true);
  };

  const openEdit = (k: Karyawan) => {
    setEditing(k);
    setForm({
      npk: k.npk, nama: k.nama, jabatan: k.jabatan, divisi: k.divisi,
      cabang: k.cabang, tanggalMasuk: k.tanggalMasuk, jenisKelamin: k.jenisKelamin,
      noHP: k.noHP, email: k.email, alamat: k.alamat, gajiPokok: k.gajiPokok,
      tunjangan: k.tunjangan, uangMakan: k.uangMakan, bpjs: k.bpjs,
      upahLembur: k.upahLembur, lemburMalamAktif: k.lemburMalamAktif,
      shift: k.shift, status: k.status, umMode: k.umMode, punyaCuti: k.punyaCuti,
    });
    setOpen(true);
  };

  const handleSubmit = () => {
    if (!form.nama || !form.npk || !form.jabatan) {
      toast.error('Nama, NPK, dan Jabatan wajib diisi');
      return;
    }
    // Auto-save cabang baru kalau belum ada di daftar
    const existingCabang = getCabangKodeList();
    if (form.divisi && !existingCabang.includes(form.divisi)) {
      addCabang(form.divisi, form.cabang || `Cabang ${form.divisi}`);
      toast.success(`Cabang "${form.divisi}" berhasil ditambahkan!`);
    }
    if (editing) {
      updateKaryawan(editing.id, { ...form, id: editing.id });
      toast.success('Karyawan diperbarui');
    } else {
      addKaryawan(form);
      toast.success('Karyawan ditambahkan');
    }
    setOpen(false);
  };

  const handleDelete = (id: number, nama: string) => {
    if (confirm(`Hapus karyawan ${nama}?`)) {
      deleteKaryawan(id);
      toast.success('Karyawan dihapus');
    }
  };

  const aktifCount = karyawan.filter(k => k.status === 'Aktif').length;
  const nonaktifCount = karyawan.filter(k => k.status === 'Nonaktif').length;

  const columns = [
    { key: 'npk', header: 'NPK', className: 'w-[80px]' },
    {
      key: 'nama',
      header: 'Nama',
      render: (k: Karyawan) => (
        <div>
          <p className="font-medium text-gray-800 dark:text-neutral-200">{k.nama}</p>
          <p className="text-gray-400 dark:text-neutral-500 text-xs">{k.jabatan}</p>
        </div>
      ),
    },
    {
      key: 'divisi',
      header: 'Cabang',
      render: (k: Karyawan) => (
        <span className="px-2 py-0.5 rounded-md bg-gray-200 dark:bg-neutral-800 text-gray-600 dark:text-neutral-300 text-xs font-medium">
          {k.divisi}
        </span>
      ),
    },
    {
      key: 'shift',
      header: 'Shift',
      render: (k: Karyawan) => (
        <span className={cn("px-2 py-0.5 rounded-md text-xs font-medium",
          k.shift === 2 ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'
        )}>
          S{k.shift}
        </span>
      ),
    },
    {
      key: 'gajiPokok',
      header: 'Gaji Pokok',
      render: (k: Karyawan) => <span className="text-gray-600 dark:text-neutral-300">{fRp(k.gajiPokok)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (k: Karyawan) => (
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100">Data Karyawan</h1>
          <p className="text-gray-500 dark:text-neutral-400 text-sm">{aktifCount} aktif · {nonaktifCount} nonaktif</p>
        </div>
        <Button onClick={openAdd} className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold">
          <Plus className="w-4 h-4 mr-1" /> Tambah Karyawan
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant="outline"
          onClick={() => setCabangFilter('')}
          className={cn("text-xs", !cabangFilter ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-500 dark:text-neutral-400')}
        >
          Semua
        </Button>
        {getCabangList().map(c => (
          <Button
            key={c.kode}
            variant="outline"
            onClick={() => setCabangFilter(c.kode)}
            className={cn("text-xs", cabangFilter === c.kode ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-500 dark:text-neutral-400')}
          >
            {c.kode}
          </Button>
        ))}
      </div>

      {/* Table */}
      <Card className="bg-white dark:bg-black border-gray-200 dark:border-neutral-800">
        <CardContent className="p-4">
          <DataTable
            columns={columns}
            data={filtered}
            searchPlaceholder="Cari nama, NPK, atau jabatan..."
            searchFields={['nama', 'npk', 'jabatan']}
            pageSize={10}
            emptyMessage="Belum ada data karyawan"
            emptyIcon={<Users className="w-8 h-8 text-gray-400 dark:text-neutral-600 mx-auto" />}
            actions={(k: Karyawan) => (
              <>
                <Button variant="ghost" size="sm" onClick={() => openEdit(k)} className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 h-8 w-8 p-0">
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                {userRole === 'kepala' && (
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(k.id, k.nama)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </>
            )}
          />
        </CardContent>
      </Card>

      {/* Dialog Form */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white dark:bg-black border-gray-200 dark:border-neutral-800 text-gray-800 dark:text-neutral-200 max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-amber-400">
              {editing ? 'Edit Karyawan' : 'Tambah Karyawan'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-gray-600 dark:text-neutral-300 text-xs">NPK</Label>
                <Input value={form.npk} onChange={e => setForm({ ...form, npk: e.target.value })} className="bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-neutral-200" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-600 dark:text-neutral-300 text-xs">Nama</Label>
                <Input value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })} className="bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-neutral-200" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-gray-600 dark:text-neutral-300 text-xs">Jabatan</Label>
              <Select value={form.jabatan} onValueChange={v => setForm({ ...form, jabatan: v })}>
                <SelectTrigger className="bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-neutral-200">
                  <SelectValue placeholder="Pilih jabatan" />
                </SelectTrigger>
                <SelectContent className="bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700">
                  {jabatanList.map(j => (
                    <SelectItem key={j} value={j} className="text-gray-800 dark:text-neutral-200">{j}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-gray-600 dark:text-neutral-300 text-xs">Cabang</Label>
                <div className="relative">
                  <Input
                    list="cabang-suggestions"
                    value={form.divisi}
                    onChange={e => setForm({ ...form, divisi: e.target.value.toUpperCase() })}
                    placeholder="Ketik kode cabang (contoh: BDG, SMG)"
                    className="bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-neutral-200"
                  />
                  <datalist id="cabang-suggestions">
                    {getCabangList().map(c => (
                      <option key={c.kode} value={c.kode}>{c.nama}</option>
                    ))}
                  </datalist>
                </div>
                <p className="text-[10px] text-gray-400 dark:text-neutral-600">Ketik kode baru untuk membuat cabang otomatis</p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-600 dark:text-neutral-300 text-xs">Tanggal Masuk</Label>
                <Input type="date" value={form.tanggalMasuk} onChange={e => setForm({ ...form, tanggalMasuk: e.target.value })} className="bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-neutral-200" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-gray-600 dark:text-neutral-300 text-xs">Jenis Kelamin</Label>
                <Select value={form.jenisKelamin} onValueChange={v => setForm({ ...form, jenisKelamin: v as 'L' | 'P' })}>
                  <SelectTrigger className="bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-neutral-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700">
                    <SelectItem value="L" className="text-gray-800 dark:text-neutral-200">Laki-laki</SelectItem>
                    <SelectItem value="P" className="text-gray-800 dark:text-neutral-200">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-600 dark:text-neutral-300 text-xs">No. HP</Label>
                <Input value={form.noHP} onChange={e => setForm({ ...form, noHP: e.target.value })} className="bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-neutral-200" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-gray-600 dark:text-neutral-300 text-xs">Email</Label>
              <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-neutral-200" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-gray-600 dark:text-neutral-300 text-xs">Gaji Pokok</Label>
                <Input type="number" value={form.gajiPokok} onChange={e => setForm({ ...form, gajiPokok: +e.target.value })} className="bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-neutral-200" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-600 dark:text-neutral-300 text-xs">Tunjangan</Label>
                <Input type="number" value={form.tunjangan} onChange={e => setForm({ ...form, tunjangan: +e.target.value })} className="bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-neutral-200" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-gray-600 dark:text-neutral-300 text-xs">Upah Lembur/jam</Label>
                <Input type="number" value={form.upahLembur} onChange={e => setForm({ ...form, upahLembur: +e.target.value })} className="bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-neutral-200" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-600 dark:text-neutral-300 text-xs">Shift</Label>
                <Select value={String(form.shift)} onValueChange={v => setForm({ ...form, shift: +v as 1 | 2 })}>
                  <SelectTrigger className="bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-neutral-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700">
                    <SelectItem value="1" className="text-gray-800 dark:text-neutral-200">Shift 1 (08:30-17:30)</SelectItem>
                    <SelectItem value="2" className="text-gray-800 dark:text-neutral-200">Shift 2 (12:00-21:00)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-gray-600 dark:text-neutral-300 text-xs">UM Mode</Label>
                <Select value={form.umMode} onValueChange={v => setForm({ ...form, umMode: v as 'minggu' | 'bulanan' })}>
                  <SelectTrigger className="bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-neutral-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700">
                    <SelectItem value="minggu" className="text-gray-800 dark:text-neutral-200">Mingguan</SelectItem>
                    <SelectItem value="bulanan" className="text-gray-800 dark:text-neutral-200">Bulanan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-600 dark:text-neutral-300 text-xs">Status</Label>
                <Select value={form.status} onValueChange={v => setForm({ ...form, status: v as 'Aktif' | 'Nonaktif' })}>
                  <SelectTrigger className="bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-neutral-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700">
                    <SelectItem value="Aktif" className="text-gray-800 dark:text-neutral-200">Aktif</SelectItem>
                    <SelectItem value="Nonaktif" className="text-gray-800 dark:text-neutral-200">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleSubmit} className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold">
              {editing ? 'Simpan Perubahan' : 'Tambah Karyawan'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
