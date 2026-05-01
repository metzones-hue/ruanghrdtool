import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import useAppStore from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import { Shield, Trash2, Download, Search, FileText, LogIn, LogOut, CheckCircle, XCircle, Plus, Edit, AlertTriangle } from 'lucide-react';

const getAksiIcon = (aksi: string) => {
  switch (aksi) {
    case 'CREATE': return <Plus className="w-3.5 h-3.5 text-emerald-500" />;
    case 'UPDATE': return <Edit className="w-3.5 h-3.5 text-blue-500" />;
    case 'DELETE': return <Trash2 className="w-3.5 h-3.5 text-red-500" />;
    case 'APPROVE': return <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />;
    case 'REJECT': return <XCircle className="w-3.5 h-3.5 text-orange-500" />;
    case 'BAYAR': return <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />;
    case 'LOGIN': return <LogIn className="w-3.5 h-3.5 text-blue-500" />;
    case 'LOGOUT': return <LogOut className="w-3.5 h-3.5 text-gray-500" />;
    case 'EXPORT': return <Download className="w-3.5 h-3.5 text-purple-500" />;
    case 'IMPORT': return <FileText className="w-3.5 h-3.5 text-purple-500" />;
    default: return <AlertTriangle className="w-3.5 h-3.5 text-gray-500" />;
  }
};

const getAksiColor = (aksi: string) => {
  switch (aksi) {
    case 'CREATE': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    case 'UPDATE': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    case 'DELETE': return 'bg-red-500/10 text-red-600 border-red-500/20';
    case 'APPROVE': case 'BAYAR': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    case 'REJECT': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
    case 'LOGIN': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    case 'LOGOUT': return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    case 'EXPORT': case 'IMPORT': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
    default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
  }
};

export default function AuditTrailPage() {
  const { auditLogs, clearAuditLogs, hasPermission } = useAppStore();
  const [search, setSearch] = useState('');
  const [filterModul, setFilterModul] = useState('');
  const [filterAksi, setFilterAksi] = useState('');

  if (!hasPermission('audit:view')) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Shield className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-neutral-100">Akses Ditolak</h2>
          <p className="text-gray-500 dark:text-neutral-400 text-sm">Anda tidak memiliki izin untuk mengakses Audit Trail</p>
        </div>
      </div>
    );
  }

  const modulList = [...new Set(auditLogs.map(l => l.modul))];
  const aksiList = [...new Set(auditLogs.map(l => l.aksi))];

  const filtered = auditLogs.filter(l => {
    const matchSearch = !search || l.detail.toLowerCase().includes(search.toLowerCase()) || l.user.toLowerCase().includes(search.toLowerCase());
    const matchModul = filterModul === 'all' || !filterModul || l.modul === filterModul;
    const matchAksi = filterAksi === 'all' || !filterAksi || l.aksi === filterAksi;
    return matchSearch && matchModul && matchAksi;
  }).sort((a, b) => new Date(b.waktu).getTime() - new Date(a.waktu).getTime());

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100">Audit Trail</h1>
          <p className="text-gray-500 dark:text-neutral-400 text-sm">Riwayat perubahan sistem — {filtered.length} log</p>
        </div>
        <Button variant="outline" onClick={() => {
          if (confirm('Hapus semua audit log? Tindakan ini tidak bisa dibatalkan.')) {
            clearAuditLogs();
            toast.success('Audit log dibersihkan');
          }
        }} className="text-red-500 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950">
          <Trash2 className="w-4 h-4 mr-2" /> Bersihkan Log
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Cari detail atau user..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800" />
        </div>
        <Select value={filterModul} onValueChange={setFilterModul}>
          <SelectTrigger className="w-[160px] bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800"><SelectValue placeholder="Semua Modul" /></SelectTrigger>
          <SelectContent className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
            <SelectItem value="all">Semua Modul</SelectItem>
            {modulList.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterAksi} onValueChange={setFilterAksi}>
          <SelectTrigger className="w-[140px] bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800"><SelectValue placeholder="Semua Aksi" /></SelectTrigger>
          <SelectContent className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
            <SelectItem value="all">Semua Aksi</SelectItem>
            {aksiList.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
        <CardHeader className="pb-0">
          <CardTitle className="text-sm text-gray-500 dark:text-neutral-400 font-medium">Log Aktivitas</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400 dark:text-neutral-600">
              <FileText className="w-10 h-10 mx-auto mb-2" />
              <p>Tidak ada audit log</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
              {filtered.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-900/50 transition-colors">
                  <div className="mt-0.5">{getAksiIcon(log.aksi)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={cn("px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border", getAksiColor(log.aksi))}>{log.aksi}</span>
                      <span className="text-xs text-gray-400 dark:text-neutral-600">{log.modul}</span>
                      <span className="text-xs text-gray-300 dark:text-neutral-700">{log.waktu}</span>
                    </div>
                    <p className="text-sm text-gray-800 dark:text-neutral-200">{log.detail}</p>
                    <p className="text-xs text-gray-400 dark:text-neutral-600 mt-0.5">oleh <span className="font-medium">{log.user}</span> ({log.role})</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
