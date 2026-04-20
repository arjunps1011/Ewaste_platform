import { useState } from 'react'
import Nav from './Nav'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import styles from '../../css/admin/dashboard.module.css'
import '../../css/admin/dashboard.module.css'

// ── Mock data ──
const revenueData = [
  { month: 'Jan', revenue: 42000, payouts: 28000 },
  { month: 'Feb', revenue: 38000, payouts: 24000 },
  { month: 'Mar', revenue: 55000, payouts: 36000 },
  { month: 'Apr', revenue: 47000, payouts: 31000 },
  { month: 'May', revenue: 63000, payouts: 41000 },
  { month: 'Jun', revenue: 71000, payouts: 48000 },
  { month: 'Jul', revenue: 58000, payouts: 38000 },
]

const deviceData = [
  { month: 'Jan', collected: 120 },
  { month: 'Feb', collected: 98  },
  { month: 'Mar', collected: 145 },
  { month: 'Apr', collected: 132 },
  { month: 'May', collected: 167 },
  { month: 'Jun', collected: 189 },
  { month: 'Jul', collected: 154 },
]

const categoryData = [
  { name: 'Phones',    value: 38 },
  { name: 'Laptops',   value: 27 },
  { name: 'Tablets',   value: 14 },
  { name: 'Audio',     value: 11 },
  { name: 'Wearables', value: 6  },
  { name: 'Other',     value: 4  },
]

const PIE_COLORS = ['#00ffa3', '#00c8ff', '#a78bfa', '#f59e0b', '#f472b6', '#5a7070']

const recentOrders = [
  { id: 'ECC-0198', user: 'Arjun Sharma',   item: 'Wireless Keyboard',  amount: 450,  status: 'Shipped',   date: 'Jun 21' },
  { id: 'ECC-0197', user: 'Priya Nair',     item: 'iPhone 12 Pro',      amount: 4200, status: 'Delivered', date: 'Jun 20' },
  { id: 'ECC-0196', user: 'Rahul Mehta',    item: 'MacBook Air M1',     amount: 38000,status: 'Processing',date: 'Jun 20' },
  { id: 'ECC-0195', user: 'Sneha Iyer',     item: 'Sony WH-1000XM4',    amount: 8500, status: 'Delivered', date: 'Jun 19' },
  { id: 'ECC-0194', user: 'Karan Verma',    item: 'iPad Air 4th Gen',   amount: 18000,status: 'Shipped',   date: 'Jun 18' },
]

const recentListings = [
  { id: 'LST-0312', user: 'Amit Joshi',    item: 'Dell Monitor 24"',  category: 'Monitor', quote: 900,  status: 'Active'  },
  { id: 'LST-0311', user: 'Divya Rao',     item: 'iPhone 11',         category: 'Mobile',  quote: 1800, status: 'Pending' },
  { id: 'LST-0310', user: 'Arjun Sharma',  item: 'MacBook Pro 2019',  category: 'Laptop',  quote: 4200, status: 'Sold'    },
  { id: 'LST-0309', user: 'Meera Pillai',  item: 'Samsung Galaxy S21',category: 'Mobile',  quote: 5100, status: 'Active'  },
  { id: 'LST-0308', user: 'Rohan Das',     item: 'Apple Watch S6',    category: 'Wearable',quote: 9500, status: 'Sold'    },
]

const STATUS = {
  Shipped:    { color: '#00c8ff', bg: 'rgba(0,200,255,0.08)',  border: 'rgba(0,200,255,0.2)'  },
  Delivered:  { color: '#00ffa3', bg: 'rgba(0,255,163,0.08)',  border: 'rgba(0,255,163,0.2)'  },
  Processing: { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
  Active:     { color: '#00c8ff', bg: 'rgba(0,200,255,0.08)',  border: 'rgba(0,200,255,0.2)'  },
  Pending:    { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
  Sold:       { color: '#00ffa3', bg: 'rgba(0,255,163,0.08)',  border: 'rgba(0,255,163,0.2)'  },
}

const STATS = [
  { label: 'Total Revenue',     value: '₹3,74,000' },
  { label: 'Devices Collected', value: '1,005'     },
  { label: 'Active Listings',   value: '248'        },
  { label: 'Total Users',       value: '1,842'      },
  { label: 'Pending Payouts',   value: '₹62,400'   },
  { label: 'CO₂ Saved',         value: '2.4 tons'  },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className={styles.tooltip} style={{ fontFamily: 'DM Sans, sans-serif' }}>
      <p className={styles.tooltipLabel}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, margin: '3px 0', fontSize: '0.82rem' }}>
          {p.name}: {typeof p.value === 'number' && p.name?.toLowerCase().includes('revenue') || p.name?.toLowerCase().includes('payout') ? `₹${p.value.toLocaleString()}` : p.value}
        </p>
      ))}
    </div>
  )
}



