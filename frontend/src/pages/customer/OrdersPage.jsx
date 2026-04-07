import { useState, useEffect } from 'react';
import api from '../../api';
import toast from 'react-hot-toast';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.get('/orders/my')
      .then(res => setOrders(res.data))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div className="fade-in">
      <h1 className="section-title">📦 My Orders</h1>

      {orders.length === 0 ? (
        <div className="empty-state card">
          <div className="icon">📦</div>
          <h3>No orders yet</h3>
          <p>Start shopping to see your orders here</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
          {orders.map(order => (
            <div key={order._id} className="card" style={{ padding:0, overflow:'hidden' }}>
              <div
                style={{ padding:'1rem 1.5rem', display:'flex', alignItems:'center', gap:'1rem', cursor:'pointer', flexWrap:'wrap' }}
                onClick={() => setExpanded(expanded === order._id ? null : order._id)}
              >
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', flexWrap:'wrap' }}>
                    <span style={{ fontFamily:'monospace', fontSize:'0.85rem', fontWeight:700, color:'var(--text-secondary)' }}>
                      #{order._id.slice(-10).toUpperCase()}
                    </span>
                    <span className={`badge badge-${order.status.toLowerCase()}`}>{order.status}</span>
                  </div>
                  <div style={{ fontSize:'0.8rem', color:'var(--text-secondary)', marginTop:'0.3rem' }}>
                    {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle:'medium', timeStyle:'short' })}
                    {' · '}{order.items.length} item{order.items.length > 1 ? 's' : ''}
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'1.1rem' }}>
                    ₹{order.totalPrice.toLocaleString()}
                  </div>
                  <div style={{ fontSize:'0.75rem', color:'var(--text-secondary)' }}>
                    {order.paymentMethod}
                  </div>
                </div>
                <span style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>
                  {expanded === order._id ? '▲' : '▼'}
                </span>
              </div>

              {expanded === order._id && (
                <div style={{ borderTop:'1px solid var(--border)', padding:'1rem 1.5rem', background:'var(--bg-elevated)' }}>
                  <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem', marginBottom:'1rem' }}>
                    {order.items.map((item, i) => (
                      <div key={i} style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                        <div style={{ width:44, height:44, borderRadius:'var(--radius-sm)', overflow:'hidden', background:'var(--bg-card)', flexShrink:0 }}>
                          {item.image
                            ? <img src={item.image} alt={item.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                            : <span style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%' }}>📦</span>}
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:600, fontSize:'0.875rem' }}>{item.name}</div>
                          <div style={{ fontSize:'0.75rem', color:'var(--text-secondary)' }}>
                            ₹{item.price.toLocaleString()} × {item.quantity}
                          </div>
                        </div>
                        <div style={{ fontWeight:700, fontSize:'0.9rem' }}>
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  {order.shippingAddress?.street && (
                    <div style={{ fontSize:'0.8rem', color:'var(--text-secondary)', paddingTop:'0.75rem', borderTop:'1px solid var(--border)' }}>
                      <strong style={{ color:'var(--text-primary)' }}>Ship to: </strong>
                      {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
