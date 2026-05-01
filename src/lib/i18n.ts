import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  id: {
    translation: {
      appName: 'RuangHRD',
      nav: {
        dashboard: 'Dashboard',
        karyawan: 'Karyawan',
        absensi: 'Absensi',
        lembur: 'Lembur',
        um: 'Uang Makan',
        gaji: 'Penggajian',
        kasbon: 'Kasbon',
        cuti: 'Cuti',
        laporan: 'Laporan',
        asisten: 'Asisten AI',
        pengaturan: 'Pengaturan',
        offboarding: 'Offboarding',
        audit: 'Audit Trail',
        analitik: 'Analitik',
        dokumen: 'Dokumen',
        backup: 'Backup',
        rbac: 'Akses Pengguna',
        workflow: 'Workflow',
        notifikasi: 'Notifikasi',
      },
      actions: {
        simpan: 'Simpan',
        batal: 'Batal',
        tambah: 'Tambah',
        edit: 'Edit',
        hapus: 'Hapus',
        cetak: 'Cetak',
        export: 'Export',
        import: 'Import',
        cari: 'Cari',
        filter: 'Filter',
        reset: 'Reset',
        proses: 'Proses',
        bayar: 'Bayar',
        approve: 'Setuju',
        reject: 'Tolak',
        detail: 'Detail',
        tutup: 'Tutup',
      },
      status: {
        aktif: 'Aktif',
        nonaktif: 'Nonaktif',
        pending: 'Pending',
        disetujui: 'Disetujui',
        ditolak: 'Ditolak',
        hadir: 'Hadir',
        alpha: 'Alpha',
        cuti: 'Cuti',
        sakit: 'Sakit',
        izin: 'Izin',
        sudahDibayar: 'Sudah Dibayar',
        belumDibayar: 'Belum Dibayar',
      },
      common: {
        periode: 'Periode',
        cabang: 'Cabang',
        semua: 'Semua',
        total: 'Total',
        karyawan: 'Karyawan',
        tidakAdaData: 'Tidak ada data',
        loading: 'Memuat...',
        sukses: 'Berhasil',
        error: 'Gagal',
        konfirmasi: 'Konfirmasi',
        yakinHapus: 'Apakah Anda yakin ingin menghapus?',
      }
    }
  },
  en: {
    translation: {
      appName: 'RuangHRD',
      nav: {
        dashboard: 'Dashboard',
        karyawan: 'Employees',
        absensi: 'Attendance',
        lembur: 'Overtime',
        um: 'Meal Allowance',
        gaji: 'Payroll',
        kasbon: 'Cash Advance',
        cuti: 'Leave',
        laporan: 'Reports',
        asisten: 'AI Assistant',
        pengaturan: 'Settings',
        offboarding: 'Offboarding',
        audit: 'Audit Trail',
        analitik: 'Analytics',
        dokumen: 'Documents',
        backup: 'Backup',
        rbac: 'User Access',
        workflow: 'Workflow',
        notifikasi: 'Notifications',
      },
      actions: {
        simpan: 'Save',
        batal: 'Cancel',
        tambah: 'Add',
        edit: 'Edit',
        hapus: 'Delete',
        cetak: 'Print',
        export: 'Export',
        import: 'Import',
        cari: 'Search',
        filter: 'Filter',
        reset: 'Reset',
        proses: 'Process',
        bayar: 'Pay',
        approve: 'Approve',
        reject: 'Reject',
        detail: 'Detail',
        tutup: 'Close',
      },
      status: {
        aktif: 'Active',
        nonaktif: 'Inactive',
        pending: 'Pending',
        disetujui: 'Approved',
        ditolak: 'Rejected',
        hadir: 'Present',
        alpha: 'Absent',
        cuti: 'Leave',
        sakit: 'Sick',
        izin: 'Permission',
        sudahDibayar: 'Paid',
        belumDibayar: 'Unpaid',
      },
      common: {
        periode: 'Period',
        cabang: 'Branch',
        semua: 'All',
        total: 'Total',
        karyawan: 'Employee',
        tidakAdaData: 'No data available',
        loading: 'Loading...',
        sukses: 'Success',
        error: 'Error',
        konfirmasi: 'Confirm',
        yakinHapus: 'Are you sure you want to delete?',
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'id',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
