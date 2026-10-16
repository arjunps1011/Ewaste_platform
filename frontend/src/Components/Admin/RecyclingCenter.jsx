import { useState,useEffect } from 'react'
import Nav from './Nav'
import styles from '../../css/admin/dashboard.module.css'
import r from '../../css/admin/recyclingCenter.module.css'
import axios from 'axios'

const STATUS_CFG = {
  'Pending':     { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)'  },
  'On Repair':   { color: '#00c8ff', bg: 'rgba(0,200,255,0.08)',   border: 'rgba(0,200,255,0.2)'   },
  'Refurbished': { color: '#00ffa3', bg: 'rgba(0,255,163,0.08)',   border: 'rgba(0,255,163,0.2)'   },
  'Recycled':    { color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.2)' },
  'Rejected':    { color: '#f472b6', bg: 'rgba(244,114,182,0.08)', border: 'rgba(244,114,182,0.2)' },
}

const STATUS_FLOW = ['Pending', 'On Repair', 'Refurbished']

export default function RecyclingCenter() {
  const BASE_URL = import.meta.env.VITE_API_URL
  const [devices, setDevices]           = useState([])
  const [statusFilter, setStatusFilter] = useState('All')
  const [selected, setSelected]         = useState(null)
  const [modal, setModal]               = useState(null)

  const filtered = statusFilter === 'All' ? devices : devices.filter(d => d.status === statusFilter)

  const summary = [
    { label: 'Total Devices', value: devices.length },
    { label: 'Pending',       value: devices.filter(d => d.status === 'Pending').length },
    { label: 'On Repair',     value: devices.filter(d => d.status === 'On Repair').length },
    { label: 'Refurbished',   value: devices.filter(d => d.status === 'Refurbished').length },
  ]

  const fetch_data=async()=>{
    try{
        let res=await axios.get(`${BASE_URL}/api/get_repaired_ewaste/`,{headers:{'Authorization':`Bearer ${localStorage.getItem('token')}`}})
        console.log(res.data);
        setDevices(res.data)
    }
    catch(er){
      console.log(er.response?.data?.message)
    }
}

  useEffect(()=>{
      fetch_data()
    },[])
  return (
    <div className={styles.shell}>
      <Nav />
      <div className={styles.main}>
        <header className={styles.topbar}>
          <div>
            <h1 className={styles.pageTitle}>Recycling Center</h1>
            <p className={styles.pageDate}>Track and manage device refurbishment process</p>
          </div>
          <div className={styles.topbarRight}>
            <button className={styles.notifBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
              <span className={styles.notifDot} />
            </button>
          </div>
        </header>
        <div className={styles.body}>
          <div className={r.statsGrid}>
            {summary.map(s => (
              <div key={s.label} className={styles.statCard}>
                <p className={styles.statLabel}>{s.label}</p>
                <p className={styles.statVal}>{s.value}</p>
              </div>
            ))}
          </div>
          <div className={r.filterRow}>
            <button className={`${r.filterBtn} ${statusFilter === 'All'         ? r.filterActive : ''}`} onClick={() => setStatusFilter('All')}>All</button>
            <button className={`${r.filterBtn} ${statusFilter === 'Pending'     ? r.filterActive : ''}`} onClick={() => setStatusFilter('Pending')}>Pending</button>
            <button className={`${r.filterBtn} ${statusFilter === 'On Repair'   ? r.filterActive : ''}`} onClick={() => setStatusFilter('On Repair')}>On Repair</button>
            <button className={`${r.filterBtn} ${statusFilter === 'repaired' ? r.filterActive : ''}`} onClick={() => setStatusFilter('repaired')}>Repaired</button>
            <button className={`${r.filterBtn} ${statusFilter === 'Recycled'    ? r.filterActive : ''}`} onClick={() => setStatusFilter('Recycled')}>Recycled</button>
            <button className={`${r.filterBtn} ${statusFilter === 'Rejected'    ? r.filterActive : ''}`} onClick={() => setStatusFilter('Rejected')}>Rejected</button>
          </div>
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.cardTitle}>Devices at Center</span>
              <span className={styles.cardSub}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
            </div>
            <div className={r.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {['ID', 'Product', 'Brand', 'Model', 'User', 'Phone', 'Address', 'Qty', 'Price', 'Technician', 'Status', 'Actions'].map(h => (
                      <th key={h} className={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0
                    ? <tr><td colSpan={9} className={r.emptyCell}>No devices match this filter.</td></tr>
                    : filtered.map(d => (
                        <tr key={d.id} className={styles.tr}>
                          <td className={styles.tdMono}>{d.id}</td>
                          <td className={styles.td}>{d.product}</td>
                          <td className={styles.td}>{d.product_brand}</td>
                          <td className={styles.tdMuted}>{d.product_model}</td>
                          <td className={styles.td}>{d.user_name}</td>
                          <td className={styles.tdMuted}>{d.phone}</td>
                          <td className={styles.tdMuted}>{d.address}</td>
                          <td className={styles.tdMuted}>{d.product_quantity}</td>
                          <td className={styles.td}>{d.price}</td>
                          <td className={styles.tdMuted}>{d.assigned_technitian_id?.name}</td>
                          <td className={styles.td}>
                            <span className={styles.pill} style={{ color: STATUS_CFG[d.status]?.color, background: STATUS_CFG[d.status]?.bg, border: `1px solid ${STATUS_CFG[d.status]?.border}` }}>{d.status}</span>
                          </td>
                          <td className={styles.td}>
                            <div className={r.actions}>
                              <button className={r.viewBtn} onClick={() => { setSelected(d); setModal('view') }}>View</button>
                              {d.status === 'repaired' && (
                                <button className={r.approveBtn} onClick={() => { setSelected(d); setModal('approve') }}>Approve</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ── View Modal ── */}
      {modal === 'view' && selected && (
        <div className={r.overlay} onClick={() => { setModal(null); setSelected(null) }}>
          <div className={r.modal} onClick={e => e.stopPropagation()}>
            <div className={r.modalHead}>
              <div>
                <h2 className={r.modalTitle}>{selected.deviceName}</h2>
                <span className={r.modalSub}>{selected.id} · {selected.requestId}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className={styles.pill} style={{ color: STATUS_CFG[selected.status]?.color, background: STATUS_CFG[selected.status]?.bg, border: `1px solid ${STATUS_CFG[selected.status]?.border}` }}>{selected.status}</span>
                <button className={r.closeBtn} onClick={() => { setModal(null); setSelected(null) }}>✕</button>
              </div>
            </div>
            <div className={r.modalBody}>
              <div className={r.modalCol}>
                <div className={r.section}>
                  <p className={r.sectionTitle}>Device Info</p>
                  <div className={r.infoGrid}>
                    <span className={r.infoKey}>Device</span>    <span className={r.infoVal}>{selected.deviceName}</span>
                    <span className={r.infoKey}>Category</span>  <span className={r.infoVal}>{selected.category}</span>
                    <span className={r.infoKey}>User</span>      <span className={r.infoVal}>{selected.userName}</span>
                    <span className={r.infoKey}>Delivered</span> <span className={r.infoVal}>{selected.deliveryDate}</span>
                    <span className={r.infoKey}>Employee</span>  <span className={r.infoVal}>{selected.employee}</span>
                  </div>
                </div>
              </div>
              <div className={r.modalCol}>
                <div className={r.section}>
                  <p className={r.sectionTitle}>Inspection / Repair Notes</p>
                  <p className={r.notesBox}>{selected.notes || 'No notes added yet.'}</p>
                </div>
                <div className={r.section}>
                  <p className={r.sectionTitle}>Quick Actions</p>
                  <div className={r.quickActions}>
                    {selected.status === 'Refurbished' && (
                      <button className={`${r.quickBtn} ${r.quickBtnGreen}`} onClick={() => setModal('approve')}>Approve for Products</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Approve Modal ── */}
      {modal === 'approve' && selected && (
        <div className={r.overlay} onClick={() => { setModal(null); setSelected(null) }}>
          <div className={r.modalSm} onClick={e => e.stopPropagation()}>
            <div className={r.modalHead}>
              <div>
                <h2 className={r.modalTitle}>Approve for Products</h2>
                <span className={r.modalSub}>{selected.deviceName} · {selected.id}</span>
              </div>
              <button className={r.closeBtn} onClick={() => { setModal(null); setSelected(null) }}>✕</button>
            </div>
            <div className={r.modalSmBody}>
              <div className={r.approveCard}>
                <img src={selected.images?.[0]} alt={selected.deviceName} className={r.approveImg} />
                <div>
                  <p className={r.approveName}>{selected.deviceName}</p>
                  <p className={r.approveMeta}>{selected.category} · {selected.employee}</p>
                  <p className={r.approveNotes}>{selected.notes || 'No notes.'}</p>
                </div>
              </div>
              <p className={r.approveHint}>Approving will add this device to the <strong>Active Products</strong> page as a refurbished listing.</p>
            </div>
            <div className={r.modalFoot}>
              <button className={r.rejectBtn} onClick={() => { setModal(null); setSelected(null) }}>Reject — Send Back</button>
              <button className={r.saveBtn}   onClick={() => { setModal(null); setSelected(null) }}>✓ Approve &amp; Add to Products</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
