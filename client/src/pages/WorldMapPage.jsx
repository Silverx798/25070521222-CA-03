import React from 'react';
import MythosLeafletMap from '../components/map/MythosLeafletMap';
import { Map, Compass, Info } from 'lucide-react';

const WorldMapPage = () => {
  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="gold-badge" style={{ marginBottom: '0.4rem' }}>
            <Map size={14} />
            <span>Interactive Cartography</span>
          </div>
          <h1 style={{ fontSize: '2.2rem' }}>
            The Global Folklore Map
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <Info size={16} color="var(--gold-primary)" />
          <span>Select any marker to inspect folklore dossiers and coordinates</span>
        </div>
      </div>

      {/* Embedded Map Canvas */}
      <div style={{ height: '78vh', minHeight: '620px', width: '100%' }}>
        <MythosLeafletMap />
      </div>
    </div>
  );
};

export default WorldMapPage;
