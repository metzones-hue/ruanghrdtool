import type { Karyawan, Pengaturan } from '@/types';

export const defaultPengaturan: Pengaturan = {
  upahLembur: 5000,
  upahLemburShift2: 7000,
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
  jamKeluarShift1: '17:30',
  jamKeluarShift2: '21:00',
  thresholdShift2: '10:30',
  lokasiHO: ['HO'],
  password: 'aHJkMTIz',
  passwordKepala: 'a2VwYWxhNDU2',
};

export const initialKaryawan: Karyawan[] = [
  // ============ HO ============
  { id: 1, npk: 'HO001', nama: 'Ahmad Fauzi', jabatan: 'Staff Administrasi', divisi: 'HO', cabang: 'Head Office', tanggalMasuk: '2023-01-15', jenisKelamin: 'L', noHP: '081234567001', email: 'ahmad@ruangprint.com', alamat: 'Jl. Merdeka No.1', gajiPokok: 4500000, tunjangan: 500000, uangMakan: 45000, bpjs: 135000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'bulanan', punyaCuti: 'ya' },
  { id: 2, npk: 'HO002', nama: 'Siti Aminah', jabatan: 'Staff Keuangan', divisi: 'HO', cabang: 'Head Office', tanggalMasuk: '2023-02-01', jenisKelamin: 'P', noHP: '081234567002', email: 'siti@ruangprint.com', alamat: 'Jl. Merdeka No.2', gajiPokok: 5000000, tunjangan: 600000, uangMakan: 45000, bpjs: 150000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'bulanan', punyaCuti: 'ya' },
  { id: 3, npk: 'HO003', nama: 'Budi Santoso', jabatan: 'Supervisor', divisi: 'HO', cabang: 'Head Office', tanggalMasuk: '2022-06-01', jenisKelamin: 'L', noHP: '081234567003', email: 'budi@ruangprint.com', alamat: 'Jl. Merdeka No.3', gajiPokok: 6500000, tunjangan: 800000, uangMakan: 45000, bpjs: 195000, upahLembur: 6000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'bulanan', punyaCuti: 'ya' },
  { id: 4, npk: 'HO004', nama: 'Dewi Kusuma', jabatan: 'Staff HRD', divisi: 'HO', cabang: 'Head Office', tanggalMasuk: '2023-03-15', jenisKelamin: 'P', noHP: '081234567004', email: 'dewi@ruangprint.com', alamat: 'Jl. Merdeka No.4', gajiPokok: 4800000, tunjangan: 550000, uangMakan: 45000, bpjs: 144000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'bulanan', punyaCuti: 'ya' },
  { id: 5, npk: 'HO005', nama: 'Eko Prasetyo', jabatan: 'IT Support', divisi: 'HO', cabang: 'Head Office', tanggalMasuk: '2023-06-01', jenisKelamin: 'L', noHP: '081234567005', email: 'eko@ruangprint.com', alamat: 'Jl. Merdeka No.5', gajiPokok: 5200000, tunjangan: 600000, uangMakan: 45000, bpjs: 156000, upahLembur: 6000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'bulanan', punyaCuti: 'ya' },
  { id: 6, npk: 'HO006', nama: 'Rina Wulandari', jabatan: 'Staff Marketing', divisi: 'HO', cabang: 'Head Office', tanggalMasuk: '2023-04-01', jenisKelamin: 'P', noHP: '081234567006', email: 'rina@ruangprint.com', alamat: 'Jl. Merdeka No.6', gajiPokok: 4600000, tunjangan: 500000, uangMakan: 45000, bpjs: 138000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'bulanan', punyaCuti: 'ya' },
  { id: 7, npk: 'HO007', nama: 'Fajar Hidayat', jabatan: 'Driver', divisi: 'HO', cabang: 'Head Office', tanggalMasuk: '2023-01-01', jenisKelamin: 'L', noHP: '081234567007', email: 'fajar@ruangprint.com', alamat: 'Jl. Merdeka No.7', gajiPokok: 4000000, tunjangan: 400000, uangMakan: 45000, bpjs: 120000, upahLembur: 5000, lemburMalamAktif: 'tidak', shift: 1, status: 'Aktif', umMode: 'bulanan', punyaCuti: 'ya' },
  { id: 8, npk: 'HO008', nama: 'Lestari Putri', jabatan: 'Staff Operasional', divisi: 'HO', cabang: 'Head Office', tanggalMasuk: '2023-07-01', jenisKelamin: 'P', noHP: '081234567008', email: 'lestari@ruangprint.com', alamat: 'Jl. Merdeka No.8', gajiPokok: 4300000, tunjangan: 450000, uangMakan: 45000, bpjs: 129000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'bulanan', punyaCuti: 'ya' },
  { id: 9, npk: 'HO009', nama: 'Gilang Ramadhan', jabatan: 'Staff Gudang HO', divisi: 'HO', cabang: 'Head Office', tanggalMasuk: '2023-05-15', jenisKelamin: 'L', noHP: '081234567009', email: 'gilang@ruangprint.com', alamat: 'Jl. Merdeka No.9', gajiPokok: 4200000, tunjangan: 450000, uangMakan: 45000, bpjs: 126000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'bulanan', punyaCuti: 'ya' },
  { id: 10, npk: 'HO010', nama: 'Maya Sari', jabatan: 'Receptionist', divisi: 'HO', cabang: 'Head Office', tanggalMasuk: '2023-08-01', jenisKelamin: 'P', noHP: '081234567010', email: 'maya@ruangprint.com', alamat: 'Jl. Merdeka No.10', gajiPokok: 4000000, tunjangan: 400000, uangMakan: 45000, bpjs: 120000, upahLembur: 5000, lemburMalamAktif: 'tidak', shift: 1, status: 'Aktif', umMode: 'bulanan', punyaCuti: 'ya' },
  { id: 11, npk: 'HO011', nama: 'Hendra Wijaya', jabatan: 'Kepala HRD', divisi: 'HO', cabang: 'Head Office', tanggalMasuk: '2022-01-01', jenisKelamin: 'L', noHP: '081234567011', email: 'hendra@ruangprint.com', alamat: 'Jl. Merdeka No.11', gajiPokok: 8500000, tunjangan: 1000000, uangMakan: 45000, bpjs: 255000, upahLembur: 7000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'bulanan', punyaCuti: 'ya' },
  { id: 12, npk: 'HO012', nama: 'Nina Astuti', jabatan: 'Manager Keuangan', divisi: 'HO', cabang: 'Head Office', tanggalMasuk: '2022-03-01', jenisKelamin: 'P', noHP: '081234567012', email: 'nina@ruangprint.com', alamat: 'Jl. Merdeka No.12', gajiPokok: 9000000, tunjangan: 1200000, uangMakan: 45000, bpjs: 270000, upahLembur: 7000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'bulanan', punyaCuti: 'ya' },
  // ============ DMB ============
  { id: 13, npk: 'DMB01', nama: 'Agus Supriyadi', jabatan: 'Kepala Cabang DMB', divisi: 'DMB', cabang: 'Dramaga Bogor', tanggalMasuk: '2022-04-01', jenisKelamin: 'L', noHP: '081234568001', email: 'agus@ruangprint.com', alamat: 'Jl. Dramaga No.1', gajiPokok: 7000000, tunjangan: 800000, uangMakan: 40000, bpjs: 210000, upahLembur: 6000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 14, npk: 'DMB02', nama: 'Tuti Handayani', jabatan: 'Staff Admin DMB', divisi: 'DMB', cabang: 'Dramaga Bogor', tanggalMasuk: '2023-02-15', jenisKelamin: 'P', noHP: '081234568002', email: 'tuti@ruangprint.com', alamat: 'Jl. Dramaga No.2', gajiPokok: 4300000, tunjangan: 450000, uangMakan: 40000, bpjs: 129000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 15, npk: 'DMB03', nama: 'Suparman', jabatan: 'Operator Print', divisi: 'DMB', cabang: 'Dramaga Bogor', tanggalMasuk: '2023-03-01', jenisKelamin: 'L', noHP: '081234568003', email: 'suparman@ruangprint.com', alamat: 'Jl. Dramaga No.3', gajiPokok: 4000000, tunjangan: 400000, uangMakan: 40000, bpjs: 120000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 2, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 16, npk: 'DMB04', nama: 'Yuli Astuti', jabatan: 'Operator Print', divisi: 'DMB', cabang: 'Dramaga Bogor', tanggalMasuk: '2023-04-01', jenisKelamin: 'P', noHP: '081234568004', email: 'yuli@ruangprint.com', alamat: 'Jl. Dramaga No.4', gajiPokok: 4000000, tunjangan: 400000, uangMakan: 40000, bpjs: 120000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 2, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 17, npk: 'DMB05', nama: 'Dedi Kurniawan', jabatan: 'Kurir', divisi: 'DMB', cabang: 'Dramaga Bogor', tanggalMasuk: '2023-05-01', jenisKelamin: 'L', noHP: '081234568005', email: 'dedi@ruangprint.com', alamat: 'Jl. Dramaga No.5', gajiPokok: 3800000, tunjangan: 350000, uangMakan: 40000, bpjs: 114000, upahLembur: 5000, lemburMalamAktif: 'tidak', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 18, npk: 'DMB06', nama: 'Sri Rejeki', jabatan: 'Staff Finishing', divisi: 'DMB', cabang: 'Dramaga Bogor', tanggalMasuk: '2023-06-01', jenisKelamin: 'P', noHP: '081234568006', email: 'sri@ruangprint.com', alamat: 'Jl. Dramaga No.6', gajiPokok: 3900000, tunjangan: 380000, uangMakan: 40000, bpjs: 117000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 19, npk: 'DMB07', nama: 'Iwan Setiawan', jabatan: 'Operator Print', divisi: 'DMB', cabang: 'Dramaga Bogor', tanggalMasuk: '2023-07-01', jenisKelamin: 'L', noHP: '081234568007', email: 'iwan@ruangprint.com', alamat: 'Jl. Dramaga No.7', gajiPokok: 4000000, tunjangan: 400000, uangMakan: 40000, bpjs: 120000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 2, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 20, npk: 'DMB08', nama: 'Ratna Dewi', jabatan: 'Staff Admin', divisi: 'DMB', cabang: 'Dramaga Bogor', tanggalMasuk: '2023-08-01', jenisKelamin: 'P', noHP: '081234568008', email: 'ratna@ruangprint.com', alamat: 'Jl. Dramaga No.8', gajiPokok: 4300000, tunjangan: 450000, uangMakan: 40000, bpjs: 129000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 21, npk: 'DMB09', nama: 'Acep Sumarna', jabatan: 'Kurir', divisi: 'DMB', cabang: 'Dramaga Bogor', tanggalMasuk: '2023-09-01', jenisKelamin: 'L', noHP: '081234568009', email: 'acep@ruangprint.com', alamat: 'Jl. Dramaga No.9', gajiPokok: 3800000, tunjangan: 350000, uangMakan: 40000, bpjs: 114000, upahLembur: 5000, lemburMalamAktif: 'tidak', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 22, npk: 'DMB10', nama: 'Nunung Suryani', jabatan: 'Staff Finishing', divisi: 'DMB', cabang: 'Dramaga Bogor', tanggalMasuk: '2023-10-01', jenisKelamin: 'P', noHP: '081234568010', email: 'nunung@ruangprint.com', alamat: 'Jl. Dramaga No.10', gajiPokok: 3900000, tunjangan: 380000, uangMakan: 40000, bpjs: 117000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 23, npk: 'DMB11', nama: 'Jajang Nurjaman', jabatan: 'Operator Print Senior', divisi: 'DMB', cabang: 'Dramaga Bogor', tanggalMasuk: '2022-07-01', jenisKelamin: 'L', noHP: '081234568011', email: 'jajang@ruangprint.com', alamat: 'Jl. Dramaga No.11', gajiPokok: 4800000, tunjangan: 500000, uangMakan: 40000, bpjs: 144000, upahLembur: 6000, lemburMalamAktif: 'ya', shift: 2, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 24, npk: 'DMB12', nama: 'Eni Rohaeni', jabatan: 'Staff Quality', divisi: 'DMB', cabang: 'Dramaga Bogor', tanggalMasuk: '2023-11-01', jenisKelamin: 'P', noHP: '081234568012', email: 'eni@ruangprint.com', alamat: 'Jl. Dramaga No.12', gajiPokok: 4100000, tunjangan: 400000, uangMakan: 40000, bpjs: 123000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  // ============ CTR ============
  { id: 25, npk: 'CTR01', nama: 'Suheri', jabatan: 'Kepala Cabang CTR', divisi: 'CTR', cabang: 'Citeureup', tanggalMasuk: '2022-05-01', jenisKelamin: 'L', noHP: '081234569001', email: 'suheri@ruangprint.com', alamat: 'Jl. Citeureup No.1', gajiPokok: 7200000, tunjangan: 850000, uangMakan: 40000, bpjs: 216000, upahLembur: 6000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 26, npk: 'CTR02', nama: 'Bajari', jabatan: 'Staff Admin CTR', divisi: 'CTR', cabang: 'Citeureup', tanggalMasuk: '2023-01-15', jenisKelamin: 'L', noHP: '081234569002', email: 'bajari@ruangprint.com', alamat: 'Jl. Citeureup No.2', gajiPokok: 4500000, tunjangan: 500000, uangMakan: 40000, bpjs: 135000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 27, npk: 'CTR03', nama: 'Maman Sudrajat', jabatan: 'Operator Print', divisi: 'CTR', cabang: 'Citeureup', tanggalMasuk: '2023-03-01', jenisKelamin: 'L', noHP: '081234569003', email: 'maman@ruangprint.com', alamat: 'Jl. Citeureup No.3', gajiPokok: 4100000, tunjangan: 420000, uangMakan: 40000, bpjs: 123000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 2, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 28, npk: 'CTR04', nama: 'Siti Rodiah', jabatan: 'Operator Print', divisi: 'CTR', cabang: 'Citeureup', tanggalMasuk: '2023-04-01', jenisKelamin: 'P', noHP: '081234569004', email: 'rodiah@ruangprint.com', alamat: 'Jl. Citeureup No.4', gajiPokok: 4100000, tunjangan: 420000, uangMakan: 40000, bpjs: 123000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 2, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 29, npk: 'CTR05', nama: 'Ahmad Tohari', jabatan: 'Kurir', divisi: 'CTR', cabang: 'Citeureup', tanggalMasuk: '2023-05-01', jenisKelamin: 'L', noHP: '081234569005', email: 'tohari@ruangprint.com', alamat: 'Jl. Citeureup No.5', gajiPokok: 3900000, tunjangan: 380000, uangMakan: 40000, bpjs: 117000, upahLembur: 5000, lemburMalamAktif: 'tidak', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 30, npk: 'CTR06', nama: 'Neneng Siti', jabatan: 'Staff Finishing', divisi: 'CTR', cabang: 'Citeureup', tanggalMasuk: '2023-06-01', jenisKelamin: 'P', noHP: '081234569006', email: 'neneng@ruangprint.com', alamat: 'Jl. Citeureup No.6', gajiPokok: 4000000, tunjangan: 400000, uangMakan: 40000, bpjs: 120000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 31, npk: 'CTR07', nama: 'Dadang Hermawan', jabatan: 'Operator Print', divisi: 'CTR', cabang: 'Citeureup', tanggalMasuk: '2023-07-01', jenisKelamin: 'L', noHP: '081234569007', email: 'dadang@ruangprint.com', alamat: 'Jl. Citeureup No.7', gajiPokok: 4100000, tunjangan: 420000, uangMakan: 40000, bpjs: 123000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 2, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 32, npk: 'CTR08', nama: 'Yayah Nurhasanah', jabatan: 'Staff Admin', divisi: 'CTR', cabang: 'Citeureup', tanggalMasuk: '2023-08-01', jenisKelamin: 'P', noHP: '081234569008', email: 'yayah@ruangprint.com', alamat: 'Jl. Citeureup No.8', gajiPokok: 4500000, tunjangan: 500000, uangMakan: 40000, bpjs: 135000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 33, npk: 'CTR09', nama: 'Otong Suratman', jabatan: 'Kurir', divisi: 'CTR', cabang: 'Citeureup', tanggalMasuk: '2023-09-01', jenisKelamin: 'L', noHP: '081234569009', email: 'otong@ruangprint.com', alamat: 'Jl. Citeureup No.9', gajiPokok: 3900000, tunjangan: 380000, uangMakan: 40000, bpjs: 117000, upahLembur: 5000, lemburMalamAktif: 'tidak', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 34, npk: 'CTR10', nama: 'Imas Masripah', jabatan: 'Staff Finishing', divisi: 'CTR', cabang: 'Citeureup', tanggalMasuk: '2023-10-01', jenisKelamin: 'P', noHP: '081234569010', email: 'imas@ruangprint.com', alamat: 'Jl. Citeureup No.10', gajiPokok: 4000000, tunjangan: 400000, uangMakan: 40000, bpjs: 120000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 35, npk: 'CTR11', nama: 'Enceng Kuswara', jabatan: 'Operator Print Senior', divisi: 'CTR', cabang: 'Citeureup', tanggalMasuk: '2022-08-01', jenisKelamin: 'L', noHP: '081234569011', email: 'enceng@ruangprint.com', alamat: 'Jl. Citeureup No.11', gajiPokok: 5000000, tunjangan: 550000, uangMakan: 40000, bpjs: 150000, upahLembur: 6000, lemburMalamAktif: 'ya', shift: 2, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 36, npk: 'CTR12', nama: 'Ade Rohayati', jabatan: 'Staff Quality', divisi: 'CTR', cabang: 'Citeureup', tanggalMasuk: '2023-11-01', jenisKelamin: 'P', noHP: '081234569012', email: 'ade@ruangprint.com', alamat: 'Jl. Citeureup No.12', gajiPokok: 4200000, tunjangan: 420000, uangMakan: 40000, bpjs: 126000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  // ============ GDS ============
  { id: 37, npk: 'GDS01', nama: 'Ujang Saepudin', jabatan: 'Kepala Cabang GDS', divisi: 'GDS', cabang: 'Gedung Surapati', tanggalMasuk: '2022-06-01', jenisKelamin: 'L', noHP: '081234570001', email: 'ujang@ruangprint.com', alamat: 'Jl. Surapati No.1', gajiPokok: 7000000, tunjangan: 800000, uangMakan: 40000, bpjs: 210000, upahLembur: 6000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 38, npk: 'GDS02', nama: 'Etty Sulastri', jabatan: 'Staff Admin GDS', divisi: 'GDS', cabang: 'Gedung Surapati', tanggalMasuk: '2023-02-15', jenisKelamin: 'P', noHP: '081234570002', email: 'etty@ruangprint.com', alamat: 'Jl. Surapati No.2', gajiPokok: 4400000, tunjangan: 480000, uangMakan: 40000, bpjs: 132000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 39, npk: 'GDS03', nama: 'Asep Dedi', jabatan: 'Operator Print', divisi: 'GDS', cabang: 'Gedung Surapati', tanggalMasuk: '2023-03-01', jenisKelamin: 'L', noHP: '081234570003', email: 'asep@ruangprint.com', alamat: 'Jl. Surapati No.3', gajiPokok: 4100000, tunjangan: 420000, uangMakan: 40000, bpjs: 123000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 2, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 40, npk: 'GDS04', nama: 'Tati Sumiati', jabatan: 'Operator Print', divisi: 'GDS', cabang: 'Gedung Surapati', tanggalMasuk: '2023-04-01', jenisKelamin: 'P', noHP: '081234570004', email: 'tati@ruangprint.com', alamat: 'Jl. Surapati No.4', gajiPokok: 4100000, tunjangan: 420000, uangMakan: 40000, bpjs: 123000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 2, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 41, npk: 'GDS05', nama: 'Eman Sulaeman', jabatan: 'Kurir', divisi: 'GDS', cabang: 'Gedung Surapati', tanggalMasuk: '2023-05-01', jenisKelamin: 'L', noHP: '081234570005', email: 'eman@ruangprint.com', alamat: 'Jl. Surapati No.5', gajiPokok: 3900000, tunjangan: 380000, uangMakan: 40000, bpjs: 117000, upahLembur: 5000, lemburMalamAktif: 'tidak', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 42, npk: 'GDS06', nama: 'Iis Istiqomah', jabatan: 'Staff Finishing', divisi: 'GDS', cabang: 'Gedung Surapati', tanggalMasuk: '2023-06-01', jenisKelamin: 'P', noHP: '081234570006', email: 'iis@ruangprint.com', alamat: 'Jl. Surapati No.6', gajiPokok: 4000000, tunjangan: 400000, uangMakan: 40000, bpjs: 120000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 43, npk: 'GDS07', nama: 'Cepi Supriadi', jabatan: 'Operator Print', divisi: 'GDS', cabang: 'Gedung Surapati', tanggalMasuk: '2023-07-01', jenisKelamin: 'L', noHP: '081234570007', email: 'cepi@ruangprint.com', alamat: 'Jl. Surapati No.7', gajiPokok: 4100000, tunjangan: 420000, uangMakan: 40000, bpjs: 123000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 2, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 44, npk: 'GDS08', nama: 'Yeni Rukmini', jabatan: 'Staff Admin', divisi: 'GDS', cabang: 'Gedung Surapati', tanggalMasuk: '2023-08-01', jenisKelamin: 'P', noHP: '081234570008', email: 'yeni@ruangprint.com', alamat: 'Jl. Surapati No.8', gajiPokok: 4400000, tunjangan: 480000, uangMakan: 40000, bpjs: 132000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 45, npk: 'GDS09', nama: 'Dede Sunandar', jabatan: 'Kurir', divisi: 'GDS', cabang: 'Gedung Surapati', tanggalMasuk: '2023-09-01', jenisKelamin: 'L', noHP: '081234570009', email: 'dede@ruangprint.com', alamat: 'Jl. Surapati No.9', gajiPokok: 3900000, tunjangan: 380000, uangMakan: 40000, bpjs: 117000, upahLembur: 5000, lemburMalamAktif: 'tidak', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 46, npk: 'GDS10', nama: 'Mimin Sumarni', jabatan: 'Staff Finishing', divisi: 'GDS', cabang: 'Gedung Surapati', tanggalMasuk: '2023-10-01', jenisKelamin: 'P', noHP: '081234570010', email: 'mimin@ruangprint.com', alamat: 'Jl. Surapati No.10', gajiPokok: 4000000, tunjangan: 400000, uangMakan: 40000, bpjs: 120000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 47, npk: 'GDS11', nama: 'Kosim Halim', jabatan: 'Operator Print Senior', divisi: 'GDS', cabang: 'Gedung Surapati', tanggalMasuk: '2022-09-01', jenisKelamin: 'L', noHP: '081234570011', email: 'kosim@ruangprint.com', alamat: 'Jl. Surapati No.11', gajiPokok: 5000000, tunjangan: 550000, uangMakan: 40000, bpjs: 150000, upahLembur: 6000, lemburMalamAktif: 'ya', shift: 2, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 48, npk: 'GDS12', nama: 'Idah Sariyah', jabatan: 'Staff Quality', divisi: 'GDS', cabang: 'Gedung Surapati', tanggalMasuk: '2023-11-01', jenisKelamin: 'P', noHP: '081234570012', email: 'idah@ruangprint.com', alamat: 'Jl. Surapati No.12', gajiPokok: 4200000, tunjangan: 420000, uangMakan: 40000, bpjs: 126000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  // ============ BKS ============
  { id: 49, npk: 'BKS01', nama: 'Rudi Hartono', jabatan: 'Kepala Cabang BKS', divisi: 'BKS', cabang: 'Bekasi', tanggalMasuk: '2022-07-01', jenisKelamin: 'L', noHP: '081234571001', email: 'rudi@ruangprint.com', alamat: 'Jl. Bekasi No.1', gajiPokok: 7000000, tunjangan: 800000, uangMakan: 40000, bpjs: 210000, upahLembur: 6000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 50, npk: 'BKS02', nama: 'Lina Kusumawati', jabatan: 'Staff Admin BKS', divisi: 'BKS', cabang: 'Bekasi', tanggalMasuk: '2023-02-15', jenisKelamin: 'P', noHP: '081234571002', email: 'lina@ruangprint.com', alamat: 'Jl. Bekasi No.2', gajiPokok: 4400000, tunjangan: 480000, uangMakan: 40000, bpjs: 132000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 51, npk: 'BKS03', nama: 'Beni Sutanto', jabatan: 'Operator Print', divisi: 'BKS', cabang: 'Bekasi', tanggalMasuk: '2023-03-01', jenisKelamin: 'L', noHP: '081234571003', email: 'beni@ruangprint.com', alamat: 'Jl. Bekasi No.3', gajiPokok: 4100000, tunjangan: 420000, uangMakan: 40000, bpjs: 123000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 2, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 52, npk: 'BKS04', nama: 'Rina Marlina', jabatan: 'Operator Print', divisi: 'BKS', cabang: 'Bekasi', tanggalMasuk: '2023-04-01', jenisKelamin: 'P', noHP: '081234571004', email: 'marlina@ruangprint.com', alamat: 'Jl. Bekasi No.4', gajiPokok: 4100000, tunjangan: 420000, uangMakan: 40000, bpjs: 123000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 2, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 53, npk: 'BKS05', nama: 'Doni Kurniawan', jabatan: 'Kurir', divisi: 'BKS', cabang: 'Bekasi', tanggalMasuk: '2023-05-01', jenisKelamin: 'L', noHP: '081234571005', email: 'doni@ruangprint.com', alamat: 'Jl. Bekasi No.5', gajiPokok: 3900000, tunjangan: 380000, uangMakan: 40000, bpjs: 117000, upahLembur: 5000, lemburMalamAktif: 'tidak', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 54, npk: 'BKS06', nama: 'Sari Indah', jabatan: 'Staff Finishing', divisi: 'BKS', cabang: 'Bekasi', tanggalMasuk: '2023-06-01', jenisKelamin: 'P', noHP: '081234571006', email: 'sari@ruangprint.com', alamat: 'Jl. Bekasi No.6', gajiPokok: 4000000, tunjangan: 400000, uangMakan: 40000, bpjs: 120000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 55, npk: 'BKS07', nama: 'Ferdy Ahmad', jabatan: 'Operator Print', divisi: 'BKS', cabang: 'Bekasi', tanggalMasuk: '2023-07-01', jenisKelamin: 'L', noHP: '081234571007', email: 'ferdy@ruangprint.com', alamat: 'Jl. Bekasi No.7', gajiPokok: 4100000, tunjangan: 420000, uangMakan: 40000, bpjs: 123000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 2, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 56, npk: 'BKS08', nama: 'Mega Puspita', jabatan: 'Staff Admin', divisi: 'BKS', cabang: 'Bekasi', tanggalMasuk: '2023-08-01', jenisKelamin: 'P', noHP: '081234571008', email: 'mega@ruangprint.com', alamat: 'Jl. Bekasi No.8', gajiPokok: 4400000, tunjangan: 480000, uangMakan: 40000, bpjs: 132000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 57, npk: 'BKS09', nama: 'Irfan Maulana', jabatan: 'Kurir', divisi: 'BKS', cabang: 'Bekasi', tanggalMasuk: '2023-09-01', jenisKelamin: 'L', noHP: '081234571009', email: 'irfan@ruangprint.com', alamat: 'Jl. Bekasi No.9', gajiPokok: 3900000, tunjangan: 380000, uangMakan: 40000, bpjs: 117000, upahLembur: 5000, lemburMalamAktif: 'tidak', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 58, npk: 'BKS10', nama: 'Diana Sari', jabatan: 'Staff Finishing', divisi: 'BKS', cabang: 'Bekasi', tanggalMasuk: '2023-10-01', jenisKelamin: 'P', noHP: '081234571010', email: 'diana@ruangprint.com', alamat: 'Jl. Bekasi No.10', gajiPokok: 4000000, tunjangan: 400000, uangMakan: 40000, bpjs: 120000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 59, npk: 'BKS11', nama: 'Adi Nugroho', jabatan: 'Operator Print Senior', divisi: 'BKS', cabang: 'Bekasi', tanggalMasuk: '2022-10-01', jenisKelamin: 'L', noHP: '081234571011', email: 'adi@ruangprint.com', alamat: 'Jl. Bekasi No.11', gajiPokok: 5000000, tunjangan: 550000, uangMakan: 40000, bpjs: 150000, upahLembur: 6000, lemburMalamAktif: 'ya', shift: 2, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 60, npk: 'BKS12', nama: 'Nia Kurniati', jabatan: 'Staff Quality', divisi: 'BKS', cabang: 'Bekasi', tanggalMasuk: '2023-11-01', jenisKelamin: 'P', noHP: '081234571012', email: 'nia@ruangprint.com', alamat: 'Jl. Bekasi No.12', gajiPokok: 4200000, tunjangan: 420000, uangMakan: 40000, bpjs: 126000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  // ============ CGK ============
  { id: 61, npk: 'CGK01', nama: 'Yusuf Maulana', jabatan: 'Kepala Cabang CGK', divisi: 'CGK', cabang: 'Cengkareng', tanggalMasuk: '2022-08-01', jenisKelamin: 'L', noHP: '081234572001', email: 'yusuf@ruangprint.com', alamat: 'Jl. Cengkareng No.1', gajiPokok: 7000000, tunjangan: 800000, uangMakan: 40000, bpjs: 210000, upahLembur: 6000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 62, npk: 'CGK02', nama: 'Wati Susanti', jabatan: 'Staff Admin CGK', divisi: 'CGK', cabang: 'Cengkareng', tanggalMasuk: '2023-02-15', jenisKelamin: 'P', noHP: '081234572002', email: 'wati@ruangprint.com', alamat: 'Jl. Cengkareng No.2', gajiPokok: 4400000, tunjangan: 480000, uangMakan: 40000, bpjs: 132000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 63, npk: 'CGK03', nama: 'Hadi Sucipto', jabatan: 'Operator Print', divisi: 'CGK', cabang: 'Cengkareng', tanggalMasuk: '2023-03-01', jenisKelamin: 'L', noHP: '081234572003', email: 'hadi@ruangprint.com', alamat: 'Jl. Cengkareng No.3', gajiPokok: 4100000, tunjangan: 420000, uangMakan: 40000, bpjs: 123000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 2, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 64, npk: 'CGK04', nama: 'Titin Suhartini', jabatan: 'Operator Print', divisi: 'CGK', cabang: 'Cengkareng', tanggalMasuk: '2023-04-01', jenisKelamin: 'P', noHP: '081234572004', email: 'titin@ruangprint.com', alamat: 'Jl. Cengkareng No.4', gajiPokok: 4100000, tunjangan: 420000, uangMakan: 40000, bpjs: 123000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 2, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 65, npk: 'CGK05', nama: 'Samsul Arifin', jabatan: 'Kurir', divisi: 'CGK', cabang: 'Cengkareng', tanggalMasuk: '2023-05-01', jenisKelamin: 'L', noHP: '081234572005', email: 'samsul@ruangprint.com', alamat: 'Jl. Cengkareng No.5', gajiPokok: 3900000, tunjangan: 380000, uangMakan: 40000, bpjs: 117000, upahLembur: 5000, lemburMalamAktif: 'tidak', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 66, npk: 'CGK06', nama: 'Yuyun Yuningsih', jabatan: 'Staff Finishing', divisi: 'CGK', cabang: 'Cengkareng', tanggalMasuk: '2023-06-01', jenisKelamin: 'P', noHP: '081234572006', email: 'yuyun@ruangprint.com', alamat: 'Jl. Cengkareng No.6', gajiPokok: 4000000, tunjangan: 400000, uangMakan: 40000, bpjs: 120000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 67, npk: 'CGK07', nama: 'Koko Koswara', jabatan: 'Operator Print', divisi: 'CGK', cabang: 'Cengkareng', tanggalMasuk: '2023-07-01', jenisKelamin: 'L', noHP: '081234572007', email: 'koko@ruangprint.com', alamat: 'Jl. Cengkareng No.7', gajiPokok: 4100000, tunjangan: 420000, uangMakan: 40000, bpjs: 123000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 2, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 68, npk: 'CGK08', nama: 'Lilis Suryani', jabatan: 'Staff Admin', divisi: 'CGK', cabang: 'Cengkareng', tanggalMasuk: '2023-08-01', jenisKelamin: 'P', noHP: '081234572008', email: 'lilis@ruangprint.com', alamat: 'Jl. Cengkareng No.8', gajiPokok: 4400000, tunjangan: 480000, uangMakan: 40000, bpjs: 132000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 69, npk: 'CGK09', nama: 'Opik Saepulloh', jabatan: 'Kurir', divisi: 'CGK', cabang: 'Cengkareng', tanggalMasuk: '2023-09-01', jenisKelamin: 'L', noHP: '081234572009', email: 'opik@ruangprint.com', alamat: 'Jl. Cengkareng No.9', gajiPokok: 3900000, tunjangan: 380000, uangMakan: 40000, bpjs: 117000, upahLembur: 5000, lemburMalamAktif: 'tidak', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 70, npk: 'CGK10', nama: 'Ati Rahayu', jabatan: 'Staff Finishing', divisi: 'CGK', cabang: 'Cengkareng', tanggalMasuk: '2023-10-01', jenisKelamin: 'P', noHP: '081234572010', email: 'ati@ruangprint.com', alamat: 'Jl. Cengkareng No.10', gajiPokok: 4000000, tunjangan: 400000, uangMakan: 40000, bpjs: 120000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 71, npk: 'CGK11', nama: 'Cecep Suhendar', jabatan: 'Operator Print Senior', divisi: 'CGK', cabang: 'Cengkareng', tanggalMasuk: '2022-11-01', jenisKelamin: 'L', noHP: '081234572011', email: 'cecep@ruangprint.com', alamat: 'Jl. Cengkareng No.11', gajiPokok: 5000000, tunjangan: 550000, uangMakan: 40000, bpjs: 150000, upahLembur: 6000, lemburMalamAktif: 'ya', shift: 2, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 72, npk: 'CGK12', nama: 'Ita Purnamasari', jabatan: 'Staff Quality', divisi: 'CGK', cabang: 'Cengkareng', tanggalMasuk: '2023-12-01', jenisKelamin: 'P', noHP: '081234572012', email: 'ita@ruangprint.com', alamat: 'Jl. Cengkareng No.12', gajiPokok: 4200000, tunjangan: 420000, uangMakan: 40000, bpjs: 126000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
  { id: 73, npk: 'CGK13', nama: 'Dadan Ramdani', jabatan: 'Staff Gudang', divisi: 'CGK', cabang: 'Cengkareng', tanggalMasuk: '2024-01-15', jenisKelamin: 'L', noHP: '081234572013', email: 'dadan@ruangprint.com', alamat: 'Jl. Cengkareng No.13', gajiPokok: 4000000, tunjangan: 400000, uangMakan: 40000, bpjs: 120000, upahLembur: 5000, lemburMalamAktif: 'ya', shift: 1, status: 'Aktif', umMode: 'minggu', punyaCuti: 'ya' },
];

const baseCabang: { kode: string; nama: string }[] = [
  { kode: 'HO', nama: 'Head Office' },
  { kode: 'DMB', nama: 'Dramaga Bogor' },
  { kode: 'CTR', nama: 'Citeureup' },
  { kode: 'GDS', nama: 'Gedung Surapati' },
  { kode: 'BKS', nama: 'Bekasi' },
  { kode: 'CGK', nama: 'Cengkareng' },
];

const CUSTOM_CABANG_KEY = 'ruanghrd-custom-cabang';

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
  'Staff Administrasi',
  'Staff Keuangan',
  'Supervisor',
  'Staff HRD',
  'IT Support',
  'Staff Marketing',
  'Driver',
  'Staff Operasional',
  'Staff Gudang',
  'Receptionist',
  'Kepala HRD',
  'Manager Keuangan',
  'Kepala Cabang',
  'Staff Admin',
  'Operator Print',
  'Kurir',
  'Staff Finishing',
  'Staff Quality',
  'Operator Print Senior',
];
