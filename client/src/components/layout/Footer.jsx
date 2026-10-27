import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, Shield, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-subtle)',
      padding: '4rem 1.5rem 2rem',
      position: 'relative',
      zIndex: 2,
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '3rem',
        marginBottom: '3rem'
      }}>
        {/* Brand & Mission */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Compass size={24} color="var(--gold-primary)" />
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.25rem',
              fontWeight: 800,
              letterSpacing: '0.1em',
              color: 'var(--text-primary)'
            }}>
              MYTHOS ATLAS
            </span>
          </div>
          <p style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: '1rem',
            fontFamily: 'var(--font-reading)',
            fontStyle: 'italic'
          }}>
            "Every place has a story. Some should never have been told."
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            A global, interactive repository preserving ancestral oral traditions, cryptid accounts, ghost stories, and anomalous topography across all continents.
          </p>
        </div>

        {/* Portals */}
        <div>
          <h4 style={{
            fontSize: '0.95rem',
            marginBottom: '1.2rem',
            color: 'var(--gold-primary)',
            letterSpacing: '0.08em'
          }}>
            ARCHIVE PORTALS
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
            <li><Link to="/explore?category=cryptids">Cryptids & Mysterious Beasts</Link></li>
            <li><Link to="/explore?category=urban-legends">Modern Urban Legends</Link></li>
            <li><Link to="/explore?category=ghost-stories">Spectral Apparitions & Ghost Lore</Link></li>
            <li><Link to="/explore?category=haunted-places">Cursed Fortresses & Haunted Places</Link></li>
            <li><Link to="/explore?category=myths-legends">Ancient Myths & Creation Sagas</Link></li>
            <li><Link to="/explore?category=unexplained-phenomena">Bermuda & Oceanic Anomalies</Link></li>
          </ul>
        </div>

        {/* Global Regions */}
        <div>
          <h4 style={{
            fontSize: '0.95rem',
            marginBottom: '1.2rem',
            color: 'var(--gold-primary)',
            letterSpacing: '0.08em'
          }}>
            CONTINENTAL TOPOGRAPHY
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
            <li><Link to="/explore?continent=North+America">North American Taiga & Deserts</Link></li>
            <li><Link to="/explore?continent=Asia">East & South Asian Spirit Realms</Link></li>
            <li><Link to="/explore?continent=Europe">European Castles & Medieval Ossuaries</Link></li>
            <li><Link to="/explore?continent=South+America">South American Plains & Rainforests</Link></li>
            <li><Link to="/explore?continent=Africa">African Coastlines & Mountain Legends</Link></li>
            <li><Link to="/explore?continent=Oceania">Oceania & Australian Dreamtime</Link></li>
          </ul>
        </div>

        {/* Editorial & Community Principles */}
        <div>
          <h4 style={{
            fontSize: '0.95rem',
            marginBottom: '1.2rem',
            color: 'var(--gold-primary)',
            letterSpacing: '0.08em'
          }}>
            EDITORIAL INTEGRITY
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
            We treat Indigenous and traditional folklore with anthropological respect, honoring the cultural custodians of each narrative rather than treating living heritage as generic sensationalism.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem' }}>
            <Link to="/submit" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={14} /> Contribute Local Lore
            </Link>
            <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Shield size={14} /> Curatorial Moderation Queue
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--border-dark)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        fontSize: '0.75rem',
        color: 'var(--text-muted)'
      }}>
        <div>
          © {new Date().getFullYear()} Mythos Atlas. All historical archives and folklore collated for educational and preservation inquiry.
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <span>React + Node.js + MongoDB</span>
          <span>OpenStreetMap & CartoDB Dark Matter</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
