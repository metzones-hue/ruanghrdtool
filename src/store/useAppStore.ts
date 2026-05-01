import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Karyawan, Absensi, Lembur, Cuti, Kasbon, GajiRecord,
  PotonganDadakan, UMBayar, Pengaturan, RoleUser, StatusLembur, StatusCuti,
  AuditLog, Role, UserAccount, Notification, DokumenKaryawan,
  TemplateSurat, ApprovalWorkflow, TurnoverPrediction, PayrollForecast,
  Permission
} from '@/types';
import { initialKaryawan, defaultPengaturan } from '@/data/seed';

// ==================== BROADCAST CHANNEL (Real-Time) ====================
let bc: BroadcastChannel | null = null;
try {
  bc = new BroadcastChannel('ruanghrd-sync');
} catch { /* BroadcastChannel not supported */ }

const broadcastSync = (type: string, payload?: unknown) => {
  if (bc) {
    try { bc.postMessage({ type, payload, timestamp: Date.now() }); } catch { /* ignore */ }
  }
};

// ==================== LOCAL STORAGE KEY ====================
const STORAGE_KEY = 'ruanghrd-v7-data';

// ==================== UTILITY FUNCTIONS ====================
const todayStr = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const nowStr = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

const nextId = <T extends { id: number }>(arr: T[]): number => {
  return arr.length > 0 ? Math.max(...arr.map(x => x.id)) + 1 : 1;
};

const getHariKerjaFn = (mulai: string, selesai: string): number => {
  let count = 0;
  const start = new Date(mulai);
  const end = new Date(selesai);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    if (d.getDay() !== 0) count++;
  }
  return count;
};

// ==================== DEFAULT RBAC ====================
const defaultRoles: Role[] = [
  {
    id: 'kepala',
    nama: 'Kepala HRD',
    deskripsi: 'Akses penuh ke semua fitur',
    isSystem: true,
    permissions: ['karyawan:view','karyawan:create','karyawan:edit','karyawan:delete','absensi:view','absensi:create','absensi:edit','absensi:delete','lembur:view','lembur:create','lembur:approve','lembur:edit','gaji:view','gaji:proses','gaji:slip','um:view','um:bayar','kasbon:view','kasbon:create','kasbon:edit','cuti:view','cuti:approve','laporan:view','pengaturan:view','pengaturan:edit','audit:view','analitik:view','dokumen:view','dokumen:manage','backup:view','backup:manage','rbac:view','rbac:manage']
  },
  {
    id: 'staff',
    nama: 'Staff HRD',
    deskripsi: 'Akses operasional harian',
    isSystem: true,
    permissions: ['karyawan:view','karyawan:create','karyawan:edit','absensi:view','absensi:create','absensi:edit','lembur:view','lembur:create','um:view','um:bayar','kasbon:view','kasbon:create','cuti:view','dokumen:view','dokumen:manage','backup:view']
  },
  {
    id: 'admin',
    nama: 'Administrator',
    deskripsi: 'Akses sistem dan konfigurasi',
    isSystem: true,
    permissions: ['pengaturan:view','pengaturan:edit','audit:view','analitik:view','rbac:view','rbac:manage','backup:view','backup:manage']
  },
  {
    id: 'kepala_cabang',
    nama: 'Kepala Cabang',
    deskripsi: 'Akses data cabang sendiri saja',
    isSystem: true,
    permissions: ['karyawan:view','absensi:view','lembur:view','lembur:approve','cuti:view','cuti:approve','um:view','kasbon:view']
  }
];

const defaultUsers: UserAccount[] = [
  { id: 1, username: 'kepala', nama: 'Kepala HRD', email: 'kepala@ruangprint.com', roleId: 'kepala', aktif: true, lastLogin: nowStr() },
  { id: 2, username: 'staff', nama: 'Staff HRD', email: 'staff@ruangprint.com', roleId: 'staff', aktif: true, lastLogin: nowStr() }
];

// ==================== STORE INTERFACE ====================
interface StoreState {
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
  auditLogs: AuditLog[];
  roles: Role[];
  users: UserAccount[];
  notifications: Notification[];
  dokumen: DokumenKaryawan[];
  templates: TemplateSurat[];
  workflows: ApprovalWorkflow[];
  language: 'id' | 'en';
  isLoggedIn: boolean;
  userRole: RoleUser | null;
  userName: string;
  currentUserId?: number;

  // Actions - Auth
  login: (role: RoleUser, name?: string) => void;
  logout: () => void;

  // Actions - UI
  setLanguage: (lang: 'id' | 'en') => void;

  // Actions - Karyawan
  addKaryawan: (k: Omit<Karyawan, 'id'>) => void;
  updateKaryawan: (id: number, data: Partial<Karyawan>) => void;
  deleteKaryawan: (id: number) => void;
  getKaryawanAktif: () => Karyawan[];

  // Actions - Absensi
  addAbsensi: (a: Omit<Absensi, 'id'>) => void;
  updateAbsensi: (id: number, data: Partial<Absensi>) => void;
  deleteAbsensi: (id: number) => void;
  importAbsensi: (data: Omit<Absensi, 'id'>[]) => void;

  // Actions - Lembur
  addLembur: (l: Omit<Lembur, 'id'>) => void;
  updateLembur: (id: number, data: Partial<Lembur>) => void;
  deleteLembur: (id: number) => void;
  approveLembur: (id: number, status: StatusLembur) => void;

  // Actions - Cuti
  addCuti: (c: Omit<Cuti, 'id'>) => void;
  updateCuti: (id: number, data: Partial<Cuti>) => void;
  deleteCuti: (id: number) => void;
  approveCuti: (id: number, status: StatusCuti) => void;

