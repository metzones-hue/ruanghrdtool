// ==================== ENTITY TYPES ====================

export type Cabang = 'HO' | 'DMB' | 'CTR' | 'GDS' | 'BKS' | 'CGK' | string;
export type StatusAktif = 'Aktif' | 'Nonaktif';
export type StatusLembur = 'Pending' | 'Disetujui' | 'Ditolak';
export type StatusCuti = 'Pending' | 'Disetujui' | 'Ditolak';
export type StatusAbsensi = 'Hadir' | 'Cuti' | 'Sakit' | 'Izin' | 'Alpha';
export type StatusKasbon = 'Aktif' | 'Lunas';
export type ViaCicilan = 'UM' | 'Gaji' | 'Keduanya';
export type UMMode = 'minggu' | 'bulanan';
export type Shift = 1 | 2;
export type JenisCuti = 'Cuti Tahunan' | 'Cuti Melahirkan' | 'Cuti Sakit' | 'Izin Pribadi' | 'Dinas Luar';
export type RoleUser = 'staff' | 'kepala' | 'admin';
export type Permission =
  | 'karyawan:view' | 'karyawan:create' | 'karyawan:edit' | 'karyawan:delete'
  | 'absensi:view' | 'absensi:create' | 'absensi:edit' | 'absensi:delete'
  | 'lembur:view' | 'lembur:create' | 'lembur:approve' | 'lembur:edit'
  | 'gaji:view' | 'gaji:proses' | 'gaji:slip'
  | 'um:view' | 'um:bayar'
  | 'kasbon:view' | 'kasbon:create' | 'kasbon:edit'
  | 'cuti:view' | 'cuti:approve'
  | 'laporan:view'
  | 'pengaturan:view' | 'pengaturan:edit'
  | 'audit:view'
  | 'analitik:view'
  | 'dokumen:view' | 'dokumen:manage'
  | 'backup:view' | 'backup:manage'
  | 'rbac:view' | 'rbac:manage';

export interface Karyawan {
  id: number;
  npk: string;
  nama: string;
  jabatan: string;
  divisi: Cabang;
  cabang: string;
  tanggalMasuk: string;
  jenisKelamin: 'L' | 'P';
  noHP: string;
  email: string;
  alamat: string;
  gajiPokok: number;
  tunjangan: number;
  uangMakan: number;
  bpjs: number;
  upahLembur: number;
  lemburMalamAktif: 'ya' | 'tidak';
  shift: Shift;
  status: StatusAktif;
  umMode: UMMode;
  punyaCuti: 'ya' | 'tidak';
  fotoKTP?: string;
}

export interface Absensi {
  id: number;
  karyawanId: number;
  nama: string;
  tanggal: string;
  status: StatusAbsensi;
  masuk?: string;
  keluar?: string;
  menitTelat: number;
  shift: Shift;
  keterangan?: string;
  synced?: boolean;
}

export interface Lembur {
  id: number;
  tanggal: string;
  karyawanId: number;
  nama: string;
  divisi: Cabang;
  mulai: string;
  selesai: string;
  jamTotal: number;
  upahPerJam: number;
  isMinggu: boolean;
  melebihi2230: boolean;
  bonusMalam: number;
  bonusUM: number;
  totalUpah: number;
  alasan: string;
  status: StatusLembur;
  autoDetect?: boolean;
}

export interface Cuti {
  id: number;
  ajuan: string;
  karyawanId: number;
  nama: string;
  jenis: JenisCuti;
  mulai: string;
  selesai: string;
  hari: number;
  ket?: string;
  status: StatusCuti;
}

export interface Kasbon {
  id: number;
  tanggal: string;
  karyawanId: number;
  nama: string;
  jumlah: number;
  via: ViaCicilan;
  cicilan: number;
  cicilanUM: number;
  cicilanGaji: number;
  sisaHutang: number;
  ket?: string;
  status: StatusKasbon;
  riwayatBayar: { tanggal: string; nominal: number }[];
}

export interface PotonganDadakan {
  id: number;
  tanggal: string;
  karyawanId: number;
  nama: string;
  jumlah: number;
  via: 'UM' | 'Gaji';
  alasan: string;
}

export interface GajiRecord {
  id: number;
  karyawanId: number;
  nama: string;
  periode: string;
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
  status: 'Belum Dibayar' | 'Sudah Dibayar';
}

export interface UMBayar {
  [key: string]: { tgl: string; nama: string };
}

