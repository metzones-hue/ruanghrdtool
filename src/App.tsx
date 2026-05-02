import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { Sidebar } from '@/components/layout/Sidebar';
import { CommandPalette } from '@/components/shared/CommandPalette';
import { NotificationCenter } from '@/components/shared/NotificationCenter';
import useAppStore from '@/store/useAppStore';

import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import KaryawanPage from '@/pages/KaryawanPage';
import AbsensiPage from '@/pages/AbsensiPage';
import LemburPage from '@/pages/LemburPage';
import UMPage from '@/pages/UMPage';
import GajiPage from '@/pages/GajiPage';
import KasbonPage from '@/pages/KasbonPage';
import CutiPage from '@/pages/CutiPage';
import LaporanPage from '@/pages/LaporanPage';
import AsistenPage from '@/pages/AsistenPage';
import PengaturanPage from '@/pages/PengaturanPage';
import OffboardingPage from '@/pages/OffboardingPage';
// D Class pages
import AuditTrailPage from '@/pages/AuditTrailPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import DocumentsPage from '@/pages/DocumentsPage';
import BackupPage from '@/pages/BackupPage';
import RBACPage from '@/pages/RBACPage';
import WorkflowPage from '@/pages/WorkflowPage';

function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: 'staff' | 'kepala' | 'admin' }) {
  const { isLoggedIn, userRole } = useAppStore();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole && userRole !== 'kepala' && userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-black">
      <Sidebar />
      <main className="flex-1 lg:ml-[260px] transition-all duration-300">
        {/* Top Bar with Notification */}
        <div className="sticky top-0 z-20 bg-gray-50/80 dark:bg-black/80 backdrop-blur-sm px-4 lg:px-6 pt-4 pb-2">
          <div className="flex justify-end">
            <NotificationCenter />
          </div>
        </div>
        <div className="px-4 lg:px-6 pb-6 max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

function AppRoutes() {
  const { isLoggedIn } = useAppStore();

  return (
    <>
      {isLoggedIn && <CommandPalette />}
      <Routes>
        <Route path="/login" element={isLoggedIn ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/karyawan" element={<ProtectedRoute><KaryawanPage /></ProtectedRoute>} />
        <Route path="/absensi" element={<ProtectedRoute><AbsensiPage /></ProtectedRoute>} />
        <Route path="/lembur" element={<ProtectedRoute><LemburPage /></ProtectedRoute>} />
        <Route path="/um" element={<ProtectedRoute><UMPage /></ProtectedRoute>} />
        <Route path="/gaji" element={<ProtectedRoute requiredRole="kepala"><GajiPage /></ProtectedRoute>} />
        <Route path="/kasbon" element={<ProtectedRoute><KasbonPage /></ProtectedRoute>} />
        <Route path="/cuti" element={<ProtectedRoute><CutiPage /></ProtectedRoute>} />
        <Route path="/laporan" element={<ProtectedRoute requiredRole="kepala"><LaporanPage /></ProtectedRoute>} />
        <Route path="/asisten" element={<ProtectedRoute><AsistenPage /></ProtectedRoute>} />
        <Route path="/pengaturan" element={<ProtectedRoute requiredRole="kepala"><PengaturanPage /></ProtectedRoute>} />
        <Route path="/offboarding" element={<ProtectedRoute><OffboardingPage /></ProtectedRoute>} />
        {/* D Class routes */}
        <Route path="/audit" element={<ProtectedRoute><AuditTrailPage /></ProtectedRoute>} />
        <Route path="/analitik" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
        <Route path="/dokumen" element={<ProtectedRoute><DocumentsPage /></ProtectedRoute>} />
        <Route path="/backup" element={<ProtectedRoute><BackupPage /></ProtectedRoute>} />
        <Route path="/rbac" element={<ProtectedRoute><RBACPage /></ProtectedRoute>} />
        <Route path="/workflow" element={<ProtectedRoute><WorkflowPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#171717',
            color: '#e5e5e5',
            border: '1px solid #262626',
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
