import { useState } from 'react'
import axios from 'axios'
import Nav from './Nav'
import Footer from './Footer'
import styles from '../../css/user/sell.module.css'





export default function SellEwaste() {
  
  const BASE_URL = import.meta.env.VITE_API_URL
  const [mode, setMode]           = useState('single') // 'single' | 'bulk'
  const [step, setStep]           = useState(1)
  const [form, setForm]           = useState({ category: '', condition: '', brand: '', model: '', qty: 1, name: '', phone: '', address: '' })
  const [bulkList, setBulkList]   = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const addToBulk = () => {
    if (!form.category || !form.condition) return
    setBulkList(prev => [...prev, { ...form, id: Date.now() }])
    setForm({ category: '', condition: '', brand: '', model: '', qty: 1, name: '', phone: '', address: '' })
  }

  const removeFromBulk = (id) => setBulkList(prev => prev.filter(i => i.id !== id))

  const itemsToSubmit = mode === 'single' ? [form] : bulkList
  const canProceedSingle = form.category && form.condition
  const canProceedBulk   = bulkList.length > 0

  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true) }

  const reset = () => {
    setForm({ category: '', condition: '', brand: '', model: '', qty: 1, name: '', phone: '', address: '' }); setBulkList([])
    setSubmitted(false); setStep(1)
  }

  const submit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const res = await axios.post(`${BASE_URL}/api/sell/`, {
        product: form.category,
        product_brand: form.brand,
        product_model: form.model,
        product_quantity: form.qty,
        product_description: form.condition,
        user_name: form.name,
        phone: form.phone,
        address: form.address,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSuccess('Successfully submitted')
      setError('')
    } catch (err) {
      if (err.response?.status === 401) {
        window.dispatchEvent(new Event('openLogin'))
      } else {
        setError('Something went wrong')
        setSuccess('')
      }
    }
  }


  if (submitted) return (
    <div className={styles.page}>
      <Nav />
      <div className={styles.successWrap}>
        <div className={styles.successRing}>
          <svg viewBox="0 0 60 60" fill="none" width="72">
            <circle cx="30" cy="30" r="28" stroke="rgba(0,255,163,0.15)" strokeWidth="1.5"/>
            <circle cx="30" cy="30" r="28" stroke="#00ffa3" strokeWidth="1.5" strokeDasharray="176" strokeDashoffset="44" strokeLinecap="round"/>
            <polyline points="18,30 26,38 42,22" stroke="#00ffa3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 className={styles.successTitle}>Request Submitted</h2>
        <p className={styles.successDesc}>We will contact you within 2 hours to confirm your pickup. Our team will inspect each device and provide the final price on the spot.</p>
        <div className={styles.successStats}>
          <div className={styles.successStat}><span>{itemsToSubmit.length}</span>Device{itemsToSubmit.length > 1 ? 's' : ''}</div>
          <div className={styles.successStatDiv} />
          <div className={styles.successStat}><span>Free</span>Pickup</div>
          <div className={styles.successStatDiv} />
          <div className={styles.successStat}><span>24hr</span>Payment</div>
        </div>
        <button className={styles.successBtn} onClick={reset}>Submit Another Request</button>
      </div>
      <Footer />
    </div>
  )

  return (
    <div className={styles.page}>
      <Nav />

      <section className={styles.hero}>
        <div className={styles.heroGrid} />
        <div className={styles.heroGlow} />
        <div className={styles.heroContent}>
          <div className={styles.heroPill}><span className={styles.heroPillDot} />Free Pickup · Bulk Accepted · Fast Payment</div>
          <h1 className={styles.heroTitle}>Sell Your<br /><em>E-Waste</em></h1>
          <p className={styles.heroSub}>Sell one device or many. We accept all e-waste — pickup is free and payment is fast.</p>
        </div>
      </section>

      <div className={styles.formWrap}>
        <div className={styles.formCard}>

          {/* Mode Toggle */}
          <div className={styles.modeToggle}>
            <button className={`${styles.modeBtn} ${mode === 'single' ? styles.modeBtnActive : ''}`} onClick={() => { setMode('single'); setStep(1) }}>
              Single Item
            </button>
            <button className={`${styles.modeBtn} ${mode === 'bulk' ? styles.modeBtnActive : ''}`} onClick={() => { setMode('bulk'); setStep(1) }}>
              Bulk Sell
            </button>
          </div>

          {/* Progress */}
          <div className={styles.progressBar}>
            {[1,2,3].map(n => (
              <div key={n} className={`${styles.progressStep} ${step >= n ? styles.progressActive : ''}`}>
                <div className={styles.progressDot}>{step > n ? '✓' : n}</div>
                <div className={styles.progressLabel}>{['Device Info', 'Review', 'Contact'][n-1]}</div>
              </div>
            ))}
          </div>
          <div className={styles.progressMsg}>
            {step === 1 && (mode === 'bulk' ? 'Add all devices you want to sell, then proceed' : 'Tell us about your device')}
            {step === 2 && 'Review before scheduling pickup'}
            {step === 3 && 'Enter your contact and pickup details'}
          </div>

          {/* ── Step 1 ── */}
          {step === 1 && (
            <div className={styles.formStep}>

              <div className={styles.field}>
                <div className={styles.fieldLabel}>Category</div>
                <div className={styles.categoryGrid}>
                  <button className={`${styles.catCard} ${form.category === 'phones' ? styles.catCardActive : ''}`} onClick={() => setForm({ ...form, category: 'phones' })}>
                    <span className={styles.catSvg}><svg viewBox="0 0 40 40" fill="none"><rect x="8" y="2" width="24" height="36" rx="5" fill="none" stroke="currentColor" strokeWidth="1.5"/><rect x="12" y="7" width="16" height="22" rx="2" fill="currentColor" fillOpacity="0.08"/><circle cx="20" cy="33" r="2" fill="currentColor" fillOpacity="0.4"/></svg></span>
                    <span className={styles.catLabel}>Phones</span>
                  </button>
                  <button className={`${styles.catCard} ${form.category === 'laptops' ? styles.catCardActive : ''}`} onClick={() => setForm({ ...form, category: 'laptops' })}>
                    <span className={styles.catSvg}><svg viewBox="0 0 44 34" fill="none"><rect x="4" y="2" width="36" height="24" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5"/><rect x="7" y="5" width="30" height="18" rx="1.5" fill="currentColor" fillOpacity="0.08"/><rect x="1" y="26" width="42" height="6" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg></span>
                    <span className={styles.catLabel}>Laptops</span>
                  </button>
                  <button className={`${styles.catCard} ${form.category === 'tablets' ? styles.catCardActive : ''}`} onClick={() => setForm({ ...form, category: 'tablets' })}>
                    <span className={styles.catSvg}><svg viewBox="0 0 34 44" fill="none"><rect x="3" y="3" width="28" height="38" rx="5" fill="none" stroke="currentColor" strokeWidth="1.5"/><rect x="7" y="7" width="20" height="28" rx="2" fill="currentColor" fillOpacity="0.08"/><circle cx="17" cy="39" r="2" fill="currentColor" fillOpacity="0.4"/></svg></span>
                    <span className={styles.catLabel}>Tablets</span>
                  </button>
                  <button className={`${styles.catCard} ${form.category === 'desktops' ? styles.catCardActive : ''}`} onClick={() => setForm({ ...form, category: 'desktops' })}>
                    <span className={styles.catSvg}><svg viewBox="0 0 44 40" fill="none"><rect x="2" y="2" width="40" height="26" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5"/><rect x="5" y="5" width="34" height="20" rx="1.5" fill="currentColor" fillOpacity="0.08"/><rect x="16" y="28" width="12" height="5" rx="1" fill="none" stroke="currentColor" strokeWidth="1.2"/><rect x="10" y="33" width="24" height="3" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.2"/></svg></span>
                    <span className={styles.catLabel}>Desktops</span>
                  </button>
                  <button className={`${styles.catCard} ${form.category === 'monitors' ? styles.catCardActive : ''}`} onClick={() => setForm({ ...form, category: 'monitors' })}>
                    <span className={styles.catSvg}><svg viewBox="0 0 44 38" fill="none"><rect x="2" y="2" width="40" height="26" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5"/><rect x="5" y="5" width="34" height="20" rx="1.5" fill="currentColor" fillOpacity="0.08"/><rect x="18" y="28" width="8" height="5" rx="1" fill="none" stroke="currentColor" strokeWidth="1.2"/><rect x="12" y="33" width="20" height="3" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.2"/></svg></span>
                    <span className={styles.catLabel}>Monitors</span>
                  </button>
                  <button className={`${styles.catCard} ${form.category === 'audio' ? styles.catCardActive : ''}`} onClick={() => setForm({ ...form, category: 'audio' })}>
                    <span className={styles.catSvg}><svg viewBox="0 0 40 36" fill="none"><path d="M6 22 C6 10 11 4 20 4 C29 4 34 10 34 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><rect x="2" y="20" width="8" height="12" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5"/><rect x="30" y="20" width="8" height="12" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg></span>
                    <span className={styles.catLabel}>Audio</span>
                  </button>
                  <button className={`${styles.catCard} ${form.category === 'wearables' ? styles.catCardActive : ''}`} onClick={() => setForm({ ...form, category: 'wearables' })}>
                    <span className={styles.catSvg}><svg viewBox="0 0 32 42" fill="none"><rect x="10" y="1" width="12" height="7" rx="3" fill="none" stroke="currentColor" strokeWidth="1.2"/><rect x="10" y="34" width="12" height="7" rx="3" fill="none" stroke="currentColor" strokeWidth="1.2"/><rect x="4" y="8" width="24" height="26" rx="7" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="16" cy="21" r="5" fill="none" stroke="currentColor" strokeWidth="1.2"/></svg></span>
                    <span className={styles.catLabel}>Wearables</span>
                  </button>
                  <button className={`${styles.catCard} ${form.category === 'cameras' ? styles.catCardActive : ''}`} onClick={() => setForm({ ...form, category: 'cameras' })}>
                    <span className={styles.catSvg}><svg viewBox="0 0 44 34" fill="none"><path d="M4 12 L12 12 L16 6 L28 6 L32 12 L40 12 L40 30 L4 30 Z" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="22" cy="20" r="7" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="22" cy="20" r="3" fill="currentColor" fillOpacity="0.15"/></svg></span>
                    <span className={styles.catLabel}>Cameras</span>
                  </button>
                  <button className={`${styles.catCard} ${form.category === 'printers' ? styles.catCardActive : ''}`} onClick={() => setForm({ ...form, category: 'printers' })}>
                    <span className={styles.catSvg}><svg viewBox="0 0 44 36" fill="none"><rect x="6" y="12" width="32" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5"/><rect x="12" y="2" width="20" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.2"/><rect x="12" y="28" width="20" height="6" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.2"/></svg></span>
                    <span className={styles.catLabel}>Printers</span>
                  </button>
                  <button className={`${styles.catCard} ${form.category === 'batteries' ? styles.catCardActive : ''}`} onClick={() => setForm({ ...form, category: 'batteries' })}>
                    <span className={styles.catSvg}><svg viewBox="0 0 44 24" fill="none"><rect x="1" y="4" width="38" height="16" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5"/><rect x="39" y="9" width="4" height="6" rx="2" fill="currentColor" fillOpacity="0.4"/><path d="M22 5 L18 13 L21 13 L20 19 L26 11 L23 11 Z" fill="currentColor" fillOpacity="0.5"/></svg></span>
                    <span className={styles.catLabel}>Batteries</span>
                  </button>
                  <button className={`${styles.catCard} ${form.category === 'tvs' ? styles.catCardActive : ''}`} onClick={() => setForm({ ...form, category: 'tvs' })}>
                    <span className={styles.catSvg}><svg viewBox="0 0 44 36" fill="none"><rect x="2" y="2" width="40" height="26" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5"/><rect x="5" y="5" width="34" height="20" rx="1.5" fill="currentColor" fillOpacity="0.08"/><rect x="16" y="28" width="12" height="4" rx="1" fill="none" stroke="currentColor" strokeWidth="1.2"/><rect x="10" y="32" width="24" height="3" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.2"/></svg></span>
                    <span className={styles.catLabel}>TVs</span>
                  </button>
                  <button className={`${styles.catCard} ${form.category === 'other' ? styles.catCardActive : ''}`} onClick={() => setForm({ ...form, category: 'other' })}>
                    <span className={styles.catSvg}><svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" strokeWidth="1.5"/><line x1="20" y1="3" x2="20" y2="14" stroke="currentColor" strokeWidth="1.2"/><line x1="20" y1="26" x2="20" y2="37" stroke="currentColor" strokeWidth="1.2"/><line x1="3" y1="20" x2="14" y2="20" stroke="currentColor" strokeWidth="1.2"/><line x1="26" y1="20" x2="37" y2="20" stroke="currentColor" strokeWidth="1.2"/></svg></span>
                    <span className={styles.catLabel}>Other</span>
                  </button>
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <div className={styles.fieldLabel}>Brand</div>
                  <input className={styles.input} placeholder='e.g. Apple, Samsung' value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} />
                </div>
                <div className={styles.field}>
                  <div className={styles.fieldLabel}>Model</div>
                  <input className={styles.input} placeholder='e.g. iPhone 12' value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} />
                </div>
              </div>

              <div className={styles.field}>
                <div className={styles.fieldLabel}>Quantity</div>
                <div className={styles.qtyRow}>
                  <button type='button' className={styles.qtyBtn} onClick={() => setForm({ ...form, qty: Math.max(1, form.qty - 1) })}>−</button>
                  <span className={styles.qtyVal}>{form.qty}</span>
                  <button type='button' className={styles.qtyBtn} onClick={() => setForm({ ...form, qty: form.qty + 1 })}>+</button>
                </div>
              </div>

              <div className={styles.field}>
                <div className={styles.fieldLabel}>Condition</div>
                <div className={styles.conditionGrid}>
                  <button className={`${styles.condCard} ${form.condition === 'repairable' ? styles.condCardActive : ''}`} onClick={() => setForm({ ...form, condition: 'repairable' })}>
                    <div className={styles.condLabel}>Repairable</div>
                    <div className={styles.condDesc}>Has faults but can be fixed or refurbished</div>
                  </button>
                  <button className={`${styles.condCard} ${form.condition === 'not_repairable' ? styles.condCardActive : ''}`} onClick={() => setForm({ ...form, condition: 'not_repairable' })}>
                    <div className={styles.condLabel}>Not Repairable</div>
                    <div className={styles.condDesc}>Beyond repair, only raw materials recoverable</div>
                  </button>
                  <button className={`${styles.condCard} ${form.condition === 'end_of_life' ? styles.condCardActive : ''}`} onClick={() => setForm({ ...form, condition: 'end_of_life' })}>
                    <div className={styles.condLabel}>End of Life</div>
                    <div className={styles.condDesc}>Too old or obsolete, no longer usable</div>
                  </button>
                  <button className={`${styles.condCard} ${form.condition === 'damaged' ? styles.condCardActive : ''}`} onClick={() => setForm({ ...form, condition: 'damaged' })}>
                    <div className={styles.condLabel}>Physically Damaged</div>
                    <div className={styles.condDesc}>Cracked, crushed, burnt or water damaged</div>
                  </button>
                </div>
              </div>

              {mode === 'bulk' ? (
                <div className={styles.bulkActions}>
                  <button className={styles.addToListBtn} disabled={!form.category || !form.condition} onClick={addToBulk}>
                    + Add to List
                  </button>
                  {bulkList.length > 0 && (
                    <div className={styles.bulkList}>
                      <div className={styles.bulkListHeader}>
                        <span className={styles.fieldLabel}>Items Added ({bulkList.length})</span>
                      </div>
                      {bulkList.map((item) => (
                        <div key={item.id} className={styles.bulkItem}>
                          <div className={styles.bulkItemInfo}>
                            <div className={styles.bulkItemName}>{item.brand && item.model ? `${item.brand} ${item.model}` : item.brand || item.model || item.category}</div>
                            <div className={styles.bulkItemSub}>{item.category} · {item.condition} · Qty: {item.qty}</div>
                          </div>
                          <button className={styles.bulkItemRemove} onClick={() => removeFromBulk(item.id)}>
                            <svg viewBox="0 0 12 12" fill="none" width="10"><line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="11" y1="1" x2="1" y2="11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <button className={styles.nextBtn} disabled={!canProceedBulk} onClick={() => setStep(2)}>
                    Review List ({bulkList.length} item{bulkList.length !== 1 ? 's' : ''})
                  </button>
                </div>
              ) : (
                <button className={styles.nextBtn} disabled={!canProceedSingle} onClick={() => setStep(2)}>
                  Review & Continue
                </button>
              )}
            </div>
          )}

          
          {step === 2 && (
            <div className={styles.formStep}>
              <h3 className={styles.formTitle}>Review Summary</h3>
              <div className={styles.reviewList}>
                {itemsToSubmit.map((item, i) => (
                  <div key={i} className={styles.reviewItem}>
                    <div className={styles.reviewItemInfo}>
                      <div className={styles.reviewItemName}>{item.brand && item.model ? `${item.brand} ${item.model}` : item.brand || item.model || item.category}</div>
                      <div className={styles.reviewItemSub}>{item.category} · {item.condition} · Qty: {item.qty}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.pricingNotice}>
                <svg viewBox="0 0 20 20" fill="none" width="18" height="18" style={{ flexShrink: 0 }}>
                  <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.4"/>
                  <line x1="10" y1="9" x2="10" y2="14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                  <circle cx="10" cy="6.5" r="0.8" fill="currentColor"/>
                </svg>
                <div>
                  <div className={styles.pricingNoticeTitle}>Price confirmed after inspection</div>
                  <div className={styles.pricingNoticeDesc}>Our team will evaluate each device during pickup and give you the final offer. You are free to accept or decline.</div>
                </div>
              </div>
              <div className={styles.btnRow}>
                <button className={styles.backBtn} onClick={() => setStep(1)}>Back</button>
                <button className={styles.nextBtn} onClick={() => setStep(3)}>Schedule Pickup</button>
              </div>
            </div>
          )}

          {/* ── Step 3 ── */}
          {step === 3 && (
            <form className={styles.formStep} onSubmit={submit}>
              <h3 className={styles.formTitle}>Schedule Pickup</h3>
              <div className={styles.field}>
                <div className={styles.fieldLabel}>Full Name</div>
                <input className={styles.input} placeholder='Your full name' value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className={styles.field}>
                <div className={styles.fieldLabel}>Phone Number</div>
                <input className={styles.input} placeholder='Your phone number' value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
              </div>
              <div className={styles.field}>
                <div className={styles.fieldLabel}>Pickup Address</div>
                <textarea className={styles.textarea} placeholder='Your full address' value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required rows={3} />
              </div>
              {error && <p className={styles.errorMsg}>{error}</p>}
              {success && <p className={styles.successMsg}>{success}</p>}
              <div className={styles.btnRow}>
                <button type='submit' className={styles.nextBtn}>Confirm Pickup</button>
              </div>
            </form>
          )}

        </div>
      </div>

      <Footer />
    </div>
  )
}