  // Actions - Kasbon
  addKasbon: (k: Omit<Kasbon, 'id'>) => void;
  updateKasbon: (id: number, data: Partial<Kasbon>) => void;
  deleteKasbon: (id: number) => void;
  bayarKasbon: (id: number, nominal: number) => void;
  lunasKasbon: (id: number) => void;

  // Actions - Gaji
  hitungGaji: (karyawanId: number, periode: string) => GajiRecord | null;
  hitungSemuaGaji: (periode: string) => void;
  tandaiGajiBayar: (karyawanId: number, periode: string) => void;

  // Actions - UM
  tandaiUMBayar: (karyawanId: number, periodeVal: string) => void;
  batalUMBayar: (karyawanId: number, periodeVal: string) => void;

  // Actions - Potongan Dadakan
  addPotonganDadakan: (p: Omit<PotonganDadakan, 'id'>) => void;
  deletePotonganDadakan: (id: number) => void;

  // Actions - Pengaturan
  updatePengaturan: (data: Partial<Pengaturan>) => void;

  // Actions - Audit Trail
  addAuditLog: (log: Omit<AuditLog, 'id' | 'waktu'>) => void;
  clearAuditLogs: () => void;

  // Actions - RBAC
  addRole: (r: Omit<Role, 'id'>) => void;
  updateRole: (id: string, data: Partial<Role>) => void;
  deleteRole: (id: string) => void;
  addUser: (u: Omit<UserAccount, 'id'>) => void;
  updateUser: (id: number, data: Partial<UserAccount>) => void;
  deleteUser: (id: number) => void;
  hasPermission: (p: Permission) => boolean;

  // Actions - Notifications
  addNotification: (n: Omit<Notification, 'id' | 'waktu' | 'dibaca'>) => void;
  markNotifRead: (id: number) => void;
  markAllNotifRead: () => void;
  clearNotifications: () => void;

  // Actions - Documents
  addDokumen: (d: Omit<DokumenKaryawan, 'id'>) => void;
  deleteDokumen: (id: number) => void;
  addTemplate: (t: Omit<TemplateSurat, 'id'>) => void;
  deleteTemplate: (id: number) => void;

  // Actions - Workflow
  addWorkflow: (w: Omit<ApprovalWorkflow, 'id'>) => void;
  updateWorkflow: (id: number, data: Partial<ApprovalWorkflow>) => void;
  deleteWorkflow: (id: number) => void;

  // Computed helpers
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

const useAppStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // ==================== INITIAL STATE ====================
      karyawan: initialKaryawan,
      absensi: [],
      lembur: [],
      cuti: [],
      kasbon: [],
      gaji: [],
      potonganDadakan: [],
      umBayar: {},
      pengaturan: defaultPengaturan,
      auditLogs: [],
      roles: defaultRoles,
      users: defaultUsers,
      notifications: [],
      dokumen: [],
      templates: [],
      workflows: [],
      language: 'id',
      isLoggedIn: false,
      userRole: null,
      userName: '',
      currentUserId: undefined,

      // ==================== AUTH ====================
      login: (role, name) => {
        const state = get();
        const userName = name || (role === 'kepala' ? 'Kepala HRD' : 'Staff HRD');
        const userId = state.users.find(u => u.roleId === role)?.id;
        set({ isLoggedIn: true, userRole: role, userName, currentUserId: userId });
        // Add audit log
        get().addAuditLog({ user: userName, role, aksi: 'LOGIN', modul: 'Auth', detail: `${userName} login sebagai ${role}` });
        // Add notification
        get().addNotification({ judul: 'Login Berhasil', pesan: `Selamat datang, ${userName}!`, type: 'success', modul: 'Auth' });
        broadcastSync('login', { user: userName, role });
      },
      logout: () => {
        const { userName, userRole } = get();
        get().addAuditLog({ user: userName || 'Anonymous', role: userRole || 'staff', aksi: 'LOGOUT', modul: 'Auth', detail: `${userName} logout` });
        broadcastSync('logout', { user: userName });
        set({ isLoggedIn: false, userRole: null, userName: '', currentUserId: undefined });
      },

      // ==================== LANGUAGE ====================
      setLanguage: (lang) => set({ language: lang }),

      // ==================== KARYAWAN ====================
      addKaryawan: (k) => {
        const state = get();
        const newK = { ...k, id: nextId(state.karyawan) };
        set({ karyawan: [...state.karyawan, newK] });
        get().addAuditLog({ user: state.userName || 'System', role: state.userRole || 'staff', aksi: 'CREATE', modul: 'Karyawan', entitasId: newK.id, detail: `Menambah karyawan: ${newK.nama} (${newK.npk})` });
        get().addNotification({ judul: 'Karyawan Baru', pesan: `${newK.nama} telah ditambahkan`, type: 'success', modul: 'Karyawan', entitasId: newK.id, link: '/karyawan' });
        broadcastSync('karyawan:added', newK);
      },
      updateKaryawan: (id, data) => {
        const state = get();
        const k = state.karyawan.find(x => x.id === id);
        set({ karyawan: state.karyawan.map(k => k.id === id ? { ...k, ...data } : k) });
        get().addAuditLog({ user: state.userName || 'System', role: state.userRole || 'staff', aksi: 'UPDATE', modul: 'Karyawan', entitasId: id, detail: `Mengubah data karyawan: ${k?.nama || id}` });
        broadcastSync('karyawan:updated', { id, data });
      },
      deleteKaryawan: (id) => {
        const state = get();
        const k = state.karyawan.find(x => x.id === id);
        set({ karyawan: state.karyawan.filter(k => k.id !== id) });
        get().addAuditLog({ user: state.userName || 'System', role: state.userRole || 'staff', aksi: 'DELETE', modul: 'Karyawan', entitasId: id, detail: `Menghapus karyawan: ${k?.nama || id}` });
        broadcastSync('karyawan:deleted', { id });
      },
      getKaryawanAktif: () => get().karyawan.filter(k => k.status === 'Aktif'),

