import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import useAppStore from '@/store/useAppStore';
import { fRp, getStatusColor, cn, getBulanOptions } from '@/lib/utils';
import type { Karyawan } from '@/types';
import { Calculator, Check, Printer } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { SlipGaji } from '@/components/shared/SlipGaji';

export default function GajiPage() {
  const { karyawan, gaji, hitungSemuaGaji, hitungGajiKaryawan, tandaiGajiBayar } = useAppStore();
  const [periode, setPeriode] = useState(() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; });
  const [slipKaryawan, setSlipKaryawan] = useState<{ k: Karyawan; calc: ReturnType<typeof hitungGajiKaryawan> } | null>(null);
  const slipRef = useRef<HTMLDivElement>(null);

  const [filterCabang, setFilterCabang] = useState('Semua');
  const aktif = karyawan.filter(k => k.status === 'Aktif' && (filterCabang === 'Semua' || k.cabang === filterCabang));
  const cabangList = ['Semua', ...Array.from(new Set(karyawan.filter(k => k.status === 'Aktif').map(k => k.cabang)))];
  const gajiPeriode = gaji.filter(g => g.periode === periode);
  const handlePrintSlip = useReactToPrint({ contentRef: slipRef, documentTitle: 'Slip Gaji' });
  const calculateGaji = () => { hitungSemuaGaji(periode); toast.success('Gaji dihitung untuk semua karyawan'); };

  const showSlip = (kId: number) => {
  const k = aktif.find(x => x.id === kId);
  if (!k) return;
  const c = hitungGajiKaryawan(k, periode);
  setSlipKaryawan({ k, calc: c });
  setTimeout(() => handlePrintSlip(), 500);
};

 const gajiFiltered = gajiPeriode.filter(g =>
  filterCabang === 'Semua' ||
  karyawan.find(k => k.id === g.karyawanId)?.divisi === filterCabang
);

const totalGaji = gajiFiltered.reduce((s, g) => s + g.total, 0);
const totalSudahBayar = gajiFiltered.filter(g => g.status === 'Sudah Dibayar').length;
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
  <div>
    <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100">Penggajian</h1>
    <p className="text-gray-500 dark:text-neutral-400 text-sm">{aktif.length} karyawan aktif</p>
  </div>
  <div className="flex flex-wrap items-center gap-2">
    <Select value={periode} onValueChange={setPeriode}>
      <SelectTrigger className="w-[160px] bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-neutral-200">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
        {getBulanOptions().map(b => <SelectItem key={b.value} value={b.value} className="text-gray-900 dark:text-neutral-200">{b.label}</SelectItem>)}
      </SelectContent>
    </Select>
    <Select value={filterCabang} onValueChange={setFilterCabang}>
      <SelectTrigger className="w-[160px] bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-neutral-200">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
        {cabangList.map(c => <SelectItem key={c} value={c}>{c === 'Semua' ? 'Semua Cabang' : c}</SelectItem>)}
      </SelectContent>
    </Select>
    <Button variant="outline" onClick={calculateGaji} className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 text-gray-600 dark:text-neutral-300">
      <Calculator className="w-4 h-4 mr-1" /> Hitung Semua
    </Button>
    <Button size="sm" onClick={() => { aktif.forEach(k => { const g = gajiPeriode.find(x => x.karyawanId === k.id); if (g && g.status === 'Belum Dibayar') tandaiGajiBayar(k.id, periode); }); toast.success('Semua gaji ditandai dibayar'); }} className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold">
      <Check className="w-4 h-4 mr-1" /> Bayar Semua
    </Button>
  </div>
