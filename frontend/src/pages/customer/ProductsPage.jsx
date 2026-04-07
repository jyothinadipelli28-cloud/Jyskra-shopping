import { useState, useEffect } from 'react';
import api from '../../api';
import ProductCard from '../../components/ProductCard';

const CATEGORIES = ['All','Electronics','Clothing','Books','Home & Garden','Sports','Toys','Beauty','Food','Other'];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { setPage(1); }, [category, sort, debouncedSearch]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ category, sort, page, limit: 12 });
        if (debouncedSearch) params.append('search', debouncedSearch);
        const res = await api.get(`/products?${params}`);
        setProducts(res.data.products);
        setTotalPages(res.data.pages);
        setTotal(res.data.total);
      } catch { } finally { setLoading(false); }
    };
    fetch();
  }, [category, sort, debouncedSearch, page]);

  return (
    <div className="fade-in">
      <h1 className="section-title">🛍️ Shop</h1>

      {/* Filters */}
      <div style={{ display:'flex', gap:'0.75rem', marginBottom:'1.5rem', flexWrap:'wrap', alignItems:'center' }}>
        <input
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width:'240px' }}
        />
        <select value={sort} onChange={e => setSort(e.target.value)} style={{ width:'150px' }}>
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="popular">Most Popular</option>
        </select>
        <span style={{ marginLeft:'auto', fontSize:'0.82rem', color:'var(--text-secondary)' }}>
          {total} products
        </span>
      </div>

      {/* Category pills */}
      <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            style={{
              padding:'0.35rem 0.9rem', borderRadius:'999px', fontSize:'0.82rem',
              fontWeight: category === c ? 700 : 400,
              background: category === c ? 'var(--accent)' : 'var(--bg-elevated)',
              color: category === c ? '#fff' : 'var(--text-secondary)',
              border: '1px solid ' + (category === c ? 'var(--accent)' : 'var(--border)'),
              cursor:'pointer', transition:'all 0.15s ease'
            }}
          >{c}</button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="page-loader"><div className="spinner" /></div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🔍</div>
          <h3>No products found</h3>
          <p>Try a different category or search term</p>
        </div>
      ) : (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:'1rem', marginBottom:'1.5rem' }}>
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>

          {totalPages > 1 && (
            <div style={{ display:'flex', gap:'0.5rem', justifyContent:'center' }}>
              <button className="btn btn-secondary btn-sm" disabled={page === 1} onClick={() => setPage(p => p-1)}>← Prev</button>
              {Array.from({length: totalPages}, (_, i) => i+1).map(n => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  style={{
                    padding:'0.4rem 0.75rem', borderRadius:'var(--radius-sm)', fontSize:'0.875rem',
                    background: n === page ? 'var(--accent)' : 'var(--bg-elevated)',
                    color: n === page ? '#fff' : 'var(--text-secondary)',
                    border:'1px solid '+(n === page ? 'var(--accent)' : 'var(--border)'),
                    cursor:'pointer'
                  }}
                >{n}</button>
              ))}
              <button className="btn btn-secondary btn-sm" disabled={page === totalPages} onClick={() => setPage(p => p+1)}>Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
