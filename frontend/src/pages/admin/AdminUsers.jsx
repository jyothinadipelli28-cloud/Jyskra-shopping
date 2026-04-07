import { useState, useEffect } from 'react';
import api from '../../api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function AdminUsers() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (id, role) => {
    try {
      await api.put(`/users/${id}/role`, { role });
      toast.success('Role updated');
      fetchUsers();
    } catch { toast.error('Failed to update role'); }
  };

  const handleDelete = async (id, name) => {
    if (id === me._id) return toast.error("You can't delete yourself");
    if (!confirm(`Delete user "${name}"?`)) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch { toast.error('Delete failed'); }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div className="fade-in">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem' }}>
        <h1 className="section-title" style={{ marginBottom:0 }}>👥 Users ({users.length})</h1>
        <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} style={{ width:'240px' }} />
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>User</th><th>Email</th><th>Role</th><th>Joined</th><th>Last Login</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u._id}>
                <td>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                    <div style={{
                      width:36, height:36, borderRadius:'50%',
                      background:'var(--accent-dim)', color:'var(--accent)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontWeight:700, fontSize:'0.9rem', flexShrink:0
                    }}>{u.name[0].toUpperCase()}</div>
                    <span style={{ fontWeight:600 }}>{u.name} {u._id === me._id && <span style={{ fontSize:'0.72rem', color:'var(--accent)' }}>(you)</span>}</span>
                  </div>
                </td>
                <td style={{ color:'var(--text-secondary)', fontSize:'0.875rem' }}>{u.email}</td>
                <td>
                  <select
                    value={u.role}
                    onChange={e => handleRoleChange(u._id, e.target.value)}
                    disabled={u._id === me._id}
                    style={{ width:'120px', fontSize:'0.8rem', padding:'0.3rem 0.5rem' }}
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td style={{ fontSize:'0.82rem', color:'var(--text-secondary)' }}>
                  {new Date(u.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                </td>
                <td style={{ fontSize:'0.82rem', color:'var(--text-secondary)' }}>
                  {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('en-IN') : '—'}
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    disabled={u._id === me._id}
                    onClick={() => handleDelete(u._id, u.name)}
                  >🗑️ Delete</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6}><div className="empty-state"><div className="icon">👥</div><h3>No users found</h3></div></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
