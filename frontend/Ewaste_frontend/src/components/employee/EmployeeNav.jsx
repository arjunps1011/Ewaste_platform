import { NavLink, useNavigate } from 'react-router-dom'
import styles from '../../css/employee/employeeDashboard.module.css'

const navClass = ({ isActive }) =>
  `${styles.navItem} ${isActive ? styles.navActive : ''}`

export default function EmployeeNav() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarLogo}>
        <span className={styles.logoText}>E<em>Waste</em></span>
        <span className={styles.logoSub}>Employee</span>
      </div>

      <nav className={styles.sideNav}>
        <NavLink to="/employee" end className={navClass}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
          Dashboard
        </NavLink>

        <NavLink to="/employee/tasks" className={navClass}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
          Assigned Tasks
        </NavLink>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Logout
        </button>
      </nav>
    </aside>
  )
}
