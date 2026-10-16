import { useState, useEffect } from 'react'
import RecycleNav from './RecycleNav'
import styles from '../../css/recycle_center/receivedItems.module.css'
import axios from 'axios'

const PROCESSING_STYLE = { color: '#00c8ff', bg: 'rgba(0,200,255,0.08)', border: 'rgba(0,200,255,0.2)' }

export default function ReceivedItems() {
  const BASE_URL = import.meta.env.VITE_API_URL
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)
  const [newStatus, setNewStatus] = useState('processing')
  const [data, setdata] = useState([])
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')


  const ewaste = async () => {
    try {
      let res = await axios.get(`${BASE_URL}/api/get_delivered_Ewaste/`)
      console.log(res.data)
      setdata(res.data)
    }
    catch (er) {
      console.log(er || er.responses || er.response.message);

    }
  }
  useEffect(() => { ewaste() }, [])

  const update = async () => {
    try {
      let res = await axios.put(`${BASE_URL}/api/technician_assignmet/${selected.id}/`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      setSuccessMsg('Status updated successfully!')
      setErrorMsg('')
      setTimeout(() => { setSelected(null); setSuccessMsg('') }, 1200)
    }
    catch(er){
      setErrorMsg(er.response?.data?.message || 'Something went wrong')
    }
    
    
  }

  return (
    <div className={styles.shell}>
      <RecycleNav />

      <div className={styles.main}>
        <header className={styles.topbar}>
          <div>
            <h1 className={styles.pageTitle}>Received Items</h1>
            <p className={styles.pageDate}>View and update processing status of all received e-waste</p>
          </div>
        </header>

        <div className={styles.body}>

          {/* Toolbar */}
          <div className={styles.toolbar}>
            <div className={styles.searchWrap}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input
                className={styles.searchInput}
                placeholder="Search by device, brand or user..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select className={styles.select} value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="All">All Status</option>
              <option value="delivered">Delivered</option>
              <option value="processing">Processing</option>
              <option value="recycled">Recycled</option>
              <option value="reusable">Reusable</option>
              <option value="scrap">Scrap</option>
            </select>
          </div>

          {/* Table */}
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.cardTitle}>All Received Items</span>
              <span className={styles.cardSub}>{data.length} items</span>
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
                    <th className={styles.th}>User</th>
                    <th className={styles.th}>Phone</th>
                    <th className={styles.th}>Price Paid</th>
                    <th className={styles.th}>Status</th>
                    <th className={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length === 0
                    ? <tr><td colSpan={9} className={styles.emptyCell}>No items found.</td></tr>
                    : data.map(item => {
                      const cfg = PROCESSING_STYLE
                      return (
                        <tr key={item.id} className={styles.tr} style={{ cursor: 'pointer' }} onClick={() => { setSelected(item); setNewStatus(item.status) }}>
                          <td className={styles.tdMono}>#{item.id}</td>
                          <td className={styles.td}>{item.product}</td>
                          <td className={styles.tdMuted}>{item.product_brand} · {item.product_model}</td>
                          <td className={styles.td}>{item.product_quantity}</td>
                          <td className={styles.td}>{item.user_name}</td>
                          <td className={styles.td}>{item.user_name}</td>
                          <td className={styles.tdMuted}>{item.phone}</td>
                          <td className={styles.tdAccent}>{item.price ? `₹${item.price}` : '—'}</td>
                          <td className={styles.td}>
                            <span className={styles.pill} style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                              {item.status}
                            </span>
                          </td>
                          <td className={styles.td}>
                            <button className={styles.updateBtn} onClick={e => { e.stopPropagation(); setSelected(item); setNewStatus(item.status) }}>Update</button>
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

      {/* Details + Update Modal */}
      {selected && (
        <div className={styles.overlay} onClick={() => setSelected(null)}>
          <div className={styles.detailModal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>{selected.product}</h2>
                <span className={styles.modalSub}>#{selected.id} · {selected.product_brand} {selected.product_model}</span>
              </div>
              <button className={styles.closeBtn} onClick={() => setSelected(null)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            <div className={styles.detailBody}>
              <div className={styles.detailSection}>
                <p className={styles.detailSectionTitle}>Item Details</p>
                <div className={styles.infoGrid}>
                  <span className={styles.infoKey}>Device</span>      <span className={styles.infoVal}>{selected.product}</span>
                  <span className={styles.infoKey}>Brand</span>       <span className={styles.infoVal}>{selected.product_brand}</span>
                  <span className={styles.infoKey}>Model</span>       <span className={styles.infoVal}>{selected.product_model}</span>
                  <span className={styles.infoKey}>Quantity</span>    <span className={styles.infoVal}>{selected.product_quantity}</span>
                  <span className={styles.infoKey}>Description</span> <span className={styles.infoVal}>{selected.product_description || '—'}</span>
                  <span className={styles.infoKey}>Price Paid</span>  <span className={styles.infoVal}>{selected.price ? `₹${selected.price}` : '—'}</span>
                </div>
              </div>

              <div className={styles.detailSection}>
                <p className={styles.detailSectionTitle}>User Info</p>
                <div className={styles.infoGrid}>
                  <span className={styles.infoKey}>Name</span>    <span className={styles.infoVal}>{selected.user_name}</span>
                  <span className={styles.infoKey}>Phone</span>   <span className={styles.infoVal}>{selected.phone}</span>
                  <span className={styles.infoKey}>Address</span> <span className={styles.infoVal}>{selected.address}</span>
                </div>
              </div>

              <div className={styles.detailSection}>
                <p className={styles.detailSectionTitle}>Update Status</p>
                <div className={styles.statusGrid}>
                  <button
                    className={styles.statusChip}
                    style={newStatus === 'processing' ? { color: PROCESSING_STYLE.color, borderColor: PROCESSING_STYLE.border, background: PROCESSING_STYLE.bg } : {}}
                    onClick={() => setNewStatus('processing')}
                  >
                    Processing
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.modalFoot}>
              {successMsg && <p style={{ color: '#00ffa3', fontSize: '0.78rem', margin: 0 }}>{successMsg}</p>}
              {errorMsg && <p style={{ color: '#f472b6', fontSize: '0.78rem', margin: 0 }}>{errorMsg}</p>}
              <button className={styles.cancelBtn} onClick={() => setSelected(null)}>Cancel</button>
              <button className={styles.confirmBtn} onClick={()=>update()}>Confirm Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
