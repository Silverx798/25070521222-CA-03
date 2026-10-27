import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchAdminSubmissions, updateSubmissionStatus, fetchReports, updateReportStatus, fetchAssetDiagnostics } from '../services/api';
import { Shield, Check, X, Clock, AlertTriangle, Eye, ArrowLeft, RefreshCw, Star, Database, Image, BarChart3, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
  const { user } = useAuth();

  const [submissions, setSubmissions] = useState([]);
  const [reports, setReports] = useState([]);
  const [diagnostics, setDiagnostics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('submissions'); // 'submissions', 'reports', or 'diagnostics'
  const [statusFilter, setStatusFilter] = useState('pending');
  const [selectedSub, setSelectedSub] = useState(null);
  const [actionSuccess, setActionSuccess] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [subsRes, repsRes, diagRes] = await Promise.all([
        fetchAdminSubmissions({ status: statusFilter }),
        fetchReports(),
        fetchAssetDiagnostics().catch(() => null)
      ]);
      setSubmissions(subsRes.data || []);
      setReports(repsRes || []);
      setDiagnostics(diagRes || null);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'moderator')) {
      loadData();
    }
  }, [user, statusFilter]);

  const handleUpdateStatus = async (id, newStatus, featured = false) => {
    try {
      await updateSubmissionStatus(id, { status: newStatus, featured });
      setActionSuccess(`Submission status updated to: ${newStatus}`);
      setTimeout(() => setActionSuccess(''), 3000);
      setSelectedSub(null);
      loadData();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
    return (
      <div style={{ maxWidth: '600px', margin: '6rem auto', textAlign: 'center', padding: '2rem' }}>
        <Shield size={48} color="var(--crimson-primary)" style={{ marginBottom: '1rem' }} />
        <h2 style={{ color: 'var(--crimson-primary)' }}>Access Forbidden</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0 2rem' }}>
          This sanctuary is strictly reserved for appointed Archivists and Curators.
        </p>
        <Link to="/" className="btn-primary">Return to Archive</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '3rem 1.5rem 6rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="gold-badge" style={{ marginBottom: '0.5rem', backgroundColor: 'rgba(148, 43, 50, 0.2)', borderColor: 'var(--crimson-primary)', color: '#ff9999' }}>
            <Shield size={14} />
            <span>Curatorial Control Console</span>
          </div>
          <h1 style={{ fontSize: '2.4rem' }}>
            Moderation & Editorial Review
          </h1>
        </div>

        <button onClick={loadData} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1rem' }}>
          <RefreshCw size={15} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {actionSuccess && (
        <div style={{
          padding: '0.85rem 1.25rem',
          backgroundColor: 'rgba(142, 208, 129, 0.2)',
          border: '1px solid #8ed081',
          borderRadius: '4px',
          color: '#8ed081',
          marginBottom: '1.5rem',
          fontSize: '0.9rem'
        }}>
          {actionSuccess}
        </div>
      )}

      {/* Tabs & Status Filters */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => setActiveTab('submissions')}
            style={{
              padding: '0.75rem 1.25rem',
              backgroundColor: 'transparent',
              color: activeTab === 'submissions' ? 'var(--gold-primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'submissions' ? '2px solid var(--gold-primary)' : '2px solid transparent',
              fontFamily: 'var(--font-serif)',
              fontSize: '0.95rem',
              fontWeight: 700
            }}
          >
            Submissions Queue ({submissions.length})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            style={{
              padding: '0.75rem 1.25rem',
              backgroundColor: 'transparent',
              color: activeTab === 'reports' ? 'var(--gold-primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'reports' ? '2px solid var(--gold-primary)' : '2px solid transparent',
              fontFamily: 'var(--font-serif)',
              fontSize: '0.95rem',
              fontWeight: 700
            }}
          >
            Reported Content ({reports.length})
          </button>
          <button
            onClick={() => setActiveTab('diagnostics')}
            style={{
              padding: '0.75rem 1.25rem',
              backgroundColor: 'transparent',
              color: activeTab === 'diagnostics' ? 'var(--gold-primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'diagnostics' ? '2px solid var(--gold-primary)' : '2px solid transparent',
              fontFamily: 'var(--font-serif)',
              fontSize: '0.95rem',
              fontWeight: 700
            }}
          >
            Asset Diagnostics {diagnostics ? `(${diagnostics.totalStories})` : ''}
          </button>
        </div>

        {activeTab === 'submissions' && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['pending', 'published', 'rejected', 'all'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  fontSize: '0.75rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '4px',
                  backgroundColor: statusFilter === st ? 'var(--gold-primary)' : 'rgba(18, 25, 33, 0.8)',
                  color: statusFilter === st ? '#000' : 'var(--text-secondary)',
                  border: '1px solid var(--border-dark)',
                  fontWeight: 600,
                  textTransform: 'uppercase'
                }}
              >
                {st}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Submissions List */}
      {activeTab === 'submissions' && (
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              Loading moderation queue...
            </div>
          ) : submissions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'rgba(18, 25, 33, 0.4)', borderRadius: '8px' }}>
              <Check size={40} color="#8ed081" style={{ marginBottom: '1rem' }} />
              <p style={{ color: 'var(--text-muted)' }}>No submissions found for filter '{statusFilter}'. The archive is clear.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {submissions.map((sub) => (
                <div
                  key={sub._id}
                  style={{
                    backgroundColor: 'rgba(14, 20, 27, 0.9)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                        <span className={`category-tag ${sub.category}`}>
                          {sub.category}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)' }}>
                          {sub.country}{sub.region ? ` • ${sub.region}` : ''}
                        </span>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                          backgroundColor: sub.status === 'published' ? 'rgba(142, 208, 129, 0.2)' : 'rgba(227, 179, 65, 0.2)',
                          color: sub.status === 'published' ? '#8ed081' : '#e3b341',
                          textTransform: 'uppercase'
                        }}>
                          {sub.status}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.35rem', color: 'var(--text-primary)' }}>
                        {sub.title}
                      </h3>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Inscriber: <strong>{sub.createdBy?.displayName || 'Anonymous Scribe'}</strong> ({sub.createdBy?.email || 'N/A'}) • {new Date(sub.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {sub.status !== 'published' && (
                        <button
                          onClick={() => handleUpdateStatus(sub._id, 'published')}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            backgroundColor: '#8ed081',
                            color: '#070a0d',
                            padding: '0.45rem 0.9rem',
                            borderRadius: '4px',
                            fontWeight: 700,
                            fontSize: '0.75rem'
                          }}
                        >
                          <Check size={14} /> Approve & Publish
                        </button>
                      )}

                      {sub.status !== 'rejected' && (
                        <button
                          onClick={() => handleUpdateStatus(sub._id, 'rejected')}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            backgroundColor: 'rgba(148, 43, 50, 0.3)',
                            color: '#ff9999',
                            border: '1px solid var(--crimson-primary)',
                            padding: '0.45rem 0.9rem',
                            borderRadius: '4px',
                            fontWeight: 700,
                            fontSize: '0.75rem'
                          }}
                        >
                          <X size={14} /> Reject
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedSub(selectedSub?._id === sub._id ? null : sub)}
                        className="btn-secondary"
                        style={{ padding: '0.45rem 0.9rem', fontSize: '0.75rem' }}
                      >
                        <Eye size={14} /> {selectedSub?._id === sub._id ? 'Hide Details' : 'Inspect Lore'}
                      </button>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {sub.summary}
                  </p>

                  {/* Expanded Full Inspection Panel */}
                  {selectedSub?._id === sub._id && (
                    <div style={{
                      marginTop: '1rem',
                      padding: '1.5rem',
                      backgroundColor: 'rgba(8, 12, 16, 0.9)',
                      border: '1px dashed var(--border-subtle)',
                      borderRadius: '6px'
                    }}>
                      <h4 style={{ color: 'var(--gold-primary)', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                        Full Manuscript & Attributions:
                      </h4>
                      <p style={{ whiteSpace: 'pre-line', fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                        {sub.body}
                      </p>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <strong>Coordinates:</strong> [{sub.location?.coordinates?.[1]}, {sub.location?.coordinates?.[0]}]
                      </div>
                      {sub.originCommunity && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          <strong>Cultural Origin:</strong> {sub.originCommunity}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reports List */}
      {activeTab === 'reports' && (
        <div>
          {reports.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'rgba(18, 25, 33, 0.4)', borderRadius: '8px' }}>
              <Check size={40} color="#8ed081" style={{ marginBottom: '1rem' }} />
              <p style={{ color: 'var(--text-muted)' }}>No flagged reports in the archive.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {reports.map((rep) => (
                <div
                  key={rep._id}
                  style={{
                    backgroundColor: 'rgba(14, 20, 27, 0.9)',
                    border: '1px solid var(--crimson-primary)',
                    borderRadius: '8px',
                    padding: '1.5rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#ff7b72', fontWeight: 700, fontSize: '0.8rem' }}>
                      REASON: {rep.reason.toUpperCase()}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Status: {rep.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    {rep.details || 'No additional details provided.'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Asset Diagnostics Tab */}
      {activeTab === 'diagnostics' && (
        <div>
          {!diagnostics ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              <RefreshCw size={36} className="spin" style={{ marginBottom: '1rem' }} />
              <p>Analyzing collection assets and provenance records...</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Top Overview Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                <div style={{ padding: '1.5rem', backgroundColor: 'rgba(14, 20, 27, 0.9)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>Total Chronicles</div>
                  <div style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', color: 'var(--gold-primary)' }}>{diagnostics.totalStories}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>Persisted in MongoDB</div>
                </div>

                <div style={{ padding: '1.5rem', backgroundColor: 'rgba(14, 20, 27, 0.9)', border: '1px solid #8ed081', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#8ed081', marginBottom: '0.35rem', textTransform: 'uppercase' }}>Source-Verified Imagery</div>
                  <div style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', color: '#8ed081' }}>{diagnostics.verifiedImages}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>{diagnostics.verificationRate} verified rate</div>
                </div>

                <div style={{ padding: '1.5rem', backgroundColor: 'rgba(14, 20, 27, 0.9)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>Archival Placeholders</div>
                  <div style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', color: 'var(--gold-muted)' }}>{diagnostics.fallbackImages}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>Fallback category artwork</div>
                </div>

                <div style={{ padding: '1.5rem', backgroundColor: 'rgba(14, 20, 27, 0.9)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>Image Duplications</div>
                  <div style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', color: diagnostics.duplicateImages?.length > 0 ? '#ff7b72' : '#8ed081' }}>
                    {diagnostics.duplicateImages?.length || 0}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                    {diagnostics.duplicateImages?.length > 0 ? 'Duplicate URLs detected' : 'Zero cross-story duplication'}
                  </div>
                </div>
              </div>

              {/* Categorical & Continental Distribution */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                <div style={{ padding: '1.5rem', backgroundColor: 'rgba(12, 17, 24, 0.9)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--gold-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BarChart3 size={16} /> Category Distribution
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {diagnostics.categoryStats?.map((c) => (
                      <div key={c._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{c._id}</span>
                        <span style={{ color: 'var(--gold-primary)', fontWeight: 600 }}>{c.count} stories</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ padding: '1.5rem', backgroundColor: 'rgba(12, 17, 24, 0.9)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--gold-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BarChart3 size={16} /> Geographic Spread (Continents)
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {diagnostics.continentStats?.map((c) => (
                      <div key={c._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{c._id}</span>
                        <span style={{ color: 'var(--gold-primary)', fontWeight: 600 }}>{c.count} stories</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
