import { useState } from 'react'
import { Link } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'
import styles from '../../css/user/cart.module.css'

const DEVICE_SVG = {
  Phones: (color) => (
    <svg viewBox="0 0 80 140" fill="none" width="52">
      <rect x="8" y="4" width="64" height="132" rx="12" fill="#0a0f14" stroke={color} strokeWidth="1.5" strokeOpacity="0.4"/>
      <rect x="14" y="14" width="52" height="96" rx="6" fill={color} fillOpacity="0.06"/>
      <rect x="28" y="6" width="24" height="4" rx="2" fill={color} fillOpacity="0.3"/>
      <circle cx="40" cy="122" r="6" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1" strokeOpacity="0.4"/>
    </svg>
  ),
  Laptops: (color) => (
    <svg viewBox="0 0 140 100" fill="none" width="80">
      <rect x="10" y="6" width="120" height="76" rx="6" fill="#0a0f14" stroke={color} strokeWidth="1.5" strokeOpacity="0.4"/>
      <rect x="16" y="12" width="108" height="64" rx="4" fill={color} fillOpacity="0.06"/>
      <rect x="2" y="82" width="136" height="12" rx="5" fill="#0a0f14" stroke={color} strokeWidth="1.2" strokeOpacity="0.3"/>
      <rect x="52" y="84" width="36" height="4" rx="2" fill={color} fillOpacity="0.2"/>
    </svg>
  ),
  Audio: (color) => (
    <svg viewBox="0 0 100 90" fill="none" width="70">
      <path d="M18 55 C18 28 28 12 50 12 C72 12 82 28 82 55" stroke={color} strokeWidth="3" strokeLinecap="round" strokeOpacity="0.5"/>
      <rect x="6" y="50" width="18" height="30" rx="7" fill="#0a0f14" stroke={color} strokeWidth="1.5" strokeOpacity="0.4"/>
      <rect x="76" y="50" width="18" height="30" rx="7" fill="#0a0f14" stroke={color} strokeWidth="1.5" strokeOpacity="0.4"/>
    </svg>
  ),
  Wearables: (color) => (
    <svg viewBox="0 0 80 100" fill="none" width="52">
      <rect x="26" y="2" width="28" height="16" rx="5" fill="#0a0f14" stroke={color} strokeWidth="1.2" strokeOpacity="0.3"/>
      <rect x="26" y="82" width="28" height="16" rx="5" fill="#0a0f14" stroke={color} strokeWidth="1.2" strokeOpacity="0.3"/>
      <rect x="8" y="18" width="64" height="64" rx="16" fill="#0a0f14" stroke={color} strokeWidth="1.5" strokeOpacity="0.4"/>
      <circle cx="40" cy="50" r="16" fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.3"/>
      <line x1="40" y1="50" x2="40" y2="38" stroke={color} strokeWidth="2" strokeLinecap="round" strokeOpacity="0.7"/>
    </svg>
  ),
}

const INITIAL_ITEMS = [
  {
    id: 1, name: 'MacBook Air M1', category: 'Laptops', color: '#00ffa3',
    price: 38000, qty: 1,
    condition: 'Excellent', refurbishedScore: 94,
    stock: 3, delivery: 'Arrives in 2–3 business days',
  },
  {
    id: 2, name: 'iPhone 12 Pro', category: 'Phones', color: '#a78bfa',
    price: 24200, qty: 1,
    condition: 'Good', refurbishedScore: 87,
    stock: 2, delivery: 'Arrives in 1–2 business days',
  },
  {
    id: 3, name: 'Sony WH-1000XM4', category: 'Audio', color: '#f472b6',
    price: 8500, qty: 1,
    condition: 'Excellent', refurbishedScore: 96,
    stock: 5, delivery: 'Arrives in 2–3 business days',
  },
]

const SUGGESTIONS = [
  { id: 4, name: 'Dell XPS 13',    category: 'Laptops',   color: '#00c8ff', price: 22000 },
  { id: 5, name: 'Apple Watch S6', category: 'Wearables', color: '#fb923c', price: 9500  },
  { id: 6, name: 'OnePlus 9 Pro',  category: 'Phones',    color: '#f87171', price: 6200  },
]

