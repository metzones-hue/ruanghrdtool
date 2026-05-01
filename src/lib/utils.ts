import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ==================== FORMATTING ====================
export const fRp = (n: number): string => {
  return 'Rp ' + (n || 0).toLocaleString('id-ID');
};

export const getHari = (tgl: string): string => {
  const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  return hari[new Date(tgl).getDay()];
};

export const cekMinggu = (tgl: string): boolean => {
  return new Date(tgl).getDay() === 0;
};

export const cekAfter2230 = (jam: string): boolean => {
  if (!jam) return false;
  const [h, m] = jam.split(':').map(Number);
  return h > 22 || (h === 22 && m >= 30);
};

export const hitungJam = (mulai: string, selesai: string): number => {
  const toMin = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };
  const diff = toMin(selesai) - toMin(mulai);
  return Math.max(0, Math.round(diff / 60 * 10) / 10);
};

export const todayStr = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const currentBulan = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

export const getBulanOptions = (count: number = 6): { value: string; label: string }[] => {
  const options = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    options.push({ value: val, label: d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) });
  }
  return options;
};

export const getKamisList = (count: number = 12): { value: string; label: string }[] => {
  const list: { value: string; label: string }[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now);
    const dow = d.getDay();
    const diffToKamis = dow >= 4 ? dow - 4 : dow + 3;
    d.setDate(d.getDate() - diffToKamis - i * 7);
    const kamisStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (!list.find(x => x.value === kamisStr)) {
      const jumat = new Date(d);
      jumat.setDate(d.getDate() - 6);
      list.push({
        value: kamisStr,
        label: `Jum ${jumat.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} – Kam ${d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`
      });
    }
  }
  return list;
};

export const getPeriodeUM = (kamisStr: string): { mulai: string; selesai: string } => {
  const kamis = new Date(kamisStr);
  const jumat = new Date(kamis);
  jumat.setDate(kamis.getDate() - 6);
  const mulai = `${jumat.getFullYear()}-${String(jumat.getMonth() + 1).padStart(2, '0')}-${String(jumat.getDate()).padStart(2, '0')}`;
  return { mulai, selesai: kamisStr };
};

// ==================== COLOR UTILS ====================
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Hadir': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'Alpha': return 'bg-red-500/10 text-red-400 border-red-500/20';
    case 'Cuti': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'Sakit': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'Izin': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    case 'Disetujui': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'Pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'Ditolak': return 'bg-red-500/10 text-red-400 border-red-500/20';
    case 'Sudah Dibayar': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'Belum Dibayar': return 'bg-red-500/10 text-red-400 border-red-500/20';
    case 'Aktif': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'Lunas': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'Nonaktif': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
};
