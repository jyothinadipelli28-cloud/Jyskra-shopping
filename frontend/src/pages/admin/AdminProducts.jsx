import { useState, useEffect, useRef } from 'react';
import api from '../../api';
import toast from 'react-hot-toast';

const CATEGORIES = ['Electronics','Clothing','Books','Home & Garden','Sports','Toys','Beauty','Food','Other'];

const emptyForm = { name:'', description:'', price:'', category:'Electronics', stock:'', tags:'' };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const fileRef = useRef();

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products/admin/all');
      setProducts(res.data);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAdd = () => { setEditProduct(null); setForm(emptyForm); setImageFile(null); setShowModal(true); };
  const openEdit = (p) => {
    setEditProduct(p);
    setForm({ name: p.name, description: p.description, price: p.price, category: p.category, stock: p.stock, tags: p.tags?.join(', ') || '' });
    setImageFile(null);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);

      if (editProduct) {
        await api.put(`/products/${editProduct._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product updated');
      } else {
        await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product created');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch { toast.error('Delete failed'); }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div className="fade-in">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem' }}>
        <h1 className="section-title" style={{ marginBottom:0 }}>📦 Products</h1>
        <div style={{ display:'flex', gap:'0.75rem', alignItems:'center' }}>
          <input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width:'220px', padding:'0.5rem 1rem' }} />
          <button className="btn btn-primary" onClick={openAdd}>+ Add Product</button>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Image</th><th>Name</th><th>Category</th>
              <th>Price</th><th>Stock</th><th>Sales</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p._id}>
                <td>
                  <div style={{ width:48, height:48, borderRadius:'var(--radius-sm)', overflow:'hidden', background:'var(--bg-elevated)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {p.image ? <img src={p.image} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : <span>📦</span>}
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight:600 }}>{p.name}</div>
                  <div style={{ fontSize:'0.75rem', color:'var(--text-secondary)' }}>{p.description.slice(0,50)}...</div>
                </td>
                <td><span className="badge badge-shipped">{p.category}</span></td>
                <td style={{ fontWeight:700 }}>₹{p.price.toLocaleString()}</td>
                <td>
                  <span style={{ color: p.stock === 0 ? 'var(--danger)' : p.stock < 5 ? 'var(--warning)' : 'var(--success)', fontWeight:600 }}>
                    {p.stock}
                  </span>
                </td>
                <td>{p.salesCount}</td>
                <td>
                  <span className={`badge ${p.isActive ? 'badge-delivered' : 'badge-cancelled'}`}>
                    {p.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div style={{ display:'flex', gap:'0.5rem' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}>✏️ Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id, p.name)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8}><div className="empty-state"><div className="icon">📦</div><h3>No products found</h3></div></td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal" style={{ maxWidth:'580px' }}>
            <div className="modal-header">
              <h2 className="modal-title">{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSave} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                <div className="form-group" style={{ gridColumn:'1/-1' }}>
                  <label>Product Name *</label>
                  <input required value={form.name} onChange={e => setForm({...form, name:e.target.value})} placeholder="e.g. Samsung Galaxy S24" />
                </div>
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input required type="number" min="0" step="0.01" value={form.price} onChange={e => setForm({...form, price:e.target.value})} placeholder="0.00" />
                </div>
                <div className="form-group">
                  <label>Stock *</label>
                  <input required type="number" min="0" value={form.stock} onChange={e => setForm({...form, stock:e.target.value})} placeholder="0" />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select value={form.category} onChange={e => setForm({...form, category:e.target.value})}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Tags (comma separated)</label>
                  <input value={form.tags} onChange={e => setForm({...form, tags:e.target.value})} placeholder="e.g. new, featured" />
                </div>
                <div className="form-group" style={{ gridColumn:'1/-1' }}>
                  <label>Description *</label>
                  <textarea required rows={3} value={form.description} onChange={e => setForm({...form, description:e.target.value})} placeholder="Product description..." style={{ resize:'vertical' }} />
                </div>
                <div className="form-group" style={{ gridColumn:'1/-1' }}>
                  <label>Product Image</label>
                  <input ref={fileRef} type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ padding:'0.4rem' }} />
                  {editProduct?.image && !imageFile && (
                    <img src={editProduct.image} alt="current" style={{ width:80, height:80, objectFit:'cover', borderRadius:'var(--radius-sm)', marginTop:'0.5rem' }} />
                  )}
                </div>
              </div>
              <div style={{ display:'flex', gap:'0.75rem', justifyContent:'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editProduct ? 'Update Product' : 'Create Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
