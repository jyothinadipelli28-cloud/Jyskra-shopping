import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import api from '../../api';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { cart, updateQuantity, removeItem, clearCart, cartLoading } = useCart();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [address, setAddress] = useState({ street:'', city:'', state:'', zipCode:'' });
  const [showCheckout, setShowCheckout] = useState(false);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setPlacing(true);
    try {
      const res = await api.post('/orders', { shippingAddress: address, paymentMethod: 'Cash on Delivery' });
      toast.success('Order placed successfully! 🎉');
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally { setPlacing(false); }
  };

  if (cartLoading) return <div className="page-loader"><div className="spinner" /></div>;

  if (!cart.items?.length) return (
    <div className="fade-in">
      <h1 className="section-title">🛒 Your Cart</h1>
      <div className="empty-state" style={{ background:'var(--bg-card)', borderRadius:'var(--radius)', border:'1px solid var(--border)' }}>
        <div className="icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Add some products to get started</p>
        <Link to="/products"><button className="btn btn-primary">Start Shopping</button></Link>
      </div>
    </div>
  );

  return (
    <div className="fade-in">
      <h1 className="section-title">🛒 Your Cart ({cart.items.length} items)</h1>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:'1.5rem', alignItems:'start' }}>
        {/* Items */}
        <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
          {cart.items.map(item => (
            <div key={item._id} className="card" style={{ display:'flex', gap:'1rem', alignItems:'center' }}>
              <div style={{ width:80, height:80, borderRadius:'var(--radius-sm)', overflow:'hidden', background:'var(--bg-elevated)', flexShrink:0 }}>
                {item.product?.image
                  ? <img src={item.product.image} alt={item.product.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  : <span style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%', fontSize:'2rem' }}>📦</span>}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <Link to={`/products/${item.product?._id}`}>
                  <h3 style={{ fontWeight:600, fontSize:'0.95rem', marginBottom:'0.2rem' }}>{item.product?.name}</h3>
                </Link>
                <p style={{ fontSize:'0.8rem', color:'var(--text-secondary)', marginBottom:'0.5rem' }}>{item.product?.category}</p>
                <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                    style={{ width:28, height:28, background:'var(--bg-elevated)', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)', cursor:'pointer', color:'var(--text-primary)', display:'flex', alignItems:'center', justifyContent:'center' }}
                  >−</button>
                  <span style={{ minWidth:24, textAlign:'center', fontWeight:700 }}>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                    style={{ width:28, height:28, background:'var(--bg-elevated)', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)', cursor:'pointer', color:'var(--text-primary)', display:'flex', alignItems:'center', justifyContent:'center' }}
                  >+</button>
                </div>
              </div>
              <div style={{ textAlign:'right', flexShrink:0 }}>
                <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.1rem', marginBottom:'0.4rem' }}>
                  ₹{(item.price * item.quantity).toLocaleString()}
                </div>
                <div style={{ fontSize:'0.75rem', color:'var(--text-secondary)', marginBottom:'0.6rem' }}>
                  ₹{item.price.toLocaleString()} each
                </div>
                <button className="btn btn-danger btn-sm" onClick={() => removeItem(item.product._id)}>Remove</button>
              </div>
            </div>
          ))}
          <button className="btn btn-ghost btn-sm" onClick={clearCart} style={{ alignSelf:'flex-start' }}>
            🗑️ Clear cart
          </button>
        </div>

        {/* Order summary */}
        <div style={{ position:'sticky', top:'80px' }}>
          <div className="card">
            <h2 style={{ fontFamily:'var(--font-display)', fontWeight:700, marginBottom:'1.25rem' }}>Order Summary</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem', marginBottom:'1rem' }}>
              {cart.items.map(item => (
                <div key={item._id} style={{ display:'flex', justifyContent:'space-between', fontSize:'0.875rem' }}>
                  <span style={{ color:'var(--text-secondary)' }}>{item.product?.name?.slice(0,25)}... ×{item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop:'1px solid var(--border)', paddingTop:'1rem', marginBottom:'1.25rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.4rem', fontSize:'0.875rem' }}>
                <span style={{ color:'var(--text-secondary)' }}>Subtotal</span>
                <span>₹{cart.totalPrice.toLocaleString()}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.4rem', fontSize:'0.875rem' }}>
                <span style={{ color:'var(--text-secondary)' }}>Shipping</span>
                <span style={{ color:'var(--success)' }}>Free</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontFamily:'var(--font-display)', fontWeight:800, fontSize:'1.2rem', marginTop:'0.75rem' }}>
                <span>Total</span>
                <span style={{ color:'var(--accent)' }}>₹{cart.totalPrice.toLocaleString()}</span>
              </div>
            </div>
            <button className="btn btn-primary w-full btn-lg" onClick={() => setShowCheckout(true)}>
              Proceed to Checkout →
            </button>
          </div>
        </div>
      </div>

      {/* Checkout modal */}
      {showCheckout && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowCheckout(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">📦 Shipping Details</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowCheckout(false)}>✕</button>
            </div>
            <form onSubmit={handlePlaceOrder} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <div className="form-group">
                <label>Street Address</label>
                <input value={address.street} onChange={e => setAddress({...address, street:e.target.value})} placeholder="123 Main St" />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                <div className="form-group">
                  <label>City</label>
                  <input value={address.city} onChange={e => setAddress({...address, city:e.target.value})} placeholder="Mumbai" />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input value={address.state} onChange={e => setAddress({...address, state:e.target.value})} placeholder="Maharashtra" />
                </div>
              </div>
              <div className="form-group">
                <label>PIN Code</label>
                <input value={address.zipCode} onChange={e => setAddress({...address, zipCode:e.target.value})} placeholder="400001" />
              </div>
              <div style={{ background:'var(--bg-elevated)', borderRadius:'var(--radius-sm)', padding:'1rem', fontSize:'0.875rem' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.3rem' }}>
                  <span style={{ color:'var(--text-secondary)' }}>Payment</span>
                  <span style={{ fontWeight:600 }}>Cash on Delivery</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontWeight:800, fontFamily:'var(--font-display)' }}>
                  <span>Total</span>
                  <span style={{ color:'var(--accent)' }}>₹{cart.totalPrice.toLocaleString()}</span>
                </div>
              </div>
              <div style={{ display:'flex', gap:'0.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCheckout(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={placing} style={{ flex:1 }}>
                  {placing ? 'Placing Order...' : '✅ Place Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