</div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800"><CardContent className="p-3"><p className="text-gray-400 dark:text-neutral-600 text-xs">Total Gaji</p><p className="text-amber-500 text-xl font-bold">{fRp(totalGaji)}</p></CardContent></Card>
        <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800"><CardContent className="p-3"><p className="text-gray-400 dark:text-neutral-600 text-xs">Sudah Dibayar</p><p className="text-emerald-500 text-xl font-bold">{totalSudahBayar}/{gajiPeriode.length}</p></CardContent></Card>
        <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800"><CardContent className="p-3"><p className="text-gray-400 dark:text-neutral-600 text-xs">Rata-rata</p><p className="text-blue-500 text-xl font-bold">{fRp(gajiPeriode.length > 0 ? Math.round(totalGaji / gajiPeriode.length) : 0)}</p></CardContent></Card>
      </div>

      <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
        <CardContent className="p-4 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-neutral-800">
                <th className="text-left text-gray-500 dark:text-neutral-600 text-xs font-medium py-2 px-2">Nama</th>
                <th className="text-left text-gray-500 dark:text-neutral-600 text-xs font-medium py-2 px-2">Cabang</th>
                <th className="text-right text-gray-500 dark:text-neutral-600 text-xs font-medium py-2 px-2">Gaji Pokok</th>
                <th className="text-right text-gray-500 dark:text-neutral-600 text-xs font-medium py-2 px-2">Tunjangan</th>
                <th className="text-right text-gray-500 dark:text-neutral-600 text-xs font-medium py-2 px-2">Insentif</th>
                <th className="text-right text-gray-500 dark:text-neutral-600 text-xs font-medium py-2 px-2">UM</th>
                <th className="text-right text-gray-500 dark:text-neutral-600 text-xs font-medium py-2 px-2">Lembur</th>
                <th className="text-right text-gray-500 dark:text-neutral-600 text-xs font-medium py-2 px-2">BPJS</th>
                <th className="text-right text-gray-500 dark:text-neutral-600 text-xs font-medium py-2 px-2">Pot. Telat</th>
                <th className="text-right text-gray-500 dark:text-neutral-600 text-xs font-medium py-2 px-2">Pot. Kasbon</th>
                <th className="text-right text-gray-500 dark:text-neutral-600 text-xs font-medium py-2 px-2">Total</th>
                <th className="text-center text-gray-500 dark:text-neutral-600 text-xs font-medium py-2 px-2">Status</th>
                <th className="text-center text-gray-500 dark:text-neutral-600 text-xs font-medium py-2 px-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {aktif.map(k => {
                const g = gajiPeriode.find(x => x.karyawanId === k.id);
                            return (
                  <tr key={k.id} className="border-b border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-900/50">
                    <td className="py-2 px-2"><p className="text-gray-800 dark:text-neutral-200 text-sm font-medium">{k.nama}</p></td>
                    <td className="py-2 px-2"><span className="px-2 py-0.5 rounded-md bg-gray-200 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 text-xs">{k.divisi}</span></td>
                    <td className="py-2 px-2 text-right text-gray-600 dark:text-neutral-400 text-sm">{fRp((g?.gaji ?? k.gajiPokok) - (k.divisi === 'HO' ? (g?.uangMakan ?? 0) : 0))}</td>
                    <td className="py-2 px-2 text-right text-gray-600 dark:text-neutral-400 text-sm">{fRp(g?.tunjangan || k.tunjangan)}</td>
                    <td className="py-2 px-2 text-right text-emerald-500 text-sm">{g?.insentif ? fRp(g.insentif) : '-'}</td>
                    <td className="py-2 px-2 text-right text-gray-600 dark:text-neutral-400 text-sm">{fRp(g?.uangMakan || 0)}</td>
                    <td className="py-2 px-2 text-right text-amber-500 text-sm">{fRp(g?.lembur || 0)}</td>
                    <td className="py-2 px-2 text-right text-red-500 text-sm">{k.bpjs ? fRp(k.bpjs) : '-'}</td>
                    <td className="py-2 px-2 text-right text-red-500 text-sm">{g?.potonganTelat ? fRp(g.potonganTelat) : '-'}</td>
                    <td className="py-2 px-2 text-right text-red-500 text-sm">{g?.potonganKasbon ? fRp(g.potonganKasbon) : '-'}</td>
                    <td className="py-2 px-2 text-right text-amber-500 text-sm font-bold">{fRp(g?.total || 0)}</td>
                    <td className="py-2 px-2 text-center">
                      {g ? <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium border", getStatusColor(g.status))}>{g.status}</span> : <span className="text-gray-400 dark:text-neutral-600 text-xs">-</span>}
                    </td>
                    <td className="py-2 px-2 text-center">
                      <div className="flex gap-1 justify-center">
                        <Button variant="ghost" size="sm" onClick={() => showSlip(k.id)} className="text-blue-500 hover:text-blue-400 h-7 w-7 p-0" title="Print Slip"><Printer className="w-3.5 h-3.5" /></Button>
                        {g && g.status === 'Belum Dibayar' && <Button variant="ghost" size="sm" onClick={() => { tandaiGajiBayar(k.id, periode); toast.success('Ditandai dibayar'); }} className="text-emerald-500 hover:text-emerald-400 h-7 w-7 p-0"><Check className="w-3.5 h-3.5" /></Button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-amber-500/5">
                <td colSpan={10} className="py-3 px-2 text-right text-gray-500 dark:text-neutral-600 text-xs font-medium">TOTAL</td>
                <td className="py-3 px-2 text-right text-amber-500 text-sm font-bold">{fRp(totalGaji)}</td>
                <td colSpan={2} />
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Hidden print area */}
      {slipKaryawan && (
        <div className="absolute -left-[9999px] top-0">
          <div ref={slipRef}>
            <SlipGaji karyawan={slipKaryawan.k} periode={periode} calc={slipKaryawan.calc} />
          </div>
        </div>
      )}
    </div>
  );
}
