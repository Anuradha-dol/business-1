import { useState } from 'react';
import { supabase } from '../lib/supabase';
import './admin.css';

interface Props { onLogin: () => void; }

export default function AdminLogin({ onLogin }: Props) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    onLogin();
  };

  return (
    <div className="adm-root">
      <div className="adm-login">
        <div className="adm-login__card">
          <div className="adm-login__logo">
            <span>H&amp;M</span>
            <small>Admin Panel</small>
          </div>
          <h1 className="adm-login__title">Sign in</h1>
          {error && <div className="adm-login__err">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="adm-field">
              <label className="adm-label" htmlFor="adm-email">Email</label>
              <input
                id="adm-email"
                className="adm-input"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>
            <div className="adm-field">
              <label className="adm-label" htmlFor="adm-pw">Password</label>
              <input
                id="adm-pw"
                className="adm-input"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <button className="adm-btn adm-btn--primary adm-btn--full" type="submit" disabled={loading}>
              {loading ? <><span className="adm-spinner" />Signing in…</> : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