export default function AdminDashboard() {

  return (
    <div className={styles.shell}>

      {/* ── Sidebar ── */}
      <Nav />

      {/* ── Main ── */}
      <div className={styles.main}>

        {/* Top bar */}
        <header className={styles.topbar}>
          <div>
            <h1 className={styles.pageTitle}>Dashboard</h1>
            <p className={styles.pageDate}>July 2025</p>
          </div>
          <div className={styles.topbarRight}>
            <div className={styles.searchBox}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input placeholder="Search..." className={styles.searchInput} />
            </div>
            <button className={styles.notifBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
              <span className={styles.notifDot} />
            </button>
          </div>
        </header>

        <div className={styles.body}>

          {/* ── Stat cards ── */}
          <div className={styles.statsGrid}>
            {STATS.map(s => (
              <div key={s.label} className={styles.statCard}>
                <p className={styles.statLabel}>{s.label}</p>
                <p className={styles.statVal}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* ── Charts row 1 ── */}
          <div className={styles.chartsRow}>

            {/* Revenue area chart */}
            <div className={`${styles.card} ${styles.cardWide}`}>
              <div className={styles.cardHead}>
                <span className={styles.cardTitle}>Revenue vs Payouts</span>
                <span className={styles.cardSub}>Last 7 months</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00ffa3" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#00ffa3" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="payGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00c8ff" stopOpacity={0.12}/>
                      <stop offset="95%" stopColor="#00c8ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="month" tick={{ fill: '#5a7070', fontSize: 11, fontFamily: 'DM Sans, sans-serif' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#5a7070', fontSize: 11, fontFamily: 'DM Sans, sans-serif' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '0.75rem', color: '#5a7070', paddingTop: 8, fontFamily: 'DM Sans, sans-serif' }} />
                  <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#00ffa3" strokeWidth={2} fill="url(#revGrad)" dot={false} />
                  <Area type="monotone" dataKey="payouts" name="Payouts" stroke="#00c8ff" strokeWidth={2} fill="url(#payGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Category pie chart */}
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.cardTitle}>By Category</span>
                <span className={styles.cardSub}>Listings</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} opacity={0.85} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: '#0e1520', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 12, fontFamily: 'DM Sans, sans-serif' }} />
                  <Legend wrapperStyle={{ fontSize: '0.72rem', color: '#5a7070', fontFamily: 'DM Sans, sans-serif' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

          </div>

          {/* ── Charts row 2 ── */}
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.cardTitle}>Devices Collected</span>
              <span className={styles.cardSub}>Last 7 months</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={deviceData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#5a7070', fontSize: 11, fontFamily: 'DM Sans, sans-serif' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#5a7070', fontSize: 11, fontFamily: 'DM Sans, sans-serif' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="collected" name="Devices" fill="#00ffa3" radius={[6, 6, 0, 0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ── Tables row ── */}
          <div className={styles.tablesRow}>

            {/* Recent orders */}
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.cardTitle}>Recent Orders</span>
                <button className={styles.viewAllBtn}>View all</button>
              </div>
              <table className={styles.table}>
                <thead>
                  <tr>{['Order ID', 'User', 'Item', 'Amount', 'Status', 'Date'].map(h => <th key={h} className={styles.th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {recentOrders.map(o => (
                    <tr key={o.id} className={styles.tr}>
                      <td className={styles.tdMono}>{o.id}</td>
                      <td className={styles.td}>{o.user}</td>
                      <td className={styles.tdMuted}>{o.item}</td>
                      <td className={styles.tdAccent}>₹{o.amount.toLocaleString()}</td>
                      <td className={styles.td}>
                        <span className={styles.pill} style={{ color: STATUS[o.status].color, background: STATUS[o.status].bg, border: `1px solid ${STATUS[o.status].border}` }}>{o.status}</span>
                      </td>
                      <td className={styles.tdMuted}>{o.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Recent listings */}
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.cardTitle}>Recent Listings</span>
                <button className={styles.viewAllBtn}>View all</button>
              </div>
              <table className={styles.table}>
                <thead>
                  <tr>{['ID', 'User', 'Item', 'Quote', 'Status'].map(h => <th key={h} className={styles.th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {recentListings.map(l => (
                    <tr key={l.id} className={styles.tr}>
                      <td className={styles.tdMono}>{l.id}</td>
                      <td className={styles.td}>{l.user}</td>
                      <td className={styles.tdMuted}>{l.item}</td>
                      <td className={styles.tdAccent}>₹{l.quote.toLocaleString()}</td>
                      <td className={styles.td}>
                        <span className={styles.pill} style={{ color: STATUS[l.status].color, background: STATUS[l.status].bg, border: `1px solid ${STATUS[l.status].border}` }}>{l.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
