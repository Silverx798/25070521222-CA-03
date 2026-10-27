import React from 'react';
import { TileLayer } from 'react-leaflet';

/**
 * Shared OpenStreetMap Tile Configuration for Mythos Atlas
 * Uses standard OpenStreetMap raster tiles adhering to OSM tile usage policies.
 * No API key required. No watermark.
 */
export const OSM_TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
export const OSM_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors';

export const SharedMapTiles = () => {
  return (
    <TileLayer
      url={OSM_TILE_URL}
      attribution={OSM_ATTRIBUTION}
      maxZoom={19}
      className="osm-dark-tiles"
    />
  );
};

export default SharedMapTiles;
