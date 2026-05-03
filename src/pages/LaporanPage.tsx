import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import useAppStore from '@/store/useAppStore';
import { fRp, getBulanOptions, currentBulan, getKamisList, getPeriodeUM } from '@/lib/utils';
import { Download, Printer } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import * as XLSX from 'xlsx';
 
export default function LaporanPage() {
  const { karyawan, absensi, lembur, gaji, cuti, kasbon } = useAppStore();
  const [reportType, setReportType] = useState('absensi');
  const [bulan, setBulan] = useState(currentBulan());
  const [dateMulai, setDateMulai] = useState('');
  const [dateSelesai, setDateSelesai] = useState('');
  const printRef = useRef<HTMLDivElement>(null);
 
  const aktif = karyawan.filter(k => k.status === 'Aktif');
 
  const getReportData = () => {
    switch (reportType) {
      case 'absensi': return {
        title: 'LAPORAN ABSENSI',
        subtitle: `Periode: ${bulan}`,
        headers: ['Nama', 'Cabang', 'Hadir', 'Alpha', 'Cuti', 'Sakit', 'Izin', 'Telat (mnt)'],
        rows: aktif.map(k => {
          const abs = absensi.filter(a => a.karyawanId === k.id && a.tanggal.startsWith(bulan));
          return [k.nama, k.divisi, abs.filter(a => a.status === 'Hadir').length, abs.filter(a => a.status === 'Alpha').length,
            abs.filter(a => a.status === 'Cuti').length, abs.filter(a => a.status === 'Sakit').length,
            abs.filter(a => a.status === 'Izin').length, abs.reduce((s, a) => s + a.menitTelat, 0)];
        })
      };
      case 'gaji': return {
        title: 'LAPORAN PENGGAJIAN',
        subtitle: `Periode: ${bulan}`,
        headers: ['Nama', 'Cabang', 'Gaji Pokok', 'Tunjangan', 'Insentif', 'UM', 'Lembur', 'BPJS', 'Pot. Telat', 'Total'],
        rows: aktif.map(k => {
          const g = gaji.find(x => x.karyawanId === k.id && x.periode === bulan);
          return [k.nama, k.divisi, fRp(g?.gaji || k.gajiPokok), fRp(g?.tunjangan || k.tunjangan),
            fRp(g?.insentif || 0), fRp(g?.uangMakan || 0), fRp(g?.lembur || 0),
            fRp(g?.bpjs || 0), fRp(g?.potonganTelat || 0), fRp(g?.total || 0)];
        })
      };
      case 'lembur': return {
        title: 'LAPORAN LEMBUR',
        subtitle: `Periode: ${bulan}`,
        headers: ['Nama', 'Cabang', 'Tanggal', 'Mulai', 'Selesai', 'Jam', 'Status', 'Total Upah'],
        rows: lembur.filter(l => l.tanggal.startsWith(bulan)).map(l =>
          [l.nama, l.divisi, l.tanggal, l.mulai, l.selesai, l.jamTotal, l.status, fRp(l.totalUpah)])
      };
      case 'telat': return {
        title: 'LAPORAN KETERLAMBATAN',
        subtitle: `Periode: ${bulan}`,
        headers: ['Nama', 'Cabang', 'Total Telat (mnt)', 'Potongan (Rp)', 'Jumlah Kejadian'],
        rows: aktif.map(k => {
          const abs = absensi.filter(a => a.karyawanId === k.id && a.tanggal.startsWith(bulan) && a.menitTelat > 0);
          const totalTelat = abs.reduce((s, a) => s + a.menitTelat, 0);
          return [k.nama, k.divisi, totalTelat, fRp(totalTelat * 1000), abs.length];
        })
      };
      case 'kasbon': return {
        title: 'LAPORAN KAS BON',
        subtitle: '',
        headers: ['Nama', 'Tanggal', 'Jumlah', 'Via', 'Cicilan', 'Sisa', 'Status'],
        rows: kasbon.map(k => [k.nama, k.tanggal, fRp(k.jumlah), k.via, fRp(k.cicilan), fRp(k.sisaHutang), k.status])
      };
      default: return { title: 'LAPORAN', subtitle: bulan, headers: [], rows: [] };
    }
  };
 
  const generateReport = () => {
    let data: unknown[][] = [];
    let filename = '';
 
    switch (reportType) {
      case 'absensi': {
        filename = `Laporan_Absensi_${bulan}`;
        data = [['LAPORAN ABSENSI', `Periode: ${bulan}`], [], ['Nama', 'Cabang', 'Hadir', 'Alpha', 'Cuti', 'Sakit', 'Izin', 'Telat (mnt)']];
        aktif.forEach(k => {
          const abs = absensi.filter(a => a.karyawanId === k.id && a.tanggal.startsWith(bulan));
          data.push([k.nama, k.divisi, abs.filter(a => a.status === 'Hadir').length, abs.filter(a => a.status === 'Alpha').length,
            abs.filter(a => a.status === 'Cuti').length, abs.filter(a => a.status === 'Sakit').length,
            abs.filter(a => a.status === 'Izin').length, abs.reduce((s, a) => s + a.menitTelat, 0)]);
        });
        break;
      }
      case 'gaji': {
        filename = `Laporan_Gaji_${bulan}`;
        data = [['LAPORAN PENGGAJIAN', `Periode: ${bulan}`], [], ['Nama', 'Cabang', 'Gaji Pokok', 'Tunjangan', 'Insentif', 'UM', 'Lembur', 'BPJS', 'Pot. Telat', 'Pot. Kasbon', 'Total']];
        aktif.forEach(k => {
          const g = gaji.find(x => x.karyawanId === k.id && x.periode === bulan);
          data.push([k.nama, k.divisi, g?.gaji || k.gajiPokok, g?.tunjangan || k.tunjangan, g?.insentif || 0, g?.uangMakan || 0,
            g?.lembur || 0, g?.bpjs || 0, g?.potonganTelat || 0, g?.potonganKasbon || 0, g?.total || 0]);
        });
        break;
      }
      case 'lembur': {
        filename = `Laporan_Lembur_${bulan}`;
        data = [['LAPORAN LEMBUR', `Periode: ${bulan}`], [], ['Nama', 'Cabang', 'Tanggal', 'Mulai', 'Selesai', 'Jam', 'Status', 'Total Upah']];
        lembur.filter(l => l.tanggal.startsWith(bulan)).forEach(l => data.push([l.nama, l.divisi, l.tanggal, l.mulai, l.selesai, l.jamTotal, l.status, l.totalUpah]));
        break;
      }
      case 'um-mingguan': {
        const kamisVal = getKamisList()[0]?.value || '';
        const per = getPeriodeUM(kamisVal);
        const periodeLabel = `${new Date(per.mulai).toLocaleDateString('id-ID')} - ${new Date(per.selesai).toLocaleDateString('id-ID')}`;
        filename = `Laporan_UM_Mingguan_${kamisVal}`;
        data = [['LAPORAN UANG MAKAN MINGGUAN', `Periode: ${periodeLabel}`], [], ['Nama', 'Cabang', 'Hadir', 'Alpha', 'UM Kotor', 'Pot. Kasbon', 'UM Bersih', 'Lembur', 'Total']];
        aktif.forEach(k => {
          const abs = absensi.filter(a => a.karyawanId === k.id && a.tanggal >= per.mulai && a.tanggal <= per.selesai);
          const hadir = abs.filter(a => a.status === 'Hadir').length;
          const alpha = abs.filter(a => a.status === 'Alpha').length;
          const umDiterima = hadir * 40000;
          const lemburP = lembur.filter(l => l.karyawanId === k.id && l.status === 'Disetujui' && l.tanggal >= per.mulai && l.tanggal <= per.selesai).reduce((s, l) => s + l.totalUpah, 0);
          data.push([k.nama, k.divisi, hadir, alpha, umDiterima, 0, umDiterima, lemburP, umDiterima + lemburP]);
        });
        break;
      }
      case 'um-bulanan': {
        filename = `Laporan_UM_Bulanan_${bulan}`;
        data = [['LAPORAN UANG MAKAN BULANAN', `Periode: ${bulan}`], [], ['Nama', 'Cabang', 'Hadir', 'Alpha', 'UM Kotor', 'UM Bersih']];
        aktif.forEach(k => {
          const abs = absensi.filter(a => a.karyawanId === k.id && a.tanggal.startsWith(bulan));
          const hadir = abs.filter(a => a.status === 'Hadir').length;
          const alpha = abs.filter(a => a.status === 'Alpha').length;
          data.push([k.nama, k.divisi, hadir, alpha, hadir * 40000, hadir * 40000]);
        });
        break;
      }
      case 'telat': {
        filename = `Laporan_Keterlambatan_${bulan}`;
        data = [['LAPORAN KETERLAMBATAN', `Periode: ${bulan}`], [], ['Nama', 'Cabang', 'Total Telat (mnt)', 'Potongan (Rp)', 'Jumlah Kejadian']];
        aktif.forEach(k => {
          const abs = absensi.filter(a => a.karyawanId === k.id && a.tanggal.startsWith(bulan) && a.menitTelat > 0);
          const totalTelat = abs.reduce((s, a) => s + a.menitTelat, 0);
          const potongan = totalTelat * 1000;
          data.push([k.nama, k.divisi, totalTelat, potongan, abs.length]);
        });
        break;
      }
      case 'cuti': {
        const tahun = bulan.split('-')[0];
        filename = `Laporan_Cuti_${tahun}`;
        data = [['LAPORAN CUTI', `Tahun: ${tahun}`], [], ['Nama', 'Cabang', 'Jenis', 'Mulai', 'Selesai', 'Hari', 'Status']];
        cuti.filter(c => c.mulai.startsWith(tahun)).forEach(c => data.push([c.nama, '', c.jenis, c.mulai, c.selesai, c.hari, c.status]));
        break;
      }
      case 'kasbon': {
        filename = `Laporan_Kasbon`;
        data = [['LAPORAN KAS BON'], [], ['Nama', 'Tanggal', 'Jumlah', 'Via', 'Cicilan', 'Sisa', 'Status']];
        kasbon.forEach(k => data.push([k.nama, k.tanggal, k.jumlah, k.via, k.cicilan, k.sisaHutang, k.status]));
        break;
      }
      case 'tahunan': {
        const tahun = bulan.split('-')[0];
        filename = `Laporan_Tahunan_${tahun}`;
        data = [['LAPORAN TAHUNAN HRD', `Tahun: ${tahun}`], [],
          ['Metrik', 'Nilai'],
          ['Total Karyawan Aktif', aktif.length],
          ['Total Karyawan Nonaktif', karyawan.filter(k => k.status === 'Nonaktif').length],
          ['Total Absensi', absensi.filter(a => a.tanggal.startsWith(tahun)).length],
          ['Total Lembur', lembur.filter(l => l.tanggal.startsWith(tahun)).length],
          ['Total Kasbon Aktif', kasbon.filter(k => k.status === 'Aktif').length],
          ['Total Kasbon Lunas', kasbon.filter(k => k.status === 'Lunas').length],
          ['Total Cuti', cuti.filter(c => c.mulai.startsWith(tahun)).length],
          ['Total Gaji Dibayar', fRp(gaji.filter(g => g.periode.startsWith(tahun) && g.status === 'Sudah Dibayar').reduce((s, g) => s + g.total, 0))],
        ];
        break;
      }
    }
 
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Laporan');
    XLSX.writeFile(wb, `${filename}.xlsx`);
    toast.success(`Laporan ${filename} berhasil diunduh`);
  };
 
  const handlePrint = useReactToPrint({ contentRef: printRef, documentTitle: `Laporan_${reportType}_${bulan}` });
 
  const reportTypes = [
    { value: 'absensi', label: 'Absensi' },
    { value: 'gaji', label: 'Penggajian' },
    { value: 'lembur', label: 'Lembur' },
    { value: 'um-mingguan', label: 'UM Mingguan' },
    { value: 'um-bulanan', label: 'UM Bulanan' },
    { value: 'telat', label: 'Keterlambatan' },
    { value: 'cuti', label: 'Cuti' },
    { value: 'kasbon', label: 'Kas Bon' },
    { value: 'tahunan', label: 'Rekap Tahunan' },
  ];
 
  const reportData = getReportData();
 
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100">Laporan</h1>
        <p className="text-gray-500 dark:text-neutral-400 text-sm">Export data ke Excel &mdash; {reportTypes.length} jenis laporan</p>
      </div>
 
      <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-gray-500 dark:text-neutral-400 text-xs">Jenis Laporan</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="bg-gray-100 dark:bg-neutral-800 border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-neutral-200"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">{reportTypes.map(r => <SelectItem key={r.value} value={r.value} className="text-gray-900 dark:text-neutral-200">{r.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-gray-500 dark:text-neutral-400 text-xs">Periode</label>
              <Select value={bulan} onValueChange={setBulan}>
                <SelectTrigger className="bg-gray-100 dark:bg-neutral-800 border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-neutral-200"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">{getBulanOptions(12).map(b => <SelectItem key={b.value} value={b.value} className="text-gray-900 dark:text-neutral-200">{b.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-gray-500 dark:text-neutral-400 text-xs">Rentang Tanggal (Opsional)</label>
              <div className="flex gap-2">
                <Input type="date" value={dateMulai} onChange={e => setDateMulai(e.target.value)} className="bg-gray-100 dark:bg-neutral-800 border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-neutral-200 text-xs" />
                <Input type="date" value={dateSelesai} onChange={e => setDateSelesai(e.target.value)} className="bg-gray-100 dark:bg-neutral-800 border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-neutral-200 text-xs" />
              </div>
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={generateReport} className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-semibold">
                <Download className="w-4 h-4 mr-1" /> Export Excel
              </Button>
              <Button onClick={() => handlePrint()} variant="outline" className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 text-gray-600 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 px-3">
                <Printer className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
 
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800"><CardContent className="p-3"><p className="text-gray-400 dark:text-neutral-600 text-xs">Karyawan Aktif</p><p className="text-amber-500 text-xl font-bold">{aktif.length}</p></CardContent></Card>
        <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800"><CardContent className="p-3"><p className="text-gray-400 dark:text-neutral-600 text-xs">Absensi Bulan Ini</p><p className="text-emerald-500 text-xl font-bold">{absensi.filter(a => a.tanggal.startsWith(bulan)).length}</p></CardContent></Card>
        <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800"><CardContent className="p-3"><p className="text-gray-400 dark:text-neutral-600 text-xs">Lembur Pending</p><p className="text-amber-500 text-xl font-bold">{lembur.filter(l => l.status === 'Pending').length}</p></CardContent></Card>
        <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800"><CardContent className="p-3"><p className="text-gray-400 dark:text-neutral-600 text-xs">Kasbon Aktif</p><p className="text-red-500 text-xl font-bold">{fRp(kasbon.filter(k => k.status === 'Aktif').reduce((s, k) => s + k.sisaHutang, 0))}</p></CardContent></Card>
        <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800"><CardContent className="p-3"><p className="text-gray-400 dark:text-neutral-600 text-xs">Total Gaji</p><p className="text-blue-500 text-xl font-bold">{fRp(gaji.filter(g => g.periode === bulan).reduce((s, g) => s + g.total, 0))}</p></CardContent></Card>
      </div>
 
      {/* Hidden print area */}
      <div className="hidden">
        <div ref={printRef}>
          <div className="bg-white text-black p-8" style={{ fontFamily: 'Arial, sans-serif' }}>
            <div className="flex justify-between items-start border-b-4 border-amber-500 pb-4 mb-6">
              <div>
                <h1 className="text-3xl font-black text-amber-500 tracking-wider">RUANG<span className="text-black">PRINT</span></h1>
                <p className="text-gray-500 text-sm mt-1">{reportData.title}</p>
              </div>
              <div className="text-right text-sm">
                <p className="font-bold">{reportData.subtitle}</p>
                <p className="text-gray-500">{new Date().toLocaleDateString('id-ID')}</p>
              </div>
            </div>
            {reportData.headers.length > 0 && (
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr style={{ backgroundColor: '#F59E0B', color: 'white' }}>
                    {reportData.headers.map((h, i) => (
                      <th key={i} style={{ padding: '6px 8px', textAlign: i > 1 ? 'right' : 'left', borderBottom: '1px solid #D97706' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reportData.rows.map((row, i) => (
                    <tr key={i} style={{ backgroundColor: i % 2 === 0 ? 'white' : '#F9FAFB' }}>
                      {row.map((cell, j) => (
                        <td key={j} style={{ padding: '5px 8px', textAlign: j > 1 ? 'right' : 'left', borderBottom: '1px solid #E5E7EB' }}>{String(cell)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-400">
              Dicetak oleh RuangHRD &middot; RuangPrint &middot; {new Date().toLocaleDateString('id-ID')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
