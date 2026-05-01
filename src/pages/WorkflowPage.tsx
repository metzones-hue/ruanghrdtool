import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import useAppStore from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import { GitBranch, Plus, Trash2, ArrowRight, Shield, Clock, ToggleLeft, ToggleRight } from 'lucide-react';

export default function WorkflowPage() {
  const { workflows, addWorkflow, updateWorkflow, deleteWorkflow, hasPermission } = useAppStore();
  const [newName, setNewName] = useState('');
  const [newModul, setNewModul] = useState<'cuti' | 'lembur' | 'kasbon'>('cuti');
  const [steps, setSteps] = useState<{ role: string; urutan: number; autoEscalateHours?: number }[]>([{ role: '', urutan: 1 }]);

  if (!hasPermission('pengaturan:view')) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Shield className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-neutral-100">Akses Ditolak</h2>
          <p className="text-gray-500 dark:text-neutral-400 text-sm">Anda tidak memiliki izin</p>
        </div>
      </div>
    );
  }

  const addStep = () => setSteps([...steps, { role: '', urutan: steps.length + 1 }]);
  const removeStep = (i: number) => setSteps(steps.filter((_, idx) => idx !== i));
  const updateStep = (i: number, field: string, value: string | number) => {
    setSteps(steps.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  };

  const handleSave = () => {
    if (!newName || steps.some(s => !s.role)) { toast.error('Lengkapi semua field'); return; }
    addWorkflow({ nama: newName, modul: newModul, steps: steps.map(s => ({ ...s, id: s.urutan })), aktif: true });
    toast.success('Workflow dibuat');
    setNewName('');
    setSteps([{ role: '', urutan: 1 }]);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100">Approval Workflow</h1>
        <p className="text-gray-500 dark:text-neutral-400 text-sm">Atur rantai persetujuan untuk cuti, lembur, dan kasbon</p>
      </div>

      {/* Create */}
      <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
        <CardHeader><CardTitle className="text-sm font-medium flex items-center gap-2"><GitBranch className="w-4 h-4 text-amber-500" /> Workflow Baru</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input placeholder="Nama Workflow" value={newName} onChange={e => setNewName(e.target.value)} />
            <select value={newModul} onChange={e => setNewModul(e.target.value as 'cuti' | 'lembur' | 'kasbon')} className="p-2 rounded-md border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm text-gray-900 dark:text-neutral-200">
              <option value="cuti">Cuti</option>
              <option value="lembur">Lembur</option>
              <option value="kasbon">Kasbon</option>
            </select>
            <Button onClick={handleSave} className="bg-amber-500 text-black hover:bg-amber-400">Simpan Workflow</Button>
          </div>
          <div className="space-y-2">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg border border-gray-100 dark:border-neutral-800">
                <span className="text-xs font-bold text-gray-400 w-6">{step.urutan}</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-300" />
                <Input placeholder="Role yang approve (contoh: kepala_cabang)" value={step.role} onChange={e => updateStep(i, 'role', e.target.value)} className="flex-1 text-sm" />
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <Input type="number" placeholder="Jam" value={step.autoEscalateHours || ''} onChange={e => updateStep(i, 'autoEscalateHours', parseInt(e.target.value) || 0)} className="w-20 text-sm" />
                </div>
                {steps.length > 1 && <Button variant="ghost" size="sm" onClick={() => removeStep(i)} className="h-7 w-7 p-0 text-red-500"><Trash2 className="w-3.5 h-3.5" /></Button>}
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={addStep} className="text-gray-500"><Plus className="w-3.5 h-3.5 mr-1" /> Tambah Step</Button>
        </CardContent>
      </Card>

      {/* List */}
      <div className="space-y-3">
        {workflows.map(wf => (
          <Card key={wf.id} className={cn("bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800", !wf.aktif && 'opacity-60')}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-neutral-200">{wf.nama}</p>
                  <p className="text-xs text-gray-400 dark:text-neutral-600 capitalize">{wf.modul} · {wf.steps.length} approval step</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => { updateWorkflow(wf.id, { aktif: !wf.aktif }); toast.success(wf.aktif ? 'Workflow dinonaktifkan' : 'Workflow diaktifkan'); }} className="h-7 w-7 p-0">
                    {wf.aktif ? <ToggleRight className="w-5 h-5 text-emerald-500" /> : <ToggleLeft className="w-5 h-5 text-gray-400" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => { deleteWorkflow(wf.id); toast.success('Workflow dihapus'); }} className="h-7 w-7 p-0 text-red-500"><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {wf.steps.map((step, i) => (
                  <div key={step.id} className="flex items-center gap-2">
                    <div className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
                      <p className="text-xs font-medium text-amber-700 dark:text-amber-400">{step.role}</p>
                      {step.autoEscalateHours ? <p className="text-[10px] text-amber-500">esc {step.autoEscalateHours}h</p> : null}
                    </div>
                    {i < wf.steps.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-gray-300" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
        {workflows.length === 0 && <p className="text-center text-gray-400 dark:text-neutral-600 py-8">Belum ada workflow</p>}
      </div>
    </div>
  );
}
