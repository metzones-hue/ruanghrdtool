import type { Karyawan, Pengaturan } from '@/types';

export const defaultPengaturan: Pengaturan = {
  upahLembur: 5000,
  upahLemburLevel2: 6000,
  upahLemburLevel3: 7000,
  umPerHari: 40000,
  umPerHariHO: 45000,
  batasTelat: 15,
  batasTelatShift2: 15,
  potonganTelat: 1000,
  bpjsKaryawan: 3,
  bpjsPerusahaan: 7,
  cutiTahunan: 12,
  batasMalam: '22:30',
  bonusMalam: 15000,
  insentifKehadiran: 300000,
  jamMasukShift1: '08:30',
  jamMasukShift2: '12:00',
  jamKeluarShift1: '17:30',
  jamKeluarShift2: '21:00',
  thresholdShift2: '10:30',
  lokasiHO: ['HO'],
  password: 'aHJkMTIz',
  passwordKepala: 'a2VwYWxhNDU2',
  umBulananHO: 960000,
};

const baseCabang: { kode: string; nama: string }[] = [
  { kode: 'HO', nama: 'Head Office' },
  { kode: 'DMB', nama: 'Daan Mogot' },
  { kode: 'CTR', nama: 'Citra Raya' },
  { kode: 'GDS', nama: 'Gading Serpong' },
  { kode: 'BKS', nama: 'Bekasi' },
  { kode: 'CGK', nama: 'Cengkareng' },
];

const CUSTOM_CABANG_KEY = 'ruanghrd-custom-cabang';

