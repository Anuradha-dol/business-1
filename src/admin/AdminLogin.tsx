import { useState } from 'react';
import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
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
        {/* Left: Clean coastal editorial canvas */}
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
            <span className="adm-login__eyebrow">Private Wedding Portal</span>
          </div>

          <div className="adm-login__hero-bottom">
            <h1 className="adm-login__couple">{coupleTitle}</h1>
            <p className="adm-login__meta">
              {wedding.dateLabel} &nbsp;&middot;&nbsp; {wedding.venue.name}, {wedding.venue.city}
            </p>
            <div className="adm-login__divider" />
            <p className="adm-login__caption">
              Guest directory, personalised invitations, and attendance records for our celebration in Galle.
            </p>
          </div>
        </section>

        {/* Right: Refined stationery sign-in form */}
        <section className="adm-login__panel" aria-label="Administrator sign in">
          <div className="adm-login__card">
            <img
              className="adm-login__floral"
              src={`${import.meta.env.BASE_URL}assets/images/cinematic/ambient/floral-corner.jpg`}
              alt=""
              aria-hidden="true"
              draggable={false}
            />

            <div className="adm-login__card-body">
              <p className="adm-login__kicker">{coupleTitle}</p>
              <h2 className="adm-login__title">Administrator Sign In</h2>
              <p className="adm-login__subtitle">
                Enter your email and password to manage guest invitations and RSVP responses.
              </p>

              {error && (
                <div className="adm-login__err" role="alert">
                  <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="adm-field">
                  <label className="adm-label" htmlFor="adm-email">Email Address</label>
                  <div className="adm-input-wrap">
                    <span className="adm-input-icon" aria-hidden="true"><Mail size={15} /></span>
                    <input
                      id="adm-email"
                      className="adm-input adm-input--with-icon"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="adm-field">
                  <label className="adm-label" htmlFor="adm-pw">Password</label>
                  <div className="adm-input-wrap">
                    <span className="adm-input-icon" aria-hidden="true"><Lock size={15} /></span>
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
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <button className="adm-btn adm-btn--primary adm-btn--full adm-login__submit" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="adm-spinner" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>

              <p className="adm-login__foot">
                {wedding.venue.name} &middot; {wedding.dateLabel}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
