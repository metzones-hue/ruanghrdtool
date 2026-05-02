import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import useAppStore from '@/store/useAppStore';
import { defaultPengaturan } from '@/data/seed';
import { Lock, User, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, pengaturan } = useAppStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const pg = pengaturan || defaultPengaturan;
      const pwdStaff = atob(pg.password);
      const pwdKepala = atob(pg.passwordKepala);
      if (username === 'hrd' && password === pwdStaff) {
        login('staff', 'Staff HRD');
        toast.success('Login berhasil sebagai Staff HRD');
        navigate('/');
      } else if (username === 'kepala' && password === pwdKepala) {
        login('kepala', 'Kepala HRD');
        toast.success('Login berhasil sebagai Kepala HRD');
        navigate('/');
      } else {
        toast.error('Username atau password salah!');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="RuangHRD" className="w-24 h-24 mx-auto object-contain" />          <h1 className="text-2xl font-bold text-amber-400">RuangHRD</h1>
          <p className="text-gray-500 dark:text-neutral-400 text-sm mt-1">Sistem HR Digital — RuangPrint</p>
        </div>
        <Card className="bg-white dark:bg-black border-gray-200 dark:border-neutral-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-gray-800 dark:text-neutral-200 text-lg">Masuk ke Sistem</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-600 dark:text-neutral-300">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-neutral-500" />
                  <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="hrd / kepala"
                    className="pl-10 bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-neutral-200" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-600 dark:text-neutral-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-neutral-500" />
                  <Input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    className="pl-10 pr-10 bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-neutral-200" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="pt-2">
                <Button type="submit" disabled={isLoading} className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold">
                  {isLoading ? 'Memuat...' : 'Masuk'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
 
