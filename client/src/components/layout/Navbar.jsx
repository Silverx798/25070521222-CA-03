import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Compass, Map, BookOpen, Globe2, PlusCircle, Bookmark, Shield, LogOut, User, Search, Menu, X } from 'lucide-react';
import AuthModal from '../auth/AuthModal';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: <Compass size={16} /> },
    { name: 'Explore Archive', path: '/explore', icon: <BookOpen size={16} /> },
    { name: 'Regions', path: '/regions', icon: <Globe2 size={16} /> },
    { name: 'World Map', path: '/map', icon: <Map size={16} /> },
    { name: 'Submit Story', path: '/submit', icon: <PlusCircle size={16} /> },
    { name: 'Collection', path: '/collection', icon: <Bookmark size={16} />, requiresAuth: true }
  ];

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(7, 10, 13, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.7)'
      }}>
        <div style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '0.85rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem'
        }}>
          {/* Brand Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              textDecoration: 'none'
            }}
          >
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              border: '1px solid var(--gold-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)',
              boxShadow: '0 0 15px var(--gold-glow)'
            }}>
              <Compass size={22} color="var(--gold-primary)" />
            </div>
            <div>
              <span style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.25rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                color: 'var(--text-primary)',
                display: 'block',
                lineHeight: 1
              }}>
                MYTHOS ATLAS
              </span>
              <span style={{
                fontSize: '0.65rem',
                letterSpacing: '0.15em',
                color: 'var(--gold-primary)',
                textTransform: 'uppercase'
              }}>
                Archive of the Esoteric
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem'
          }} className="desktop-nav">
            {navLinks.map((link) => {
              if (link.requiresAuth && !user) return null;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-serif)',
                    letterSpacing: '0.06em',
                    color: isActive ? 'var(--gold-primary)' : 'var(--text-secondary)',
                    borderBottom: isActive ? '2px solid var(--gold-primary)' : '2px solid transparent',
                    padding: '0.4rem 0.2rem',
                    textTransform: 'uppercase'
                  }}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Quick Search & Auth Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Search Input Bar */}
            <form onSubmit={handleSearchSubmit} style={{ position: 'relative', display: 'none' }} className="desktop-search">
              <input
                type="text"
                placeholder="Search lore, places..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '200px',
                  padding: '0.45rem 0.75rem 0.45rem 2rem',
                  fontSize: '0.8rem',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(15, 21, 28, 0.9)'
                }}
              />
              <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            </form>

            {/* User Profile / Admin / Login Button */}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.75rem',
                      padding: '0.4rem 0.75rem',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(138, 37, 44, 0.2)',
                      border: '1px solid var(--crimson-primary)',
                      color: '#ff9494'
                    }}
                    title="Moderation Console"
                  >
                    <Shield size={14} />
                    <span>CURATION</span>
                  </Link>
                )}

                <Link
                  to="/profile"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    textDecoration: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(212, 175, 55, 0.15)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--gold-primary)'
                  }}>
                    <User size={16} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-primary)' }}>
                    {user.displayName.split(' ')[0]}
                  </span>
                </Link>

                <button
                  onClick={logout}
                  style={{
                    background: 'transparent',
                    color: 'var(--text-muted)',
                    padding: '0.35rem',
                    borderRadius: '4px'
                  }}
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="btn-secondary"
                style={{ padding: '0.45rem 1rem', fontSize: '0.75rem' }}
              >
                Sign In
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: 'transparent',
                color: 'var(--text-primary)',
                display: 'none'
              }}
              className="mobile-toggle"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderTop: '1px solid var(--border-subtle)',
            padding: '1rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Search folklore, cryptids, places..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%' }}
              />
            </form>
            {navLinks.map((link) => {
              if (link.requiresAuth && !user) return null;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.5rem 0',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-serif)'
                  }}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Auth Modal for Quick Login / Register */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
