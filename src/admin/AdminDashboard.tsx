import { useState, useEffect, useCallback } from 'react';
import { supabase, type Guest, type Rsvp, formatGreeting } from '../lib/supabase';
import './admin.css';

type InvitationType = Guest['invitation_type'];
type GuestWithRsvp = Guest & { rsvp: Rsvp | null };

const SITE_URL = 'https://a042c208.himeshi-and-madhawa.pages.dev';

function inviteLink(token: string) {
  return `${SITE_URL}/?invite=${token}`;
}

function copy(text: string) {
  navigator.clipboard.writeText(text).catch(() => {});
}

function whatsapp(guest: Guest) {
  const link = inviteLink(guest.token);
  const name = guest.title ? `${guest.title} ${guest.name}` : guest.name;
  const msg  = encodeURIComponent(
    `Dear ${name},\n\nYou are cordially invited to the wedding of Himeshi & Madhawa on 15 January 2027.\n\nOpen your personal invitation: ${link}`
  );
  window.open(`https://wa.me/?text=${msg}`, '_blank');
}

// ── Invitation Preview ───────────────────────────────────────
function InvitationPreview({ guest }: { guest: Partial<Guest> }) {
  if (!guest.name) return null;
  const g = { name: guest.name, title: guest.title ?? null, invitation_type: guest.invitation_type ?? 'individual', partner_name: guest.partner_name ?? null };
  const greeting = formatGreeting(g as Guest);
  return (
    <div className="adm-preview">
      <div className="adm-preview__greeting">With joyful hearts, together with our families</div>
      <div className="adm-preview__name">{greeting}</div>
      <div className="adm-preview__msg">request the pleasure of your company at the celebration of their union</div>
    </div>
  );
}

// ── Create / Edit Modal ──────────────────────────────────────
interface GuestModalProps {
  editing: Guest | null;
  onClose: () => void;
  onSaved: () => void;
}

