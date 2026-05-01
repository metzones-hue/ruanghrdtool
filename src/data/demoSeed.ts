import type { Absensi, Lembur, Kasbon, Cuti, PotonganDadakan } from '@/types';

// ==================== DEMO DATA GENERATOR ====================
// Generate realistic dummy data for 73 employees across 3 months

const karyawanIds = Array.from({ length: 73 }, (_, i) => i + 1);
const karyawanNames: Record<number, string> = {
  1: 'Ahmad Fauzi', 2: 'Siti Aminah', 3: 'Budi Santoso', 4: 'Dewi Kusuma', 5: 'Eko Prasetyo',
  6: 'Rina Wulandari', 7: 'Fajar Hidayat', 8: 'Lestari Putri', 9: 'Gilang Ramadhan', 10: 'Maya Sari',
  11: 'Hendra Wijaya', 12: 'Nina Astuti', 13: 'Agus Supriyadi', 14: 'Tuti Handayani',
  15: 'Suparman', 16: 'Yuli Astuti', 17: 'Dedi Kurniawan', 18: 'Sri Rejeki', 19: 'Iwan Setiawan',
  20: 'Ratna Dewi', 21: 'Acep Sumarna', 22: 'Nunung Suryani', 23: 'Jajang Nurjaman',
  24: 'Eni Rohaeni', 25: 'Suheri', 26: 'Bajari', 27: 'Maman Sudrajat', 28: 'Siti Rodiah',
  29: 'Ahmad Tohari', 30: 'Neneng Siti', 31: 'Dadang Hermawan', 32: 'Yayah Nurhasanah',
  33: 'Otong Suratman', 34: 'Imas Masripah', 35: 'Enceng Kuswara', 36: 'Ade Rohayati',
  37: 'Ujang Saepudin', 38: 'Etty Sulastri', 39: 'Asep Dedi', 40: 'Tati Sumiati',
  41: 'Eman Sulaeman', 42: 'Iis Istiqomah', 43: 'Cepi Supriadi', 44: 'Yeni Rukmini',
  45: 'Dede Sunandar', 46: 'Mimin Sumarni', 47: 'Kosim Halim', 48: 'Idah Sariyah',
  49: 'Rudi Hartono', 50: 'Lina Kusumawati', 51: 'Beni Sutanto', 52: 'Rina Marlina',
  53: 'Doni Kurniawan', 54: 'Sari Indah', 55: 'Ferdy Ahmad', 56: 'Mega Puspita',
  57: 'Irfan Maulana', 58: 'Diana Sari', 59: 'Adi Nugroho', 60: 'Nia Kurniati',
  61: 'Yusuf Maulana', 62: 'Wati Susanti', 63: 'Hadi Sucipto', 64: 'Titin Suhartini',
  65: 'Samsul Arifin', 66: 'Yuyun Yuningsih', 67: 'Koko Koswara', 68: 'Lilis Suryani',
  69: 'Opik Saepulloh', 70: 'Ati Rahayu', 71: 'Cecep Suhendar', 72: 'Ita Purnamasari',
  73: 'Dadan Ramdani',
};

const divisiMap: Record<number, string> = {
  1: 'HO', 2: 'HO', 3: 'HO', 4: 'HO', 5: 'HO', 6: 'HO', 7: 'HO', 8: 'HO', 9: 'HO', 10: 'HO',
  11: 'HO', 12: 'HO', 13: 'DMB', 14: 'DMB', 15: 'DMB', 16: 'DMB', 17: 'DMB', 18: 'DMB',
  19: 'DMB', 20: 'DMB', 21: 'DMB', 22: 'DMB', 23: 'DMB', 24: 'DMB', 25: 'CTR', 26: 'CTR',
  27: 'CTR', 28: 'CTR', 29: 'CTR', 30: 'CTR', 31: 'CTR', 32: 'CTR', 33: 'CTR', 34: 'CTR',
  35: 'CTR', 36: 'CTR', 37: 'GDS', 38: 'GDS', 39: 'GDS', 40: 'GDS', 41: 'GDS', 42: 'GDS',
  43: 'GDS', 44: 'GDS', 45: 'GDS', 46: 'GDS', 47: 'GDS', 48: 'GDS', 49: 'BKS', 50: 'BKS',
  51: 'BKS', 52: 'BKS', 53: 'BKS', 54: 'BKS', 55: 'BKS', 56: 'BKS', 57: 'BKS', 58: 'BKS',
  59: 'BKS', 60: 'BKS', 61: 'CGK', 62: 'CGK', 63: 'CGK', 64: 'CGK', 65: 'CGK', 66: 'CGK',
  67: 'CGK', 68: 'CGK', 69: 'CGK', 70: 'CGK', 71: 'CGK', 72: 'CGK', 73: 'CGK',
};