      // ==================== ABSENSI ====================
      addAbsensi: (a) => {
        const state = get();
        const newA = { ...a, id: nextId(state.absensi) };
        set({ absensi: [...state.absensi, newA] });
        get().addAuditLog({ user: state.userName || 'System', role: state.userRole || 'staff', aksi: 'CREATE', modul: 'Absensi', entitasId: newA.id, detail: `Absensi ${newA.nama} - ${newA.tanggal}: ${newA.status}` });
        broadcastSync('absensi:added', newA);
      },
      updateAbsensi: (id, data) => {
        const state = get();
        set({ absensi: state.absensi.map(a => a.id === id ? { ...a, ...data } : a) });
        get().addAuditLog({ user: state.userName || 'System', role: state.userRole || 'staff', aksi: 'UPDATE', modul: 'Absensi', entitasId: id, detail: `Mengubah absensi #${id}` });
      },
      deleteAbsensi: (id) => {
        const state = get();
        set({ absensi: state.absensi.filter(a => a.id !== id) });
        get().addAuditLog({ user: state.userName || 'System', role: state.userRole || 'staff', aksi: 'DELETE', modul: 'Absensi', entitasId: id, detail: `Menghapus absensi #${id}` });
      },
      importAbsensi: (data) => {
        const state = get();
        // Hapus data lama yang bulannya sama dengan data import (prevent duplikat)
        const bulanList = [...new Set(data.map(a => a.tanggal.substring(0, 7)))];
        const absensiFiltered = state.absensi.filter(a => !bulanList.includes(a.tanggal.substring(0, 7)));
        const newRecords = data.map((a, i) => ({ ...a, id: nextId(absensiFiltered) + i }));
        set({ absensi: [...absensiFiltered, ...newRecords] });
        get().addAuditLog({ user: state.userName || 'System', role: state.userRole || 'staff', aksi: 'IMPORT', modul: 'Absensi', detail: `Import ${newRecords.length} data absensi` });
        get().addNotification({ judul: 'Import Selesai', pesan: `${newRecords.length} data absensi berhasil diimport`, type: 'success', modul: 'Absensi' });
      },

      // ==================== LEMBUR ====================
      addLembur: (l) => {
        const state = get();
        const newL = { ...l, id: nextId(state.lembur) };
        set({ lembur: [...state.lembur, newL] });
        get().addAuditLog({ user: state.userName || 'System', role: state.userRole || 'staff', aksi: 'CREATE', modul: 'Lembur', entitasId: newL.id, detail: `Pengajuan lembur ${newL.nama} - ${newL.tanggal}` });
        get().addNotification({ judul: 'Pengajuan Lembur', pesan: `${newL.nama} mengajukan lembur ${newL.tanggal}`, type: 'info', modul: 'Lembur', entitasId: newL.id, link: '/lembur' });
        broadcastSync('lembur:added', newL);
      },
      updateLembur: (id, data) => {
        set((state) => ({ lembur: state.lembur.map(l => l.id === id ? { ...l, ...data } : l) }));
      },
      deleteLembur: (id) => {
        set((state) => ({ lembur: state.lembur.filter(l => l.id !== id) }));
        get().addAuditLog({ user: get().userName || 'System', role: get().userRole || 'staff', aksi: 'DELETE', modul: 'Lembur', entitasId: id, detail: `Menghapus lembur #${id}` });
      },
      approveLembur: (id, status) => {
        const state = get();
        const l = state.lembur.find(x => x.id === id);
        set((s) => ({ lembur: s.lembur.map(x => x.id === id ? { ...x, status } : x) }));
        get().addAuditLog({ user: state.userName || 'System', role: state.userRole || 'staff', aksi: status === 'Disetujui' ? 'APPROVE' : 'REJECT', modul: 'Lembur', entitasId: id, detail: `Lembur ${l?.nama} ${status}` });
        if (l) {
          get().addNotification({
            judul: `Lembur ${status}`,
            pesan: `Lembur ${l.nama} tanggal ${l.tanggal} telah ${status}`,
            type: status === 'Disetujui' ? 'success' : 'warning',
            modul: 'Lembur',
            entitasId: id,
            link: '/lembur'
          });
        }
        broadcastSync('lembur:approved', { id, status });
      },

      // ==================== CUTI ====================
      addCuti: (c) => {
        const state = get();
        const newC = { ...c, id: nextId(state.cuti) };
        set({ cuti: [...state.cuti, newC] });
        get().addAuditLog({ user: state.userName || 'System', role: state.userRole || 'staff', aksi: 'CREATE', modul: 'Cuti', entitasId: newC.id, detail: `Pengajuan cuti ${newC.nama} - ${newC.jenis} (${newC.hari} hari)` });
        get().addNotification({ judul: 'Pengajuan Cuti', pesan: `${newC.nama} mengajukan ${newC.jenis}`, type: 'info', modul: 'Cuti', entitasId: newC.id, link: '/cuti' });
      },
      updateCuti: (id, data) => {
        set((state) => ({ cuti: state.cuti.map(c => c.id === id ? { ...c, ...data } : c) }));
      },
      deleteCuti: (id) => {
        set((state) => ({ cuti: state.cuti.filter(c => c.id !== id) }));
      },
      approveCuti: (id, status) => {
        const state = get();
        const c = state.cuti.find(x => x.id === id);
        set((s) => ({ cuti: s.cuti.map(x => x.id === id ? { ...x, status } : x) }));
        get().addAuditLog({ user: state.userName || 'System', role: state.userRole || 'staff', aksi: status === 'Disetujui' ? 'APPROVE' : 'REJECT', modul: 'Cuti', entitasId: id, detail: `Cuti ${c?.nama} ${status}` });
        if (c) {
          get().addNotification({
            judul: `Cuti ${status}`,
            pesan: `Pengajuan ${c.jenis} dari ${c.nama} telah ${status}`,
            type: status === 'Disetujui' ? 'success' : 'warning',
            modul: 'Cuti',
            entitasId: id,
            link: '/cuti'
          });
        }
      },

