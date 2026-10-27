import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchStories } from '../services/api';
import StoryCard from '../components/cards/StoryCard';
import { Filter, Search, RotateCcw, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State initialized from URL query params
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [continent, setContinent] = useState(searchParams.get('continent') || '');
  const [country, setCountry] = useState(searchParams.get('country') || '');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'recent');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  const [stories, setStories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  // Sync state when URL params change (e.g. from navbar search or category clicks)
  useEffect(() => {
    setCategory(searchParams.get('category') || '');
    setContinent(searchParams.get('continent') || '');
    setCountry(searchParams.get('country') || '');
    setSearch(searchParams.get('search') || '');
    setSort(searchParams.get('sort') || 'recent');
    setPage(parseInt(searchParams.get('page') || '1', 10));
  }, [searchParams]);

  // Fetch stories whenever filters or page changes
  useEffect(() => {
    const loadArchive = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: 12,
          sort
        };
        if (category) params.category = category;
        if (continent) params.continent = continent;
        if (country) params.country = country;
        if (search) params.search = search;

        const res = await fetchStories(params);
        setStories(res.data);
        setPagination(res.pagination);
      } catch (err) {
        console.error('Failed to load archive stories:', err);
      } finally {
        setLoading(false);
      }
    };

    loadArchive();
  }, [category, continent, country, search, sort, page]);

  const updateFilters = (newFilters) => {
    const updated = {
      ...(category && { category }),
      ...(continent && { continent }),
      ...(country && { country }),
      ...(search && { search }),
      ...(sort !== 'recent' && { sort }),
      ...newFilters,
      page: 1 // reset to page 1 on filter changes
    };

    // Remove empty keys
    Object.keys(updated).forEach((k) => !updated[k] && delete updated[k]);
    setSearchParams(updated);
  };

  const handleClearFilters = () => {
    setCategory('');
    setContinent('');
    setCountry('');
    setSearch('');
    setSort('recent');
    setSearchParams({});
  };

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div className="gold-badge" style={{ marginBottom: '0.75rem' }}>
          <BookOpen size={14} />
          <span>The Complete Annals</span>
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          Explore the Archive
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', fontSize: '0.95rem' }}>
          Filter across centuries of recorded urban folklore, cryptid sightings, haunted locations, and cultural myths.
        </p>
      </div>

      {/* Filter & Control Bar */}
      <div style={{
        backgroundColor: 'var(--bg-glass-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '1.25rem',
        marginBottom: '2.5rem',
        boxShadow: 'var(--shadow-subtle)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          alignItems: 'center'
        }}>
          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search lore, title, tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && updateFilters({ search })}
              style={{ width: '100%', paddingLeft: '2.4rem' }}
            />
            <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          {/* Category Dropdown */}
          <select
            value={category}
            onChange={(e) => updateFilters({ category: e.target.value })}
          >
            <option value="">All Categories</option>
            <option value="cryptids">Cryptids & Beasts</option>
            <option value="urban-legends">Urban Legends</option>
            <option value="ghost-stories">Ghost Stories</option>
            <option value="haunted-places">Haunted Places</option>
            <option value="myths-legends">Myths & Legends</option>
            <option value="unexplained-phenomena">Unexplained Phenomena</option>
          </select>

          {/* Continent Dropdown */}
          <select
            value={continent}
            onChange={(e) => updateFilters({ continent: e.target.value })}
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

          {/* Sorting */}
          <select
            value={sort}
            onChange={(e) => updateFilters({ sort: e.target.value })}
          >
            <option value="recent">Sort by: Recently Inscribed</option>
            <option value="popular">Sort by: Most Read / Popular</option>
            <option value="title">Sort by: Title (A-Z)</option>
            <option value="oldest">Sort by: Oldest First</option>
          </select>

          {/* Clear Filters Button */}
          <button
            onClick={handleClearFilters}
            className="btn-secondary"
            style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', width: '100%' }}
            title="Clear all active filters"
          >
            <RotateCcw size={14} />
            <span>Clear Filters</span>
          </button>
        </div>

        {/* Results Metadata Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '1rem',
          paddingTop: '0.85rem',
          borderTop: '1px solid var(--border-dark)',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            Showing <strong>{stories.length}</strong> of <strong>{pagination.total}</strong> records
            {category && ` in ${category}`}
            {continent && ` from ${continent}`}
          </div>
          <div>
            Page {pagination.page} of {pagination.totalPages || 1}
          </div>
        </div>
      </div>

      {/* Stories Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--text-muted)' }}>
          <BookOpen size={36} color="var(--gold-primary)" style={{ animation: 'spin 4s linear infinite', marginBottom: '1rem' }} />
          <p>Unrolling parchment records from MongoDB...</p>
        </div>
      ) : stories.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '6rem 2rem',
          backgroundColor: 'rgba(18, 25, 33, 0.5)',
          border: '1px dashed var(--border-subtle)',
          borderRadius: '8px'
        }}>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--gold-primary)', marginBottom: '0.5rem' }}>
            No Folklore Matches Your Query
          </h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
            No records matched the selected combination of categories and locations. Try clearing your filters or contributing a new local account.
          </p>
          <button onClick={handleClearFilters} className="btn-primary">
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            {stories.map((story) => (
              <StoryCard key={story._id} story={story} />
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '3rem' }}>
              <button
                disabled={pagination.page <= 1}
                onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: pagination.page - 1 })}
                className="btn-secondary"
                style={{ opacity: pagination.page <= 1 ? 0.4 : 1, padding: '0.6rem 1.2rem' }}
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <span style={{ fontSize: '0.9rem', color: 'var(--gold-primary)', fontFamily: 'var(--font-serif)' }}>
                Page {pagination.page} / {pagination.totalPages}
              </span>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: pagination.page + 1 })}
                className="btn-secondary"
                style={{ opacity: pagination.page >= pagination.totalPages ? 0.4 : 1, padding: '0.6rem 1.2rem' }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExplorePage;
