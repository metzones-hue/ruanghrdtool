import { useState, useCallback } from 'react';
import useAppStore from '@/store/useAppStore';
import {
  generateDemoAbsensi,
  generateDemoLembur,
  generateDemoKasbon,
  generateDemoCuti,
  generateDemoPotonganDadakan,
} from '@/data/demoSeed';

export function useDemoInjector() {
  const {
    absensi, lembur, kasbon, cuti, potonganDadakan,
    importAbsensi, addLembur, addKasbon, addCuti, addPotonganDadakan,
  } = useAppStore();
  
  const [isInjecting, setIsInjecting] = useState(false);
  const [progress, setProgress] = useState(0);

  const hasData = absensi.length > 0 || lembur.length > 0 || kasbon.length > 0 || cuti.length > 0;

  const inject = useCallback(async () => {
    if (isInjecting) return;
    setIsInjecting(true);
    setProgress(0);

    const steps = 5;
    
    // Step 1: Absensi
    if (absensi.length === 0) {
      const data = generateDemoAbsensi();
      importAbsensi(data.map(a => ({
        karyawanId: a.karyawanId,
        nama: a.nama,
        tanggal: a.tanggal,
        status: a.status,
        masuk: a.masuk,
        keluar: a.keluar,
        menitTelat: a.menitTelat,
        shift: a.shift,
        keterangan: a.keterangan,
      })));
    }
    setProgress(1 / steps * 100);

    // Step 2: Lembur
    if (lembur.length === 0) {
      const data = generateDemoLembur();
      // Need to clear absensi first to avoid double-generating
      data.forEach(l => addLembur(l));
    }
    setProgress(2 / steps * 100);

    // Step 3: Kasbon
    if (kasbon.length === 0) {
      const data = generateDemoKasbon();
      data.forEach(k => addKasbon(k));
    }
    setProgress(3 / steps * 100);

    // Step 4: Cuti
    if (cuti.length === 0) {
      const data = generateDemoCuti();
      data.forEach(c => addCuti(c));
    }
    setProgress(4 / steps * 100);

    // Step 5: Potongan Dadakan
    if (potonganDadakan.length === 0) {
      const data = generateDemoPotonganDadakan();
      data.forEach(p => addPotonganDadakan(p));
    }
    setProgress(100);

    setTimeout(() => {
      setIsInjecting(false);
      setProgress(0);
    }, 500);
  }, [isInjecting, absensi.length, lembur.length, kasbon.length, cuti.length, potonganDadakan.length, importAbsensi, addLembur, addKasbon, addCuti, addPotonganDadakan]);

  return { inject, isInjecting, progress, hasData };
}
