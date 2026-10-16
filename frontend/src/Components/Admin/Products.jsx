import { useState } from 'react'
import Nav from './Nav'
import styles from '../../css/admin/dashboard.module.css'
import p from '../../css/admin/adminProducts.module.css'

const STATUS_CFG = {
  Active:   { color: '#00ffa3', bg: 'rgba(0,255,163,0.08)',  border: 'rgba(0,255,163,0.2)'  },
  Inactive: { color: '#5a7070', bg: 'rgba(90,112,112,0.08)', border: 'rgba(90,112,112,0.2)' },
  Pending:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
}

const PRODUCTS = [
  { id: 'PRD-001', name: 'iPhone 12 Pro',         category: 'Phone',     price: 32000, stock: 5,  status: 'Active',   image: 'https://placehold.co/56x56/0e1520/00ffa3?text=📱', notes: 'Minor scratches on back panel.' },
  { id: 'PRD-002', name: 'MacBook Air M1',         category: 'Laptop',    price: 68000, stock: 2,  status: 'Active',   image: 'https://placehold.co/56x56/0e1520/00c8ff?text=💻', notes: '6-month warranty included.' },
  { id: 'PRD-003', name: 'Samsung Galaxy S21',     category: 'Phone',     price: 22000, stock: 8,  status: 'Active',   image: 'https://placehold.co/56x56/0e1520/a78bfa?text=📱', notes: 'Fully tested, battery at 91%.' },
  { id: 'PRD-004', name: 'iPad Air 4th Gen',       category: 'Tablet',    price: 28000, stock: 3,  status: 'Inactive', image: 'https://placehold.co/56x56/0e1520/f59e0b?text=📟', notes: 'Screen replaced.' },
  { id: 'PRD-005', name: 'Dell XPS 15',            category: 'Laptop',    price: 55000, stock: 1,  status: 'Pending',  image: 'https://placehold.co/56x56/0e1520/00c8ff?text=💻', notes: 'From recycling center.' },
  { id: 'PRD-006', name: 'Sony WH-1000XM4',        category: 'Audio',     price: 8500,  stock: 12, status: 'Active',   image: 'https://placehold.co/56x56/0e1520/f472b6?text=🎧', notes: 'All accessories included.' },
  { id: 'PRD-007', name: 'Apple Watch Series 6',   category: 'Wearable',  price: 14000, stock: 4,  status: 'Active',   image: 'https://placehold.co/56x56/0e1520/00ffa3?text=⌚', notes: 'Band replaced.' },
  { id: 'PRD-008', name: 'OnePlus 9 Pro',          category: 'Phone',     price: 18000, stock: 6,  status: 'Pending',  image: 'https://placehold.co/56x56/0e1520/a78bfa?text=📱', notes: 'From recycling center.' },
  { id: 'PRD-009', name: 'Lenovo ThinkPad X1',     category: 'Laptop',    price: 48000, stock: 3,  status: 'Active',   image: 'https://placehold.co/56x56/0e1520/00c8ff?text=💻', notes: 'SSD upgraded to 512GB.' },
  { id: 'PRD-010', name: 'Google Pixel 6 Pro',     category: 'Phone',     price: 26000, stock: 7,  status: 'Active',   image: 'https://placehold.co/56x56/0e1520/00ffa3?text=📱', notes: 'Battery health 94%.' },
  { id: 'PRD-011', name: 'Samsung Galaxy Tab S7',  category: 'Tablet',    price: 35000, stock: 2,  status: 'Active',   image: 'https://placehold.co/56x56/0e1520/f59e0b?text=📟', notes: 'Stylus included.' },
  { id: 'PRD-012', name: 'Bose QuietComfort 45',   category: 'Audio',     price: 11000, stock: 9,  status: 'Active',   image: 'https://placehold.co/56x56/0e1520/f472b6?text=🎧', notes: 'Ear cushions replaced.' },
  { id: 'PRD-013', name: 'HP Spectre x360',        category: 'Laptop',    price: 62000, stock: 1,  status: 'Inactive', image: 'https://placehold.co/56x56/0e1520/00c8ff?text=💻', notes: 'Hinge slightly loose.' },
  { id: 'PRD-014', name: 'Fitbit Sense 2',         category: 'Wearable',  price: 7500,  stock: 11, status: 'Active',   image: 'https://placehold.co/56x56/0e1520/a78bfa?text=⌚', notes: 'All sensors functional.' },
  { id: 'PRD-015', name: 'iPhone 13',              category: 'Phone',     price: 42000, stock: 4,  status: 'Pending',  image: 'https://placehold.co/56x56/0e1520/00ffa3?text=📱', notes: 'From recycling center.' },
  { id: 'PRD-016', name: 'iPad Pro 11" M1',        category: 'Tablet',    price: 52000, stock: 2,  status: 'Active',   image: 'https://placehold.co/56x56/0e1520/f59e0b?text=📟', notes: 'Apple Pencil 2 compatible.' },
  { id: 'PRD-017', name: 'JBL Flip 6',             category: 'Audio',     price: 4200,  stock: 15, status: 'Active',   image: 'https://placehold.co/56x56/0e1520/f472b6?text=🔊', notes: 'Waterproof, all buttons working.' },
  { id: 'PRD-018', name: 'Samsung Galaxy Watch 5', category: 'Wearable',  price: 9800,  stock: 5,  status: 'Active',   image: 'https://placehold.co/56x56/0e1520/a78bfa?text=⌚', notes: '2-month warranty remaining.' },
  { id: 'PRD-019', name: 'Asus ROG Zephyrus G14',  category: 'Laptop',    price: 78000, stock: 1,  status: 'Pending',  image: 'https://placehold.co/56x56/0e1520/00c8ff?text=💻', notes: 'From recycling center.' },
  { id: 'PRD-020', name: 'Xiaomi 12 Pro',          category: 'Phone',     price: 15000, stock: 10, status: 'Active',   image: 'https://placehold.co/56x56/0e1520/a78bfa?text=📱', notes: 'Charger included.' },
  { id: 'PRD-021', name: 'Samsung 43" Smart TV',   category: 'TV',        price: 28000, stock: 3,  status: 'Active',   image: 'https://placehold.co/56x56/0e1520/00c8ff?text=📺', notes: 'Remote and stand included.' },
  { id: 'PRD-022', name: 'LG 32" LED TV',          category: 'TV',        price: 14000, stock: 5,  status: 'Active',   image: 'https://placehold.co/56x56/0e1520/00c8ff?text=📺', notes: 'Minor bezel scratch.' },
  { id: 'PRD-023', name: 'Microwave Oven 25L',     category: 'Appliance', price: 5500,  stock: 4,  status: 'Active',   image: 'https://placehold.co/56x56/0e1520/f59e0b?text=🍳', notes: 'All functions tested.' },
  { id: 'PRD-024', name: 'Washing Machine 7kg',    category: 'Appliance', price: 12000, stock: 2,  status: 'Inactive', image: 'https://placehold.co/56x56/0e1520/f59e0b?text=🫧', notes: 'Drum cleaned, motor OK.' },
  { id: 'PRD-025', name: 'Canon DSLR 1500D',       category: 'Camera',    price: 18000, stock: 3,  status: 'Active',   image: 'https://placehold.co/56x56/0e1520/a78bfa?text=📷', notes: 'Kit lens included.' },
  { id: 'PRD-026', name: 'GoPro Hero 9',           category: 'Camera',    price: 14000, stock: 6,  status: 'Active',   image: 'https://placehold.co/56x56/0e1520/a78bfa?text=📷', notes: 'All mounts included.' },
  { id: 'PRD-027', name: 'Dell 24" Monitor',       category: 'Monitor',   price: 9500,  stock: 7,  status: 'Active',   image: 'https://placehold.co/56x56/0e1520/00c8ff?text=🖥', notes: 'No dead pixels.' },
  { id: 'PRD-028', name: 'LG UltraWide 29"',       category: 'Monitor',   price: 16000, stock: 2,  status: 'Active',   image: 'https://placehold.co/56x56/0e1520/00c8ff?text=🖥', notes: 'Minor stand scratch.' },
  { id: 'PRD-029', name: 'Logitech MX Master 3',   category: 'Accessory', price: 3200,  stock: 14, status: 'Active',   image: 'https://placehold.co/56x56/0e1520/00ffa3?text=🖱', notes: 'All buttons functional.' },
  { id: 'PRD-030', name: 'Mechanical Keyboard',    category: 'Accessory', price: 2800,  stock: 9,  status: 'Active',   image: 'https://placehold.co/56x56/0e1520/00ffa3?text=⌨', notes: 'All keys working.' },
  { id: 'PRD-031', name: 'PlayStation 4 Pro',      category: 'Gaming',    price: 22000, stock: 3,  status: 'Active',   image: 'https://placehold.co/56x56/0e1520/a78bfa?text=🎮', notes: '2 controllers included.' },
  { id: 'PRD-032', name: 'Xbox One S',             category: 'Gaming',    price: 18000, stock: 2,  status: 'Inactive', image: 'https://placehold.co/56x56/0e1520/a78bfa?text=🎮', notes: '1 controller included.' },
  { id: 'PRD-033', name: 'Epson Inkjet Printer',   category: 'Printer',   price: 4500,  stock: 5,  status: 'Active',   image: 'https://placehold.co/56x56/0e1520/f59e0b?text=🖨', notes: 'Ink cartridges included.' },
  { id: 'PRD-034', name: 'HP LaserJet Pro',        category: 'Printer',   price: 8500,  stock: 3,  status: 'Active',   image: 'https://placehold.co/56x56/0e1520/f59e0b?text=🖨', notes: 'Toner at 60%.' },
  { id: 'PRD-035', name: 'Raspberry Pi 4',         category: 'Other',     price: 3800,  stock: 8,  status: 'Active',   image: 'https://placehold.co/56x56/0e1520/00ffa3?text=🔧', notes: 'Board only, no accessories.' },
  { id: 'PRD-036', name: 'UPS 600VA',              category: 'Other',     price: 2200,  stock: 6,  status: 'Active',   image: 'https://placehold.co/56x56/0e1520/5a7070?text=🔋', notes: 'Battery replaced.' },
]

