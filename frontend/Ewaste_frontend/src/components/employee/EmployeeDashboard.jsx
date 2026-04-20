import { NavLink } from 'react-router-dom'
import EmployeeNav from './EmployeeNav'
import styles from '../../css/employee/employeeDashboard.module.css'

const STATUS_CFG = {
  pending:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)'  },
  picked_up: { color: '#00c8ff', bg: 'rgba(0,200,255,0.08)',   border: 'rgba(0,200,255,0.2)'   },
  delivered: { color: '#00ffa3', bg: 'rgba(0,255,163,0.08)',   border: 'rgba(0,255,163,0.2)'   },
  cancelled: { color: '#f472b6', bg: 'rgba(244,114,182,0.08)', border: 'rgba(244,114,182,0.2)' },
}

const STAT_CARDS = [
  { label: 'Total Assigned', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg> },
  { label: 'Pending',        color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
  { label: 'Picked Up',      color: '#00c8ff', bg: 'rgba(0,200,255,0.1)',   icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> },
  { label: 'Delivered',      color: '#00ffa3', bg: 'rgba(0,255,163,0.1)',   icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg> },
]

export default function EmployeeDashboard() {
  return (
    <div className={styles.shell}>

      <EmployeeNav />

      <div className={styles.main}>
        <header className={styles.topbar}>
          <div>
            <h1 className={styles.pageTitle}>My Dashboard</h1>
            <p className={styles.pageDate}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </header>

        <div className={styles.body}>

          {/* Welcome */}
          <div className={styles.welcome}>
            <div>
              <p className={styles.welcomeGreeting}>Welcome back</p>
              <p className={styles.welcomeSub}>Here is an overview of your assigned tasks.</p>
            </div>
            <NavLink to="/employee/tasks" className={styles.welcomeBtn}>Go to My Tasks</NavLink>
          </div>

          {/* Stats */}
          <div className={styles.statsGrid}>
            {STAT_CARDS.map(({ label, color, bg, icon }) => (
              <div key={label} className={styles.statCard}>
                <div className={styles.statTop}>
                  <p className={styles.statLabel}>{label}</p>
                  <div className={styles.statIcon} style={{ background: bg, color }}>{icon}</div>
                </div>
                <p className={styles.statVal} style={{ color }}>0</p>
              </div>
            ))}
          </div>

          {/* Two col */}
          <div className={styles.twoCol}>

            {/* Completion ring */}
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.cardTitle}>Task Completion</span>
                <span className={styles.cardSub}>0% done</span>
              </div>
              <div className={styles.completionWrap}>
                <div className={styles.completionRing}>
                  <svg viewBox="0 0 100 100" width="120" height="120">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10"/>
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#00ffa3" strokeWidth="10"
                      strokeDasharray="0 251.3" strokeLinecap="round" transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className={styles.ringLabel}>
                    <span className={styles.ringPct}>0%</span>
                    <span className={styles.ringText}>Done</span>
                  </div>
                </div>
                <div className={styles.completionLegend}>
                  {[
                    { label: 'Delivered', color: '#00ffa3' },
                    { label: 'Picked Up', color: '#00c8ff' },
                    { label: 'Pending',   color: '#f59e0b' },
                  ].map(({ label, color }) => (
                    <div key={label} className={styles.legendRow}>
                      <span className={styles.legendDot} style={{ background: color }} />
                      <span className={styles.legendLabel}>{label}</span>
                      <span className={styles.legendVal}>0</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pending pickups */}
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.cardTitle}>Pending Pickups</span>
                <NavLink to="/employee/tasks" className={styles.viewAllBtn}>View All</NavLink>
              </div>
              <p className={styles.emptyCell}>No pending pickups</p>
            </div>

          </div>

          {/* Recent tasks table */}
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.cardTitle}>Recent Tasks</span>
              <NavLink to="/employee/tasks" className={styles.viewAllBtn}>View All</NavLink>
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {['ID', 'User', 'Device', 'Address', 'Qty', 'Status'].map(h => (
                      <th key={h} className={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr><td colSpan={6} className={styles.emptyCell}>No tasks assigned yet</td></tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
