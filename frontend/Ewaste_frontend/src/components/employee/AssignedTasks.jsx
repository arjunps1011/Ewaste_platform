import { useState, useEffect } from 'react'
import axios from 'axios'
import EmployeeNav from './EmployeeNav'
import styles from '../../css/employee/employeeDashboard.module.css'

const STATUS_CFG = {
  pending:          { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)'  },
  pickup_scheduled: { color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.2)' },
  picked_up:        { color: '#00c8ff', bg: 'rgba(0,200,255,0.08)',   border: 'rgba(0,200,255,0.2)'   },
  delivered:        { color: '#00ffa3', bg: 'rgba(0,255,163,0.08)',   border: 'rgba(0,255,163,0.2)'   },
}

const STATUS_OPTIONS = ['picked_up', 'delivered']

export default function AssignedTasks() {
  const BASE_URL = import.meta.env.VITE_API_URL
  const [filter, setFilter] = useState('All')
  const [updateTarget, setUpdateTarget] = useState(null)
  const [newStatus, setNewStatus] = useState('')
  const [price, setPrice] = useState('')
  const [tasks, setTasks] = useState([])
  const [sucess_msg, setSucess_msg] = useState('')
  const [error_msg, setError_msg] = useState('')

  const filtered = tasks
    .filter(a => filter === 'All' || a.status === filter)

  const assigned_task = async () => {
    try {
      let res = await axios.get(`${BASE_URL}/api/my_assigments/`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      setTasks(res.data)
      console.log(res.data);
      
    } catch(er) {
      console.log(er||er.response||er.response.message)
    }
  }

  const update_status = async () => {
    try {
      let res = await axios.put(`${BASE_URL}/api/update_status/${updateTarget.id}/`, { 'status': newStatus, 'price': price }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      setSucess_msg(res.data.message)
      console.log(res.data.message)
      setError_msg('')
      assigned_task()
      setUpdateTarget(null)
    } catch(er) {
      setError_msg(er.response?.data?.message || 'Something went wrong')
      console.log(er||er.response||er.response.message)
    }
  }

  useEffect(() => {
    assigned_task()
  }, [])

  return (
    <div className={styles.shell}>

      <EmployeeNav />

      <div className={styles.main}>
        <header className={styles.topbar}>
          <div>
            <h1 className={styles.pageTitle}>Assigned Tasks</h1>
            <p className={styles.pageDate}>Assigned tasks</p>
          </div>
        </header>

        <div className={styles.body}>
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <div className={styles.cardControls}>
                {['All', 'pending', 'pickup_scheduled', 'picked_up', 'delivered'].map(f => (
                  <button
                    key={f}
                    className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
                    onClick={() => setFilter(f)}
                  >{f === 'All' ? 'All' : f.replace('_', ' ')}</button>
                ))}
              </div>
            </div>

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>ID</th>
                    <th className={styles.th}>User</th>
                    <th className={styles.th}>Device</th>
                    <th className={styles.th}>Description</th>
                    <th className={styles.th}>Address</th>
                    <th className={styles.th}>Qty</th>
                    <th className={styles.th}>Price</th>
                    <th className={styles.th}>Status</th>
                    <th className={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={9} className={styles.emptyCell}>No tasks found</td></tr>
                  ) : filtered.map(a => {
                    const cfg = STATUS_CFG[a.status] || STATUS_CFG['pending']
                    return (
                      <tr key={a.id} className={styles.tr}>
                        <td className={styles.tdMono}>#{a.id}</td>
                        <td className={styles.td}>
                          <div className={styles.userCell}>
                            <span className={styles.userName}>{a.user_name}</span>
                            <span className={styles.userContact}>{a.phone}</span>
                          </div>
                        </td>
                        <td className={styles.td}>
                          <div className={styles.userCell}>
                            <span className={styles.userName}>{a.product}</span>
                            <span className={styles.userContact}>{a.product_brand} · {a.product_model}</span>
                          </div>
                        </td>
                        <td className={styles.tdMuted}>{a.product_description}</td>
                        <td className={styles.tdMuted}>{a.address}</td>
                        <td className={styles.td}>{a.product_quantity}</td>
                        <td className={styles.td}>{a.price ? `₹${a.price}` : '—'}</td>
                        <td className={styles.td}>
                          <span className={styles.pill} style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                            {a.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className={styles.tdActions}>
                          <button className={styles.updateBtn} onClick={() => { setUpdateTarget(a); setNewStatus(a.status) }}>Update</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {updateTarget && (
        <div className={styles.overlay} onClick={() => setUpdateTarget(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>Update Status</h2>
                <span className={styles.modalSub}>#{updateTarget.id} · {updateTarget.product}</span>
              </div>
              <button className={styles.closeBtn} onClick={() => setUpdateTarget(null)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              {STATUS_OPTIONS.map(s => {
                const cfg = STATUS_CFG[s]
                return (
                  <button
                    key={s}
                    className={`${styles.statusOption} ${newStatus === s ? styles.statusOptionActive : ''}`}
                    onClick={() => setNewStatus(s)}
                  >
                    <span className={styles.pill} style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                      {s.replace('_', ' ')}
                    </span>
                    <span className={styles.statusDesc}>
                      {s === 'picked_up' && 'Inspected device & paid user'}
                      {s === 'delivered' && 'Delivered to recycling center'}
                    </span>
                  </button>
                )
              })}
            </div>
            {newStatus === 'picked_up' && (
              <div style={{ padding: '0 24px 16px' }}>
                <label style={{ fontSize: '0.75rem', color: '#5a7070', display: 'block', marginBottom: 6 }}>Amount Paid to User (₹)</label>
                <input
                  type="number"
                  className={styles.searchInput}
                  style={{ width: '100%' }}
                  placeholder="Enter amount paid"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                />
              </div>
            )}
            <div className={styles.modalFoot}>
              {sucess_msg && <p style={{ color: '#00ffa3', fontSize: '0.78rem' }}>{sucess_msg}</p>}
              {error_msg && <p style={{ color: '#f472b6', fontSize: '0.78rem' }}>{error_msg}</p>}
              <button className={styles.cancelBtn} onClick={() => setUpdateTarget(null)}>Cancel</button>
              <button
                className={styles.confirmBtn}
                disabled={newStatus === updateTarget.status}
                onClick={() => { update_status() }}
              >
                Confirm Update
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
