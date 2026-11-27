import { useEffect, useState } from 'react';
import { Calendar, ExternalLink, LogOut, MapPin, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { wedding } from '../data/wedding';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import './admin.css';

type View = 'dashboard';

export default function AdminApp() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [view]              = useState<View>('dashboard');

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
      <div className="adm-root">
        <div className="adm-splash">
          <span className="adm-spinner" />
          <span>Loading Wedding Concierge…</span>
        </div>
      </div>
    );
  }

  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />;

  const coupleTitle = `${wedding.bride} & ${wedding.groom}`;

  return (
    <div className="adm-root">
      <div className="adm-layout">
        {/* Mobile top bar */}
        <header className="adm-mobile-bar">
          <span className="adm-mobile-bar__brand">{coupleTitle}</span>
          <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={logout}>
            <LogOut size={14} />
            Sign Out
          </button>
        </header>

        {/* Sidebar */}
        <aside className="adm-sidebar">
          <div className="adm-sidebar__logo">
            <div className="adm-sidebar__eyebrow">Wedding Concierge</div>
            <div className="adm-sidebar__logo-name">{coupleTitle}</div>
            <div className="adm-sidebar__logo-sub">
              <Calendar size={12} />
              {wedding.dateLabel}
            </div>
          </div>

          <nav className="adm-sidebar__nav" aria-label="Admin navigation">
            <div className="adm-nav-section">Management</div>
            <button className={`adm-nav-item${view === 'dashboard' ? ' adm-nav-item--active' : ''}`}>
              <Users size={16} />
              <span>Guests &amp; RSVPs</span>
            </button>
            <a
              className="adm-nav-item"
              href={import.meta.env.BASE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink size={16} />
              <span>View Guest Invitation</span>
            </a>
          </nav>

          <div className="adm-sidebar__footer">
            <div className="adm-sidebar__venue">
              <MapPin size={14} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>{wedding.venue.name}, {wedding.venue.city}</span>
            </div>
            <button className="adm-btn adm-btn--ghost" style={{ width: '100%' }} onClick={logout}>
              <LogOut size={15} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main content */}
        {view === 'dashboard' && <AdminDashboard />}
      </div>
    </div>
  );
}
