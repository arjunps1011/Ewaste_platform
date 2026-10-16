import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import Nav from './Nav'
import styles from '../../css/admin/dashboard.module.css'
import u from '../../css/admin/adminUsers.module.css'

const emptyForm = { RoleName: '' }

export default function AdminRoles() {
  const BASE_URL = import.meta.env.VITE_API_URL
  const [roles, setRoles] = useState([])
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const authConfig = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
  const fetchRoles = useCallback(async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${BASE_URL}/Admin/Roles/`, authConfig)
      setRoles(response.data)
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load roles.')
    } finally {
      setLoading(false)
    }
  }, [BASE_URL])

  useEffect(() => { fetchRoles() }, [fetchRoles])

  const openCreate = () => {
    setSelected(null)
    setForm(emptyForm)
    setError('')
    setModalOpen(true)
  }

  const openEdit = role => {
    setSelected(role)
    setForm({ RoleName: role.RoleName || '' })
    setError('')
    setModalOpen(true)
  }

  const saveRole = async event => {
    event.preventDefault()
    const name = form.RoleName.trim()
    if (!name) {
      setError('Role name is required.')
      return
    }

    setSaving(true)
    setError('')
    try {
      if (selected) {
        await axios.patch(`${BASE_URL}/Admin/RoleUpdate/${selected.id}/`, { RoleName: name }, authConfig)
      } else {
        await axios.post(`${BASE_URL}/Admin/RoleCreate/`, { RoleName: name }, authConfig)
      }
      setModalOpen(false)
      await fetchRoles()
    } catch (err) {
      const data = err.response?.data
      setError(data?.RoleName?.[0] || data?.message || 'Could not save the role.')
    } finally {
      setSaving(false)
    }
  }

  const deleteRole = async role => {
    if (!window.confirm(`Delete the “${role.RoleName}” role?`)) return
    setError('')
    try {
      await axios.delete(`${BASE_URL}/Admin/RoleDelete/${role.id}/`, authConfig)
      await fetchRoles()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete the role.')
    }
  }

  const filteredRoles = roles.filter(role =>
    `${role.RoleCode || ''} ${role.RoleName || ''}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className={styles.shell}>
      <Nav />
      <main className={styles.main}>
        <header className={styles.topbar}>
          <div>
            <h1 className={styles.pageTitle}>Roles Management</h1>
            <p className={styles.pageDate}>Create and manage platform roles</p>
          </div>
          <button className={u.saveBtn} onClick={openCreate}>Add Role</button>
        </header>

        <div className={styles.body}>
          <div className={u.statsGrid}>
            <div className={styles.statCard}>
              <p className={styles.statLabel}>Total Roles</p>
              <p className={styles.statVal}>{roles.length}</p>
            </div>
          </div>

          <div className={u.toolbar}>
            <div className={u.searchWrap}>
              <input className={u.searchInput} aria-label="Search roles" placeholder="Search roles..." value={search} onChange={event => setSearch(event.target.value)} />
            </div>
          </div>

          {error && !modalOpen && <p role="alert" style={{ color: '#f472b6' }}>{error}</p>}
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.cardTitle}>All Roles</span>
              <span className={styles.cardSub}>{filteredRoles.length} result{filteredRoles.length === 1 ? '' : 's'}</span>
            </div>
            <div className={u.tableWrap}>
              <table className={styles.table}>
                <thead><tr><th className={styles.th}>Role ID</th><th className={styles.th}>Role Code</th><th className={styles.th}>Role Name</th><th className={styles.th}>Created</th><th className={styles.th}>Updated</th><th className={styles.th}>Actions</th></tr></thead>
                <tbody>
                  {loading ? <tr><td colSpan={6} className={u.emptyCell}>Loading roles...</td></tr>
                    : filteredRoles.length === 0 ? <tr><td colSpan={6} className={u.emptyCell}>No roles found.</td></tr>
                      : filteredRoles.map(role => <tr key={role.id} className={styles.tr}>
                        <td className={styles.tdMono}>{role.id}</td>
                        <td className={styles.tdMono}>{role.RoleCode || '—'}</td>
                        <td className={styles.td}>{role.RoleName}</td>
                        <td className={styles.tdMuted}>{role.CreatedAt || '—'}</td>
                        <td className={styles.tdMuted}>{role.UpdatedAt || '—'}</td>
                        <td className={styles.td}><div className={u.actions}>
                          <button className={u.editBtn} onClick={() => openEdit(role)}>Edit</button>
                          <button className={u.deactivateBtn} onClick={() => deleteRole(role)}>Delete</button>
                        </div></td>
                      </tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {modalOpen && <div className={u.overlay} onMouseDown={event => { if (event.target === event.currentTarget) setModalOpen(false) }}>
        <form className={u.modalSm} onSubmit={saveRole}>
          <div className={u.modalHead}><div><h2 className={u.modalTitle}>{selected ? 'Edit Role' : 'Create Role'}</h2><span className={u.modalSub}>{selected ? `Role #${selected.id}` : 'A role code will be generated automatically'}</span></div>
            <button type="button" className={u.closeBtn} aria-label="Close" onClick={() => setModalOpen(false)}>×</button></div>
          <div className={u.modalSmBody}>
            <label className={u.formGroup}><span className={u.label}>Role Name</span><input className={u.input} autoFocus maxLength={100} value={form.RoleName} onChange={event => setForm({ RoleName: event.target.value })} /></label>
            {error && <p role="alert" style={{ color: '#f472b6', margin: 0 }}>{error}</p>}
          </div>
          <div className={u.modalFoot}><button type="button" className={u.cancelBtn} onClick={() => setModalOpen(false)}>Cancel</button><button className={u.saveBtn} disabled={saving}>{saving ? 'Saving...' : selected ? 'Save Changes' : 'Create Role'}</button></div>
        </form>
      </div>}
    </div>
  )
}
