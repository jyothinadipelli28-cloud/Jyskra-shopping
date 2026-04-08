import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import ProductCard from '../../components/ProductCard';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { cart } = useCart();
  const [recommended, setRecommended] = useState([]);
  const [trending, setTrending] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [recommendationResult, trendingResult, ordersResult] = await Promise.allSettled([
          api.get('/recommendations'),
          api.get('/products?sort=popular&limit=4'),
          api.get('/orders/my')
        ]);

        const recommendationData =
          recommendationResult.status === 'fulfilled' && Array.isArray(recommendationResult.value.data)
            ? recommendationResult.value.data
            : [];

        const trendingData =
          trendingResult.status === 'fulfilled' && Array.isArray(trendingResult.value.data?.products)
            ? trendingResult.value.data.products
            : [];

        const ordersData =
          ordersResult.status === 'fulfilled' && Array.isArray(ordersResult.value.data)
            ? ordersResult.value.data
            : [];

        setRecommended(recommendationData.slice(0, 4));
        setTrending(trendingData.slice(0, 4));
        setOrders(ordersData.slice(0, 5));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner" />
      </div>
    );
  }

  const totalSpent = orders
    .filter(order => order.status !== 'Cancelled')
    .reduce((sum, order) => sum + order.totalPrice, 0);
  const firstName = user?.name?.split?.(' ')?.[0] || 'Shopper';

  return (
    <div className="fade-in">
      <div
        style={{
          background: 'linear-gradient(135deg, var(--accent-dim) 0%, rgba(108,99,255,0.05) 100%)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.75rem',
              fontWeight: 800,
              marginBottom: '0.4rem'
            }}
          >
            Welcome back, {firstName}!
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Discover personalized products just for you
          </p>
        </div>
        <Link to="/products">
          <button className="btn btn-primary btn-lg">Shop Now</button>
        </Link>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        {[
          { label: 'Total Orders', value: orders.length, icon: 'Orders', color: '#6c63ff' },
          { label: 'Total Spent', value: `Rs ${totalSpent.toLocaleString()}`, icon: 'Spend', color: '#22c55e' },
          { label: 'Cart Items', value: cart.items?.length || 0, icon: 'Cart', color: '#f59e0b' },
          { label: 'Delivered', value: orders.filter(order => order.status === 'Delivered').length, icon: 'Done', color: '#3b82f6' }
        ].map(stat => (
          <div key={stat.label} className="stat-card">
            <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color, fontSize: '0.85rem' }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <h3 style={{ fontSize: '1.3rem', color: stat.color }}>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}
          >
            <h2 className="section-title" style={{ marginBottom: 0 }}>
              AI Recommendations
            </h2>
            <Link to="/products" style={{ fontSize: '0.82rem', color: 'var(--accent)' }}>
              View all
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {(recommended.length > 0 ? recommended : trending).map(product => (
              <ProductCard key={product._id} product={product} showReason={recommended.length > 0} />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Cart</h3>
              <Link to="/cart" style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>
                View cart
              </Link>
            </div>
            {cart.items?.length > 0 ? (
              <>
                {cart.items.slice(0, 3).map(item => (
                  <div
                    key={item._id}
                    style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.6rem', alignItems: 'center' }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        background: 'var(--bg-elevated)',
                        flexShrink: 0
                      }}
                    >
                      {item.product?.image ? (
                        <img src={item.product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            fontSize: '0.8rem'
                          }}
                        >
                          Img
                        </span>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {item.product?.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>x{item.quantity}</div>
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                      Rs {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
                <div
                  style={{
                    borderTop: '1px solid var(--border)',
                    paddingTop: '0.75rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: 700
                  }}
                >
                  <span>Total</span>
                  <span style={{ color: 'var(--accent)' }}>Rs {cart.totalPrice.toLocaleString()}</span>
                </div>
                <Link to="/cart">
                  <button className="btn btn-primary w-full" style={{ marginTop: '0.75rem' }}>
                    Checkout
                  </button>
                </Link>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Cart is empty
              </div>
            )}
          </div>

          <div className="card">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Recent Orders</h3>
              <Link to="/orders" style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>
                All
              </Link>
            </div>
            {orders.length > 0 ? (
              orders.map(order => (
                <div
                  key={order._id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.5rem 0',
                    borderBottom: '1px solid var(--border)'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>#{order._id.slice(-6).toUpperCase()}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                      Rs {order.totalPrice.toLocaleString()}
                    </div>
                  </div>
                  <span className={`badge badge-${order.status.toLowerCase()}`}>{order.status}</span>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem', padding: '1rem 0' }}>
                No orders yet
              </div>
            )}
          </div>
        </div>
      </div>

      {trending.length > 0 && (
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}
          >
            <h2 className="section-title" style={{ marginBottom: 0 }}>
              Trending Now
            </h2>
            <Link to="/products?sort=popular" style={{ fontSize: '0.82rem', color: 'var(--accent)' }}>
              See all
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {trending.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
