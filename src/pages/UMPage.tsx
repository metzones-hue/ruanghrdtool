import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import useAppStore from '@/store/useAppStore';
import { fRp, cn, getKamisList, getPeriodeUM, currentBulan, getBulanOptions, getHari } from '@/lib/utils';
import { getCabangKodeList } from '@/data/seed';
import { Check, RotateCcw, Printer } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { SlipUM } from '@/components/shared/SlipUM';

type UMModeType = 'minggu' | 'bulan';

interface UMDetailRow {
  tanggal: string;
  hari: string;
  status: string;
  masuk: string;
  keluar: string;
  um: number;
}

interface UMResult {
  hadir: number;
  alpha: number;
  umRate: number;
  umKotor: number;
  potonganKB: number;
  potonganDD: number;
  umBersih: number;
  lemburPeriode: number;
  lemburCount: number;
  detailRows: UMDetailRow[];
}

export default function UMPage() {
  const store = useAppStore();
  const { karyawan, absensi, lembur, umBayar, tandaiUMBayar, batalUMBayar } = store;
  const [umMode, setUMMode] = useState<UMModeType>('minggu');
  const [periodeMinggu, setPeriodeMinggu] = useState(getKamisList()[0]?.value || '');
  const [periodeBulan, setPeriodeBulan] = useState(currentBulan());
  const [cabangFilter, setCabangFilter] = useState('');
  const [printKaryawan, setPrintKaryawan] = useState<number | null>(null);
  const slipRef = useRef<HTMLDivElement>(null);

  const handlePrintSlip = useReactToPrint({ contentRef: slipRef, documentTitle: 'Slip UM' });

  const aktif = karyawan.filter(k => k.status === 'Aktif' && (!cabangFilter || cabangFilter === 'all' || k.divisi === cabangFilter));
  const periodeVal = umMode === 'minggu' ? periodeMinggu : periodeBulan;
  const periodeLabel = umMode === 'minggu'
    ? (() => { const p = getPeriodeUM(periodeVal); return `${new Date(p.mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} \u2013 ${new Date(p.selesai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`; })()
    : new Date(`${periodeBulan}-01`).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  const getUMData = (kId: number): UMResult => {
    const k = karyawan.find(x => x.id === kId);
    if (!k) return { hadir: 0, alpha: 0, umRate: 40000, umKotor: 0, potonganKB: 0, potonganDD: 0, umBersih: 0, lemburPeriode: 0, lemburCount: 0, detailRows: [] };

    const umRate = k.uangMakan || (k.divisi === 'HO' ? 45000 : 40000);

    if (umMode === 'minggu' && periodeVal) {
      const p = getPeriodeUM(periodeVal);
      const abs = absensi.filter(a => a.karyawanId === kId && a.tanggal >= p.mulai && a.tanggal <= p.selesai);
      const hadir = abs.filter(a => a.status === 'Hadir').length;
      const alpha = abs.filter(a => a.status === 'Alpha').length;

      let umKotor = hadir * umRate;
      if (k.punyaCuti === 'ya' && alpha > 0) umKotor = 0;

      const potonganKB = store.getSisaKasbonUM(kId, periodeVal);
      const potonganDD = store.getPotonganDadakanUM(kId, p.mulai, p.selesai);
      const umBersih = Math.max(0, umKotor - potonganKB - potonganDD);

      const lemburList = lembur.filter(l => l.karyawanId === kId && l.status === 'Disetujui' && l.tanggal >= p.mulai && l.tanggal <= p.selesai);
      const lemburPeriode = lemburList.reduce((s, l) => s + l.totalUpah, 0);
      const lemburCount = lemburList.length;

      const detailRows: UMDetailRow[] = abs.map(a => ({
        tanggal: new Date(a.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        hari: getHari(a.tanggal),
        status: a.status,
        masuk: a.masuk || '-',
        keluar: a.keluar || '-',
        um: a.status === 'Hadir' ? umRate : 0,
      })).sort((a, b) => a.tanggal.localeCompare(b.tanggal));

      return { hadir, alpha, umRate, umKotor, potonganKB, potonganDD, umBersih, lemburPeriode, lemburCount, detailRows };
    } else {
      const abs = absensi.filter(a => a.karyawanId === kId && a.tanggal.startsWith(periodeBulan));
      const hadir = abs.filter(a => a.status === 'Hadir').length;
      const alpha = abs.filter(a => a.status === 'Alpha').length;

      let umKotor = k.divisi === 'HO' ? Math.max(0, 960000 - (alpha * 40000)) : hadir * umRate;
      if (k.punyaCuti === 'ya' && alpha > 0) umKotor = 0;

      const firstDay = `${periodeBulan}-01`;
      const lastDay = `${periodeBulan}-31`;
      const potonganKB = store.getSisaKasbonUM(kId, periodeBulan);
      const potonganDD = store.getPotonganDadakanUM(kId, firstDay, lastDay);
      const umBersih = Math.max(0, umKotor - potonganKB - potonganDD);

      const lemburList = lembur.filter(l => l.karyawanId === kId && l.status === 'Disetujui' && l.tanggal.startsWith(periodeBulan));
      const lemburPeriode = lemburList.reduce((s, l) => s + l.totalUpah, 0);
      const lemburCount = lemburList.length;

      const detailRows: UMDetailRow[] = abs.map(a => ({
        tanggal: new Date(a.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        hari: getHari(a.tanggal),
        status: a.status,
        masuk: a.masuk || '-',
        keluar: a.keluar || '-',
        um: a.status === 'Hadir' ? umRate : 0,
      })).sort((a, b) => a.tanggal.localeCompare(b.tanggal));

      return { hadir, alpha, umRate, umKotor, potonganKB, potonganDD, umBersih, lemburPeriode, lemburCount, detailRows };
    }
  };

  const isBayar = (kId: number) => umMode === 'minggu' && !!umBayar[`${kId}-${periodeVal}`];

  // removed
  // removed
  // removed
  const totalUMBersih = aktif.reduce((s, k) => s + getUMData(k.id).umBersih, 0);
  const totalLembur = aktif.reduce((s, k) => s + getUMData(k.id).lemburPeriode, 0);
  const grandTotal = totalUMBersih + totalLembur;

  const karyawanPrintData = printKaryawan ? karyawan.find(k => k.id === printKaryawan) : null;
  const printData = karyawanPrintData ? getUMData(karyawanPrintData.id) : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100">Uang Makan</h1>
          <p className="text-gray-500 dark:text-neutral-400 text-sm">{periodeLabel}</p>
        </div>
        <div className="flex gap-2">
          <Button variant={umMode === 'minggu' ? 'default' : 'outline'} onClick={() => setUMMode('minggu')} className={umMode === 'minggu' ? 'bg-amber-500 text-black' : 'bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 text-gray-600 dark:text-neutral-300'}>Mingguan</Button>
          <Button variant={umMode === 'bulan' ? 'default' : 'outline'} onClick={() => setUMMode('bulan')} className={umMode === 'bulan' ? 'bg-amber-500 text-black' : 'bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 text-gray-600 dark:text-neutral-300'}>Bulanan</Button>
        </div>
        <Button
  size="sm"
  onClick={() => {
    aktif.forEach(k => {
      if (!isBayar(k.id)) tandaiUMBayar(k.id, periodeVal);
    });
    toast.success('Semua uang makan ditandai dibayar');
  }}
  className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
>
  <Check className="w-4 h-4 mr-1" /> Bayar Semua
</Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {umMode === 'minggu' ? (
          <Select value={periodeMinggu} onValueChange={setPeriodeMinggu}>
            <SelectTrigger className="w-[280px] bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-neutral-200"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">{getKamisList().map(p => <SelectItem key={p.value} value={p.value} className="text-gray-900 dark:text-neutral-200">{p.label}</SelectItem>)}</SelectContent>
          </Select>
        ) : (
          <Select value={periodeBulan} onValueChange={setPeriodeBulan}>
            <SelectTrigger className="w-[200px] bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-neutral-200"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">{getBulanOptions().map(b => <SelectItem key={b.value} value={b.value} className="text-gray-900 dark:text-neutral-200">{b.label}</SelectItem>)}</SelectContent>
          </Select>
        )}
        <Select value={cabangFilter} onValueChange={setCabangFilter}>
          <SelectTrigger className="w-[140px] bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-neutral-200"><SelectValue placeholder="Semua Cabang" /></SelectTrigger>
          <SelectContent className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
            <SelectItem value="all" className="text-gray-900 dark:text-neutral-200">Semua</SelectItem>
            {getCabangKodeList().map(c => <SelectItem key={c} value={c} className="text-gray-900 dark:text-neutral-200">{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800"><CardContent className="p-3"><p className="text-gray-400 dark:text-neutral-600 text-xs">Total UM</p><p className="text-amber-500 text-xl font-bold">{fRp(totalUMBersih)}</p></CardContent></Card>
        <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800"><CardContent className="p-3"><p className="text-gray-400 dark:text-neutral-600 text-xs">Total Lembur</p><p className="text-amber-400 text-xl font-bold">{fRp(totalLembur)}</p></CardContent></Card>
        <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800"><CardContent className="p-3"><p className="text-gray-400 dark:text-neutral-600 text-xs">Grand Total</p><p className="text-emerald-500 text-xl font-bold">{fRp(grandTotal)}</p></CardContent></Card>
      </div>

      <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
        <CardContent className="p-4 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-neutral-800">
                <th className="text-left text-gray-500 dark:text-neutral-600 text-xs font-medium py-2 px-2">#</th>
                <th className="text-left text-gray-500 dark:text-neutral-600 text-xs font-medium py-2 px-2">Nama</th>
                <th className="text-left text-gray-500 dark:text-neutral-600 text-xs font-medium py-2 px-2">Cabang</th>
                <th className="text-center text-gray-500 dark:text-neutral-600 text-xs font-medium py-2 px-2">Hadir</th>
                <th className="text-center text-gray-500 dark:text-neutral-600 text-xs font-medium py-2 px-2">Alpha</th>
                <th className="text-right text-gray-500 dark:text-neutral-600 text-xs font-medium py-2 px-2">Total UM</th>
                <th className="text-right text-gray-500 dark:text-neutral-600 text-xs font-medium py-2 px-2">Lembur</th>
                <th className="text-right text-gray-500 dark:text-neutral-600 text-xs font-medium py-2 px-2">Total</th>
                {umMode === 'minggu' && <><th className="text-center text-gray-500 dark:text-neutral-600 text-xs font-medium py-2 px-2">Status</th><th className="text-center text-gray-500 dark:text-neutral-600 text-xs font-medium py-2 px-2">Aksi</th></>}
              </tr>
            </thead>
            <tbody>
              {aktif.map((k, i) => {
                const data = getUMData(k.id);
                const sudahBayar = isBayar(k.id);
                return (
                  <tr key={k.id} className="border-b border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-900/50">
                    <td className="py-2 px-2 text-gray-400 dark:text-neutral-600 text-xs">{i + 1}</td>
                    <td className="py-2 px-2"><p className="text-gray-800 dark:text-neutral-200 text-sm font-medium">{k.nama}</p></td>
                    <td className="py-2 px-2"><span className="px-2 py-0.5 rounded-md bg-gray-200 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 text-xs">{k.divisi}</span></td>
                    <td className="py-2 px-2 text-center text-emerald-500 text-sm font-medium">{data.hadir}</td>
                    <td className="py-2 px-2 text-center text-red-500 text-sm">{data.alpha > 0 ? `${data.alpha} hr` : '-'}</td>
                    <td className="py-2 px-2 text-right text-gray-800 dark:text-neutral-200 text-sm font-medium">{fRp(data.umBersih)}</td>
                    <td className="py-2 px-2 text-right text-amber-500 text-sm">{data.lemburPeriode > 0 ? fRp(data.lemburPeriode) : '-'}</td>
                    <td className="py-2 px-2 text-right text-emerald-500 text-sm font-bold">{fRp(data.umBersih + data.lemburPeriode)}</td>
                    {umMode === 'minggu' && <>
                      <td className="py-2 px-2 text-center"><span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium border", sudahBayar ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20')}>{sudahBayar ? 'Dibayar' : 'Belum'}</span></td>
                      <td className="py-2 px-2 text-center">
                        <div className="flex gap-1 justify-center">
                          <Button variant="ghost" size="sm" onClick={() => { setPrintKaryawan(k.id); setTimeout(() => handlePrintSlip(), 100); }} className="text-blue-500 hover:text-blue-400 h-7 w-7 p-0" title="Print Slip"><Printer className="w-3.5 h-3.5" /></Button>
                          {sudahBayar ? <Button variant="ghost" size="sm" onClick={() => { batalUMBayar(k.id, periodeVal); toast.success('Status dibatalkan'); }} className="text-red-500 hover:text-red-400 h-7 px-2 text-xs"><RotateCcw className="w-3 h-3 mr-1" /> Batal</Button>
                            : <Button variant="ghost" size="sm" onClick={() => { tandaiUMBayar(k.id, periodeVal); toast.success('Ditandai dibayar'); }} className="text-emerald-500 hover:text-emerald-400 h-7 px-2 text-xs"><Check className="w-3 h-3 mr-1" /> Bayar</Button>}
                        </div>
                      </td>
                    </>}
                  </tr>
                );
              })}
              <tr className="bg-amber-500/5">
                <td colSpan={5} className="py-3 px-2 text-right text-gray-500 dark:text-neutral-600 text-xs font-medium">TOTAL</td>
                <td className="py-3 px-2 text-right text-gray-800 dark:text-neutral-200 text-sm font-bold">{fRp(totalUMBersih)}</td>
                <td className="py-3 px-2 text-right text-amber-500 text-sm font-bold">{fRp(totalLembur)}</td>
                <td className="py-3 px-2 text-right text-emerald-500 text-sm font-bold">{fRp(grandTotal)}</td>
                {umMode === 'minggu' && <td colSpan={2} />}
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Hidden print area */}
      {karyawanPrintData && printData && (
        <div className="hidden">
          <div ref={slipRef}>
            <SlipUM
              karyawan={karyawanPrintData}
              periodeLabel={periodeLabel}
              hadir={printData.hadir}
              alpha={printData.alpha}
              umRate={printData.umRate}
              umKotor={printData.umKotor}
              potonganKB={printData.potonganKB}
              potonganDD={printData.potonganDD}
              umBersih={printData.umBersih}
              lemburPeriode={printData.lemburPeriode}
              lemburCount={printData.lemburCount}
              totalBayar={printData.umBersih + printData.lemburPeriode}
              detailRows={printData.detailRows}
            />
          </div>
        </div>
      )}
    </div>
  );
}