function GuestModal({ editing, onClose, onSaved }: GuestModalProps) {
  const [form, setForm] = useState<Partial<Guest>>(() => editing ?? {
    name: '', title: '', invitation_type: 'individual', partner_name: '', max_guests: 1, contact: '', custom_greeting: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const set = (key: keyof Guest, val: string | number) => setForm(f => ({ ...f, [key]: val }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    const payload = {
      name:            form.name,
      title:           form.title || null,
      invitation_type: form.invitation_type,
      partner_name:    form.partner_name || null,
      max_guests:      Number(form.max_guests) || 1,
      contact:         form.contact || null,
      custom_greeting: form.custom_greeting || null,
    };
    let err;
    if (editing) {
      ({ error: err } = await supabase.from('guests').update(payload).eq('id', editing.id));
    } else {
      ({ error: err } = await supabase.from('guests').insert(payload));
    }
    setLoading(false);
    if (err) { setError(err.message); return; }
    onSaved();
  };

  const showPartner = form.invitation_type === 'couple' || form.invitation_type === 'custom';

  return (
    <div className="adm-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="adm-modal">
        <div className="adm-modal__header">
          <h2 className="adm-modal__title">{editing ? 'Edit Guest' : 'New Invitation'}</h2>
          <button className="adm-icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {error && <div className="adm-alert adm-alert--err">{error}</div>}

        <form onSubmit={save}>
          <div className="adm-form-grid">
            <div className="adm-field">
              <label className="adm-label">Title <small>(optional)</small></label>
              <select className="adm-select" value={form.title ?? ''} onChange={e => set('title', e.target.value)}>
                <option value="">— None —</option>
                {['Mr.','Mrs.','Ms.','Dr.','Prof.','Rev.','Eng.'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="adm-field">
              <label className="adm-label">Full Name *</label>
              <input className="adm-input" required value={form.name ?? ''} onChange={e => set('name', e.target.value)} placeholder="e.g. Kasun Perera" />
            </div>

            <div className="adm-field">
              <label className="adm-label">Invitation Type *</label>
              <select className="adm-select" value={form.invitation_type ?? 'individual'} onChange={e => set('invitation_type', e.target.value as InvitationType)}>
                <option value="individual">Individual</option>
                <option value="couple">Couple</option>
                <option value="family">Family</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div className="adm-field">
              <label className="adm-label">Max Guests *</label>
              <input className="adm-input" type="number" min={1} max={20} required value={form.max_guests ?? 1} onChange={e => set('max_guests', e.target.value)} />
            </div>

            {showPartner && (
              <div className="adm-field adm-field--full">
                <label className="adm-label">Partner / Second Name</label>
                <input className="adm-input" value={form.partner_name ?? ''} onChange={e => set('partner_name', e.target.value)} placeholder="e.g. Nethmi" />
              </div>
            )}

            <div className="adm-field">
              <label className="adm-label">Contact <small>(optional)</small></label>
              <input className="adm-input" value={form.contact ?? ''} onChange={e => set('contact', e.target.value)} placeholder="+94 77 …" />
            </div>

            <div className="adm-field--full adm-field">
              <label className="adm-label">Custom Greeting <small>(optional)</small></label>
              <input className="adm-input" value={form.custom_greeting ?? ''} onChange={e => set('custom_greeting', e.target.value)} placeholder="e.g. We'd love to have you with us!" />
            </div>
          </div>

          <InvitationPreview guest={form} />

          <div className="adm-modal__footer">
            <button type="button" className="adm-btn adm-btn--ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="adm-btn adm-btn--primary" disabled={loading}>
              {loading ? <><span className="adm-spinner" />Saving…</> : (editing ? 'Update' : 'Create Invitation')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Guest Row ────────────────────────────────────────────────
function GuestRow({ g, onEdit, onRefresh }: { g: GuestWithRsvp; onEdit: (g: Guest) => void; onRefresh: () => void }) {
  const [busy, setBusy] = useState(false);
  const link = inviteLink(g.token);

  const toggleActive = async () => {
    setBusy(true);
    await supabase.from('guests').update({ is_active: !g.is_active }).eq('id', g.id);
    setBusy(false);
    onRefresh();
  };

  const deleteGuest = async () => {
    if (!window.confirm(`Delete invitation for ${g.name}? This will also remove their RSVP.`)) return;
    setBusy(true);
    await supabase.from('guests').delete().eq('id', g.id);
    setBusy(false);
    onRefresh();
  };

  const rsvpStatus = g.rsvp ? g.rsvp.status : 'pending';
  const badgeClass = rsvpStatus === 'accepted' ? 'adm-badge--accepted' : rsvpStatus === 'declined' ? 'adm-badge--declined' : 'adm-badge--pending';

  return (
    <tr style={!g.is_active ? { opacity: 0.55 } : undefined}>
      <td>
        <div style={{ fontWeight: 500 }}>{g.title ? `${g.title} ` : ''}{g.name}</div>
        {g.partner_name && <div style={{ fontSize: 11, color: 'var(--adm-muted)' }}>& {g.partner_name}</div>}
      </td>
      <td><span className={`adm-badge adm-badge--${g.invitation_type}`}>{g.invitation_type}</span></td>
      <td>{g.max_guests}</td>
      <td>{g.rsvp ? g.rsvp.confirmed_guests : '—'}</td>
      <td><span className={`adm-badge ${badgeClass}`}>{rsvpStatus}</span></td>
      <td>
        <div className="adm-link-cell">
          <span className="adm-link-text" title={link}>{g.token.slice(0,8)}…</span>
          <button className="adm-icon-btn" title="Copy link" onClick={() => copy(link)}>⎘</button>
          <button className="adm-icon-btn" title="Share on WhatsApp" onClick={() => whatsapp(g)}>💬</button>
        </div>
      </td>
      <td>
        <div style={{ display:'flex', gap:6 }}>
          <button className="adm-btn adm-btn--ghost" style={{ padding:'5px 10px', fontSize:12 }} onClick={() => onEdit(g)}>Edit</button>
          <button className="adm-btn adm-btn--ghost" style={{ padding:'5px 10px', fontSize:12 }} disabled={busy} onClick={toggleActive}>
            {g.is_active ? 'Deactivate' : 'Activate'}
          </button>
          <button className="adm-btn adm-btn--danger" style={{ padding:'5px 10px', fontSize:12 }} disabled={busy} onClick={deleteGuest}>
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

// ── Main Dashboard ───────────────────────────────────────────
export default function AdminDashboard() {
  const [guests, setGuests]     = useState<GuestWithRsvp[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState<'all' | 'accepted' | 'declined' | 'pending'>('all');
  const [showCreate, setCreate] = useState(false);
  const [editing, setEditing]   = useState<Guest | null>(null);
  const [stats, setStats]       = useState({ total: 0, accepted: 0, declined: 0, pending: 0, attending: 0 });

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('guests')
      .select('*, rsvp(*)')
      .order('created_at', { ascending: false });

    if (data) {
      const rows = data.map((g: Record<string, unknown>) => ({
        ...g,
        rsvp: Array.isArray(g.rsvp) ? (g.rsvp[0] ?? null) : (g.rsvp ?? null),
      })) as GuestWithRsvp[];
      setGuests(rows);
      const accepted  = rows.filter(g => g.rsvp?.status === 'accepted').length;
      const declined  = rows.filter(g => g.rsvp?.status === 'declined').length;
      const attending = rows.filter(g => g.rsvp?.status === 'accepted').reduce((s, g) => s + (g.rsvp?.confirmed_guests ?? 0), 0);
      setStats({ total: rows.length, accepted, declined, pending: rows.length - accepted - declined, attending });
    }
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const filtered = guests.filter(g => {
    const q = search.toLowerCase();
    const matchSearch = !q || g.name.toLowerCase().includes(q) || (g.partner_name ?? '').toLowerCase().includes(q);
    const matchFilter = filter === 'all' || (filter === 'accepted' && g.rsvp?.status === 'accepted') || (filter === 'declined' && g.rsvp?.status === 'declined') || (filter === 'pending' && !g.rsvp);
    return matchSearch && matchFilter;
  });

  const exportCsv = () => {
    const headers = ['Name','Title','Type','Partner','Max Guests','Confirmed','RSVP Status','Message','Token','Active','Created'];
    const rows = guests.map(g => [
      g.name, g.title ?? '', g.invitation_type, g.partner_name ?? '',
      g.max_guests, g.rsvp?.confirmed_guests ?? '',
      g.rsvp?.status ?? 'pending', g.rsvp?.message ?? '',
      inviteLink(g.token), g.is_active ? 'Yes' : 'No',
      new Date(g.created_at).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'guests.csv';
    a.click();
  };

  return (
    <div className="adm-main">
      <h1 className="adm-page-title">Dashboard</h1>

      {/* Stats */}
      <div className="adm-stats">
        <div className="adm-stat"><div className="adm-stat__label">Total Invitations</div><div className="adm-stat__value adm-stat__value--gold">{stats.total}</div></div>
        <div className="adm-stat"><div className="adm-stat__label">Accepted</div><div className="adm-stat__value adm-stat__value--green">{stats.accepted}</div></div>
        <div className="adm-stat"><div className="adm-stat__label">Declined</div><div className="adm-stat__value adm-stat__value--red">{stats.declined}</div></div>
        <div className="adm-stat"><div className="adm-stat__label">Pending</div><div className="adm-stat__value">{stats.pending}</div></div>
        <div className="adm-stat"><div className="adm-stat__label">Total Attending</div><div className="adm-stat__value adm-stat__value--blue">{stats.attending}</div></div>
      </div>

      {/* Toolbar */}
      <div className="adm-toolbar">
        <div className="adm-search">
          <span className="adm-search__icon">🔍</span>
          <input className="adm-input adm-search__input" placeholder="Search guests…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="adm-select" style={{ width:'auto' }} value={filter} onChange={e => setFilter(e.target.value as typeof filter)}>
          <option value="all">All</option>
          <option value="accepted">Accepted</option>
          <option value="declined">Declined</option>
          <option value="pending">Pending</option>
        </select>
        <button className="adm-btn adm-btn--ghost" onClick={exportCsv}>⬇ Export CSV</button>
        <button className="adm-btn adm-btn--primary" onClick={() => setCreate(true)}>+ New Invitation</button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="adm-loading"><span className="adm-spinner" />Loading guests…</div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Name</th><th>Type</th><th>Max</th><th>Confirmed</th><th>RSVP</th><th>Link</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="adm-empty">No guests found.</td></tr>
              ) : (
                filtered.map(g => (
                  <GuestRow key={g.id} g={g} onEdit={setEditing} onRefresh={load} />
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {(showCreate || editing) && (
        <GuestModal
          editing={editing}
          onClose={() => { setCreate(false); setEditing(null); }}
          onSaved={() => { setCreate(false); setEditing(null); void load(); }}
        />
      )}
    </div>
  );
}
