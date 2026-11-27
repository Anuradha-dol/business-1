import { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  ClipboardCheck,
  Eye,
  EyeOff,
  Lock,
  Mail,
  MapPin,
  Send,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { wedding } from '../data/wedding';
import './admin.css';

interface Props { onLogin: () => void; }

export default function AdminLogin({ onLogin }: Props) {
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    onLogin();
  };

  const coupleTitle = `${wedding.bride} & ${wedding.groom}`;

  return (
    <div className="adm-root">
      <div className="adm-login">
        {/* Left editorial celebration showcase */}
        <section className="adm-login__hero" aria-label="Celebration overview">
          <img
            className="adm-login__hero-bg"
            src={`${import.meta.env.BASE_URL}assets/images/cinematic/journey/beach-plate.webp`}
            alt=""
            draggable={false}
          />
          <div className="adm-login__hero-scrim" aria-hidden="true" />
          <div className="adm-login__hero-frame" aria-hidden="true" />

          <div className="adm-login__hero-top">
            <span className="adm-login__eyebrow">
              <Sparkles size={13} />
              Wedding Concierge &amp; Guest Portal
            </span>
            <h1 className="adm-login__couple">{coupleTitle}</h1>
            <div className="adm-login__meta">
              <span className="adm-login__meta-item">
                <Calendar size={14} />
                {wedding.dateLabel}
              </span>
              <span className="adm-login__meta-item">
                <MapPin size={14} />
                {wedding.venue.name}, {wedding.venue.city}
              </span>
            </div>
          </div>

          <div className="adm-login__hero-body">
            <div className="adm-login__divider" />
            <div className="adm-login__pillars">
              <div className="adm-login__pillar">
                <div className="adm-login__pillar-icon"><Sparkles size={15} /></div>
                <div>
                  <strong>Bespoke Guest Invitations</strong>
                  <span>Prepare personalised invitation links with tailored salutations and party allowances.</span>
                </div>
              </div>
              <div className="adm-login__pillar">
                <div className="adm-login__pillar-icon"><ClipboardCheck size={15} /></div>
                <div>
                  <strong>Real-Time Attendance &amp; RSVPs</strong>
                  <span>Track confirmed guest counts, declines, pending replies, and heartfelt notes in one place.</span>
                </div>
              </div>
              <div className="adm-login__pillar">
                <div className="adm-login__pillar-icon"><Send size={15} /></div>
                <div>
                  <strong>Direct Guest Dispatch</strong>
                  <span>Share private invitation links effortlessly via WhatsApp or export guest records to CSV.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="adm-login__hero-foot">
            Private Administration Workspace &middot; {coupleTitle}
          </div>
        </section>

        {/* Right sign-in card */}
        <section className="adm-login__panel" aria-label="Administrator sign in">
          <div className="adm-login__card">
            <div className="adm-login__badge">
              <ShieldCheck size={13} />
              Authorised Access
            </div>
            <h2 className="adm-login__title">Sign in to Guest Management</h2>
            <p className="adm-login__subtitle">
              Enter your administrator credentials to manage invitations, review RSVPs, and coordinate guest attendance.
            </p>

            {error && (
              <div className="adm-login__err" role="alert">
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="adm-field">
                <label className="adm-label" htmlFor="adm-email">Administrator Email</label>
                <div className="adm-input-wrap">
                  <span className="adm-input-icon" aria-hidden="true"><Mail size={16} /></span>
                  <input
                    id="adm-email"
                    className="adm-input adm-input--with-icon"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="concierge@wedding-portal.com"
                  />
                </div>
              </div>

              <div className="adm-field">
                <label className="adm-label" htmlFor="adm-pw">Password</label>
                <div className="adm-input-wrap">
                  <span className="adm-input-icon" aria-hidden="true"><Lock size={16} /></span>
                  <input
                    id="adm-pw"
                    className="adm-input adm-input--with-icon adm-input--with-action"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="adm-input-action"
                    onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button className="adm-btn adm-btn--primary adm-btn--full" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="adm-spinner" />
                    Verifying credentials…
                  </>
                ) : (
                  <>
                    Sign In to Portal
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="adm-login__security">
              <ShieldCheck size={14} />
              <span>Encrypted session · Authorised wedding coordinators only</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
