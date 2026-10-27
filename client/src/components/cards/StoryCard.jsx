import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Eye, Sparkles } from 'lucide-react';

const StoryCard = ({ story }) => {
  if (!story) return null;

  const categoryLabelMap = {
    'myths-legends': 'Myth & Legend',
    'urban-legends': 'Urban Legend',
    'ghost-stories': 'Ghost Story',
    'cryptids': 'Cryptid',
    'haunted-places': 'Haunted Place',
    'unexplained-phenomena': 'Unexplained'
  };

  return (
    <motion.div
      className="mythos-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to={`/stories/${story.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {/* Card Artwork Header */}
        <div style={{ position: 'relative', width: '100%', height: '210px', overflow: 'hidden' }}>
          <img
            src={story.heroImage?.url || '/images/artwork/cosmic_abyss.jpg'}
            alt={story.heroImage?.alt || story.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s ease'
            }}
            onError={(e) => {
              e.target.src = '/images/artwork/cosmic_abyss.jpg';
            }}
          />
          {/* Subtle gradient vignette over image */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(14, 20, 27, 0.95) 0%, rgba(14, 20, 27, 0.2) 60%, transparent 100%)'
            }}
          />

          {/* Category Tag Overlay */}
          <div style={{ position: 'absolute', top: '0.85rem', left: '0.85rem', zIndex: 2 }}>
            <span className={`category-tag ${story.category}`}>
              {categoryLabelMap[story.category] || story.category}
            </span>
          </div>

          {/* Interactive FX indicator */}
          {story.visualEffect && story.visualEffect !== 'standard' && (
            <div style={{ position: 'absolute', top: '0.85rem', right: '0.85rem', zIndex: 2 }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.65rem',
                fontWeight: 700,
                color: '#fff',
                background: 'rgba(212, 175, 55, 0.25)',
                border: '1px solid rgba(212, 175, 55, 0.5)',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                backdropFilter: 'blur(4px)'
              }}>
                <Sparkles size={11} color="var(--gold-primary)" />
                INTERACTIVE
              </span>
            </div>
          )}

          {/* Location Badge */}
          <div style={{
            position: 'absolute',
            bottom: '0.65rem',
            left: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            color: 'var(--text-secondary)',
            fontSize: '0.75rem',
            fontWeight: 500,
            textShadow: '0 2px 4px rgba(0,0,0,0.8)'
          }}>
            <MapPin size={13} color="var(--gold-primary)" />
            <span>{story.country}{story.region ? ` • ${story.region}` : ''}</span>
          </div>
        </div>

        {/* Card Body */}
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <h3 style={{
            fontSize: '1.15rem',
            marginBottom: '0.6rem',
            color: 'var(--text-primary)',
            lineHeight: 1.3
          }}>
            {story.title}
          </h3>

          <p style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.55,
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {story.summary}
          </p>

          <div style={{
            marginTop: 'auto',
            paddingTop: '0.85rem',
            borderTop: '1px solid var(--border-dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Eye size={13} />
              {story.viewCount?.toLocaleString() || 0} reads
            </span>
            <span style={{
              color: 'var(--gold-primary)',
              fontFamily: 'var(--font-serif)',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.05em'
            }}>
              Examine Lore →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default StoryCard;
