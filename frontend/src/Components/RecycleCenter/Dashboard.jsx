import { useState, useEffect } from 'react'
import axios from 'axios'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import RecycleNav from './RecycleNav'
import styles from '../../css/recycle_center/recycleDashboard.module.css'

const PIE_COLORS = ['#00ffa3', '#f59e0b', '#f472b6', '#a78bfa']

const STATUS_CFG = {
  delivered:  { color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.2)' },
  processing: { color: '#00c8ff', bg: 'rgba(0,200,255,0.08)',   border: 'rgba(0,200,255,0.2)'   },
  recycled:   { color: '#00ffa3', bg: 'rgba(0,255,163,0.08)',   border: 'rgba(0,255,163,0.2)'   },
  reusable:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)'  },
  scrap:      { color: '#f472b6', bg: 'rgba(244,114,182,0.08)', border: 'rgba(244,114,182,0.2)' },
}

const PROCESS_OPTIONS = ['processing', 'recycled', 'reusable', 'scrap']

export default function RecycleDashboard() {
  const BASE_URL = import.meta.env.VITE_API_URL
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)
  const [newStatus, setNewStatus] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const fetch_items = async () => {
    try {
      let res = await axios.get(`${BASE_URL}/api/get_all_sell_request/`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      setItems(res.data.filter(i => ['delivered', 'processing', 'recycled', 'reusable', 'scrap'].includes(i.status)))
    } catch (er) { console.log(er) }
  }

  const update_status = async () => {
    try {
      await axios.put(`${BASE_URL}/api/update_status/${selected.id}/`, { status: newStatus }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      setSuccessMsg('Status updated')
      setErrorMsg('')
      fetch_items()
      setSelected(null)
    } catch (er) {
      setErrorMsg(er.response?.data?.message || 'Something went wrong')
    }
  }

  useEffect(() => { fetch_items() }, [])

  const filtered   = filter === 'All' ? items : items.filter(i => i.status === filter)
  const total      = items.length
  const pending    = items.filter(i => i.status === 'delivered').length
  const processing = items.filter(i => i.status === 'processing').length
  const recycled   = items.filter(i => i.status === 'recycled').length
  const reusable   = items.filter(i => i.status === 'reusable').length
  const scrap      = items.filter(i => i.status === 'scrap').length

  const chartData = [
    { name: 'Recycled',  value: recycled  },
    { name: 'Reusable',  value: reusable  },
    { name: 'Scrap',     value: scrap     },
    { name: 'Pending',   value: pending   },
  ].filter(d => d.value > 0)

  return (
    <div className={styles.shell}>
      <RecycleNav />

      <div className={styles.main}>
        <header className={styles.topbar}>
          <div>
            <h1 className={styles.pageTitle}>Recycling Center</h1>
            <p className={styles.pageDate}>Process and manage delivered e-waste</p>
          </div>
        </header>

        <div className={styles.body}>

          {/* Stats */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}><p className={styles.statLabel}>Total Received</p><p className={styles.statVal}>{total}</p></div>
            <div className={styles.statCard}><p className={styles.statLabel}>Pending</p><p className={styles.statVal}>{pending}</p></div>
            <div className={styles.statCard}><p className={styles.statLabel}>Processing</p><p className={styles.statVal}>{processing}</p></div>
            <div className={styles.statCard}><p className={styles.statLabel}>Recycled</p><p className={styles.statVal}>{recycled}</p></div>
          </div>

          {/* Filters */}
          <div className={styles.filterRow}>
            {['All', 'delivered', 'processing', 'recycled', 'reusable', 'scrap'].map(f => (
              <button key={f} className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`} onClick={() => setFilter(f)}>
                {f === 'All' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Chart */}
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.cardTitle}>Recycling Statistics</span>
              <span className={styles.cardSub}>By status</span>
            </div>
            {chartData.length === 0
              ? <p className={styles.emptyCell}>No data yet.</p>
              : <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={65} outerRadius={100} paddingAngle={3} dataKey="value">
                      {chartData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} opacity={0.88} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#0e1520', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 12, fontFamily: 'DM Sans, sans-serif' }} />
                    <Legend wrapperStyle={{ fontSize: '0.75rem', color: '#5a7070', fontFamily: 'DM Sans, sans-serif' }} />
                  </PieChart>
                </ResponsiveContainer>
            }
          </div>

          {/* Table */}
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.cardTitle}>Received Items</span>
              <span className={styles.cardSub}>{filtered.length} item{filtered.length !== 1 ? 's' : ''}</span>
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>ID</th>
                    <th className={styles.th}>Device</th>
                    <th className={styles.th}>Brand · Model</th>
                    <th className={styles.th}>Qty</th>
                    <th className={styles.th}>User</th>
                    <th className={styles.th}>Price Paid</th>
                    <th className={styles.th}>Status</th>
                    <th className={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0
                    ? <tr><td colSpan={8} className={styles.emptyCell}>No items found.</td></tr>
                    : filtered.map(item => {
                        const cfg = STATUS_CFG[item.status] || STATUS_CFG['delivered']
                        return (
                          <tr key={item.id} className={styles.tr}>
                            <td className={styles.tdMono}>#{item.id}</td>
                            <td className={styles.td}>{item.product}</td>
                            <td className={styles.tdMuted}>{item.product_brand} · {item.product_model}</td>
                            <td className={styles.td}>{item.product_quantity}</td>
                            <td className={styles.td}>{item.user_name}</td>
                            <td className={styles.tdAccent}>{item.price ? `₹${item.price}` : '—'}</td>
                            <td className={styles.td}>
                              <span className={styles.pill} style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                                {item.status}
                              </span>
                            </td>
                            <td className={styles.td}>
                              <button className={styles.updateBtn} onClick={() => { setSelected(item); setNewStatus(item.status); setSuccessMsg(''); setErrorMsg('') }}>
                                Update
                              </button>
                            </td>
                          </tr>
                        )
                      })
                  }
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* Update Modal */}
      {selected && (
        <div className={styles.overlay} onClick={() => setSelected(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>Update Status</h2>
                <span className={styles.modalSub}>#{selected.id} · {selected.product}</span>
              </div>
              <button className={styles.closeBtn} onClick={() => setSelected(null)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              {PROCESS_OPTIONS.map(s => {
                const cfg = STATUS_CFG[s]
                return (
                  <button
                    key={s}
                    className={`${styles.statusOption} ${newStatus === s ? styles.statusOptionActive : ''}`}
                    onClick={() => setNewStatus(s)}
                    style={newStatus === s ? { borderColor: cfg.border, background: cfg.bg } : {}}
                  >
                    <span className={styles.pill} style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </span>
                  </button>
                )
              })}
            </div>
            <div className={styles.modalFoot}>
              {successMsg && <p style={{ color: '#00ffa3', fontSize: '0.78rem', margin: 0 }}>{successMsg}</p>}
              {errorMsg && <p style={{ color: '#f472b6', fontSize: '0.78rem', margin: 0 }}>{errorMsg}</p>}
              <button className={styles.cancelBtn} onClick={() => setSelected(null)}>Cancel</button>
              <button className={styles.confirmBtn} disabled={newStatus === selected.status} onClick={update_status}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