export const initialKaryawan: Karyawan[] = [
  // ============ HO ============
  { id: 1, npk: '201805005', nama: 'Mesinta', jabatan: 'FA', divisi: 'HO', cabang: 'Head Office', tanggalMasuk: '2018-05-22', jenisKelamin: 'P', noHP: '089503113488', email: 'mesinta@ruangprint.com', alamat: '', gajiPokok: 5200000, tunjangan: 250000, uangMakan: 45000, bpjs: 50000, upahLembur: 7000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'bulanan', punyaCuti: 'ya' },
  { id: 2, npk: '202003012', nama: 'Chair Rusfi', jabatan: 'Markom', divisi: 'HO', cabang: 'Head Office', tanggalMasuk: '2020-02-03', jenisKelamin: 'L', noHP: '081311812201', email: 'chairrusfi@ruangprint.com', alamat: '', gajiPokok: 4810000, tunjangan: 250000, uangMakan: 45000, bpjs: 48000, upahLembur: 7000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'bulanan', punyaCuti: 'ya' },
  { id: 3, npk: '202207052', nama: 'Elvina Sephia Hardiyanti', jabatan: 'Purchasing', divisi: 'HO', cabang: 'Head Office', tanggalMasuk: '2022-01-07', jenisKelamin: 'P', noHP: '085803944054', email: 'elvinasephia@ruangprint.com', alamat: '', gajiPokok: 3630000, tunjangan: 200000, uangMakan: 45000, bpjs: 48000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'bulanan', punyaCuti: 'ya' },
  { id: 4, npk: '202209057', nama: 'Falka Derizqia', jabatan: 'Staff Markom', divisi: 'HO', cabang: 'Head Office', tanggalMasuk: '2022-01-09', jenisKelamin: 'P', noHP: '083874527099', email: 'falkaderizqi@ruangprint.com', alamat: '', gajiPokok: 3430000, tunjangan: 0, uangMakan: 45000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'bulanan', punyaCuti: 'ya' },
  { id: 5, npk: '202306092', nama: 'Jeni Eka Fitriani', jabatan: 'HR', divisi: 'HO', cabang: 'Head Office', tanggalMasuk: '2023-04-12', jenisKelamin: 'P', noHP: '08987849288', email: 'jeniekafitri@ruangprint.com', alamat: '', gajiPokok: 4050000, tunjangan: 250000, uangMakan: 45000, bpjs: 48000, upahLembur: 6000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'bulanan', punyaCuti: 'ya' },
  { id: 6, npk: '202402111', nama: 'Nagita Zachra Seftira', jabatan: 'Staff FA', divisi: 'HO', cabang: 'Head Office', tanggalMasuk: '2024-02-21', jenisKelamin: 'P', noHP: '089614001986', email: 'nagitazachra@ruangprint.com', alamat: '', gajiPokok: 2930000, tunjangan: 0, uangMakan: 45000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'bulanan', punyaCuti: 'ya' },
  { id: 7, npk: '202103029', nama: 'Refando', jabatan: 'Staff Markom', divisi: 'HO', cabang: 'Head Office', tanggalMasuk: '2021-03-29', jenisKelamin: 'L', noHP: '087878578758', email: 'refando@ruangprint.com', alamat: '', gajiPokok: 3230000, tunjangan: 0, uangMakan: 45000, bpjs: 48000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'bulanan', punyaCuti: 'ya' },
  { id: 8, npk: '202410138', nama: 'Delia Mirabel Putri', jabatan: 'Staff Markom', divisi: 'HO', cabang: 'Head Office', tanggalMasuk: '2024-10-14', jenisKelamin: 'P', noHP: '085782305598', email: 'deliamirabel@ruangprint.com', alamat: '', gajiPokok: 2690000, tunjangan: 0, uangMakan: 45000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'bulanan', punyaCuti: 'ya' },
  { id: 9, npk: '202301080', nama: 'Anggi Awangsyah', jabatan: 'Staff Markom', divisi: 'HO', cabang: 'Head Office', tanggalMasuk: '2023-09-01', jenisKelamin: 'L', noHP: '081385450644', email: 'anggiawangsy@ruangprint.com', alamat: '', gajiPokok: 3630000, tunjangan: 0, uangMakan: 45000, bpjs: 48000, upahLembur: 6000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'bulanan', punyaCuti: 'ya' },
  { id: 10, npk: '202306092', nama: 'Essy Anindyana', jabatan: 'Staff Purchasing', divisi: 'HO', cabang: 'Head Office', tanggalMasuk: '2023-06-13', jenisKelamin: 'P', noHP: '085156069705', email: 'essyanindyan@ruangprint.com', alamat: '', gajiPokok: 2930000, tunjangan: 0, uangMakan: 45000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'bulanan', punyaCuti: 'ya' },
  { id: 11, npk: '202602190', nama: 'Rizka Fatimah', jabatan: 'Staff HR', divisi: 'HO', cabang: 'Head Office', tanggalMasuk: '2026-01-02', jenisKelamin: 'P', noHP: '081413423793', email: 'rizkafatimah@ruangprint.com', alamat: '', gajiPokok: 2700000, tunjangan: 0, uangMakan: 45000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'bulanan', punyaCuti: 'tidak' },
  // ============ DMB ============
  { id: 12, npk: '201509002', nama: 'Rohani Damayanti', jabatan: 'SPV Frontline', divisi: 'DMB', cabang: 'Daan Mogot', tanggalMasuk: '2020-08-26', jenisKelamin: 'P', noHP: '089643919591', email: 'rohanidamaya@ruangprint.com', alamat: '', gajiPokok: 3850000, tunjangan: 250000, uangMakan: 40000, bpjs: 48000, upahLembur: 6000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 13, npk: '201912011', nama: 'Abdul Sururi', jabatan: 'Operator Produksi', divisi: 'DMB', cabang: 'Daan Mogot', tanggalMasuk: '2019-07-12', jenisKelamin: 'L', noHP: '08889624033', email: 'abdulsururi@ruangprint.com', alamat: '', gajiPokok: 3090000, tunjangan: 0, uangMakan: 40000, bpjs: 48000, upahLembur: 6000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 14, npk: '202008015', nama: 'Syarip Hidayat', jabatan: 'Operator Produksi', divisi: 'DMB', cabang: 'Daan Mogot', tanggalMasuk: '2015-01-09', jenisKelamin: 'L', noHP: '081213645143', email: 'syariphidaya@ruangprint.com', alamat: '', gajiPokok: 3090000, tunjangan: 150000, uangMakan: 40000, bpjs: 48000, upahLembur: 6000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 15, npk: '202111041', nama: 'Soleh', jabatan: 'Operator Produksi', divisi: 'DMB', cabang: 'Daan Mogot', tanggalMasuk: '2021-11-30', jenisKelamin: 'L', noHP: '', email: 'soleh@ruangprint.com', alamat: '', gajiPokok: 1800000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 6000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 16, npk: '202208055', nama: 'Ahmad Sarifudin', jabatan: 'Kurir', divisi: 'DMB', cabang: 'Daan Mogot', tanggalMasuk: '2022-05-08', jenisKelamin: 'L', noHP: '082125873884', email: 'ahmadsarifud@ruangprint.com', alamat: '', gajiPokok: 2770000, tunjangan: 0, uangMakan: 40000, bpjs: 48000, upahLembur: 6000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 17, npk: '202307097', nama: 'Ely Hermawaty', jabatan: 'Kasir & Admin', divisi: 'DMB', cabang: 'Daan Mogot', tanggalMasuk: '2023-04-07', jenisKelamin: 'P', noHP: '089636132238', email: 'elyhermawaty@ruangprint.com', alamat: '', gajiPokok: 2370000, tunjangan: 100000, uangMakan: 40000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 18, npk: '202307098', nama: 'Noval Abuyya Sakti', jabatan: 'Deskprint', divisi: 'DMB', cabang: 'Daan Mogot', tanggalMasuk: '2023-12-07', jenisKelamin: 'L', noHP: '081382634541', email: 'novalabuyyas@ruangprint.com', alamat: '', gajiPokok: 2070000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 6000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 19, npk: '202307099', nama: 'Alphonsius Dangu Ramba', jabatan: 'Finishing Produksi', divisi: 'DMB', cabang: 'Daan Mogot', tanggalMasuk: '2023-12-07', jenisKelamin: 'L', noHP: '081239941041', email: 'alphonsiusda@ruangprint.com', alamat: '', gajiPokok: 1450000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 20, npk: '202405116', nama: 'Muhammad Rizal', jabatan: 'Koordinator Finishing', divisi: 'DMB', cabang: 'Daan Mogot', tanggalMasuk: '2024-01-05', jenisKelamin: 'L', noHP: '085773340727', email: 'muhammadriza@ruangprint.com', alamat: '', gajiPokok: 1450000, tunjangan: 150000, uangMakan: 40000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 21, npk: '202406122', nama: 'Muhammad Dasuki', jabatan: 'Finishing Produksi', divisi: 'DMB', cabang: 'Daan Mogot', tanggalMasuk: '2024-10-06', jenisKelamin: 'L', noHP: '0895384513821', email: 'muhammaddasu@ruangprint.com', alamat: '', gajiPokok: 1310000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 22, npk: '202406125', nama: 'Dinar Nursyifa', jabatan: 'Deskprint', divisi: 'DMB', cabang: 'Daan Mogot', tanggalMasuk: '2024-06-18', jenisKelamin: 'P', noHP: '085861268440', email: 'dinarnursyif@ruangprint.com', alamat: '', gajiPokok: 2270000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 23, npk: '202409132', nama: 'Anggita Sahara', jabatan: 'Customer Service', divisi: 'DMB', cabang: 'Daan Mogot', tanggalMasuk: '2024-01-09', jenisKelamin: 'P', noHP: '081998201668', email: 'anggitasahar@ruangprint.com', alamat: '', gajiPokok: 1970000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 24, npk: '202409134', nama: 'Ridhan Maulana', jabatan: 'Supir Mobil', divisi: 'DMB', cabang: 'Daan Mogot', tanggalMasuk: '2024-11-09', jenisKelamin: 'L', noHP: '083140654853', email: 'ridhanmaulan@ruangprint.com', alamat: '', gajiPokok: 2070000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 25, npk: '202412144', nama: 'Dayana Florenza', jabatan: 'Deskprint', divisi: 'DMB', cabang: 'Daan Mogot', tanggalMasuk: '2024-02-12', jenisKelamin: 'P', noHP: '0881012505164', email: 'dayanafloren@ruangprint.com', alamat: '', gajiPokok: 1970000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 26, npk: '202504152', nama: 'Heru Prasetyo', jabatan: 'Finishing Produksi', divisi: 'DMB', cabang: 'Daan Mogot', tanggalMasuk: '2025-04-24', jenisKelamin: 'L', noHP: '', email: 'heruprasetyo@ruangprint.com', alamat: '', gajiPokok: 940000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'tidak' },
  { id: 27, npk: '202508177', nama: 'Abdul Rahman', jabatan: 'Finishing Produksi', divisi: 'DMB', cabang: 'Daan Mogot', tanggalMasuk: '2025-08-19', jenisKelamin: 'L', noHP: '08558526404', email: 'abdulrahman@ruangprint.com', alamat: '', gajiPokok: 940000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'tidak' },
  { id: 28, npk: '202509182', nama: 'Alfarizi Ismail', jabatan: 'Deskprint', divisi: 'DMB', cabang: 'Daan Mogot', tanggalMasuk: '2025-09-25', jenisKelamin: 'L', noHP: '089507531242', email: 'alfariziisma@ruangprint.com', alamat: '', gajiPokok: 1660000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'tidak' },
  { id: 29, npk: '202510184', nama: 'Budi Ismail', jabatan: 'Office boy', divisi: 'DMB', cabang: 'Daan Mogot', tanggalMasuk: '2025-10-23', jenisKelamin: 'L', noHP: '082114597165', email: 'budiismail@ruangprint.com', alamat: '', gajiPokok: 840000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'tidak' },
  { id: 30, npk: '202511198', nama: 'M Irhan Nazril', jabatan: 'Finishing Produksi', divisi: 'DMB', cabang: 'Daan Mogot', tanggalMasuk: '2025-05-11', jenisKelamin: 'L', noHP: '088221463231', email: 'mirhannazril@ruangprint.com', alamat: '', gajiPokok: 740000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'tidak' },
  { id: 31, npk: '202604199', nama: 'Aggustin Fitria Rahmawati', jabatan: 'Admin & Kasir', divisi: 'DMB', cabang: 'Daan Mogot', tanggalMasuk: '2025-11-17', jenisKelamin: 'P', noHP: '0895360476288', email: 'aggustinfitr@ruangprint.com', alamat: '', gajiPokok: 1540000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'tidak' },
  // ============ CTR ============
  { id: 32, npk: '201504001', nama: 'Suheri', jabatan: 'Kepala Cabang', divisi: 'CTR', cabang: 'Citra Raya', tanggalMasuk: '2015-04-04', jenisKelamin: 'L', noHP: '089630336674', email: 'suheri@ruangprint.com', alamat: '', gajiPokok: 5510000, tunjangan: 350000, uangMakan: 40000, bpjs: 70000, upahLembur: 7000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 33, npk: '202011021', nama: 'Bajari', jabatan: 'Operator Produksi', divisi: 'CTR', cabang: 'Citra Raya', tanggalMasuk: '2020-11-04', jenisKelamin: 'L', noHP: '087749413695', email: 'bajari@ruangprint.com', alamat: '', gajiPokok: 2990000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 6000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 34, npk: '202209065', nama: 'Hendri Sastra Wijaya', jabatan: 'Operator Produksi', divisi: 'CTR', cabang: 'Citra Raya', tanggalMasuk: '2022-09-19', jenisKelamin: 'L', noHP: '088268317604', email: 'hendrisastra@ruangprint.com', alamat: '', gajiPokok: 1800000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 35, npk: '202306093', nama: 'Cristina Susanti', jabatan: 'Admin & Kasir', divisi: 'CTR', cabang: 'Citra Raya', tanggalMasuk: '2023-06-22', jenisKelamin: 'P', noHP: '081295652671', email: 'cristinasusa@ruangprint.com', alamat: '', gajiPokok: 2370000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 6000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 36, npk: '202306095', nama: 'Candra Maulana', jabatan: 'Deskprint', divisi: 'CTR', cabang: 'Citra Raya', tanggalMasuk: '2023-06-23', jenisKelamin: 'L', noHP: '082112837868', email: 'candramaulan@ruangprint.com', alamat: '', gajiPokok: 2370000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 6000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 37, npk: '202306096', nama: 'Mochammad Prayogi Haristama', jabatan: 'Deskprint', divisi: 'CTR', cabang: 'Citra Raya', tanggalMasuk: '2023-06-19', jenisKelamin: 'L', noHP: '085785460630', email: 'mochammadpra@ruangprint.com', alamat: '', gajiPokok: 2370000, tunjangan: 100000, uangMakan: 40000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 38, npk: '202510193', nama: 'Raden Adnan Ahmadinejad', jabatan: 'Deskprint', divisi: 'CTR', cabang: 'Citra Raya', tanggalMasuk: '2025-10-27', jenisKelamin: 'L', noHP: '08571020068', email: 'radenadnanah@ruangprint.com', alamat: '', gajiPokok: 1540000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'tidak' },
  { id: 39, npk: '202511196', nama: 'Sunita Novitasari', jabatan: 'Admin & Kasir', divisi: 'CTR', cabang: 'Citra Raya', tanggalMasuk: '2025-11-03', jenisKelamin: 'P', noHP: '087789608273', email: 'sunitanovita@ruangprint.com', alamat: '', gajiPokok: 1740000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'tidak' },
  { id: 40, npk: '202604193', nama: 'Muhammad Zaki Maulana', jabatan: 'Finishing Produksi', divisi: 'CTR', cabang: 'Citra Raya', tanggalMasuk: '2026-04-10', jenisKelamin: 'L', noHP: '0882007050866', email: 'muhammadzaki@ruangprint.com', alamat: '', gajiPokok: 740000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'tidak' },
  { id: 41, npk: '202604197', nama: 'Aris Witono', jabatan: 'Finishing Produksi', divisi: 'CTR', cabang: 'Citra Raya', tanggalMasuk: '2026-04-21', jenisKelamin: 'L', noHP: '085641860609', email: 'ariswitono@ruangprint.com', alamat: '', gajiPokok: 740000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'tidak' },
  // ============ GDS ============
  { id: 42, npk: '202201045', nama: 'Dwi Kristin Natalia', jabatan: 'Kepala Cabang', divisi: 'GDS', cabang: 'Gading Serpong', tanggalMasuk: '2022-12-01', jenisKelamin: 'P', noHP: '083843895123', email: 'dwikristinna@ruangprint.com', alamat: '', gajiPokok: 4240000, tunjangan: 300000, uangMakan: 40000, bpjs: 50000, upahLembur: 7000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 43, npk: '202105032', nama: 'Ade Rizky', jabatan: 'Deskprint', divisi: 'GDS', cabang: 'Gading Serpong', tanggalMasuk: '2021-05-24', jenisKelamin: 'L', noHP: '082372526166', email: 'aderizky@ruangprint.com', alamat: '', gajiPokok: 2570000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 6000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 44, npk: '202209064', nama: 'Hendra Fernandes', jabatan: 'Operator A3', divisi: 'GDS', cabang: 'Gading Serpong', tanggalMasuk: '2022-09-19', jenisKelamin: 'L', noHP: '088276630118', email: 'hendrafernan@ruangprint.com', alamat: '', gajiPokok: 1870000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 6000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 45, npk: '202301081', nama: 'Bambang Irawan', jabatan: 'Kurir', divisi: 'GDS', cabang: 'Gading Serpong', tanggalMasuk: '2023-09-01', jenisKelamin: 'L', noHP: '083871750209', email: 'bambangirawa@ruangprint.com', alamat: '', gajiPokok: 2370000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 6000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 46, npk: '202312107', nama: 'Syarifudin', jabatan: 'Operator Produksi', divisi: 'GDS', cabang: 'Gading Serpong', tanggalMasuk: '2023-12-20', jenisKelamin: 'L', noHP: '', email: 'syarifudin@ruangprint.com', alamat: '', gajiPokok: 2990000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 6000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 47, npk: '202505155', nama: 'Harum Manda Rizki', jabatan: 'Admin & Kasir', divisi: 'GDS', cabang: 'Gading Serpong', tanggalMasuk: '2025-08-05', jenisKelamin: 'P', noHP: '083693015300', email: 'harummandari@ruangprint.com', alamat: '', gajiPokok: 2070000, tunjangan: 100000, uangMakan: 40000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 48, npk: '202508176', nama: 'Mukhamad Faisal', jabatan: 'Finishing', divisi: 'GDS', cabang: 'Gading Serpong', tanggalMasuk: '2025-08-19', jenisKelamin: 'L', noHP: '082319582288', email: 'mukhamadfais@ruangprint.com', alamat: '', gajiPokok: 890000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'tidak' },
  { id: 49, npk: '202510183', nama: 'Danang Firman Sasetyo', jabatan: 'Deskprint', divisi: 'GDS', cabang: 'Gading Serpong', tanggalMasuk: '2025-01-10', jenisKelamin: 'L', noHP: '082116552164', email: 'danangfirman@ruangprint.com', alamat: '', gajiPokok: 1540000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'tidak' },
  { id: 50, npk: '202511201', nama: 'Yusuf Ilham', jabatan: 'Deskprint', divisi: 'GDS', cabang: 'Gading Serpong', tanggalMasuk: '2025-11-24', jenisKelamin: 'L', noHP: '0895418237568', email: 'yusufilham@ruangprint.com', alamat: '', gajiPokok: 1740000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'tidak' },
  { id: 51, npk: '202604200', nama: 'Maulana Ayub Wahyudin', jabatan: 'Deskprint', divisi: 'GDS', cabang: 'Gading Serpong', tanggalMasuk: '2026-04-15', jenisKelamin: 'L', noHP: '081369038280', email: 'maulanaayubw@ruangprint.com', alamat: '', gajiPokok: 1540000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'tidak' },
  // ============ CGK ============
  { id: 52, npk: 'CGK052X', nama: 'Adi Burhan', jabatan: 'Kepala Cabang', divisi: 'CGK', cabang: 'Cengkareng', tanggalMasuk: '2022-01-09', jenisKelamin: 'L', noHP: '', email: 'adiburhan@ruangprint.com', alamat: '', gajiPokok: 10800000, tunjangan: 1500000, uangMakan: 40000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 53, npk: '202102026', nama: 'Ardia Risti Arini', jabatan: 'Admin & Kasir', divisi: 'CGK', cabang: 'Cengkareng', tanggalMasuk: '2026-02-02', jenisKelamin: 'P', noHP: '081411005489', email: 'ardiaristiar@ruangprint.com', alamat: '', gajiPokok: 2880000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'tidak' },
  { id: 54, npk: '202209060', nama: 'Muhamad Surahman', jabatan: 'Operator Produksi', divisi: 'CGK', cabang: 'Cengkareng', tanggalMasuk: '2022-01-09', jenisKelamin: 'L', noHP: '', email: 'muhamadsurah@ruangprint.com', alamat: '', gajiPokok: 2170000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 6000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 55, npk: '202209061', nama: 'Angga Rohmat', jabatan: 'Deskprint', divisi: 'CGK', cabang: 'Cengkareng', tanggalMasuk: '2022-01-09', jenisKelamin: 'L', noHP: '', email: 'anggarohmat@ruangprint.com', alamat: '', gajiPokok: 2570000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 6000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 56, npk: '202209062', nama: 'Fadli Saputra', jabatan: 'Kurir', divisi: 'CGK', cabang: 'Cengkareng', tanggalMasuk: '2022-01-09', jenisKelamin: 'L', noHP: '', email: 'fadlisaputra@ruangprint.com', alamat: '', gajiPokok: 2370000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 6000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 57, npk: '202306094', nama: 'Sutisna', jabatan: 'Operator Produksi', divisi: 'CGK', cabang: 'Cengkareng', tanggalMasuk: '2023-06-20', jenisKelamin: 'L', noHP: '', email: 'sutisna@ruangprint.com', alamat: '', gajiPokok: 1660000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 6000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 58, npk: '202407128', nama: 'Winda Lisnawati', jabatan: 'Deskprint', divisi: 'CGK', cabang: 'Cengkareng', tanggalMasuk: '2024-01-07', jenisKelamin: 'P', noHP: '085720894173', email: 'windalisnawa@ruangprint.com', alamat: '', gajiPokok: 1970000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 59, npk: '202501146', nama: 'Annisa Dwi Rahmawati', jabatan: 'Admin & Kasir', divisi: 'CGK', cabang: 'Cengkareng', tanggalMasuk: '2024-01-07', jenisKelamin: 'P', noHP: '085892819550', email: 'annisadwirah@ruangprint.com', alamat: '', gajiPokok: 1870000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 60, npk: '202501147', nama: 'M Nurul Adrian', jabatan: 'Finishing', divisi: 'CGK', cabang: 'Cengkareng', tanggalMasuk: '2025-10-06', jenisKelamin: 'L', noHP: '082298122526', email: 'mnuruladrian@ruangprint.com', alamat: '', gajiPokok: 940000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'tidak' },
  { id: 61, npk: '202506161', nama: 'Carvent Reinhart Setiawan', jabatan: 'Deskprint', divisi: 'CGK', cabang: 'Cengkareng', tanggalMasuk: '2025-04-07', jenisKelamin: 'L', noHP: '081316467714', email: 'carventreinh@ruangprint.com', alamat: '', gajiPokok: 1660000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'tidak' },
  { id: 62, npk: '202506166', nama: 'Faqih Turahman', jabatan: 'Finishing', divisi: 'CGK', cabang: 'Cengkareng', tanggalMasuk: '2026-02-02', jenisKelamin: 'L', noHP: '083187792335', email: 'faqihturahma@ruangprint.com', alamat: '', gajiPokok: 740000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'tidak' },
  { id: 63, npk: '202506169', nama: 'Yosa', jabatan: 'Produksi Bengkel', divisi: 'CGK', cabang: 'Cengkareng', tanggalMasuk: '2023-01-05', jenisKelamin: 'L', noHP: '', email: 'yosa@ruangprint.com', alamat: '', gajiPokok: 3720000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 7000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'tidak' },
  { id: 64, npk: '202507171', nama: 'M Rifki Alfarizi', jabatan: 'Supir Mobil Bengkel', divisi: 'CGK', cabang: 'Cengkareng', tanggalMasuk: '2025-06-27', jenisKelamin: 'L', noHP: '088211595580', email: 'mrifkialfari@ruangprint.com', alamat: '', gajiPokok: 1970000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'tidak' },
  { id: 65, npk: '202507173', nama: 'Sabda Christianadi', jabatan: 'Operator Produksi & Design', divisi: 'CGK', cabang: 'Cengkareng', tanggalMasuk: '2025-07-28', jenisKelamin: 'L', noHP: '088229777060', email: 'sabdachristi@ruangprint.com', alamat: '', gajiPokok: 1970000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'tidak' },
  { id: 66, npk: '202510191', nama: 'Eman Sulaeman', jabatan: 'Produksi Bengkel', divisi: 'CGK', cabang: 'Cengkareng', tanggalMasuk: '2025-01-11', jenisKelamin: 'L', noHP: '', email: 'emansulaeman@ruangprint.com', alamat: '', gajiPokok: 2040000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'tidak' },
  { id: 67, npk: '202502192', nama: 'Wawan Wahyudi', jabatan: 'Produksi Bengkel', divisi: 'CGK', cabang: 'Cengkareng', tanggalMasuk: '2026-02-18', jenisKelamin: 'L', noHP: '089531918560', email: 'wawanwahyudi@ruangprint.com', alamat: '', gajiPokok: 2040000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'tidak' },
  // ============ BKS ============
  { id: 68, npk: '201805004', nama: 'Ronaldi Mbanimara', jabatan: 'Kepala Cabang', divisi: 'BKS', cabang: 'Bekasi', tanggalMasuk: '2018-05-14', jenisKelamin: 'L', noHP: '082247870883', email: 'ronaldimbani@ruangprint.com', alamat: '', gajiPokok: 3720000, tunjangan: 250000, uangMakan: 40000, bpjs: 48000, upahLembur: 6000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 69, npk: '202211075', nama: 'Iip Aji Nurli', jabatan: 'Operator Produksi', divisi: 'BKS', cabang: 'Bekasi', tanggalMasuk: '2022-11-14', jenisKelamin: 'L', noHP: '082115930349', email: 'iipajinurli@ruangprint.com', alamat: '', gajiPokok: 1970000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 6000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 70, npk: '202510186', nama: 'Rinar Tabana', jabatan: 'Operator Produksi', divisi: 'BKS', cabang: 'Bekasi', tanggalMasuk: '2025-10-20', jenisKelamin: 'L', noHP: '081280040037', email: 'rinartabana@ruangprint.com', alamat: '', gajiPokok: 1540000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'tidak' },
  { id: 71, npk: '202510187', nama: 'Zakiyah Salsabila Ramadani', jabatan: 'Admin & Kasir', divisi: 'BKS', cabang: 'Bekasi', tanggalMasuk: '2025-10-20', jenisKelamin: 'P', noHP: '089519282455', email: 'zakiyahsalsa@ruangprint.com', alamat: '', gajiPokok: 1540000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'tidak' },
  { id: 72, npk: '202510188', nama: 'Dewi Pratiwi Sasmito', jabatan: 'Deskprint', divisi: 'BKS', cabang: 'Bekasi', tanggalMasuk: '2025-10-20', jenisKelamin: 'P', noHP: '085340273015', email: 'dewipratiwis@ruangprint.com', alamat: '', gajiPokok: 1540000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'tidak' },
  { id: 73, npk: '202510189', nama: 'Muhammad Alif Putra Karyana', jabatan: 'Deskprint', divisi: 'BKS', cabang: 'Bekasi', tanggalMasuk: '2025-10-20', jenisKelamin: 'L', noHP: '085880548742', email: 'muhammadalif@ruangprint.com', alamat: '', gajiPokok: 1540000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'tidak' },
  { id: 74, npk: '202510192', nama: 'Achmad Wasdani', jabatan: 'Finishing', divisi: 'BKS', cabang: 'Bekasi', tanggalMasuk: '2025-10-20', jenisKelamin: 'L', noHP: '08965083152', email: 'achmadwasdan@ruangprint.com', alamat: '', gajiPokok: 740000, tunjangan: 0, uangMakan: 40000, bpjs: 0, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'tidak' },
];