      // ==================== KASBON ====================
      addKasbon: (k) => {
        const state = get();
        const newK = { ...k, id: nextId(state.kasbon) };
        set({ kasbon: [...state.kasbon, newK] });
        get().addAuditLog({ user: state.userName || 'System', role: state.userRole || 'staff', aksi: 'CREATE', modul: 'Kasbon', entitasId: newK.id, detail: `Kasbon ${newK.nama}: ${newK.jumlah.toLocaleString('id-ID')}` });
      },
      updateKasbon: (id, data) => {
        set((state) => ({ kasbon: state.kasbon.map(k => k.id === id ? { ...k, ...data } : k) }));
      },
      deleteKasbon: (id) => {
        set((state) => ({ kasbon: state.kasbon.filter(k => k.id !== id) }));
      },
      bayarKasbon: (id, nominal) => {
        const state = get();
        set((s) => ({
          kasbon: s.kasbon.map(k => {
            if (k.id !== id) return k;
            const sisa = Math.max(0, k.sisaHutang - nominal);
            return {
              ...k,
              sisaHutang: sisa,
              status: sisa === 0 ? 'Lunas' : k.status,
              riwayatBayar: [...k.riwayatBayar, { tanggal: todayStr(), nominal }]
            };
          })
        }));
        const k = state.kasbon.find(x => x.id === id);
        get().addAuditLog({ user: state.userName || 'System', role: state.userRole || 'staff', aksi: 'BAYAR', modul: 'Kasbon', entitasId: id, detail: `Bayar kasbon ${k?.nama}: ${nominal.toLocaleString('id-ID')}` });
      },
      lunasKasbon: (id) => {
        set((state) => ({
          kasbon: state.kasbon.map(k => k.id === id ? { ...k, sisaHutang: 0, status: 'Lunas' } : k)
        }));
        get().addAuditLog({ user: get().userName || 'System', role: get().userRole || 'staff', aksi: 'BAYAR', modul: 'Kasbon', entitasId: id, detail: `Kasbon dilunaskan` });
      },

      // ==================== GAJI ====================
      hitungGaji: (karyawanId, periode) => {
        const state = get();
        const k = state.karyawan.find(x => x.id === karyawanId);
        if (!k) return null;
        const calc = state.hitungGajiKaryawan(k, periode);
        return {
          id: nextId(state.gaji),
          karyawanId: k.id,
          nama: k.nama,
          periode,
          ...calc,
          status: 'Belum Dibayar' as const,
        };
      },
      hitungSemuaGaji: (periode) => {
        const state = get();
        const aktif = state.karyawan.filter(k => k.status === 'Aktif');
        const newGaji: GajiRecord[] = [];
        aktif.forEach(k => {
          const ex = state.gaji.find(g => g.karyawanId === k.id && g.periode === periode);
          if (!ex) {
            const calc = state.hitungGajiKaryawan(k, periode);
            newGaji.push({
              id: nextId([...state.gaji, ...newGaji]),
              karyawanId: k.id,
              nama: k.nama,
              periode,
              ...calc,
              status: 'Sudah Dibayar',
            });
          } else {
            ex.status = 'Sudah Dibayar';
          }
        });
        set({ gaji: [...state.gaji, ...newGaji] });
        get().addAuditLog({ user: state.userName || 'System', role: state.userRole || 'staff', aksi: 'CREATE', modul: 'Gaji', detail: `Hitung gaji periode ${periode} untuk ${aktif.length} karyawan` });
        get().addNotification({ judul: 'Penggajian Selesai', pesan: `Gaji periode ${periode} telah diproses`, type: 'success', modul: 'Gaji', link: '/gaji' });
      },
      tandaiGajiBayar: (karyawanId, periode) => {
        const state = get();
        const k = state.karyawan.find(x => x.id === karyawanId);
        if (!k) return;
        const ex = state.gaji.find(g => g.karyawanId === karyawanId && g.periode === periode);
        if (!ex) {
          const calc = state.hitungGajiKaryawan(k, periode);
          set({
            gaji: [...state.gaji, {
              id: nextId(state.gaji),
              karyawanId: k.id,
              nama: k.nama,
              periode,
              ...calc,
              status: 'Sudah Dibayar' as const,
            }]
          });
        } else {
          set({
            gaji: state.gaji.map(g => g.id === ex.id ? { ...g, status: 'Sudah Dibayar' as const } : g)
          });
        }
        get().addAuditLog({ user: state.userName || 'System', role: state.userRole || 'staff', aksi: 'BAYAR', modul: 'Gaji', entitasId: karyawanId, detail: `Gaji ${k.nama} periode ${periode} dibayar` });
      },

