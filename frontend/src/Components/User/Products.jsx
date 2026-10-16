import { useState } from 'react'
import Nav from './Nav'
import Footer from './Footer'
import styles from '../../css/user/products.module.css'

const PRODUCTS = [
  { id: 1,  name: 'iPhone 12 Pro',        category: 'Phones',         price: 4200,  originalPrice: 7999,  rating: 4.5, reviews: 128,     color: '#a78bfa' },
  { id: 2,  name: 'Samsung Galaxy S21',   category: 'Phones',    price: 5100,  originalPrice: 9499,  rating: 4.7, reviews: 94,   color: '#60a5fa' },
  { id: 3,  name: 'MacBook Air M1',       category: 'Laptops',      price: 38000, originalPrice: 92000, rating: 4.8, reviews: 210, color: '#00ffa3' },
  { id: 4,  name: 'Dell XPS 13',          category: 'Laptops',     price: 22000, originalPrice: 75000, rating: 4.2, reviews: 67,        color: '#00c8ff' },
  { id: 5,  name: 'Sony WH-1000XM4',      category: 'Audio',    price: 8500,  originalPrice: 22000, rating: 4.9, reviews: 305,   color: '#f472b6' },
  { id: 6,  name: 'iPad Air 4th Gen',     category: 'Tablets',     price: 18000, originalPrice: 45000, rating: 4.6, reviews: 88,           color: '#34d399' },
  { id: 7,  name: 'Apple Watch Series 6', category: 'Wearables',   price: 9500,  originalPrice: 28000, rating: 4.4, reviews: 72,          color: '#fb923c' },
  { id: 8,  name: 'OnePlus 9 Pro',        category: 'Phones',    price: 6200,  originalPrice: 14999, rating: 4.5, reviews: 113,         color: '#f87171' },
  { id: 9,  name: 'Lenovo ThinkPad X1',   category: 'Laptops',     price: 19000, originalPrice: 68000, rating: 4.1, reviews: 45,          color: '#94a3b8' },
  { id: 10, name: 'GoPro Hero 9',         category: 'Cameras',     price: 7800,  originalPrice: 18000, rating: 4.6, reviews: 59,    color: '#fbbf24' },
  { id: 11, name: 'Bose QuietComfort 45', category: 'Audio',      price: 6500,  originalPrice: 17000, rating: 4.7, reviews: 142,       color: '#c084fc' },
  { id: 12, name: 'Samsung Tab S7',       category: 'Tablets',  price: 21000, originalPrice: 52000, rating: 4.5, reviews: 76,   color: '#2dd4bf' },
]

const BADGE_META = {
  'Popular':    { bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.4)',  color: '#fbbf24' },
  'Top Pick':   { bg: 'rgba(0,255,163,0.1)',    border: 'rgba(0,255,163,0.4)',   color: '#00ffa3' },
  'Best Value': { bg: 'rgba(96,165,250,0.1)',   border: 'rgba(96,165,250,0.4)',  color: '#60a5fa' },
}

const CONDITION_META = {
  Excellent: { color: '#00ffa3', label: 'Excellent' },
  Good:      { color: '#00c8ff', label: 'Good' },
  Fair:      { color: '#f59e0b', label: 'Fair' },
}

