import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Lock, Mail, User, ShieldCheck, Key } from 'lucide-react';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login, register } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(displayName, email, password);
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Logins for Pair Programming & Testing
  const handleQuickLogin = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(3, 5, 8, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 30px var(--gold-glow)',
          padding: '2rem',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'transparent',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--gold-primary)',
            marginBottom: '0.75rem'
          }}>
            <Lock size={20} />
          </div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>
            {mode === 'login' ? 'Enter the Archive' : 'Initiate New Scribe'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
            {mode === 'login' 
              ? 'Access saved folklore collections & review submissions'
              : 'Join our worldwide network of folklorists and local storytellers'}
          </p>
        </div>

        {errorMsg && (
          <div style={{
            padding: '0.75rem',
            marginBottom: '1rem',
            backgroundColor: 'rgba(148, 43, 50, 0.25)',
            border: '1px solid var(--crimson-primary)',
            color: '#ff9b9b',
            fontSize: '0.85rem',
            borderRadius: '4px'
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                DISPLAY NAME / TITLE
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scribe of the Highlands"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                />
                <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              EMAIL SANCTUM
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                placeholder="name@mythosatlas.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', paddingLeft: '2.5rem' }}
              />
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              PASSPHRASE
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', paddingLeft: '2.5rem' }}
              />
              <Key size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {loading ? 'Consulting Records...' : (mode === 'login' ? 'Sign In to Archive' : 'Create Account')}
          </button>
        </form>

        {/* Demo Accounts Quick-Select */}
        <div style={{
          marginTop: '1.25rem',
          padding: '0.75rem',
          backgroundColor: 'rgba(10, 15, 20, 0.7)',
          border: '1px dashed var(--border-subtle)',
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
            DEMO SEED CREDENTIALS (CLICK TO AUTOFILL):
          </span>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@mythosatlas.org', 'AtlasAdmin2026!')}
              style={{
                background: 'rgba(212, 175, 55, 0.15)',
                color: 'var(--gold-primary)',
                fontSize: '0.7rem',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                border: '1px solid var(--border-subtle)'
              }}
            >
              Demo Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('curator@mythosatlas.org', 'Curator2026!')}
              style={{
                background: 'rgba(76, 130, 131, 0.15)',
                color: '#79c0ff',
                fontSize: '0.7rem',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                border: '1px solid rgba(121, 192, 255, 0.2)'
              }}
            >
              Demo Curator
            </button>
          </div>
        </div>

        {/* Toggle Mode Footer */}
        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {mode === 'login' ? (
            <span>
              Unregistered traveler?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                style={{ background: 'transparent', color: 'var(--gold-primary)', textDecoration: 'underline' }}
              >
                Inscribe Account
              </button>
            </span>
          ) : (
            <span>
              Already inscribed?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                style={{ background: 'transparent', color: 'var(--gold-primary)', textDecoration: 'underline' }}
              >
                Sign In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