export interface Pengaturan {
  upahLembur: number;
  upahLemburLevel2: number;
  upahLemburLevel3: number;
  umPerHari: number;
  umPerHariHO: number;
  batasTelat: number;
  batasTelatShift2: number;
  potonganTelat: number;
  bpjsKaryawan: number;
  bpjsPerusahaan: number;
  cutiTahunan: number;
  batasMalam: string;
  bonusMalam: number;
  insentifKehadiran: number;
  jamMasukShift1: string;
  jamMasukShift2: string;
  jamKeluarShift1: string;
  jamKeluarShift2: string;
  thresholdShift2: string;
  lokasiHO: string[];
  password: string;
  passwordKepala: string;
}

export interface LaporanPenggajian {
  id: number;
  periode: string;
  nama: string;
  divisi: string;
  gajiPokok: number;
  tunjangan: number;
  insentif: number;
  uangMakan: number;
  lembur: number;
  bpjs: number;
  potonganTelat: number;
  potonganKasbon: number;
  totalDiterima: number;
  status: string;
}

// ==================== D CLASS: AUDIT TRAIL ====================

export interface AuditLog {
  id: number;
  waktu: string;
  user: string;
  role: string;
  aksi: 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT' | 'BAYAR' | 'LOGIN' | 'LOGOUT' | 'EXPORT' | 'IMPORT';
  modul: string;
  entitasId?: number;
  detail: string;
  ipAddress?: string;
}

// ==================== D CLASS: RBAC ====================

export interface Role {
  id: string;
  nama: string;
  deskripsi: string;
  permissions: Permission[];
  isSystem?: boolean;
}

export interface UserAccount {
  id: number;
  username: string;
  nama: string;
  email: string;
  roleId: string;
  avatar?: string;
  aktif: boolean;
  lastLogin?: string;
}

// ==================== D CLASS: NOTIFICATIONS ====================

export type NotifType = 'info' | 'warning' | 'success' | 'danger';

export interface Notification {
  id: number;
  waktu: string;
  judul: string;
  pesan: string;
  type: NotifType;
  modul: string;
  entitasId?: number;
  dibaca: boolean;
  link?: string;
}

// ==================== D CLASS: DOCUMENTS ====================

export interface DokumenKaryawan {
  id: number;
  karyawanId: number;
  namaKaryawan: string;
  jenis: 'KTP' | 'KK' | 'Ijazah' | 'Sertifikat' | 'SK' | 'Surat_Lain';
  namaFile: string;
  base64: string;
  ukuran: number;
  uploadDate: string;
  keterangan?: string;
}

export interface TemplateSurat {
  id: number;
  jenis: 'SK_Kenaikan' | 'SP1' | 'SP2' | 'SP3' | 'Surat_Teguran' | 'PHK' | 'SK_Pengangkatan' | 'Lainnya';
  nama: string;
  content: string;
  createdAt: string;
}

// ==================== D CLASS: WORKFLOW ====================

export interface ApprovalStep {
  id: number;
  role: string;
  urutan: number;
  autoEscalateHours?: number;
  escalateToRole?: string;
}

export interface ApprovalWorkflow {
  id: number;
  nama: string;
  modul: 'cuti' | 'lembur' | 'kasbon';
  steps: ApprovalStep[];
  aktif: boolean;
}

// ==================== D CLASS: FORECAST ====================

export interface TurnoverPrediction {
  karyawanId: number;
  nama: string;
  divisi: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  indicators: string[];
}

export interface PayrollForecast {
  periode: string;
  estimasiGaji: number;
  estimasiLembur: number;
  estimasiUM: number;
  estimasiTotal: number;
}

// ==================== APP STATE ====================

export interface AppState {
  // Data
  karyawan: Karyawan[];
  absensi: Absensi[];
  lembur: Lembur[];
  cuti: Cuti[];
  kasbon: Kasbon[];
  gaji: GajiRecord[];
  potonganDadakan: PotonganDadakan[];
  umBayar: UMBayar;
  pengaturan: Pengaturan;

  // D Class: Audit
  auditLogs: AuditLog[];

  // D Class: RBAC
  roles: Role[];
  users: UserAccount[];

  // D Class: Notifications
  notifications: Notification[];

  // D Class: Documents
  dokumen: DokumenKaryawan[];
  templates: TemplateSurat[];

  // D Class: Workflow
  workflows: ApprovalWorkflow[];

  // D Class: Language
  language: 'id' | 'en';

  // Auth
  isLoggedIn: boolean;
  userRole: RoleUser | null;
  userName: string;
  currentUserId?: number;

  // UI
  currentPage: string;
  sidebarOpen: boolean;

  // Actions
  login: (role: RoleUser, name?: string) => void;
  logout: () => void;
  setCurrentPage: (page: string) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setLanguage: (lang: 'id' | 'en') => void;

  // CRUD Karyawan
  addKaryawan: (k: Omit<Karyawan, 'id'>) => void;
  updateKaryawan: (id: number, data: Partial<Karyawan>) => void;
  deleteKaryawan: (id: number) => void;
  getKaryawanAktif: () => Karyawan[];