const DEVICE_SVG = {
  Phones: (color) => (
    <svg viewBox="0 0 80 140" fill="none" width="70">
      <rect x="8" y="4" width="64" height="132" rx="12" fill="#0a0f14" stroke={color} strokeWidth="1.5" strokeOpacity="0.4"/>
      <rect x="14" y="14" width="52" height="96" rx="6" fill={color} fillOpacity="0.06"/>
      <rect x="15" y="15" width="50" height="94" rx="5" fill="url(#pg)"/>
      <rect x="28" y="6" width="24" height="4" rx="2" fill={color} fillOpacity="0.3"/>
      <circle cx="40" cy="122" r="6" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1" strokeOpacity="0.4"/>
      <defs><linearGradient id="pg" x1="15" y1="15" x2="65" y2="109" gradientUnits="userSpaceOnUse"><stop stopColor={color} stopOpacity="0.12"/><stop offset="1" stopColor={color} stopOpacity="0.03"/></linearGradient></defs>
    </svg>
  ),
  Laptops: (color) => (
    <svg viewBox="0 0 140 100" fill="none" width="110">
      <rect x="10" y="6" width="120" height="76" rx="6" fill="#0a0f14" stroke={color} strokeWidth="1.5" strokeOpacity="0.4"/>
      <rect x="16" y="12" width="108" height="64" rx="4" fill={color} fillOpacity="0.06"/>
      <rect x="17" y="13" width="106" height="62" rx="3" fill="url(#lg)"/>
      <rect x="2" y="82" width="136" height="12" rx="5" fill="#0a0f14" stroke={color} strokeWidth="1.2" strokeOpacity="0.3"/>
      <rect x="52" y="84" width="36" height="4" rx="2" fill={color} fillOpacity="0.2"/>
      <defs><linearGradient id="lg" x1="17" y1="13" x2="123" y2="75" gradientUnits="userSpaceOnUse"><stop stopColor={color} stopOpacity="0.1"/><stop offset="1" stopColor={color} stopOpacity="0.02"/></linearGradient></defs>
    </svg>
  ),
  Audio: (color) => (
    <svg viewBox="0 0 100 90" fill="none" width="90">
      <path d="M18 55 C18 28 28 12 50 12 C72 12 82 28 82 55" stroke={color} strokeWidth="3" strokeLinecap="round" strokeOpacity="0.5"/>
      <rect x="6" y="50" width="18" height="30" rx="7" fill="#0a0f14" stroke={color} strokeWidth="1.5" strokeOpacity="0.4"/>
      <rect x="76" y="50" width="18" height="30" rx="7" fill="#0a0f14" stroke={color} strokeWidth="1.5" strokeOpacity="0.4"/>
      <rect x="9" y="53" width="12" height="24" rx="5" fill={color} fillOpacity="0.1"/>
      <rect x="79" y="53" width="12" height="24" rx="5" fill={color} fillOpacity="0.1"/>
    </svg>
  ),
  Tablets: (color) => (
    <svg viewBox="0 0 100 130" fill="none" width="80">
      <rect x="6" y="6" width="88" height="118" rx="10" fill="#0a0f14" stroke={color} strokeWidth="1.5" strokeOpacity="0.4"/>
      <rect x="13" y="14" width="74" height="100" rx="6" fill={color} fillOpacity="0.06"/>
      <rect x="14" y="15" width="72" height="98" rx="5" fill="url(#tg)"/>
      <circle cx="50" cy="120" r="4" fill={color} fillOpacity="0.3"/>
      <defs><linearGradient id="tg" x1="14" y1="15" x2="86" y2="113" gradientUnits="userSpaceOnUse"><stop stopColor={color} stopOpacity="0.1"/><stop offset="1" stopColor={color} stopOpacity="0.02"/></linearGradient></defs>
    </svg>
  ),
  Wearables: (color) => (
    <svg viewBox="0 0 80 100" fill="none" width="70">
      <rect x="26" y="2" width="28" height="16" rx="5" fill="#0a0f14" stroke={color} strokeWidth="1.2" strokeOpacity="0.3"/>
      <rect x="26" y="82" width="28" height="16" rx="5" fill="#0a0f14" stroke={color} strokeWidth="1.2" strokeOpacity="0.3"/>
      <rect x="8" y="18" width="64" height="64" rx="16" fill="#0a0f14" stroke={color} strokeWidth="1.5" strokeOpacity="0.4"/>
      <rect x="15" y="25" width="50" height="50" rx="10" fill={color} fillOpacity="0.07"/>
      <circle cx="40" cy="50" r="16" fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.3"/>
      <line x1="40" y1="50" x2="40" y2="38" stroke={color} strokeWidth="2" strokeLinecap="round" strokeOpacity="0.7"/>
      <line x1="40" y1="50" x2="50" y2="50" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5"/>
    </svg>
  ),
  Cameras: (color) => (
    <svg viewBox="0 0 120 90" fill="none" width="100">
      <path d="M8 28 L28 28 L36 14 L84 14 L92 28 L112 28 L112 78 L8 78 Z" fill="#0a0f14" stroke={color} strokeWidth="1.5" strokeOpacity="0.4"/>
      <circle cx="60" cy="52" r="20" fill="none" stroke={color} strokeWidth="1.5" strokeOpacity="0.4"/>
      <circle cx="60" cy="52" r="13" fill={color} fillOpacity="0.08"/>
      <circle cx="60" cy="52" r="6" fill={color} fillOpacity="0.15"/>
      <circle cx="88" cy="34" r="5" fill={color} fillOpacity="0.2"/>
    </svg>
  ),
}





