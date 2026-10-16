import { useEffect, useState } from 'react'
import Nav from './Nav'
import styles from '../../css/admin/dashboard.module.css'
import p from '../../css/admin/Employee.module.css'
import axios from 'axios'

const emptyForm = {
  EmployeeName: '',
  JoiningDate: '',
  DateOfBirth: '',
  Gender: '',
  EmergencyContact: '',
  Salary: '',
  EmploymentStatus: 'active',
  Qualification: '',
  Designaion: '',

  ProfileImage: null,
}

export default function AdminEmployees() {
  const BASE_URL = import.meta.env.VITE_API_URL
  const [employees, setEmployees] = useState([])
  const [designations, setDesignations] = useState([])
  const [designationQuery, setDesignationQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [saving, setSaving] = useState(false)

  const authConfig = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })

  const getEmployees = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Admin/Employees/`, authConfig())
      setEmployees(response.data)
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Could not load employees.')
    }
  }

  const getDesignations = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Admin/Designations/`, authConfig())
      setDesignations(response.data)
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Could not load designations.')
    }
  }

  useEffect(() => {
    getEmployees()
    getDesignations()
  }, [])

  const openCreateForm = () => {
    setEditingEmployee(null)
    setForm({ ...emptyForm })
    setDesignationQuery('')
    setErrorMessage('')
    setShowForm(true)
  }

  const openEditForm = (employee) => {
    setEditingEmployee(employee)
    setForm({
      ...emptyForm,
      ...employee,
      Designaion: employee.Designaion_id ?? '',
      JoiningDate: employee.JoiningDate || '',
      DateOfBirth: employee.DateOfBirth || '',
      Salary: employee.Salary ?? '',
      ProfileImage: null,
    })
    setDesignationQuery(employee.DesingationName || '')
    setErrorMessage('')
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingEmployee(null)
    setErrorMessage('')
  }

  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setErrorMessage('')

    const payload = new FormData()
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'Designaion') return
      if (value !== '' && value !== null && value !== undefined) payload.append(key, value)
    })
    if (form.Designaion) payload.append('Designaion', form.Designaion)

    try {
      if (editingEmployee) {
        await axios.patch(`${BASE_URL}/Admin/EmployeeUpdate/${editingEmployee.id}/`, payload, authConfig())
      } else {
        await axios.post(`${BASE_URL}/Admin/EmployeeCreate/`, payload, authConfig())
      }
      await getEmployees()
      setSuccessMessage(editingEmployee ? 'Employee updated successfully.' : 'Employee created successfully.')
      closeForm()
    } catch (error) {
      const details = error.response?.data
      setErrorMessage(typeof details === 'string' ? details : JSON.stringify(details || { message: 'Could not save employee.' }))
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
            <h1 className={styles.pageTitle}>Employees</h1>
            <p className={styles.pageDate}>Manage employee records</p>
          </div>
          <div className={styles.topbarRight}>
            <button onClick={openCreateForm} className={p.addBtn}>Add Employee</button>
          </div>
        </header>

        <div className={styles.body}>
          {successMessage && <p className={p.successMsg}>{successMessage}</p>}
          {errorMessage && !showForm && <p className={p.failMsg}>{errorMessage}</p>}

          <div className={p.summaryGrid}>
            <div className={`${styles.statCard} ${p.summaryCard}`}>
              <p className={styles.statLabel}>Total Employees</p>
              <p className={styles.statVal}>{employees.length}</p>
            </div>
            <div className={`${styles.statCard} ${p.summaryCard}`}>
              <p className={styles.statLabel}>Active</p>
              <p className={styles.statVal}>{employees.filter(employee => employee.EmploymentStatus === 'active').length}</p>
            </div>
            <div className={`${styles.statCard} ${p.summaryCard}`}>
              <p className={styles.statLabel}>Inactive</p>
              <p className={styles.statVal}>{employees.filter(employee => employee.EmploymentStatus !== 'active').length}</p>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.cardTitle}>Employee records</span>
              <span className={styles.cardSub}>{employees.length} total</span>
            </div>
            <div className={p.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>ID</th>
                    <th className={styles.th}>Name</th>
                    <th className={styles.th}>Emergency contact</th>
                    <th className={styles.th}>Desgination</th>
                    <th className={styles.th}>Joining date</th>
                    <th className={styles.th}>Status</th>
                    <th className={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.length === 0 ? (
                    <tr><td colSpan={6} className={p.emptyCell}>No employees found.</td></tr>
                  ) : employees.map(employee => (
                      <tr key={employee.id} className={styles.tr}>
                        <td className={styles.tdMono}>{employee.id}</td>
                        <td className={styles.td}>{employee.EmployeeName || '—'}</td>
                        <td className={styles.tdMuted}>{employee.EmergencyContact || '—'}</td>
                        <td className={styles.tdMuted}>{employee.DesingationName || '—'}</td>
                        <td className={styles.tdMuted}>{employee.JoiningDate || '—'}</td>
                        <td className={styles.td}>{employee.EmploymentStatus}</td>
                        <td className={styles.td}>
                          <button className={p.addBtn} onClick={() => openEditForm(employee)}>Edit</button>
                        </td>
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
          <form className={`${p.modal} ${p.addModal} ${p.employeeModal}`} onSubmit={submit} onClick={event => event.stopPropagation()}>
            <div className={p.modalHeader}>
              <div>
                <h2 className={p.modalTitle}>{editingEmployee ? 'Update Employee' : 'Create Employee'}</h2>
                <span className={p.modalId}>Enter the employee record details</span>
              </div>
              <button type="button" className={p.closeBtn} onClick={closeForm} aria-label="Close">×</button>
            </div>

            <div className={`${p.modalForm} ${p.employeeFormGrid}`}>
              <div className={p.fieldGroup}>
                <label className={p.fieldLabel} htmlFor="employee-EmployeeName">Employee name</label>
                <input id="employee-EmployeeName" className={p.fieldInput} type="text" name="EmployeeName" value={form.EmployeeName} onChange={event => setForm(current => ({ ...current, EmployeeName: event.target.value }))} />
              </div>

              <div className={p.fieldGroup}>
                <label className={p.fieldLabel} htmlFor="employee-JoiningDate">Joining date</label>
                <input id="employee-JoiningDate" className={p.fieldInput} type="date" name="JoiningDate" value={form.JoiningDate} required onChange={event => setForm(current => ({ ...current, JoiningDate: event.target.value }))} />
              </div>

              <div className={p.fieldGroup}>
                <label className={p.fieldLabel} htmlFor="employee-DateOfBirth">Date of birth</label>
                <input id="employee-DateOfBirth" className={p.fieldInput} type="date" name="DateOfBirth" value={form.DateOfBirth} onChange={event => setForm(current => ({ ...current, DateOfBirth: event.target.value }))} />
              </div>

              <div className={p.fieldGroup}>
                <label className={p.fieldLabel} htmlFor="employee-EmergencyContact">Emergency contact</label>
                <input id="employee-EmergencyContact" className={p.fieldInput} type="tel" name="EmergencyContact" value={form.EmergencyContact} onChange={event => setForm(current => ({ ...current, EmergencyContact: event.target.value }))} />
              </div>

              <div className={p.fieldGroup}>
                <label className={p.fieldLabel} htmlFor="employee-Salary">Salary</label>
                <input id="employee-Salary" className={p.fieldInput} type="number" name="Salary" value={form.Salary} min="0" step="0.01" required onChange={event => setForm(current => ({ ...current, Salary: event.target.value }))} />
              </div>

              <div className={p.fieldGroup}>
                <label className={p.fieldLabel} htmlFor="employee-Qualification">Qualification</label>
                <input id="employee-Qualification" className={p.fieldInput} type="text" name="Qualification" value={form.Qualification} onChange={event => setForm(current => ({ ...current, Qualification: event.target.value }))} />
              </div>

              <div className={p.fieldGroup}>
                <label className={p.fieldLabel} htmlFor="employee-Designation">Designation</label>
                <input
                  id="employee-Designation"
                  className={p.fieldInput}
                  type="text"
                  list="employee-designation-options"
                  autoComplete="off"
                  placeholder="Search designation"
                  value={designationQuery}
                  onChange={event => {
                    const value = event.target.value
                    const match = designations.find(item => item.DesignationName?.toLowerCase() === value.trim().toLowerCase())
                    setDesignationQuery(value)
                    setForm(current => ({ ...current, Designaion: match?.id || '' }))
                  }}
                />
                <datalist id="employee-designation-options">
                  {designations.map(item => <option key={item.id} value={item.DesignationName || ''}>{item.DisgnationCode ? `Code ${item.DisgnationCode}` : ''}</option>)}
                </datalist>
              </div>

              <div className={p.fieldGroup}>
                <label className={p.fieldLabel} htmlFor="employee-Gender">Gender</label>
                <select id="employee-Gender" className={p.fieldSelect} value={form.Gender} onChange={event => setForm(current => ({ ...current, Gender: event.target.value }))}>
                  <option value="">Select gender</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>

              <div className={p.fieldGroup}>
                <label className={p.fieldLabel} htmlFor="employee-EmploymentStatus">Employment status</label>
                <select id="employee-EmploymentStatus" className={p.fieldSelect} value={form.EmploymentStatus} onChange={event => setForm(current => ({ ...current, EmploymentStatus: event.target.value }))}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on_leave">On leave</option>
                </select>
              </div>

              <div className={p.fieldGroup}>
                <label className={p.fieldLabel} htmlFor="employee-ProfileImage">Profile image</label>
                <input id="employee-ProfileImage" className={p.fieldInput} type="file" accept="image/*" onChange={event => setForm(current => ({ ...current, ProfileImage: event.target.files?.[0] || null }))} />
              </div>
            </div>

            {errorMessage && <p className={p.failMsg}>{errorMessage}</p>}
            <div className={p.modalFoot}>
              <button type="button" onClick={closeForm} className={p.cancelBtn}>Cancel</button>
              <button type="submit" className={p.submitBtn} disabled={saving}>{saving ? 'Saving…' : editingEmployee ? 'Update Employee' : 'Create Employee'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
