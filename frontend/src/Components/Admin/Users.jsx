import { useState,useEffect } from 'react'
import Nav from './Nav'
import styles from '../../css/admin/dashboard.module.css'
import u from '../../css/admin/Users.module.css'
import axios from 'axios'

const STATUS_CFG = {
  Active:   { color: '#00ffa3', bg: 'rgba(0,255,163,0.08)',   border: 'rgba(0,255,163,0.2)'   },
  Inactive: { color: '#f472b6', bg: 'rgba(244,114,182,0.08)', border: 'rgba(244,114,182,0.2)' },
}


function initials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function AdminUsers() {
  const BASE_URL = import.meta.env.VITE_API_URL
  const [USERS, setUSERS] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortDesc, setSortDesc]       = useState(true)
  const [viewModal, setViewModal] = useState(false)
  const [toggleModal, setToggleModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [createModal, setCreateModal] = useState(false)
  const [roles, setRoles] = useState([])
  const [roleQuery, setRoleQuery] = useState('')
  const [form, setForm] = useState({ Name: '', Email: '', Phone: '', Address: '', Password: '', Role: '' })
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const authConfig = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })

  const fetch_users=async()=>{
    try{
        let res=await axios.get(`${BASE_URL}/Admin/UsersReports/`,{headers:{'Authorization':`Bearer ${localStorage.getItem('token')}`}})
        setUSERS(res.data)
        setFiltered(res.data)
        console.log(res.data);
        
    }
    catch(er){
      console.log(er.response?.data?.message)
    }
  }

  useEffect(()=>{
      fetch_users()
    },[])

  const openCreate = async () => {
    setForm({ Name: '', Email: '', Phone: '', Address: '', Password: '', Role: '' })
    setRoleQuery('')
    setErrorMessage('')
    try {
      const response = await axios.get(`${BASE_URL}/Admin/Roles/`, authConfig())
      setRoles(response.data)
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Could not load roles.')
    }
    setCreateModal(true)
  }

  const createUser = async event => {
    event.preventDefault()
    if (!roles.some(role => role.RoleName === form.Role)) {
      setErrorMessage('Select a role from the dropdown.')
      return
    }
    setSaving(true)
    setErrorMessage('')
    try {
      await axios.post(`${BASE_URL}/Admin/UserCreate/`, form, authConfig())
      await fetch_users()
      setCreateModal(false)
      setSuccessMessage('User created successfully.')
    } catch (error) {
      const details = error.response?.data
      setErrorMessage(typeof details === 'string' ? details : Object.entries(details || {}).map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`).join(' '))
    } finally {
      setSaving(false)
    }
  }
    
  const handleSearch = (value) => {
    setSearch(value)
    let list = [...USERS]
    if (statusFilter !== 'All') list = list.filter(u => u.status === statusFilter)
    if (value) {
      list = list.filter(u =>
        (u.Name || '').toLowerCase().includes(value.toLowerCase()) ||
        (u.Email || '').toLowerCase().includes(value.toLowerCase()) ||
        String(u.Phone || '').includes(value)
      )
    }
    setFiltered(list)
  }

  return (
    <div className={styles.shell}>
      <Nav />

      <div className={styles.main}>

        <header className={styles.topbar}>
          <div>
            <h1 className={styles.pageTitle}>Users Management</h1>
            <p className={styles.pageDate}>View, manage, and update all platform users</p>
          </div>
          <div className={styles.topbarRight}>
            <button className={u.activateBtn} onClick={openCreate}>Add User</button>
            <button className={styles.notifBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
              <span className={styles.notifDot} />
            </button>
          </div>
        </header>

        <div className={styles.body}>
          {successMessage && <p className={u.userSuccess}>{successMessage}</p>}

          {/* Summary */}
          <div className={u.statsGrid}>
            <div className={styles.statCard}><p className={styles.statLabel}>Total Users</p><p className={styles.statVal}>{USERS.length}</p></div>
          </div>

          {/* Toolbar */}
          <div className={u.toolbar}>
            <div className={u.searchWrap}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                className={u.searchInput}
                placeholder="Search by name, email, or phone..."
                value={search}
                onChange={e => handleSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.cardTitle}>All Users</span>
              <span className={styles.cardSub}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
            </div>
            <div className={u.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>User ID</th>
                    <th className={styles.th}>Name</th>
                    <th className={styles.th}>Email</th>
                    <th className={styles.th}>Phone</th>
                    <th className={styles.th}>Role</th>
                    <th className={styles.th}>Total Sold</th>
                    <th className={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0
                    ? <tr><td colSpan={7} className={u.emptyCell}>No users match your filters.</td></tr>
                    : filtered.map(usr => (
                        <tr key={usr.id} className={styles.tr}>
                          <td className={styles.tdMono}>{usr.id}</td>
                          <td className={styles.td}>
                            <div className={u.nameCell}>
                              <div className={u.avatar}>{initials(usr.Name || '')}</div>
                              <span style={{ fontWeight: 600 }}>{usr.Name}</span>
                            </div>
                          </td>
                          <td className={styles.tdMuted}>{usr.Email}</td>
                          <td className={styles.tdMuted}>{usr.Phone}</td>
                          <td className={styles.tdMuted}>{usr.Role}</td>
                          <td className={styles.tdAccent}>{usr.soldItems}</td>
                        
                          <td className={styles.td}>
                            <div className={u.actions}>
                              <button className={u.viewBtn} onClick={() => { setSelected(usr); setViewModal(true) }}>View</button>
                             
                            </div>
                          </td>
                        </tr>
                      ))
                  }
                </tbody>
              </table>
            </div>


          </div>

        </div>
      </div>

      {createModal && (
        <div className={u.overlay} onClick={() => setCreateModal(false)}>
          <form className={u.modalSm} onSubmit={createUser} onClick={event => event.stopPropagation()}>
            <div className={u.modalHead}>
              <div><h2 className={u.modalTitle}>Create User</h2><span className={u.modalSub}>Add a user account</span></div>
              <button type="button" className={u.closeBtn} onClick={() => setCreateModal(false)} aria-label="Close">×</button>
            </div>
            <div className={u.modalSmBody}>
              {['Name', 'Email', 'Phone', 'Address', 'Password'].map(field => (
                <label className={u.formGroup} key={field}>
                  <span className={u.label}>{field}</span>
                  <input className={u.input} type={field === 'Password' ? 'password' : field === 'Email' ? 'email' : 'text'} required={field === 'Name' || field === 'Email' || field === 'Password'} minLength={field === 'Password' ? 8 : undefined} autoComplete={field === 'Password' ? 'new-password' : undefined} value={form[field]} onChange={event => setForm(current => ({ ...current, [field]: event.target.value }))} />
                </label>
              ))}
              <label className={u.formGroup}>
                <span className={u.label}>Role</span>
                <div className={u.roleAutocomplete}>
                  <input className={u.input} type="text" autoComplete="off" placeholder="Search and select a role" value={roleQuery} required onChange={event => {
                    const value = event.target.value
                    const match = roles.find(role => role.RoleName?.toLowerCase() === value.trim().toLowerCase())
                    setRoleQuery(value)
                    setForm(current => ({ ...current, Role: match?.RoleName || '' }))
                  }} />
                  {roleQuery && form.Role !== roleQuery && <div className={u.roleOptions}>
                    {roles.filter(role => role.RoleName?.toLowerCase().includes(roleQuery.toLowerCase())).map(role => <button type="button" key={role.id} className={u.roleOption} onClick={() => { setRoleQuery(role.RoleName); setForm(current => ({ ...current, Role: role.RoleName })) }}>{role.RoleName}</button>)}
                  </div>}
                </div>
              </label>
              {errorMessage && <p className={u.userError}>{errorMessage}</p>}
            </div>
            <div className={u.modalFoot}><button type="button" className={u.cancelBtn} onClick={() => setCreateModal(false)}>Cancel</button><button className={u.saveBtn} disabled={saving}>{saving ? 'Creating…' : 'Create User'}</button></div>
          </form>
        </div>
      )}

      {/* ── View Profile Modal ── */}
      {viewModal && selected && (
        <div className={u.overlay} onClick={() => setViewModal(false)}>
          <div className={u.modal} onClick={e => e.stopPropagation()}>
            <div className={u.modalHead}>
              <div>
                <h2 className={u.modalTitle}>{selected.name}</h2>
                <span className={u.modalSub}>{selected.id}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button className={u.closeBtn} onClick={() => setViewModal(false)}>✕</button>
              </div>
            </div>

            <div className={u.modalBody}>
              <div className={u.modalCol}>
                <div className={u.section}>
                  <p className={u.sectionTitle}>User Details</p>
                  <div className={u.infoGrid}>
                    <span className={u.infoKey}>Name</span>   <span className={u.infoVal}>{selected.name}</span>
                    <span className={u.infoKey}>Email</span>  <span className={u.infoVal}>{selected.email}</span>
                    <span className={u.infoKey}>Phone</span>  <span className={u.infoVal}>{selected.phone}</span>
                    <span className={u.infoKey}>City</span>   <span className={u.infoVal}>{selected.city}</span>
                    <span className={u.infoKey}>Role</span>   <span className={u.infoVal}>{selected.role}</span>
                    <span className={u.infoKey}>Joined</span> <span className={u.infoVal}>{selected.joined}</span>
                  </div>
                </div>
                <div className={u.section}>
                  <p className={u.sectionTitle}>Eco Impact</p>
                  <div className={u.ecoBar}>
                    <div className={u.ecoItem}><span className={u.ecoLabel}>CO₂ Saved</span><span className={u.ecoVal}>{selected.eco.co2}</span></div>
                    <div className={u.ecoItem}><span className={u.ecoLabel}>Devices Recycled</span><span className={u.ecoVal}>{selected.eco.devices}</span></div>
                    <div className={u.ecoItem}><span className={u.ecoLabel}>Eco Points</span><span className={u.ecoVal}>{selected.eco.points} pts</span></div>
                  </div>
                </div>
              </div>
              <div className={u.modalCol}>
                <div className={u.section}>
                  <p className={u.sectionTitle}>Order History ({selected.history.length})</p>
                  {selected.history.length === 0
                    ? <p style={{ fontSize: '0.8rem', color: '#3a5050', margin: 0 }}>No orders yet.</p>
                    : <div className={u.historyList}>
                        {selected.history.map((h, i) => (
                          <div key={i} className={u.historyItem}>
                            <div>
                              <p className={u.historyDevice}>{h.device}</p>
                              <p className={u.historyMeta}>{h.date}</p>
                            </div>
                            <span
                              className={styles.pill}
                              style={{ color: '#00ffa3', background: 'rgba(0,255,163,0.08)', border: '1px solid rgba(0,255,163,0.2)' }}
                            >
                              {h.status}
                            </span>
                          </div>
                        ))}
                      </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Activate / Deactivate Confirm Modal ── */}
      {toggleModal && selected && (
        <div className={u.overlay} onClick={() => setToggleModal(false)}>
          <div className={u.modalSm} onClick={e => e.stopPropagation()}>
            <div className={u.modalHead}>
              <div>
                <h2 className={u.modalTitle}>{selected.status === 'Active' ? 'Deactivate' : 'Activate'} User</h2>
                <span className={u.modalSub}>{selected.id}</span>
              </div>
              <button className={u.closeBtn} onClick={() => setToggleModal(false)}>✕</button>
            </div>
            <div className={u.modalSmBody}>
              <div className={u.confirmCard}>
                <div className={u.avatar} style={{ width: 44, height: 44, fontSize: '0.9rem' }}>{initials(selected.name)}</div>
                <p className={u.confirmText}>
                  You are about to <strong>{selected.status === 'Active' ? 'deactivate' : 'activate'}</strong> the account of <strong>{selected.name}</strong>.
                  {selected.status === 'Active'
                    ? ' This will prevent them from logging in or using the platform.'
                    : ' This will restore their access to the platform.'}
                </p>
              </div>
            </div>
            <div className={u.modalFoot}>
              <button className={u.cancelBtn} onClick={() => setToggleModal(false)}>Cancel</button>
              {selected.status === 'Active'
                ? <button className={u.dangerBtn} onClick={() => setToggleModal(false)}>Deactivate</button>
                : <button className={u.saveBtn} onClick={() => setToggleModal(false)}>Activate</button>
              }
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