const CONDITION_COLOR = { Excellent: '#00ffa3', Good: '#00c8ff', Fair: '#f59e0b' }

const TRUST_ITEMS = [
  { label: 'Professionally Inspected',  sub: 'Every device passes 40+ quality checks before listing.' },
  { label: 'Secure Payment',            sub: 'End-to-end encrypted checkout. Multiple payment options.' },
  { label: '6-Month Warranty',          sub: 'All refurbished devices come with a 6-month service warranty.' },
  { label: 'Easy Returns',              sub: '7-day no-questions-asked return policy on all orders.' },
]

export default function Cart() {
  const [items, setItems]         = useState(INITIAL_ITEMS)
  const [savedLater, setSaved]    = useState([])
  const [expanded, setExpanded]   = useState(null)

  const updateQty = (id, delta) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i))

  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id))

  const saveForLater = (id) => {
    const item = items.find(i => i.id === id)
    setSaved(prev => [...prev, item])
    removeItem(id)
  }

  const subtotal      = items.reduce((s, i) => s + i.price * i.qty, 0)
  const delivery      = subtotal > 30000 ? 0 : 199
  const discount      = subtotal > 50000 ? Math.round(subtotal * 0.05) : 0
  const total         = subtotal + delivery - discount
  const devicesReused = items.reduce((s, i) => s + i.qty, 0)

  return (
    <div className={styles.page}>
      <Nav />

      {/* ── 1. Smart Cart Header ── */}
      <section className={styles.header}>
        <div className={styles.headerGrid} />
        <div className={styles.headerGlow} />
        <div className={styles.headerInner}>
          <div className={styles.headerLeft}>
            <div className={styles.heroPill}>
              <span className={styles.heroPillDot} />
              Smart Cart
            </div>
            <h1 className={styles.headerTitle}>Your Smart <em>Cart</em></h1>
            <p className={styles.headerSub}>
              Every item here is professionally inspected, fairly priced, and a smarter choice for the planet.
            </p>
          </div>
          <div className={styles.ecoAlert}>
            <div className={styles.ecoAlertLabel}>Devices being reused</div>
            <div className={styles.ecoAlertNum}>{devicesReused}</div>
            <div className={styles.ecoAlertSub}>kept out of landfills by this order</div>
          </div>
        </div>
      </section>

      {/* ── Main Body: Items + Sidebar ── */}
      <div className={styles.body}>

        {/* ── Left: Cart Items ── */}
        <div className={styles.itemsCol}>

          {items.length === 0 ? (
            <div className={styles.emptyCart}>
              <div className={styles.emptyTitle}>Your cart is empty</div>
              <p className={styles.emptySub}>Browse our refurbished collection and make a smart, sustainable choice.</p>
              <Link to="/products" className={styles.emptyBtn}>Browse Products</Link>
            </div>
          ) : (
            <>
              <div className={styles.itemsHeader}>
                <span className={styles.itemsCount}>{items.length} item{items.length > 1 ? 's' : ''} in cart</span>
                <span className={styles.itemsSaved}>{devicesReused} refurbished device{devicesReused > 1 ? 's' : ''} — responsibly sourced</span>
              </div>

              <div className={styles.itemsList}>
                {items.map(item => {
                  const DevSVG = DEVICE_SVG[item.category] || DEVICE_SVG['Phones']
                  const isOpen = expanded === item.id
                  return (
                    <div key={item.id} className={styles.itemCard} style={{ '--item-color': item.color }}>

                      {/* Top accent line */}
                      <div className={styles.itemAccent} />

                      <div className={styles.itemMain}>

                        {/* Device image */}
                        <div className={styles.itemImg}>
                          <div className={styles.itemImgGlow} style={{ background: `radial-gradient(ellipse 80% 70% at 50% 60%, ${item.color}20, transparent)` }} />
                          {DevSVG(item.color)}
                        </div>

                        {/* Core info */}
                        <div className={styles.itemInfo}>
                          <div className={styles.itemTopRow}>
                            <span className={styles.itemCategory}>{item.category}</span>
                            {item.stock <= 3 && (
                              <span className={styles.stockAlert}>Only {item.stock} left</span>
                            )}
                          </div>
                          <div className={styles.itemName}>{item.name}</div>

                          <div className={styles.itemBadges}>
                            <span className={styles.condBadge} style={{ color: CONDITION_COLOR[item.condition], borderColor: `${CONDITION_COLOR[item.condition]}40`, background: `${CONDITION_COLOR[item.condition]}10` }}>
                              {item.condition}
                            </span>
                            <span className={styles.techBadge}>Tested by Technician</span>
                          </div>

                          <div className={styles.itemDelivery}>{item.delivery}</div>
                        </div>

                        {/* Price + qty + actions */}
                        <div className={styles.itemRight}>
                          <div className={styles.itemPrice}>₹{(item.price * item.qty).toLocaleString()}</div>

                          <div className={styles.qtyRow}>
                            <button className={styles.qtyBtn} onClick={() => updateQty(item.id, -1)}>−</button>
                            <span className={styles.qtyVal}>{item.qty}</span>
                            <button className={styles.qtyBtn} onClick={() => updateQty(item.id, +1)}>+</button>
                          </div>

                          <div className={styles.itemActions}>
                            <button className={styles.actionBtn} onClick={() => saveForLater(item.id)}>Save for later</button>
                            <button className={styles.removeBtn} onClick={() => removeItem(item.id)}>Remove</button>
                          </div>
                        </div>
                      </div>

                      {/* Expandable insights */}
                      <button className={styles.insightToggle} onClick={() => setExpanded(isOpen ? null : item.id)}>
                        {isOpen ? 'Hide details' : 'View device insights'}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      </button>

                      {isOpen && (
                        <div className={styles.insightPanel}>
                          <div className={styles.insightItem}>
                            <div className={styles.insightLabel}>Refurbished Score</div>
                            <div className={styles.insightVal} style={{ color: item.color }}>{item.refurbishedScore}/100</div>
                            <div className={styles.insightBar}>
                              <div className={styles.insightFill} style={{ width: `${item.refurbishedScore}%`, background: item.color }} />
                            </div>
                          </div>
                          <div className={styles.insightItem}>
                            <div className={styles.insightLabel}>Eco Status</div>
                            <div className={styles.insightVal} style={{ color: '#00ffa3' }}>Reused</div>
                            <div className={styles.insightSub}>This device was kept out of a landfill</div>
                          </div>
                          <div className={styles.insightItem}>
                            <div className={styles.insightLabel}>Condition</div>
                            <div className={styles.insightVal} style={{ color: CONDITION_COLOR[item.condition] }}>{item.condition}</div>
                            <div className={styles.insightSub}>Graded across 40+ checkpoints</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {/* ── 4. Sustainable Impact Section ── */}
          {items.length > 0 && (
            <div className={styles.impactSection}>
              <div className={styles.impactEyebrow}>Your Environmental Impact</div>
              <h2 className={styles.impactTitle}>This cart makes <em>a difference.</em></h2>
              <div className={styles.impactGrid}>
                <div className={styles.impactCard}>
                  <div className={styles.impactNum}>{devicesReused}</div>
                  <div className={styles.impactLabel}>Device{devicesReused > 1 ? 's' : ''} Reused</div>
                  <div className={styles.impactSub}>Each device is given a second life instead of being discarded</div>
                </div>
                <div className={styles.impactCard}>
                  <div className={styles.impactNum}>Zero</div>
                  <div className={styles.impactLabel}>Landfill Contribution</div>
                  <div className={styles.impactSub}>Every device we sell is diverted from e-waste disposal</div>
                </div>
                <div className={styles.impactCard}>
                  <div className={styles.impactNum}>Certified</div>
                  <div className={styles.impactLabel}>Responsible Sourcing</div>
                  <div className={styles.impactSub}>All devices are collected, inspected, and processed responsibly</div>
                </div>
              </div>
            </div>
          )}

          {/* ── 5. Trust & Transparency ── */}
          <div className={styles.trustSection}>
            <div className={styles.trustEyebrow}>Why Buy With Confidence</div>
            <div className={styles.trustGrid}>
              {TRUST_ITEMS.map(t => (
                <div key={t.label} className={styles.trustCard}>
                  <div className={styles.trustDot} />
                  <div className={styles.trustLabel}>{t.label}</div>
                  <div className={styles.trustSub}>{t.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 6. Smart Suggestions ── */}
          <div className={styles.suggestSection}>
            <div className={styles.suggestEyebrow}>You May Also Like</div>
            <h3 className={styles.suggestTitle}>More refurbished <em>picks for you.</em></h3>
            <div className={styles.suggestGrid}>
              {SUGGESTIONS.map(s => {
                const DevSVG = DEVICE_SVG[s.category] || DEVICE_SVG['Phones']
                return (
                  <div key={s.id} className={styles.suggestCard} style={{ '--s-color': s.color }}>
                    <div className={styles.suggestAccent} />
                    <div className={styles.suggestImg}>
                      <div style={{ background: `radial-gradient(ellipse 80% 70% at 50% 60%, ${s.color}18, transparent)`, position: 'absolute', inset: 0 }} />
                      {DevSVG(s.color)}
                    </div>
                    <div className={styles.suggestBody}>
                      <div className={styles.suggestCat}>{s.category}</div>
                      <div className={styles.suggestName}>{s.name}</div>
                      <div className={styles.suggestEco}>Certified Refurbished</div>
                      <div className={styles.suggestPriceRow}>
                        <span className={styles.suggestPrice}>₹{s.price.toLocaleString()}</span>
                      </div>
                      <button className={styles.suggestBtn} style={{ '--s-color': s.color }}>Add to Cart</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── Saved for Later ── */}
          {savedLater.length > 0 && (
            <div className={styles.savedSection}>
              <div className={styles.savedEyebrow}>Saved for Later</div>
              <div className={styles.savedList}>
                {savedLater.map(item => (
                  <div key={item.id} className={styles.savedCard}>
                    <span className={styles.savedName}>{item.name}</span>
                    <span className={styles.savedPrice}>₹{item.price.toLocaleString()}</span>
                    <button className={styles.moveBtn} onClick={() => { setItems(prev => [...prev, item]); setSaved(prev => prev.filter(i => i.id !== item.id)) }}>
                      Move to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* ── 3. Sticky Price Breakdown Sidebar ── */}
        {items.length > 0 && (
          <aside className={styles.sidebar}>
            <div className={styles.sidebarInner}>
              <div className={styles.sidebarTitle}>Order Summary</div>

              <div className={styles.priceRows}>
                <div className={styles.priceRow}>
                  <span>Subtotal ({devicesReused} item{devicesReused > 1 ? 's' : ''})</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className={styles.priceRow}>
                  <span>Delivery</span>
                  <span className={delivery === 0 ? styles.free : ''}>{delivery === 0 ? 'Free' : `₹${delivery}`}</span>
                </div>
                {discount > 0 && (
                  <div className={`${styles.priceRow} ${styles.discountRow}`}>
                    <span>Bulk Discount (5%)</span>
                    <span>− ₹{discount.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className={styles.priceDivider} />

              <div className={styles.totalRow}>
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>

              <div className={styles.savingsBox}>
                <div className={styles.savingsLine}>
                  <span className={styles.savingsDot} />
                  {devicesReused} device{devicesReused > 1 ? 's' : ''} reused, not dumped
                </div>
                <div className={styles.savingsLine}>
                  <span className={styles.savingsDot} />
                  Certified refurbished — inspected &amp; graded
                </div>
                {delivery === 0 && (
                  <div className={styles.savingsLine}>
                    <span className={styles.savingsDot} />
                    Free delivery applied
                  </div>
                )}
              </div>

              {/* ── 7. Checkout CTA ── */}
              <Link to="/checkout" className={styles.checkoutBtn}>
                Proceed to Secure Checkout
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>

              <Link to="/products" className={styles.continueBtn}>
                Continue Shopping
              </Link>

              <div className={styles.sidebarTrust}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Secured with 256-bit SSL encryption
              </div>
            </div>
          </aside>
        )}

      </div>

      <Footer />
    </div>
  )
}
