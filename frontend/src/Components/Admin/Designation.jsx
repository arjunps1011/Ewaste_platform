import { useEffect, useState } from 'react'
import axios from 'axios'
import Nav from './Nav'
import styles from '../../css/admin/dashboard.module.css'
import p from '../../css/admin/Employee.module.css'

export default function AdminDesignations() {
  const BASE_URL = import.meta.env.VITE_API_URL
  const [designations, setDesignations] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingDesignation, setEditingDesignation] = useState(null)
  const [designationName, setDesignationName] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [saving, setSaving] = useState(false)

  const authConfig = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
  const nextCode = () => {
    const highest = designations.reduce((max, designation) => {
      const code = Number.parseInt(designation.DisgnationCode, 10)
      return Number.isFinite(code) ? Math.max(max, code) : max
    }, 0)
    return String(highest + 1)
  }

  const getDesignations = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Admin/Designations/`, authConfig())
      setDesignations(response.data)
      setErrorMessage('')
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Could not load designations.')
    }
  }

  useEffect(() => {
    getDesignations()
  }, [])

  const openForm = () => {
    setEditingDesignation(null)
    setDesignationName('')
    setSuccessMessage('')
    setErrorMessage('')
    setShowForm(true)
  }

  const openEditForm = (designation) => {
    setEditingDesignation(designation)
    setDesignationName(designation.DesignationName || '')
    setSuccessMessage('')
    setErrorMessage('')
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingDesignation(null)
    setErrorMessage('')
  }

  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setErrorMessage('')
    try {
      if (editingDesignation) {
        await axios.patch(`${BASE_URL}/Admin/DesignationUpdate/${editingDesignation.id}/`, { DesignationName: designationName }, authConfig())
      } else {
        await axios.post(`${BASE_URL}/Admin/DesignationCreate/`, { DesignationName: designationName }, authConfig())
      }
      await getDesignations()
      setSuccessMessage(editingDesignation ? 'Designation updated successfully.' : 'Designation created successfully.')
      closeForm()
    } catch (error) {
      const details = error.response?.data
      setErrorMessage(typeof details === 'string' ? details : JSON.stringify(details || { message: 'Could not save designation.' }))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.shell}>
      <Nav />
      <div className={styles.main}>
        <header className={styles.topbar}>
          <div>
            <h1 className={styles.pageTitle}>Designations</h1>
            <p className={styles.pageDate}>Manage employee designations</p>
          </div>
          <div className={styles.topbarRight}>
            <button onClick={openForm} className={p.addBtn}>Add Designation</button>
          </div>
        </header>

        <div className={styles.body}>
          {successMessage && <p className={p.successMsg}>{successMessage}</p>}
          {errorMessage && !showForm && <p className={p.failMsg}>{errorMessage}</p>}

          <div className={p.summaryGrid}>
            <div className={`${styles.statCard} ${p.summaryCard}`}>
              <p className={styles.statLabel}>Total Designations</p>
              <p className={styles.statVal}>{designations.length}</p>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.cardTitle}>Designation records</span>
              <span className={styles.cardSub}>{designations.length} total</span>
            </div>
            <div className={p.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>ID</th>
                    <th className={styles.th}>Designation code</th>
                    <th className={styles.th}>Designation name</th>
                    <th className={styles.th}>Created</th>
                    <th className={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {designations.length === 0 ? (
                    <tr><td colSpan={5} className={p.emptyCell}>No designations found.</td></tr>
                  ) : designations.map(designation => (
                    <tr key={designation.id} className={styles.tr}>
                      <td className={styles.tdMono}>{designation.id}</td>
                      <td className={styles.tdMono}>{designation.DisgnationCode || '—'}</td>
                      <td className={styles.td}>{designation.DesignationName || '—'}</td>
                      <td className={styles.tdMuted}>{designation.CreatedAt || '—'}</td>
                      <td className={styles.td}><button type="button" className={p.addBtn} onClick={() => openEditForm(designation)}>Edit</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className={p.overlay} onClick={closeForm}>
          <form className={`${p.modal} ${p.addModal}`} onSubmit={submit} onClick={event => event.stopPropagation()}>
            <div className={p.modalHeader}>
              <div>
                <h2 className={p.modalTitle}>{editingDesignation ? 'Update Designation' : 'Create Designation'}</h2>
                <span className={p.modalId}>Enter the designation details</span>
              </div>
              <button type="button" className={p.closeBtn} onClick={closeForm} aria-label="Close">×</button>
            </div>

            <div className={p.modalForm}>
              <div className={p.fieldGroup}>
                <label className={p.fieldLabel} htmlFor="designation-code">Designation code{editingDesignation ? '' : ' (generated)'}</label>
                <input id="designation-code" className={p.fieldInput} value={editingDesignation ? (editingDesignation.DisgnationCode || '') : nextCode()} readOnly />
              </div>
              <div className={p.fieldGroup}>
                <label className={p.fieldLabel} htmlFor="designation-name">Designation name</label>
                <input id="designation-name" className={p.fieldInput} type="text" value={designationName} required maxLength={100} onChange={event => setDesignationName(event.target.value)} />
              </div>
            </div>

            {errorMessage && <p className={p.failMsg}>{errorMessage}</p>}
            <div className={p.modalFoot}>
              <button type="button" onClick={closeForm} className={p.cancelBtn}>Cancel</button>
              <button type="submit" className={p.submitBtn} disabled={saving}>{saving ? 'Saving…' : editingDesignation ? 'Update Designation' : 'Create Designation'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
