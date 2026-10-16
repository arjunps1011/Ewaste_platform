import { useState } from 'react'
import Nav from './Nav'
import styles from '../../css/admin/dashboard.module.css'
import o from '../../css/admin/orders.module.css'

const ORDER_STATUS_CFG = {
  'Processing': { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)'  },
  'Shipped':    { color: '#00c8ff', bg: 'rgba(0,200,255,0.08)',   border: 'rgba(0,200,255,0.2)'   },
  'Delivered':  { color: '#00ffa3', bg: 'rgba(0,255,163,0.08)',   border: 'rgba(0,255,163,0.2)'   },
  'Cancelled':  { color: '#f472b6', bg: 'rgba(244,114,182,0.08)', border: 'rgba(244,114,182,0.2)' },
}

const PAYMENT_STATUS_CFG = {
  'Paid':    { color: '#00ffa3', bg: 'rgba(0,255,163,0.08)',   border: 'rgba(0,255,163,0.2)'   },
  'Pending': { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)'  },
  'Failed':  { color: '#f472b6', bg: 'rgba(244,114,182,0.08)', border: 'rgba(244,114,182,0.2)' },
}

const ORDER_FLOW = ['Processing', 'Shipped', 'Delivered']

const ORDERS = [
  {
    id: 'ORD-2041', userName: 'Arjun Sharma', userEmail: 'arjun@email.com', userPhone: '+91 98765 43210',
    shippingAddress: '12, MG Road, Bengaluru, Karnataka 560001',
    productName: 'Refurbished iPhone 12', category: 'Mobile', condition: 'Good',
    quantity: 1, price: 18000, total: 18000,
    paymentStatus: 'Paid', paymentMethod: 'UPI', transactionId: 'TXN8821049',
    orderStatus: 'Delivered', orderDate: 'Jul 10, 2025', deliveryDate: 'Jul 13, 2025',
  },
  {
    id: 'ORD-2040', userName: 'Priya Nair', userEmail: 'priya@email.com', userPhone: '+91 91234 56789',
    shippingAddress: '45, Anna Nagar, Chennai, Tamil Nadu 600040',
    productName: 'Dell Laptop i5 8th Gen', category: 'Laptop', condition: 'Excellent',
    quantity: 1, price: 32000, total: 32000,
    paymentStatus: 'Paid', paymentMethod: 'Card', transactionId: 'TXN7710293',
    orderStatus: 'Shipped', orderDate: 'Jul 9, 2025', deliveryDate: null,
  },
  {
    id: 'ORD-2039', userName: 'Rahul Mehta', userEmail: 'rahul@email.com', userPhone: '+91 87654 32109',
    shippingAddress: '8, Banjara Hills, Hyderabad, Telangana 500034',
    productName: 'Sony Headphones WH-1000', category: 'Audio', condition: 'Good',
    quantity: 2, price: 4500, total: 9000,
    paymentStatus: 'Pending', paymentMethod: 'COD', transactionId: '—',
    orderStatus: 'Processing', orderDate: 'Jul 8, 2025', deliveryDate: null,
  },
  {
    id: 'ORD-2038', userName: 'Sneha Iyer', userEmail: 'sneha@email.com', userPhone: '+91 76543 21098',
    shippingAddress: '22, Koregaon Park, Pune, Maharashtra 411001',
    productName: 'iPad Air 3rd Gen', category: 'Tablet', condition: 'Excellent',
    quantity: 1, price: 22000, total: 22000,
    paymentStatus: 'Paid', paymentMethod: 'UPI', transactionId: 'TXN6609182',
    orderStatus: 'Processing', orderDate: 'Jul 7, 2025', deliveryDate: null,
  },
  {
    id: 'ORD-2037', userName: 'Karan Verma', userEmail: 'karan@email.com', userPhone: '+91 65432 10987',
    shippingAddress: '3, Sector 18, Noida, UP 201301',
    productName: 'MacBook Air M1', category: 'Laptop', condition: 'Good',
    quantity: 1, price: 55000, total: 55000,
    paymentStatus: 'Failed', paymentMethod: 'Card', transactionId: '—',
    orderStatus: 'Cancelled', orderDate: 'Jul 5, 2025', deliveryDate: null,
  },
  {
    id: 'ORD-2036', userName: 'Meera Pillai', userEmail: 'meera@email.com', userPhone: '+91 54321 09876',
    shippingAddress: '67, Salt Lake, Kolkata, WB 700091',
    productName: 'Samsung Galaxy Tab S6', category: 'Tablet', condition: 'Good',
    quantity: 1, price: 14000, total: 14000,
    paymentStatus: 'Paid', paymentMethod: 'Card', transactionId: 'TXN5508071',
    orderStatus: 'Delivered', orderDate: 'Jul 3, 2025', deliveryDate: 'Jul 6, 2025',
  },
]

