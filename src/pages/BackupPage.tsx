import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import useAppStore from '@/store/useAppStore';
import { Download, Upload, Shield, Database, Clock, FileJson, AlertTriangle } from 'lucide-react';

export default function BackupPage() {
  const { exportAllData, importAllData, karyawan, absensi, lembur, cuti, kasbon, gaji, auditLogs, hasPermission } = useAppStore();
  const [isImporting, setIsImporting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!hasPermission('backup:view')) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Shield className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-neutral-100">Akses Ditolak</h2>
          <p className="text-gray-500 dark:text-neutral-400 text-sm">Anda tidak memiliki izin untuk mengakses Backup</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Karyawan', value: karyawan.length, icon: <Database className="w-4 h-4 text-blue-500" /> },
    { label: 'Absensi', value: absensi.length, icon: <Clock className="w-4 h-4 text-emerald-500" /> },
    { label: 'Lembur', value: lembur.length, icon: <Clock className="w-4 h-4 text-amber-500" /> },
    { label: 'Cuti', value: cuti.length, icon: <Clock className="w-4 h-4 text-purple-500" /> },
    { label: 'Kasbon', value: kasbon.length, icon: <Database className="w-4 h-4 text-orange-500" /> },
    { label: 'Gaji', value: gaji.length, icon: <Database className="w-4 h-4 text-red-500" /> },
    { label: 'Audit Log', value: auditLogs.length, icon: <FileJson className="w-4 h-4 text-gray-500" /> },
  ];

  const handleExport = () => {
    const data = exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ruanghrd-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Database berhasil di-export');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const success = importAllData(event.target?.result as string);
        if (success) {
          toast.success('Database berhasil dipulihkan! Halaman akan di-refresh.');
          setTimeout(() => window.location.reload(), 2000);
        } else {
          toast.error('Format file tidak valid');
        }
      } catch {
        toast.error('Gagal membaca file');
      }
      setIsImporting(false);
      if (fileRef.current) fileRef.current.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100">Backup & Restore</h1>
        <p className="text-gray-500 dark:text-neutral-400 text-sm">Export dan import database lengkap</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {stats.map(s => (
          <Card key={s.label} className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
            <CardContent className="p-3 text-center">
              <div className="flex justify-center mb-1">{s.icon}</div>
              <p className="text-xl font-bold text-gray-900 dark:text-neutral-100">{s.value.toLocaleString('id-ID')}</p>
              <p className="text-[10px] text-gray-400 dark:text-neutral-600">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Export */}
        <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-500" />
              Export Database
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-neutral-400">
              Export seluruh data (karyawan, absensi, lembur, cuti, kasbon, gaji, audit log, pengaturan, dokumen, dll.) ke file JSON.
            </p>
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 flex gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 dark:text-amber-400">
                File backup berisi data sensitif. Simpan dengan aman dan jangan bagikan ke pihak tidak berwenang.
              </p>
            </div>
            <Button onClick={handleExport} className="w-full bg-emerald-500 text-white hover:bg-emerald-400">
              <Download className="w-4 h-4 mr-2" /> Download Backup JSON
            </Button>
          </CardContent>
        </Card>

        {/* Import */}
        {hasPermission('backup:manage') && (
          <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-500" />
                Restore Database
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500 dark:text-neutral-400">
                Pulihkan data dari file backup JSON. Semua data saat ini akan ditimpa oleh data dari file backup.
              </p>
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 flex gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-700 dark:text-red-400">
                  <strong>PERINGATAN:</strong> Tindakan ini akan mengganti semua data yang ada. Pastikan Anda sudah backup data saat ini terlebih dahulu.
                </p>
              </div>
              {isImporting && <Progress value={50} className="h-1" />}
              <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
              <Button onClick={() => {
                if (confirm('PERINGATAN: Semua data saat ini akan diganti. Lanjutkan?')) {
                  fileRef.current?.click();
                }
              }} variant="outline" className="w-full border-blue-200 dark:border-blue-900 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950">
                <Upload className="w-4 h-4 mr-2" /> Pilih File Backup
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
