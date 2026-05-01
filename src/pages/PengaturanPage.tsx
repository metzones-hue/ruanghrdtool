import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import useAppStore from '@/store/useAppStore';
import { Save, AlertTriangle } from 'lucide-react';

export default function PengaturanPage() {
  const { pengaturan, updatePengaturan, resetAllData } = useAppStore();
  const [form, setForm] = useState({ ...pengaturan });
  const [showReset, setShowReset] = useState(false);

  const handleSave = () => {
    updatePengaturan(form);
    toast.success('Pengaturan disimpan');
  };

  const handleReset = () => {
    if (confirm('PERINGATAN: Semua data transaksi akan dihapus! Data karyawan akan dikembalikan ke default. Yakin?')) {
      resetAllData();
      toast.success('Data direset ke default');
      setShowReset(false);
    }
  };

  const sections = [
    {
      title: 'Tarif Lembur',
      fields: [
        { key: 'upahLembur', label: 'Upah Lembur Shift 1 (Rp/jam)', type: 'number' },
        { key: 'upahLemburShift2', label: 'Upah Lembur Shift 2 (Rp/jam)', type: 'number' },
        { key: 'bonusMalam', label: 'Bonus Lembur Malam (Rp)', type: 'number' },
      ],
    },
    {
      title: 'Uang Makan',
      fields: [
        { key: 'umPerHari', label: 'UM per Hari Cabang (Rp)', type: 'number' },
        { key: 'umPerHariHO', label: 'UM per Hari HO (Rp)', type: 'number' },
      ],
    },
    {
      title: 'Potongan',
      fields: [
        { key: 'batasTelat', label: 'Toleransi Telat Shift 1 (menit)', type: 'number' },
        { key: 'batasTelatShift2', label: 'Toleransi Telat Shift 2 (menit)', type: 'number' },
        { key: 'potonganTelat', label: 'Potongan per Menit Telat (Rp)', type: 'number' },
      ],
    },
    {
      title: 'BPJS',
      fields: [
        { key: 'bpjsKaryawan', label: 'BPJS Karyawan (%)', type: 'number' },
        { key: 'bpjsPerusahaan', label: 'BPJS Perusahaan (%)', type: 'number' },
      ],
    },
    {
      title: 'Shift & Jam Kerja',
      fields: [
        { key: 'jamKeluarShift1', label: 'Jam Keluar Shift 1', type: 'text' },
        { key: 'jamKeluarShift2', label: 'Jam Keluar Shift 2', type: 'text' },
        { key: 'thresholdShift2', label: 'Threshold Deteksi Shift 2', type: 'text' },
        { key: 'batasMalam', label: 'Batas Bonus Malam', type: 'text' },
      ],
    },
    {
      title: 'Cuti',
      fields: [
        { key: 'cutiTahunan', label: 'Cuti Tahunan (hari)', type: 'number' },
      ],
    },
  ];

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

      {sections.map(section => (
        <Card key={section.title} className="bg-white dark:bg-black border-gray-200 dark:border-neutral-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-800 dark:text-neutral-200 text-sm">{section.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {section.fields.map(field => (
              <div key={field.key} className="grid grid-cols-2 items-center gap-4">
                <Label className="text-gray-500 dark:text-neutral-400 text-xs">{field.label}</Label>
                <Input
                  type={field.type === 'number' ? 'number' : 'text'}
                  value={form[field.key as keyof typeof form] as string | number}
                  onChange={e => setForm({ ...form, [field.key]: field.type === 'number' ? +e.target.value : e.target.value })}
                  className="bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-neutral-200"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Reset Section */}
      <Card className="bg-red-950/20 border-red-900/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-red-400 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Zona Berbahaya
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-gray-500 dark:text-neutral-400 text-xs">
            Menekan tombol reset akan menghapus semua data transaksi (absensi, lembur, gaji, kasbon, cuti)
            dan mengembalikan data karyawan ke default.
          </p>
          {!showReset ? (
            <Button variant="outline" onClick={() => setShowReset(true)} className="border-red-800 text-red-400 hover:bg-red-950/30">
              Reset Semua Data
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleReset} className="bg-red-600 hover:bg-red-700 text-white">
                Konfirmasi Reset
              </Button>
              <Button variant="outline" onClick={() => setShowReset(false)} className="border-gray-300 dark:border-neutral-700 text-gray-600 dark:text-neutral-300 hover:bg-gray-100 dark:bg-neutral-900">
                Batal
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