export default function Products() {
  const [search, setSearch]       = useState('')
  const [category, setCategory]   = useState('All')
  const [sort, setSort]           = useState('popular')
  const [cart, setCart]           = useState([])
  const [wishlist, setWishlist]   = useState([])

  const filtered = PRODUCTS
    .filter(p => category  === 'All' || p.category  === category)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'price-asc')  return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      if (sort === 'rating')     return b.rating - a.rating
      return b.reviews - a.reviews
    })

  const toggleCart     = (id) => setCart(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  const toggleWishlist = (id) => setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const cards = filtered.map(p => ({
    id:           p.id,
    name:         p.name,
    category:     p.category,
    price:        p.price,
    originalPrice:p.originalPrice,
    reviews:      p.reviews,
    color:        p.color,
    inCart:       cart.includes(p.id),
    inWish:       wishlist.includes(p.id),
    badge:        p.badge,
    badgeMeta:    p.badge ? BADGE_META[p.badge] : null,
    cond:         CONDITION_META[p.condition] || CONDITION_META['Good'],
    DeviceSVG:    DEVICE_SVG[p.category]     || DEVICE_SVG['Phones'],
  }))

  return (
    <div className={styles.page}>
      <Nav />

      {/* ── Hero Banner ── */}
      <section className={styles.hero}>
        <div className={styles.heroGrid} />
        <div className={styles.heroGlow} />
        <div className={styles.heroContent}>
          <div className={styles.heroPill}>
            <span className={styles.heroPillDot} />
            Certified Refurbished Devices
          </div>
          <h1 className={styles.heroTitle}>
            Shop <em>Pre-owned</em><br />Electronics
          </h1>
          <p className={styles.heroSub}>
            Every device is tested, graded & verified.<br />Save up to 70% — and the planet.
          </p>
        </div>
      </section>

      {/* ── Filter Bar ── */}
      <div className={styles.filterBar}>
        <div className={styles.filterBarInner}>
          <div className={styles.categoryTabs}>
            {['All','Phones','Laptops','Audio','Tablets','Wearables','Cameras'].map(c => (
              <button
                key={c}
                className={`${styles.catTab} ${category === c ? styles.catTabActive : ''}`}
                onClick={() => setCategory(c)}
              >{c}</button>
            ))}
          </div>
          <div className={styles.filterRight}>
            <div className={styles.searchWrap}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                className={styles.searchInput}
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.conditionRow}>
        <span className={styles.resultCount}>{filtered.length} results</span>
      </div>

      <div className={styles.bodyWrap}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarGroup}>
            <div className={styles.sidebarLabel}>Category</div>
            {['All','Phones','Laptops','Audio','Tablets','Wearables','Cameras'].map(c => (
              <button key={c} className={`${styles.sidebarBtn} ${category === c ? styles.sidebarBtnActive : ''}`} onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>
          <div className={styles.sidebarGroup}>
            <div className={styles.sidebarLabel}>Sort By</div>
            {[['popular','Most Popular'],['rating','Top Rated'],['price-asc','Price: Low to High'],['price-desc','Price: High to Low']].map(([val, label]) => (
              <button key={val} className={`${styles.sidebarBtn} ${sort === val ? styles.sidebarBtnActive : ''}`} onClick={() => setSort(val)}>{label}</button>
            ))}
          </div>
        </aside>

        <div className={styles.gridWrap}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>◎</div>
            <p>No products match your filters.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {cards.map(p => (
                <div key={p.id} className={styles.card} style={{ '--card-color': p.color }}>

                  

                  

                  <button className={`${styles.wishBtn} ${p.inWish ? styles.wishActive : ''}`} onClick={() => toggleWishlist(p.id)}>
                    {p.inWish ? '♥' : '♡'}
                  </button>

                  {p.badgeMeta && (
                    <div className={styles.badge} style={{ background: p.badgeMeta.bg, borderColor: p.badgeMeta.border, color: p.badgeMeta.color }}>
                      {p.badge}
                    </div>
                  )}

                  <div className={styles.cardImg}>
                    <div className={styles.cardImgGlow} style={{ background: `radial-gradient(ellipse 60% 50% at 50% 60%, ${p.color}22, transparent)` }} />
                    <div className={styles.deviceWrap}>
                      {p.DeviceSVG(p.color)}
                    </div>

                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.cardMeta}>
                      <span className={styles.categoryLabel}>{p.category}</span>
                    </div>

                    <div className={styles.cardName}>{p.name}</div>

                    <div className={styles.priceRow}>
                      <span className={styles.price}>₹{p.price.toLocaleString()}</span>
                    
                    </div>

                    <button
                      className={`${styles.addBtn} ${p.inCart ? styles.addBtnAdded : ''}`}
                      style={p.inCart ? {} : { '--btn-color': p.color }}
                      onClick={() => toggleCart(p.id)}
                    >
                      {p.inCart ? (
                        <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>Added</>
                      ) : (
                        <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 2 L3 6 L3 20 C3 21.1 3.9 22 5 22 L19 22 C20.1 22 21 21.1 21 20 L21 6 L18 2 Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10 C16 12.2 14.2 14 12 14 C9.8 14 8 12.2 8 10"/></svg>Add to Cart</>
                      )}
                    </button>
                  </div>
                </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
