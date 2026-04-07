import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/products', label: 'Products', icon: '📦' },
  { to: '/admin/orders', label: 'Orders', icon: '📋' },
  { to: '/admin/users', label: 'Users', icon: '👥' },
  { to: '/profile', label: 'Profile', icon: '👤' }
];

const customerLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠', end: true },
  { to: '/products', label: 'Shop', icon: '🛍️' },
  { to: '/cart', label: 'Cart', icon: '🛒' },
  { to: '/orders', label: 'My Orders', icon: '📦' },
  { to: '/profile', label: 'Profile', icon: '👤' }
];

export default function Sidebar() {
  const { user } = useAuth();
  const links = user?.role === 'admin' ? adminLinks : customerLinks;

  return (
    <aside style={{
      width: '220px',
      background: 'var(--bg-card)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 0',
      flexShrink: 0
    }}>
      <div style={{ padding: '0 1rem 1.5rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
          Signed in as
        </div>
        <div style={{ fontWeight: 600, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user?.name}
        </div>
        <span style={{
          display: 'inline-block', marginTop: '0.3rem', padding: '0.15rem 0.5rem',
          background: user?.role === 'admin' ? 'rgba(108,99,255,0.15)' : 'rgba(34,197,94,0.15)',
          color: user?.role === 'admin' ? 'var(--accent)' : 'var(--success)',
          borderRadius: '999px', fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase'
        }}>
          {user?.role}
        </span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '0 0.75rem' }}>
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem', fontWeight: isActive ? 600 : 400,
              color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
              background: isActive ? 'var(--accent-dim)' : 'transparent',
              transition: 'all 0.15s ease',
              textDecoration: 'none'
            })}
          >
            <span style={{ fontSize: '1rem' }}>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