  // Absensi
  addAbsensi: (a: Omit<Absensi, 'id'>) => void;
  updateAbsensi: (id: number, data: Partial<Absensi>) => void;
  deleteAbsensi: (id: number) => void;
  importAbsensi: (data: Omit<Absensi, 'id'>[]) => void;

  // Lembur
  addLembur: (l: Omit<Lembur, 'id'>) => void;
  updateLembur: (id: number, data: Partial<Lembur>) => void;
  deleteLembur: (id: number) => void;
  approveLembur: (id: number, status: StatusLembur) => void;

  // Cuti
  addCuti: (c: Omit<Cuti, 'id'>) => void;
  updateCuti: (id: number, data: Partial<Cuti>) => void;
  deleteCuti: (id: number) => void;
  approveCuti: (id: number, status: StatusCuti) => void;

  // Kasbon
  addKasbon: (k: Omit<Kasbon, 'id'>) => void;
  updateKasbon: (id: number, data: Partial<Kasbon>) => void;
  deleteKasbon: (id: number) => void;
  bayarKasbon: (id: number, nominal: number) => void;
  lunasKasbon: (id: number) => void;

  // Gaji
  hitungGaji: (karyawanId: number, periode: string) => GajiRecord | null;
  hitungSemuaGaji: (periode: string) => void;
  tandaiGajiBayar: (karyawanId: number, periode: string) => void;

  // UM
  tandaiUMBayar: (karyawanId: number, periodeVal: string) => void;
  batalUMBayar: (karyawanId: number, periodeVal: string) => void;

  // Potongan Dadakan
  addPotonganDadakan: (p: Omit<PotonganDadakan, 'id'>) => void;
  deletePotonganDadakan: (id: number) => void;

  // Pengaturan
  updatePengaturan: (data: Partial<Pengaturan>) => void;

  // Audit Trail
  addAuditLog: (log: Omit<AuditLog, 'id' | 'waktu'>) => void;
  clearAuditLogs: () => void;

  // RBAC
  addRole: (r: Omit<Role, 'id'>) => void;
  updateRole: (id: string, data: Partial<Role>) => void;
  deleteRole: (id: string) => void;
  addUser: (u: Omit<UserAccount, 'id'>) => void;
  updateUser: (id: number, data: Partial<UserAccount>) => void;
  deleteUser: (id: number) => void;
  hasPermission: (p: Permission) => boolean;

  // Notifications
  addNotification: (n: Omit<Notification, 'id' | 'waktu' | 'dibaca'>) => void;
  markNotifRead: (id: number) => void;
  markAllNotifRead: () => void;
  clearNotifications: () => void;

  // Documents
  addDokumen: (d: Omit<DokumenKaryawan, 'id'>) => void;
  deleteDokumen: (id: number) => void;
  addTemplate: (t: Omit<TemplateSurat, 'id'>) => void;
  deleteTemplate: (id: number) => void;

  // Workflow
  addWorkflow: (w: Omit<ApprovalWorkflow, 'id'>) => void;
  updateWorkflow: (id: number, data: Partial<ApprovalWorkflow>) => void;
  deleteWorkflow: (id: number) => void;

  // Utils
  getSisaCuti: (karyawanId: number) => number;
  getSisaKasbonUM: (karyawanId: number, periodeVal: string) => number;
  getSisaKasbonGaji: (karyawanId: number) => number;
  getPotonganDadakanUM: (karyawanId: number, mulai: string, selesai: string) => number;
  getPotonganDadakanGaji: (karyawanId: number, bulan: string) => number;
  getHariKerja: (mulai: string, selesai: string) => number;
  hitungUMKaryawan: (karyawanId: number, periodeVal: string) => { hadir: number; alpha: number; umDiterima: number; ket: string; punyaCuti: string };
  hitungUMKaryawanBulan: (karyawanId: number, bulan: string) => { hadir: number; alpha: number; umDiterima: number; punyaCuti: string };
  hitungGajiKaryawan: (k: Karyawan, periode: string) => Omit<GajiRecord, 'id' | 'nama' | 'periode' | 'karyawanId' | 'status'>;
  resetAllData: () => void;
  exportAllData: () => string;
  importAllData: (json: string) => boolean;
  getTurnoverPrediction: () => TurnoverPrediction[];
  getPayrollForecast: (months: number) => PayrollForecast[];
}

// ==================== CHART DATA TYPES ====================

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface StatCardData {
  label: string;
  value: string | number;
  icon: string;
  trend?: string;
  color: string;
}

// ==================== FORM TYPES ====================

export interface LoginFormData {
  username: string;
  password: string;
}

export interface FilterState {
  search: string;
  cabang: string;
  bulan: string;
  status: string;
}