const shiftMap: Record<number, 1 | 2> = {
  1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1, 10: 1, 11: 1, 12: 1,
  13: 1, 14: 1, 15: 2, 16: 2, 17: 1, 18: 1, 19: 2, 20: 1, 21: 1, 22: 1, 23: 2, 24: 1,
  25: 1, 26: 1, 27: 2, 28: 2, 29: 1, 30: 1, 31: 2, 32: 1, 33: 1, 34: 1, 35: 2, 36: 1,
  37: 1, 38: 1, 39: 2, 40: 2, 41: 1, 42: 1, 43: 2, 44: 1, 45: 1, 46: 1, 47: 2, 48: 1,
  49: 1, 50: 1, 51: 2, 52: 2, 53: 1, 54: 1, 55: 2, 56: 1, 57: 1, 58: 1, 59: 2, 60: 1,
  61: 1, 62: 1, 63: 2, 64: 2, 65: 1, 66: 1, 67: 2, 68: 1, 69: 1, 70: 1, 71: 2, 72: 1, 73: 1,
};

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Generate dates for last 3 months
function getDates(): string[] {
  const dates: string[] = [];
  const now = new Date();
  for (let m = 2; m >= 0; m--) {
    const month = new Date(now.getFullYear(), now.getMonth() - m, 1);
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(month.getFullYear(), month.getMonth(), d);
      if (date.getDay() !== 0 && date <= now) { // Exclude Sundays
        dates.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
      }
    }
  }
  return dates;
}

export function generateDemoAbsensi(): Absensi[] {
  const dates = getDates();
  const absensi: Absensi[] = [];
  let id = 1;

  for (const kId of karyawanIds) {
    for (const date of dates) {
      // 85% hadir, 5% alpha, 5% cuti, 3% sakit, 2% izin
      const roll = Math.random();
      let status: Absensi['status'] = 'Hadir';
      if (roll > 0.98) status = 'Izin';
      else if (roll > 0.95) status = 'Sakit';
      else if (roll > 0.90) status = 'Cuti';
      else if (roll > 0.85) status = 'Alpha';

      const shift = shiftMap[kId];
      let masuk: string | undefined;
      let keluar: string | undefined;
      let menitTelat = 0;

      if (status === 'Hadir') {
        const baseHour = shift === 2 ? 12 : 8;
        const baseMin = shift === 2 ? 0 : 30;
        // Random check-in with some late
        const lateRoll = Math.random();
        const lateMinutes = lateRoll > 0.7 ? randomBetween(0, 45) : 0;
        menitTelat = lateMinutes > 15 ? lateMinutes : 0;

        const inHour = baseHour;
        const inMin = baseMin + lateMinutes;
        masuk = `${String(inHour).padStart(2, '0')}:${String(inMin).padStart(2, '0')}`;

        // Check-out with overtime for some
        const outHour = shift === 2 ? 21 : 17;
        const outMin = 30 + randomBetween(0, 30);
        keluar = `${String(outHour).padStart(2, '0')}:${String(outMin).padStart(2, '0')}`;
      }

      absensi.push({
        id: id++,
        karyawanId: kId,
        nama: karyawanNames[kId],
        tanggal: date,
        status,
        masuk,
        keluar,
        menitTelat,
        shift,
        keterangan: status !== 'Hadir' ? `${status} - ${randomChoice(['Keperluan pribadi', 'Izin keluarga', 'Sakit flu', 'Cuti tahunan', 'Urusan keluarga'])}` : undefined,
      });
    }
  }
  return absensi;
}

