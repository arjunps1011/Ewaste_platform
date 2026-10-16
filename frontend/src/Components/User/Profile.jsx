import { useState } from 'react'
import { Link } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'
import styles from '../../css/user/profile.module.css'

const TABS = ['Overview', 'My Listings', 'Orders', 'Settings']

const listings = [
  { id: 1, name: 'MacBook Pro 2019', category: 'Laptop',  status: 'Sold',    amount: 4200, date: 'Jun 12, 2025' },
  { id: 2, name: 'iPhone 11',        category: 'Mobile',  status: 'Pending', amount: 1800, date: 'Jun 18, 2025' },
  { id: 3, name: 'Dell Monitor 24"', category: 'Monitor', status: 'Active',  amount: 900,  date: 'Jun 20, 2025' },
]

const orders = [
  { id: 1, name: 'Refurb ThinkPad X1', status: 'Delivered', price: 3500, date: 'Jun 10, 2025' },
  { id: 2, name: 'Wireless Keyboard',  status: 'Shipped',   price: 450,  date: 'Jun 19, 2025' },
]

const STATUS = {
  Sold:      { color: '#00ffa3', bg: 'rgba(0,255,163,0.08)',  border: 'rgba(0,255,163,0.2)'  },
  Active:    { color: '#00c8ff', bg: 'rgba(0,200,255,0.08)',  border: 'rgba(0,200,255,0.2)'  },
  Pending:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
  Delivered: { color: '#00ffa3', bg: 'rgba(0,255,163,0.08)',  border: 'rgba(0,255,163,0.2)'  },
  Shipped:   { color: '#00c8ff', bg: 'rgba(0,200,255,0.08)',  border: 'rgba(0,200,255,0.2)'  },
}

