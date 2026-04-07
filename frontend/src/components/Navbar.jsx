import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
  };

  return (
    <header style={{
      background: 'var(--bg-card)',
      borderBottom: '1px solid var(--border)',
      padding: '0 1.5rem',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '1.2rem' }}>🛍️</span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem' }}>
          JYSKRA <span style={{ color: 'var(--accent)' }}>AI</span>
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user?.role === 'customer' && (
          <Link to="/cart" style={{ position: 'relative' }}>
            <button className="btn btn-ghost btn-sm">
              🛒 Cart
              {itemCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-6px', right: '-6px',
                  background: 'var(--accent)', color: '#fff',
                  borderRadius: '50%', width: '18px', height: '18px',
                  fontSize: '0.65rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>{itemCount}</span>
              )}
            </button>
          </Link>
        )}

        <Link to="/profile">
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--accent-dim)', border: '2px solid var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent)',
            cursor: 'pointer'
          }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
        </Link>

        <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
          ↩ Logout
        </button>
      </div>
    </header>
  );
}