const SUMMARY = [
  { label: 'Total Orders',       value: ORDERS.length },
  { label: 'Pending Payment',    value: ORDERS.filter(r => r.paymentStatus === 'Pending').length },
  { label: 'Orders Shipped',     value: ORDERS.filter(r => r.orderStatus === 'Shipped').length },
  { label: 'Orders Delivered',   value: ORDERS.filter(r => r.orderStatus === 'Delivered').length },
]

const ORDER_FILTERS   = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
const PAYMENT_FILTERS = ['All', 'Paid', 'Pending', 'Failed']

export default function AdminOrders() {
  const [search, setSearch]               = useState('')
  const [orderFilter, setOrderFilter]     = useState('All')
  const [paymentFilter, setPaymentFilter] = useState('All')
  const [selected, setSelected]           = useState(null)

  const filtered = ORDERS.filter(r =>
    (r.userName.toLowerCase().includes(search.toLowerCase()) ||
     r.productName.toLowerCase().includes(search.toLowerCase()) ||
     r.id.toLowerCase().includes(search.toLowerCase())) &&
    (orderFilter   === 'All' || r.orderStatus   === orderFilter) &&
    (paymentFilter === 'All' || r.paymentStatus === paymentFilter)
  )

  const flowIdx = selected ? ORDER_FLOW.indexOf(selected.orderStatus) : -1

  return (
    <div className={styles.shell}>
      <Nav />

      <div className={styles.main}>

        {/* Topbar */}
        <header className={styles.topbar}>
          <div>
            <h1 className={styles.pageTitle}>Orders Management</h1>
            <p className={styles.pageDate}>Track, update and manage all product orders</p>
          </div>
          <div className={styles.topbarRight}>
            <div className={styles.searchBox}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                placeholder="Search order, user, product..."
                className={styles.searchInput}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button className={styles.notifBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
              <span className={styles.notifDot} />
            </button>
          </div>
        </header>

        <div className={styles.body}>

          {/* Summary */}
          <div className={o.summaryGrid}>
            {SUMMARY.map(s => (
              <div key={s.label} className={`${styles.statCard} ${o.summaryCard}`}>
                <p className={styles.statLabel}>{s.label}</p>
                <p className={styles.statVal}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className={o.filtersWrap}>
            <div className={o.filterGroup}>
              <span className={o.filterLabel}>Order Status</span>
              <div className={o.filterRow}>
                {ORDER_FILTERS.map(f => (
                  <button key={f} className={`${o.filterBtn} ${orderFilter === f ? o.filterActive : ''}`} onClick={() => setOrderFilter(f)}>{f}</button>
                ))}
              </div>
            </div>
            <div className={o.filterGroup}>
              <span className={o.filterLabel}>Payment</span>
              <div className={o.filterRow}>
                {PAYMENT_FILTERS.map(f => (
                  <button key={f} className={`${o.filterBtn} ${paymentFilter === f ? o.filterActive : ''}`} onClick={() => setPaymentFilter(f)}>{f}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.cardTitle}>All Orders</span>
              <span className={styles.cardSub}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
            </div>
            <div className={o.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {['Order ID','User','Product','Qty','Total','Payment','Method','Order Status','Order Date','Delivery Date','Actions']
                      .map(h => <th key={h} className={styles.th}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0
                    ? <tr><td colSpan={11} className={o.emptyCell}>No orders match your filters.</td></tr>
                    : filtered.map(r => {
                        const os = ORDER_STATUS_CFG[r.orderStatus]
                        const ps = PAYMENT_STATUS_CFG[r.paymentStatus]
                        return (
                          <tr key={r.id} className={styles.tr}>
                            <td className={styles.tdMono}>{r.id}</td>
                            <td className={styles.td}>{r.userName}</td>
                            <td className={styles.td}>{r.productName}</td>
                            <td className={styles.tdMuted}>{r.quantity}</td>
                            <td className={styles.tdAccent}>₹{r.total.toLocaleString()}</td>
                            <td className={styles.td}>
                              <span className={styles.pill} style={{ color: ps.color, background: ps.bg, border: `1px solid ${ps.border}` }}>{r.paymentStatus}</span>
                            </td>
                            <td className={styles.tdMuted}>{r.paymentMethod}</td>
                            <td className={styles.td}>
                              <span className={styles.pill} style={{ color: os.color, background: os.bg, border: `1px solid ${os.border}` }}>{r.orderStatus}</span>
                            </td>
                            <td className={styles.tdMuted}>{r.orderDate}</td>
                            <td className={styles.tdMuted}>{r.deliveryDate || '—'}</td>
                            <td className={styles.td}>
                              <button className={o.viewBtn} onClick={() => setSelected(r)}>View Details</button>
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

      {/* Modal */}
      {selected && (
        <div className={o.overlay} onClick={() => setSelected(null)}>
          <div className={o.modal} onClick={e => e.stopPropagation()}>

            {/* Modal header */}
            <div className={o.modalHeader}>
              <div>
                <h2 className={o.modalTitle}>{selected.productName}</h2>
                <span className={o.modalId}>{selected.id}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className={styles.pill} style={{ color: ORDER_STATUS_CFG[selected.orderStatus]?.color, background: ORDER_STATUS_CFG[selected.orderStatus]?.bg, border: `1px solid ${ORDER_STATUS_CFG[selected.orderStatus]?.border}` }}>
                  {selected.orderStatus}
                </span>
                <span className={styles.pill} style={{ color: PAYMENT_STATUS_CFG[selected.paymentStatus]?.color, background: PAYMENT_STATUS_CFG[selected.paymentStatus]?.bg, border: `1px solid ${PAYMENT_STATUS_CFG[selected.paymentStatus]?.border}` }}>
                  {selected.paymentStatus}
                </span>
                <button className={o.closeBtn} onClick={() => setSelected(null)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>

            {/* Order status flow */}
            <div className={o.flowWrap}>
              {ORDER_FLOW.map((s, i) => (
                <div key={s} className={o.flowStep}>
                  <div className={`${o.flowDot} ${i < flowIdx ? o.flowDone : i === flowIdx ? o.flowActive : ''}`} />
                  <span className={`${o.flowLabel} ${i === flowIdx ? o.flowLabelActive : ''}`}>{s}</span>
                  {i < ORDER_FLOW.length - 1 && <div className={`${o.flowLine} ${i < flowIdx ? o.flowLineDone : ''}`} />}
                </div>
              ))}
            </div>

            {/* Modal body */}
            <div className={o.modalBody}>

              {/* Left col */}
              <div className={o.modalCol}>

                <div className={o.section}>
                  <p className={o.sectionTitle}>Product Details</p>
                  <div className={o.infoGrid}>
                    <span className={o.infoKey}>Product</span>   <span className={o.infoVal}>{selected.productName}</span>
                    <span className={o.infoKey}>Category</span>  <span className={o.infoVal}>{selected.category}</span>
                    <span className={o.infoKey}>Condition</span> <span className={o.infoVal}>{selected.condition}</span>
                    <span className={o.infoKey}>Quantity</span>  <span className={o.infoVal}>{selected.quantity}</span>
                    <span className={o.infoKey}>Price</span>     <span className={o.infoVal}>₹{selected.price.toLocaleString()}</span>
                    <span className={o.infoKey}>Total</span>     <span className={o.infoVal} style={{ color: '#00ffa3', fontWeight: 700 }}>₹{selected.total.toLocaleString()}</span>
                  </div>
                </div>

                <div className={o.section}>
                  <p className={o.sectionTitle}>User Details</p>
                  <div className={o.infoGrid}>
                    <span className={o.infoKey}>Name</span>             <span className={o.infoVal}>{selected.userName}</span>
                    <span className={o.infoKey}>Email</span>            <span className={o.infoVal}>{selected.userEmail}</span>
                    <span className={o.infoKey}>Phone</span>            <span className={o.infoVal}>{selected.userPhone}</span>
                    <span className={o.infoKey}>Ship Address</span>     <span className={o.infoVal}>{selected.shippingAddress}</span>
                  </div>
                </div>

              </div>

              {/* Right col */}
              <div className={o.modalCol}>

                <div className={o.section}>
                  <p className={o.sectionTitle}>Payment Details</p>
                  <div className={o.infoGrid}>
                    <span className={o.infoKey}>Status</span>
                    <span className={o.infoVal}>
                      <span className={styles.pill} style={{ color: PAYMENT_STATUS_CFG[selected.paymentStatus]?.color, background: PAYMENT_STATUS_CFG[selected.paymentStatus]?.bg, border: `1px solid ${PAYMENT_STATUS_CFG[selected.paymentStatus]?.border}` }}>
                        {selected.paymentStatus}
                      </span>
                    </span>
                    <span className={o.infoKey}>Method</span>         <span className={o.infoVal}>{selected.paymentMethod}</span>
                    <span className={o.infoKey}>Transaction ID</span> <span className={o.infoVal} style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{selected.transactionId}</span>
                    <span className={o.infoKey}>Order Date</span>     <span className={o.infoVal}>{selected.orderDate}</span>
                    <span className={o.infoKey}>Delivery Date</span>  <span className={o.infoVal}>{selected.deliveryDate || '—'}</span>
                  </div>
                </div>

                <div className={o.section}>
                  <p className={o.sectionTitle}>Actions</p>
                  <div className={o.actionStack}>
                    <button className={`${o.actionBtn} ${o.actionShip}`}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                      Mark as Shipped
                    </button>
                    <button className={`${o.actionBtn} ${o.actionDeliver}`}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      Mark as Delivered
                    </button>
                    <button className={`${o.actionBtn} ${o.actionPayment}`}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                      Confirm Payment
                    </button>
                    <button className={`${o.actionBtn} ${o.actionInvoice}`}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                      Generate Invoice
                    </button>
                    <button className={`${o.actionBtn} ${o.actionCancel}`}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                      Cancel Order
                    </button>
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
