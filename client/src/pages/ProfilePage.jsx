import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchUserProfile, fetchUserBookmarks, fetchUserSubmissions, removeBookmark, updateUserProfile } from '../services/api';
import StoryCard from '../components/cards/StoryCard';
import { User, Bookmark, PlusCircle, Shield, Edit3, Check, Trash2, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('bookmarks'); // 'bookmarks' or 'submissions'
  const [profile, setProfile] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingBio, setEditingBio] = useState(false);
  const [bioText, setBioText] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const [prof, bmarks, subs] = await Promise.all([
          fetchUserProfile(),
          fetchUserBookmarks(),
          fetchUserSubmissions()
        ]);
        setProfile(prof);
        setBookmarks(bmarks);
        setSubmissions(subs);
        setBioText(prof.bio || '');
      } catch (err) {
        console.error('Failed to load user profile data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  const handleRemoveBookmark = async (storyId) => {
    try {
      await removeBookmark(storyId);
      setBookmarks((prev) => prev.filter((b) => b.story._id !== storyId));
    } catch (err) {
      console.error('Failed to remove bookmark:', err);
    }
  };

  const handleSaveBio = async () => {
    try {
      const updated = await updateUserProfile({ bio: bioText });
      setProfile((prev) => ({ ...prev, bio: updated.bio }));
      setEditingBio(false);
    } catch (err) {
      console.error('Failed to update bio:', err);
    }
  };

  if (!user) {
    return (
      <div style={{ maxWidth: '600px', margin: '6rem auto', textAlign: 'center', padding: '2rem' }}>
        <h2>Sign In Required</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0 2rem' }}>
          Please sign in to view your profile and saved folklore collections.
        </p>
        <Link to="/" className="btn-primary">Return to Archive</Link>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#8ed081', backgroundColor: 'rgba(142, 208, 129, 0.15)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
            <CheckCircle size={13} /> PUBLISHED
          </span>
        );
      case 'rejected':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#ff7b72', backgroundColor: 'rgba(255, 123, 114, 0.15)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
            <XCircle size={13} /> REJECTED
          </span>
        );
      default:
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#e3b341', backgroundColor: 'rgba(227, 179, 65, 0.15)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
            <Clock size={13} /> PENDING REVIEW
          </span>
        );
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1.5rem 6rem' }}>
      {/* Profile Overview Card */}
      <div style={{
        backgroundColor: 'var(--bg-glass-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '2.5rem',
        marginBottom: '3rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '2rem',
        alignItems: 'center',
        boxShadow: 'var(--shadow-subtle)'
      }}>
        {/* Avatar */}
        <div style={{
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          border: '2px solid var(--gold-primary)',
          backgroundColor: 'rgba(212, 175, 55, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px var(--gold-glow)',
          overflow: 'hidden'
        }}>
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <User size={42} color="var(--gold-primary)" />
          )}
        </div>

        {/* User Info */}
        <div style={{ flex: 1, minWidth: '260px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '1.8rem', color: 'var(--text-primary)' }}>
              {user.displayName}
            </h1>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '0.2rem 0.6rem',
              borderRadius: '4px',
              backgroundColor: user.role === 'admin' ? 'rgba(148, 43, 50, 0.3)' : 'rgba(212, 175, 55, 0.15)',
              color: user.role === 'admin' ? '#ff9b9b' : 'var(--gold-primary)',
              border: '1px solid',
              borderColor: user.role === 'admin' ? 'var(--crimson-primary)' : 'var(--border-subtle)',
              textTransform: 'uppercase'
            }}>
              {user.role}
            </span>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            {user.email}
          </div>

          {editingBio ? (
            <div style={{ marginTop: '0.5rem' }}>
              <textarea
                rows={2}
                value={bioText}
                onChange={(e) => setBioText(e.target.value)}
                style={{ width: '100%', maxWidth: '500px', fontSize: '0.85rem' }}
              />
              <div style={{ marginTop: '0.4rem', display: 'flex', gap: '0.5rem' }}>
                <button onClick={handleSaveBio} className="btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                  Save
                </button>
                <button onClick={() => setEditingBio(false)} className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic', fontFamily: 'var(--font-reading)' }}>
                "{profile?.bio || 'Folklore researcher and seeker of spectral topography.'}"
              </p>
              <button
                onClick={() => setEditingBio(true)}
                style={{ background: 'transparent', color: 'var(--text-muted)' }}
                title="Edit bio"
              >
                <Edit3 size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontFamily: 'var(--font-serif)', color: 'var(--gold-primary)' }}>
              {bookmarks.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Saved Stories
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontFamily: 'var(--font-serif)', color: 'var(--gold-primary)' }}>
              {submissions.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Submissions
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '2rem'
      }}>
        <button
          onClick={() => setActiveTab('bookmarks')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.25rem',
            backgroundColor: 'transparent',
            color: activeTab === 'bookmarks' ? 'var(--gold-primary)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'bookmarks' ? '2px solid var(--gold-primary)' : '2px solid transparent',
            fontWeight: 700,
            fontFamily: 'var(--font-serif)',
            fontSize: '0.9rem'
          }}
        >
          <Bookmark size={16} />
          <span>My Collection ({bookmarks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('submissions')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.25rem',
            backgroundColor: 'transparent',
            color: activeTab === 'submissions' ? 'var(--gold-primary)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'submissions' ? '2px solid var(--gold-primary)' : '2px solid transparent',
            fontWeight: 700,
            fontFamily: 'var(--font-serif)',
            fontSize: '0.9rem'
          }}
        >
          <PlusCircle size={16} />
          <span>Submitted Lore ({submissions.length})</span>
        </button>
      </div>

      {/* Tab 1: Saved Bookmarks */}
      {activeTab === 'bookmarks' && (
        <div>
          {bookmarks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'rgba(18, 25, 33, 0.4)', borderRadius: '8px' }}>
              <Bookmark size={36} color="var(--gold-muted)" style={{ marginBottom: '1rem' }} />
              <p style={{ color: 'var(--text-muted)' }}>You have not bookmarked any folklore stories yet.</p>
              <Link to="/explore" className="btn-secondary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
                Browse the Archive
              </Link>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '2rem'
            }}>
              {bookmarks.map((b) => (
                <div key={b.bookmarkId} style={{ position: 'relative' }}>
                  <StoryCard story={b.story} />
                  <button
                    onClick={() => handleRemoveBookmark(b.story._id)}
                    style={{
                      position: 'absolute',
                      top: '0.85rem',
                      right: '0.85rem',
                      zIndex: 3,
                      backgroundColor: 'rgba(10, 15, 20, 0.85)',
                      color: '#ff7b72',
                      border: '1px solid rgba(255, 123, 114, 0.4)',
                      padding: '0.3rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                    title="Remove from saved collection"
                  >
                    <Trash2 size={12} />
                    <span>Remove</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: User Submissions */}
      {activeTab === 'submissions' && (
        <div>
          {submissions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'rgba(18, 25, 33, 0.4)', borderRadius: '8px' }}>
              <PlusCircle size={36} color="var(--gold-muted)" style={{ marginBottom: '1rem' }} />
              <p style={{ color: 'var(--text-muted)' }}>You have not submitted any local folklore yet.</p>
              <Link to="/submit" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
                Inscribe a Local Myth
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {submissions.map((sub) => (
                <div
                  key={sub._id}
                  style={{
                    backgroundColor: 'rgba(14, 20, 27, 0.85)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1.25rem'
                  }}
                >
                  <div style={{ flex: 1, minWidth: '280px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                        {sub.title}
                      </h3>
                      {getStatusBadge(sub.status)}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      {sub.category} • {sub.country}{sub.region ? ` (${sub.region})` : ''} • Submitted on {new Date(sub.createdAt).toLocaleDateString()}
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {sub.summary}
                    </p>
                  </div>

                  {sub.status === 'published' && (
                    <Link to={`/stories/${sub.slug}`} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                      View Published Story →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
