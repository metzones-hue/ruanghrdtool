import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import useAppStore from '@/store/useAppStore';
import { useDemoInjector } from '@/hooks/useDemoInjector';
import { fRp } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, ClipboardCheck, Clock, Banknote, Database, Download, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { exportDemoToXLSX } from '@/data/demoSeed';
import { getCabangKodeList } from '@/data/seed';

const StatCard = ({ title, value, subtitle, icon: Icon, color }: { title: string; value: string | number; subtitle?: string; icon: React.ElementType; color: string }) => (
  <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700 transition-colors">
    <CardContent className="p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-gray-500 dark:text-neutral-400 text-sm">{title}</p>
          <p className={cn("text-2xl font-bold", color)}>{value}</p>
          {subtitle && <p className="text-gray-400 dark:text-neutral-600 text-xs">{subtitle}</p>}
        </div>
        <div className={cn("p-3 rounded-xl", color.replace('text-', 'bg-').replace('500', '500/10').replace('400', '500/10').replace('amber', 'amber').replace('emerald', 'emerald').replace('blue', 'blue').replace('purple', 'purple'))}>
          <Icon className={cn("w-5 h-5", color)} />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function DashboardPage() {
  const { karyawan, absensi, lembur, gaji, isLoggedIn, userName } = useAppStore();
  const { inject, isInjecting, progress, hasData } = useDemoInjector();
  const [clock, setClock] = useState(new Date());
  const [summaryShown, setSummaryShown] = useState(false);

  // Real-time clock
  useEffect(() => {
    const interval = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Show summary toast on first login
  useEffect(() => {
    if (isLoggedIn && !summaryShown) {
      setSummaryShown(true);
      const pendingLembur = lembur.filter(l => l.status === 'Pending').length;
      const totalKaryawan = karyawan.filter(k => k.status === 'Aktif').length;
      if (pendingLembur > 0) {
        toast.info(`📋 ${pendingLembur} lembur pending menunggu approval`, { duration: 5000 });
      }
      toast.success(`Selamat datang, ${userName}! ${totalKaryawan} karyawan aktif`, { duration: 3000 });
    }
  }, [isLoggedIn, summaryShown, lembur, karyawan, userName]);

  const aktif = karyawan.filter(k => k.status === 'Aktif');
  const totalKaryawan = aktif.length;
  const bulanIni = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;

  const today = new Date().toISOString().split('T')[0];
  const absensiHariIni = absensi.filter(a => a.tanggal === today);
  const hadirHariIni = absensiHariIni.filter(a => a.status === 'Hadir').length;
  const lemburPending = lembur.filter(l => l.status === 'Pending').length;
  const totalLemburBulanIni = lembur.filter(l => l.tanggal.startsWith(bulanIni) && l.status === 'Disetujui').reduce((s, l) => s + l.totalUpah, 0);
  const totalGajiBulanIni = gaji.filter(g => g.periode === bulanIni).reduce((s, g) => s + g.total, 0);

  const cabangData = getCabangKodeList().map(c => ({ name: c, value: aktif.filter(k => k.divisi === c).length }));
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const absensiChartData = last7Days.map(date => ({
    name: new Date(date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' }),
    hadir: absensi.filter(a => a.tanggal === date && a.status === 'Hadir').length,
    alpha: absensi.filter(a => a.tanggal === date && a.status === 'Alpha').length,
    cuti: absensi.filter(a => a.tanggal === date && a.status === 'Cuti').length,
  }));

  const PIE_COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#06b6d4'];

  const handleDownloadTemplate = () => {
    const data = exportDemoToXLSX();
    const wb = XLSX.utils.book_new();
    const wsAbsen = XLSX.utils.json_to_sheet(data.absensi);
    XLSX.utils.book_append_sheet(wb, wsAbsen, 'Absensi');
    const wsLembur = XLSX.utils.json_to_sheet(data.lembur);
    XLSX.utils.book_append_sheet(wb, wsLembur, 'Lembur');
    XLSX.writeFile(wb, 'RuangHRD_Demo_Data.xlsx');
    toast.success('Template Excel di-download');
  };

  const shortcuts = [
    { label: 'Absensi', desc: `${hadirHariIni} hadir hari ini`, path: '/absensi', color: 'text-emerald-500' },
    { label: 'Lembur', desc: `${lemburPending} menunggu approval`, path: '/lembur', color: 'text-amber-500' },
    { label: 'Gaji', desc: fRp(totalGajiBulanIni), path: '/gaji', color: 'text-blue-500' },
    { label: 'UM Mingguan', desc: 'Kelola pembayaran', path: '/um', color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Clock */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100">Dashboard</h1>
          <p className="text-gray-500 dark:text-neutral-400 text-sm mt-1">Ringkasan data HRD RuangPrint</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-mono font-bold text-amber-500">{clock.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
            <div className="text-xs text-gray-400 dark:text-neutral-600">{clock.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
          </div>
          {!hasData ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleDownloadTemplate} className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 text-gray-600 dark:text-neutral-300">
                <Download className="w-4 h-4 mr-1" /> Template
              </Button>
              <Button onClick={inject} disabled={isInjecting} className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">
                {isInjecting ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> {Math.round(progress)}%</> : <><Database className="w-4 h-4 mr-1" /> Inject Demo</>}
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={handleDownloadTemplate} className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 text-gray-600 dark:text-neutral-300">
              <Download className="w-3.5 h-3.5 mr-1" /> Export Excel
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Karyawan" value={totalKaryawan} subtitle={`${aktif.filter(k => k.jenisKelamin === 'L').length} Laki, ${aktif.filter(k => k.jenisKelamin === 'P').length} Perempuan`} icon={Users} color="text-amber-500" />
        <StatCard title="Hadir Hari Ini" value={`${hadirHariIni}`} subtitle={`dari ${aktif.length} karyawan aktif`} icon={ClipboardCheck} color="text-emerald-500" />
        <StatCard title="Lembur Bulan Ini" value={fRp(totalLemburBulanIni)} subtitle={`${lemburPending} pending approval`} icon={Clock} color="text-blue-500" />
        <StatCard title="Gaji Bulan Ini" value={fRp(totalGajiBulanIni)} subtitle={`${gaji.filter(g => g.periode === bulanIni).length} karyawan`} icon={Banknote} color="text-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
          <CardContent className="p-4">
            <p className="text-gray-600 dark:text-neutral-400 text-sm font-medium mb-4">Absensi 7 Hari Terakhir</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={absensiChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="hadir" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="alpha" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cuti" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
          <CardContent className="p-4">
            <p className="text-gray-600 dark:text-neutral-400 text-sm font-medium mb-4">Distribusi per Cabang</p>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={cabangData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {cabangData.map((_, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 lg:col-span-2">
          <CardContent className="p-4">
            <p className="text-gray-600 dark:text-neutral-400 text-sm font-medium mb-3">Lembur Terbaru</p>
            <div className="space-y-2">
              {lembur.slice(-5).reverse().map(l => (
                <div key={l.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-800">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <div><p className="text-gray-800 dark:text-neutral-200 text-sm font-medium">{l.nama}</p><p className="text-gray-400 dark:text-neutral-600 text-xs">{l.tanggal} &middot; {l.jamTotal} jam</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-amber-500 text-sm font-medium">{fRp(l.totalUpah)}</span>
                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium border", l.status === 'Disetujui' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : l.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20')}>{l.status}</span>
                  </div>
                </div>
              ))}
              {lembur.length === 0 && <p className="text-gray-400 dark:text-neutral-600 text-sm text-center py-4">Belum ada data lembur</p>}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
          <CardContent className="p-4">
            <p className="text-gray-600 dark:text-neutral-400 text-sm font-medium mb-3">Akses Cepat</p>
            <div className="space-y-2">
              {shortcuts.map((s, i) => (
                <button key={i} onClick={() => window.location.href = s.path} className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700 transition-colors text-left">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center bg-gray-200 dark:bg-neutral-700", s.color)}><span className="text-lg font-bold">{i + 1}</span></div>
                  <div><p className="text-gray-800 dark:text-neutral-200 text-sm font-medium">{s.label}</p><p className="text-gray-400 dark:text-neutral-600 text-xs">{s.desc}</p></div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
