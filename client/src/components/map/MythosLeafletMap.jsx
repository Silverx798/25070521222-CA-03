import React, { useState, useEffect } from 'react';
import { MapContainer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { fetchMapStories } from '../../services/api';
import SharedMapTiles from './SharedMapTiles';
import { MapPin, Eye, RotateCcw, Search, Sparkles, X, ExternalLink, AlertTriangle } from 'lucide-react';

// Custom Marker Generator with SVG Icons
const createCustomIcon = (category) => {
  const colorMap = {
    'cryptids': '#8ed081',
    'urban-legends': '#79c0ff',
    'ghost-stories': '#d2a8ff',
    'haunted-places': '#ffa657',
    'myths-legends': '#d4af37',
    'unexplained-phenomena': '#ff7b72'
  };

  const color = colorMap[category] || '#d4af37';

  const svgHtml = `
    <div style="
      position: relative;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    ">
      <div style="
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: radial-gradient(circle, ${color} 0%, rgba(0,0,0,0.8) 80%);
        border: 2px solid ${color};
        box-shadow: 0 0 15px ${color}, inset 0 0 8px rgba(0,0,0,0.9);
        animation: pulseMarker 2.5s infinite;
      "></div>
      <div style="
        position: relative;
        z-index: 2;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #fff;
        box-shadow: 0 0 6px #fff;
      "></div>
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: 'custom-mythos-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18]
  });
};

// Map controller to reset view and center
const MapController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const MythosLeafletMap = ({ initialCategory = '', initialContinent = '' }) => {
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);
  
  // All state variables properly declared
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [continentFilter, setContinentFilter] = useState(initialContinent);
  const [countryFilter, setCountryFilter] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  
  const [mapCenter, setMapCenter] = useState([25, 10]);
  const [mapZoom, setMapZoom] = useState(2.5);

  useEffect(() => {
    let isMounted = true;
    const loadMarkers = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (categoryFilter) params.category = categoryFilter;
        if (continentFilter) params.continent = continentFilter;
        if (countryFilter) params.country = countryFilter;
        
        const data = await fetchMapStories(params);
        if (isMounted) {
          setMarkers(data || []);

          // Pan to first marker if country filter selected
          if (countryFilter && data.length > 0 && data[0].location?.coordinates) {
            const [lng, lat] = data[0].location.coordinates;
            if (lat !== 0 || lng !== 0) {
              setMapCenter([lat, lng]);
              setMapZoom(5);
            }
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to load map markers:', err);
          setError('Failed to load geographic landmarks from the archive.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadMarkers();
    return () => {
      isMounted = false;
    };
  }, [categoryFilter, continentFilter, countryFilter]);

  const resetView = () => {
    setCategoryFilter('');
    setContinentFilter('');
    setCountryFilter('');
    setSearchFilter('');
    setSelectedStory(null);
    setMapCenter([25, 10]);
    setMapZoom(2.5);
  };

  // Filter markers locally if search text is entered
  const filteredMarkers = markers.filter((m) => {
    if (!searchFilter.trim()) return true;
    const term = searchFilter.toLowerCase();
    return (
      (m.title && m.title.toLowerCase().includes(term)) ||
      (m.country && m.country.toLowerCase().includes(term)) ||
      (m.region && m.region.toLowerCase().includes(term)) ||
      (m.summary && m.summary.toLowerCase().includes(term))
    );
  });

  // Extract unique sorted countries from current markers
  const availableCountries = Array.from(new Set(markers.map((m) => m.country).filter(Boolean))).sort();

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '620px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-subtle)', background: '#070a0f' }}>
      {/* Map Control Bar Overlay */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        right: '1rem',
        zIndex: 500,
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1rem',
        backgroundColor: 'rgba(10, 15, 22, 0.92)',
        backdropFilter: 'blur(12px)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.8)'
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', minWidth: '200px', flex: '1 1 180px' }}>
          <input
            type="text"
            placeholder="Search landmarks or lore..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            style={{ width: '100%', paddingLeft: '2.2rem', paddingRight: '0.8rem', height: '36px', fontSize: '0.85rem' }}
          />
          <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{ height: '36px', fontSize: '0.85rem', flex: '1 1 140px' }}
        >
          <option value="">All Classifications</option>
          <option value="cryptids">Cryptids & Beasts</option>
          <option value="urban-legends">Urban Legends</option>
          <option value="ghost-stories">Ghost Stories</option>
          <option value="haunted-places">Haunted Places</option>
          <option value="myths-legends">Myths & Ancient Legends</option>
          <option value="unexplained-phenomena">Unexplained Phenomena</option>
        </select>

        {/* Continent Filter */}
        <select
          value={continentFilter}
          onChange={(e) => setContinentFilter(e.target.value)}
          style={{ height: '36px', fontSize: '0.85rem', flex: '1 1 130px' }}
        >
          <option value="">All Continents</option>
          <option value="North America">North America</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="South America">South America</option>
          <option value="Africa">Africa</option>
          <option value="Oceania">Oceania</option>
          <option value="Antarctica">Antarctica</option>
        </select>

        {/* Country Filter */}
        <select
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
          style={{ height: '36px', fontSize: '0.85rem', flex: '1 1 130px' }}
        >
          <option value="">All Countries</option>
          {availableCountries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Reset View Button */}
        <button
          onClick={resetView}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0 0.85rem',
            height: '36px',
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--gold-primary)',
            borderRadius: '4px',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-serif)',
            cursor: 'pointer'
          }}
          title="Reset map view and clear filters"
        >
          <RotateCcw size={14} />
          <span>Reset</span>
        </button>

        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Showing <strong>{filteredMarkers.length}</strong> markers
        </div>
      </div>

      {/* Error Notification */}
      {error && (
        <div style={{
          position: 'absolute',
          top: '5rem',
          left: '1rem',
          right: '1rem',
          zIndex: 600,
          backgroundColor: 'rgba(148, 43, 50, 0.95)',
          color: '#fff',
          padding: '0.75rem 1rem',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.85rem'
        }}>
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div style={{
          position: 'absolute',
          top: '5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 600,
          backgroundColor: 'rgba(10, 15, 22, 0.9)',
          border: '1px solid var(--border-subtle)',
          color: 'var(--gold-primary)',
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>Loading folklore coordinates...</span>
        </div>
      )}

      {/* Leaflet Map Canvas */}
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        minZoom={2}
        maxZoom={18}
        style={{ width: '100%', height: '100%', minHeight: '620px', background: '#070a0f' }}
        zoomControl={false}
      >
        <MapController center={mapCenter} zoom={mapZoom} />

        {/* Standard OpenStreetMap Tile Layer with dark cartographic styling - NO API KEY REQUIRED, NO WATERMARK */}
        <SharedMapTiles />

        {/* Render Story Pins */}
        {filteredMarkers.map((story) => {
          if (!story.location || !story.location.coordinates || story.location.coordinates.length < 2) return null;
          // Coordinates in GeoJSON: [longitude, latitude] -> Leaflet requires [latitude, longitude]
          const [lng, lat] = story.location.coordinates;
          if (lat === 0 && lng === 0) return null;
          if (isNaN(lat) || isNaN(lng)) return null;

          return (
            <Marker
              key={story._id}
              position={[lat, lng]}
              icon={createCustomIcon(story.category)}
              eventHandlers={{
                click: () => {
                  setSelectedStory(story);
                }
              }}
            >
              <Popup className="mythos-map-popup">
                <div style={{ padding: '0.4rem', maxWidth: '230px' }}>
                  <h4 style={{ fontFamily: 'var(--font-serif)', color: '#d4af37', marginBottom: '0.25rem', fontSize: '0.95rem' }}>
                    {story.title}
                  </h4>
                  <div style={{ fontSize: '0.75rem', color: '#a0aec0', marginBottom: '0.4rem' }}>
                    {story.country}{story.region ? ` • ${story.region}` : ''}
                  </div>
                  <button
                    onClick={() => setSelectedStory(story)}
                    style={{
                      background: 'linear-gradient(135deg, #d4af37 0%, #a6841f 100%)',
                      color: '#000',
                      padding: '0.3rem 0.75rem',
                      borderRadius: '3px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      border: 'none',
                      width: '100%'
                    }}
                  >
                    Inspect Dossier
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Slide-out Story Preview Panel */}
      {selectedStory && (
        <div
          style={{
            position: 'absolute',
            top: '5.2rem',
            right: '1rem',
            bottom: '1rem',
            width: '380px',
            maxWidth: 'calc(100% - 2rem)',
            zIndex: 600,
            backgroundColor: 'rgba(12, 17, 23, 0.98)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.9), 0 0 25px var(--gold-glow)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'slideInRight 0.35s ease'
          }}
        >
          {/* Header Image */}
          <div style={{ position: 'relative', width: '100%', height: '180px' }}>
            <img
              src={selectedStory.heroImage?.url || '/images/artwork/cosmic_abyss.jpg'}
              alt={selectedStory.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.target.src = '/images/artwork/cosmic_abyss.jpg'; }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(12, 17, 23, 1) 0%, transparent 60%)'
            }} />
            <button
              onClick={() => setSelectedStory(null)}
              style={{
                position: 'absolute',
                top: '0.75rem',
                right: '0.75rem',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: '#fff',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer'
              }}
              aria-label="Close preview"
            >
              <X size={16} />
            </button>
          </div>

          {/* Details */}
          <div style={{ padding: '1.25rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.65rem', flexWrap: 'wrap' }}>
              <span className={`category-tag ${selectedStory.category}`}>
                {selectedStory.category}
              </span>
              {selectedStory.locationIsApproximate && (
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', border: '1px dashed var(--border-dark)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                  Approximate Area
                </span>
              )}
            </div>

            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              {selectedStory.title}
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gold-primary)', fontSize: '0.8rem', marginBottom: '1rem' }}>
              <MapPin size={14} />
              <span>{selectedStory.country}{selectedStory.region ? `, ${selectedStory.region}` : ''}</span>
              <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                [{selectedStory.location?.coordinates?.[1]?.toFixed(2)}°, {selectedStory.location?.coordinates?.[0]?.toFixed(2)}°]
              </span>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {selectedStory.summary}
            </p>

            <div style={{ marginTop: 'auto' }}>
              <Link
                to={`/stories/${selectedStory.slug}`}
                className="btn-primary"
                style={{ width: '100%', textDecoration: 'none' }}
              >
                <span>Read Full Lore Manuscript</span>
                <ExternalLink size={15} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MythosLeafletMap;
