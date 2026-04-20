import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import styles from '../../css/admin/dashboard.module.css'

const navClass = ({ isActive }) =>
  `${styles.sideNavItem} ${isActive ? styles.sideNavActive : ''}`

function Nav() {
  const navigate = useNavigate()
  let user=localStorage.getItem('token')
  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <div>
      <nav className={styles.sideNav}>

        <NavLink to="/admin" end className={navClass}>
          <span className={styles.sideNavIcon}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg></span>
          <span className={styles.sideNavLabel}>Dashboard</span>
        </NavLink>

        <NavLink to="/admin/users" className={navClass}>
          <span className={styles.sideNavIcon}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg></span>
          <span className={styles.sideNavLabel}>Users</span>
        </NavLink>

      

        <NavLink to="/admin/sell-requests" className={navClass}>
          <span className={styles.sideNavIcon}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 17H5a2 2 0 00-2 2v0a2 2 0 002 2h14a2 2 0 002-2v0a2 2 0 00-2-2h-4"/><path d="M12 3v14"/><path d="M8 7l4-4 4 4"/></svg></span>
          <span className={styles.sideNavLabel}>Sell Requests</span>
        </NavLink>

        <NavLink to="/admin/orders" className={navClass}>
          <span className={styles.sideNavIcon}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg></span>
          <span className={styles.sideNavLabel}>Orders</span>
        </NavLink>

        <NavLink to="/admin/products" className={navClass}>
          <span className={styles.sideNavIcon}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg></span>
          <span className={styles.sideNavLabel}>Products</span>
        </NavLink>

        <NavLink to="/admin/recycling-center" className={navClass}>
          <span className={styles.sideNavIcon}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15"/></svg></span>
          <span className={styles.sideNavLabel}>Recycling Center</span>
        </NavLink>

        

        <NavLink to="/admin/employees" className={navClass}>
          <span className={styles.sideNavIcon}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg></span>
          <span className={styles.sideNavLabel}>Employees</span>
        </NavLink>
          {user&&(
          <button className={styles.sideNavItem} onClick={handleLogout} style={{ marginTop: 'auto', color: '#f472b6' }}>
          <span className={styles.sideNavIcon}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></span>
          <span className={styles.sideNavLabel}>Logout</span>
        </button>
          )}
      

      </nav>
    </div>
  )
}

export default Nav