import { useState, useEffect, use } from 'react'
import RecycleNav from './RecycleNav'
import styles from '../../css/recycle_center/technicianItems.module.css'
import axios from 'axios'

const STATUS_CFG = {
  On_repair: { color: '#00c8ff', bg: 'rgba(0,200,255,0.08)', border: 'rgba(0,200,255,0.2)' },
  repaired: { color: '#00ffa3', bg: 'rgba(0,255,163,0.08)', border: 'rgba(0,255,163,0.2)' },
  scrap: { color: '#f472b6', bg: 'rgba(244,114,182,0.08)', border: 'rgba(244,114,182,0.2)' },
}

const STATUS_OPTIONS = ['On repair', 'repaired', 'scrap']

const MOCK_DATA = []


export default function TechnicianItems() {
  const BASE_URL = import.meta.env.VITE_API_URL
  const [items, setItems] = useState(MOCK_DATA)
  const [selected, setSelected] = useState(null)
  const [newStatus, setNewStatus] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All' ? items : items.filter(i => i.status === filter)

  const get_all_my_works = async () => {
    try {
      let res = await axios.get(`${BASE_URL}/api/get_technicain_ewaste/`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      console.log(res.data);
      setItems(res.data)

    }
    catch (er) {
      console.log(er || er.reponse || er.reponse.message);

    }
  }
  useEffect(() => {
    get_all_my_works()
  }, [])


  const update_status = async () => {
    try {
      let res = await axios.put(`${BASE_URL}/api/update_status/${selected.id}/`, { status: newStatus }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      console.log(res.data);
      setSelected(null)
      get_all_my_works()
      successMsg(res.message)
    }
    catch (er) {
      setErrorMsg(er||er.response||er.response.message)
    }


  }

  return (
    <div className={styles.shell}>
      <RecycleNav />

      <div className={styles.main}>
        <header className={styles.topbar}>
          <div>
            <h1 className={styles.pageTitle}>My Assigned Items</h1>
            <p className={styles.pageDate}>View and update repair / recycling status of your assigned devices</p>
          </div>
          <span className={styles.countBadge}>{filtered.length} item{filtered.length !== 1 ? 's' : ''}</span>
        </header>

        <div className={styles.body}>
          <div className={styles.filterRow}>
            {['All', 'processing', 'On_repair', 'repaired', 'scrap'].map(f => (
              <button key={f} className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`} onClick={() => setFilter(f)}>
                {f === 'All' ? 'All' : f.replace('_', ' ')}
              </button>
            ))}
          </div>
          {filtered.length === 0 ? (
            <div className={styles.emptyState}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /></svg>
              <p>No items assigned to you yet.</p>
            </div>
          ) : (
            <div className={styles.card}>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th}>ID</th>
                      <th className={styles.th}>Device</th>
                      <th className={styles.th}>Brand · Model</th>
                      <th className={styles.th}>Qty</th>
                      <th className={styles.th}>User</th>
                      <th className={styles.th}>Description</th>
                      <th className={styles.th}>Status</th>
                      <th className={styles.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(item => {
                      const cfg = STATUS_CFG[item.status] || { color: '#5a7070', bg: 'rgba(90,112,112,0.08)', border: 'rgba(90,112,112,0.2)' }
                      return (
                        <tr key={item.id} className={styles.tr}>
                          <td className={styles.tdMono}>#{item.id}</td>
                          <td className={styles.td}>{item.product}</td>
                          <td className={styles.tdMuted}>{item.product_brand} · {item.product_model}</td>
                          <td className={styles.td}>{item.product_quantity}</td>
                          <td className={styles.td}>{item.user_name}</td>
                          <td className={styles.tdMuted}>{item.product_description || '—'}</td>
                          <td className={styles.td}>
                            <span className={styles.pill} style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                              {item.status}
                            </span>
                          </td>
                          <td className={styles.td}>
                            <button className={styles.updateBtn} onClick={() => { setSelected(item); setNewStatus(item.status); setNotes(''); setSuccessMsg(''); setErrorMsg('') }}>Update</button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Update Modal */}
      {selected && (
        <div className={styles.overlay} onClick={() => setSelected(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>Update Status</h2>
                <span className={styles.modalSub}>#{selected.id} · {selected.product} · {selected.product_brand} {selected.product_model}</span>
              </div>
              <button className={styles.closeBtn} onClick={() => setSelected(null)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            <div className={styles.modalBody}>
              <p className={styles.sectionLabel}>Select Status</p>
              <div className={styles.statusGrid}>
                <button className={styles.statusChip} style={newStatus === 'On repair' ? { color: STATUS_CFG.On_repair.color, borderColor: STATUS_CFG.On_repair.border, background: STATUS_CFG.On_repair.bg } : {}} onClick={() => setNewStatus('On repair')}>On repair</button>
                <button className={styles.statusChip} style={newStatus === 'repaired' ? { color: STATUS_CFG.repaired.color, borderColor: STATUS_CFG.repaired.border, background: STATUS_CFG.repaired.bg } : {}} onClick={() => setNewStatus('repaired')}>Repaired</button>
                <button className={styles.statusChip} style={newStatus === 'scrap' ? { color: STATUS_CFG.scrap.color, borderColor: STATUS_CFG.scrap.border, background: STATUS_CFG.scrap.bg } : {}} onClick={() => setNewStatus('scrap')}>Scrap</button>
              </div>
            </div>

            <div className={styles.modalFoot}>
              {successMsg && <p className={styles.successMsg}>{successMsg}</p>}
              {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}
              <button className={styles.cancelBtn} onClick={() => setSelected(null)}>Cancel</button>
              <button className={styles.confirmBtn} disabled={newStatus === selected.status} onClick={()=>update_status()}>Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
