import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import useAppStore from '@/store/useAppStore';
import { fRp, currentBulan } from '@/lib/utils';
import { getCabangKodeList } from '@/data/seed';
import { Bot, Send, User, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AsistenPage() {
  const { karyawan, absensi, lembur, gaji, kasbon, cuti } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Halo! Saya Asisten HRD RuangPrint. Ada yang bisa saya bantu?\n\n**Perintah yang tersedia:**\n• "total karyawan" — jumlah karyawan aktif\n• "absensi hari ini" — ringkasan kehadiran\n• "lembur pending" — daftar lembur menunggu approval\n• "gaji bulan ini" — total penggajian\n• "kasbon aktif" — sisa kas bon\n• "sisa cuti [nama]" — cek sisa cuti karyawan\n• "info [nama]" — informasi karyawan',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processQuery = (query: string): string => {
    const q = query.toLowerCase().trim();
    const aktif = karyawan.filter(k => k.status === 'Aktif');
    const bulan = currentBulan();

    if (q.includes('total karyawan') || q.includes('jumlah karyawan')) {
      const byCabang = getCabangKodeList().map(c => {
        const count = aktif.filter(k => k.divisi === c).length;
        return `${c}: ${count}`;
      }).join(', ');
      return `Total karyawan aktif: **${aktif.length}** orang\n\nPer cabang:\n${byCabang}`;
    }

    if (q.includes('absensi hari ini') || q.includes('kehadiran hari ini')) {
      const today = new Date().toISOString().split('T')[0];
      const absHariIni = absensi.filter(a => a.tanggal === today);
      const hadir = absHariIni.filter(a => a.status === 'Hadir').length;
      const alpha = absHariIni.filter(a => a.status === 'Alpha').length;
      return `Absensi hari ini (${today}):\n• Hadir: **${hadir}**\n• Alpha: **${alpha}**\n• Total terinput: **${absHariIni.length}** dari ${aktif.length} karyawan aktif`;
    }

    if (q.includes('lembur pending') || q.includes('lembur menunggu')) {
      const pending = lembur.filter(l => l.status === 'Pending');
      const total = pending.reduce((s, l) => s + l.totalUpah, 0);
      return `Lembur pending: **${pending.length}** pengajuan\nTotal upah: **${fRp(total)}**`;
    }

    if (q.includes('gaji bulan ini') || q.includes('total gaji')) {
      const gajiBulan = gaji.filter(g => g.periode === bulan);
      const total = gajiBulan.reduce((s, g) => s + g.total, 0);
      return `Penggajian bulan ${bulan}:\n• Sudah dihitung: **${gajiBulan.length}** karyawan\n• Total: **${fRp(total)}**`;
    }

    if (q.includes('kasbon') || q.includes('kas bon')) {
      const aktifKasbon = kasbon.filter(k => k.status === 'Aktif');
      const total = aktifKasbon.reduce((s, k) => s + k.sisaHutang, 0);
      return `Kas bon aktif: **${aktifKasbon.length}** orang\nTotal sisa hutang: **${fRp(total)}**`;
    }

    if (q.includes('sisa cuti')) {
      const namaMatch = q.match(/sisa cuti\s+(.+)/);
      if (namaMatch) {
        const nama = namaMatch[1].trim();
        const k = aktif.find(x => x.nama.toLowerCase().includes(nama.toLowerCase()));
        if (!k) return `Karyawan "${nama}" tidak ditemukan.`;
        const tahunIni = new Date().getFullYear().toString();
        const terpakai = cuti
          .filter(c => c.karyawanId === k.id && c.mulai.startsWith(tahunIni) && c.status === 'Disetujui')
          .reduce((s, c) => s + c.hari, 0);
        const hak = k.punyaCuti === 'ya' ? 12 : 0;
        const sisa = Math.max(0, hak - terpakai);
        return `**${k.nama}** (${k.divisi})\n• Hak cuti: ${hak} hari/tahun\n• Terpakai: ${terpakai} hari\n• **Sisa: ${sisa} hari**`;
      }
    }

    if (q.includes('info')) {
      const namaMatch = q.match(/info\s+(.+)/);
      if (namaMatch) {
        const nama = namaMatch[1].trim();
        const k = aktif.find(x => x.nama.toLowerCase().includes(nama.toLowerCase()));
        if (!k) return `Karyawan "${nama}" tidak ditemukan.`;
        return `**${k.nama}**\n• NPK: ${k.npk}\n• Jabatan: ${k.jabatan}\n• Cabang: ${k.divisi}\n• Gaji Pokok: ${fRp(k.gajiPokok)}\n• Tunjangan: ${fRp(k.tunjangan)}\n• Shift: ${k.shift === 2 ? '2 (12:00-21:00)' : '1 (08:30-17:30)'}\n• Status: ${k.status}`;
      }
    }

    return `Maaf, saya tidak mengerti perintah "${query}".\n\nCoba perintah:\n• "total karyawan"\n• "absensi hari ini"\n• "lembur pending"\n• "gaji bulan ini"\n• "kasbon aktif"\n• "sisa cuti [nama]"\n• "info [nama]"`;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = processQuery(userMessage.content);
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-4 h-[calc(100vh-120px)] flex flex-col">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100 flex items-center gap-2">
          <Bot className="w-6 h-6 text-amber-400" /> Asisten HRD
        </h1>
        <p className="text-gray-500 dark:text-neutral-400 text-sm">Tanyakan data HRD secara interaktif</p>
      </div>

      <Card className="bg-white dark:bg-black border-gray-200 dark:border-neutral-800 flex-1 flex flex-col overflow-hidden">
        <CardContent className="p-0 flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-amber-400" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm ${
                  msg.role === 'user'
                    ? 'bg-amber-500 text-slate-900'
                    : 'bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-neutral-200'
                }`}>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  <div className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-amber-700' : 'text-gray-400 dark:text-neutral-500'}`}>
                    {msg.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-gray-600 dark:text-neutral-300" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-amber-400" />
                </div>
                <div className="bg-gray-100 dark:bg-neutral-900 rounded-xl px-4 py-2.5">
                  <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-neutral-800">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tanyakan sesuatu... (contoh: total karyawan)"
                className="bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-neutral-200 placeholder:text-gray-400 dark:text-neutral-500 focus-visible:ring-amber-500 dark:focus-visible:ring-amber-400"
              />
              <Button onClick={handleSend} disabled={!input.trim()} className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-3">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