export function generateDemoLembur(): Lembur[] {
  const absensi = generateDemoAbsensi();
  const lembur: Lembur[] = [];
  let id = 1;

  for (const a of absensi) {
    if (a.status !== 'Hadir' || !a.keluar) continue;
    // ~30% chance of overtime
    if (Math.random() > 0.30) continue;

    const isShift2 = shiftMap[a.karyawanId] === 2;
    const jamKeluarStandar = isShift2 ? '21:00' : '17:30';
    const [outH, outM] = a.keluar.split(':').map(Number);
    const [stdH, stdM] = jamKeluarStandar.split(':').map(Number);

    const outMinutes = outH * 60 + outM;
    const stdMinutes = stdH * 60 + stdM;
    if (outMinutes <= stdMinutes + 15) continue; // No meaningful overtime

    const mulaiJam = `${String(stdH + 1).padStart(2, '0')}:${String(randomBetween(0, 30)).padStart(2, '0')}`;
    const jamTotal = Math.round(((outMinutes - (stdH * 60 + stdM)) / 60) * 10) / 10;
    if (jamTotal < 1) continue;

    const isMinggu = new Date(a.tanggal).getDay() === 0;
    const melebihi2230 = outMinutes >= 22 * 60 + 30;
    const bonusMalam = melebihi2230 ? 15000 : 0;
    const bonusUM = isMinggu && jamTotal > 8 ? 40000 : 0;
    const upahPerJam = [11, 12].includes(a.karyawanId) ? 7000 : [3, 5, 13, 23, 25, 35, 47, 59, 61, 71].includes(a.karyawanId) ? 6000 : 5000;

    let upah = jamTotal * upahPerJam;
    if (isMinggu) upah *= 2;
    const total = Math.round(upah + bonusMalam + bonusUM);

    lembur.push({
      id: id++,
      tanggal: a.tanggal,
      karyawanId: a.karyawanId,
      nama: karyawanNames[a.karyawanId],
      divisi: divisiMap[a.karyawanId],
      mulai: mulaiJam,
      selesai: a.keluar,
      jamTotal,
      upahPerJam,
      isMinggu,
      melebihi2230,
      bonusMalam,
      bonusUM,
      totalUpah: total,
      alasan: randomChoice(['Deadline proyek', 'Kejar target produksi', 'Pengganti shift', 'Lembur rutin', 'Perbaikan mesin']),
      status: Math.random() > 0.3 ? 'Disetujui' : 'Pending',
    });
  }
  return lembur;
}

export function generateDemoKasbon(): Kasbon[] {
  const kasbon: Kasbon[] = [];
  const selectedIds = karyawanIds.filter(() => Math.random() > 0.6);
  let id = 1;

  for (const kId of selectedIds) {
    const jumlah = randomChoice([500000, 1000000, 1500000, 2000000, 3000000]);
    const via = randomChoice(['UM', 'Gaji', 'Keduanya'] as const);
    const cicilan = randomChoice([100000, 150000, 200000, 250000]);
    const cicilanUM = via !== 'Gaji' ? cicilan : 0;
    const cicilanGaji = via !== 'UM' ? cicilan : 0;
    const status = Math.random() > 0.4 ? 'Aktif' : 'Lunas';
    const sudahBayar = status === 'Lunas' ? jumlah : randomBetween(0, jumlah - cicilan);

    kasbon.push({
      id: id++,
      tanggal: `2025-${String(randomBetween(1, 12)).padStart(2, '0')}-${String(randomBetween(1, 28)).padStart(2, '0')}`,
      karyawanId: kId,
      nama: karyawanNames[kId],
      jumlah,
      via,
      cicilan,
      cicilanUM,
      cicilanGaji,
      sisaHutang: Math.max(0, jumlah - sudahBayar),
      ket: randomChoice(['Uang sekolah anak', 'Renovasi rumah', 'Biaya rumah sakit', 'Kebutuhan darurat', 'Modal usaha sampingan']),
      status,
      riwayatBayar: status === 'Aktif' ? Array.from({ length: randomBetween(1, 5) }, () => ({
        tanggal: `2025-${String(randomBetween(1, 5)).padStart(2, '0')}-${String(randomBetween(1, 28)).padStart(2, '0')}`,
        nominal: cicilan,
      })) : Array.from({ length: Math.ceil(jumlah / cicilan) }, () => ({
        tanggal: `2025-${String(randomBetween(1, 5)).padStart(2, '0')}-${String(randomBetween(1, 28)).padStart(2, '0')}`,
        nominal: cicilan,
      })),
    });
  }
  return kasbon;
}

