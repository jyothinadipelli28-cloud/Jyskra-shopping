import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product, showReason = false }) {
  const { addToCart } = useCart();

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addToCart(product._id, 1);
      toast.success(`${product.name} added to cart`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const imageUrl = product.image
    ? product.image.startsWith('/uploads') ? product.image : `/uploads/${product.image}`
    : null;

  return (
    <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          height: '180px', background: 'var(--bg-elevated)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', position: 'relative'
        }}>
          {imageUrl ? (
            <img src={imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: '3rem', opacity: 0.3 }}>📦</span>
          )}
          {product.stock === 0 && (
            <div style={{
              position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--danger)', fontWeight: 700, fontSize: '0.9rem'
            }}>Out of Stock</div>
          )}
          {showReason && product.reason && (
            <div style={{
              position: 'absolute', top: '0.5rem', left: '0.5rem',
              background: 'var(--accent)', color: '#fff',
              padding: '0.2rem 0.5rem', borderRadius: '999px',
              fontSize: '0.68rem', fontWeight: 600
            }}>{product.reason}</div>
          )}
        </div>
        <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
            {product.category}
          </div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.3 }}>{product.name}</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {product.description}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.5rem' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem' }}>
              ₹{product.price.toLocaleString()}
            </span>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleAdd}
              disabled={product.stock === 0}
              style={{ pointerEvents: product.stock === 0 ? 'none' : 'auto' }}
            >
              + Cart
            </button>
          </div>
          <div style={{ fontSize: '0.72rem', color: product.stock > 0 ? 'var(--success)' : 'var(--danger)' }}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </div>
        </div>
      </div>
    </Link>
  );
}