export const getCabangList = (): { kode: string; nama: string }[] => {
  try {
    const custom = localStorage.getItem(CUSTOM_CABANG_KEY);
    const customList = custom ? JSON.parse(custom) : [];
    return [...baseCabang, ...customList];
  } catch {
    return baseCabang;
  }
};

export const getCabangKodeList = (): string[] => {
  return getCabangList().map(c => c.kode);
};

export const addCabang = (kode: string, nama: string): boolean => {
  const cleanKode = kode.trim().toUpperCase();
  const cleanNama = nama.trim();
  if (!cleanKode || !cleanNama) return false;
  const all = getCabangList();
  if (all.find(c => c.kode === cleanKode)) return false; // sudah ada
  try {
    const custom = localStorage.getItem(CUSTOM_CABANG_KEY);
    const list = custom ? JSON.parse(custom) : [];
    list.push({ kode: cleanKode, nama: cleanNama });
    localStorage.setItem(CUSTOM_CABANG_KEY, JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
};

export const getDivisiNama = (kode: string): string => {
  const found = getCabangList().find(c => c.kode === kode);
  return found ? found.nama : kode;
};

export const jabatanList = [
  'Admin & Kasir',
  'Customer Service',
  'Deskprint',
  'Driver',
  'FA',
  'Finishing',
  'Finishing Produksi',
  'HR',
  'IT Support',
  'Kasir & Admin',
  'Kepala Cabang',
  'Kepala HRD',
  'Koordinator Finishing',
  'Kurir',
  'Manager Keuangan',
  'Markom',
  'Operator A3',
  'Operator Print',
  'Operator Print Senior',
  'Operator Produksi',
  'Operator Produksi & Design',
  'Produksi Bengkel',
  'Purchasing',
  'Receptionist',
  'SPV Frontline',
  'Staff Admin',
  'Staff Administrasi',
  'Staff FA',
  'Staff Finishing',
  'Staff Gudang',
  'Staff HR',
  'Staff HRD',
  'Staff Keuangan',
  'Staff Marketing',
  'Staff Markom',
  'Staff Operasional',
  'Staff Purchasing',
  'Staff Quality',
  'Supervisor',
  'Supir Mobil',
  'Supir Mobil Bengkel',
];

