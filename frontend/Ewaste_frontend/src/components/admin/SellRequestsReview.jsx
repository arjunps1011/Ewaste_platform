import { useState } from 'react'
import Nav from './Nav'
import styles from '../../css/admin/dashboard.module.css'
import sr from '../../css/admin/sellRequests.module.css'
import axios from 'axios'
import { useEffect } from 'react'

const STATUS_CFG = {
  'pending':          { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)'  },
  'pickup_scheduled': { color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.2)' },
  'picked_up':        { color: '#00c8ff', bg: 'rgba(0,200,255,0.08)',   border: 'rgba(0,200,255,0.2)'   },
  'delivered':        { color: '#00ffa3', bg: 'rgba(0,255,163,0.08)',   border: 'rgba(0,255,163,0.2)'   },
}

const STATUS_FLOW = ['pending', 'pickup_scheduled', 'picked_up', 'delivered']
const FILTER_OPTIONS = ['All', 'pending', 'pickup_scheduled', 'picked_up', 'delivered']

export default function SellRequestsReview() {
  const BASE_URL = import.meta.env.VITE_API_URL
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [selected, setSelected] = useState(null)
  const [data, setData] = useState([])
  const [employees, setEmployees] = useState([])
  const [assignTarget, setAssignTarget] = useState(null)
  const [assignPick, setAssignPick] = useState('')
  const [sucessmes,setSucessmsg]=useState('')
  const [errorMes,setErrorMessage]=useState('')

  const filtered = filterStatus === 'All' ? data : data.filter(r => r.status?.toLowerCase() === filterStatus.toLowerCase())

  const idx = selected ? STATUS_FLOW.indexOf(selected.status) : -1

  const sell_requests = async () => {
    try {
      let res = await axios.get(`${BASE_URL}/api/get_all_sell_request/`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      setData(res.data)
      console.log(res.data);
      
    } catch (er) {
      console.log(er.response?.data?.message)
    }
  }

  const fetch_employees = async () => {
    try {
      let res = await axios.get(`${BASE_URL}/api/get_collector/`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      setEmployees(res.data.collectors)
      console.log(res.data.collectors);
      
    } catch (er) {
      console.log(er)
    }
  }

  const assign_employee=async()=>{
    try{
      let res= await axios.post(`${BASE_URL}/api/assign_employee/`, {sell_request_id: assignTarget.id, employee_id: assignPick}, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}})
      setSucessmsg(res.data.message)
      setAssignPick('')
      setAssignTarget(null)
      setErrorMessage('')
      sell_requests()
    }
    catch(er){
      setErrorMessage(er.response?.data?.message || 'Something went wrong')
      setSucessmsg('')
    }
  }

  useEffect(() => {
    sell_requests()
    fetch_employees()
  }, [])
  return (
    <div className={styles.shell}>
      <Nav />

      <div className={styles.main}>

        {/* Topbar */}
        <header className={styles.topbar}>
          <div>
            <h1 className={styles.pageTitle}>Sell Requests Review</h1>
            <p className={styles.pageDate}>Review & approve employee evaluations</p>
          </div>
          <div className={styles.topbarRight}>
            <div className={styles.searchBox}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input placeholder="Search user or device..." className={styles.searchInput} value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className={styles.notifBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
              <span className={styles.notifDot} />
            </button>
          </div>
        </header>

        <div className={styles.body}>

          {/* Summary cards */}
          <div className={sr.summaryGrid}>
          </div>

          {/* Filters */}
          <div className={sr.filterRow}>
            {FILTER_OPTIONS.map(f => (
              <button key={f} className={`${sr.filterBtn} ${filterStatus === f ? sr.filterActive : ''}`} onClick={() => setFilterStatus(f)}>
                {f}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.cardTitle}>Sell Requests</span>
              <span className={styles.cardSub}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
            </div>
            <div className={sr.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Request ID</th>
                    <th className={styles.th}>User Name</th>
                    <th className={styles.th}>Device Name</th>
                    <th className={styles.th}>Brand</th>
                    <th className={styles.th}>Model</th>
                    <th className={styles.th}>Quantity</th>
                    <th className={styles.th}>Price</th>
                    <th className={styles.th}>Status</th>
                    <th className={styles.th}>Assigned Employee</th>
                    <th className={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0
                    ? <tr><td colSpan={9} className={sr.emptyCell}>No requests match your filters.</td></tr>
                    : filtered.map(r => {
                        const cfg = STATUS_CFG[r.status] || STATUS_CFG['pending']
                        return (
                          <tr key={r.id} className={styles.tr}>
                            <td className={styles.tdMono}>{r.id}</td>
                            <td className={styles.td}>{r.user_name}</td>
                            <td className={styles.tdMuted}>{r.product}</td>
                            <td className={styles.td}>{r.product_brand}</td>
                            <td className={styles.tdMuted}>{r.product_model}</td>
                            <td className={styles.tdMuted}>{r.product_quantity}</td>
                            <td className={styles.td}>{r.price ? `₹${r.price}` : '—'}</td>
                            <td className={styles.td}>
                              <span className={styles.pill} style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>{r.status}</span>
                            </td>
                            <td className={styles.tdMuted}>—</td>
                            <td className={styles.td}>
                              <div style={{ display: 'flex', gap: 6 }}>
                                <button className={sr.viewBtn} onClick={() => setSelected(r)}>View Details</button>
                                {r.status === 'pending' && !r.assigned_employee_id && (
                                  <button className={sr.assignBtn} onClick={e => { e.stopPropagation(); setAssignPick(''); setAssignTarget(r) }}>Assign Employee</button>
                                )}
                              </div>
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

      {/* Assign Employee Modal */}
      {assignTarget && (
        <div className={sr.overlay} onClick={() => setAssignTarget(null)}>
          <div className={sr.assignModal} onClick={e => e.stopPropagation()}>
            <div className={sr.modalHeader}>
              <div>
                <h2 className={sr.modalTitle}>Assign Employee</h2>
                <span className={sr.modalId}>#{assignTarget.id} · {assignTarget.product}</span>
              </div>
              <button className={sr.closeBtn} onClick={() => setAssignTarget(null)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className={sr.assignBody}>
              <p className={sr.assignHint}>Select an employee to handle this request.</p>
              <div className={sr.empList}>
                {employees.length === 0
                  ? <p style={{ color: '#5a7070', fontSize: '0.8rem' }}>No employees found.</p>
                  : employees.map(emp => (
                    <div
                      key={emp.id}
                      className={`${sr.empCard} ${assignPick === emp.id ? sr.empCardActive : ''}`}
                      onClick={() => setAssignPick(emp.id)}
                    >
                      <div className={sr.empAvatar}>{emp.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</div>
                      <div className={sr.empInfo}>
                        <p className={sr.empName}>{emp.name}</p>
                        <p className={sr.empZone}>{emp.email}</p>
                      </div>
                      {assignPick === emp.id && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00ffa3" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      )}
                    </div>
                  ))
                }
              </div>
            </div>
            <div className={sr.assignFoot}>
              {sucessmes && <p style={{color:'#00ffa3'}}>{sucessmes}</p>}
              {errorMes && <p style={{color:'#f472b6'}}>{errorMes}</p>}
              <button className={sr.cancelBtn} onClick={() => setAssignTarget(null)}>Cancel</button>
              <button className={sr.confirmBtn} disabled={!assignPick} onClick={() => assign_employee()}>Confirm Assignment</button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {selected && (
        <div className={sr.overlay} onClick={() => setSelected(null)}>
          <div className={sr.modal} onClick={e => e.stopPropagation()}>

            <div className={sr.modalHeader}>
              <div>
                <h2 className={sr.modalTitle}>{selected.product}</h2>
                <span className={sr.modalId}>#{selected.id}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className={styles.pill} style={{ color: STATUS_CFG[selected.status]?.color, background: STATUS_CFG[selected.status]?.bg, border: `1px solid ${STATUS_CFG[selected.status]?.border}` }}>
                  {selected.status}
                </span>
                <button className={sr.closeBtn} onClick={() => setSelected(null)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>

            {/* Status flow */}
            <div className={sr.flowWrap}>
              {STATUS_FLOW.map((s, i) => (
                <div key={s} className={sr.flowStep}>
                  <div className={`${sr.flowDot} ${i < idx ? sr.flowDone : i === idx ? sr.flowActive : ''}`} />
                  <span className={`${sr.flowLabel} ${i === idx ? sr.flowLabelActive : ''}`}>{s.replace(/_/g, ' ')}</span>
                  {i < STATUS_FLOW.length - 1 && <div className={`${sr.flowLine} ${i < idx ? sr.flowLineDone : ''}`} />}
                </div>
              ))}
            </div>

            <div className={sr.modalBody}>
              <div className={sr.modalCol}>
                <div className={sr.section}>
                  <p className={sr.sectionTitle}>Device Information</p>
                  <div className={sr.infoGrid}>
                    <span className={sr.infoKey}>Device</span>      <span className={sr.infoVal}>{selected.product}</span>
                    <span className={sr.infoKey}>Brand</span>       <span className={sr.infoVal}>{selected.product_brand}</span>
                    <span className={sr.infoKey}>Model</span>       <span className={sr.infoVal}>{selected.product_model}</span>
                    <span className={sr.infoKey}>Quantity</span>    <span className={sr.infoVal}>{selected.product_quantity}</span>
                    <span className={sr.infoKey}>Description</span> <span className={sr.infoVal}>{selected.product_description}</span>
                  </div>
                </div>

                <div className={sr.section}>
                  <p className={sr.sectionTitle}>User Information</p>
                  <div className={sr.infoGrid}>
                    <span className={sr.infoKey}>Name</span>           <span className={sr.infoVal}>{selected.user_name}</span>
                    <span className={sr.infoKey}>Phone</span>          <span className={sr.infoVal}>{selected.phone}</span>
                    <span className={sr.infoKey}>Pickup Address</span> <span className={sr.infoVal}>{selected.address}</span>
                  </div>
                </div>
              </div>

              <div className={sr.modalCol}>
                <div className={sr.section}>
                  <p className={sr.sectionTitle}>Assignment</p>
                  <div className={sr.infoGrid}>
                    <span className={sr.infoKey}>Assigned To</span> <span className={sr.infoVal}>—</span>
                    <span className={sr.infoKey}>Status</span>
                    <span className={sr.infoVal}>
                      <span className={styles.pill} style={{ color: STATUS_CFG[selected.status]?.color, background: STATUS_CFG[selected.status]?.bg, border: `1px solid ${STATUS_CFG[selected.status]?.border}` }}>
                        {selected.status}
                      </span>
                    </span>
                  </div>
                </div>


              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
