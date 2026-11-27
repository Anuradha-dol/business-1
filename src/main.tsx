import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { InvitationProvider } from './contexts/InvitationContext';
import App from './App';
import './index.css';

const AdminApp = lazy(() => import('./admin/AdminApp'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Admin route — completely separate, lazy-loaded */}
        <Route path="/admin/*" element={
          <Suspense fallback={<div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'#0f172a',color:'#94a3b8',fontFamily:'system-ui' }}>Loading admin…</div>}>
            <AdminApp />
          </Suspense>
        } />

        {/* Guest-facing wedding site */}
        <Route path="/*" element={
          <InvitationProvider>
            <App />
          </InvitationProvider>
        } />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
