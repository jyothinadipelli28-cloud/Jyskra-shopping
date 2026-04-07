import { useState, useEffect } from 'react';
import api from '../../api';
import toast from 'react-hot-toast';

const STATUSES = ['Pending','Processing','Shipped','Delivered','Cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (filterStatus) params.append('status', filterStatus);
      const res = await api.get(`/orders/admin/all?${params}`);
      setOrders(res.data.orders);
      setTotal(res.data.total);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [filterStatus, page]);

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      toast.success('Status updated');
      fetchOrders();
    } catch { toast.error('Update failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this order?')) return;
    try {
      await api.delete(`/orders/${id}`);
      toast.success('Order deleted');
      fetchOrders();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="fade-in">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem' }}>
        <h1 className="section-title" style={{ marginBottom:0 }}>📋 Orders</h1>
        <div style={{ display:'flex', gap:'0.75rem', alignItems:'center' }}>
          <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }} style={{ width:'160px' }}>
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <span style={{ fontSize:'0.875rem', color:'var(--text-secondary)' }}>{total} orders</span>
        </div>
      </div>

      {loading ? <div className="page-loader"><div className="spinner" /></div> : (
        <>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th><th>Customer</th><th>Items</th>
                  <th>Total</th><th>Status</th><th>Date</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td style={{ fontFamily:'monospace', fontSize:'0.78rem', color:'var(--text-secondary)' }}>
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td>
                      <div style={{ fontWeight:600 }}>{order.user?.name}</div>
                      <div style={{ fontSize:'0.75rem', color:'var(--text-secondary)' }}>{order.user?.email}</div>
                    </td>
                    <td>
                      <div style={{ fontSize:'0.82rem' }}>
                        {order.items.slice(0,2).map(i => (
                          <div key={i._id}>{i.name} ×{i.quantity}</div>
                        ))}
                        {order.items.length > 2 && <div style={{ color:'var(--text-secondary)' }}>+{order.items.length - 2} more</div>}
                      </div>
                    </td>
                    <td style={{ fontWeight:700 }}>₹{order.totalPrice.toLocaleString()}</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={e => handleStatusChange(order._id, e.target.value)}
                        style={{ width:'130px', fontSize:'0.8rem', padding:'0.35rem 0.5rem' }}
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td style={{ fontSize:'0.82rem', color:'var(--text-secondary)' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                    </td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(order._id)}>🗑️</button>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan={7}><div className="empty-state"><div className="icon">📋</div><h3>No orders found</h3></div></td></tr>
                )}
              </tbody>
            </table>
          </div>

          {total > 20 && (
            <div style={{ display:'flex', gap:'0.5rem', justifyContent:'center', marginTop:'1.5rem' }}>
              <button className="btn btn-secondary btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
              <span style={{ padding:'0.4rem 1rem', fontSize:'0.875rem' }}>Page {page} of {Math.ceil(total/20)}</span>
              <button className="btn btn-secondary btn-sm" disabled={page >= Math.ceil(total/20)} onClick={() => setPage(p => p + 1)}>Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
