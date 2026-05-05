import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import GovernmentHeader from './components/GovernmentHeader';
import Navbar from './components/Navbar';
import GovernmentFooter from './components/GovernmentFooter';
import FloatingCTA from './components/FloatingCTA';
import SecurityCleanup from './components/SecurityCleanup';
import './styles/mobile-ux.css';

// Lazy load pages for better performance
const Home = React.lazy(() => import('./pages/Home'));
const Berita = React.lazy(() => import('./pages/Berita'));
const BeritaDetail = React.lazy(() => import('./pages/BeritaDetail'));
const KontakDesa = React.lazy(() => import('./pages/KontakDesa'));
const PengajuanSurat = React.lazy(() => import('./pages/PengajuanSurat'));
const LayananSurat = React.lazy(() => import('./pages/LayananSurat'));
const StatusSurat = React.lazy(() => import('./pages/StatusSurat'));
const TentangDesa = React.lazy(() => import('./pages/TentangDesa'));
const DataDesa = React.lazy(() => import('./pages/DataDesa'));
const ProfilDesa = React.lazy(() => import('./pages/ProfilDesa'));
const Testimoni = React.lazy(() => import('./pages/Testimoni'));
const BantuanSosial = React.lazy(() => import('./pages/BantuanSosial'));
const Pengaduan = React.lazy(() => import('./pages/Pengaduan'));
const Transparansi = React.lazy(() => import('./pages/Transparansi'));
const PetaDesa = React.lazy(() => import('./pages/PetaDesa'));
const KebijakanData = React.lazy(() => import('./pages/KebijakanData'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const ServerError = React.lazy(() => import('./pages/ServerError'));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Memuat halaman...</p>
    </div>
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <AppProvider>
        <ThemeProvider>
          <ErrorBoundary>
            <SecurityCleanup />
            <Router>
            {/* Skip to content link for accessibility */}
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>

            <GovernmentHeader />
            <Navbar />
            <Suspense fallback={<PageLoader />}>
              <main id="main-content">
              <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/berita" element={<Berita />} />
              <Route path="/berita/:slug" element={<BeritaDetail />} />
              <Route path="/kontak" element={<KontakDesa />} />
              <Route path="/pengajuan-surat" element={<PengajuanSurat />} />
              <Route path="/status-surat" element={<StatusSurat />} />
              <Route path="/tentang-desa" element={<TentangDesa />} />
              <Route path="/data-desa" element={<DataDesa />} />
              <Route path="/testimoni" element={<Testimoni />} />

              {/* Additional routes */}
              <Route path="/profil-desa" element={<ProfilDesa />} />
                  <Route path="/bantuan-sosial" element={<BantuanSosial />} />
                  <Route path="/pengaduan" element={<Pengaduan />} />
                  <Route path="/layanan-surat" element={<LayananSurat />} />
              <Route path="/peta-desa" element={<PetaDesa />} />
              <Route path="/transparansi" element={<Transparansi />} />
              <Route path="/kebijakan-data" element={<KebijakanData />} />

              <Route path="/404" element={<NotFound />} />
              <Route path="/500" element={<ServerError />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            </main>
            </Suspense>
            <GovernmentFooter />
            <FloatingCTA />
          </Router>
        </ErrorBoundary>
      </ThemeProvider>
    </AppProvider>
    </HelmetProvider>
  );
}

export default App;