const PER_PAGE = 6
const EMPTY_FORM = { name: '', category: 'Phone', price: '', stock: '', status: 'Active', image: '', notes: '' }

export default function AdminProducts() {
  const [catFilter, setCatFilter] = useState('All')
  const [page, setPage]           = useState(1)
  const [modal, setModal]         = useState(null)  // null | 'add' | 'edit' | 'view'
  const [selected, setSelected]   = useState(null)
  const [form, setForm]           = useState(EMPTY_FORM)

  let filtered
  if (catFilter === 'All') {
    filtered = PRODUCTS
  } else {
    filtered = PRODUCTS.filter(pr => pr.category === catFilter)
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const stats = [
    { label: 'Total Products',   value: PRODUCTS.length },
    { label: 'Active',           value: PRODUCTS.filter(pr => pr.status === 'Active').length },
    { label: 'Pending Approval', value: PRODUCTS.filter(pr => pr.status === 'Pending').length },
    { label: 'Total Stock',      value: PRODUCTS.reduce((s, pr) => s + pr.stock, 0) },
  ]

  return (
    <div className={styles.shell}>
      <Nav />
      <div className={styles.main}>

        <header className={styles.topbar}>
          <div>
            <h1 className={styles.pageTitle}>Products</h1>
            <p className={styles.pageDate}>Manage refurbished product listings</p>
          </div>
          <div className={styles.topbarRight}>
            <button className={styles.notifBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
              <span className={styles.notifDot} />
            </button>
          </div>
        </header>

        <div className={styles.body}>

          <div className={p.statsGrid}>
            {stats.map(s => (
              <div key={s.label} className={styles.statCard}>
                <p className={styles.statLabel}>{s.label}</p>
                <p className={styles.statVal}>{s.value}</p>
              </div>
            ))}
          </div>

          <div className={p.filterBar}>
            <div className={p.filterGroup}>
              <button className={`${p.filterBtn} ${catFilter === 'All'       ? p.filterActive : ''}`} onClick={() => { setCatFilter('All');       setPage(1) }}>All</button>
              <button className={`${p.filterBtn} ${catFilter === 'Phone'     ? p.filterActive : ''}`} onClick={() => { setCatFilter('Phone');     setPage(1) }}>Phone</button>
              <button className={`${p.filterBtn} ${catFilter === 'Laptop'    ? p.filterActive : ''}`} onClick={() => { setCatFilter('Laptop');    setPage(1) }}>Laptop</button>
              <button className={`${p.filterBtn} ${catFilter === 'Tablet'    ? p.filterActive : ''}`} onClick={() => { setCatFilter('Tablet');    setPage(1) }}>Tablet</button>
              <button className={`${p.filterBtn} ${catFilter === 'Audio'     ? p.filterActive : ''}`} onClick={() => { setCatFilter('Audio');     setPage(1) }}>Audio</button>
              <button className={`${p.filterBtn} ${catFilter === 'Wearable'  ? p.filterActive : ''}`} onClick={() => { setCatFilter('Wearable');  setPage(1) }}>Wearable</button>
              <button className={`${p.filterBtn} ${catFilter === 'TV'        ? p.filterActive : ''}`} onClick={() => { setCatFilter('TV');        setPage(1) }}>TV</button>
              <button className={`${p.filterBtn} ${catFilter === 'Appliance' ? p.filterActive : ''}`} onClick={() => { setCatFilter('Appliance'); setPage(1) }}>Appliance</button>
              <button className={`${p.filterBtn} ${catFilter === 'Camera'    ? p.filterActive : ''}`} onClick={() => { setCatFilter('Camera');    setPage(1) }}>Camera</button>
              <button className={`${p.filterBtn} ${catFilter === 'Monitor'   ? p.filterActive : ''}`} onClick={() => { setCatFilter('Monitor');   setPage(1) }}>Monitor</button>
              <button className={`${p.filterBtn} ${catFilter === 'Accessory' ? p.filterActive : ''}`} onClick={() => { setCatFilter('Accessory'); setPage(1) }}>Accessory</button>
              <button className={`${p.filterBtn} ${catFilter === 'Gaming'    ? p.filterActive : ''}`} onClick={() => { setCatFilter('Gaming');    setPage(1) }}>Gaming</button>
              <button className={`${p.filterBtn} ${catFilter === 'Printer'   ? p.filterActive : ''}`} onClick={() => { setCatFilter('Printer');   setPage(1) }}>Printer</button>
              <button className={`${p.filterBtn} ${catFilter === 'Other'     ? p.filterActive : ''}`} onClick={() => { setCatFilter('Other');     setPage(1) }}>Other</button>
            </div>
            <button className={p.addBtn} onClick={() => { setForm(EMPTY_FORM); setModal('add') }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Product
            </button>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.cardTitle}>All Products</span>
              <span className={styles.cardSub}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
            </div>
            <div className={p.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {['Product ID', 'Image', 'Product Name', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                      <th key={h} className={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0
                    ? <tr><td colSpan={8} className={p.emptyCell}>No products found.</td></tr>
                    : paginated.map(pr => (
                        <tr key={pr.id} className={styles.tr}>
                          <td className={styles.tdMono}>{pr.id}</td>
                          <td className={styles.td}>
                            <img src={pr.image} alt={pr.name} className={p.thumb} />
                          </td>
                          <td className={styles.td} style={{ fontWeight: 600 }}>{pr.name}</td>
                          <td className={styles.tdMuted}>{pr.category}</td>
                          <td className={styles.tdAccent}>₹{pr.price.toLocaleString()}</td>
                          <td className={styles.td}>
                            <span style={{ color: pr.stock <= 2 ? '#f472b6' : '#e8f0ef' }}>{pr.stock}</span>
                          </td>
                          <td className={styles.td}>
                            <span className={styles.pill} style={{ color: STATUS_CFG[pr.status]?.color, background: STATUS_CFG[pr.status]?.bg, border: `1px solid ${STATUS_CFG[pr.status]?.border}` }}>{pr.status}</span>
                          </td>
                          <td className={styles.td}>
                            <div className={p.actions}>
                              <button className={p.actionBtn} title="View" onClick={() => { setSelected(pr); setModal('view') }}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                              </button>
                              <button className={p.actionBtn} title="Edit" onClick={() => { setForm({ name: pr.name, category: pr.category, price: pr.price, stock: pr.stock, status: pr.status, image: pr.image, notes: pr.notes }); setSelected(pr); setModal('edit') }}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                              </button>
                              <button className={`${p.actionBtn} ${p.deleteBtn}`} title="Delete">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                  }
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className={p.pagination}>
                <button className={p.pageBtn} disabled={page === 1} onClick={() => setPage(pg => pg - 1)}>‹ Prev</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button key={n} className={`${p.pageBtn} ${page === n ? p.pageActive : ''}`} onClick={() => setPage(n)}>{n}</button>
                ))}
                <button className={p.pageBtn} disabled={page === totalPages} onClick={() => setPage(pg => pg + 1)}>Next ›</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── View Modal ── */}
      {modal === 'view' && selected && (
        <div className={p.overlay} onClick={() => setModal(null)}>
          <div className={p.modal} onClick={e => e.stopPropagation()}>
            <div className={p.modalHead}>
              <h2 className={p.modalTitle}>Product Details</h2>
              <button className={p.closeBtn} onClick={() => setModal(null)}>✕</button>
            </div>
            <div className={p.modalBody}>
              <div className={p.viewHero}>
                <img src={selected.image} alt={selected.name} className={p.viewImg} />
                <div>
                  <p className={p.viewName}>{selected.name}</p>
                  <p className={p.viewId}>{selected.id}</p>
                  <span className={styles.pill} style={{ color: STATUS_CFG[selected.status]?.color, background: STATUS_CFG[selected.status]?.bg, border: `1px solid ${STATUS_CFG[selected.status]?.border}`, marginTop: 10, display: 'inline-block' }}>{selected.status}</span>
                </div>
              </div>
              <div className={p.viewGrid}>
                {[['Category', selected.category], ['Price', `₹${selected.price.toLocaleString()}`], ['Stock', selected.stock]].map(([k, v]) => (
                  <div key={k} className={p.viewItem}>
                    <span className={p.viewKey}>{k}</span>
                    <span className={p.viewVal}>{v}</span>
                  </div>
                ))}
              </div>
              {selected.notes && (
                <div className={p.viewNotes}>
                  <p className={p.viewKey}>Notes</p>
                  <p className={p.viewNotesText}>{selected.notes}</p>
                </div>
              )}
            </div>
            <div className={p.modalFoot}>
              <button className={p.cancelBtn} onClick={() => setModal(null)}>Close</button>
              <button className={p.saveBtn} onClick={() => { setForm({ name: selected.name, category: selected.category, price: selected.price, stock: selected.stock, status: selected.status, image: selected.image, notes: selected.notes }); setModal('edit') }}>Edit Product</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      {(modal === 'add' || modal === 'edit') && (
        <div className={p.overlay} onClick={() => setModal(null)}>
          <div className={p.modal} onClick={e => e.stopPropagation()}>
            <div className={p.modalHead}>
              <h2 className={p.modalTitle}>{modal === 'add' ? 'Add Product' : 'Edit Product'}</h2>
              <button className={p.closeBtn} onClick={() => setModal(null)}>✕</button>
            </div>
            <div className={p.modalBody}>
              <div className={p.formGrid}>
                <div className={p.formGroup}>
                  <label className={p.label}>Product Name</label>
                  <input className={p.input} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. iPhone 12 Pro" />
                </div>
                <div className={p.formGroup}>
                  <label className={p.label}>Category</label>
                  <select className={p.input} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    <option>Phone</option>
                    <option>Laptop</option>
                    <option>Tablet</option>
                    <option>Audio</option>
                    <option>Wearable</option>
                    <option>TV</option>
                    <option>Appliance</option>
                    <option>Camera</option>
                    <option>Monitor</option>
                    <option>Accessory</option>
                    <option>Gaming</option>
                    <option>Printer</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className={p.formGroup}>
                  <label className={p.label}>Price (₹)</label>
                  <input className={p.input} type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="e.g. 32000" />
                </div>
                <div className={p.formGroup}>
                  <label className={p.label}>Stock</label>
                  <input className={p.input} type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} placeholder="e.g. 5" />
                </div>
                <div className={p.formGroup}>
                  <label className={p.label}>Status</label>
                  <select className={p.input} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Pending</option>
                  </select>
                </div>
                <div className={p.formGroup}>
                  <label className={p.label}>Image</label>
                  <input className={p.input} type="file" accept="image/*" onChange={e => {
                    const file = e.target.files[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onload = ev => setForm(f => ({ ...f, image: ev.target.result }))
                      reader.readAsDataURL(file)
                    }
                  }} />
                  {form.image && <img src={form.image} alt="preview" style={{ marginTop: 8, width: 64, height: 64, borderRadius: 10, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.07)' }} />}
                </div>
              </div>
              <div className={p.formGroup} style={{ marginTop: 12 }}>
                <label className={p.label}>Notes</label>
                <textarea className={`${p.input} ${p.textarea}`} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Condition, accessories, etc." />
              </div>
            </div>
            <div className={p.modalFoot}>
              <button className={p.cancelBtn} onClick={() => setModal(null)}>Cancel</button>
              <button className={p.saveBtn}>{modal === 'add' ? 'Add Product' : 'Save Changes'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
