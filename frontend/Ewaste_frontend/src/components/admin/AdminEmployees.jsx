import { useState, useEffect } from 'react'
import Nav from './Nav'
import styles from '../../css/admin/dashboard.module.css'
import p from '../../css/admin/pickupAgents.module.css'
import axios from 'axios'

const ROLE_CFG = {
  'technician': { color: '#00c8ff', bg: 'rgba(0,200,255,0.08)', border: 'rgba(0,200,255,0.2)' },
  'collector':  { color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.2)' },
  'employee':   { color: '#00ffa3', bg: 'rgba(0,255,163,0.08)', border: 'rgba(0,255,163,0.2)' },
}

export default function AdminEmployees() {
  const BASE_URL = import.meta.env.VITE_API_URL
  const [employees, setEmployees] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', password: '', role: 'technician' })
  const [sucess_msg, setSucess_msg] = useState('')
  const [fail_msg, setFail_msg] = useState('')

  useEffect(() => {
    get_employees()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    try {
      let res = await axios.post(`${BASE_URL}/api/add_employee/`, { ...form, phone: Number(form.phone) }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      console.log(res.data)
      setSucess_msg('Employee added successfully')
      setFail_msg('')
      get_employees()
      setShowAdd(false)
    } catch(er) {
      console.log(er)
      setFail_msg(er.response?.data?.message || 'Something went wrong')
      setSucess_msg('')
    }
  }
  useEffect(()=>{
    get_employees()
  },[])

  const get_employees= async()=>{
    try{
       let res=await axios.get(`${BASE_URL}/api/get_employees/`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
        console.log(res.data);
        setEmployees(res.data)
    }
    catch(er){
      console.log(er.response?.data?.message)
    }
  }
  const delete_employee = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/delete_employee/${id}/`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      setEmployees(prev => prev.filter(e => e.id !== id))
    } catch(er) {
      console.log(er)
    }
  } 

  return (
    <div className={styles.shell}>
      <Nav />

      <div className={styles.main}>

        <header className={styles.topbar}>
          <div>
            <h1 className={styles.pageTitle}>Employees</h1>
            <p className={styles.pageDate}>View all technicians and collectors</p>
          </div>
          <div className={styles.topbarRight}>
            <button onClick={() => setShowAdd(true)} className={p.addBtn}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Employee
            </button>
            <button className={styles.notifBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
              <span className={styles.notifDot} />
            </button>
          </div>
        </header>

        <div className={styles.body}>

          <div className={p.summaryGrid}>
            <div className={`${styles.statCard} ${p.summaryCard}`}>
              <p className={styles.statLabel}>Total Employees</p>
              <p className={styles.statVal}>{employees.length}</p>
            </div>
            <div className={`${styles.statCard} ${p.summaryCard}`}>
              <p className={styles.statLabel}>Technicians</p>
              <p className={styles.statVal}>{employees.filter(e => e.role === 'technician').length}</p>
            </div>
            <div className={`${styles.statCard} ${p.summaryCard}`}>
              <p className={styles.statLabel}>Collectors</p>
              <p className={styles.statVal}>{employees.filter(e => e.role === 'collector').length}</p>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.cardTitle}>All Employees</span>
              <span className={styles.cardSub}>{employees.length} total</span>
            </div>
            <div className={p.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>ID</th>
                    <th className={styles.th}>Name</th>
                    <th className={styles.th}>Email</th>
                    <th className={styles.th}>Phone</th>
                    <th className={styles.th}>Address</th>
                    <th className={styles.th}>Role</th>
                    <th className={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.length === 0
                    ? <tr><td colSpan={6} className={p.emptyCell}>No employees found.</td></tr>
                    : employees.map(emp => {
                        const cfg = ROLE_CFG[emp.role] || ROLE_CFG['employee']
                        return (
                          <tr key={emp.id} className={styles.tr}>
                            <td className={styles.tdMono}>{emp.id}</td>
                            <td className={styles.td}>{emp.name}</td>
                            <td className={styles.tdMuted}>{emp.email}</td>
                            <td className={styles.tdMuted}>{emp.phone}</td>
                            <td className={styles.tdMuted}>{emp.address}</td>
                            <td className={styles.td}>
                              <span className={styles.pill} style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                                {emp.role}
                              </span>
                            </td>
                            <td className={styles.td}>
                              <button className={p.deleteBtn} onClick={() => delete_employee(emp.id)}>Delete</button>
                            </td>
                          </tr>
                        )
                      })
                  }
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {showAdd ? (
        <div className={p.overlay} onClick={() => setShowAdd(false)}>
          <div className={`${p.modal} ${p.addModal}`} onClick={e => e.stopPropagation()}>
            <div className={p.modalHeader}>
              <div>
                <h2 className={p.modalTitle}>Add Employee</h2>
                <span className={p.modalId}>Create a new employee account</span>
              </div>
              <button className={p.closeBtn} onClick={() => setShowAdd(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className={p.modalForm}>
              <div className={p.fieldGroup}>
                <label className={p.fieldLabel}>Full Name</label>
                <input type="text" placeholder="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={p.fieldInput} />
              </div>
              <div className={p.fieldGroup}>
                <label className={p.fieldLabel}>Email</label>
                <input type="email" placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={p.fieldInput} />
              </div>
              <div className={p.fieldGroup}>
                <label className={p.fieldLabel}>Phone</label>
                <input type="text" placeholder="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={p.fieldInput} />
              </div>
              <div className={p.fieldGroup}>
                <label className={p.fieldLabel}>Address</label>
                <input type="text" placeholder="Address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className={p.fieldInput} />
              </div>
              <div className={p.fieldGroup}>
                <label className={p.fieldLabel}>Password</label>
                <input type="password" placeholder="Password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className={p.fieldInput} />
              </div>
              <div className={p.fieldGroup}>
                <label className={p.fieldLabel}>Role</label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className={p.fieldSelect}>
                  <option value="technician">Technician</option>
                  <option value="collector">Collector</option>
                </select>
              </div>
            </div>
            {sucess_msg && <p className={p.successMsg}>{sucess_msg}</p>}
            {fail_msg && <p className={p.failMsg}>{fail_msg}</p>}
            <div className={p.modalFoot}>
              <button onClick={() => setShowAdd(false)} className={p.cancelBtn}>Cancel</button>
              <button className={p.submitBtn} onClick={submit}>Add Employee</button>
            </div>
          </div>
        </div>
      ) : null}

    </div>
  )
}