export default function Profile() {
  const [tab, setTab]         = useState('Overview')
  const [edit, setEdit]       = useState(false)
  const [form, setForm]       = useState({ name: 'Arjun Sharma', email: 'arjun@example.com', phone: '+91 98765 43210', city: 'Bengaluru' })
  const [draft, setDraft]     = useState({ ...form })

  const save = () => { setForm({ ...draft }); setEdit(false) }

  return (
    <div className={styles.page}>
      <Nav />

      {/* ── Cover ── */}
      <div className={styles.cover}>
        <div className={styles.coverGlow} />
        <div className={styles.coverGrid} />
      </div>

      <div className={styles.wrapper}>

        {/* ── Profile header card ── */}
        <div className={styles.profileCard}>
          <div className={styles.avatarRing}>
            <div className={styles.avatar}>
              {form.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
            </div>
          </div>

          <div className={styles.profileMeta}>
            <div className={styles.profileNameRow}>
              <h1 className={styles.profileName}>{form.name}</h1>
              <span className={styles.verifiedBadge}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Verified
              </span>
            </div>
            <p className={styles.profileSub}>{form.city} · Member since Jan 2024</p>
            <div className={styles.profileTags}>
              <span className={styles.tag}>♻ Eco Warrior</span>
              <span className={styles.tag}>⭐ Top Seller</span>
            </div>
          </div>

          <div className={styles.profileStats}>
            {[
              { label: 'Items Recycled', val: '14' },
              { label: 'Total Earned',   val: '₹6,900' },
              { label: 'CO₂ Saved',      val: '38 kg' },
              { label: 'Orders',         val: '2' },
            ].map((s, i) => (
              <div key={s.label} className={styles.pStat}>
                {i > 0 && <div className={styles.pStatDivider} />}
                <div className={styles.pStatInner}>
                  <span className={styles.pStatVal}>{s.val}</span>
                  <span className={styles.pStatLabel}>{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className={styles.tabRow}>
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
            >{t}</button>
          ))}
        </div>

        {/* ── Overview ── */}
        {tab === 'Overview' && (
          <div className={styles.grid2}>

            {/* Recent activity */}
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.cardTitle}>Recent Activity</span>
                <span className={styles.cardCount}>5 events</span>
              </div>
              <div className={styles.feed}>
                {[
                  { color: '#00ffa3', icon: '↑', label: 'Listed',    text: 'Dell Monitor 24"',       time: '2 days ago' },
                  { color: '#00ffa3', icon: '₹', label: 'Paid out',  text: '₹4,200 for MacBook Pro', time: '8 days ago' },
                  { color: '#00c8ff', icon: '↓', label: 'Ordered',   text: 'Wireless Keyboard',      time: '11 days ago' },
                  { color: '#00c8ff', icon: '✓', label: 'Delivered', text: 'ThinkPad X1',            time: '20 days ago' },
                  { color: '#f59e0b', icon: '⏳', label: 'Pending',  text: 'iPhone 11 under review', time: '22 days ago' },
                ].map((a, i) => (
                  <div key={i} className={styles.feedItem}>
                    <div className={styles.feedDot} style={{ background: a.color, boxShadow: `0 0 8px ${a.color}88` }} />
                    <div className={styles.feedBody}>
                      <span className={styles.feedLabel} style={{ color: a.color }}>{a.label}</span>
                      <span className={styles.feedText}>{a.text}</span>
                    </div>
                    <span className={styles.feedTime}>{a.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.cardTitle}>Quick Actions</span>
              </div>
              <div className={styles.quickGrid}>
                {[
                  { label: 'Sell E-Waste',   sub: 'List a new device',     to: '/sell',     icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 5v14M5 12l7-7 7 7"/></svg> },
                  { label: 'Browse Products',sub: 'Shop refurbished',       to: '/products', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg> },
                  { label: 'View Cart',      sub: 'Items waiting',          to: '/cart',     icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg> },
                  { label: 'Edit Profile',   sub: 'Update your details',    to: null,        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>, action: () => setTab('Settings') },
                ].map((q, i) => (
                  q.to
                    ? <Link key={i} to={q.to} className={styles.quickCard}>
                        <div className={styles.quickIcon}>{q.icon}</div>
                        <div><p className={styles.quickLabel}>{q.label}</p><p className={styles.quickSub}>{q.sub}</p></div>
                        <svg className={styles.quickArrow} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </Link>
                    : <button key={i} onClick={q.action} className={styles.quickCard}>
                        <div className={styles.quickIcon}>{q.icon}</div>
                        <div><p className={styles.quickLabel}>{q.label}</p><p className={styles.quickSub}>{q.sub}</p></div>
                        <svg className={styles.quickArrow} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ── My Listings ── */}
        {tab === 'My Listings' && (
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.cardTitle}>My Listings</span>
              <Link to="/sell" className={styles.headBtn}>+ New Listing</Link>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  {['Item', 'Category', 'Date', 'Amount', 'Status'].map(h => (
                    <th key={h} className={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {listings.map(l => (
                  <tr key={l.id} className={styles.tr}>
                    <td className={styles.td} style={{ fontWeight: 500 }}>{l.name}</td>
                    <td className={styles.td}><span className={styles.chip}>{l.category}</span></td>
                    <td className={styles.tdMuted}>{l.date}</td>
                    <td className={styles.td} style={{ color: '#00ffa3', fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>₹{l.amount.toLocaleString()}</td>
                    <td className={styles.td}>
                      <span className={styles.statusPill} style={{ color: STATUS[l.status].color, background: STATUS[l.status].bg, border: `1px solid ${STATUS[l.status].border}` }}>
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Orders ── */}
        {tab === 'Orders' && (
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.cardTitle}>Order History</span>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  {['Product', 'Date', 'Price', 'Status', ''].map(h => (
                    <th key={h} className={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} className={styles.tr}>
                    <td className={styles.td} style={{ fontWeight: 500 }}>{o.name}</td>
                    <td className={styles.tdMuted}>{o.date}</td>
                    <td className={styles.td} style={{ color: '#00ffa3', fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>₹{o.price.toLocaleString()}</td>
                    <td className={styles.td}>
                      <span className={styles.statusPill} style={{ color: STATUS[o.status].color, background: STATUS[o.status].bg, border: `1px solid ${STATUS[o.status].border}` }}>
                        {o.status}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <Link to={`/order/${o.id}`} className={styles.trackBtn}>Track →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Settings ── */}
        {tab === 'Settings' && (
          <div className={styles.settingsWrap}>
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.cardTitle}>Account Details</span>
                {!edit
                  ? <button className={styles.headBtn} onClick={() => { setDraft({ ...form }); setEdit(true) }}>Edit</button>
                  : <div className={styles.editBtns}>
                      <button className={styles.cancelBtn} onClick={() => setEdit(false)}>Cancel</button>
                      <button className={styles.saveBtn} onClick={save}>Save changes</button>
                    </div>
                }
              </div>
              <div className={styles.fieldGrid}>
                {[
                  { label: 'Full Name', key: 'name',  type: 'text' },
                  { label: 'Email',     key: 'email', type: 'email' },
                  { label: 'Phone',     key: 'phone', type: 'tel' },
                  { label: 'City',      key: 'city',  type: 'text' },
                ].map(f => (
                  <div key={f.key} className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>{f.label}</label>
                    {edit
                      ? <input type={f.type} className={styles.fieldInput} value={draft[f.key]} onChange={e => setDraft(p => ({ ...p, [f.key]: e.target.value }))} />
                      : <p className={styles.fieldVal}>{form[f.key]}</p>
                    }
                  </div>
                ))}
              </div>
            </div>

            <div className={`${styles.card} ${styles.dangerCard}`}>
              <div className={styles.cardHead}>
                <span className={styles.cardTitle}>Danger Zone</span>
              </div>
              <div className={styles.dangerRow}>
                <div>
                  <p className={styles.dangerTitle}>Delete Account</p>
                  <p className={styles.dangerSub}>Permanently remove your account and all associated data.</p>
                </div>
                <button className={styles.dangerBtn}>Delete Account</button>
              </div>
            </div>
          </div>
        )}

      </div>

      <Footer />
    </div>
  )
}
