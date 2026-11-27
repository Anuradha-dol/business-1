import { useState, useEffect, useCallback } from 'react';
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  MessageCircle,
  Plus,
  RefreshCw,
  Search,
  X,
} from 'lucide-react';
import { supabase, type Guest, type Rsvp, formatGreeting } from '../lib/supabase';
import { wedding } from '../data/wedding';
import './admin.css';

type InvitationType = Guest['invitation_type'];
type GuestWithRsvp = Guest & { rsvp: Rsvp | null };

// Use the stable production hostname so invitation links don't depend on a
// preview deployment that can expire or belong to a different commit.
const SITE_URL = 'https://himeshi-and-madhawa.pages.dev';

function inviteLink(token: string) {
  return `${SITE_URL}/?invite=${token}`;
}

function whatsapp(guest: Guest) {
  const link = inviteLink(guest.token);
  const name = guest.title ? `${guest.title} ${guest.name}` : guest.name;
  const msg  = encodeURIComponent(
    `Dear ${name},\n\nYou are cordially invited to the wedding of ${wedding.bride} & ${wedding.groom} on ${wedding.dateLabel}.\n\nOpen your personal invitation: ${link}`
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
      <div className="adm-modal" role="dialog" aria-modal="true" aria-labelledby="adm-modal-title">
        <div className="adm-modal__header">
          <h2 id="adm-modal-title" className="adm-modal__title">{editing ? 'Edit Guest Invitation' : 'Create Personal Invitation'}</h2>
          <button className="adm-icon-btn" onClick={onClose} aria-label="Close"><X size={18} /></button>
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
              <input className="adm-input" value={form.custom_greeting ?? ''} onChange={e => set('custom_greeting', e.target.value)} placeholder="e.g. We would be honoured to have you with us!" />
            </div>
          </div>

          <InvitationPreview guest={form} />

          <div className="adm-modal__footer">
            <button type="button" className="adm-btn adm-btn--ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="adm-btn adm-btn--primary" disabled={loading}>
              {loading ? <><span className="adm-spinner" />Saving…</> : (editing ? 'Save Changes' : 'Create Invitation')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Shared Guest Actions Hook/Helpers ────────────────────────
function useGuestActions(g: GuestWithRsvp, onRefresh: () => void) {
  const [busy, setBusy]     = useState(false);
  const [copied, setCopied] = useState(false);
  const link = inviteLink(g.token);

  const copyLink = () => {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }).catch(() => {});
  };

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

  return { busy, copied, link, copyLink, toggleActive, deleteGuest, rsvpStatus, badgeClass };
}

// ── Desktop Guest Row ────────────────────────────────────────
function GuestRow({ g, onEdit, onRefresh }: { g: GuestWithRsvp; onEdit: (g: Guest) => void; onRefresh: () => void }) {
  const { busy, copied, link, copyLink, toggleActive, deleteGuest, rsvpStatus, badgeClass } = useGuestActions(g, onRefresh);

  return (
    <tr style={!g.is_active ? { opacity: 0.52 } : undefined}>
      <td>
        <div className="adm-guest-name">{g.title ? `${g.title} ` : ''}{g.name}</div>
        {(g.partner_name || g.contact) && (
          <div className="adm-guest-partner">
            {g.partner_name ? `& ${g.partner_name}` : ''}
            {g.partner_name && g.contact ? ' · ' : ''}
            {g.contact ?? ''}
          </div>
        )}
      </td>
      <td><span className={`adm-badge adm-badge--${g.invitation_type}`}>{g.invitation_type}</span></td>
      <td className="adm-num">{g.max_guests}</td>
      <td className="adm-num">{g.rsvp ? g.rsvp.confirmed_guests : '—'}</td>
      <td><span className={`adm-badge ${badgeClass}`}>{rsvpStatus}</span></td>
      <td>
        {g.rsvp?.message ? (
          <div className="adm-message-cell" title={g.rsvp.message}>{g.rsvp.message}</div>
        ) : (
          <span className="adm-message-empty">—</span>
        )}
      </td>
      <td>
        <div className="adm-link-cell">
          <span className="adm-link-text" title={link}>{g.token.slice(0, 8)}</span>
          <button
            className={`adm-icon-btn${copied ? ' adm-icon-btn--copied' : ''}`}
            title={copied ? 'Copied!' : 'Copy invitation link'}
            aria-label="Copy invitation link"
            onClick={copyLink}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
          <a
            className="adm-icon-btn"
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            title="Preview guest invitation"
            aria-label="Preview guest invitation"
          >
            <ExternalLink size={14} />
          </a>
          <button
            className="adm-icon-btn"
            title="Share on WhatsApp"
            aria-label="Share invitation on WhatsApp"
            onClick={() => whatsapp(g)}
          >
            <MessageCircle size={14} />
          </button>
        </div>
      </td>
      <td>
        <div className="adm-row-actions">
          <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => onEdit(g)}>Edit</button>
          <button className="adm-btn adm-btn--ghost adm-btn--sm" disabled={busy} onClick={toggleActive}>
            {g.is_active ? 'Deactivate' : 'Activate'}
          </button>
          <button className="adm-btn adm-btn--danger adm-btn--sm" disabled={busy} onClick={deleteGuest}>
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

// ── Mobile Guest Card (Zero Horizontal Swiping) ──────────────
function GuestMobileCard({ g, onEdit, onRefresh }: { g: GuestWithRsvp; onEdit: (g: Guest) => void; onRefresh: () => void }) {
  const { busy, copied, link, copyLink, toggleActive, deleteGuest, rsvpStatus, badgeClass } = useGuestActions(g, onRefresh);

  return (
    <article className="adm-gcard" style={!g.is_active ? { opacity: 0.58 } : undefined}>
      <div className="adm-gcard__head">
        <div>
          <div className="adm-guest-name">{g.title ? `${g.title} ` : ''}{g.name}</div>
          {(g.partner_name || g.contact) && (
            <div className="adm-guest-partner">
              {g.partner_name ? `& ${g.partner_name}` : ''}
              {g.partner_name && g.contact ? ' · ' : ''}
              {g.contact ?? ''}
            </div>
          )}
        </div>
        <span className={`adm-badge ${badgeClass}`}>{rsvpStatus}</span>
      </div>

      <div className="adm-gcard__meta">
        <div>
          <span className="adm-gcard__k">Type</span>
          <span className={`adm-badge adm-badge--${g.invitation_type}`}>{g.invitation_type}</span>
        </div>
        <div>
          <span className="adm-gcard__k">Seats</span>
          <strong className="adm-gcard__v">
            {g.rsvp ? `${g.rsvp.confirmed_guests} / ${g.max_guests}` : `— / ${g.max_guests}`}
          </strong>
        </div>
        <div>
          <span className="adm-gcard__k">Status</span>
          <strong className="adm-gcard__v">{g.is_active ? 'Active' : 'Inactive'}</strong>
        </div>
      </div>

      {g.rsvp?.message && (
        <p className="adm-gcard__msg">“{g.rsvp.message}”</p>
      )}

      <div className="adm-gcard__actions">
        <div className="adm-gcard__share">
          <button
            className={`adm-btn adm-btn--ghost adm-btn--sm${copied ? ' adm-btn--copied' : ''}`}
            onClick={copyLink}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'Copied' : 'Copy Link'}
          </button>
          <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => whatsapp(g)}>
            <MessageCircle size={13} />
            WhatsApp
          </button>
          <a
            className="adm-btn adm-btn--ghost adm-btn--sm"
            href={link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink size={13} />
            Open
          </a>
        </div>
        <div className="adm-gcard__manage">
          <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => onEdit(g)}>Edit</button>
          <button className="adm-btn adm-btn--ghost adm-btn--sm" disabled={busy} onClick={toggleActive}>
            {g.is_active ? 'Deactivate' : 'Activate'}
          </button>
          <button className="adm-btn adm-btn--danger adm-btn--sm" disabled={busy} onClick={deleteGuest}>
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

// ── Main Dashboard ───────────────────────────────────────────
export default function AdminDashboard() {
  const [guests, setGuests]         = useState<GuestWithRsvp[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [filter, setFilter]         = useState<'all' | 'accepted' | 'declined' | 'pending'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | InvitationType>('all');
  const [showCreate, setCreate]     = useState(false);
  const [editing, setEditing]       = useState<Guest | null>(null);
  const [stats, setStats]           = useState({ total: 0, accepted: 0, declined: 0, pending: 0, attending: 0, maxSeats: 0 });

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
      const maxSeats  = rows.reduce((s, g) => s + (g.max_guests || 0), 0);
      setStats({ total: rows.length, accepted, declined, pending: rows.length - accepted - declined, attending, maxSeats });
    }
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const filtered = guests.filter(g => {
    const q = search.toLowerCase();
    const matchSearch = !q
      || g.name.toLowerCase().includes(q)
      || (g.partner_name ?? '').toLowerCase().includes(q)
      || (g.contact ?? '').toLowerCase().includes(q)
      || (g.rsvp?.message ?? '').toLowerCase().includes(q);
    const matchFilter = filter === 'all'
      || (filter === 'accepted' && g.rsvp?.status === 'accepted')
      || (filter === 'declined' && g.rsvp?.status === 'declined')
      || (filter === 'pending' && !g.rsvp);
    const matchType = typeFilter === 'all' || g.invitation_type === typeFilter;
    return matchSearch && matchFilter && matchType;
  });

  const respondedCount = stats.accepted + stats.declined;
  const responseRate = stats.total > 0 ? Math.round((respondedCount / stats.total) * 100) : 0;
  const seatPct = stats.maxSeats > 0 ? Math.min(100, Math.round((stats.attending / stats.maxSeats) * 100)) : 0;

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
    <main className="adm-main">
      <div className="adm-header">
        <div>
          <div className="adm-header__eyebrow">Guest Concierge</div>
          <h1 className="adm-page-title">Guest Directory &amp; Attendance</h1>
          <p className="adm-page-sub">
            {respondedCount} of {stats.total} invitations responded ({responseRate}%) &middot; {stats.attending} of {stats.maxSeats} seats confirmed
          </p>
        </div>
        <div className="adm-header__actions">
          <button className="adm-btn adm-btn--ghost" onClick={() => void load()} disabled={loading} aria-label="Refresh guest responses">
            <RefreshCw size={14} className={loading ? 'adm-spin' : undefined} />
            Refresh
          </button>
          <button className="adm-btn adm-btn--ghost" onClick={exportCsv}>
            <Download size={14} />
            Export CSV
          </button>
          <button className="adm-btn adm-btn--primary" onClick={() => setCreate(true)}>
            <Plus size={15} />
            New Invitation
          </button>
        </div>
      </div>

      {/* Executive Summary Strip */}
      <div className="adm-stats">
        <div className="adm-stat">
          <div className="adm-stat__label">Total Invitations</div>
          <div className="adm-stat__value adm-stat__value--gold">{stats.total}</div>
          <div className="adm-stat__meta">{respondedCount} responded</div>
        </div>
        <div className="adm-stat">
          <div className="adm-stat__label">Accepted</div>
          <div className="adm-stat__value adm-stat__value--green">{stats.accepted}</div>
          <div className="adm-stat__meta">{stats.total > 0 ? Math.round((stats.accepted / stats.total) * 100) : 0}% of list</div>
        </div>
        <div className="adm-stat">
          <div className="adm-stat__label">Declined</div>
          <div className="adm-stat__value adm-stat__value--red">{stats.declined}</div>
          <div className="adm-stat__meta">{stats.total > 0 ? Math.round((stats.declined / stats.total) * 100) : 0}% of list</div>
        </div>
        <div className="adm-stat">
          <div className="adm-stat__label">Awaiting Reply</div>
          <div className="adm-stat__value">{stats.pending}</div>
          <div className="adm-stat__meta">Pending RSVP</div>
        </div>
        <div className="adm-stat adm-stat--wide">
          <div className="adm-stat__label">Confirmed Headcount</div>
          <div className="adm-stat__row">
            <div className="adm-stat__value adm-stat__value--blue">{stats.attending}</div>
            <span className="adm-stat__cap">/ {stats.maxSeats} max</span>
          </div>
          <div className="adm-progress" aria-hidden="true">
            <span style={{ width: `${seatPct}%` }} />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="adm-toolbar">
        <div className="adm-toolbar__left">
          <div className="adm-search">
            <span className="adm-search__icon" aria-hidden="true"><Search size={15} /></span>
            <input
              className="adm-input"
              placeholder="Search name, partner, contact, or note…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <select
            className="adm-select adm-type-select"
            aria-label="Filter by invitation type"
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value as 'all' | InvitationType)}
          >
            <option value="all">All Types</option>
            <option value="individual">Individual</option>
            <option value="couple">Couple</option>
            <option value="family">Family</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div className="adm-filter-tabs" role="tablist" aria-label="Filter guests by RSVP status">
          {([
            ['all', 'All', stats.total],
            ['accepted', 'Accepted', stats.accepted],
            ['declined', 'Declined', stats.declined],
            ['pending', 'Pending', stats.pending],
          ] as const).map(([key, label, count]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={filter === key}
              className={`adm-filter-tab${filter === key ? ' adm-filter-tab--active' : ''}`}
              onClick={() => setFilter(key)}
            >
              <span>{label}</span>
              <span className="adm-filter-count">{count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Guest Directory (Desktop Table + Mobile Cards) */}
      {loading ? (
        <div className="adm-table-wrap">
          <div className="adm-loading"><span className="adm-spinner" style={{ marginRight: 8 }} />Loading guest directory…</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="adm-table-wrap">
          <div className="adm-empty">No guests match your current search or filter.</div>
        </div>
      ) : (
        <>
          <div className="adm-table-wrap adm-desktop-only">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Guest</th><th>Type</th><th>Max</th><th>Confirmed</th><th>RSVP</th><th>Message</th><th>Invitation Link</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(g => (
                  <GuestRow key={g.id} g={g} onEdit={setEditing} onRefresh={load} />
                ))}
              </tbody>
            </table>
          </div>

          <div className="adm-mobile-cards">
            {filtered.map(g => (
              <GuestMobileCard key={g.id} g={g} onEdit={setEditing} onRefresh={load} />
            ))}
          </div>
        </>
      )}

      {(showCreate || editing) && (
        <GuestModal
          editing={editing}
          onClose={() => { setCreate(false); setEditing(null); }}
          onSaved={() => { setCreate(false); setEditing(null); void load(); }}
        />
      )}
    </main>
  );
}
