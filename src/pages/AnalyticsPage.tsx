import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import useAppStore from '@/store/useAppStore';
import { fRp, cn } from '@/lib/utils';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, AlertTriangle, Users, DollarSign, Activity, Shield } from 'lucide-react';
import type { TurnoverPrediction } from '@/types';

const COLORS_RISK = { low: '#10b981', medium: '#f59e0b', high: '#f97316', critical: '#ef4444' };
const RISK_LABELS = { low: 'Rendah', medium: 'Sedang', high: 'Tinggi', critical: 'Kritis' };

export default function AnalyticsPage() {
  const { getTurnoverPrediction, getPayrollForecast, karyawan, hasPermission } = useAppStore();

  if (!hasPermission('analitik:view')) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Shield className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-neutral-100">Akses Ditolak</h2>
          <p className="text-gray-500 dark:text-neutral-400 text-sm">Anda tidak memiliki izin untuk mengakses Analitik</p>
        </div>
      </div>
    );
  }

  const turnover = useMemo(() => getTurnoverPrediction(), [getTurnoverPrediction]);
  const forecast = useMemo(() => getPayrollForecast(6), [getPayrollForecast]);

  const aktif = karyawan.filter(k => k.status === 'Aktif').length;
  const riskCounts = useMemo(() => {
    const c: Record<string, number> = { low: 0, medium: 0, high: 0, critical: 0 };
    turnover.forEach(t => c[t.riskLevel]++);
    return c;
  }, [turnover]);

  const riskPieData = Object.entries(riskCounts)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => ({ name: RISK_LABELS[k as keyof typeof RISK_LABELS], value: v, color: COLORS_RISK[k as keyof typeof COLORS_RISK] }));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100">Analitik & Prediksi</h1>
        <p className="text-gray-500 dark:text-neutral-400 text-sm">Insight data HR dan forecasting</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="text-gray-400 dark:text-neutral-600 text-xs">Total Karyawan Aktif</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-neutral-100 mt-1">{aktif}</p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-gray-400 dark:text-neutral-600 text-xs">Risk Kritis</span>
            </div>
            <p className="text-2xl font-bold text-red-500 mt-1">{riskCounts.critical}</p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span className="text-gray-400 dark:text-neutral-600 text-xs">Est. Gaji Bulan Ini</span>
            </div>
            <p className="text-lg font-bold text-emerald-500 mt-1">{forecast[0] ? fRp(forecast[0].estimasiTotal) : '-'}</p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-500" />
              <span className="text-gray-400 dark:text-neutral-600 text-xs">Total Risk Tinggi+</span>
            </div>
            <p className="text-2xl font-bold text-orange-500 mt-1">{riskCounts.high + riskCounts.critical}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Turnover Risk */}
        <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              Prediksi Turnover
            </CardTitle>
          </CardHeader>
          <CardContent>
            {turnover.length === 0 ? (
              <p className="text-center text-gray-400 dark:text-neutral-600 py-8">Semua karyawan dalam kondisi stabil</p>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {turnover.slice(0, 10).map((t: TurnoverPrediction) => (
                  <div key={t.karyawanId} className="p-3 rounded-lg border border-gray-100 dark:border-neutral-800">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-neutral-200">{t.nama}</p>
                        <p className="text-xs text-gray-400 dark:text-neutral-600">{t.divisi}</p>
                      </div>
                      <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase", {
                        'bg-emerald-500/10 text-emerald-500': t.riskLevel === 'low',
                        'bg-amber-500/10 text-amber-500': t.riskLevel === 'medium',
                        'bg-orange-500/10 text-orange-500': t.riskLevel === 'high',
                        'bg-red-500/10 text-red-500': t.riskLevel === 'critical',
                      })}>
                        {RISK_LABELS[t.riskLevel]} ({t.riskScore})
                      </span>
                    </div>
                    <Progress value={Math.min(t.riskScore, 100)} className="h-1.5 mb-2" />
                    <div className="flex flex-wrap gap-1">
                      {t.indicators.map((ind, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-neutral-500">{ind}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Risk Distribution Pie */}
        <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Distribusi Risk Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskPieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                    {riskPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {riskPieData.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-xs text-gray-500 dark:text-neutral-400">{d.name} ({d.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Forecast */}
      <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            Forecast Penggajian 6 Bulan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="periode" tick={{ fontSize: 11, fill: '#888' }} />
                <YAxis tick={{ fontSize: 11, fill: '#888' }} tickFormatter={(v: number) => `${(v / 1000000).toFixed(0)}M`} />
                <Tooltip formatter={(value: number) => fRp(value)} />
                <Area type="monotone" dataKey="estimasiGaji" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="Gaji" />
                <Area type="monotone" dataKey="estimasiLembur" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} name="Lembur" />
                <Area type="monotone" dataKey="estimasiUM" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="UM" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-3">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-emerald-500/50" /><span className="text-xs text-gray-500 dark:text-neutral-400">Gaji Pokok + Tunjangan</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-amber-500/50" /><span className="text-xs text-gray-500 dark:text-neutral-400">Lembur</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-blue-500/50" /><span className="text-xs text-gray-500 dark:text-neutral-400">Uang Makan</span></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
