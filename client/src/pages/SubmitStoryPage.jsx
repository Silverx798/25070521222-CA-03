import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { submitStory } from '../services/api';
import { MapContainer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { PlusCircle, MapPin, Sparkles, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import AuthModal from '../components/auth/AuthModal';
import SharedMapTiles from '../components/map/SharedMapTiles';

// Mini Location Picker Map Component
const LocationPicker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lng, e.latlng.lat]);
    }
  });

  const customIcon = L.divIcon({
    html: `<div style="width:16px;height:16px;background:#d4af37;border:2px solid #fff;border-radius:50%;box-shadow:0 0 10px #d4af37;"></div>`,
    className: 'picker-marker',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });

  return position ? <Marker position={[position[1], position[0]]} icon={customIcon} /> : null;
};

const SubmitStoryPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('ghost-stories');
  const [continent, setContinent] = useState('North America');
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [originCommunity, setOriginCommunity] = useState('');
  const [historicalPeriod, setHistoricalPeriod] = useState('');
  const [coordinates, setCoordinates] = useState([-74.006, 40.7128]); // [lng, lat]
  const [locationIsApproximate, setLocationIsApproximate] = useState(true);
  const [tags, setTags] = useState('');
  const [heroImageUrl, setHeroImageUrl] = useState('/images/artwork/wendigo_forest.jpg');
  const [sourceTitle, setSourceTitle] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    setLoading(true);

    try {
      const parsedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);
      const sources = sourceTitle.trim() ? [{ title: sourceTitle, url: sourceUrl }] : [];

      await submitStory({
        title,
        summary,
        body,
        category,
        continent,
        country,
        region,
        originCommunity,
        historicalPeriod,
        coordinates,
        locationIsApproximate,
        tags: parsedTags,
        heroImageUrl,
        sources
      });

      setSuccess(true);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit lore.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '3rem 1.5rem 6rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div className="gold-badge" style={{ marginBottom: '0.75rem' }}>
          <PlusCircle size={14} />
          <span>Community Lore Inscription</span>
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          Submit a Local Legend or Account
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '720px', fontSize: '0.95rem' }}>
          Contribute folklore, cryptid encounters, ghost stories, or haunted topography from your region. Submissions are reviewed by our curatorial team before publication in the world atlas.
        </p>
      </div>

      {!user ? (
        <div style={{
          backgroundColor: 'rgba(18, 25, 33, 0.85)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '3rem 2rem',
          textAlign: 'center'
        }}>
          <Lock size={36} color="var(--gold-primary)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>Authentication Required</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
            To safeguard the cultural authenticity and provenance of submitted legends, all contributors must be signed in with an inscriber account.
          </p>
          <button onClick={() => setAuthModalOpen(true)} className="btn-primary">
            Sign In or Inscribe Account
          </button>
        </div>
      ) : success ? (
        <div style={{
          backgroundColor: 'rgba(18, 25, 33, 0.85)',
          border: '1px solid #8ed081',
          borderRadius: 'var(--radius-md)',
          padding: '3.5rem 2rem',
          textAlign: 'center',
          boxShadow: '0 0 30px rgba(142, 208, 129, 0.15)'
        }}>
          <CheckCircle2 size={48} color="#8ed081" style={{ marginBottom: '1.25rem' }} />
          <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '0.75rem' }}>
            Chronicle Successfully Submitted
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '540px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
            Your account has been safely inscribed into MongoDB with a <strong>Pending Review</strong> status. Once verified by an archivist, it will be published to the world map and public archive.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/profile" className="btn-primary">
              View Your Submissions
            </Link>
            <button
              onClick={() => {
                setSuccess(false);
                setTitle('');
                setSummary('');
                setBody('');
              }}
              className="btn-secondary"
            >
              Submit Another Account
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{
          backgroundColor: 'var(--bg-glass-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '2rem',
          boxShadow: 'var(--shadow-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          {errorMsg && (
            <div style={{
              padding: '0.85rem',
              backgroundColor: 'rgba(148, 43, 50, 0.3)',
              border: '1px solid var(--crimson-primary)',
              borderRadius: '4px',
              color: '#ff9999',
              fontSize: '0.85rem'
            }}>
              {errorMsg}
            </div>
          )}

          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold-primary)', marginBottom: '0.4rem', fontFamily: 'var(--font-serif)' }}>
              CHRONICLE TITLE *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. The Screaming Tunnel of Niagara"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          {/* Category & Continent */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold-primary)', marginBottom: '0.4rem', fontFamily: 'var(--font-serif)' }}>
                CLASSIFICATION *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="cryptids">Cryptids & Mysterious Creatures</option>
                <option value="urban-legends">Urban Legends</option>
                <option value="ghost-stories">Ghost Stories</option>
                <option value="haunted-places">Haunted Places</option>
                <option value="myths-legends">Myths & Ancient Legends</option>
                <option value="unexplained-phenomena">Unexplained Phenomena</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold-primary)', marginBottom: '0.4rem', fontFamily: 'var(--font-serif)' }}>
                CONTINENT *
              </label>
              <select
                value={continent}
                onChange={(e) => setContinent(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="North America">North America</option>
                <option value="Asia">Asia</option>
                <option value="Europe">Europe</option>
                <option value="South America">South America</option>
                <option value="Africa">Africa</option>
                <option value="Oceania">Oceania</option>
              </select>
            </div>
          </div>

          {/* Country & Region */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold-primary)', marginBottom: '0.4rem', fontFamily: 'var(--font-serif)' }}>
                COUNTRY *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Canada"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold-primary)', marginBottom: '0.4rem', fontFamily: 'var(--font-serif)' }}>
                PROVINCE, STATE, OR LOCALITY
              </label>
              <input
                type="text"
                placeholder="e.g. Ontario / Niagara Falls"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Cultural Origin Community & Historical Period */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold-primary)', marginBottom: '0.4rem', fontFamily: 'var(--font-serif)' }}>
                ORIGIN COMMUNITY / CULTURAL TRADITION
              </label>
              <input
                type="text"
                placeholder="e.g. Local Railroad Folklore"
                value={originCommunity}
                onChange={(e) => setOriginCommunity(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold-primary)', marginBottom: '0.4rem', fontFamily: 'var(--font-serif)' }}>
                HISTORICAL PERIOD / ERA
              </label>
              <input
                type="text"
                placeholder="e.g. Early 20th Century (circa 1910)"
                value={historicalPeriod}
                onChange={(e) => setHistoricalPeriod(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Interactive Map Location Pinning */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--gold-primary)', fontFamily: 'var(--font-serif)' }}>
                PIN COORDINATES ON WORLD MAP
              </label>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Click map to reposition marker: [{coordinates[1].toFixed(4)}, {coordinates[0].toFixed(4)}]
              </span>
            </div>
            <div style={{ height: '240px', width: '100%', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
              <MapContainer
                center={[coordinates[1], coordinates[0]]}
                zoom={3}
                style={{ height: '100%', width: '100%', background: '#070a0f' }}
              >
                <SharedMapTiles />
                <LocationPicker position={coordinates} setPosition={setCoordinates} />
              </MapContainer>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={locationIsApproximate}
                onChange={(e) => setLocationIsApproximate(e.target.checked)}
              />
              <span>This location is an approximate or regional boundary rather than an exact site.</span>
            </label>
          </div>

          {/* Short Summary */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold-primary)', marginBottom: '0.4rem', fontFamily: 'var(--font-serif)' }}>
              SHORT SUMMARY (SYNOPSIS) *
            </label>
            <textarea
              required
              rows={2}
              maxLength={400}
              placeholder="A concise 2-3 sentence overview of the phenomenon..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          {/* Full Story Lore */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold-primary)', marginBottom: '0.4rem', fontFamily: 'var(--font-serif)' }}>
              FULL FOLKLORE RECORD & NARRATIVE *
            </label>
            <textarea
              required
              rows={8}
              placeholder="Document the legend in full. Include historical accounts, witness sightings, oral variations, and cultural context..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              style={{ width: '100%', lineHeight: 1.6 }}
            />
          </div>

          {/* Artwork URL and Tags */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold-primary)', marginBottom: '0.4rem', fontFamily: 'var(--font-serif)' }}>
                ILLUSTRATION / ARTWORK PRESET
              </label>
              <select
                value={heroImageUrl}
                onChange={(e) => setHeroImageUrl(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="/images/artwork/wendigo_forest.jpg">Skull Moon Woodland (Dark Woods)</option>
                <option value="/images/artwork/kuchisake_spirit.jpg">Spectral Maiden (Gothic Ink Wash)</option>
                <option value="/images/artwork/cavern_crypt.jpg">Cavern Crypt (Bone Ossuary)</option>
                <option value="/images/artwork/cosmic_abyss.jpg">Cosmic Spiral Abyss (Oceanic Castle)</option>
                <option value="/images/artwork/botanical_scroll.png">Ancient Herbalist Silk Scroll</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold-primary)', marginBottom: '0.4rem', fontFamily: 'var(--font-serif)' }}>
                TAGS (COMMA SEPARATED)
              </label>
              <input
                type="text"
                placeholder="e.g. tunnel, fire, railway, apparition"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Historical Source Citation */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold-primary)', marginBottom: '0.4rem', fontFamily: 'var(--font-serif)' }}>
                SOURCE TITLE OR BOOK CITATION
              </label>
              <input
                type="text"
                placeholder="e.g. Local Gazette, Vol. 14 (1914)"
                value={sourceTitle}
                onChange={(e) => setSourceTitle(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold-primary)', marginBottom: '0.4rem', fontFamily: 'var(--font-serif)' }}>
                SOURCE REFERENCE URL (OPTIONAL)
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Submit Action */}
          <div style={{ borderTop: '1px solid var(--border-dark)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Transmitting Inscription...' : 'Submit Story for Moderation'}
            </button>
          </div>
        </form>
      )}

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
};

export default SubmitStoryPage;
