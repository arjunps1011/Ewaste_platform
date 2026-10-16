import { useParams, Link } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'
import styles from '../../css/user/orderTracking.module.css'

const ORDERS = {
  1: {
    id: 1,
    name: 'Refurb ThinkPad X1',
    category: 'Laptop',
    price: 3500,
    date: 'Jun 10, 2025',
    status: 'Delivered',
    tracking: 'ECC-2025-00142',
    eta: 'Delivered on Jun 14, 2025',
    address: '42, MG Road, Bengaluru, Karnataka 560001',
    steps: [
      { label: 'Order Placed',     desc: 'Your order was confirmed',           date: 'Jun 10, 10:32 AM', done: true  },
      { label: 'Processing',       desc: 'Item packed and ready for dispatch',  date: 'Jun 11, 2:15 PM',  done: true  },
      { label: 'Shipped',          desc: 'Picked up by delivery partner',       date: 'Jun 12, 9:00 AM',  done: true  },
      { label: 'Out for Delivery', desc: 'Your order is out for delivery',      date: 'Jun 14, 8:45 AM',  done: true  },
      { label: 'Delivered',        desc: 'Package delivered successfully',      date: 'Jun 14, 1:20 PM',  done: true  },
    ],
  },
  2: {
    id: 2,
    name: 'Wireless Keyboard',
    category: 'Accessory',
    price: 450,
    date: 'Jun 19, 2025',
    status: 'Shipped',
    tracking: 'ECC-2025-00198',
    eta: 'Expected by Jun 23, 2025',
    address: '42, MG Road, Bengaluru, Karnataka 560001',
    steps: [
      { label: 'Order Placed',     desc: 'Your order was confirmed',           date: 'Jun 19, 11:05 AM', done: true  },
      { label: 'Processing',       desc: 'Item packed and ready for dispatch',  date: 'Jun 20, 3:40 PM',  done: true  },
      { label: 'Shipped',          desc: 'Picked up by delivery partner',       date: 'Jun 21, 8:30 AM',  done: true  },
      { label: 'Out for Delivery', desc: 'Arriving at your city hub',           date: 'Expected Jun 23',  done: false },
      { label: 'Delivered',        desc: 'Package delivered successfully',      date: '—',                done: false },
    ],
  },
}

const STATUS_STYLE = {
  Delivered: { color: '#00ffa3', bg: 'rgba(0,255,163,0.08)', border: 'rgba(0,255,163,0.2)' },
  Shipped:   { color: '#00c8ff', bg: 'rgba(0,200,255,0.08)', border: 'rgba(0,200,255,0.2)' },
}

export default function OrderTracking() {
  const { id } = useParams()
  const order = ORDERS[id]

  if (!order) return (
    <div className={styles.page}>
      <Nav />
      <div className={styles.notFound}>
        <p className={styles.notFoundTitle}>Order not found</p>
        <Link to="/profile" className={styles.backLink}>← Back to Profile</Link>
      </div>
      <Footer />
    </div>
  )

  const currentStep = order.steps.filter(s => s.done).length - 1
  const progress = (currentStep / (order.steps.length - 1)) * 100

  const s = STATUS_STYLE[order.status]

  return (
    <div className={styles.page}>
      <Nav />

      <div className={styles.wrapper}>

        {/* Back */}
        <Link to="/profile" className={styles.back}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back to Profile
        </Link>

        {/* Header */}
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Order #{order.tracking}</p>
            <h1 className={styles.title}>{order.name}</h1>
            <p className={styles.sub}>{order.category} · Ordered on {order.date}</p>
          </div>
          <div className={styles.headerRight}>
            <span className={styles.statusPill} style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
              {order.status}
            </span>
            <p className={styles.eta}>{order.eta}</p>
          </div>
        </div>

        <div className={styles.body}>

          {/* Tracking timeline */}
          <div className={styles.card}>
            <p className={styles.cardTitle}>Shipment Progress</p>

            {/* Progress bar */}
            <div className={styles.progressWrap}>
              <div className={styles.progressBg}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
              </div>
              <div className={styles.progressDots}>
                {order.steps.map((_, i) => (
                  <div key={i} className={`${styles.progressDot} ${i <= currentStep ? styles.progressDotDone : ''}`} />
                ))}
              </div>
            </div>

            {/* Steps */}
            <div className={styles.steps}>
              {order.steps.map((step, i) => (
                <div key={i} className={`${styles.step} ${!step.done ? styles.stepPending : ''}`}>
                  <div className={styles.stepLeft}>
                    <div className={`${styles.stepDot} ${step.done ? styles.stepDotDone : ''} ${i === currentStep ? styles.stepDotActive : ''}`}>
                      {step.done && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      )}
                    </div>
                    {i < order.steps.length - 1 && (
                      <div className={`${styles.stepLine} ${step.done ? styles.stepLineDone : ''}`} />
                    )}
                  </div>
                  <div className={styles.stepBody}>
                    <div className={styles.stepTop}>
                      <span className={styles.stepLabel}>{step.label}</span>
                      <span className={styles.stepDate}>{step.date}</span>
                    </div>
                    <p className={styles.stepDesc}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order details */}
          <div className={styles.sideCol}>

            <div className={styles.card}>
              <p className={styles.cardTitle}>Order Summary</p>
              <div className={styles.summaryRows}>
                {[
                  { label: 'Product',   val: order.name },
                  { label: 'Category',  val: order.category },
                  { label: 'Amount',    val: `₹${order.price.toLocaleString()}`, accent: true },
                  { label: 'Order ID',  val: order.tracking },
                  { label: 'Date',      val: order.date },
                ].map(r => (
                  <div key={r.label} className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>{r.label}</span>
                    <span className={styles.summaryVal} style={r.accent ? { color: '#00ffa3', fontFamily: "'Syne', sans-serif", fontWeight: 700 } : {}}>{r.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.card}>
              <p className={styles.cardTitle}>Delivery Address</p>
              <div className={styles.addressBox}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5a7070" strokeWidth="1.8" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <p className={styles.addressText}>{order.address}</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
