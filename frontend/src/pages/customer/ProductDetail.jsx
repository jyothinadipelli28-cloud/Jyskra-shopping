import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';
import ProductCard from '../../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
        const rel = await api.get(`/products?category=${res.data.category}&limit=4`);
        setRelated(rel.data.products.filter(p => p._id !== id));
      } catch { toast.error('Product not found'); }
      finally { setLoading(false); }
    };
    fetch();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAdd = async () => {
    setAdding(true);
    try {
      await addToCart(product._id, qty);
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add');
    } finally { setAdding(false); }
  };

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!product) return <div className="empty-state"><h3>Product not found</h3><Link to="/products" className="btn btn-primary">Back to Shop</Link></div>;

  return (
    <div className="fade-in">
      <Link to="/products" style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', color:'var(--text-secondary)', fontSize:'0.875rem', marginBottom:'1.5rem' }}>
        ← Back to Shop
      </Link>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2.5rem', marginBottom:'3rem' }}>
        {/* Image */}
        <div style={{
          borderRadius:'var(--radius-lg)', overflow:'hidden',
          background:'var(--bg-elevated)', aspectRatio:'1',
          display:'flex', alignItems:'center', justifyContent:'center'
        }}>
          {product.image
            ? <img src={product.image} alt={product.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            : <span style={{ fontSize:'5rem', opacity:0.3 }}>📦</span>}
        </div>

        {/* Info */}
        <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
          <div>
            <span style={{ fontSize:'0.75rem', color:'var(--accent)', textTransform:'uppercase', letterSpacing:'0.08em', fontWeight:600 }}>
              {product.category}
            </span>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:'2rem', fontWeight:800, lineHeight:1.2, marginTop:'0.3rem' }}>
              {product.name}
            </h1>
          </div>

          <div style={{ fontFamily:'var(--font-display)', fontSize:'2.2rem', fontWeight:800, color:'var(--accent)' }}>
            ₹{product.price.toLocaleString()}
          </div>

          <p style={{ color:'var(--text-secondary)', lineHeight:1.7 }}>{product.description}</p>

          <div style={{ display:'flex', gap:'1.5rem', fontSize:'0.875rem' }}>
            <div>
              <span style={{ color:'var(--text-secondary)' }}>Stock: </span>
              <span style={{ fontWeight:700, color: product.stock > 0 ? 'var(--success)' : 'var(--danger)' }}>
                {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
              </span>
            </div>
            <div>
              <span style={{ color:'var(--text-secondary)' }}>Views: </span>
              <span style={{ fontWeight:600 }}>{product.viewCount}</span>
            </div>
            <div>
              <span style={{ color:'var(--text-secondary)' }}>Sold: </span>
              <span style={{ fontWeight:600 }}>{product.salesCount}</span>
            </div>
          </div>

          {product.tags?.length > 0 && (
            <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap' }}>
              {product.tags.map(tag => (
                <span key={tag} style={{
                  padding:'0.2rem 0.6rem', background:'var(--bg-elevated)',
                  border:'1px solid var(--border)', borderRadius:'999px',
                  fontSize:'0.75rem', color:'var(--text-secondary)'
                }}>#{tag}</span>
              ))}
            </div>
          )}

          {product.stock > 0 && (
            <div style={{ display:'flex', gap:'1rem', alignItems:'center' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', background:'var(--bg-elevated)', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)', padding:'0.3rem' }}>
                <button
                  onClick={() => setQty(q => Math.max(1, q-1))}
                  style={{ width:32, height:32, background:'none', border:'none', color:'var(--text-primary)', fontSize:'1.1rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}
                >−</button>
                <span style={{ width:30, textAlign:'center', fontWeight:700 }}>{qty}</span>
                <button
                  onClick={() => setQty(q => Math.min(product.stock, q+1))}
                  style={{ width:32, height:32, background:'none', border:'none', color:'var(--text-primary)', fontSize:'1.1rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}
                >+</button>
              </div>
              <button className="btn btn-primary btn-lg" onClick={handleAdd} disabled={adding} style={{ flex:1 }}>
                {adding ? 'Adding...' : '🛒 Add to Cart'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div>
          <h2 className="section-title">Related Products</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'1rem' }}>
            {related.slice(0,4).map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
