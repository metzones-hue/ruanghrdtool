import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import useAppStore from '@/store/useAppStore';
import type { DokumenKaryawan } from '@/types';
import { FileUp, Trash2, Eye, FileText, Shield, Download, FileImage, FileArchive } from 'lucide-react';

const jenisLabels: Record<string, string> = {
  KTP: 'KTP',
  KK: 'Kartu Keluarga',
  Ijazah: 'Ijazah',
  Sertifikat: 'Sertifikat',
  SK: 'Surat Keputusan',
  Surat_Lain: 'Dokumen Lain',
};

const getFileIcon = (namaFile: string) => {
  if (namaFile.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return <FileImage className="w-4 h-4 text-purple-500" />;
  if (namaFile.match(/\.(pdf)$/i)) return <FileText className="w-4 h-4 text-red-500" />;
  return <FileArchive className="w-4 h-4 text-blue-500" />;
};

export default function DocumentsPage() {
  const { dokumen, karyawan, addDokumen, deleteDokumen, hasPermission } = useAppStore();
  const [selectedKaryawan, setSelectedKaryawan] = useState('');
  const [selectedJenis, setSelectedJenis] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [filterKaryawan, setFilterKaryawan] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const [previewDoc, setPreviewDoc] = useState<string | null>(null);

  if (!hasPermission('dokumen:view')) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Shield className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-neutral-100">Akses Ditolak</h2>
          <p className="text-gray-500 dark:text-neutral-400 text-sm">Anda tidak memiliki izin untuk mengakses Dokumen</p>
        </div>
      </div>
    );
  }

  const aktif = karyawan.filter(k => k.status === 'Aktif');
  const filteredDocs = dokumen.filter(d => filterKaryawan === 'all' || !filterKaryawan || d.karyawanId.toString() === filterKaryawan);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!selectedKaryawan || !selectedJenis) {
      toast.error('Pilih karyawan dan jenis dokumen terlebih dahulu');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File maksimal 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      const k = karyawan.find(x => x.id.toString() === selectedKaryawan);
      addDokumen({
        karyawanId: parseInt(selectedKaryawan),
        namaKaryawan: k?.nama || '',
        jenis: selectedJenis as DokumenKaryawan['jenis'],
        namaFile: file.name,
        base64,
        ukuran: file.size,
        uploadDate: new Date().toISOString().split('T')[0],
        keterangan: keterangan || undefined,
      });
      toast.success(`Dokumen ${file.name} berhasil diupload`);
      setKeterangan('');
      if (fileRef.current) fileRef.current.value = '';
    };
    reader.readAsDataURL(file);
  };

  const totalSize = dokumen.reduce((s, d) => s + d.ukuran, 0);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100">Dokumen Karyawan</h1>
        <p className="text-gray-500 dark:text-neutral-400 text-sm">{dokumen.length} dokumen — Total {totalSize > 1024 * 1024 ? `${(totalSize / 1024 / 1024).toFixed(1)} MB` : `${(totalSize / 1024).toFixed(0)} KB`}</p>
      </div>

      {/* Upload */}
      {hasPermission('dokumen:manage') && (
        <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <Select value={selectedKaryawan} onValueChange={setSelectedKaryawan}>
                <SelectTrigger className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800"><SelectValue placeholder="Pilih Karyawan" /></SelectTrigger>
                <SelectContent className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
                  {aktif.map(k => <SelectItem key={k.id} value={String(k.id)}>{k.nama}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={selectedJenis} onValueChange={setSelectedJenis}>
                <SelectTrigger className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800"><SelectValue placeholder="Jenis Dokumen" /></SelectTrigger>
                <SelectContent className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
                  {Object.entries(jenisLabels).map(([key, label]) => <SelectItem key={key} value={key}>{label}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input placeholder="Keterangan (opsional)" value={keterangan} onChange={e => setKeterangan(e.target.value)} className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800" />
              <div>
                <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.doc,.docx,.xls,.xlsx" className="hidden" onChange={handleFileChange} />
                <Button onClick={() => fileRef.current?.click()} className="w-full bg-amber-500 text-black hover:bg-amber-400">
                  <FileUp className="w-4 h-4 mr-2" /> Upload Dokumen
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter & List */}
      <div className="flex gap-2">
        <Select value={filterKaryawan} onValueChange={setFilterKaryawan}>
          <SelectTrigger className="w-[200px] bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800"><SelectValue placeholder="Filter Karyawan" /></SelectTrigger>
          <SelectContent className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
            <SelectItem value="all">Semua Karyawan</SelectItem>
            {aktif.map(k => <SelectItem key={k.id} value={String(k.id)}>{k.nama}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredDocs.map((doc) => (
          <Card key={doc.id} className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 group">
            <CardContent className="p-3">
              <div className="flex items-start gap-3">
                <div className="mt-1">{getFileIcon(doc.namaFile)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-neutral-200 truncate">{doc.namaFile}</p>
                  <p className="text-xs text-gray-400 dark:text-neutral-600">{doc.namaKaryawan} · {jenisLabels[doc.jenis]}</p>
                  <p className="text-[10px] text-gray-300 dark:text-neutral-700">{doc.uploadDate} · {doc.ukuran > 1024 * 1024 ? `${(doc.ukuran / 1024 / 1024).toFixed(1)} MB` : `${(doc.ukuran / 1024).toFixed(0)} KB`}</p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" onClick={() => setPreviewDoc(doc.base64)} className="h-7 w-7 p-0 text-blue-500"><Eye className="w-3.5 h-3.5" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => {
                    const a = document.createElement('a');
                    a.href = doc.base64;
                    a.download = doc.namaFile;
                    a.click();
                  }} className="h-7 w-7 p-0 text-emerald-500"><Download className="w-3.5 h-3.5" /></Button>
                  {hasPermission('dokumen:manage') && (
                    <Button variant="ghost" size="sm" onClick={() => { deleteDokumen(doc.id); toast.success('Dokumen dihapus'); }} className="h-7 w-7 p-0 text-red-500"><Trash2 className="w-3.5 h-3.5" /></Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredDocs.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-400 dark:text-neutral-600">
            <FileText className="w-10 h-10 mx-auto mb-2" />
            <p>Belum ada dokumen</p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setPreviewDoc(null)}>
          <div className="bg-white dark:bg-neutral-900 rounded-xl max-w-3xl max-h-[90vh] overflow-auto p-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-gray-900 dark:text-neutral-100">Preview</h3>
              <Button variant="ghost" size="sm" onClick={() => setPreviewDoc(null)}>Tutup</Button>
            </div>
            {previewDoc.startsWith('data:image') ? (
              <img src={previewDoc} alt="Preview" className="max-w-full rounded-lg" />
            ) : (
              <iframe src={previewDoc} className="w-full h-[70vh] rounded-lg border" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
