import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchStoryBySlug, addBookmark, removeBookmark, fetchUserBookmarks } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StoryVisualizer from '../components/animations/StoryVisualizer';
import StoryCard from '../components/cards/StoryCard';
import { MapPin, Calendar, Users, Bookmark, Share2, BookOpen, ExternalLink, ArrowLeft, Sparkles, Check } from 'lucide-react';
import AuthModal from '../components/auth/AuthModal';

const StoryDetailPage = () => {
  const { slug } = useParams();
  const { user } = useAuth();

  const [story, setStory] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const loadStory = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetchStoryBySlug(slug);
        setStory(res.data);
        setRelated(res.related || []);

        // Check if user has bookmarked this story
        if (user && res.data) {
          try {
            const bookmarks = await fetchUserBookmarks();
            const exists = bookmarks.some((b) => b.story?._id === res.data._id);
            setIsBookmarked(exists);
          } catch (e) {
            // Ignore bookmark fetch error for unauthenticated/guest
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Story not found.');
      } finally {
        setLoading(false);
      }
    };

    loadStory();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug, user]);

  const handleToggleBookmark = async () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    setBookmarkLoading(true);
    try {
      if (isBookmarked) {
        await removeBookmark(story._id);
        setIsBookmarked(false);
      } else {
        await addBookmark(story._id);
        setIsBookmarked(true);
      }
    } catch (err) {
      console.error('Bookmark error:', err);
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '900px', margin: '6rem auto', textAlign: 'center', color: 'var(--text-muted)' }}>
        <BookOpen size={40} color="var(--gold-primary)" style={{ animation: 'spin 4s linear infinite', marginBottom: '1rem' }} />
        <p>Deciphering historical annals...</p>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div style={{ maxWidth: '600px', margin: '6rem auto', textAlign: 'center', padding: '2rem' }}>
        <h2 style={{ color: 'var(--crimson-primary)', marginBottom: '1rem' }}>Lore Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          The requested folklore chronicle could not be located in the archives.
        </p>
        <Link to="/explore" className="btn-primary">
          <ArrowLeft size={16} /> Return to Archive
        </Link>
      </div>
    );
  }

  return (
    <article style={{ maxWidth: '1080px', margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>
      {/* Back Link */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/explore" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <ArrowLeft size={14} /> Back to Archive
        </Link>
      </div>

      {/* Hero Header */}
      <header style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <span className={`category-tag ${story.category}`}>
            {story.category}
          </span>
          {story.locationIsApproximate && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', border: '1px dashed var(--border-dark)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
              Approximate Territory
            </span>
          )}
        </div>

        <h1 style={{
          fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
          lineHeight: 1.15,
          color: 'var(--text-primary)',
          marginBottom: '1.25rem'
        }}>
          {story.title}
        </h1>

        <p style={{
          fontSize: '1.25rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          fontFamily: 'var(--font-reading)',
          fontStyle: 'italic',
          borderLeft: '3px solid var(--gold-primary)',
          paddingLeft: '1.25rem',
          marginBottom: '1.75rem'
        }}>
          "{story.summary}"
        </p>

        {/* Metadata Badges */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1.25rem',
          padding: '1rem 1.25rem',
          backgroundColor: 'rgba(18, 25, 33, 0.75)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gold-primary)' }}>
            <MapPin size={15} />
            <span>{story.country}{story.region ? ` (${story.region})` : ''}</span>
          </div>

          {story.originCommunity && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
              <Users size={15} />
              <span>{story.originCommunity}</span>
            </div>
          )}

          {story.historicalPeriod && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
              <Calendar size={15} />
              <span>{story.historicalPeriod}</span>
            </div>
          )}

          {/* Action Buttons: Bookmark & Share */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={handleToggleBookmark}
              disabled={bookmarkLoading}
              className="btn-secondary"
              style={{
                padding: '0.35rem 0.85rem',
                fontSize: '0.75rem',
                backgroundColor: isBookmarked ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                borderColor: isBookmarked ? 'var(--gold-primary)' : 'var(--border-subtle)',
                color: isBookmarked ? 'var(--gold-primary)' : 'var(--text-primary)'
              }}
            >
              <Bookmark size={14} fill={isBookmarked ? 'var(--gold-primary)' : 'none'} />
              <span>{isBookmarked ? 'Bookmarked' : 'Save Story'}</span>
            </button>

            <button
              onClick={handleShare}
              className="btn-secondary"
              style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem' }}
              title="Copy share link to clipboard"
            >
              {copiedLink ? <Check size={14} color="#8ed081" /> : <Share2 size={14} />}
              <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Visual Artifact Feature: Reusable StoryVisualizer (Layered Parallax, Atmospheric FX, Sound Toggle) */}
      <section style={{ marginBottom: '2.5rem' }}>
        <StoryVisualizer story={story} interactive={true} />
        
        {/* Media Provenance & Licensing Dossier */}
        {story.heroImage && (
          <div style={{
            maxWidth: '920px',
            margin: '0.75rem auto 0',
            padding: '0.75rem 1.25rem',
            backgroundColor: 'rgba(10, 15, 20, 0.75)',
            border: '1px solid var(--border-dark)',
            borderRadius: '6px',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{
                color: story.heroImage.isVerified ? '#8ed081' : 'var(--gold-muted)',
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '0.7rem',
                border: '1px solid currentColor',
                padding: '0.1rem 0.4rem',
                borderRadius: '3px'
              }}>
                {story.heroImage.isVerified ? '✓ Source Verified Asset' : 'Archival Depiction'}
              </span>
              <span>
                <strong>Artwork Type:</strong> {story.heroImage.mediaType ? story.heroImage.mediaType.replace('-', ' ') : 'archival illustration'}
              </span>
              {story.heroImage.credit && (
                <span>• <strong>Creator:</strong> {story.heroImage.credit}</span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              {story.heroImage.license && (
                <span>
                  <strong>License:</strong>{' '}
                  {story.heroImage.licenseUrl ? (
                    <a
                      href={story.heroImage.licenseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--gold-primary)', textDecoration: 'underline' }}
                    >
                      {story.heroImage.license}
                    </a>
                  ) : (
                    story.heroImage.license
                  )}
                </span>
              )}
              {story.heroImage.sourcePageUrl && (
                <a
                  href={story.heroImage.sourcePageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    color: 'var(--text-secondary)',
                    borderBottom: '1px dotted var(--text-muted)'
                  }}
                  title="View original Wikimedia Commons repository record"
                >
                  Commons Record <ExternalLink size={11} />
                </a>
              )}
            </div>
          </div>
        )}
      </section>


      {/* Main Narrative Body */}
      <section
        style={{
          color: 'var(--text-primary)',
          fontSize: '1.05rem',
          lineHeight: 1.8,
          marginBottom: '3.5rem'
        }}
      >
        <div
          dangerouslySetInnerHTML={{
            __html: story.body
              .replace(/### (.*)/g, '<h3 style="font-family: var(--font-serif); font-size: 1.5rem; color: var(--gold-primary); margin: 2rem 0 1rem;">$1</h3>')
              .replace(/## (.*)/g, '<h2 style="font-family: var(--font-serif); font-size: 1.8rem; color: var(--text-primary); margin: 2.5rem 0 1rem;">$1</h2>')
              .replace(/> (.*)/g, '<blockquote style="border-left: 3px solid var(--gold-muted); padding-left: 1.25rem; font-style: italic; color: var(--text-secondary); margin: 1.5rem 0; font-family: var(--font-reading); font-size: 1.15rem;">$1</blockquote>')
              .replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--text-primary); font-weight: 700;">$1</strong>')
              .replace(/\*(.*?)\*/g, '<em style="color: var(--text-gold); font-family: var(--font-reading);">$1</em>')
              .replace(/\n\n/g, '<p style="margin-bottom: 1.25rem;"></p>')
          }}
        />
      </section>

      {/* Tags */}
      {story.tags && story.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '3rem' }}>
          {story.tags.map((tag) => (
            <Link
              key={tag}
              to={`/explore?search=${encodeURIComponent(tag)}`}
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-dark)',
                padding: '0.3rem 0.65rem',
                borderRadius: '4px'
              }}
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {/* Sources & Citations */}
      {story.sources && story.sources.length > 0 && (
        <section style={{
          padding: '1.75rem',
          backgroundColor: 'rgba(12, 17, 23, 0.85)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '4rem'
        }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--gold-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={18} />
            <span>Historical Sources & References</span>
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
            {story.sources.map((src, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span style={{ color: 'var(--gold-muted)' }}>[{i + 1}]</span>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>{src.title}</span>
                  {src.url && (
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ marginLeft: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                    >
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Related Stories */}
      {related.length > 0 && (
        <section>
          <div style={{ marginBottom: '2rem' }}>
            <div className="gold-badge" style={{ marginBottom: '0.5rem' }}>Related Chronicles</div>
            <h2 style={{ fontSize: '1.8rem' }}>Stories from Nearby Regions or Traditions</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.75rem'
          }}>
            {related.map((rel) => (
              <StoryCard key={rel._id} story={rel} />
            ))}
          </div>
        </section>
      )}

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </article>
  );
};

export default StoryDetailPage;
