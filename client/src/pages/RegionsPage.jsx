import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchRegions } from '../services/api';
import { Globe, MapPin, BookOpen, ArrowRight } from 'lucide-react';

const RegionsPage = () => {
  const [regionsData, setRegionsData] = useState([]);
  const [activeContinent, setActiveContinent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRegions = async () => {
      try {
        const data = await fetchRegions();
        setRegionsData(data);
        if (data.length > 0) {
          setActiveContinent(data[0].continent);
        }
      } catch (err) {
        console.error('Failed to load regions:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRegions();
  }, []);

  const currentContinentData = regionsData.find((r) => r.continent === activeContinent);

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div className="gold-badge" style={{ marginBottom: '0.75rem' }}>
          <Globe size={14} />
          <span>Geographic Drill-Down</span>
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          Countries & Regional Folklore
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '720px', fontSize: '0.95rem' }}>
          Select a continent and country to investigate indigenous myths, fort and palace hauntings, and local monster accounts.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '6rem', color: 'var(--text-muted)' }}>
          Surveying world topography...
        </div>
      ) : (
        <>
          {/* Continent Tab Selector */}
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            overflowX: 'auto',
            paddingBottom: '0.75rem',
            marginBottom: '2.5rem',
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            {regionsData.map((reg) => {
              const isActive = reg.continent === activeContinent;
              return (
                <button
                  key={reg.continent}
                  onClick={() => setActiveContinent(reg.continent)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    backgroundColor: isActive ? 'var(--gold-primary)' : 'rgba(18, 25, 33, 0.8)',
                    color: isActive ? '#000' : 'var(--text-secondary)',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid',
                    borderColor: isActive ? 'var(--gold-primary)' : 'var(--border-dark)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Globe size={16} />
                  <span>{reg.continent}</span>
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '10px',
                    backgroundColor: isActive ? '#000' : 'rgba(255, 255, 255, 0.1)',
                    color: isActive ? 'var(--gold-primary)' : 'var(--text-muted)'
                  }}>
                    {reg.totalStories}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Continent Country Grid */}
          {currentContinentData && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--gold-primary)' }}>
                  {currentContinentData.continent}
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  {currentContinentData.countries.length} nations with documented folklore entries
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.75rem'
              }}>
                {currentContinentData.countries.map((country) => (
                  <Link
                    key={country.name}
                    to={`/explore?country=${encodeURIComponent(country.name)}&continent=${encodeURIComponent(currentContinentData.continent)}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <div
                      className="mythos-card"
                      style={{
                        height: '100%',
                        border: '1px solid var(--border-subtle)',
                        overflow: 'hidden'
                      }}
                    >
                      <div style={{ position: 'relative', width: '100%', height: '170px' }}>
                        <img
                          src={country.sampleImage || '/images/artwork/cosmic_abyss.jpg'}
                          alt={country.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { e.target.src = '/images/artwork/cosmic_abyss.jpg'; }}
                        />
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(to top, rgba(14, 20, 27, 0.95) 0%, transparent 70%)'
                        }} />
                        <div style={{ position: 'absolute', bottom: '0.85rem', left: '1rem' }}>
                          <h3 style={{ fontSize: '1.35rem', color: '#fff' }}>
                            {country.name}
                          </h3>
                        </div>
                      </div>

                      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                          {country.categories.map((c) => (
                            <span key={c} className={`category-tag ${c}`} style={{ fontSize: '0.65rem' }}>
                              {c}
                            </span>
                          ))}
                        </div>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderTop: '1px solid var(--border-dark)',
                          paddingTop: '0.75rem',
                          fontSize: '0.8rem',
                          color: 'var(--gold-primary)',
                          fontFamily: 'var(--font-serif)'
                        }}>
                          <span>{country.count} {country.count === 1 ? 'Record' : 'Records'}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            Explore Lore <ArrowRight size={13} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RegionsPage;