      // ==================== UM ====================
      tandaiUMBayar: (karyawanId, periodeVal) => {
        const state = get();
        const k = state.karyawan.find(x => x.id === karyawanId);
        if (!k) return;
        set({
          umBayar: { ...state.umBayar, [`${karyawanId}-${periodeVal}`]: { tgl: todayStr(), nama: k.nama } }
        });
        get().addAuditLog({ user: state.userName || 'System', role: state.userRole || 'staff', aksi: 'BAYAR', modul: 'UM', entitasId: karyawanId, detail: `UM ${k.nama} periode ${periodeVal} ditandai dibayar` });
        broadcastSync('um:bayar', { karyawanId, periodeVal });
      },
      batalUMBayar: (karyawanId, periodeVal) => {
        const state = get();
        const key = `${karyawanId}-${periodeVal}`;
        const { [key]: _, ...rest } = state.umBayar;
        set({ umBayar: rest });
        get().addAuditLog({ user: state.userName || 'System', role: state.userRole || 'staff', aksi: 'UPDATE', modul: 'UM', entitasId: karyawanId, detail: `UM periode ${periodeVal} dibatalkan` });
      },

      // ==================== POTONGAN DADAKAN ====================
      addPotonganDadakan: (p) => {
        const state = get();
        const newP = { ...p, id: nextId(state.potonganDadakan) };
        set({ potonganDadakan: [...state.potonganDadakan, newP] });
        get().addAuditLog({ user: state.userName || 'System', role: state.userRole || 'staff', aksi: 'CREATE', modul: 'Potongan', entitasId: newP.id, detail: `Potongan dadakan ${newP.nama}: ${newP.jumlah.toLocaleString('id-ID')}` });
      },
      deletePotonganDadakan: (id) => {
        set((state) => ({
          potonganDadakan: state.potonganDadakan.filter(p => p.id !== id)
        }));
      },

      // ==================== PENGATURAN ====================
      updatePengaturan: (data) => {
        set((state) => ({
          pengaturan: { ...state.pengaturan, ...data }
        }));
        get().addAuditLog({ user: get().userName || 'System', role: get().userRole || 'staff', aksi: 'UPDATE', modul: 'Pengaturan', detail: 'Mengubah pengaturan sistem' });
      },

      // ==================== AUDIT TRAIL ====================
      addAuditLog: (log) => {
        const state = get();
        const newLog: AuditLog = { ...log, id: nextId(state.auditLogs), waktu: nowStr() };
        // Keep max 500 logs to prevent storage bloat
        const logs = [...state.auditLogs, newLog].slice(-500);
        set({ auditLogs: logs });
      },
      clearAuditLogs: () => {
        const state = get();
        get().addAuditLog({ user: state.userName || 'System', role: state.userRole || 'staff', aksi: 'DELETE', modul: 'Audit', detail: 'Menghapus semua audit log' });
        set({ auditLogs: [] });
      },

      // ==================== RBAC ====================
      addRole: (r) => {
        const state = get();
        const id = r.nama.toLowerCase().replace(/\s+/g, '_');
        set({ roles: [...state.roles, { ...r, id }] });
        get().addAuditLog({ user: state.userName, role: state.userRole || 'staff', aksi: 'CREATE', modul: 'RBAC', detail: `Menambah role: ${r.nama}` });
      },
      updateRole: (id, data) => {
        set((state) => ({
          roles: state.roles.map(r => r.id === id ? { ...r, ...data } : r)
        }));
      },
      deleteRole: (id) => {
        const state = get();
        const r = state.roles.find(x => x.id === id);
        if (r?.isSystem) return; // Can't delete system roles
        set({ roles: state.roles.filter(r => r.id !== id) });
        get().addAuditLog({ user: state.userName, role: state.userRole || 'staff', aksi: 'DELETE', modul: 'RBAC', detail: `Menghapus role: ${r?.nama || id}` });
      },
      addUser: (u) => {
        const state = get();
        set({ users: [...state.users, { ...u, id: nextId(state.users) }] });
        get().addAuditLog({ user: state.userName, role: state.userRole || 'staff', aksi: 'CREATE', modul: 'RBAC', detail: `Menambah user: ${u.username}` });
      },
      updateUser: (id, data) => {
        set((state) => ({
          users: state.users.map(u => u.id === id ? { ...u, ...data } : u)
        }));
      },
      deleteUser: (id) => {
        const state = get();
        set({ users: state.users.filter(u => u.id !== id) });
        get().addAuditLog({ user: state.userName, role: state.userRole || 'staff', aksi: 'DELETE', modul: 'RBAC', detail: `Menghapus user #${id}` });
      },
      hasPermission: (p) => {
        const state = get();
        // Kepala always has all permissions
        if (state.userRole === 'kepala') return true;
        // Find current user's role
        const user = state.users.find(u => u.id === state.currentUserId);
        if (!user) return false;
        const role = state.roles.find(r => r.id === user.roleId);
        if (!role) return false;
        return role.permissions.includes(p);
      },

