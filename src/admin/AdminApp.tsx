import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import './admin.css';

type View = 'dashboard';

export default function AdminApp() {
  const [authed, setAuthed]   = useState<boolean | null>(null);  // null = checking
  const [view]                = useState<View>('dashboard');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAuthed(!!data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(!!session);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
  };

  if (authed === null) {
    return (
      <div className="adm-root" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh' }}>
        <span className="adm-spinner" />
      </div>
    );
  }

  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />;

  return (
    <div className="adm-root">
      <div className="adm-layout">
        {/* Sidebar */}
        <aside className="adm-sidebar">
          <div className="adm-sidebar__logo">
            <div className="adm-sidebar__logo-name">H&amp;M Admin</div>
            <div className="adm-sidebar__logo-sub">Wedding Management</div>
          </div>
          <nav className="adm-sidebar__nav">
            <button className={`adm-nav-item${view === 'dashboard' ? ' adm-nav-item--active' : ''}`}>
              📋 &nbsp;Guests & RSVP
            </button>
          </nav>
          <div className="adm-sidebar__footer">
            <button className="adm-btn adm-btn--ghost" style={{ width:'100%' }} onClick={logout}>
              ⎋ &nbsp;Sign Out
            </button>
          </div>
        </aside>

        {/* Main content */}
        {view === 'dashboard' && <AdminDashboard />}
      </div>
    </div>
  );
}
