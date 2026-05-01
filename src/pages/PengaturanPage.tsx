import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import useAppStore from '@/store/useAppStore';
import { Save, AlertTriangle, KeyRound } from 'lucide-react';

export default function PengaturanPage() {
  const { pengaturan, updatePengaturan, resetAllData } = useAppStore();
  const [form, setForm] = useState({ ...pengaturan });
  const [showReset, setShowReset] = useState(false);
  const [pwdForm, setPwdForm] = useState({ newStaff: '', newKepala: '' });

  const handleSave = () => {
    updatePengaturan(form);
    toast.success('Pengaturan disimpan');
  };

  const handleSavePassword = () => {
    const updates: Record<string, string> = {};
    if (pwdForm.newStaff.trim()) {
      if (pwdForm.newStaff.length < 4) { toast.error('Password staff minimal 4 karakter'); return; }
      updates.password = btoa(pwdForm.newStaff.trim());
    }
    if (pwdForm.newKepala.trim()) {
      if (pwdForm.newKepala.length < 4) { toast.error('Password kepala minimal 4 karakter'); return; }
      updates.passwordKepala = btoa(pwdForm.newKepala.trim());
    }
    if (Object.keys(updates).length === 0) { toast.error('Isi minimal satu password baru'); return; }
    updatePengaturan(updates);
    setPwdForm({ newStaff: '', newKepala: '' });
    toast.success('Password berhasil diubah');
  };

  const handleReset = () => {
    if (confirm('PERINGATAN: Semua data transaksi akan dihapus! Yakin?')) {
      resetAllData();
      toast.success('Data direset ke default');
      setShowReset(false);
    }
  };

  const f = (key: string) => ({
    value: form[key as keyof typeof form] as string | number,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [key]: e.target.type === 'number' ? +e.target.value : e.target.value }),
    className: "bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-neutral-200",
  });

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100">Pengaturan</h1>
          <p className="text-gray-500 dark:text-neutral-400 text-sm">Konfigurasi sistem HRD</p>
        </div>
        <Button onClick={handleSave} className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold">
          <Save className="w-4 h-4 mr-1" /> Simpan
        </Button>
      </div>

      {/* Tarif Lembur */}
      <Card className="bg-white dark:bg-black border-gray-200 dark:border-neutral-800">
        <CardHeader className="pb-3"><CardTitle className="text-gray-800 dark:text-neutral-200 text-sm">Tarif Lembur</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[
            { key: 'upahLembur', label: 'Level 1 — Rp/jam' },
            { key: 'upahLemburLevel2', label: 'Level 2 — Rp/jam' },
            { key: 'upahLemburLevel3', label: 'Level 3 — Rp/jam' },
            { key: 'bonusMalam', label: 'Bonus Lembur Malam (Rp)' },
          ].map(({ key, label }) => (
            <div key={key} className="grid grid-cols-2 items-center gap-4">
              <Label className="text-gray-500 dark:text-neutral-400 text-xs">{label}</Label>
              <Input type="number" {...f(key)} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Uang Makan */}
      <Card className="bg-white dark:bg-black border-gray-200 dark:border-neutral-800">
        <CardHeader className="pb-3"><CardTitle className="text-gray-800 dark:text-neutral-200 text-sm">Uang Makan</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[
            { key: 'umPerHari', label: 'UM per Hari Cabang (Rp)' },
            { key: 'umPerHariHO', label: 'UM per Hari HO (Rp)' },
          ].map(({ key, label }) => (
            <div key={key} className="grid grid-cols-2 items-center gap-4">
              <Label className="text-gray-500 dark:text-neutral-400 text-xs">{label}</Label>
              <Input type="number" {...f(key)} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Potongan Telat */}
      <Card className="bg-white dark:bg-black border-gray-200 dark:border-neutral-800">
        <CardHeader className="pb-3"><CardTitle className="text-gray-800 dark:text-neutral-200 text-sm">Potongan Telat</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[
            { key: 'batasTelat', label: 'Toleransi Telat Shift 1 (menit)' },
            { key: 'batasTelatShift2', label: 'Toleransi Telat Shift 2 (menit)' },
            { key: 'potonganTelat', label: 'Potongan per Menit Telat (Rp)' },
          ].map(({ key, label }) => (
            <div key={key} className="grid grid-cols-2 items-center gap-4">
              <Label className="text-gray-500 dark:text-neutral-400 text-xs">{label}</Label>
              <Input type="number" {...f(key)} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* BPJS */}
      <Card className="bg-white dark:bg-black border-gray-200 dark:border-neutral-800">
        <CardHeader className="pb-3"><CardTitle className="text-gray-800 dark:text-neutral-200 text-sm">BPJS</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[
            { key: 'bpjsKaryawan', label: 'BPJS Karyawan (%)' },
            { key: 'bpjsPerusahaan', label: 'BPJS Perusahaan (%)' },
          ].map(({ key, label }) => (
            <div key={key} className="grid grid-cols-2 items-center gap-4">
              <Label className="text-gray-500 dark:text-neutral-400 text-xs">{label}</Label>
              <Input type="number" {...f(key)} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Shift & Jam Kerja */}
      <Card className="bg-white dark:bg-black border-gray-200 dark:border-neutral-800">
        <CardHeader className="pb-3"><CardTitle className="text-gray-800 dark:text-neutral-200 text-sm">Shift & Jam Kerja</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[
            { key: 'jamMasukShift1', label: 'Jam Masuk Shift 1' },
            { key: 'jamKeluarShift1', label: 'Jam Keluar Shift 1' },
            { key: 'jamMasukShift2', label: 'Jam Masuk Shift 2' },
            { key: 'jamKeluarShift2', label: 'Jam Keluar Shift 2' },
            { key: 'thresholdShift2', label: 'Threshold Deteksi Shift 2' },
            { key: 'batasMalam', label: 'Batas Bonus Malam' },
          ].map(({ key, label }) => (
            <div key={key} className="grid grid-cols-2 items-center gap-4">
              <Label className="text-gray-500 dark:text-neutral-400 text-xs">{label}</Label>
              <Input type="text" {...f(key)} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Cuti & Insentif */}
      <Card className="bg-white dark:bg-black border-gray-200 dark:border-neutral-800">
        <CardHeader className="pb-3"><CardTitle className="text-gray-800 dark:text-neutral-200 text-sm">Cuti & Insentif</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 items-center gap-4">
            <Label className="text-gray-500 dark:text-neutral-400 text-xs">Cuti Tahunan (hari)</Label>
            <Input type="number" {...f('cutiTahunan')} />
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <Label className="text-gray-500 dark:text-neutral-400 text-xs">Insentif Kehadiran (Rp/bulan)</Label>
            <Input type="number" {...f('insentifKehadiran')} />
          </div>
        </CardContent>
      </Card>

      {/* Ubah Password */}
      <Card className="bg-white dark:bg-black border-gray-200 dark:border-neutral-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-gray-800 dark:text-neutral-200 text-sm flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-amber-400" /> Ubah Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 items-center gap-4">
            <Label className="text-gray-500 dark:text-neutral-400 text-xs">Password Baru (Staff HRD)</Label>
            <Input type="password" value={pwdForm.newStaff} onChange={e => setPwdForm({ ...pwdForm, newStaff: e.target.value })}
              placeholder="Kosongkan jika tidak diubah"
              className="bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-neutral-200" />
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <Label className="text-gray-500 dark:text-neutral-400 text-xs">Password Baru (Kepala HRD)</Label>
            <Input type="password" value={pwdForm.newKepala} onChange={e => setPwdForm({ ...pwdForm, newKepala: e.target.value })}
              placeholder="Kosongkan jika tidak diubah"
              className="bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-neutral-200" />
          </div>
          <Button onClick={handleSavePassword} className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold">
            <KeyRound className="w-4 h-4 mr-1" /> Simpan Password
          </Button>
        </CardContent>
      </Card>

      {/* Reset */}
      <Card className="bg-red-950/20 border-red-900/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-red-400 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Zona Berbahaya
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-gray-500 dark:text-neutral-400 text-xs">
            Menekan tombol reset akan menghapus semua data transaksi dan mengembalikan data karyawan ke default.
          </p>
          {!showReset ? (
            <Button variant="outline" onClick={() => setShowReset(true)} className="border-red-800 text-red-400 hover:bg-red-950/30">
              Reset Semua Data
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleReset} className="bg-red-600 hover:bg-red-700 text-white">Konfirmasi Reset</Button>
              <Button variant="outline" onClick={() => setShowReset(false)} className="border-gray-300 dark:border-neutral-700 text-gray-600 dark:text-neutral-300">Batal</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
