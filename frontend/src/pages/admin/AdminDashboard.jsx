import { useState, useEffect } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement,
  LineElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import api from '../../api';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [orderStats, setOrderStats] = useState(null);
  const [productStats, setProductStats] = useState({ total: 0, categories: [] });
  const [userStats, setUserStats] = useState({ totalUsers: 0, totalAdmins: 0, totalCustomers: 0, recentUsers: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [orderRes, userRes, productRes] = await Promise.all([
          api.get('/orders/admin/stats'),
          api.get('/users/stats'),
          api.get('/products/admin/all')
        ]);
        setOrderStats(orderRes.data);
        setUserStats(userRes.data);
        const cats = {};
        productRes.data.forEach(p => { cats[p.category] = (cats[p.category] || 0) + 1; });
        setProductStats({ total: productRes.data.length, categories: Object.entries(cats) });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  const revenueData = {
    labels: (orderStats?.revenueByMonth || []).map(r => `${MONTHS[r._id.month - 1]} ${r._id.year}`),
    datasets: [{
      label: 'Revenue (₹)',
      data: (orderStats?.revenueByMonth || []).map(r => r.revenue),
      borderColor: '#6c63ff',
      backgroundColor: 'rgba(108,99,255,0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#6c63ff',
      pointRadius: 5
    }]
  };

  const categoryData = {
    labels: productStats.categories.map(([c]) => c),
    datasets: [{
      data: productStats.categories.map(([, v]) => v),
      backgroundColor: ['#6c63ff','#22c55e','#f59e0b','#3b82f6','#ef4444','#ec4899','#14b8a6','#f97316'],
      borderWidth: 0
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { labels: { color: '#8888a8', font: { family: 'Space Grotesk' } } } },
    scales: {
      x: { grid: { color: '#1e1e2e' }, ticks: { color: '#8888a8' } },
      y: { grid: { color: '#1e1e2e' }, ticks: { color: '#8888a8' } }
    }
  };

  const donutOptions = {
    responsive: true,
    plugins: { legend: { position: 'right', labels: { color: '#8888a8', font: { family: 'Space Grotesk' }, padding: 16 } } }
  };

  const statCards = [
    { label: 'Total Products', value: productStats.total, icon: '📦', color: '#6c63ff', bg: 'rgba(108,99,255,0.1)' },
    { label: 'Total Users', value: userStats.totalUsers, icon: '👥', color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
    { label: 'Total Orders', value: orderStats?.totalOrders || 0, icon: '📋', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { label: 'Total Revenue', value: `₹${(orderStats?.totalRevenue || 0).toLocaleString()}`, icon: '💰', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' }
  ];

  return (
    <div className="fade-in">
      <h1 className="section-title" style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>
        📊 Admin Dashboard
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {statCards.map(card => (
          <div key={card.label} className="stat-card">
            <div className="stat-icon" style={{ background: card.bg, color: card.color }}>{card.icon}</div>
            <div className="stat-info">
              <h3 style={{ color: card.color }}>{card.value}</h3>
              <p>{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="card">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            📈 Revenue Overview
          </h2>
          <Line data={revenueData} options={chartOptions} />
        </div>
        <div className="card">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            🗂️ Product Categories
          </h2>
          <Doughnut data={categoryData} options={donutOptions} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
            📦 Orders by Status
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {(orderStats?.ordersByStatus || []).map(s => (
              <div key={s._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className={`badge badge-${s._id?.toLowerCase()}`}>{s._id}</span>
                <span style={{ fontWeight: 700 }}>{s.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
            👤 Recent Users
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {userStats.recentUsers.map(u => (
              <div key={u._id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'var(--accent-dim)', color: 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '0.85rem', flexShrink: 0
                }}>{u.name[0].toUpperCase()}</div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{u.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{u.email}</div>
                </div>
                <span className={`badge badge-${u.role === 'admin' ? 'shipped' : 'delivered'}`} style={{ marginLeft: 'auto' }}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