      // ==================== NOTIFICATIONS ====================
      addNotification: (n) => {
        const state = get();
        const newN: Notification = { ...n, id: nextId(state.notifications), waktu: nowStr(), dibaca: false };
        // Keep max 100 notifications
        const notifications = [newN, ...state.notifications].slice(0, 100);
        set({ notifications });
        // Show browser notification if permitted
        if ('Notification' in window && Notification.permission === 'granted') {
          try {
            new Notification(n.judul, { body: n.pesan, icon: '/icon-192x192.png' });
          } catch { /* ignore */ }
        }
      },
      markNotifRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map(n => n.id === id ? { ...n, dibaca: true } : n)
        }));
      },
      markAllNotifRead: () => {
        set((state) => ({
          notifications: state.notifications.map(n => ({ ...n, dibaca: true }))
        }));
      },
      clearNotifications: () => set({ notifications: [] }),

      // ==================== DOCUMENTS ====================
      addDokumen: (d) => {
        const state = get();
        set({ dokumen: [...state.dokumen, { ...d, id: nextId(state.dokumen) }] });
        get().addAuditLog({ user: state.userName, role: state.userRole || 'staff', aksi: 'CREATE', modul: 'Dokumen', detail: `Upload dokumen ${d.jenis}: ${d.namaFile}` });
      },
      deleteDokumen: (id) => {
        set((state) => ({ dokumen: state.dokumen.filter(d => d.id !== id) }));
      },
      addTemplate: (t) => {
        const state = get();
        set({ templates: [...state.templates, { ...t, id: nextId(state.templates) }] });
        get().addAuditLog({ user: state.userName, role: state.userRole || 'staff', aksi: 'CREATE', modul: 'Template', detail: `Menambah template: ${t.nama}` });
      },
      deleteTemplate: (id) => {
        set((state) => ({ templates: state.templates.filter(t => t.id !== id) }));
      },

      // ==================== WORKFLOW ====================
      addWorkflow: (w) => {
        const state = get();
        set({ workflows: [...state.workflows, { ...w, id: nextId(state.workflows) }] });
        get().addAuditLog({ user: state.userName, role: state.userRole || 'staff', aksi: 'CREATE', modul: 'Workflow', detail: `Menambah workflow: ${w.nama}` });
      },
      updateWorkflow: (id, data) => {
        set((state) => ({
          workflows: state.workflows.map(w => w.id === id ? { ...w, ...data } : w)
        }));
      },
      deleteWorkflow: (id) => {
        set((state) => ({ workflows: state.workflows.filter(w => w.id !== id) }));
      },

      // ==================== COMPUTED HELPERS ====================
      getSisaCuti: (karyawanId) => {
        const state = get();
        const k = state.karyawan.find(x => x.id === karyawanId);
        if (!k || k.punyaCuti !== 'ya') return 0;
        const hak = state.pengaturan.cutiTahunan;
        const tahunSekarang = new Date().getFullYear().toString();
        const terpakai = state.cuti
          .filter(c => c.karyawanId === karyawanId && c.mulai.startsWith(tahunSekarang) && c.status === 'Disetujui')
          .reduce((s, c) => s + c.hari, 0);
        return Math.max(0, hak - terpakai);
      },

      getSisaKasbonUM: (karyawanId) => {
        const state = get();
        return state.kasbon
          .filter(k => k.karyawanId === karyawanId && (k.via === 'UM' || k.via === 'Keduanya') && k.status === 'Aktif')
          .reduce((s, k) => s + Math.min(k.cicilanUM || k.cicilan || 0, k.sisaHutang), 0);
      },

      getSisaKasbonGaji: (karyawanId) => {
        const state = get();
        return state.kasbon
          .filter(k => k.karyawanId === karyawanId && (k.via === 'Gaji' || k.via === 'Keduanya') && k.status === 'Aktif')
          .reduce((s, k) => s + Math.min(k.cicilanGaji || k.cicilan || 0, k.sisaHutang), 0);
      },

      getPotonganDadakanUM: (karyawanId, mulai, selesai) => {
        const state = get();
        return state.potonganDadakan
          .filter(p => p.karyawanId === karyawanId && p.via === 'UM' && p.tanggal >= mulai && p.tanggal <= selesai)
          .reduce((s, p) => s + p.jumlah, 0);
      },

      getPotonganDadakanGaji: (karyawanId, bulan) => {
        const state = get();
        return state.potonganDadakan
          .filter(p => p.karyawanId === karyawanId && p.via === 'Gaji' && p.tanggal.startsWith(bulan))
          .reduce((s, p) => s + p.jumlah, 0);
      },

      getHariKerja: (mulai, selesai) => getHariKerjaFn(mulai, selesai),

      hitungUMKaryawan: (karyawanId, periodeVal) => {
        const state = get();
        const k = state.karyawan.find(x => x.id === karyawanId);
        if (!k) return { hadir: 0, alpha: 0, umDiterima: 0, ket: '', punyaCuti: 'tidak' };

        const kamis = new Date(periodeVal);
        const jumat = new Date(kamis);
        jumat.setDate(kamis.getDate() - 6);
        const mulaiStr = `${jumat.getFullYear()}-${String(jumat.getMonth() + 1).padStart(2, '0')}-${String(jumat.getDate()).padStart(2, '0')}`;
        const selesaiStr = periodeVal;

        const abs = state.absensi.filter(a =>
          a.karyawanId === karyawanId &&
          a.tanggal >= mulaiStr &&
          a.tanggal <= selesaiStr
        );

        const hadir = abs.filter(a => a.status === 'Hadir').length;
        const alpha = abs.filter(a => a.status === 'Alpha').length;
        const umRate = k.uangMakan || state.pengaturan.umPerHari;
        let umDiterima = hadir * umRate;

        if (k.punyaCuti === 'ya' && alpha > 0) {
          umDiterima = 0;
        }

        let ket = '';
        if (k.punyaCuti !== 'ya' && alpha > 0) {
          ket = `${alpha} alpha - UM dipotong`;
        }

        return { hadir, alpha, umDiterima, ket, punyaCuti: k.punyaCuti };
      },

      hitungUMKaryawanBulan: (karyawanId, bulan) => {
        const state = get();
        const k = state.karyawan.find(x => x.id === karyawanId);
        if (!k) return { hadir: 0, alpha: 0, umDiterima: 0, punyaCuti: 'tidak' };

        const abs = state.absensi.filter(a =>
          a.karyawanId === karyawanId &&
          a.tanggal.startsWith(bulan)
        );

        const hadir = abs.filter(a => a.status === 'Hadir').length;
        const alpha = abs.filter(a => a.status === 'Alpha').length;
        const umRate = k.uangMakan || state.pengaturan.umPerHari;
        let umDiterima = hadir * umRate;

        if (k.punyaCuti === 'ya' && alpha > 0) {
          umDiterima = 0;
        }

        return { hadir, alpha, umDiterima, punyaCuti: k.punyaCuti };
      },

      hitungGajiKaryawan: (k, periode) => {
        const state = get();
        const [pY, pM] = periode.split('-').map(Number);
        const daysInMonth = new Date(pY, pM, 0).getDate();
        const mulaiBulan = `${periode}-01`;
        const selesaiBulan = `${periode}-${String(daysInMonth).padStart(2, '0')}`;

        const absBulan = state.absensi.filter(a =>
          a.karyawanId === k.id &&
          a.tanggal >= mulaiBulan &&
          a.tanggal <= selesaiBulan
        );

        const hariHadir = absBulan.filter(a => a.status === 'Hadir').length;
        const alphaCount = absBulan.filter(a => a.status === 'Alpha').length;

        const insentif = alphaCount === 0 ? (state.pengaturan.insentifKehadiran || 300000) : 0;

        const uangMakan = k.umMode === 'bulanan'
          ? hariHadir * state.pengaturan.umPerHariHO
          : 0;

        const lembur = state.lembur
          .filter(l => l.karyawanId === k.id && l.status === 'Disetujui' && l.tanggal.startsWith(periode))
          .reduce((s, l) => s + l.totalUpah, 0);

        const bpjs = Math.round(k.gajiPokok * (state.pengaturan.bpjsKaryawan / 100));

        const totalMenitTelat = absBulan.reduce((s, a) => s + (a.menitTelat || 0), 0);
        const potonganTelat = totalMenitTelat * state.pengaturan.potonganTelat;

        const potonganKasbon = state.getSisaKasbonGaji(k.id);

        const potonganDadakanGaji = state.getPotonganDadakanGaji(k.id, periode);

        const total = k.gajiPokok + k.tunjangan + insentif + uangMakan + lembur - bpjs - potonganTelat - potonganKasbon - potonganDadakanGaji;

        return {
          gaji: k.gajiPokok,
          tunjangan: k.tunjangan,
          insentif,
          uangMakan,
          lembur,
          bpjs,
          potonganTelat,
          totalMenitTelat,
          potonganKasbon,
          potonganDadakanGaji,
          total,
        };
      },

      // ==================== DATA MANAGEMENT ====================
      resetAllData: () => {
        const state = get();
        get().addAuditLog({ user: state.userName, role: state.userRole || 'staff', aksi: 'DELETE', modul: 'System', detail: 'Reset semua data ke default' });
        set({
          karyawan: initialKaryawan,
          absensi: [],
          lembur: [],
          cuti: [],
          kasbon: [],
          gaji: [],
          potonganDadakan: [],
          umBayar: {},
          pengaturan: defaultPengaturan,
          auditLogs: [],
          notifications: [],
          dokumen: [],
          templates: [],
          workflows: [],
          roles: defaultRoles,
          users: defaultUsers,
        });
      },

      exportAllData: () => {
        const state = get();
        const exportData = {
          karyawan: state.karyawan,
          absensi: state.absensi,
          lembur: state.lembur,
          cuti: state.cuti,
          kasbon: state.kasbon,
          gaji: state.gaji,
          potonganDadakan: state.potonganDadakan,
          umBayar: state.umBayar,
          pengaturan: state.pengaturan,
          auditLogs: state.auditLogs,
          roles: state.roles,
          users: state.users,
          notifications: state.notifications,
          dokumen: state.dokumen,
          templates: state.templates,
          workflows: state.workflows,
          exportedAt: nowStr(),
          version: '6.0',
        };
        get().addAuditLog({ user: state.userName, role: state.userRole || 'staff', aksi: 'EXPORT', modul: 'Backup', detail: 'Export seluruh database' });
        return JSON.stringify(exportData, null, 2);
      },

      importAllData: (json) => {
        try {
          const data = JSON.parse(json);
          if (!data.karyawan || !Array.isArray(data.karyawan)) return false;
          set({
            karyawan: data.karyawan || initialKaryawan,
            absensi: data.absensi || [],
            lembur: data.lembur || [],
            cuti: data.cuti || [],
            kasbon: data.kasbon || [],
            gaji: data.gaji || [],
            potonganDadakan: data.potonganDadakan || [],
            umBayar: data.umBayar || {},
            pengaturan: data.pengaturan || defaultPengaturan,
            auditLogs: data.auditLogs || [],
            roles: data.roles || defaultRoles,
            users: data.users || defaultUsers,
            dokumen: data.dokumen || [],
            templates: data.templates || [],
            workflows: data.workflows || [],
          });
          get().addAuditLog({ user: get().userName, role: get().userRole || 'staff', aksi: 'IMPORT', modul: 'Backup', detail: 'Import database dari backup' });
          get().addNotification({ judul: 'Restore Berhasil', pesan: 'Database berhasil dipulihkan dari backup', type: 'success', modul: 'Backup' });
          return true;
        } catch {
          return false;
        }
      },

      // ==================== TURNOVER PREDICTION ====================
      getTurnoverPrediction: () => {
        const state = get();
        const aktif = state.karyawan.filter(k => k.status === 'Aktif');
        const predictions: TurnoverPrediction[] = [];

        aktif.forEach(k => {
          const indicators: string[] = [];
          let riskScore = 0;

          // Alpha frequency (last 30 days)
          const lastMonth = new Date();
          lastMonth.setDate(lastMonth.getDate() - 30);
          const monthStr = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;
          const absBulan = state.absensi.filter(a => a.karyawanId === k.id && a.tanggal.startsWith(monthStr));
          const alphaCount = absBulan.filter(a => a.status === 'Alpha').length;
          if (alphaCount >= 3) {
            riskScore += 30;
            indicators.push(`${alphaCount}x alpha bulan ini`);
          } else if (alphaCount >= 1) {
            riskScore += 10;
            indicators.push(`${alphaCount}x alpha bulan ini`);
          }

          // Late frequency
          const totalMenitTelat = absBulan.reduce((s, a) => s + (a.menitTelat || 0), 0);
          if (totalMenitTelat > 60) {
            riskScore += 15;
            indicators.push(`${totalMenitTelat} menit telat bulan ini`);
          }

          // Pending lembur (disengagement signal)
          const pendingLembur = state.lembur.filter(l => l.karyawanId === k.id && l.status === 'Pending').length;
          if (pendingLembur > 2) {
            riskScore += 10;
            indicators.push(`${pendingLembur} lembur belum diapprove`);
          }

          // High kasbon
          const totalKasbon = state.kasbon
            .filter(kb => kb.karyawanId === k.id && kb.status === 'Aktif')
            .reduce((s, kb) => s + kb.sisaHutang, 0);
          if (totalKasbon > k.gajiPokok * 0.5) {
            riskScore += 20;
            indicators.push(`Kasbon tinggi: Rp ${totalKasbon.toLocaleString('id-ID')}`);
          }

          // Low gaji relative to tenure
          const tenure = (Date.now() - new Date(k.tanggalMasuk).getTime()) / (365 * 24 * 3600 * 1000);
          if (tenure > 2 && k.gajiPokok < 5000000) {
            riskScore += 15;
            indicators.push(`Gaji stagnan (${Math.floor(tenure)} tahun)`);
          }

          // Determine risk level
          let riskLevel: 'low' | 'medium' | 'high' | 'critical';
          if (riskScore >= 60) riskLevel = 'critical';
          else if (riskScore >= 40) riskLevel = 'high';
          else if (riskScore >= 20) riskLevel = 'medium';
          else riskLevel = 'low';

          if (indicators.length > 0) {
            predictions.push({ karyawanId: k.id, nama: k.nama, divisi: k.divisi, riskScore, riskLevel, indicators });
          }
        });

        return predictions.sort((a, b) => b.riskScore - a.riskScore);
      },

      // ==================== PAYROLL FORECAST ====================
      getPayrollForecast: (months) => {
        const state = get();
        const aktif = state.karyawan.filter(k => k.status === 'Aktif');
        const forecasts: PayrollForecast[] = [];

        for (let i = 0; i < months; i++) {
          const d = new Date();
          d.setMonth(d.getMonth() + i);
          const periode = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

          let estimasiGaji = 0;
          let estimasiLembur = 0;
          let estimasiUM = 0;

          aktif.forEach(k => {
            estimasiGaji += k.gajiPokok + k.tunjangan;

            // Estimate lembur (average from last 3 months or default)
            const last3Lembur = state.lembur
              .filter(l => l.karyawanId === k.id && l.status === 'Disetujui')
              .reduce((s, l) => s + l.totalUpah, 0);
            estimasiLembur += Math.round(last3Lembur / 3);

            // Estimate UM
            const hariKerja = 22;
            const umRate = k.uangMakan || state.pengaturan.umPerHari;
            estimasiUM += hariKerja * umRate;
          });

          forecasts.push({
            periode,
            estimasiGaji,
            estimasiLembur,
            estimasiUM,
            estimasiTotal: estimasiGaji + estimasiLembur + estimasiUM,
          });
        }

        return forecasts;
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        karyawan: state.karyawan,
        absensi: state.absensi,
        lembur: state.lembur,
        cuti: state.cuti,
        kasbon: state.kasbon,
        gaji: state.gaji,
        potonganDadakan: state.potonganDadakan,
        umBayar: state.umBayar,
        pengaturan: state.pengaturan,
        auditLogs: state.auditLogs,
        roles: state.roles,
        users: state.users,
        notifications: state.notifications,
        dokumen: state.dokumen,
        templates: state.templates,
        workflows: state.workflows,
        language: state.language,
      }),
      merge: (persisted, current) => {
        // Ensure all arrays exist (handle old localStorage without new fields)
        const p = persisted as Record<string, unknown>;
        return {
          ...current,
          ...p,
          kasbon: Array.isArray(p.kasbon) ? p.kasbon : [],
          potonganDadakan: Array.isArray(p.potonganDadakan) ? p.potonganDadakan : [],
          auditLogs: Array.isArray(p.auditLogs) ? p.auditLogs : [],
          roles: Array.isArray(p.roles) && p.roles.length > 0 ? p.roles : current.roles,
          users: Array.isArray(p.users) && p.users.length > 0 ? p.users : current.users,
          notifications: Array.isArray(p.notifications) ? p.notifications : [],
          dokumen: Array.isArray(p.dokumen) ? p.dokumen : [],
          templates: Array.isArray(p.templates) ? p.templates : [],
          workflows: Array.isArray(p.workflows) ? p.workflows : [],
          umBayar: p.umBayar || {},
          pengaturan: p.pengaturan || defaultPengaturan,
        } as typeof current;
      },
    }
  )
);

export default useAppStore;