export function generateDemoCuti(): Cuti[] {
  const cuti: Cuti[] = [];
  const selectedIds = karyawanIds.filter(() => Math.random() > 0.75);
  let id = 1;
  const jenisOptions = ['Cuti Tahunan', 'Cuti Sakit', 'Izin Pribadi', 'Dinas Luar'] as const;

  for (const kId of selectedIds) {
    const hari = randomBetween(1, 5);
    const month = randomBetween(1, 5);
    const day = randomBetween(1, 20);
    const mulai = `2025-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const selesaiDate = new Date(2025, month - 1, day + hari);
    const selesai = `${selesaiDate.getFullYear()}-${String(selesaiDate.getMonth() + 1).padStart(2, '0')}-${String(selesaiDate.getDate()).padStart(2, '0')}`;

    cuti.push({
      id: id++,
      ajuan: `2025-${String(randomBetween(1, month)).padStart(2, '0')}-${String(randomBetween(1, day)).padStart(2, '0')}`,
      karyawanId: kId,
      nama: karyawanNames[kId],
      jenis: randomChoice([...jenisOptions]),
      mulai,
      selesai,
      hari,
      ket: randomChoice(['Libur keluarga', 'Urusan pribadi', 'Izin sakit', 'Dinas ke cabang lain', 'Acara keluarga']),
      status: Math.random() > 0.4 ? 'Disetujui' : 'Pending',
    });
  }
  return cuti;
}

export function generateDemoPotonganDadakan(): PotonganDadakan[] {
  const potongan: PotonganDadakan[] = [];
  let id = 1;

  for (const kId of karyawanIds.filter(() => Math.random() > 0.85)) {
    potongan.push({
      id: id++,
      tanggal: `2025-${String(randomBetween(1, 5)).padStart(2, '0')}-${String(randomBetween(1, 28)).padStart(2, '0')}`,
      karyawanId: kId,
      nama: karyawanNames[kId],
      jumlah: randomChoice([50000, 100000, 150000, 200000]),
      via: randomChoice(['UM', 'Gaji'] as const),
      alasan: randomChoice(['Kerusakan barang', 'Keterlambatan', 'Bon sebelumnya', 'Biaya administrasi']),
    });
  }
  return potongan;
}

export function exportDemoToXLSX() {
  // This function will be called from the UI to download seed data as Excel
  const absensi = generateDemoAbsensi();
  const lembur = generateDemoLembur();
  
  return {
    absensi: absensi.map(a => ({
      Nama: a.nama,
      Tanggal: a.tanggal,
      Status: a.status,
      'Check In': a.masuk || '',
      'Check Out': a.keluar || '',
      Shift: a.shift,
      Keterangan: a.keterangan || '',
    })),
    lembur: lembur.map(l => ({
      Nama: l.nama,
      Tanggal: l.tanggal,
      Mulai: l.mulai,
      Selesai: l.selesai,
      'Jam Total': l.jamTotal,
      'Total Upah': l.totalUpah,
      Status: l.status,
      Alasan: l.alasan,
    })),
  };
}
