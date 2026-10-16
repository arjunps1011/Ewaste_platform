import { NavLink, useNavigate } from 'react-router-dom'
import styles from '../../css/recycle_center/recycleDashboard.module.css'

const navClass = ({ isActive }) =>
  `${styles.navItem} ${isActive ? styles.navActive : ''}`

export default function RecycleNav() {
  const navigate = useNavigate()

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarLogo}>
        <span className={styles.logoText}>E<em>Waste</em></span>
        <span className={styles.logoSub}>Recycle Center</span>
      </div>

      <nav className={styles.sideNav}>
        <NavLink to="/recycle" end className={navClass}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
          Dashboard
        </NavLink>

        <NavLink to="/recycle/items" className={navClass}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
          Received Items
        </NavLink>

        <NavLink to="/recycle/technician" className={navClass}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>
          My Assignments
        </NavLink>

        <button className={styles.logoutBtn} onClick={() => { localStorage.removeItem('token'); navigate('/') }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Logout
        </button>
      </nav>
    </aside>
  )
}
