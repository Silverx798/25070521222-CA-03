import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchFeaturedStories, fetchPopularStories, fetchRecentStories } from '../services/api';
import StoryCard from '../components/cards/StoryCard';
import WendigoParallax from '../components/animations/WendigoParallax';
import { motion } from 'framer-motion';
import { Compass, Map, Search, Flame, Skull, Ghost, Castle, Sparkles, Globe, ArrowRight, Eye } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredStories, setFeaturedStories] = useState([]);
  const [popularStories, setPopularStories] = useState([]);
  const [recentStories, setRecentStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [featured, popular, recent] = await Promise.all([
          fetchFeaturedStories(),
          fetchPopularStories(),
          fetchRecentStories()
        ]);
        setFeaturedStories(featured);
        setPopularStories(popular);
        setRecentStories(recent);
      } catch (err) {
        console.error('Failed to load home page stories:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categories = [
    { id: 'cryptids', title: 'Cryptids & Beasts', desc: 'Elusive apex predators and folklore entities of wild frontiers', icon: <Skull size={24} color="#8ed081" />, image: '/images/artwork/wendigo_forest.jpg' },
    { id: 'urban-legends', title: 'Urban Legends', desc: 'Whispers that spread across modern streets, subways, and schoolyards', icon: <Eye size={24} color="#79c0ff" />, image: '/images/artwork/kuchisake_spirit.jpg' },
    { id: 'ghost-stories', title: 'Ghost Stories', desc: 'Restless apparitions bound to the earth by tragedy, grief, or retribution', icon: <Ghost size={24} color="#d2a8ff" />, image: '/images/artwork/kuchisake_spirit.jpg' },
    { id: 'haunted-places', title: 'Haunted Places', desc: 'Cursed citadels, abandoned ossuaries, and forbidden historic grounds', icon: <Castle size={24} color="#ffa657" />, image: '/images/artwork/cavern_crypt.jpg' },
    { id: 'myths-legends', title: 'Myths & Ancient Legends', desc: 'Creation sagas, clay protectors, and divine covenants from antiquity', icon: <Sparkles size={24} color="#e3b341" />, image: '/images/artwork/botanical_scroll.png' },
    { id: 'unexplained-phenomena', title: 'Unexplained Phenomena', desc: 'Bermuda oceanic abysses, lost flights, and magnetic distortions', icon: <Flame size={24} color="#ff7b72" />, image: '/images/artwork/cosmic_abyss.jpg' }
  ];

  const continents = [
    { name: 'North America', desc: 'Taiga forests, Appalachian hollers & colonial crossroads' },
    { name: 'Asia', desc: 'Yokai spirits, tantric palace curses & mountain shrines' },
    { name: 'Europe', desc: 'Medieval ossuaries, loch serpent abysses & Jewish mysticism' },
    { name: 'South America', desc: 'Los Llanos whistlers & Andean cryptids' },
    { name: 'Africa', desc: 'Phantom ghost ships & ancient coastal legends' },
    { name: 'Oceania', desc: 'Murrumbidgee bunyips & dreamtime chronicles' },
    { name: 'Antarctica', desc: 'Subglacial abysses, Blood Falls & frozen polar anomalies' }
  ];

  return (
    <div className="home-page-container">
      {/* 1. Cinematic Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '4rem 1.5rem',
        overflow: 'hidden'
      }}>
        {/* Background Cosmic Vignette */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle at 50% 35%, rgba(212, 175, 55, 0.08) 0%, rgba(7, 10, 13, 0.95) 75%), url(/images/artwork/cosmic_abyss.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.35,
          filter: 'blur(3px)'
        }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '900px', margin: '0 auto' }}>
          <div className="gold-badge" style={{ marginBottom: '1.5rem' }}>
            <Compass size={14} />
            <span>Interactive Worldwide Archive</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            color: 'var(--text-primary)',
            lineHeight: 1.15,
            marginBottom: '1.5rem',
            textShadow: '0 4px 30px rgba(0, 0, 0, 0.9)'
          }}>
            Every place has a story.<br />
            <span style={{ color: 'var(--gold-primary)', fontStyle: 'italic', fontFamily: 'var(--font-reading)' }}>
              Some should never have been told.
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--text-secondary)',
            maxWidth: '680px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.6
          }}>
            Journey into a living, cartographic archive of world myths, cryptid lore, haunted places, and unexplained phenomena preserved across human cultures.
          </p>

          {/* Prominent Search Form */}
          <form
            onSubmit={handleHeroSearch}
            style={{
              display: 'flex',
              maxWidth: '560px',
              margin: '0 auto 2.5rem',
              position: 'relative'
            }}
          >
            <input
              type="text"
              placeholder="Search folklore, cryptids, haunted fortresses, or countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem 3.5rem 1rem 1.5rem',
                fontSize: '1rem',
                borderRadius: '50px',
                border: '1px solid var(--border-highlight)',
                backgroundColor: 'rgba(14, 20, 27, 0.9)',
                boxShadow: '0 8px 35px rgba(0, 0, 0, 0.8), 0 0 15px var(--gold-glow)'
              }}
            />
            <button
              type="submit"
              style={{
                position: 'absolute',
                right: '6px',
                top: '6px',
                bottom: '6px',
                width: '44px',
                borderRadius: '50%',
                backgroundColor: 'var(--gold-primary)',
                color: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Search folklore"
            >
              <Search size={18} />
            </button>
          </form>

          {/* Primary Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/explore" className="btn-primary">
              <Compass size={18} />
              <span>Explore the Archive</span>
            </Link>
            <Link to="/map" className="btn-secondary">
              <Map size={18} />
              <span>Enter the World Map</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Interactive Flagship Creature Feature: Wendigo Parallax */}
      <section style={{ padding: '4rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="gold-badge" style={{ marginBottom: '0.75rem' }}>
            <Sparkles size={14} />
            <span>Interactive Folklore Demonstration</span>
          </div>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
            The Winter Taiga & The Wendigo
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem' }}>
            Experience multi-layered interactive depth. Move your pointer over the forest canvas to shift perspective, track the feral glow in the trees, and activate the synthesized winter blizzard.
          </p>
        </div>

        <WendigoParallax interactive={true} />
      </section>

      {/* 3. Featured Curated Lore */}
      <section style={{ padding: '4rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="gold-badge" style={{ marginBottom: '0.5rem' }}>Curatorial Highlights</div>
            <h2 style={{ fontSize: '2rem' }}>Featured Legends of the World</h2>
          </div>
          <Link to="/explore" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', color: 'var(--gold-primary)' }}>
            View Full Archive <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            Consulting ancient manuscripts...
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '2rem'
          }}>
            {featuredStories.map((story) => (
              <StoryCard key={story._id} story={story} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Explore by Folklore Category */}
      <section style={{
        padding: '5rem 1.5rem',
        backgroundColor: 'rgba(10, 15, 20, 0.65)',
        borderTop: '1px solid var(--border-dark)',
        borderBottom: '1px solid var(--border-dark)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="gold-badge" style={{ marginBottom: '0.5rem' }}>Thematic Portals</div>
            <h2 style={{ fontSize: '2.2rem' }}>Explore by Classification</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}>
            {categories.map((cat, idx) => (
              <Link
                key={cat.id}
                to={`/explore?category=${cat.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <motion.div
                  className="mythos-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                  whileHover={{ y: -6, borderColor: 'var(--border-highlight)' }}
                  style={{
                    padding: '1.75rem',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: '1px solid var(--border-subtle)',
                    background: 'rgba(18, 25, 33, 0.85)'
                  }}
                >
                  <div>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.25rem',
                      border: '1px solid var(--border-dark)'
                    }}>
                      {cat.icon}
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                      {cat.title}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                      {cat.desc}
                    </p>
                  </div>
                  <div style={{
                    marginTop: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.8rem',
                    color: 'var(--gold-primary)',
                    fontFamily: 'var(--font-serif)',
                    letterSpacing: '0.05em'
                  }}>
                    Browse Category <ArrowRight size={14} />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Discover by Continent / Region */}
      <section style={{ padding: '5rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="gold-badge" style={{ marginBottom: '0.5rem' }}>Geographic Topography</div>
          <h2 style={{ fontSize: '2.2rem' }}>Discover by Region</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem' }}>
            Folklore is shaped by geography—mountains, deep oceans, dense woods, and sacred crossroads.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {continents.map((continent) => (
            <Link
              key={continent.name}
              to={`/explore?continent=${encodeURIComponent(continent.name)}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div
                className="mythos-card"
                style={{
                  padding: '1.5rem',
                  border: '1px solid var(--border-subtle)',
                  background: 'rgba(14, 20, 27, 0.75)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Globe size={18} color="var(--gold-primary)" />
                  <h3 style={{ fontSize: '1.15rem' }}>{continent.name}</h3>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {continent.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. Popular Right Now & Recently Added */}
      <section style={{ padding: '4rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <div className="gold-badge" style={{ marginBottom: '0.5rem' }}>Audience Records</div>
          <h2 style={{ fontSize: '2rem' }}>Popular Right Now</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '2rem',
          marginBottom: '4rem'
        }}>
          {popularStories.map((story) => (
            <StoryCard key={story._id} story={story} />
          ))}
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <div className="gold-badge" style={{ marginBottom: '0.5rem' }}>Freshly Inscribed</div>
          <h2 style={{ fontSize: '2rem' }}>Recently Added to the Archive</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          {recentStories.map((story) => (
            <StoryCard key={story._id} story={story} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
