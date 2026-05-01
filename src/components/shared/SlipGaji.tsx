import { forwardRef } from 'react';
import { fRp } from '@/lib/utils';
import type { Karyawan } from '@/types';

interface SlipGajiProps {
  karyawan: Karyawan;
  periode: string;
  calc: {
    gaji: number;
    tunjangan: number;
    insentif: number;
    uangMakan: number;
    lembur: number;
    bpjs: number;
    potonganTelat: number;
    totalMenitTelat: number;
    potonganKasbon: number;
    potonganDadakanGaji: number;
    total: number;
  };
}

export const SlipGaji = forwardRef<HTMLDivElement, SlipGajiProps>(
  ({ karyawan, periode, calc }, ref) => {
    const periodeLabel = new Date(`${periode}-01`).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

    return (
      <div ref={ref} className="bg-white text-black p-8 max-w-[600px] mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
        {/* Header */}
        <div className="flex justify-between items-start border-b-4 border-amber-500 pb-4 mb-6">
          <div>
            <h1 className="text-3xl font-black text-amber-500 tracking-wider">RUANG<span className="text-black">PRINT</span></h1>
            <p className="text-gray-500 text-sm mt-1">Slip Gaji Karyawan</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Periode: <strong>{periodeLabel}</strong></p>
            <p className="text-xs text-gray-400 mt-1">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>

        {/* Employee Info */}
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <table className="w-full text-sm">
            <tbody>
              <tr><td className="text-gray-500 w-28 py-1">Nama</td><td className="font-bold">: {karyawan.nama}</td><td className="text-gray-500 w-20">Jabatan</td><td>: {karyawan.jabatan}</td></tr>
              <tr><td className="text-gray-500 py-1">NPK</td><td>: {karyawan.npk}</td><td className="text-gray-500">Cabang</td><td>: {karyawan.divisi} / {karyawan.cabang}</td></tr>
              <tr><td className="text-gray-500 py-1">Status</td><td>: {karyawan.status}</td><td className="text-gray-500">Shift</td><td>: {karyawan.shift === 2 ? '2 (12:00-21:00)' : '1 (08:30-17:30)'}</td></tr>
            </tbody>
          </table>
        </div>

        {/* Income */}
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Pendapatan</h3>
        <table className="w-full text-sm mb-6">
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-2 text-emerald-600 font-medium">Gaji Pokok</td>
              <td className="py-2 text-right font-medium">{fRp(calc.gaji)}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2 text-emerald-600 font-medium">Tunjangan Jabatan</td>
              <td className="py-2 text-right font-medium">{fRp(calc.tunjangan)}</td>
            </tr>
            {calc.insentif > 0 && (
              <tr className="border-b border-gray-200">
                <td className="py-2 text-emerald-600 font-medium">Insentif Kerajinan</td>
                <td className="py-2 text-right font-medium">{fRp(calc.insentif)}</td>
              </tr>
            )}
            {calc.uangMakan > 0 && (
              <tr className="border-b border-gray-200">
                <td className="py-2 text-emerald-600 font-medium">Uang Makan</td>
                <td className="py-2 text-right font-medium">{fRp(calc.uangMakan)}</td>
              </tr>
            )}
            {calc.lembur > 0 && (
              <tr className="border-b border-gray-200">
                <td className="py-2 text-emerald-600 font-medium">Upah Lembur</td>
                <td className="py-2 text-right font-medium">{fRp(calc.lembur)}</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Deductions */}
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Potongan</h3>
        <table className="w-full text-sm mb-6">
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-2 text-red-500 font-medium">BPJS Karyawan</td>
              <td className="py-2 text-right font-medium text-red-500">-{fRp(calc.bpjs)}</td>
            </tr>
            {calc.potonganTelat > 0 && (
              <tr className="border-b border-gray-200">
                <td className="py-2 text-red-500 font-medium">Potongan Telat ({calc.totalMenitTelat} mnt)</td>
                <td className="py-2 text-right font-medium text-red-500">-{fRp(calc.potonganTelat)}</td>
              </tr>
            )}
            {calc.potonganKasbon > 0 && (
              <tr className="border-b border-gray-200">
                <td className="py-2 text-red-500 font-medium">Cicilan Kas Bon</td>
                <td className="py-2 text-right font-medium text-red-500">-{fRp(calc.potonganKasbon)}</td>
              </tr>
            )}
            {calc.potonganDadakanGaji > 0 && (
              <tr className="border-b border-gray-200">
                <td className="py-2 text-red-500 font-medium">Potongan Lain</td>
                <td className="py-2 text-right font-medium text-red-500">-{fRp(calc.potonganDadakanGaji)}</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Total */}
        <div className="bg-black text-white rounded-lg p-4 flex justify-between items-center">
          <span className="text-sm uppercase tracking-wider">Total Gaji Bersih</span>
          <span className="text-2xl font-black text-amber-400">{fRp(calc.total)}</span>
        </div>

        {karyawan.umMode !== 'bulanan' && calc.uangMakan === 0 && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mt-4 text-xs text-emerald-700">
            <strong>Info:</strong> Uang makan dibayar mingguan terpisah dari gaji.
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-200 flex justify-between text-xs text-gray-400">
          <span>Slip ini diterbitkan otomatis oleh RuangHRD</span>
          <span>RuangPrint &copy; {new Date().getFullYear()}</span>
        </div>
      </div>
    );
  }
);

SlipGaji.displayName = 'SlipGaji';
