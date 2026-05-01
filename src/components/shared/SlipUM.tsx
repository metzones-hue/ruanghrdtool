import { forwardRef } from 'react';
import { fRp } from '@/lib/utils';
import type { Karyawan } from '@/types';

interface SlipUMProps {
  karyawan: Karyawan;
  periodeLabel: string;
  hadir: number;
  alpha: number;
  umRate: number;
  umKotor: number;
  potonganKB: number;
  potonganDD: number;
  umBersih: number;
  lemburPeriode: number;
  lemburCount: number;
  totalBayar: number;
  detailRows?: { tanggal: string; hari: string; status: string; masuk: string; keluar: string; um: number }[];
}

export const SlipUM = forwardRef<HTMLDivElement, SlipUMProps>(
  ({ karyawan, periodeLabel, hadir, alpha, umRate, umKotor, potonganKB, potonganDD, umBersih, lemburPeriode, lemburCount, totalBayar, detailRows }, ref) => {
    const umRateFormatted = (umRate || 40000).toLocaleString('id-ID');
    return (
      <div ref={ref} className="bg-white text-black p-8 max-w-[500px] mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
        {/* Header */}
        <div className="flex justify-between items-start border-b-4 border-amber-500 pb-4 mb-6">
          <div>
            <h1 className="text-3xl font-black text-amber-500 tracking-wider">RUANG<span className="text-black">PRINT</span></h1>
            <p className="text-gray-500 text-sm mt-1">Slip Uang Makan Karyawan</p>
          </div>
          <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Uang Makan</span>
        </div>

        {/* Employee */}
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <table className="w-full text-sm">
            <tbody>
              <tr><td className="text-gray-500 w-24 py-1">Nama</td><td className="font-bold">: {karyawan.nama}</td></tr>
              <tr><td className="text-gray-500 py-1">NPK</td><td>: {karyawan.npk}</td></tr>
              <tr><td className="text-gray-500 py-1">Jabatan</td><td>: {karyawan.jabatan}</td></tr>
              <tr><td className="text-gray-500 py-1">Cabang</td><td>: {karyawan.divisi} / {karyawan.cabang}</td></tr>
              <tr><td className="text-gray-500 py-1">Periode</td><td>: {periodeLabel}</td></tr>
            </tbody>
          </table>
        </div>

        {/* Detail Kehadiran */}
        {detailRows && detailRows.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Detail Kehadiran</h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-1 text-gray-500">Tanggal</th>
                  <th className="text-right py-1 text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {detailRows.map((row, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-1">{row.tanggal} ({row.hari})</td>
                    <td className={`py-1 text-right ${row.status === 'Hadir' ? 'text-emerald-600' : 'text-red-500'}`}>
                      {row.status === 'Hadir' ? `+ Rp ${row.um.toLocaleString('id-ID')}` : `Rp 0 (${row.status})`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Calculation */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between py-2 border-b border-dashed border-gray-200 text-sm">
            <span>UM Kotor ({hadir} hari x Rp{umRateFormatted})</span>
            <span className="font-bold">{fRp(umKotor)}</span>
          </div>
          {potonganKB > 0 && (
            <div className="flex justify-between py-2 border-b border-dashed border-gray-200 text-sm">
              <span className="text-red-500">Potongan Kas Bon</span>
              <span className="text-red-500 font-bold">-{fRp(potonganKB)}</span>
            </div>
          )}
          {potonganDD > 0 && (
            <div className="flex justify-between py-2 border-b border-dashed border-gray-200 text-sm">
              <span className="text-orange-500">Potongan Dadakan</span>
              <span className="text-orange-500 font-bold">-{fRp(potonganDD)}</span>
            </div>
          )}
          <div className="flex justify-between py-2 border-b-2 border-gray-200 text-sm">
            <strong>UM Bersih</strong>
            <strong>{fRp(umBersih)}</strong>
          </div>
          {lemburPeriode > 0 && (
            <div className="flex justify-between py-2 text-sm text-amber-600">
              <span>Upah Lembur ({lemburCount} sesi)</span>
              <strong>{fRp(lemburPeriode)}</strong>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="bg-black text-white rounded-lg p-4 flex justify-between items-center mb-6">
          <span className="text-xs uppercase tracking-wider">Total Dibayar</span>
          <span className="text-2xl font-black text-amber-400">{fRp(totalBayar)}</span>
        </div>

        {alpha > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6 text-xs text-amber-700">
            <strong>Perhatian:</strong> {alpha} hari alpha - UM dipotong
          </div>
        )}

        {/* Signatures */}
        <div className="flex justify-between mt-8">
          <div className="text-center w-32">
            <div className="border-t border-gray-300 pt-2">
              <p className="text-xs text-gray-500">Penerima</p>
              <p className="text-xs font-bold mt-1">{karyawan.nama}</p>
            </div>
          </div>
          <div className="text-center w-32">
            <div className="border-t border-gray-300 pt-2">
              <p className="text-xs text-gray-500">HRD / Pemberi</p>
              <p className="text-xs text-gray-400 mt-1">RuangPrint</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-200 text-center text-[10px] text-gray-400">
          RuangHRD &middot; RuangPrint &middot; {new Date().toLocaleDateString('id-ID')}
        </div>
      </div>
    );
  }
);

SlipUM.displayName = 'SlipUM';
